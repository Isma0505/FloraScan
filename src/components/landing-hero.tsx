"use client";

import { motion } from "framer-motion";
import {
  ScanLine,
  Sparkles,
  ArrowRight,
  Brain,
  BookOpen,
  History,
  Languages,
  Moon,
  Smartphone,
  Upload,
  Camera,
  Eye,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, useT } from "@/lib/store";
import { FloatingLeaves } from "@/components/botanical-deco";
import Image from "next/image";

export function LandingHero() {
  const t = useT();
  const { setView, apiKey } = useAppStore();
  const hasKey = apiKey.length > 10;

  return (
    <section className="relative overflow-hidden">
      <div className="mesh-bg absolute inset-0 -z-10" />
      <FloatingLeaves />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t.hero.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {t.hero.title.split(" ").slice(0, -2).join(" ")}{" "}
              </span>
              <span className="bg-gradient-to-br from-primary to-emerald-500 bg-clip-text text-transparent">
                {t.hero.title.split(" ").slice(-2).join(" ")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => setView("scanner")}
                className="group w-full gap-2 rounded-full bg-primary px-7 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 sm:w-auto"
              >
                <ScanLine className="h-4 w-4" />
                {t.hero.ctaScan}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full rounded-full sm:w-auto"
              >
                {t.hero.ctaLearn}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-6"
            >
              <Stat value="400K+" label={t.hero.stat1} />
              <Stat value="98%" label={t.hero.stat2} />
              <Stat value="<3s" label={t.hero.stat3} />
            </motion.div>

            {!hasKey && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-xs text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t.scanner.needApiKeyDesc}
              </motion.div>
            )}
          </div>

          {/* Right: hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-3xl border border-border/60 shadow-2xl shadow-primary/10">
              <Image
                src="/hero-plants.jpg"
                alt="Tropical botanical plants"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Floating scan card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl glass border border-white/20 p-3 shadow-xl"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">
                    {t.result.latinName}
                  </div>
                  <div className="truncate text-sm font-semibold">
                    Monstera deliciosa
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[10px] uppercase text-muted-foreground">
                    {t.result.confidence}
                  </div>
                  <div className="text-sm font-bold text-primary">97%</div>
                </div>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 -top-2 flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold shadow-lg border border-border sm:-right-4"
            >
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              AI Vision
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <Features />

      {/* How it works */}
      <HowItWorks />
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <div className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Features() {
  const t = useT();
  const items = [
    { icon: Brain, title: t.features.f1Title, desc: t.features.f1Desc },
    { icon: BookOpen, title: t.features.f2Title, desc: t.features.f2Desc },
    { icon: History, title: t.features.f3Title, desc: t.features.f3Desc },
    { icon: Languages, title: t.features.f4Title, desc: t.features.f4Desc },
    { icon: Moon, title: t.features.f5Title, desc: t.features.f5Desc },
    { icon: Smartphone, title: t.features.f6Title, desc: t.features.f6Desc },
  ];
  return (
    <div className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.features.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{t.features.subtitle}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const t = useT();
  const steps = [
    { icon: Upload, title: t.how.step1Title, desc: t.how.step1Desc },
    { icon: Brain, title: t.how.step2Title, desc: t.how.step2Desc },
    { icon: Eye, title: t.how.step3Title, desc: t.how.step3Desc },
  ];
  return (
    <div id="how-it-works" className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Camera className="h-3.5 w-3.5" />
            {t.how.title}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.how.title}
          </h2>
        </div>

        <div className="relative mt-12 grid gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-1/6 right-1/6 top-7 hidden h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 md:block" />
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-primary ring-2 ring-primary/30">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
