import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Shell from "@/components/Shell";
import { AppProvider } from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "SPK Cabai Premium - Sistem Pemilihan Bibit Cabai Terbaik",
  description:
    "Sistem pendukung keputusan pemilihan bibit cabai premium menggunakan metode SAW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* Tinggi viewport tetap + overflow-hidden => layout utama tidak scroll */}
      <body className="h-dvh overflow-hidden">
        <AppProvider>
          <div className="flex h-full flex-col overflow-hidden">
            <Header />
            <Shell>{children}</Shell>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
