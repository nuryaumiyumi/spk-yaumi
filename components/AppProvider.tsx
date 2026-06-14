"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Alternatif } from "@/types";
import { dataAlternatif as bawaanAlternatif } from "@/lib/saw";

export interface Notif {
  id: string;
  pesan: string;
  waktu: number;
  dibaca: boolean;
}

type DataAlternatif = Omit<Alternatif, "id">;

interface AppContextValue {
  alternatif: Alternatif[];
  tambahAlternatif: (data: DataAlternatif) => void;
  ubahAlternatif: (id: string, data: DataAlternatif) => void;
  hapusAlternatif: (id: string) => void;
  resetAlternatif: () => void;
  notifikasi: Notif[];
  belumDibaca: number;
  tandaiDibaca: () => void;
  bersihkanNotifikasi: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const LS_ALT = "spk-cabai:alternatif";
const LS_NOTIF = "spk-cabai:notifikasi";

const buatId = (awalan: string) =>
  `${awalan}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [alternatif, setAlternatif] = useState<Alternatif[]>(bawaanAlternatif);
  const [notifikasi, setNotifikasi] = useState<Notif[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Muat dari localStorage setelah mount. Aman untuk SSR: nilai awal di server
  // dan render pertama klien selalu = data bawaan, baru diganti setelah hydrate.
  /* eslint-disable react-hooks/set-state-in-effect -- hidrasi satu kali dari localStorage */
  useEffect(() => {
    try {
      const a = localStorage.getItem(LS_ALT);
      if (a) setAlternatif(JSON.parse(a));
      const n = localStorage.getItem(LS_NOTIF);
      if (n) setNotifikasi(JSON.parse(n));
    } catch {
      /* localStorage tidak tersedia — abaikan */
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_ALT, JSON.stringify(alternatif));
    } catch {
      /* abaikan */
    }
  }, [alternatif, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_NOTIF, JSON.stringify(notifikasi));
    } catch {
      /* abaikan */
    }
  }, [notifikasi, hydrated]);

  const pushNotif = useCallback((pesan: string) => {
    setNotifikasi((prev) =>
      [
        { id: buatId("n"), pesan, waktu: Date.now(), dibaca: false },
        ...prev,
      ].slice(0, 30)
    );
  }, []);

  const tambahAlternatif = useCallback(
    (data: DataAlternatif) => {
      setAlternatif((prev) => [...prev, { ...data, id: buatId("a") }]);
      pushNotif(`Alternatif "${data.nama}" berhasil ditambahkan.`);
    },
    [pushNotif]
  );

  const ubahAlternatif = useCallback(
    (id: string, data: DataAlternatif) => {
      setAlternatif((prev) => prev.map((x) => (x.id === id ? { ...data, id } : x)));
      pushNotif(`Alternatif "${data.nama}" berhasil diperbarui.`);
    },
    [pushNotif]
  );

  const hapusAlternatif = useCallback(
    (id: string) => {
      const target = alternatif.find((x) => x.id === id);
      setAlternatif((prev) => prev.filter((x) => x.id !== id));
      if (target) pushNotif(`Alternatif "${target.nama}" berhasil dihapus.`);
    },
    [alternatif, pushNotif]
  );

  const resetAlternatif = useCallback(() => {
    setAlternatif(bawaanAlternatif);
    pushNotif("Data alternatif dikembalikan ke bawaan.");
  }, [pushNotif]);

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
