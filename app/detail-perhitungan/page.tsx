"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useApp } from "@/components/AppProvider";
import { detailSAW } from "@/lib/saw";
import { formatAngka } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import GroupedBarChart from "@/components/GroupedBarChart";
import LineAreaChart from "@/components/LineAreaChart";
import { SigmaIcon, ChartBarIcon } from "@/components/icons";
import type { Kriteria } from "@/types";

type Mode = "detail" | "matriks";

const warnaKriteria: Record<string, string> = {
  hasil: "#4ade80",
  ketahanan: "#5ab2ff",
  harga: "#f5b428",
  umur: "#b98cff",
};

const rankClass = (r: number) =>
  r === 1
    ? "bg-[#facc15] text-[#3b2f00]"
    : r === 2
      ? "bg-[#cbd5e1] text-[#1e293b]"
      : r === 3
        ? "bg-[#fb923c] text-[#3b1700]"
        : "bg-white/10 text-[var(--text-muted)]";

function Frac({ atas, bawah }: { atas: ReactNode; bawah: ReactNode }) {
  return (
    <span className="mx-1 inline-flex flex-col items-center text-center align-middle leading-tight">
      <span className="px-2">{atas}</span>
      <span className="mt-0.5 w-full border-t border-current px-2 pt-0.5">{bawah}</span>
    </span>
  );
}

