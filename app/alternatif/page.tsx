// app/alternatif/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { formatAngka } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import {
  AlternatifIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
} from "@/components/icons";
import type { Alternatif } from "@/types";

const warnaKolom: Record<string, string> = {
  hasil: "text-[#4ade80]",
  ketahanan: "text-[#5ab2ff]",
  harga: "text-[#f5b428]",
  umur: "text-[#b98cff]",
};

type FormState = { nama: string; nilai: Record<string, string> };

export default function AlternatifPage() {
  const {
    alternatif,
    kriteria,
    loading,
    kriteriaLoading,
    tambahAlternatif,
    ubahAlternatif,
    hapusAlternatif,
  } = useApp();

  const [cari, setCari] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ nama: "", nilai: {} });
  const [error, setError] = useState<string | null>(null);
  const [hapusTarget, setHapusTarget] = useState<Alternatif | null>(null);

  // Inisialisasi form kosong berdasarkan kriteria yang tersedia
  const initForm = () => ({
    nama: "",
    nilai: Object.fromEntries(kriteria.map((k) => [k.id, ""])),
  });

  const terfilter = useMemo(
    () =>
      alternatif.filter((a) =>
        a.nama.toLowerCase().includes(cari.toLowerCase())
      ),
    [alternatif, cari]
  );

  const bukaTambah = () => {
    setEditId(null);
    setForm(initForm());
    setError(null);
    setFormOpen(true);
  };

  const bukaEdit = (a: Alternatif) => {
    setEditId(a.id);
    setForm({
      nama: a.nama,
      nilai: Object.fromEntries(
        kriteria.map((k) => [k.id, String(a.nilai[k.id] ?? "")])
      ),
    });
    setError(null);
    setFormOpen(true);
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const nama = form.nama.trim();
    if (!nama) {
      setError("Nama bibit wajib diisi.");
      return;
    }

    const nilai: Record<string, number> = {};
    for (const k of kriteria) {
      const raw = form.nilai[k.id];
      const num = Number(raw);
      if (raw === "" || Number.isNaN(num)) {
        setError(`Nilai "${k.singkat}" harus berupa angka.`);
        return;
      }
      if (num <= 0) {
        setError(`Nilai "${k.singkat}" harus lebih dari 0.`);
        return;
      }
      if (k.id === "ketahanan" && (num < 1 || num > 10)) {
        setError(`Nilai "${k.singkat}" harus antara 1-10.`);
        return;
      }
      nilai[k.id] = num;
    }

    if (editId) {
      await ubahAlternatif(editId, { nama, nilai });
    } else {
      await tambahAlternatif({ nama, nilai });
    }
    setFormOpen(false);
  };

  const konfirmHapus = async () => {
    if (hapusTarget) await hapusAlternatif(hapusTarget.id);
    setHapusTarget(null);
  };

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
        title="Alternatif Bibit Cabai"
        subtitle={`${alternatif.length} varietas bibit cabai premium — kelola data secara manual`}
        Icon={AlternatifIcon}
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon
            width={18}
            height={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
          />
          <input
            type="text"
            placeholder="Cari bibit cabai..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            className="input-field w-full py-2.5 pl-11 pr-4 text-sm"
          />
        </div>
        <button
          onClick={bukaTambah}
          className="btn-neon inline-flex shrink-0 items-center justify-center gap-2 px-5 py-2.5 text-sm"
        >
          <PlusIcon width={18} height={18} /> Tambah Alternatif
        </button>
      </div>

      {/* Table */}
      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="head-bar text-xs uppercase tracking-wider text-[var(--text-dim)]">
                <th className="px-6 py-4 text-left font-semibold">No</th>
                <th className="px-6 py-4 text-left font-semibold">Nama Bibit</th>
                {kriteria.map((k) => (
                  <th key={k.id} className="px-6 py-4 text-right font-semibold">
                    <span
                      className={`block normal-case ${
                        warnaKolom[k.id] ?? "text-[var(--text-muted)]"
                      }`}
                    >
                      {k.singkat}
                    </span>
                    <span className="block text-[10px] font-medium normal-case tracking-normal text-[var(--text-dim)]">
                      {k.satuan}
                    </span>
                  </th>
                ))}
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {terfilter.map((a, index) => (
                <tr
                  key={a.id}
                  className="table-row-hover border-t border-[var(--border)]"
                >
                  <td className="px-6 py-4 tabular-nums text-[var(--text-dim)]">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">{a.nama}</td>
                  {kriteria.map((k) => (
                    <td
                      key={k.id}
                      className="px-6 py-4 text-right tabular-nums text-[var(--text-muted)]"
                    >
                      {formatAngka(a.nilai[k.id])}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => bukaEdit(a)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] ring-1 ring-[var(--border)] transition hover:text-[var(--neon)] hover:ring-[rgba(46,232,95,0.4)]"
                        aria-label={`Ubah ${a.nama}`}
                      >
                        <EditIcon width={16} height={16} />
                      </button>
                      <button
                        onClick={() => setHapusTarget(a)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] ring-1 ring-[var(--border)] transition hover:text-[#fb7185] hover:ring-[rgba(244,63,94,0.4)]"
                        aria-label={`Hapus ${a.nama}`}
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {terfilter.length === 0 && (
                <tr className="border-t border-[var(--border)]">
                  <td
                    colSpan={3 + kriteria.length}
                    className="px-6 py-14 text-center text-[var(--text-dim)]"
                  >
                    {alternatif.length === 0
                      ? "Belum ada data alternatif. Tambahkan data baru."
                      : "Tidak ada bibit yang cocok dengan pencarian."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-[var(--text-dim)]">
        Menampilkan {terfilter.length} dari {alternatif.length} alternatif
      </p>

      {/* Form tambah / ubah */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Ubah Alternatif" : "Tambah Alternatif"}
      >
        <form onSubmit={simpan} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
              Nama Bibit
            </label>
            <input
              autoFocus
              type="text"
              value={form.nama}
              onChange={(e) =>
                setForm((f) => ({ ...f, nama: e.target.value }))
              }
              placeholder="cth. Cabai Merah Juara F1"
              className="input-field w-full px-4 py-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {kriteria.map((k) => (
              <div key={k.id}>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
                  {k.singkat}{" "}
                  <span className="text-[var(--text-dim)]">({k.satuan})</span>
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.nilai[k.id] ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      nilai: { ...f.nilai, [k.id]: e.target.value },
                    }))
                  }
                  placeholder="0"
                  className="input-field w-full px-4 py-2.5 text-sm tabular-nums"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-lg bg-[rgba(244,63,94,0.1)] px-3.5 py-2.5 text-sm text-[#fb7185] ring-1 ring-[rgba(244,63,94,0.3)]">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="btn-ghost px-5 py-2.5 text-sm font-semibold text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-neon inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <CheckIcon width={16} height={16} />{" "}
              {editId ? "Simpan Perubahan" : "Tambah Data"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Konfirmasi hapus */}
      <Modal
        open={!!hapusTarget}
        onClose={() => setHapusTarget(null)}
        title="Hapus Alternatif"
      >
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          Yakin ingin menghapus{" "}
          <strong className="text-white">{hapusTarget?.nama}</strong>? Tindakan
          ini tidak dapat dibatalkan.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setHapusTarget(null)}
            className="btn-ghost px-5 py-2.5 text-sm font-semibold text-white"
          >
            Batal
          </button>
          <button
            onClick={konfirmHapus}
            className="inline-flex items-center gap-2 rounded-[var(--radius-xl)] bg-gradient-to-br from-[#f43f5e] to-[#e11d48] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(244,63,94,0.5)] transition hover:brightness-110"
          >
            <TrashIcon width={16} height={16} /> Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
}