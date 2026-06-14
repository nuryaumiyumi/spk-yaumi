// Pemformatan angka konsisten dengan locale Indonesia.

/** 85000 -> "85.000" */
export const formatAngka = (n: number) =>
  new Intl.NumberFormat("id-ID").format(n);

/** 85000 -> "Rp 85.000" */
export const formatRupiah = (n: number) => `Rp ${formatAngka(n)}`;

/** 0.35 -> "35%" */
export const formatPersen = (n: number, desimal = 0) =>
  `${(n * 100).toFixed(desimal)}%`;

/** Waktu relatif singkat, mis. "baru saja", "5 menit lalu". */
export function waktuRelatif(ts: number) {
  const detik = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (detik < 60) return "baru saja";
  const menit = Math.round(detik / 60);
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.round(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.round(jam / 24);
  return `${hari} hari lalu`;
}
