"use client";

import { hitungSAW, dataKriteria } from "@/lib/saw";
import { useApp } from "@/components/AppProvider";
import PageHeader from "@/components/PageHeader";
import { HasilIcon } from "@/components/icons";

export default function HasilPage() {
  const { alternatif } = useApp();
  const hasil = hitungSAW(dataKriteria, alternatif);
  const terbaik = hasil[0];
  const top3 = hasil.slice(0, 3);

  const truncateName = (nama: string, maxLen = 14) =>
    nama.length > maxLen ? nama.substring(0, maxLen) + "..." : nama;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hasil Keputusan"
        subtitle={`Rekomendasi final pemilihan bibit cabai premium terbaik dari ${alternatif.length} alternatif`}
        Icon={HasilIcon}
      />

      {/* Podium */}
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-end gap-5 pt-2 sm:grid-cols-3">
        {/* Rank 2 */}
        {top3[1] && (
          <div className="order-2 text-center sm:order-1">
            <div className="glass-soft flex h-32 flex-col items-center justify-end rounded-b-none border-b-0 p-4">
              <span className="mb-2 text-4xl">🥈</span>
              <p className="text-sm font-semibold text-white">{truncateName(top3[1].alternatif.nama)}</p>
              <p className="text-xs text-[var(--text-muted)]">{(top3[1].totalSkor * 100).toFixed(1)}%</p>
            </div>
            <div className="rounded-b-xl bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] py-2">
              <p className="font-bold text-[#1e293b]">#2</p>
            </div>
          </div>
        )}

        {/* Rank 1 */}
        {terbaik && (
          <div className="order-1 text-center sm:order-2">
            <div className="flex h-44 flex-col items-center justify-end rounded-t-2xl border border-b-0 border-[rgba(250,204,21,0.35)] bg-gradient-to-t from-[rgba(250,204,21,0.10)] to-[rgba(250,204,21,0.22)] p-6 shadow-[0_0_40px_-14px_rgba(250,204,21,0.45)]">
              <span className="mb-2 text-6xl">👑</span>
              <p className="text-base font-bold text-white">{truncateName(terbaik.alternatif.nama, 16)}</p>
              <p className="text-sm font-bold text-[#facc15]">{(terbaik.totalSkor * 100).toFixed(2)}%</p>
            </div>
            <div className="rounded-b-xl bg-gradient-to-r from-[#facc15] to-[#eab308] py-3">
              <p className="text-xl font-extrabold text-[#3b2f00]">#1 TERBAIK</p>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {top3[2] && (
          <div className="order-3 text-center">
            <div className="glass-soft flex h-28 flex-col items-center justify-end rounded-b-none border-b-0 p-4">
              <span className="mb-2 text-4xl">🥉</span>
              <p className="text-sm font-semibold text-white">{truncateName(top3[2].alternatif.nama)}</p>
              <p className="text-xs text-[var(--text-muted)]">{(top3[2].totalSkor * 100).toFixed(1)}%</p>
            </div>
            <div className="rounded-b-xl bg-gradient-to-r from-[#fb923c] to-[#ea580c] py-2">
              <p className="font-bold text-[#3b1700]">#3</p>
            </div>
          </div>
        )}
      </div>

      {/* Full ranking */}
      <div className="glass overflow-hidden">
        <div className="head-bar px-6 py-5 sm:px-8">
          <h3 className="font-semibold text-white">📋 Perangkingan Lengkap ({alternatif.length} Alternatif)</h3>
        </div>
        <div>
          {hasil.map((item) => (
            <div key={item.alternatif.id} className="table-row-hover flex items-center gap-4 border-t border-[var(--border)] px-6 py-[18px] sm:px-8">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                  item.rangking === 1 ? "bg-[#facc15] text-[#3b2f00]"
                  : item.rangking === 2 ? "bg-[#cbd5e1] text-[#1e293b]"
                  : item.rangking === 3 ? "bg-[#fb923c] text-[#3b1700]"
                  : "bg-white/10 text-[var(--text-muted)]"
                }`}>
                  {item.rangking}
                </div>
                <span className="truncate font-medium text-white">{item.alternatif.nama}</span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10 sm:w-40">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#34e36a] to-[#16a34a]" style={{ width: `${item.totalSkor * 100}%` }} />
                </div>
                <span className="w-16 text-right font-bold text-[var(--neon)]">{(item.totalSkor * 100).toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
