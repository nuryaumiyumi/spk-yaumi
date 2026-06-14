"use client";

import { hitungSAW, dataKriteria } from "@/lib/saw";
import { useApp } from "@/components/AppProvider";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { PerhitunganIcon, HasilIcon, ChevronDownIcon } from "@/components/icons";

export default function PerhitunganPage() {
  const { alternatif } = useApp();
  const [showDetail, setShowDetail] = useState(false);
  const hasil = hitungSAW(dataKriteria, alternatif);

  const rankBadge = (r: number) =>
    r === 1 ? "bg-gradient-to-br from-[#facc15] to-[#eab308] text-[#3b2f00]"
    : r === 2 ? "bg-gradient-to-br from-[#cbd5e1] to-[#94a3b8] text-[#1e293b]"
    : r === 3 ? "bg-gradient-to-br from-[#fb923c] to-[#ea580c] text-[#3b1700]"
    : "bg-gradient-to-br from-[#34e36a] to-[#16a34a] text-[#042b13]";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Perhitungan SAW"
        subtitle="Proses perhitungan menggunakan metode Simple Additive Weighting"
        Icon={PerhitunganIcon}
      />

      <button
        onClick={() => setShowDetail(!showDetail)}
        className="btn-ghost inline-flex w-fit items-center gap-2 px-5 py-3 text-sm font-semibold text-white"
      >
        <ChevronDownIcon
          width={18}
          height={18}
          className={`transition-transform ${showDetail ? "rotate-180" : ""}`}
        />
        {showDetail ? "Sembunyikan Detail" : "Tampilkan Detail Perhitungan"}
      </button>

      {showDetail && (
        <div className="glass animate-fadeIn overflow-hidden">
          <div className="head-bar flex items-center gap-2 px-6 py-5 sm:px-8">
            <span className="h-2 w-2 rounded-full bg-[var(--neon)]" />
            <h2 className="font-semibold text-white">Matriks Normalisasi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--text-dim)]">
                  <th className="px-6 py-4 text-left font-semibold">Alternatif</th>
                  {dataKriteria.map((k) => (
                    <th key={k.id} className="px-6 py-4 text-center font-semibold">{k.singkat}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alternatif.map((a) => {
                  const normalizedValues = dataKriteria.map((k) => {
                    const allValues = alternatif.map((alt) => alt.nilai[k.id]);
                    const maxVal = Math.max(...allValues);
                    const minVal = Math.min(...allValues);
                    return k.jenis === "benefit"
                      ? (a.nilai[k.id] / maxVal).toFixed(3)
                      : (minVal / a.nilai[k.id]).toFixed(3);
                  });
                  return (
                    <tr key={a.id} className="table-row-hover border-t border-[var(--border)]">
                      <td className="px-6 py-3.5 font-medium text-white">{a.nama}</td>
                      {normalizedValues.map((val, idx) => (
                        <td key={idx} className="px-6 py-3.5 text-center font-mono text-[var(--text-muted)]">{val}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ranking */}
      <div className="glass overflow-hidden">
        <div className="head-bar flex items-center gap-3 px-6 py-5 sm:px-8">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#34e36a] to-[#16a34a] text-[#042b13]">
            <HasilIcon width={20} height={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Hasil Perangkingan</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Berdasarkan perhitungan metode SAW dari {alternatif.length} alternatif
            </p>
          </div>
        </div>

        <div>
          {hasil.map((item) => (
            <div key={item.alternatif.id} className="table-row-hover border-t border-[var(--border)] px-6 py-5 sm:px-8">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-extrabold shadow-lg ${rankBadge(item.rangking)}`}>
                    {item.rangking}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-white">{item.alternatif.nama}</h3>
                    <p className="text-sm text-[var(--text-dim)]">Skor: {item.totalSkor.toFixed(4)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-5">
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-gradient-green">{(item.totalSkor * 100).toFixed(2)}%</p>
                    <div className="mt-1 h-2 w-40 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#34e36a] to-[#16a34a]"
                        style={{ width: `${item.totalSkor * 100}%` }}
                      />
                    </div>
                  </div>
                  {item.rangking === 1 && (
                    <span className="rounded-full bg-[rgba(250,204,21,0.14)] px-4 py-2 text-sm font-bold text-[#facc15] ring-1 ring-[rgba(250,204,21,0.35)]">
                      🏆 REKOMENDASI TERBAIK
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
