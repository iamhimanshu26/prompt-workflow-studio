"use client";

import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n/LangProvider";
import LangToggle from "@/components/LangToggle";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <LangToggle />
      {children}
    </LangProvider>
  );
}

