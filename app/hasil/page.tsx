"use client";

import { hitungSAW, dataKriteria, dataAlternatif } from '@/lib/saw';

export default function HasilPage() {
  const hasil = hitungSAW(dataKriteria, dataAlternatif);
  const terbaik = hasil[0];
  const top3 = hasil.slice(0, 3);

  const truncateName = (nama: string, maxLen = 12) => {
    return nama.length > maxLen ? nama.substring(0, maxLen) + '...' : nama;
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🏆</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hasil Keputusan</h1>
        </div>
        <p className="text-gray-600">Rekomendasi final pemilihan bibit cabai premium terbaik dari 15 alternatif</p>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-4"></div>
      </div>

      {/* Podium responsif dengan grid - urutan 2,1,3 */}
      <div className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end max-w-2xl mx-auto">
          {/* Rank 2 */}
          {top3[1] && (
            <div className="text-center order-2 sm:order-1">
              <div className="bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-2xl p-4 h-32 flex flex-col items-center justify-end">
                <span className="text-4xl mb-2">🥈</span>
                <p className="font-semibold text-gray-800 text-sm">{truncateName(top3[1].alternatif.nama)}</p>
                <p className="text-xs text-gray-600">{(top3[1].totalSkor * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-gray-400 py-2 rounded-b-lg">
                <p className="text-white font-bold">#2</p>
              </div>
            </div>
          )}
          
          {/* Rank 1 */}
          {terbaik && (
            <div className="text-center order-1 sm:order-2">
              <div className="bg-gradient-to-t from-yellow-300 to-yellow-200 rounded-t-2xl p-6 h-44 flex flex-col items-center justify-end shadow-xl">
                <span className="text-6xl mb-2">👑</span>
                <p className="font-bold text-gray-800 text-base">{truncateName(terbaik.alternatif.nama, 14)}</p>
                <p className="text-sm font-bold text-yellow-800">{(terbaik.totalSkor * 100).toFixed(2)}%</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-3 rounded-b-lg">
                <p className="text-white font-bold text-xl">#1 TERBAIK</p>
              </div>
            </div>
          )}
          
          {/* Rank 3 */}
          {top3[2] && (
            <div className="text-center order-3">
              <div className="bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-2xl p-4 h-28 flex flex-col items-center justify-end">
                <span className="text-4xl mb-2">🥉</span>
                <p className="font-semibold text-gray-800 text-sm">{truncateName(top3[2].alternatif.nama)}</p>
                <p className="text-xs text-gray-600">{(top3[2].totalSkor * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-orange-500 py-2 rounded-b-lg">
                <p className="text-white font-bold">#3</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Rankings - perbaiki warna teks */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">📋 Perangkingan Lengkap (15 Alternatif)</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {hasil.map((item) => (
            <div key={item.alternatif.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  item.rangking === 1 ? 'bg-yellow-400 text-white' :
                  item.rangking === 2 ? 'bg-gray-400 text-white' :
                  item.rangking === 3 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {item.rangking}
                </div>
                <span className="font-medium text-gray-800">{item.alternatif.nama}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full" style={{ width: `${item.totalSkor * 100}%` }}></div>
                </div>
                <span className="text-emerald-600 font-bold w-16 text-right">{(item.totalSkor * 100).toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}