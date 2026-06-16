"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Alternatif, Kriteria } from "@/types";
import { supabase } from "@/lib/supabaseClient";

export interface Notif {
  id: string;
  pesan: string;
  waktu: number;
  dibaca: boolean;
}

type DataAlternatif = Omit<Alternatif, "id">;
type AlternatifRow = {
  id: string;
  nama: string;
  hasil: number;
  ketahanan: number;
  harga: number;
  umur: number;
};

interface AppContextValue {
  alternatif: Alternatif[];
  kriteria: Kriteria[];
  loading: boolean;
  kriteriaLoading: boolean;
  tambahAlternatif: (data: DataAlternatif) => Promise<void>;
  ubahAlternatif: (id: string, data: DataAlternatif) => Promise<void>;
  hapusAlternatif: (id: string) => Promise<void>;
  resetAlternatif: () => Promise<void>;
  notifikasi: Notif[];
  belumDibaca: number;
  tandaiDibaca: () => void;
  bersihkanNotifikasi: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const LS_NOTIF = "spk-cabai:notifikasi";

const buatId = (awalan: string) =>
  `${awalan}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function rowToAlternatif(row: AlternatifRow): Alternatif {
  return {
    id: row.id,
    nama: row.nama,
    nilai: {
      hasil: row.hasil,
      ketahanan: row.ketahanan,
      harga: row.harga,
      umur: row.umur,
    },
  };
}

function alternatifToRow(alt: DataAlternatif): Omit<AlternatifRow, "id"> {
  return {
    nama: alt.nama,
    hasil: alt.nilai.hasil,
    ketahanan: alt.nilai.ketahanan,
    harga: alt.nilai.harga,
    umur: alt.nilai.umur,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [alternatif, setAlternatif] = useState<Alternatif[]>([]);
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [kriteriaLoading, setKriteriaLoading] = useState(true);
  const [notifikasi, setNotifikasi] = useState<Notif[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load kriteria dari Supabase
  const loadKriteria = useCallback(async () => {
    setKriteriaLoading(true);
    const { data, error } = await supabase
      .from("kriteria")
      .select("*")
      .order("urutan", { ascending: true });
    if (error) {
      console.error("Gagal load kriteria:", error);
    } else if (data) {
      setKriteria(data);
    }
    setKriteriaLoading(false);
  }, []);

  const loadAlternatif = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("alternatif")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Gagal load alternatif:", error);
      setAlternatif([]);
    } else if (data) {
      setAlternatif(data.map(rowToAlternatif));
    }
    setLoading(false);
  }, []);

  // Load notifikasi dari localStorage
  useEffect(() => {
    try {
      const n = localStorage.getItem(LS_NOTIF);
      if (n) setNotifikasi(JSON.parse(n));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_NOTIF, JSON.stringify(notifikasi));
    } catch {}
  }, [notifikasi, hydrated]);

  useEffect(() => {
    loadAlternatif();
    loadKriteria();
  }, [loadAlternatif, loadKriteria]);

  const pushNotif = useCallback((pesan: string) => {
    setNotifikasi((prev) =>
      [
        { id: buatId("n"), pesan, waktu: Date.now(), dibaca: false },
        ...prev,
      ].slice(0, 30)
    );
  }, []);

  const tambahAlternatif = useCallback(
    async (data: DataAlternatif) => {
      const row = alternatifToRow(data);
      const { data: newRow, error } = await supabase
        .from("alternatif")
        .insert(row)
        .select()
        .single();
      if (error) {
        console.error("Gagal tambah alternatif:", error);
        pushNotif(`Gagal menambahkan "${data.nama}".`);
        return;
      }
      const newAlt = rowToAlternatif(newRow);
      setAlternatif((prev) => [...prev, newAlt]);
      pushNotif(`Alternatif "${data.nama}" berhasil ditambahkan.`);
    },
    [pushNotif]
  );

  const ubahAlternatif = useCallback(
    async (id: string, data: DataAlternatif) => {
      const row = alternatifToRow(data);
      const { error } = await supabase
        .from("alternatif")
        .update(row)
        .eq("id", id);
      if (error) {
        console.error("Gagal ubah alternatif:", error);
        pushNotif(`Gagal memperbarui "${data.nama}".`);
        return;
      }
      setAlternatif((prev) =>
        prev.map((x) => (x.id === id ? { ...data, id } : x))
      );
      pushNotif(`Alternatif "${data.nama}" berhasil diperbarui.`);
    },
    [pushNotif]
  );

  const hapusAlternatif = useCallback(
    async (id: string) => {
      const target = alternatif.find((x) => x.id === id);
      const { error } = await supabase.from("alternatif").delete().eq("id", id);
      if (error) {
        console.error("Gagal hapus alternatif:", error);
        pushNotif(`Gagal menghapus "${target?.nama}".`);
        return;
      }
      setAlternatif((prev) => prev.filter((x) => x.id !== id));
      if (target) pushNotif(`Alternatif "${target.nama}" berhasil dihapus.`);
    },
    [alternatif, pushNotif]
  );

  const resetAlternatif = useCallback(async () => {
    // Ambil data alternatif dari Supabase (sudah ada seed)
    // Karena tidak ada fallback, kita hanya hapus semua lalu load ulang? 
    // Tapi lebih aman: minta user untuk mengisi ulang atau tidak perlu reset.
    // Untuk sementara, kita hanya reload dari database (tidak menghapus).
    // Atau bisa juga hapus semua dan insert ulang dari seed? Tapi seed sudah ada.
    // Kita implementasikan: hapus semua, lalu insert ulang data dari file seed? 
    // Karena kita tidak punya akses ke file seed di client, lebih baik tidak ada reset.
    // Ubah: resetAlternatif akan me-reload dari DB (refresh).
    await loadAlternatif();
    pushNotif("Data alternatif telah di-refresh dari database.");
  }, [loadAlternatif, pushNotif]);

  const tandaiDibaca = useCallback(() => {
    setNotifikasi((prev) =>
      prev.some((n) => !n.dibaca) ? prev.map((n) => ({ ...n, dibaca: true })) : prev
    );
  }, []);

  const bersihkanNotifikasi = useCallback(() => setNotifikasi([]), []);

  const belumDibaca = notifikasi.reduce((acc, n) => acc + (n.dibaca ? 0 : 1), 0);

  return (
    <AppContext.Provider
      value={{
        alternatif,
        kriteria,
        loading,
        kriteriaLoading,
        tambahAlternatif,
        ubahAlternatif,
        hapusAlternatif,
        resetAlternatif,
        notifikasi,
        belumDibaca,
        tandaiDibaca,
        bersihkanNotifikasi,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp harus dipakai di dalam <AppProvider>");
  return ctx;
}