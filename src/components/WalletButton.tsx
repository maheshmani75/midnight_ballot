import { WalletStatus } from "../hooks/useVotingPoll";
import { Loader2, CircleCheck } from "lucide-react";

export function WalletButton({
  status,
  onConnect,
  onDisconnect,
}: {
  status: WalletStatus;
  onConnect: () => void;
  onDisconnect?: () => void;
}) {
  if (status === "connected") {
    return (
      <div 
        className="flex cursor-pointer select-none items-center gap-2 rounded-full border border-[var(--violet)] bg-[var(--violet)]/10 px-4 py-2 text-sm text-[var(--violet)] hover:bg-[var(--violet)]/20 transition-colors"
        onClick={onDisconnect}
        title="Disconnect wallet"
      >
        <CircleCheck className="h-4 w-4 text-[var(--violet)]" />
        <span className="font-mono">Connected (Click to disconnect)</span>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={status === "connecting"}
      className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
    >
      {status === "connecting" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting
        </>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
}
