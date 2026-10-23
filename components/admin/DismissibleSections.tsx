"use client";

import { useState, type ReactNode } from "react";

type Section = {
  id: string;
  content: ReactNode;
  full?: boolean;
};

export default function DismissibleSections({
  sections,
}: {
  sections: Section[];
}) {
  const [closing, setClosing] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);

  function tutup(id: string) {
    setClosing((c) => [...c, id]);
    setTimeout(() => setHidden((h) => [...h, id]), 300);
  }

  function tampilkanSemua() {
    setClosing([]);
    setHidden([]);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections
          .filter((s) => !hidden.includes(s.id))
          .map((s) => (
            <div
              key={s.id}
              className={`relative rounded-2xl border border-[#FFD3A5] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                s.full ? "sm:col-span-2 lg:col-span-4" : ""
              } ${
                closing.includes(s.id)
                  ? "scale-90 opacity-0"
                  : "scale-100 opacity-100"
              }`}
            >
              <button
                type="button"
                onClick={() => tutup(s.id)}
                aria-label="Tutup"
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs text-[#C9A582] transition-colors hover:bg-[#FF5900] hover:text-white"
              >
                ✕
              </button>
              <div className="pr-6">{s.content}</div>
            </div>
          ))}
      </div>

      {hidden.length > 0 && (
        <button
          type="button"
          onClick={tampilkanSemua}
          className="mt-4 rounded-full border border-[#FFAA6E] bg-[#FFD3A5]/40 px-4 py-2 text-sm font-semibold text-[#FF5900] transition-colors hover:bg-[#FFD3A5]"
        >
          ↺ Tampilkan lagi ({hidden.length})
        </button>
      )}
    </div>
  );
}