"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "./messages";
import { MESSAGES } from "./messages";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem("pws_lang");
  if (saved === "en" || saved === "ja") return saved;
  const nav = window.navigator.language ?? "";
  if (nav.toLowerCase().startsWith("ja")) return "ja";
  return "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("pws_lang", lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangContextValue>(() => {
    return {
      lang,
      setLang: setLangState,
      t: (key: string) => {
        const dict = MESSAGES[lang] ?? MESSAGES.en;
        return dict[key] ?? MESSAGES.en[key] ?? key;
      },
    };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

