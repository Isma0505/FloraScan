"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Home,
  ScanLine,
  History,
  Heart,
  Settings as SettingsIcon,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, useT } from "@/lib/store";
import { useTheme } from "next-themes";
import type { View } from "@/lib/store";
<<<<<<< HEAD
import { AuthControl } from "@/components/auth-dialog";
=======
>>>>>>> origin/main

const navItems: { key: View; icon: typeof Home }[] = [
  { key: "home", icon: Home },
  { key: "scanner", icon: ScanLine },
  { key: "history", icon: History },
  { key: "favorites", icon: Heart },
  { key: "settings", icon: SettingsIcon },
];

export function Navbar() {
  const t = useT();
  const { view, setView, locale, setLocale } = useAppStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    const current = resolvedTheme ?? theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <button
          onClick={() => setView("home")}
          className="group flex items-center gap-2.5"
          aria-label={t.brand}
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-300 ring-2 ring-background" />
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-base font-bold leading-tight tracking-tight">
              {t.brand}
            </div>
            <div className="text-[10px] leading-tight text-muted-foreground">
              {t.tagline}
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.nav[item.key === "home" ? "home" : item.key]}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
<<<<<<< HEAD
          <AuthControl />
=======
>>>>>>> origin/main
          {/* Language toggle */}
          <button
            onClick={() => setLocale(locale === "id" ? "en" : "id")}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-2 text-xs font-semibold uppercase transition-colors hover:bg-accent"
            title={t.settings.language}
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
            aria-label="Toggle theme"
            title={t.settings.appearance}
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = view === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setView(item.key);
                      setMobileOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t.nav[item.key === "home" ? "home" : item.key]}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
