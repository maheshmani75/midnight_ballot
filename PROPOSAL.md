# Product Proposal

## What is the product, and who uses it?
Midnight Ballot is a decentralized, zero-knowledge voting platform that enables publicly verifiable tallies while maintaining complete voter anonymity. It is designed for DAOs, corporate boards, community organizations, and credentialed groups that need to conduct binding elections or gauge sentiment without risking voter coercion or retaliation.

## Why Midnight specifically?
A transparent chain (like Ethereum or Cardano) exposes every voter's identity and their specific choices on the public ledger, making anonymous voting impossible without complex off-chain cryptographic setups. Midnight's native zero-knowledge capabilities allow voters to generate client-side proofs of eligibility (via a Merkle tree) and submit their choice entirely shielded. Only the aggregate tally and cryptographic nullifiers are public, preventing double-voting while keeping the individual ballot entirely private.

## Data Model
| Data Point | Type | Disclosed To |
|---|---|---|
| Total Ballot Count | Public ledger | Everyone |
| Aggregate Vote Tally | Public ledger | Everyone |
| Spent Nullifiers (prevent double voting) | Public ledger | Everyone |
| Voter's Identity (Wallet Address) | Private witness | No one |
| Voter's Chosen Option | Private witness | No one |
| Voter's Eligibility Secret & Merkle Path | Private witness | No one |

## Mainnet Feasibility
Yes, it is highly feasible to reach Mainnet by Level 6. The core zero-knowledge circuit for eligibility verification and nullifier generation is already implemented in Compact and rigorously tested with 100% coverage. The frontend successfully balances and submits transactions via the 1AM Wallet. To be fully Mainnet-ready, the product primarily needs an administrative panel for creating new polls, a dynamic mechanism for ongoing voter registration, and UI polish.
