import { Moon, ShieldCheck, ExternalLink } from "lucide-react";
import { WalletButton } from "./components/WalletButton";
import { BallotCard } from "./components/BallotCard";
import { TallyBoard } from "./components/TallyBoard";
import { useVotingPoll } from "./hooks/useVotingPoll";

const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ?? "abc9f04d0ff71bec8e4347f63f0259c2bf68bbd49fd1fb8a18739081e22aab71";

function App() {
  const {
    options,
    tally,
    totalVotes,
    wallet,
    status,
    error,
    myNullifier,
    selected,
    setSelected,
    connectWallet,
    disconnectWallet,
    castVote,
    pollOpen,
  } = useVotingPoll();

  return (
    <div className="min-h-full bg-[var(--dusk)]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-white">
          <Moon className="h-5 w-5 text-[var(--violet)]" />
          <span className="font-display text-lg">Midnight Ballot</span>
        </div>
        <WalletButton status={wallet} onConnect={connectWallet} onDisconnect={disconnectWallet} />
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

        <div className="mx-auto mt-16 max-w-2xl rounded-[2px] border border-white/10 bg-white/[0.03] p-6">
          <p className="flex items-center gap-2 text-sm font-medium text-white">
            <ShieldCheck className="h-4 w-4 text-[var(--violet)]" />
            Privacy claim
          </p>
          <div className="mt-4 grid gap-4 text-sm text-white/60 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/30">
                An observer can see
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>The running tally per option</li>
                <li>How many ballots have been cast</li>
                <li>A set of opaque, unlinkable nullifiers</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/30">
                An observer cannot see
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Which wallet cast which ballot</li>
                <li>Which option any individual chose</li>
                <li>Any link between two ballots from one voter</li>
              </ul>
            </div>
          </div>
        </div>
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
