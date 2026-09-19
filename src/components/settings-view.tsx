"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  Sun,
  Moon,
  Monitor,
  Languages,
  Database,
  Info,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, useT } from "@/lib/store";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Locale } from "@/lib/i18n";
import { clearHistory } from "@/lib/storage";

export function SettingsView() {
  const t = useT();
  const { locale, setLocale } = useAppStore();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleClearAll = async () => {
    setClearing(true);
    try {
      clearHistory();
      toast.success(t.history.deleted);
    } catch {
      toast.error(t.toast.deleteError);
    } finally {
      setClearing(false);
    }
  };

  return (
    <section className="relative">
      <div className="mesh-bg absolute inset-0 -z-10" />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {t.settings.title}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.settings.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{t.settings.subtitle}</p>
        </div>

        <div className="mt-8 space-y-5">
          {/* Appearance */}
          <SettingsCard icon={Sun} title={t.settings.appearance} desc={t.settings.appearanceDesc}>
            <div className="grid grid-cols-3 gap-2">
              <ThemeOption
                icon={Sun}
                label={t.settings.light}
                active={mounted && theme === "light"}
                onClick={() => setTheme("light")}
              />
              <ThemeOption
                icon={Moon}
                label={t.settings.dark}
                active={mounted && theme === "dark"}
                onClick={() => setTheme("dark")}
              />
              <ThemeOption
                icon={Monitor}
                label={t.settings.system}
                active={mounted && (theme === "system" || !theme)}
                onClick={() => setTheme("system")}
              />
            </div>
          </SettingsCard>

          {/* Language */}
          <SettingsCard icon={Languages} title={t.settings.language} desc={t.settings.languageDesc}>
            <div className="grid grid-cols-2 gap-2">
              <LangOption
                label={t.settings.indonesian}
                code="ID"
                active={locale === "id"}
                onClick={() => setLocale("id" as Locale)}
              />
              <LangOption
                label={t.settings.english}
                code="EN"
                active={locale === "en"}
                onClick={() => setLocale("en" as Locale)}
              />
            </div>
          </SettingsCard>

          {/* Data */}
          <SettingsCard icon={Database} title={t.settings.data} desc={t.settings.dataDesc}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
                  disabled={clearing}
                >
                  <Trash2 className="h-4 w-4" />
                  {t.settings.clearAll}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.settings.confirmClearAll}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.settings.confirmClearAllDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t.settings.clearAll}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsCard>

          {/* About */}
          <SettingsCard icon={Info} title={t.settings.about} desc={t.settings.aboutDesc}>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">Gemini 2.5 Flash Lite</span>
              </div>
              <div className="text-muted-foreground">
                {t.settings.version}: <span className="font-mono">1.0.0</span>
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>
    </section>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof Sun;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
    >
      <div className="flex items-start gap-3 border-b border-border/60 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function ThemeOption({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Sun;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:bg-accent"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function LangOption({
  label,
  code,
  active,
  onClick,
}: {
  label: string;
  code: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:bg-accent"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-lg font-extrabold tracking-tight">{code}</span>
    </button>
  );
}
