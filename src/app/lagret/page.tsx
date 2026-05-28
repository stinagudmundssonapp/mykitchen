"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon, Bookmark, Clock, Tag } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const MOCK_SAVED = [
  {
    title: "Pasta cacio e pepe",
    source: "matprat.no",
    tags: ["Italiensk", "Rask"],
    time: "20 min",
  },
  {
    title: "Krydret laks med ris",
    source: "AI-generert",
    tags: ["Hverdag", "Fisk"],
    time: "30 min",
  },
  {
    title: "Vegetargryte med kikerter",
    source: "godt.no",
    tags: ["Vegetar", "Krydret"],
    time: "40 min",
  },
];

export default function LagretPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="px-5 lg:px-12 py-6 lg:py-12 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Bibliotek"
        title="Dine lagrede oppskrifter"
        description="Importer fra matprat.no, godt.no eller andre — eller lagre AI-forslag du liker."
      />

      <div className="mt-8 card p-4 lg:p-5 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        <div className="flex items-center gap-2 flex-1 bg-cream-deep rounded-xl px-3.5 py-2.5 ring-1 ring-[var(--color-line)] focus-within:ring-sage-300 transition-all">
          <LinkIcon size={15} strokeWidth={1.75} className="text-ink-3" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Lim inn URL fra matprat.no, godt.no…"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-4"
          />
        </div>
        <button
          disabled={!url.trim()}
          className="bg-sage-600 hover:bg-sage-700 disabled:bg-sage-200 disabled:text-sage-400 text-white text-[13px] font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          Importer
        </button>
      </div>

      <div className="mt-8 flex items-center gap-2 px-1">
        <Bookmark size={14} strokeWidth={1.75} className="text-ink-3" />
        <h2 className="text-[13px] font-semibold tracking-tight text-ink-2">
          {MOCK_SAVED.length} lagrede
        </h2>
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        {MOCK_SAVED.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.3 }}
            className="card p-4 lg:p-5 flex items-center gap-4 hover:border-sage-200 hover:shadow-[var(--shadow-md)] transition-all cursor-pointer"
          >
            <div className="size-12 rounded-2xl bg-sage-50 grid place-items-center shrink-0">
              <Bookmark size={16} strokeWidth={1.75} className="text-sage-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold tracking-tight text-ink truncate">
                {r.title}
              </div>
              <div className="flex items-center gap-3 mt-1 text-[12px] text-ink-3">
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} /> {r.time}
                </span>
                <span>{r.source}</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream-deep text-ink-3 text-[10.5px] font-medium ring-1 ring-[var(--color-line)]"
                  >
                    <Tag size={9} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-ink-4 text-lg">→</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
