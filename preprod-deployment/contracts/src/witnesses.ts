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
    new Array(10).fill(new Uint8Array(32)),
  ],
  chosenOption: ({ privateState }: WitnessContext<Ledger, VotingPrivateState>): [VotingPrivateState, bigint] => [
    privateState,
    0n,
  ],
};
