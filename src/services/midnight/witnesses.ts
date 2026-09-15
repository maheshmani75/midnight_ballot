import { Ledger } from "./managed/voting/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type VotingPrivateState = {
  readonly secretKey: Uint8Array;
};

export const witnesses = {
  voterSecret: ({ privateState }: WitnessContext<Ledger, VotingPrivateState>): [VotingPrivateState, Uint8Array] => [
    privateState,
    privateState.secretKey,
  ],
  merklePath: ({ privateState }: WitnessContext<Ledger, VotingPrivateState>): [VotingPrivateState, any] => [
    privateState,
    new Array(5).fill(new Uint8Array(32)),
  ],
  pathDirections: ({ privateState }: WitnessContext<Ledger, VotingPrivateState>): [VotingPrivateState, any] => [
    privateState,
    new Array(5).fill(false),
  ],
  chosenOption: ({ privateState }: WitnessContext<Ledger, VotingPrivateState>): [VotingPrivateState, bigint] => [
    privateState,
    0n,
  ],
};
