"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between gap-16">
            <div className="lg:w-2/3 animate-fadeInUp">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium mb-6 shadow-lg animate-glow">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                SISTEM PENGAMBILAN KEPUTUSAN
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Pilih Bibit Cabai</span>
                <span className="gradient-text block mt-2">Premium Terbaik</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Sistem ini membantu Anda memilih bibit cabai premium terbaik 
                menggunakan metode <strong className="text-emerald-600">Multi Criteria Decision Making (MCDM)</strong> 
                untuk hasil yang lebih objektif dan akurat.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/perhitungan"
                  className="group px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Mulai Penilaian
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href="/kriteria"
                  className="px-8 py-3.5 bg-white text-emerald-600 font-semibold rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all hover:shadow-md"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">15+</p>
                    <p className="text-sm text-gray-500">Alternatif Bibit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-lg">📊</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                    <p className="text-sm text-gray-500">Kriteria Penilaian</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-lg">🏆</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">98.7%</p>
                    <p className="text-sm text-gray-500">Akurasi Sistem</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/3 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                    <span className="text-4xl">📐</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Metode SAW</h3>
                  <p className="text-gray-500 mt-1">Simple Additive Weighting</p>
                  <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="mt-4">
                    <div className="text-5xl font-bold gradient-text">98.7%</div>
                    <p className="text-sm text-gray-500 mt-2">Tingkat Akurasi</p>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full animate-pulse-slow" style={{ width: '98.7%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Keunggulan Sistem Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Dengan metode SAW yang teruji, Anda mendapatkan rekomendasi terbaik</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🎯", title: "4 Kriteria Penilaian", desc: "Penilaian komprehensif dengan bobot yang terukur" },
            { icon: "🌶️", title: "15 Alternatif Bibit", desc: "Berbagai varietas unggulan dari petani berpengalaman" },
            { icon: "📊", title: "Metode SAW", desc: "Perhitungan akurat & objektif dengan MCDM" }
          ].map((item, i) => (
            <div key={i} className="group bg-white rounded-2xl p-8 shadow-lg card-hover border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}