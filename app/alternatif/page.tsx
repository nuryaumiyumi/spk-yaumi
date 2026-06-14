"use client";

import { dataAlternatif, dataKriteria } from '@/lib/saw';
import { useState } from 'react';

export default function AlternatifPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAlternatif = dataAlternatif.filter(alt =>
    alt.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🌶️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Alternatif Bibit Cabai</h1>
        </div>
        <p className="text-gray-600">15 varietas bibit cabai premium yang akan dinilai</p>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-4"></div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari bibit cabai..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-emerald-600 to-green-600">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-white uppercase">No</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-white uppercase">Nama Bibit</th>
                {dataKriteria.map(k => (
                  <th key={k.id} className="px-4 py-4 text-center text-xs font-medium text-white uppercase">
                    {k.nama.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlternatif.map((alternatif, index) => (
                <tr key={alternatif.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-800">{alternatif.nama}</td>
                  {dataKriteria.map(k => (
                    <td key={k.id} className="px-4 py-4 text-center text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                        k.id === 'hasil' ? 'bg-green-100 text-green-700' :
                        k.id === 'ketahanan' ? 'bg-blue-100 text-blue-700' :
                        k.id === 'harga' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {alternatif.nilai[k.id]}
                        {k.id === 'hasil' && ' kg'}
                        {k.id === 'harga' && ' Rp'}
                        {k.id === 'umur' && ' hari'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Menampilkan {filteredAlternatif.length} dari {dataAlternatif.length} alternatif
      </div>
    </div>
  );
}