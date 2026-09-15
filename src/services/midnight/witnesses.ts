import { Ledger } from "./managed/voting/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type VotingPrivateState = {
  readonly secretKey: Uint8Array;
  readonly selectedOption: bigint;
};

export const witnesses = {
  voterSecret: ({ privateState }: WitnessContext<Ledger, VotingPrivateState>): [VotingPrivateState, Uint8Array] => [
    privateState,
    privateState.secretKey,
  ],
  chosenOption: ({ privateState }: WitnessContext<Ledger, VotingPrivateState>): [VotingPrivateState, bigint] => [
    privateState,
    privateState.selectedOption,
  ],
};
