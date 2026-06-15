import React from "react";

export default function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8">
      <p className="font-semibold text-red-900">{title}</p>
      <p className="mt-2 text-sm text-red-800">{message}</p>
    </div>
  );
}
