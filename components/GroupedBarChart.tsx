"use client";

export type Seri = { nama: string; warna: string; nilai: number[] };

type Props = {
  kategori: string[];
  seri: Seri[];
  format?: (n: number) => string;
  tinggi?: number;
};

/** Grafik batang berkelompok (double bar) — beberapa seri per kategori. */
export default function GroupedBarChart({
  kategori,
  seri,
  format = (n) => String(n),
  tinggi = 260,
}: Props) {
  const max = Math.max(...seri.flatMap((s) => s.nilai), 0) || 1;

  return (
    <div>
      {/* Legenda */}
      <div className="mb-5 flex flex-wrap gap-4">
        {seri.map((s) => (
          <span key={s.nama} className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="h-3 w-3 rounded-sm" style={{ background: s.warna }} />
            {s.nama}
          </span>
        ))}
      </div>

      {/* Area plot */}
      <div className="relative" style={{ height: tinggi }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <div
            key={t}
            className="pointer-events-none absolute inset-x-0 border-t border-[var(--border)]/50"
            style={{ top: `${(1 - t) * 100}%` }}
          />
        ))}

        <div className="absolute inset-0 flex items-end justify-around gap-3">
          {kategori.map((cat, ci) => (
            <div key={cat} className="flex h-full flex-1 items-end justify-center gap-2">
              {seri.map((s) => {
                const h = Math.max(2, (s.nilai[ci] / max) * 100);
                return (
                  <div key={s.nama} className="relative h-full w-full max-w-[2.75rem]">
                    <div
                      className="absolute bottom-0 w-full rounded-t-md transition-[height] duration-700 ease-out"
                      style={{ height: `${h}%`, background: s.warna }}
                    />
                    <span
                      className="absolute w-full -translate-y-1 text-center text-[10px] tabular-nums text-[var(--text-muted)]"
                      style={{ bottom: `${h}%` }}
                    >
                      {format(s.nilai[ci])}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Label kategori */}
      <div className="mt-2 flex justify-around gap-3">
        {kategori.map((cat) => (
          <div key={cat} className="flex-1 text-center text-xs font-medium text-white">
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
