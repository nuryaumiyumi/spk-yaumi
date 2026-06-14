"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CriteriaIcon,
  AlternatifIcon,
  PerhitunganIcon,
  HasilIcon,
  LaporanIcon,
  InfoIcon,
  RocketIcon,
  LeafIcon,
  SigmaIcon,
} from "./icons";

const menuItems = [
  { name: "Beranda", href: "/", Icon: HomeIcon },
  { name: "Kriteria", href: "/kriteria", Icon: CriteriaIcon },
  { name: "Alternatif", href: "/alternatif", Icon: AlternatifIcon },
  { name: "Perhitungan", href: "/perhitungan", Icon: PerhitunganIcon },
  { name: "Detail Perhitungan", href: "/detail-perhitungan", Icon: SigmaIcon },
  { name: "Hasil Keputusan", href: "/hasil", Icon: HasilIcon },
  { name: "Laporan", href: "/laporan", Icon: LaporanIcon },
  { name: "Informasi", href: "/informasi", Icon: InfoIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="hidden h-full w-64 shrink-0 lg:block">
      {/* Satu panel tunggal: navigasi + promo + footer digabung */}
      <div className="glass flex h-full flex-col overflow-hidden">
        <div className="sidebar-scroll flex-1 overflow-y-auto p-3.5">
          {/* Navigasi */}
          <nav className="space-y-1.5">
            {menuItems.map(({ name, href, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#34e36a] to-[#16a34a] text-[#042b13] shadow-[0_10px_26px_-12px_rgba(46,232,95,0.8)]"
                      : "text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon width={19} height={19} />
                  <span className="flex-1">{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Pemisah */}
          <div className="my-3.5 border-t border-[var(--border)]" />

          {/* Promo */}
          <div className="overflow-hidden rounded-xl">
            <div className="bg-gradient-to-br from-[#14401f] to-[#0c2412] p-4">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-semibold text-[#7dffa0] ring-1 ring-[rgba(46,232,95,0.3)]">
                <LeafIcon width={12} height={12} /> Pilih Bibit Terbaik
              </div>
              <h3 className="text-base font-extrabold leading-tight text-white">Panen Maksimal!</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#cfe8d4]">
                Gunakan sistem SPK untuk hasil yang lebih akurat dan menguntungkan.
              </p>
              <Link
                href="/perhitungan"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0c2412]/70 px-3 py-2 text-xs font-bold text-white ring-1 ring-[rgba(46,232,95,0.45)] transition hover:bg-[#0c2412]"
              >
                <RocketIcon width={14} height={14} /> Mulai Penilaian
              </Link>
            </div>
            <div
              className="h-24 w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/cabai-footer-sidebar.jpeg')" }}
            />
          </div>
        </div>

        {/* Footer menempel di dasar panel */}
        <div className="shrink-0 border-t border-[var(--border)] px-4 py-3 text-center">
          <p className="text-[11px] text-[var(--text-dim)]">© 2024 SPK Cabai Premium</p>
          <p className="text-[10px] text-[var(--text-dim)]/70">v2.1.0</p>
        </div>
      </div>
    </aside>
  );
}
