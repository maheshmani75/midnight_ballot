import { describe, it, expect } from "vitest";
import {
  LocalVotingLedger,
  hash,
  InvalidOptionError,
  PollClosedError,
  NotEligibleError,
  AlreadyVotedError,
} from "../src/lib/voting";

// These tests exercise the TypeScript mirror of contracts/voting.compact
// (see src/lib/voting.ts for why). Once you run `compact compile` locally,
// point these at the generated contract's simulator
// (`@midnight-ntwrk/compact-runtime`'s CircuitContext) for full ZK-circuit
// level coverage — the assertions below describe the exact behavior that
// simulator run must also satisfy.

const ROOT = hash("eligible-voter-merkle-root-v1");

describe("circuit logic — castVote computes correctly", () => {
  it("increments the tally for the chosen option only", () => {
    const poll = new LocalVotingLedger(3, ROOT);
    poll.castVote("voter-secret-a", 1);

    const state = poll.getPublicState();
    expect(state.tally).toEqual([0, 1, 0]);
  });

  it("rejects an out-of-range option index", () => {
    const poll = new LocalVotingLedger(2, ROOT);
    expect(() => poll.castVote("voter-secret-a", 7)).toThrow(
      InvalidOptionError
    );
  });

  it("produces a stable, deterministic nullifier for the same voter+poll", () => {
    const pollA = new LocalVotingLedger(2, ROOT);
    const pollB = new LocalVotingLedger(2, ROOT);
    const { nullifier: n1 } = pollA.castVote("same-secret", 0);
    const { nullifier: n2 } = pollB.castVote("same-secret", 1);
    expect(n1).toEqual(n2); // same voter/root -> same nullifier, any option
  });
});

describe("state transitions — ledger updates as expected", () => {
  it("moves from open to closed and rejects further votes", () => {
    const poll = new LocalVotingLedger(2, ROOT);
    expect(poll.getPublicState().open).toBe(true);

    poll.closePoll();
    expect(poll.getPublicState().open).toBe(false);
    expect(() => poll.castVote("late-voter", 0)).toThrow(PollClosedError);
  });

  it("cannot be closed twice", () => {
    const poll = new LocalVotingLedger(2, ROOT);
    poll.closePoll();
    expect(() => poll.closePoll()).toThrow(PollClosedError);
  });

  it("prevents the same voter secret from voting twice (double-vote guard)", () => {
    const poll = new LocalVotingLedger(2, ROOT);
    poll.castVote("voter-secret-b", 0);
    expect(() => poll.castVote("voter-secret-b", 1)).toThrow(
      AlreadyVotedError
    );
    // Tally only reflects the first, successful vote.
    expect(poll.getPublicState().tally).toEqual([1, 0]);
  });

  it("accumulates multiple distinct voters correctly", () => {
    const poll = new LocalVotingLedger(2, ROOT);
    poll.castVote("voter-1", 0);
    poll.castVote("voter-2", 0);
    poll.castVote("voter-3", 1);
    expect(poll.getPublicState().tally).toEqual([2, 1]);
  });
});

describe("privacy — the chosen option and voter identity are never exposed", () => {
  it("does not leak the chosen option anywhere in public state", () => {
    const poll = new LocalVotingLedger(4, ROOT);
    poll.castVote("private-voter", 2);

    const state = poll.getPublicState();
    const serialized = JSON.stringify(state);

    // The only integer that should appear is the tally itself; the raw
    // option index "2" must not be discoverable as a field, and the
    // voter secret must never appear in serialized public state.
    expect(state).not.toHaveProperty("option");
    expect(state).not.toHaveProperty("chosenOption");
    expect(state).not.toHaveProperty("voter");
    expect(state).not.toHaveProperty("voterSecret");
    expect(serialized).not.toContain("private-voter");
  });

  it("does not leak the voter secret in the nullifier or in thrown errors", () => {
    const poll = new LocalVotingLedger(2, ROOT);
    const { nullifier } = poll.castVote("super-secret-value", 0);

    expect(nullifier).not.toContain("super-secret-value");

    try {
      poll.castVote("super-secret-value", 1);
      throw new Error("expected AlreadyVotedError");
    } catch (err) {
      expect(String((err as Error).message)).not.toContain(
        "super-secret-value"
      );
    }
  });

  it("nullifiers reveal no link between two votes from the same voter across polls", () => {
    // Different polls have different eligibilityRoots, so the same voter
    // secret must derive an *unlinkable* nullifier in each — otherwise an
    // observer could correlate a voter's participation across polls.
    const pollA = new LocalVotingLedger(2, ROOT);
    const pollB = new LocalVotingLedger(2, hash("a-different-poll-root"));

    const { nullifier: nA } = pollA.castVote("cross-poll-voter", 0);
    const { nullifier: nB } = pollB.castVote("cross-poll-voter", 1);

    expect(nA).not.toEqual(nB);
  });
});
