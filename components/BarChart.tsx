"use client";

export type BarDatum = {
  label: string;
  value: number;
  color?: string; // CSS color / gradient untuk isi bar
  highlight?: boolean;
  badge?: string; // teks kecil setelah nilai, mis. "🏆"
};

type Props = {
  data: BarDatum[];
  max?: number;
  format?: (n: number) => string;
  labelWidth?: string;
};

export default function BarChart({
  data,
  max,
  format = (n) => String(n),
  labelWidth = "w-32 sm:w-44",
}: Props) {
  const puncak = max ?? Math.max(...data.map((d) => d.value), 0);

  return (
    <div className="space-y-2.5">
      {data.map((d, i) => {
        const pct = puncak > 0 ? Math.max(2, (d.value / puncak) * 100) : 0;
        return (
          <div key={`${d.label}-${i}`} className="flex items-center gap-3">
            <div
              className={`${labelWidth} shrink-0 truncate text-sm ${
                d.highlight ? "font-semibold text-white" : "text-[var(--text-muted)]"
              }`}
              title={d.label}
            >
              {d.label}
            </div>
            <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-white/[0.04] ring-1 ring-[var(--border)]">
              <div
                className="h-full rounded-lg transition-[width] duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: d.color ?? "linear-gradient(90deg,#34e36a,#16a34a)",
                }}
              />
            </div>
            <div
              className={`w-20 shrink-0 text-right text-sm tabular-nums ${
                d.highlight ? "font-bold text-[var(--neon)]" : "text-[var(--text-muted)]"
              }`}
            >
              {format(d.value)}
              {d.badge ? ` ${d.badge}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
