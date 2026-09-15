import { useCallback, useMemo, useRef, useState } from "react";
import {
  LocalVotingLedger,
  hash,
  AlreadyVotedError,
  PollClosedError,
  NotEligibleError,
  InvalidOptionError,
} from "../lib/voting";

export type VoteStatus =
  | "idle"
  | "generating-proof"
  | "submitting"
  | "confirmed"
  | "error";

export type WalletStatus = "disconnected" | "connecting" | "connected";

export type PollOption = { id: number; label: string };

const OPTIONS: PollOption[] = [
  { id: 0, label: "Fund the community grant" },
  { id: 1, label: "Fund the security audit" },
  { id: 2, label: "Split evenly across both" },
];

const ROOT = hash("preprod-eligible-voters-root-v1");

export function useVotingPoll() {
  const ledgerRef = useRef(new LocalVotingLedger(OPTIONS.length, ROOT));
  const [tally, setTally] = useState<number[]>(
    ledgerRef.current.getPublicState().tally
  );
  const [ballotsCast, setBallotsCast] = useState(0);
  const [pollOpen, setPollOpen] = useState(true);
  const [wallet, setWallet] = useState<WalletStatus>("disconnected");
  const [status, setStatus] = useState<VoteStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [myNullifier, setMyNullifier] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const connectWallet = useCallback(async () => {
    setWallet("connecting");
    await new Promise((r) => setTimeout(r, 700));
    setWallet("connected");
  }, []);

  const castVote = useCallback(async () => {
    if (selected === null) {
      setError("Choose an option before casting your ballot.");
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("generating-proof");
    try {
      // Simulates local zero-knowledge proof generation time — in a real
      // build this is where @midnight-ntwrk/midnight-js-contracts builds
      // the proof from the witnesses (voterSecret, merklePath, chosenOption)
      // entirely on-device before anything is submitted.
      await new Promise((r) => setTimeout(r, 1400));
      setStatus("submitting");
      await new Promise((r) => setTimeout(r, 600));

      const voterSecret = `wallet-secret-${Math.random().toString(36).slice(2)}`;
      const { nullifier } = ledgerRef.current.castVote(voterSecret, selected);

      const next = ledgerRef.current.getPublicState();
      setTally(next.tally);
      setBallotsCast((n) => n + 1);
      setMyNullifier(nullifier);
      setStatus("confirmed");
    } catch (err) {
      if (err instanceof AlreadyVotedError) {
        setError("This wallet has already voted in this poll.");
      } else if (err instanceof PollClosedError) {
        setError("This poll is closed.");
      } else if (err instanceof NotEligibleError) {
        setError("This wallet isn't on the eligible-voter list.");
      } else if (err instanceof InvalidOptionError) {
        setError("That option isn't valid for this poll.");
      } else {
        setError("Something went wrong generating your proof. Try again.");
      }
      setStatus("error");
    }
  }, [selected]);

  const closePoll = useCallback(() => {
    ledgerRef.current.closePoll();
    setPollOpen(false);
  }, []);

  const totalVotes = useMemo(
    () => tally.reduce((a, b) => a + b, 0),
    [tally]
  );

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
    castVote,
    closePoll,
  };
}
