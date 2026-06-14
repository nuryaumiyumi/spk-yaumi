"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useApp } from "@/components/AppProvider";
import { waktuRelatif } from "@/lib/format";
import {
  HomeIcon,
  CriteriaIcon,
  AlternatifIcon,
  PerhitunganIcon,
  HasilIcon,
  LaporanIcon,
  InfoIcon,
  BellIcon,
  ChevronDownIcon,
  MenuIcon,
  ChiliIcon,
  SigmaIcon,
} from "./icons";

/* Used only by the mobile drawer (desktop nav lives in the sidebar) */
const navItems = [
  { name: "Beranda", href: "/", Icon: HomeIcon },
  { name: "Kriteria", href: "/kriteria", Icon: CriteriaIcon },
  { name: "Alternatif", href: "/alternatif", Icon: AlternatifIcon },
  { name: "Perhitungan", href: "/perhitungan", Icon: PerhitunganIcon },
  { name: "Detail Perhitungan", href: "/detail-perhitungan", Icon: SigmaIcon },
  { name: "Hasil Keputusan", href: "/hasil", Icon: HasilIcon },
  { name: "Laporan", href: "/laporan", Icon: LaporanIcon },
  { name: "Informasi", href: "/informasi", Icon: InfoIcon },
];

function BrandMark() {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] ring-1 ring-[rgba(46,232,95,0.35)] shadow-[0_0_18px_-6px_rgba(46,232,95,0.6)]">
      <ChiliIcon width={20} height={20} />
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { notifikasi, belumDibaca, tandaiDibaca, bersihkanNotifikasi } =
    useApp();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleNotif = () => {
    setNotifOpen((v) => {
      const next = !v;
      if (next) tandaiDibaca();
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/0 backdrop-blur-sm">
      <div className="mx-auto w-full px-4 pb-3 pt-4 sm:px-5">
        <div className="glass flex h-[68px] items-center justify-between gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="leading-none">
              <span className="block text-sm font-extrabold tracking-wide text-white sm:text-base">
                SPK CABAI
              </span>
              <span className="block text-[10px] font-bold tracking-[0.3em] text-gradient-green">
                PREMIUM
              </span>
            </span>
          </Link>

          {/* Right cluster: bell + profile (+ mobile menu) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotif}
                className="relative grid h-10 w-10 place-items-center rounded-xl text-[var(--text-muted)] ring-1 ring-[var(--border)] transition hover:text-white hover:ring-[rgba(46,232,95,0.35)]"
                aria-label="Notifikasi"
              >
                <BellIcon width={18} height={18} />
                {belumDibaca > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-[var(--surface)]">
                    {belumDibaca > 9 ? "9+" : belumDibaca}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="glass animate-fadeIn absolute right-0 top-12 z-50 w-80 origin-top-right overflow-hidden p-0">
                    <div className="head-bar flex items-center justify-between px-4 py-3">
                      <p className="text-sm font-semibold text-white">
                        Notifikasi
                      </p>
                      {notifikasi.length > 0 && (
                        <button
                          onClick={bersihkanNotifikasi}
                          className="text-xs font-medium text-[var(--text-muted)] transition hover:text-white"
                        >
                          Bersihkan
                        </button>
                      )}
                    </div>
                    <div className="sidebar-scroll max-h-80 overflow-y-auto">
                      {notifikasi.length === 0 ? (
                        <p className="px-4 py-10 text-center text-sm text-[var(--text-dim)]">
                          Belum ada notifikasi
                        </p>
                      ) : (
                        notifikasi.map((n) => (
                          <div
                            key={n.id}
                            className="flex gap-3 border-t border-[var(--border)] px-4 py-3 first:border-t-0"
                          >
                            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[rgba(46,232,95,0.12)] text-[var(--neon)]">
                              <BellIcon width={14} height={14} />
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm leading-snug text-[var(--text)]">
                                {n.pesan}
                              </p>
                              <p className="mt-0.5 text-[11px] text-[var(--text-dim)]">
                                {waktuRelatif(n.waktu)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <span className="hidden h-8 w-px bg-[var(--border)] sm:block" />

            <button className="flex items-center gap-2.5 rounded-xl py-1 pl-1.5 pr-2 transition hover:bg-white/[0.04] sm:pr-3">
              <span
                className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-[rgba(46,232,95,0.45)]"
                style={{ backgroundImage: "url('/cabai-header-sidebar.jpeg')" }}
              />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-semibold text-white">
                  Petani Maju
                </span>
                <span className="block text-[11px] text-[var(--text-dim)]">
                  Administrator
                </span>
              </span>
              <ChevronDownIcon
                width={16}
                height={16}
                className="hidden text-[var(--text-dim)] sm:block"
              />
            </button>

            {/* Mobile menu toggle (sidebar is hidden below lg) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl text-white ring-1 ring-[var(--border)] lg:hidden"
              aria-label="Menu"
            >
              <MenuIcon width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="glass animate-fadeIn absolute right-3 top-3 w-64 origin-top-right space-y-1 rounded-2xl p-3">
            <div className="mb-2 flex items-center gap-2.5 px-2 py-1">
              <BrandMark />
              <span className="text-sm font-extrabold text-white">
                SPK CABAI
              </span>
            </div>
            {navItems.map(({ name, href, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[rgba(46,232,95,0.14)] text-white ring-1 ring-[rgba(46,232,95,0.3)]"
                      : "text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    width={18}
                    height={18}
                    className={active ? "text-[var(--neon)]" : ""}
                  />
                  {name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
