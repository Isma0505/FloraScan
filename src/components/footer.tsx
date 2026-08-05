"use client";

import { Leaf, Github, Heart, Sparkles } from "lucide-react";
import { useAppStore, useT } from "@/lib/store";

export function Footer() {
  const t = useT();
  const { setView } = useAppStore();

  return (
    <footer className="mt-auto border-t border-border/60 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-bold">{t.brand}</div>
                <div className="text-[11px] text-muted-foreground">{t.tagline}</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>
                Gemini 2.5 Flash Lite · Vision AI
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t.footer.product}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => setView("scanner")}
                  className="transition-colors hover:text-primary"
                >
                  {t.nav.scanner}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("history")}
                  className="transition-colors hover:text-primary"
                >
                  {t.nav.history}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("favorites")}
                  className="transition-colors hover:text-primary"
                >
                  {t.nav.favorites}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("settings")}
                  className="transition-colors hover:text-primary"
                >
                  {t.nav.settings}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t.footer.resources}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Gemini API Key
                </a>
              </li>
              <li>
                <a
                  href="https://ai.google.dev/gemini-api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Gemini Docs
                </a>
              </li>
              <li>
                <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  shadcn/ui
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Next.js 16
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
          </p>
          <p className="flex items-center gap-1.5">
            {t.footer.madeWith}{" "}
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />{" "}
            {t.footer.andGemini}
          </p>
        </div>
      </div>
    </footer>
  );
}
