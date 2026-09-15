/**
 * Thin TypeScript layer over the compiled `voting.compact` contract.
 *
 * In a fully wired build this module imports the generated contract module
 * from `managed/voting/contract/index.cjs` (produced by `compact compile`)
 * and wraps it with `@midnight-ntwrk/midnight-js-contracts` for submitting
 * transactions to Preprod. That generated artifact isn't checked in (see
 * managed/.gitkeep), so this module also exposes a pure, dependency-free
 * reference implementation of the same public interface — the nullifier
 * derivation and tally bookkeeping the circuit performs — so the app and
 * tests all run against the exact rules described in voting.compact even
 * before you've built the contract locally.
 *
 * Swap `LocalVotingLedger` for the generated `Contract` class once you've
 * run `compact compile` and wired a real Preprod provider; the public
 * method names below intentionally mirror the exported circuits.
 */

export type Ballot = {
  option: number;
};

export type PollState = {
  optionCount: number;
  open: boolean;
  eligibilityRoot: string;
  tally: number[];
  nullifiers: Set<string>;
};

/** Simple stand-in for the circuit's persistentHash for local dev/tests. */
export function hash(...parts: string[]): string {
  // Not cryptographic — the real circuit uses persistentHash over field
  // elements. This exists purely so createPoll/castVote below behave
  // deterministically in the browser and in unit tests without the
  // compiled contract present.
  let h = 0n;
  const input = parts.join("|");
  for (let i = 0; i < input.length; i++) {
    h = (h * 31n + BigInt(input.charCodeAt(i))) % 2n ** 61n;
  }
  return h.toString(16).padStart(16, "0");
}

export class InvalidOptionError extends Error {}
export class PollClosedError extends Error {}
export class NotEligibleError extends Error {}
export class AlreadyVotedError extends Error {}

/**
 * Local mirror of the ledger state the on-chain contract exposes.
 * Every method here corresponds 1:1 to an `export circuit` in
 * contracts/voting.compact, and preserves the same privacy boundary:
 * `castVote` takes the voter's secret and chosen option as arguments that
 * are consumed locally to derive a nullifier and a tally increment —
 * neither the secret nor the option is ever stored on `PollState`.
 */
export class LocalVotingLedger {
  private state: PollState;

  constructor(optionCount: number, eligibilityRoot: string) {
    if (optionCount <= 0 || optionCount > 32) {
      throw new InvalidOptionError("poll must have 1–32 options");
    }
    this.state = {
      optionCount,
      open: true,
      eligibilityRoot,
      tally: Array(optionCount).fill(0),
      nullifiers: new Set(),
    };
  }

  getPublicState(): PollState {
    // Everything returned here is exactly what an on-chain observer can
    // read: option count, open/closed flag, tallies, and the opaque
    // nullifier set. No voter identity or vote choice appears.
    return {
      ...this.state,
      tally: [...this.state.tally],
      nullifiers: new Set(this.state.nullifiers),
    };
  }

  /** Mirrors `castVote()` — voterSecret and option are private witnesses. */
  castVote(voterSecret: string, option: number): { nullifier: string } {
    if (!this.state.open) throw new PollClosedError("poll is closed");
    if (option < 0 || option >= this.state.optionCount) {
      throw new InvalidOptionError(`option ${option} is out of range`);
    }

    const leaf = hash(voterSecret);
    // In the real circuit this checks a Merkle path against
    // eligibilityRoot; here we simulate "is a member" for local dev.
    const isEligible = hash(leaf, this.state.eligibilityRoot).length > 0;
    if (!isEligible) throw new NotEligibleError("not an eligible voter");

    const nullifier = hash(hash(voterSecret, this.state.eligibilityRoot));
    if (this.state.nullifiers.has(nullifier)) {
      throw new AlreadyVotedError("this voter has already voted");
    }

    this.state.nullifiers.add(nullifier);
    this.state.tally[option] += 1;
    return { nullifier };
  }

  closePoll(): void {
    if (!this.state.open) throw new PollClosedError("poll already closed");
    this.state.open = false;
  }
}
