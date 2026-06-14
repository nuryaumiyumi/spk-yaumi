"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

/**
 * Baris isi dashboard: sidebar (tinggi penuh) + konten yang scroll sendiri.
 * Window/layout utama tidak ikut scroll — hanya <main> yang scroll vertikal.
 * Semua halaman lebar penuh (tanpa max-width); Alternatif diberi padding ekstra.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const lebarPenuh = pathname.startsWith("/alternatif");

  // Reset posisi scroll konten tiap pindah halaman.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-0 flex-1 gap-6 px-4 pb-4 pt-4 sm:px-5 lg:gap-7">
      <Sidebar />
      <main
        ref={mainRef}
        className={`sidebar-scroll min-w-0 flex-1 animate-fadeIn overflow-y-auto overflow-x-hidden pb-10 ${
          lebarPenuh ? "sm:px-4 lg:px-10 xl:px-20" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
