"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Check,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useRefrigerator } from "@/context/RefrigeratorContext";

type Detected = {
  name: string;
  quantity: number;
  section: "top" | "middle" | "vegetable";
};

type Phase = "idle" | "processing" | "results";

export default function ScanPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [detected, setDetected] = useState<Detected[]>([]);
  const [accepted, setAccepted] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useRefrigerator();

  const handleFile = async (file: File) => {
    setPhase("processing");
    setError(null);
    setDetected([]);

    // Show preview
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setPreviewUrl(base64);

    try {
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Noe gikk galt.");
        setPhase("idle");
        return;
      }
      const items = (data.items ?? []) as Detected[];
      if (items.length === 0) {
        setError("Klarte ikke å lese varer fra dette bildet. Prøv et tydeligere bilde.");
        setPhase("idle");
        return;
      }
      setDetected(items);
      setAccepted(new Set(items.map((_, i) => i)));
      setPhase("results");
    } catch {
      setError("Klarte ikke å kontakte serveren.");
      setPhase("idle");
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = ""; // allow re-pick same file
  };

  const confirm = () => {
    detected.forEach((d, i) => {
      if (accepted.has(i)) {
        // duplicate by quantity
        for (let q = 0; q < (d.quantity || 1); q++) {
          addItem(d.name, d.section);
        }
      }
    });
    reset();
  };

  const reset = () => {
    setPhase("idle");
    setDetected([]);
    setAccepted(new Set());
    setError(null);
    setPreviewUrl(null);
  };

  return (
    <div className="px-5 lg:px-12 py-6 lg:py-12 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Scan"
        title="Scan kvitteringen din"
        description="Ta et bilde av kvitteringen, så finner Claude varene og legger dem på rett hylle."
      />

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPick}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        className="hidden"
      />

      <div className="mt-8 lg:mt-12">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="card p-6 lg:p-10 flex flex-col items-center text-center gap-6"
            >
              <div className="size-20 rounded-3xl bg-sage-50 ring-1 ring-sage-100 grid place-items-center">
                <Camera size={32} strokeWidth={1.5} className="text-sage-700" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-[18px] font-semibold tracking-tight">
                  Klar når du er
                </h2>
                <p className="text-[14px] text-ink-3 max-w-md">
                  Vi bruker Claude Vision til å lese varer og hyllekategorier
                  fra norske kvitteringer.
                </p>
              </div>
              <div className="w-full max-w-sm flex flex-col gap-2.5">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-sage-600 hover:bg-sage-700 text-white text-[14px] font-medium rounded-xl py-3.5 transition-colors"
                >
                  <Camera size={16} strokeWidth={1.75} />
                  Ta bilde av kvittering
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-2 text-[14px] font-medium text-ink-2 hover:text-ink hover:bg-[var(--color-line-soft)] rounded-xl py-3 transition-colors"
                >
                  <Upload size={16} strokeWidth={1.75} />
                  Last opp bilde
                </button>
              </div>

              {error && (
                <div className="w-full max-w-sm rounded-xl bg-[var(--color-danger-soft)]/40 border border-[var(--color-danger-soft)] px-3.5 py-2.5 flex items-start gap-2.5 text-left">
                  <AlertCircle
                    size={15}
                    strokeWidth={1.75}
                    className="text-[var(--color-danger)] mt-0.5 shrink-0"
                  />
                  <span className="text-[12.5px] text-ink-2">{error}</span>
                </div>
              )}
            </motion.div>
          )}

          {phase === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="card p-10 flex flex-col items-center text-center gap-5"
            >
              {previewUrl && (
                <div className="relative max-w-[160px] rounded-2xl overflow-hidden ring-1 ring-[var(--color-line)] shadow-sm">
                  <img
                    src={previewUrl}
                    alt="Kvittering"
                    className="block w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-sage-900/10" />
                </div>
              )}
              <ProcessingAnimation />
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-semibold tracking-tight">
                  Leser kvitteringen…
                </h2>
                <p className="text-[14px] text-ink-3">
                  Identifiserer varer og kategoriserer dem
                </p>
              </div>
            </motion.div>
          )}

          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-[16px] font-semibold tracking-tight">
                    Vi fant {detected.length}{" "}
                    {detected.length === 1 ? "vare" : "varer"}
                  </h2>
                  <p className="text-[12.5px] text-ink-3 mt-0.5">
                    Hak av de du vil legge til
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sage-700 bg-sage-50 ring-1 ring-sage-100 px-2.5 py-1 rounded-full">
                  <Sparkles size={11} />
                  Claude
                </span>
              </div>

              <div className="card divide-y divide-[var(--color-line-soft)]">
                {detected.map((item, i) => {
                  const checked = accepted.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setAccepted((s) => {
                          const next = new Set(s);
                          if (next.has(i)) next.delete(i);
                          else next.add(i);
                          return next;
                        });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--color-line-soft)]/50 transition-colors first:rounded-t-3xl last:rounded-b-3xl text-left"
                    >
                      <span
                        className={[
                          "size-5 rounded-md grid place-items-center transition-colors",
                          checked
                            ? "bg-sage-600 text-white"
                            : "bg-cream-deep ring-1 ring-[var(--color-line)]",
                        ].join(" ")}
                      >
                        {checked && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span className="flex-1 text-[14px] font-medium text-ink">
                        {item.name}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[11px] font-medium text-ink-3 tabular-nums">
                          ×{item.quantity}
                        </span>
                      )}
                      <span className="text-[11px] text-ink-3 px-2 py-0.5 rounded-full bg-cream-deep">
                        {sectionLabel(item.section)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={reset}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-[14px] font-medium text-ink-2 hover:bg-[var(--color-line-soft)] transition-colors"
                >
                  <X size={14} /> Avbryt
                </button>
                <button
                  onClick={confirm}
                  disabled={accepted.size === 0}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-[14px] font-medium bg-sage-600 hover:bg-sage-700 disabled:bg-sage-200 disabled:text-sage-400 text-white transition-colors"
                >
                  <Check size={14} /> Legg{" "}
                  {accepted.size > 0 && `${accepted.size} `}i kjøleskapet
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProcessingAnimation() {
  return (
    <div className="relative size-20 grid place-items-center">
      <motion.div
        className="absolute inset-0 rounded-3xl bg-sage-50"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-2 rounded-2xl bg-sage-100"
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <div className="relative size-12 rounded-xl bg-sage-600 grid place-items-center">
        <Sparkles size={20} strokeWidth={1.75} className="text-white" />
      </div>
    </div>
  );
}

function sectionLabel(s: "top" | "middle" | "vegetable") {
  return s === "top" ? "Øverst" : s === "middle" ? "Midt" : "Grønnsak";
}
