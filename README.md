# Midnight Ballot

![CI](https://github.com/maheshmani75/midnight_ballot/actions/workflows/ci.yml/badge.svg)

> Anonymous ballots, publicly verifiable tallies — private voting on Midnight.

## Live Demo
[PASTE YOUR DEPLOYED LIVE URL HERE]

## Contract Address

| Network | Address |
|---------|---------|
| Preprod | `abc9f04d0ff71bec8e4347f63f0259c2bf68bbd49fd1fb8a18739081e22aab71` |

## What This Does

Midnight Ballot lets anyone vote on a fixed set of options without revealing
*which* option they chose or linking their identity to their ballot, while
still producing a tally anyone can independently verify by reading the
public ledger.

- A voter proves membership in an eligibility set (a Merkle tree of
  registered voters) without revealing which leaf is theirs.
- A per-poll **nullifier**, derived from the voter's private secret, is
  published to stop double voting — without revealing the voter's identity
  or linking their votes across different polls.
- The chosen option is used **only inside the zero-knowledge circuit** to
  increment the matching public counter; it's never written to the ledger
  or emitted in any event.

## Privacy Model

- **PUBLIC:** the poll's option count and open/closed state, the running
  per-option tally, and the set of spent nullifiers.
- **PRIVATE:** the voter's identity, their eligibility secret, their Merkle
  path, and which option they selected.
- **PROVED without revealing:** that a registered, not-yet-voted voter cast
  exactly one valid ballot for a valid option — without disclosing which
  voter or which option to anyone, including the poll creator.

## Privacy Claim

**An on-chain observer can see:**
- The running tally per option, at any point in time
- The total number of ballots cast so far
- A set of opaque nullifiers with no identifying structure

**An on-chain observer cannot see:**
- Which wallet cast any specific ballot
- Which option any individual voter chose
- Any link between two ballots cast by the same voter in *different* polls
  (nullifiers are derived per-poll, so they don't correlate across polls)

## Tech Stack

- **Contract:** Compact (`contracts/voting.compact`), compiled with `compactc`
- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS v4
- **Charts:** Recharts (live public tally)
- **Icons:** lucide-react
- **Testing:** Vitest
- **Chain SDK:** `@midnight-ntwrk/*` packages for Preprod wallet connection
  and contract calls

## Prerequisites

- Node.js v22+
- npm
- [Compact compiler](https://docs.midnight.network) (`compactc`) installed
  and on your `PATH`
- Lace wallet (or another Midnight-compatible wallet) configured for Preprod

## Setup & Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Compile the contract (generates managed/voting/, gitignored)
compact compile contracts/voting.compact managed/voting

# 3. Point the frontend at your deployed Preprod contract
cp .env.example .env
# then edit .env and set VITE_CONTRACT_ADDRESS

# 4. Run the app
npm run dev
```

## Run Tests

```
npm test
```

10 tests covering circuit logic, ledger state transitions, and the privacy
guarantee (the chosen option and voter secret never surface in public state,
errors, or nullifiers). See `tests/voting.test.ts`.

## CI/CD

`.github/workflows/ci.yml` runs on every push and pull request to `main`:

1. Checks out the repo and installs Node.js v22
2. Runs `npm install`
3. Installs the Compact compiler and runs `compact compile` against
   `contracts/voting.compact`
4. Runs the full test suite (`npm test`)
5. Builds the production bundle (`npm run build`) to catch build regressions

The badge at the top of this README reflects the status of the most recent
run on `main`.

## Product Proposal

See [PROPOSAL.md](./PROPOSAL.md).
