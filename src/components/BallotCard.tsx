import { Fingerprint, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import type { PollOption, VoteStatus, WalletStatus } from "../hooks/useVotingPoll";

export function BallotCard({
  options,
  selected,
  onSelect,
  onCast,
  status,
  error,
  wallet,
  pollOpen,
  myNullifier,
}: {
  options: PollOption[];
  selected: number | null;
  onSelect: (id: number) => void;
  onCast: () => void;
  status: VoteStatus;
  error: string | null;
  wallet: WalletStatus;
  pollOpen: boolean;
  myNullifier: string | null;
}) {
  const busy = status === "generating-proof" || status === "submitting";
  const disabled = busy || wallet !== "connected" || !pollOpen;

  return (
    <div
      className="relative w-full max-w-md rounded-[2px] p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
      style={{
        background: "var(--paper)",
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, var(--paper-line) 28px)",
        color: "var(--ink)",
      }}
    >
      <div className="mb-6 flex items-start justify-between border-b border-[var(--paper-line)] pb-4">
        <div>
          <p className="text-xs tracking-wide text-[var(--seal)]">Official ballot · Preprod</p>
          <h2 className="font-display text-2xl leading-tight">
            Where should the treasury grant go?
          </h2>
        </div>
        <div
          aria-hidden
          className="flex h-11 w-11 shrink-0 rotate-6 items-center justify-center rounded-full border-2 text-[10px] font-bold uppercase tracking-tight"
          style={{ borderColor: "var(--seal)", color: "var(--seal)" }}
        >
          sealed
        </div>
      </div>

      <fieldset className="space-y-3" disabled={disabled}>
        <legend className="sr-only">Choose one option</legend>
        {options.map((opt) => {
          const active = selected === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 transition ${
                active
                  ? "border-[var(--seal)] bg-[var(--seal)]/10"
                  : "border-[var(--paper-line)] hover:border-[var(--seal)]/60"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="ballot-option"
                className="h-4 w-4 accent-[var(--seal)]"
                checked={active}
                onChange={() => onSelect(opt.id)}
              />
              <span className="text-[15px]">{opt.label}</span>
            </label>
          );
        })}
      </fieldset>

      <div className="mt-5 flex items-start gap-2 text-xs text-[var(--ink)]/60">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          Your selection is used only inside your device's proof. It's never sent
          to us, never written on-chain, and no one — including the poll creator —
          can see who you voted for.
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-sm border border-red-800/30 bg-red-900/5 px-3 py-2 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {status === "confirmed" && myNullifier && (
        <div className="mt-4 rounded-sm border border-emerald-800/30 bg-emerald-900/5 px-3 py-3 text-sm text-emerald-900">
          <p className="font-medium">Ballot recorded — thank you.</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-900/70">
            <Fingerprint className="h-3.5 w-3.5" />
            <a href={myNullifier} target="_blank" rel="noreferrer" className="font-mono hover:underline text-emerald-700">
              View transaction on Explorer
            </a>
          </p>
        </div>
      )}

      <button
        onClick={onCast}
        disabled={disabled || status === "confirmed"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm py-3 text-sm font-semibold uppercase tracking-wide text-[var(--paper)] transition disabled:cursor-not-allowed disabled:opacity-50"
        style={{ background: "var(--ink)" }}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "generating-proof"
          ? "Generating proof…"
          : status === "submitting"
            ? "Submitting to Preprod…"
            : status === "confirmed"
              ? "Ballot cast"
              : wallet !== "connected"
                ? "Connect wallet to vote"
                : !pollOpen
                  ? "Poll closed"
                  : "Cast private ballot"}
      </button>
    </div>
  );
}
