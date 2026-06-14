"use client";

import { dataKriteria } from '@/lib/saw';

export default function KriteriaPage() {
  const totalBobot = dataKriteria.reduce((sum, k) => sum + k.bobot, 0);
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Kriteria Penilaian</h1>
        </div>
        <p className="text-gray-600">4 kriteria utama dengan bobot yang telah ditentukan</p>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-4"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-emerald-600 to-green-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Kriteria</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Bobot</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Jenis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataKriteria.map((kriteria, index) => (
                <tr key={kriteria.id} className="table-row-hover">
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{index + 1}</td> {/* ganti text-gray-500 -> 600 */}
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{kriteria.nama}</td> {/* text-gray-900 -> 800 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-emerald-600 w-12">{kriteria.bobot * 100}%</span>
                      <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2.5 rounded-full"
                          style={{ width: `${kriteria.bobot * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                      kriteria.jenis === 'benefit' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {kriteria.jenis === 'benefit' ? '📈 Benefit' : '📉 Cost'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-800">Total Bobot</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-600 w-12">{totalBobot * 100}%</span>
                    <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-l-4 border-emerald-500">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-emerald-900 mb-1">Informasi Penting</p>
            <p className="text-sm text-emerald-800">
              <strong>Benefit (📈)</strong> = semakin besar nilai, semakin baik. 
              <strong className="ml-2">Cost (📉)</strong> = semakin kecil nilai, semakin baik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}