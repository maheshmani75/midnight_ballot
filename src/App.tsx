import { Moon, ShieldCheck, ExternalLink } from "lucide-react";
import { WalletButton } from "./components/WalletButton";
import { BallotCard } from "./components/BallotCard";
import { TallyBoard } from "./components/TallyBoard";
import { useVotingPoll } from "./hooks/useVotingPoll";
import { PrivacyExplainer } from "./components/PrivacyExplainer";
const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ?? "abc9f04d0ff71bec8e4347f63f0259c2bf68bbd49fd1fb8a18739081e22aab71";

function App() {
  const {
    options,
    tally,
    totalVotes,
    pollOpen,
    wallet,
    userAddress,
    status,
    error,
    myNullifier,
    selected,
    setSelected,
    connectWallet,
    disconnectWallet,
    castVote,
  } = useVotingPoll();

  return (
    <div className="min-h-screen bg-[var(--void)] text-white selection:bg-[var(--violet)]/30 font-sans">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Moon className="h-6 w-6 text-[var(--violet)]" />
          <span className="font-display text-xl font-medium tracking-wide">Midnight Ballot</span>
        </div>
        <WalletButton status={wallet} userAddress={userAddress} onConnect={connectWallet} onDisconnect={disconnectWallet} />
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-wide text-[var(--violet)]">
            Private voting · anonymous ballots, public tally
          </p>
          <h1 className="font-display mt-2 text-4xl leading-tight text-white sm:text-5xl">
            Every ballot is private.
            <br />
            Every count is provable.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/50">
            Cast your vote on the paper ballot below — it never leaves your
            device unencrypted. Watch the public tally update on the right,
            using nothing but a zero-knowledge proof and a one-time nullifier.
          </p>
        </div>

        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-stretch lg:justify-center">
          <BallotCard
            options={options}
            selected={selected}
            onSelect={setSelected}
            onCast={castVote}
            status={status}
            error={error}
            wallet={wallet}
            pollOpen={pollOpen}
            myNullifier={myNullifier}
          />
          <TallyBoard
            options={options}
            tally={tally}
            totalVotes={totalVotes}
            pollOpen={pollOpen}
          />
        </div>

        <PrivacyExplainer />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Contract (Preprod):{" "}
            <span className="font-mono text-white/60">{CONTRACT_ADDRESS}</span>
          </p>
          <a
            href="https://docs.midnight.network"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-white/50 hover:text-white"
          >
            Midnight docs <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
