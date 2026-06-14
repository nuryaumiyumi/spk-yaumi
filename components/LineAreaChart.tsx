"use client";

import { useId } from "react";

export type TitikLine = { label: string; value: number; highlight?: boolean };

type Props = {
  data: TitikLine[];
  format?: (n: number) => string;
  warna?: string;
  tinggi?: number;
};

/** Grafik garis dengan area terisi (line area chart). */
export default function LineAreaChart({
  data,
  format = (n) => String(n),
  warna = "#34e36a",
  tinggi = 300,
}: Props) {
  const gid = useId();
  const n = data.length;
  const max = (Math.max(...data.map((d) => d.value), 0) || 1) * 1.12;
  const px = (i: number) => (n <= 1 ? 50 : (i / (n - 1)) * 100);
  const py = (v: number) => 100 - (v / max) * 100;
  const garis = data.map((d, i) => `${px(i)},${py(d.value)}`).join(" ");
  const area = `0,100 ${garis} 100,100`;

  return (
    <div>
      <div className="relative w-full" style={{ height: tinggi }}>
        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <div
            key={t}
            className="pointer-events-none absolute inset-x-0 border-t border-[var(--border)]/50"
            style={{ top: `${t * 100}%` }}
          />
        ))}

        {/* Area + garis (skala mengikuti lebar kontainer) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={warna} stopOpacity="0.35" />
              <stop offset="100%" stopColor={warna} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill={`url(#fill-${gid})`} />
          <polyline
            points={garis}
            fill="none"
            stroke={warna}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        {/* Titik */}
        {data.map((d, i) => (
          <span
            key={`${d.label}-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${px(i)}%`, top: `${py(d.value)}%` }}
          >
            <span
              className="block rounded-full ring-2 ring-[var(--surface)]"
              style={{
                height: d.highlight ? 12 : 8,
                width: d.highlight ? 12 : 8,
                background: d.highlight ? "#facc15" : warna,
              }}
            />
            {d.highlight && (
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white">
                {format(d.value)}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Label sumbu-x (dimiringkan agar tidak bertumpuk) */}
      <div className="relative mt-2 h-14">
        {data.map((d, i) => (
          <span
            key={`${d.label}-${i}`}
            className="absolute origin-top whitespace-nowrap text-[10px] text-[var(--text-muted)]"
            style={{ left: `${px(i)}%`, transform: "translateX(-50%) rotate(-30deg)" }}
          >
            {d.label.length > 14 ? `${d.label.slice(0, 13)}…` : d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
