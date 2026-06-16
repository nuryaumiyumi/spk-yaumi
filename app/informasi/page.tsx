"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import PageHeader from "@/components/PageHeader";
import {
  InfoIcon, PerhitunganIcon, RocketIcon, ArrowRightIcon,
  LeafIcon, ScaleIcon, TargetIcon, CheckIcon,
} from "@/components/icons";

const steps = [
  { title: "Tentukan Kriteria & Bobot", desc: "Setiap kriteria diberi bobot kepentingan dengan total 100%." },
  { title: "Kumpulkan Nilai Alternatif", desc: "Masukkan nilai setiap bibit cabai pada masing-masing kriteria." },
  { title: "Normalisasi Matriks", desc: "Benefit dibagi nilai maksimum, cost dibagi terhadap nilai minimum." },
  { title: "Hitung Skor & Rangking", desc: "Jumlahkan nilai ternormalisasi × bobot, lalu urutkan dari tertinggi." },
];

const features = [
  { Icon: LeafIcon, title: "Objektif", desc: "Keputusan berbasis data, bukan perkiraan.", color: "text-[#4ade80]", ring: "ring-[rgba(46,232,95,0.3)] bg-[rgba(46,232,95,0.1)]" },
  { Icon: ScaleIcon, title: "Terukur", desc: "Setiap kriteria memiliki bobot yang jelas.", color: "text-[#f5b428]", ring: "ring-[rgba(245,180,40,0.3)] bg-[rgba(245,180,40,0.1)]" },
  { Icon: TargetIcon, title: "Akurat", desc: "Perhitungan SAW yang konsisten & teruji.", color: "text-[#b98cff]", ring: "ring-[rgba(168,90,255,0.3)] bg-[rgba(168,90,255,0.1)]" },
];

export default function InformasiPage() {
  const { alternatif, kriteria, loading, kriteriaLoading } = useApp();

  if (loading || kriteriaLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[rgba(46,232,95,0.2)] border-t-[var(--neon)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Informasi Sistem"
        subtitle="Tentang metode SAW dan cara kerja sistem pendukung keputusan ini"
        Icon={InfoIcon}
      />

      {/* Intro */}
      <div className="glass p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#34e36a] to-[#16a34a] text-[#042b13]">
            <PerhitunganIcon width={24} height={24} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">Metode Simple Additive Weighting (SAW)</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
              SAW adalah salah satu metode <strong className="text-[var(--neon)]">Multi Criteria Decision Making (MCDM)</strong> yang
              bekerja dengan mencari penjumlahan terbobot dari rating kinerja setiap alternatif pada semua
              kriteria. Sistem ini menilai <strong className="text-white">{alternatif.length} varietas bibit cabai</strong> berdasarkan{" "}
              <strong className="text-white">{kriteria.length} kriteria</strong> untuk menghasilkan rekomendasi terbaik secara objektif.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-6">
        {features.map(({ Icon, title, desc, color, ring }) => (
          <div key={title} className="glass card-hover p-6">
            <div className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${ring} ${color}`}>
              <Icon width={22} height={22} />
            </div>
            <h3 className="mt-4 font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{desc}</p>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="glass p-6 sm:p-8">
        <h2 className="mb-6 text-lg font-bold text-white">Langkah Perhitungan</h2>
        <ol className="space-y-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[rgba(46,232,95,0.12)] text-sm font-bold text-[var(--neon)] ring-1 ring-[rgba(46,232,95,0.3)]">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-white">{s.title}</p>
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Criteria summary */}
      <div className="glass p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-bold text-white">Ringkasan Kriteria</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {kriteria.map((k) => (
            <li key={k.id} className="glass-soft flex items-center gap-3 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgba(46,232,95,0.12)] text-[var(--neon)]">
                <CheckIcon width={16} height={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{k.nama}</p>
                <p className="text-xs text-[var(--text-dim)]">
                  Bobot {Math.round(k.bobot * 100)}% · {k.jenis === "benefit" ? "Benefit ▲" : "Cost ▼"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="glass glow-green flex flex-col items-center justify-between gap-5 p-6 sm:flex-row sm:p-8">
        <div>
          <h3 className="text-lg font-bold text-white">Siap menemukan bibit terbaik?</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Jalankan perhitungan dan lihat rekomendasinya sekarang.</p>
        </div>
        <Link href="/perhitungan" className="btn-neon inline-flex shrink-0 items-center gap-2 px-6 py-3 text-sm">
          <RocketIcon width={18} height={18} /> Mulai Penilaian
          <ArrowRightIcon width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}