import { ShieldCheck } from "lucide-react";

export function PrivacyExplainer() {
  return (
    <div className="mx-auto mt-16 max-w-2xl rounded-[2px] border border-white/10 bg-white/[0.03] p-6">
      <p className="flex items-center gap-2 text-sm font-medium text-white">
        <ShieldCheck className="h-4 w-4 text-[var(--violet)]" />
        Privacy Explainer
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
      <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/40">
        <p>
          Zero-Knowledge Execution: The ballot choice and eligibility secret are evaluated strictly within a client-side zk-SNARK circuit. Only the resulting cryptographic proof and public nullifier are transmitted to the network.
        </p>
      </div>
    </div>
  );
}
