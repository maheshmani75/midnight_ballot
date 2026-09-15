import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/voting/contract/index.js";
export * from "./witnesses.js";

import * as CompiledVotingContractTypes from "./managed/voting/contract/index.js";
import * as Witnesses from "./witnesses.js";

class ContractWrapper extends CompiledVotingContractTypes.Contract<any, any> {
  constructor() {
    super(Witnesses.witnesses);
  }
}

export const CompiledVotingContract = CompiledContract.make(
  "voting",
  ContractWrapper as any
).pipe(
  CompiledContract.withCompiledFileAssets("./managed/voting")
) as any;
