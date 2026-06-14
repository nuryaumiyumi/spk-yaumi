"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const menuItems = [
  { name: "Beranda", href: "/", icon: "🏠" },
  { name: "Kriteria", href: "/kriteria", icon: "📊" },
  { name: "Alternatif", href: "/alternatif", icon: "🌶️" },
  { name: "Perhitungan", href: "/perhitungan", icon: "📐" },
  { name: "Hasil Keputusan", href: "/hasil", icon: "🏆" },
  { name: "Laporan", href: "/laporan", icon: "📄" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - TANPA FOOTER */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        <div className="px-6 py-8 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">SPK Cabai</h1>
              <p className="text-xs text-gray-400">Premium v2.1</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto sidebar-scroll">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/30"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* HAPUS SEMUA FOOTER: tidak ada hr, card, user profile, copyright */}
      </aside>
    </>
  );
}