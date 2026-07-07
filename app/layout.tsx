import type { Metadata } from "next";
import { Inter, Amiri, Lateef } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });
const lateef = Lateef({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-lateef" });

export const metadata: Metadata = {
  title: "Noor-ul-Quran — Read, Listen & Reflect",
  description:
    "A complete Islamic platform: read the Holy Quran with translation and tafsir, listen to reciters, track prayer times, use the Qibla compass, tasbeeh counter, daily duas and more — all in one place.",
  manifest: "/manifest.json",
  themeColor: "#0F5132",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} ${lateef.variable} font-sans`}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
