import React from "react";
import GlowCard from "./GlowCard";

export default function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <GlowCard glow={false} className="border-red-500/30 bg-red-950/30 px-6 py-8">
      <p className="font-semibold text-red-200">{title}</p>
      <p className="mt-2 text-sm text-red-300/90">{message}</p>
    </GlowCard>
  );
}
