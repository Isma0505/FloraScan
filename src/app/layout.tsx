import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FloraScan AI — Pemindai Tumbuhan Cerdas | AI Plant Scanner",
  description:
    "Identifikasi bunga & tumbuhan apa pun dalam seketika dengan AI Gemini 2.5 Flash Lite. Unggah foto, pindai, dan dapatkan informasi lengkap tanaman secara ilmiah.",
  keywords: [
    "AI Plant Scanner",
    "FloraScan",
    "Identifikasi Tumbuhan",
    "Gemini AI",
    "Pemindai Bunga",
    "Plant Identification",
  ],
  authors: [{ name: "FloraScan AI" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "FloraScan AI — Pemindai Tumbuhan Cerdas",
    description: "Identifikasi tumbuhan apa pun dengan AI Gemini 2.5 Flash Lite",
    siteName: "FloraScan AI",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1f17" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
