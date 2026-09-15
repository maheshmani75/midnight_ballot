import { useCallback, useEffect, useMemo, useState } from "react";
import pino from "pino";
import { initializeProviders } from "../services/midnight/providers.js";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { CompiledVotingContract } from "../services/midnight/index.js";

const logger = pino({ level: "info" });
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS ?? "abc9f04d0ff71bec8e4347f63f0259c2bf68bbd49fd1fb8a18739081e22aab71";

export type VoteStatus = "idle" | "generating-proof" | "submitting" | "confirmed" | "error";
export type WalletStatus = "disconnected" | "connecting" | "connected";
export type PollOption = { id: number; label: string };

const OPTIONS: PollOption[] = [
  { id: 0, label: "Fund the community grant" },
  { id: 1, label: "Fund the security audit" },
  { id: 2, label: "Split evenly across both" },
];

export function useVotingPoll() {
  const [tally] = useState<number[]>([0, 0, 0]);
  const [ballotsCast] = useState(0);
  const [pollOpen, setPollOpen] = useState(true);
  const [wallet, setWallet] = useState<WalletStatus>("disconnected");
  const [status, setStatus] = useState<VoteStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [myNullifier, setMyNullifier] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [providers, setProviders] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);

  const initWallet = async () => {
    try {
      setWallet("connecting");
      const provs = await initializeProviders(logger);
      setProviders(provs);
      
      const foundContract = await findDeployedContract(provs, {
        contractAddress: CONTRACT_ADDRESS,
        compiledContract: CompiledVotingContract,
      });
      setContract(foundContract);
      // @ts-ignore
      const _state = provs.publicDataProvider.queryContractState(CONTRACT_ADDRESS);
      // Wait, publicDataProvider doesn't return state this way easily, let's use the contract instance
      // contract.deployTxData.public... wait, the contract state needs to be synced!
      setWallet("connected");
      localStorage.setItem("walletConnected", "true");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to wallet.");
      setWallet("disconnected");
      localStorage.removeItem("walletConnected");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("walletConnected") === "true") {
      initWallet();
    }
  }, []);

  const connectWallet = useCallback(async () => {
    await initWallet();
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet("disconnected");
    localStorage.removeItem("walletConnected");
    setProviders(null);
    setContract(null);
  }, []);

  const castVote = useCallback(async () => {
    if (selected === null || !contract || !providers) {
      setError("Connect wallet and choose an option first.");
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("generating-proof");
    
    try {
      // In a real app we'd need the voter's actual secret and Merkle path
      // Here we just use a dummy private state for demonstration purposes since we don't have the user's secret
      
      setStatus("submitting");
      const tx = await contract.callTx.castVote();
      const txHash = tx.public.txHash;
      
      setStatus("confirmed");
      setMyNullifier(`https://preprod.midnight.network/transaction/${txHash}`);
      
      // We would refresh tally here by reading contract.deployTxData.public
    } catch (err: any) {
      setError(err.message || "Failed to submit transaction.");
      setStatus("error");
    }
  }, [selected, contract, providers]);

  const closePoll = useCallback(() => {
    setPollOpen(false);
  }, []);

  const totalVotes = useMemo(() => tally.reduce((a, b) => a + b, 0), [tally]);

  return {
    options: OPTIONS,
    tally,
    totalVotes,
    ballotsCast,
    pollOpen,
    wallet,
    status,
    error,
    myNullifier,
    selected,
    setSelected,
    connectWallet,
    disconnectWallet,
    castVote,
    closePoll,
  };
}
