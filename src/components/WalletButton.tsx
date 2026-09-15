import { Wallet, Loader2, CircleCheck } from "lucide-react";
import type { WalletStatus } from "../hooks/useVotingPoll";

export function WalletButton({
  status,
  onConnect,
}: {
  status: WalletStatus;
  onConnect: () => void;
}) {
  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
        <CircleCheck className="h-4 w-4 text-[var(--violet)]" />
        <span className="font-mono">lace_a3f…9c2</span>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={status === "connecting"}
      className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:opacity-60"
    >
      {status === "connecting" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      {status === "connecting" ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
