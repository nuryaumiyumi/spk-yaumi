"use client";

import { hitungSAW, dataKriteria, dataAlternatif } from '@/lib/saw';
import { useState } from 'react';

export default function PerhitunganPage() {
  const [showDetail, setShowDetail] = useState(false);
  const hasil = hitungSAW(dataKriteria, dataAlternatif);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Perhitungan SAW</h1>
        </div>
        <p className="text-gray-600">Proses perhitungan menggunakan metode Simple Additive Weighting</p>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-4"></div>
      </div>

      <div className="grid gap-6">
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="w-fit px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          {showDetail ? '🔽 Sembunyikan Detail' : '▶️ Tampilkan Detail Perhitungan'}
        </button>

        {showDetail && (
          <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Matriks Normalisasi
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Alternatif</th>
                  {dataKriteria.map(k => (
                    <th key={k.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500">{k.nama.split(' ')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataAlternatif.map(a => {
                  const normalizedValues = dataKriteria.map(k => {
                    const allValues = dataAlternatif.map(alt => alt.nilai[k.id]);
                    const maxVal = Math.max(...allValues);
                    const minVal = Math.min(...allValues);
                    if (k.jenis === 'benefit') {
                      return (a.nilai[k.id] / maxVal).toFixed(3);
                    } else {
                      return (minVal / a.nilai[k.id]).toFixed(3);
                    }
                  });
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{a.nama}</td>
                      {normalizedValues.map((val, idx) => (
                        <td key={idx} className="px-4 py-3 text-center text-sm text-gray-600 font-mono">{val}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Hasil perangkingan */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🏆 Hasil Perangkingan
            </h2>
            <p className="text-emerald-100 text-sm mt-1">Berdasarkan perhitungan metode SAW dari 15 alternatif</p>
          </div>
          <div className="divide-y divide-gray-200">
            {hasil.map((item) => (
              <div key={item.alternatif.id} className="p-5 hover:bg-gray-50 transition-all duration-300">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md
                      ${item.rangking === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                        item.rangking === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                        item.rangking === 3 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                        'bg-gradient-to-r from-emerald-500 to-green-600'}
                    `}>
                      {item.rangking}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.alternatif.nama}</h3>
                      <p className="text-sm text-gray-500">Skor: {item.totalSkor.toFixed(4)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold gradient-text">{(item.totalSkor * 100).toFixed(2)}%</p>
                      <div className="w-40 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${item.totalSkor * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    {item.rangking === 1 && (
                      <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full shadow-md">
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
    </div>
  );
}