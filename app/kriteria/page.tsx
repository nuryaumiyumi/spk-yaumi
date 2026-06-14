"use client";

import { dataKriteria } from "@/lib/saw";
import PageHeader from "@/components/PageHeader";
import { CriteriaIcon, InfoIcon } from "@/components/icons";

export default function KriteriaPage() {
  const totalBobot = dataKriteria.reduce((sum, k) => sum + k.bobot, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Kriteria Penilaian"
        subtitle={`${dataKriteria.length} kriteria utama dengan bobot yang telah ditentukan`}
        Icon={CriteriaIcon}
      />

      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="head-bar text-left text-xs uppercase tracking-wider text-[var(--text-dim)]">
                <th className="px-6 py-4 font-semibold">No</th>
                <th className="px-6 py-4 font-semibold">Kriteria</th>
                <th className="px-6 py-4 font-semibold">Bobot</th>
                <th className="px-6 py-4 font-semibold">Jenis</th>
              </tr>
            </thead>
            <tbody>
              {dataKriteria.map((kriteria, index) => (
                <tr key={kriteria.id} className="table-row-hover border-t border-[var(--border)]">
                  <td className="px-6 py-4 font-medium text-[var(--text-dim)]">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-white">{kriteria.nama}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-12 font-bold text-[var(--neon)]">{Math.round(kriteria.bobot * 100)}%</span>
                      <div className="h-2 max-w-[180px] flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#34e36a] to-[#16a34a]"
                          style={{ width: `${kriteria.bobot * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                        kriteria.jenis === "benefit"
                          ? "bg-[rgba(46,232,95,0.12)] text-[#4ade80] ring-[rgba(46,232,95,0.3)]"
                          : "bg-[rgba(244,63,94,0.12)] text-[#fb7185] ring-[rgba(244,63,94,0.3)]"
                      }`}
                    >
                      {kriteria.jenis === "benefit" ? "▲ Benefit" : "▼ Cost"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[var(--border)] bg-white/[0.015]">
                <td colSpan={2} className="px-6 py-4 font-semibold text-white">Total Bobot</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 font-bold text-[var(--neon)]">{Math.round(totalBobot * 100)}%</span>
                    <div className="h-2 max-w-[180px] flex-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#34e36a] to-[#16a34a]" />
                    </div>
                  </div>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="glass-soft flex items-start gap-4 border-l-2 border-[var(--neon)] p-6">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[rgba(46,232,95,0.12)] text-[var(--neon)]">
          <InfoIcon width={18} height={18} />
        </span>
        <div>
          <p className="mb-1 font-semibold text-white">Informasi Penting</p>
          <p className="text-sm text-[var(--text-muted)]">
            <strong className="text-[#4ade80]">Benefit (▲)</strong> = semakin besar nilai, semakin baik.
            <strong className="ml-2 text-[#fb7185]">Cost (▼)</strong> = semakin kecil nilai, semakin baik.
          </p>
        </div>
      </div>
    </div>
  );
}
