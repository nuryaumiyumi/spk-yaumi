"use client";

import { hitungSAW } from "@/lib/saw";
import { useApp } from "@/components/AppProvider";
import PageHeader from "@/components/PageHeader";
import { LaporanIcon, PrintIcon, DownloadIcon } from "@/components/icons";

export default function LaporanPage() {
  const { alternatif, kriteria, loading } = useApp();
  const hasil = hitungSAW(kriteria, alternatif);

  const handlePrint = () => window.print();

  const handleExport = () => {
    let content = "LAPORAN SPK CABAI PREMIUM\n";
    content += "================================\n\n";
    content += "Tanggal: " + new Date().toLocaleDateString("id-ID") + "\n\n";
    content += "HASIL PERANGKINGAN:\n";
    hasil.forEach((item) => {
      content += `${item.rangking}. ${item.alternatif.nama} - ${(item.totalSkor * 100).toFixed(2)}%\n`;
    });
    content += `\nRekomendasi Terbaik: ${hasil[0]?.alternatif.nama || "-"}\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_spk_cabai_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[rgba(46,232,95,0.2)] border-t-[var(--neon)]" />
      </div>
    );
  }

  if (alternatif.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Laporan Hasil Keputusan"
          subtitle="Laporan lengkap hasil pemilihan bibit cabai premium"
          Icon={LaporanIcon}
        />
        <div className="glass p-12 text-center text-[var(--text-dim)]">
          Belum ada data alternatif. Tambahkan data terlebih dahulu pada menu Alternatif.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Laporan Hasil Keputusan"
        subtitle="Laporan lengkap hasil pemilihan bibit cabai premium"
        Icon={LaporanIcon}
      />

      <div className="flex flex-wrap gap-3.5 print:hidden">
        <button onClick={handlePrint} className="btn-ghost inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white">
          <PrintIcon width={17} height={17} /> Cetak Laporan
        </button>
        <button onClick={handleExport} className="btn-neon inline-flex items-center gap-2 px-5 py-2.5 text-sm">
          <DownloadIcon width={17} height={17} /> Export TXT
        </button>
      </div>

      <div className="glass p-7 sm:p-10 print:bg-white print:text-black print:shadow-none">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold text-white print:text-black">SPK CABAI PREMIUM</h2>
          <p className="mt-2 text-[var(--text-muted)] print:text-gray-600">
            Sistem Pendukung Keputusan Pemilihan Bibit Cabai Premium
          </p>
          <p className="mt-2 text-sm text-[var(--text-dim)] print:text-gray-500">
            Tanggal: {new Date().toLocaleDateString("id-ID")}
          </p>
          <div className="mt-5 border-t border-[var(--border)]" />
        </div>

        <div className="mb-10">
          <h3 className="mb-4 text-lg font-semibold text-white print:text-black">A. Kriteria Penilaian</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-[var(--text-dim)] print:text-gray-600">
                  <th className="px-3 py-3 font-semibold">No</th>
                  <th className="px-3 py-3 font-semibold">Kriteria</th>
                  <th className="px-3 py-3 font-semibold">Bobot</th>
                  <th className="px-3 py-3 font-semibold">Jenis</th>
                </tr>
              </thead>
              <tbody>
                {kriteria.map((k, i) => (
                  <tr key={k.id} className="border-b border-[var(--border)] text-[var(--text-muted)] print:text-black">
                    <td className="px-3 py-3">{i + 1}</td>
                    <td className="px-3 py-3">{k.nama}</td>
                    <td className="px-3 py-3">{Math.round(k.bobot * 100)}%</td>
                    <td className="px-3 py-3">{k.jenis === "benefit" ? "Benefit ↑" : "Cost ↓"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="mb-4 text-lg font-semibold text-white print:text-black">B. Hasil Perangkingan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-[var(--text-dim)] print:text-gray-600">
                  <th className="px-3 py-3 font-semibold">Rangking</th>
                  <th className="px-3 py-3 font-semibold">Nama Bibit</th>
                  <th className="px-3 py-3 font-semibold">Skor Akhir</th>
                </tr>
              </thead>
              <tbody>
                {hasil.map((item) => (
                  <tr key={item.alternatif.id} className="border-b border-[var(--border)] text-[var(--text-muted)] print:text-black">
                    <td className="px-3 py-3 font-semibold text-white print:text-black">{item.rangking}</td>
                    <td className="px-3 py-3">{item.alternatif.nama}</td>
                    <td className="px-3 py-3 font-semibold text-[var(--neon)] print:text-emerald-700">{(item.totalSkor * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border-l-2 border-[var(--neon)] bg-[rgba(46,232,95,0.08)] p-5 print:bg-emerald-50">
          <h4 className="mb-2 font-semibold text-white print:text-emerald-900">📋 Kesimpulan</h4>
          <p className="text-[var(--text-muted)] print:text-emerald-800">
            Berdasarkan perhitungan menggunakan metode <strong className="text-white print:text-black">Simple Additive Weighting (SAW)</strong>,
            bibit cabai premium terbaik yang direkomendasikan adalah{" "}
            <strong className="text-[var(--neon)] print:text-emerald-900">{hasil[0]?.alternatif.nama ?? "-"}</strong>{" "}
            dengan skor akhir <strong className="text-white print:text-black">{((hasil[0]?.totalSkor ?? 0) * 100).toFixed(2)}%</strong>.
          </p>
        </div>

        <div className="mt-10 text-center text-sm text-[var(--text-dim)] print:mt-16 print:text-gray-400">
          <p>Dokumen ini dicetak dari SPK Cabai Premium v2.1.0</p>
        </div>
      </div>
    </div>
  );
}