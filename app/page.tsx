"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/AppProvider";
import {
  RocketIcon,
  ArrowRightIcon,
  InfoIcon,
  SparkIcon,
  LeafIcon,
  PlantIcon,
  ScaleIcon,
  TargetIcon,
} from "@/components/icons";
import type { Kriteria } from "@/types";

export default function Home() {
  const { alternatif } = useApp();
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [loadingKriteria, setLoadingKriteria] = useState(true);

  useEffect(() => {
    fetch("/api/kriteria")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setKriteria(data.data);
        setLoadingKriteria(false);
      })
      .catch(() => setLoadingKriteria(false));
  }, []);

  if (loadingKriteria) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[rgba(46,232,95,0.2)] border-t-[var(--neon)]" />
      </div>
    );
  }

  const stats = [
    {
      value: String(kriteria.length),
      title: "Kriteria Penilaian",
      sub: "Evaluasi komprehensif",
      Icon: LeafIcon,
      glow: "glow-green",
      iconBg: "bg-[rgba(46,232,95,0.12)]",
      iconColor: "text-[#4ade80]",
    },
    {
      value: String(alternatif.length),
      title: "Alternatif Bibit",
      sub: "Varietas unggulan",
      Icon: PlantIcon,
      glow: "glow-blue",
      iconBg: "bg-[rgba(56,160,255,0.12)]",
      iconColor: "text-[#5ab2ff]",
    },
    {
      value: "SAW",
      title: "Metode",
      sub: "Simple Additive Weighting",
      Icon: ScaleIcon,
      glow: "glow-amber",
      iconBg: "bg-[rgba(245,180,40,0.12)]",
      iconColor: "text-[#f5b428]",
    },
    {
      value: "Akurat",
      title: "Keputusan Tepat",
      sub: "Berdasarkan data riil",
      Icon: TargetIcon,
      glow: "glow-purple",
      iconBg: "bg-[rgba(168,90,255,0.12)]",
      iconColor: "text-[#b98cff]",
    },
  ];

  return (
    <div className="space-y-8 border rounded-lg h-full border-emerald-200/20 p-4 ">
      {/* HERO - same as before */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/cabai-content.jpeg')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[var(--bg)] via-[var(--bg)]/82 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[var(--bg)]/80 via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-[340px] max-w-xl flex-col justify-center p-8 sm:p-12 lg:min-h-[400px] lg:p-16 animate-fadeInUp">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--neon)]">
            Sistem Pengambilan Keputusan
          </p>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
            Pilih Bibit Cabai
            <span className="mt-2 flex items-center gap-3">
              <span className="text-gradient-green">Premium Terbaik</span>
              <SparkIcon
                width={32}
                height={32}
                className="text-[#facc15] drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]"
              />
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
            Sistem ini membantu Anda memilih bibit cabai premium terbaik
            menggunakan metode{" "}
            <strong className="font-semibold text-[var(--neon)]">
              Multi Criteria Decision Making (MCDM)
            </strong>{" "}
            untuk hasil yang lebih objektif dan akurat.
          </p>

          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
            <Link
              href="/perhitungan"
              className="btn-neon inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm"
            >
              <RocketIcon width={18} height={18} /> Mulai Penilaian
              <ArrowRightIcon width={16} height={16} />
            </Link>
            <Link
              href="/informasi"
              className="btn-ghost inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold"
            >
              <InfoIcon width={18} height={18} /> Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {stats.map(
          ({ value, title, sub, Icon, glow, iconBg, iconColor }, i) => (
            <div
              key={title}
              className={`glass card-hover animate-fadeInUp p-6 ${glow}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl ${iconBg} ${iconColor}`}
              >
                <Icon width={23} height={23} />
              </div>
              <p className="mt-5 text-3xl font-extrabold text-white">{value}</p>
              <p className="mt-1.5 text-sm font-semibold text-white">{title}</p>
              <p className="mt-0.5 text-xs text-[var(--text-dim)]">{sub}</p>
            </div>
          ),
        )}
      </section>
    </div>
  );
}