function TipeBadge({ jenis }: { jenis: "benefit" | "cost" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        jenis === "benefit"
          ? "bg-[rgba(46,232,95,0.12)] text-[#4ade80] ring-[rgba(46,232,95,0.3)]"
          : "bg-[rgba(244,63,94,0.12)] text-[#fb7185] ring-[rgba(244,63,94,0.3)]"
      }`}
    >
      {jenis === "benefit" ? "▲ Benefit" : "▼ Cost"}
    </span>
  );
}

function Langkah({
  no,
  judul,
  anak,
  children,
}: {
  no: number;
  judul: string;
  anak?: string;
  children: ReactNode;
}) {
  return (
    <section className="glass p-6 sm:p-8">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#34e36a] to-[#16a34a] text-sm font-extrabold text-[#042b13]">
          {no}
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">{judul}</h2>
          {anak && <p className="mt-0.5 text-sm text-[var(--text-muted)]">{anak}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function HeaderKriteria({ kriteria, sub }: { kriteria: Kriteria[]; sub?: (k: Kriteria) => ReactNode }) {
  return (
    <>
      {kriteria.map((k) => (
        <th key={k.id} className="px-5 py-3 text-right font-semibold">
          <span className="block normal-case" style={{ color: warnaKriteria[k.id] }}>
            {k.singkat}
          </span>
          {sub && (
            <span className="block text-[10px] font-medium normal-case tracking-normal text-[var(--text-dim)]">
              {sub(k)}
            </span>
          )}
        </th>
      ))}
    </>
  );
}

export default function DetailPerhitunganPage() {
  const { alternatif, kriteria, loading } = useApp();
  const { ekstrem, hasil } = useMemo(() => detailSAW(kriteria, alternatif), [kriteria, alternatif]);

  const [mode, setMode] = useState<Mode>("detail");
  const [pilihId, setPilihId] = useState("");

  const terbaikId = useMemo(() => {
    let best: (typeof hasil)[number] | undefined;
    for (const h of hasil) if (!best || h.rangking < best.rangking) best = h;
    return best?.alternatif.id ?? "";
  }, [hasil]);

  const terpilih =
    hasil.find((h) => h.alternatif.id === pilihId) ??
    hasil.find((h) => h.alternatif.id === terbaikId);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[rgba(46,232,95,0.2)] border-t-[var(--neon)]" />
      </div>
    );
  }

  if (!terpilih || alternatif.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Detail Perhitungan SAW"
          subtitle="Penjelasan lengkap proses metode Simple Additive Weighting, langkah demi langkah."
          Icon={SigmaIcon}
        />
        <div className="glass p-12 text-center text-[var(--text-dim)]">
          Belum ada data alternatif untuk dihitung. Tambahkan data terlebih dahulu pada menu Alternatif.
        </div>
      </div>
    );
  }

  const juara = terpilih.rangking === 1;

  const kategoriKriteria = terpilih.rincian.map((r) => r.kriteria.singkat);
  const seriDouble = [
    {
      nama: "Normalisasi (r)",
      warna: "#5ab2ff",
      nilai: terpilih.rincian.map((r) => r.normalisasi),
    },
    {
      nama: "Terbobot (w·r)",
      warna: "#34e36a",
      nilai: terpilih.rincian.map((r) => r.kontribusi),
    },
  ];

  const sorotId = mode === "matriks" ? terbaikId : terpilih.alternatif.id;
  const dataPerbandingan = [...hasil]
    .sort((a, b) => b.total - a.total)
    .map((h) => ({
      label: h.alternatif.nama,
      value: h.total,
      highlight: h.alternatif.id === sorotId,
      color:
        h.alternatif.id === sorotId
          ? "linear-gradient(90deg,#6cff8e,#22c55e)"
          : "linear-gradient(90deg,#1f6b3a,#15532c)",
      badge: h.rangking === 1 ? "🏆" : undefined,
    }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Detail Perhitungan SAW"
        subtitle="Penjelasan lengkap proses metode Simple Additive Weighting, langkah demi langkah hingga nilai keputusan."
        Icon={SigmaIcon}
      />

      {/* RUMUS */}
      <section className="glass p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white">Rumus Metode SAW</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
          SAW mencari penjumlahan terbobot dari rating kinerja ternormalisasi. Setiap nilai dinormalisasi
          dulu sesuai jenis kriteria, lalu dikalikan bobot dan dijumlahkan.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="glass-soft p-5">
            <p className="text-sm font-semibold text-white">Normalisasi — Benefit</p>
            <div className="mt-3 flex items-center justify-center rounded-lg bg-black/20 py-4 text-[var(--text)]">
              <i>r</i>
              <sub>ij</sub>
              <span className="mx-2">=</span>
              <Frac
                atas={
                  <>
                    <i>x</i>
                    <sub>ij</sub>
                  </>
                }
                bawah={
                  <>
                    max <i>x</i>
                    <sub>ij</sub>
                  </>
                }
              />
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              Dipakai bila makin besar makin baik (mis. Hasil Panen, Ketahanan).
            </p>
          </div>

          <div className="glass-soft p-5">
            <p className="text-sm font-semibold text-white">Normalisasi — Cost</p>
            <div className="mt-3 flex items-center justify-center rounded-lg bg-black/20 py-4 text-[var(--text)]">
              <i>r</i>
              <sub>ij</sub>
              <span className="mx-2">=</span>
              <Frac
                atas={
                  <>
                    min <i>x</i>
                    <sub>ij</sub>
                  </>
                }
                bawah={
                  <>
                    <i>x</i>
                    <sub>ij</sub>
                  </>
                }
              />
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              Dipakai bila makin kecil makin baik (mis. Harga, Umur Panen).
            </p>
          </div>
        </div>

        <div className="glass-soft mt-4 p-5">
          <p className="text-sm font-semibold text-white">Nilai Preferensi (Skor Akhir)</p>
          <div className="mt-3 flex items-center justify-center rounded-lg bg-black/20 py-5 text-lg text-[var(--text)]">
            <i>V</i>
            <sub>i</sub>
            <span className="mx-2">=</span>
            <span className="mx-1 inline-flex flex-col items-center text-[10px] leading-none text-[var(--text-dim)]">
              <span>n</span>
              <span className="my-0.5 text-2xl leading-none text-[var(--text)]">Σ</span>
              <span>j=1</span>
            </span>
            <i>w</i>
            <sub>j</sub>
            <span className="mx-1">·</span>
            <i>r</i>
            <sub>ij</sub>
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            <i>w</i>
            <sub>j</sub> = bobot kriteria, <i>r</i>
            <sub>ij</sub> = nilai ternormalisasi. Alternatif dengan <i>V</i>
            <sub>i</sub> tertinggi adalah yang terbaik.
          </p>
        </div>
      </section>

      {/* TOGGLE MODE */}
      <section className="glass flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="px-1 text-sm font-medium text-[var(--text-muted)]">Mode perhitungan</p>
        <div className="inline-flex rounded-xl bg-white/[0.04] p-1 ring-1 ring-[var(--border)]">
          {(
            [
              { id: "detail", label: "Per Alternatif" },
              { id: "matriks", label: "Keseluruhan (Matriks)" },
            ] as { id: Mode; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === m.id
                  ? "bg-linear-to-br from-[#34e36a] to-[#16a34a] text-[#042b13] shadow-[0_8px_22px_-10px_rgba(46,232,95,0.8)]"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* ===================== MODE: PER ALTERNATIF ===================== */}
      {mode === "detail" && (
        <>
          <section className="glass p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:max-w-sm">
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                  Pilih alternatif untuk dihitung detail
                </label>
                <select
                  value={terpilih.alternatif.id}
                  onChange={(e) => setPilihId(e.target.value)}
                  className="input-field w-full px-4 py-2.5 text-sm"
                >
                  {hasil.map((h) => (
                    <option key={h.alternatif.id} value={h.alternatif.id}>
                      {h.alternatif.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <div className="glass-soft px-5 py-3 text-center">
                  <p className="text-xs text-[var(--text-dim)]">
                    Skor (<i>V</i>
                    <sub>i</sub>)
                  </p>
                  <p className="text-gradient-green text-xl font-extrabold tabular-nums">
                    {terpilih.total.toFixed(4)}
                  </p>
                </div>
                <div className="glass-soft px-5 py-3 text-center">
                  <p className="text-xs text-[var(--text-dim)]">Peringkat</p>
                  <p className="text-xl font-extrabold text-white tabular-nums">#{terpilih.rangking}</p>
                </div>
              </div>
            </div>
          </section>

          <Langkah
            no={1}
            judul="Nilai Awal (Matriks Keputusan)"
            anak={`Nilai mentah "${terpilih.alternatif.nama}" pada setiap kriteria beserta bobot dan jenisnya.`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="head-bar text-xs uppercase tracking-wider text-[var(--text-dim)]">
                    <th className="px-5 py-3 text-left font-semibold">Kriteria</th>
                    <th className="px-5 py-3 text-center font-semibold">Jenis</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Bobot (<i>w</i>)
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Nilai (<i>x</i>)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {terpilih.rincian.map((r) => (
                    <tr key={r.kriteria.id} className="border-t border-[var(--border)]">
                      <td className="px-5 py-3 font-medium text-white">{r.kriteria.nama}</td>
                      <td className="px-5 py-3 text-center">
                        <TipeBadge jenis={r.kriteria.jenis} />
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-[var(--text-muted)]">
                        {r.kriteria.bobot.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-white">
                        {formatAngka(r.nilai)}{" "}
                        <span className="text-xs text-[var(--text-dim)]">{r.kriteria.satuan}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Langkah>

          <Langkah
            no={2}
            judul="Normalisasi"
            anak="Benefit = nilai ÷ nilai maksimum kolom · Cost = nilai minimum kolom ÷ nilai."
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="head-bar text-xs uppercase tracking-wider text-[var(--text-dim)]">
                    <th className="px-5 py-3 text-left font-semibold">Kriteria</th>
                    <th className="px-5 py-3 text-center font-semibold">Jenis</th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Perhitungan (<i>r</i>
                      <sub>ij</sub>)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {terpilih.rincian.map((r) => {
                    const benefit = r.kriteria.jenis === "benefit";
                    return (
                      <tr key={r.kriteria.id} className="border-t border-[var(--border)]">
                        <td className="px-5 py-4 font-medium text-white">{r.kriteria.nama}</td>
                        <td className="px-5 py-4 text-center">
                          <TipeBadge jenis={r.kriteria.jenis} />
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center font-mono text-[13px] text-[var(--text-muted)]">
                            <Frac
                              atas={formatAngka(benefit ? r.nilai : r.pembagi)}
                              bawah={formatAngka(benefit ? r.pembagi : r.nilai)}
                            />
                            <span className="mx-2">=</span>
                            <span className="font-semibold text-[var(--neon)]">
                              {r.normalisasi.toFixed(3)}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Langkah>

          <Langkah
            no={3}
            judul="Pembobotan & Penjumlahan"
            anak="Setiap nilai ternormalisasi dikalikan bobotnya, lalu seluruh hasilnya dijumlahkan."
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="head-bar text-xs uppercase tracking-wider text-[var(--text-dim)]">
                    <th className="px-5 py-3 text-left font-semibold">Kriteria</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Bobot (<i>w</i>)
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Normalisasi (<i>r</i>)
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      <i>w</i> · <i>r</i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {terpilih.rincian.map((r) => (
                    <tr key={r.kriteria.id} className="border-t border-[var(--border)]">
                      <td className="px-5 py-3 font-medium text-white">{r.kriteria.nama}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-[var(--text-muted)]">
                        {r.kriteria.bobot.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-[var(--text-muted)]">
                        {r.normalisasi.toFixed(3)}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-[var(--neon)]">
                        {r.kontribusi.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[var(--border-strong)] bg-white/[0.015]">
                    <td colSpan={3} className="px-5 py-3 text-right font-semibold text-white">
                      Total Skor (<i>V</i>
                      <sub>i</sub>)
                    </td>
                    <td className="text-gradient-green px-5 py-3 text-right text-base font-extrabold tabular-nums">
                      {terpilih.total.toFixed(4)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-5 rounded-xl bg-black/20 p-4 font-mono text-[13px] leading-relaxed text-[var(--text-muted)] ring-1 ring-[var(--border)]">
              <p>
                <span className="text-white">V</span> ={" "}
                {terpilih.rincian.map((r, i) => (
                  <span key={r.kriteria.id}>
                    {i > 0 && <span className="text-[var(--text-dim)]"> + </span>}(
                    {r.kriteria.bobot.toFixed(2)} × {r.normalisasi.toFixed(3)})
                  </span>
                ))}
              </p>
              <p className="mt-1.5">
                <span className="opacity-0">V</span> ={" "}
                {terpilih.rincian.map((r, i) => (
                  <span key={r.kriteria.id}>
                    {i > 0 && <span className="text-[var(--text-dim)]"> + </span>}
                    {r.kontribusi.toFixed(3)}
                  </span>
                ))}
              </p>
              <p className="mt-1.5">
                <span className="opacity-0">V</span> ={" "}
                <span className="font-bold text-[var(--neon)]">{terpilih.total.toFixed(4)}</span>
              </p>
            </div>
          </Langkah>

          <Langkah no={4} judul="Nilai Keputusan" anak="Skor akhir dan posisi peringkat di antara seluruh alternatif.">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Nilai keputusan untuk</p>
                <p className="text-xl font-bold text-white">{terpilih.alternatif.nama}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-gradient-green text-3xl font-extrabold tabular-nums">
                    {(terpilih.total * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-[var(--text-dim)]">Skor {terpilih.total.toFixed(4)}</p>
                </div>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ring-1 ${
                    juara
                      ? "bg-[rgba(250,204,21,0.14)] text-[#facc15] ring-[rgba(250,204,21,0.35)]"
                      : "bg-white/[0.04] text-[var(--text-muted)] ring-[var(--border)]"
                  }`}
                >
                  Peringkat #{terpilih.rangking} dari {hasil.length}
                </span>
              </div>
            </div>
            {juara && (
              <p className="mt-5 rounded-xl border-l-2 border-[#facc15] bg-[rgba(250,204,21,0.08)] px-4 py-3 text-sm text-[#facc15]">
                🏆 Alternatif ini memperoleh skor tertinggi sehingga menjadi rekomendasi terbaik.
              </p>
            )}
          </Langkah>

          {/* GRAFIK BATANG DOUBLE — Normalisasi vs Terbobot */}
          <section className="glass p-6 sm:p-8">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[rgba(46,232,95,0.12)] text-[var(--neon)]">
                <ChartBarIcon width={20} height={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Normalisasi vs Terbobot per Kriteria</h2>
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                  Perbandingan nilai ternormalisasi (<i>r</i>) dan kontribusinya setelah dibobot (
                  <i>w</i> · <i>r</i>) untuk {terpilih.alternatif.nama}.
                </p>
              </div>
            </div>
            <GroupedBarChart kategori={kategoriKriteria} seri={seriDouble} format={(n) => n.toFixed(3)} />
          </section>
        </>
      )}

      {/* ===================== MODE: KESELURUHAN (MATRIKS) ===================== */}
      {mode === "matriks" && (
        <>
          {/* Bobot & jenis kriteria */}
          <section className="glass p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white">Bobot & Jenis Kriteria (W)</h2>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              Vektor bobot yang dipakai untuk seluruh perhitungan (total = 1,00).
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {kriteria.map((k) => (
                <span key={k.id} className="glass-soft inline-flex items-center gap-2 px-3.5 py-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: warnaKriteria[k.id] }} />
                  <span className="font-semibold text-white">{k.singkat}</span>
                  <span className="text-[var(--text-dim)]">
                    w {k.bobot.toFixed(2)} · {k.jenis === "benefit" ? "Benefit" : "Cost"}
                  </span>
                </span>
              ))}
            </div>
          </section>

          {/* Matriks X */}
          <section className="glass overflow-hidden">
            <div className="head-bar px-6 py-5">
              <h2 className="font-bold text-white">Matriks Keputusan (X)</h2>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">Nilai mentah seluruh alternatif pada tiap kriteria.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-[var(--text-dim)]">
                    <th className="px-5 py-3 text-left font-semibold">Alternatif</th>
                    <HeaderKriteria kriteria={kriteria} sub={(k) => k.satuan} />
                  </tr>
                </thead>
                <tbody>
                  {hasil.map((h) => (
                    <tr key={h.alternatif.id} className="table-row-hover border-t border-[var(--border)]">
                      <td className="px-5 py-3 font-medium text-white">{h.alternatif.nama}</td>
                      {h.rincian.map((r) => (
                        <td key={r.kriteria.id} className="px-5 py-3 text-right tabular-nums text-[var(--text-muted)]">
                          {formatAngka(r.nilai)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Matriks R */}
          <section className="glass overflow-hidden">
            <div className="head-bar px-6 py-5">
              <h2 className="font-bold text-white">Matriks Ternormalisasi (R)</h2>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                Hasil normalisasi tiap sel. Pembagi tiap kolom ditampilkan di bawah nama kriteria.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-[var(--text-dim)]">
                    <th className="px-5 py-3 text-left font-semibold">Alternatif</th>
                    <HeaderKriteria
                      kriteria={kriteria}
                      sub={(k) =>
                        k.jenis === "benefit"
                          ? `max ${formatAngka(ekstrem[k.id].max)}`
                          : `min ${formatAngka(ekstrem[k.id].min)}`
                      }
                    />
                  </tr>
                </thead>
                <tbody>
                  {hasil.map((h) => (
                    <tr key={h.alternatif.id} className="table-row-hover border-t border-[var(--border)]">
                      <td className="px-5 py-3 font-medium text-white">{h.alternatif.nama}</td>
                      {h.rincian.map((r) => (
                        <td key={r.kriteria.id} className="px-5 py-3 text-right tabular-nums text-[var(--text-muted)]">
                          {r.normalisasi.toFixed(3)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Matriks terbobot + V + ranking */}
          <section className="glass overflow-hidden">
            <div className="head-bar px-6 py-5">
              <h2 className="font-bold text-white">Matriks Terbobot &amp; Nilai Preferensi (V)</h2>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                Tiap sel = <i>w</i> · <i>r</i>. Nilai <i>V</i>
                <sub>i</sub> adalah jumlah satu baris, lalu diberi peringkat.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-[var(--text-dim)]">
                    <th className="px-5 py-3 text-left font-semibold">Alternatif</th>
                    <HeaderKriteria kriteria={kriteria} sub={(k) => `w ${k.bobot.toFixed(2)}`} />
                    <th className="px-5 py-3 text-right font-semibold">
                      Skor (<i>V</i>
                      <sub>i</sub>)
                    </th>
                    <th className="px-5 py-3 text-center font-semibold">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {hasil.map((h) => (
                    <tr
                      key={h.alternatif.id}
                      className={`border-t border-[var(--border)] ${
                        h.rangking === 1 ? "bg-[rgba(250,204,21,0.06)]" : "table-row-hover"
                      }`}
                    >
                      <td className="px-5 py-3 font-medium text-white">{h.alternatif.nama}</td>
                      {h.rincian.map((r) => (
                        <td key={r.kriteria.id} className="px-5 py-3 text-right tabular-nums text-[var(--text-muted)]">
                          {r.kontribusi.toFixed(3)}
                        </td>
                      ))}
                      <td className="text-gradient-green px-5 py-3 text-right text-base font-extrabold tabular-nums">
                        {h.total.toFixed(4)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center">
                          <span
                            className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${rankClass(
                              h.rangking
                            )}`}
                          >
                            {h.rangking}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* GRAFIK — PERBANDINGAN (selalu tampil) */}
      <section className="glass p-6 sm:p-8">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[rgba(46,232,95,0.12)] text-[var(--neon)]">
            <ChartBarIcon width={20} height={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Perbandingan Skor Semua Alternatif</h2>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Skor akhir (<i>V</i>
              <sub>i</sub>) seluruh alternatif dalam grafik garis area, diurutkan dari tertinggi.
            </p>
          </div>
        </div>
        <LineAreaChart data={dataPerbandingan} format={(n) => `${(n * 100).toFixed(2)}%`} />
      </section>
    </div>
  );
}