import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Radio } from "lucide-react";
import type { PollOption } from "../hooks/useVotingPoll";

export function TallyBoard({
  options,
  tally,
  totalVotes,
  pollOpen,
}: {
  options: PollOption[];
  tally: number[];
  totalVotes: number;
  pollOpen: boolean;
}) {
  const data = options.map((opt, i) => ({
    name: opt.label,
    short: opt.label.split(" ").slice(0, 2).join(" "),
    votes: tally[i],
  }));

  return (
    <div className="w-full max-w-md rounded-[2px] border border-white/10 bg-[var(--dusk-2)] p-8 text-white">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs tracking-wide text-[var(--violet)]">
            <Radio className="h-3.5 w-3.5" />
            {pollOpen ? "Live public tally" : "Final tally"}
          </p>
          <h2 className="font-display text-2xl">
            {totalVotes} ballot{totalVotes === 1 ? "" : "s"} cast
          </h2>
        </div>
        <span className="font-mono text-[11px] text-white/40">preprod-1</span>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12 }}>
            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="short"
              width={110}
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="votes" fill="var(--violet)" radius={[0, 3, 3, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 font-mono">
        {data.map((d, i) => (
          <div key={i}>
            <p className="text-2xl font-bold text-white">{d.votes}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-white/40">{d.name}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-white/40">
        Anyone can recompute this tally directly from the ledger. What they can't
        do is match any single ballot to a wallet — every vote only ever adds an
        opaque, one-time nullifier and a +1 to a counter.
      </p>
    </div>
  );
}
