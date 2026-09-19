"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Locale, Dict } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

export type View = "home" | "scanner" | "history" | "favorites" | "settings";

interface AppState {
  // Navigation
  view: View;
  setView: (v: View) => void;

  // Language
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "home",
      setView: (v) => {
        set({ view: v });
        // Scroll to top on view change
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      locale: "id",
      setLocale: (l) => set({ locale: l }),
<<<<<<< HEAD
      t: translations.id as Dict,
=======
      t: translations.id,
>>>>>>> origin/main
    }),
    {
      name: "florascan-store",
      storage: createJSONStorage(() => localStorage),
      // Persist locale only; derive t each load
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
<<<<<<< HEAD
          state.t = (translations[state.locale] ?? translations.id) as Dict;
=======
          state.t = translations[state.locale] ?? translations.id;
>>>>>>> origin/main
        }
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        const locale = p.locale ?? current.locale;
        return {
          ...current,
          ...p,
          locale,
<<<<<<< HEAD
          t: (translations[locale] ?? translations.id) as Dict,
=======
          t: translations[locale] ?? translations.id,
>>>>>>> origin/main
        };
      },
    }
  )
);

/** Selector hook that returns the active translation dictionary. */
export function useT() {
  const locale = useAppStore((s) => s.locale);
  return translations[locale] ?? translations.id;
}
