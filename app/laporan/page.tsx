"use client";

import { hitungSAW, dataKriteria, dataAlternatif } from '@/lib/saw';

export default function LaporanPage() {
  const hasil = hitungSAW(dataKriteria, dataAlternatif);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    let content = "LAPORAN SPK CABAI PREMIUM\n";
    content += "================================\n\n";
    content += "Tanggal: " + new Date().toLocaleDateString('id-ID') + "\n\n";
    content += "HASIL PERANGKINGAN:\n";
    hasil.forEach(item => {
      content += `${item.rangking}. ${item.alternatif.nama} - ${(item.totalSkor * 100).toFixed(2)}%\n`;
    });
    content += `\nRekomendasi Terbaik: ${hasil[0].alternatif.nama}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_spk_cabai_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📄</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Hasil Keputusan</h1>
        </div>
        <p className="text-gray-600">Laporan lengkap hasil pemilihan bibit cabai premium</p>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-4"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          🖨️ Cetak Laporan
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          📥 Export TXT
        </button>
      </div>

      {/* Laporan Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">SPK CABAI PREMIUM</h2>
          <p className="text-gray-600 mt-1">Sistem Pendukung Keputusan Pemilihan Bibit Cabai Premium</p>
          <p className="text-sm text-gray-500 mt-2">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
          <div className="border-t-2 border-gray-200 mt-4"></div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">A. Kriteria Penilaian</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">No</th>
                <th className="text-left p-2">Kriteria</th>
                <th className="text-left p-2">Bobot</th>
                <th className="text-left p-2">Jenis</th>
              </tr>
            </thead>
            <tbody>
              {dataKriteria.map((k, i) => (
                <tr key={k.id} className="border-b">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{k.nama}</td>
                  <td className="p-2">{k.bobot * 100}%</td>
                  <td className="p-2">{k.jenis === 'benefit' ? 'Benefit ↑' : 'Cost ↓'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">B. Hasil Perangkingan</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Rangking</th>
                <th className="text-left p-2">Nama Bibit</th>
                <th className="text-left p-2">Skor Akhir</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((item) => (
                <tr key={item.alternatif.id} className="border-b">
                  <td className="p-2 font-semibold">{item.rangking}</td>
                  <td className="p-2">{item.alternatif.nama}</td>
                  <td className="p-2 text-emerald-600 font-semibold">{(item.totalSkor * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
          <h4 className="font-semibold text-emerald-900 mb-2">📋 Kesimpulan</h4>
          <p className="text-emerald-800">
            Berdasarkan perhitungan menggunakan metode <strong>Simple Additive Weighting (SAW)</strong>,
            bibit cabai premium terbaik yang direkomendasikan adalah <strong className="text-emerald-900">{hasil[0]?.alternatif.nama}</strong>
            dengan skor akhir <strong>{(hasil[0]?.totalSkor * 100).toFixed(2)}%</strong>.
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400 print:mt-16">
          <p>Dokumen ini dicetak dari SPK Cabai Premium v2.1.0</p>
        </div>
      </div>
    </div>
  );
}