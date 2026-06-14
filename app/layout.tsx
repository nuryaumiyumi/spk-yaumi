import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SPK Cabai Premium - Sistem Pemilihan Bibit Cabai Terbaik",
  description: "Sistem pendukung keputusan pemilihan bibit cabai premium menggunakan metode SAW",
};

// Komponen header profile sederhana (bisa dipisah ke file sendiri)
function ProfileHeader() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-end items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">Petani Maju</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            P
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <ProfileHeader />
          <main className="p-6 sm:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}