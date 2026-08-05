"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LandingHero } from "@/components/landing-hero";
import { ScannerView } from "@/components/scanner-view";
import { HistoryView } from "@/components/history-view";
import { SettingsView } from "@/components/settings-view";

export default function Home() {
  const view = useAppStore((s) => s.view);

  // Update <html lang> based on locale for a11y
  const locale = useAppStore((s) => s.locale);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {view === "home" && <LandingHero />}
            {view === "scanner" && <ScannerView />}
            {view === "history" && <HistoryView />}
            {view === "favorites" && <HistoryView favoritesOnly />}
            {view === "settings" && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
