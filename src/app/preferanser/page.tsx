"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { usePreferences, type Preferences } from "@/context/PreferencesContext";

const ALLERGIES = [
  "Gluten",
  "Laktose",
  "Nøtter",
  "Egg",
  "Skalldyr",
  "Soya",
  "Fisk",
];
const DIETS = ["Alt", "Vegetar", "Vegan", "Pescetarian", "Keto"];
const BUDGETS: { id: Preferences["budget"]; label: string; sub: string }[] = [
  { id: "low", label: "Lav", sub: "Smart & rimelig" },
  { id: "mid", label: "Middels", sub: "Balansert" },
  { id: "high", label: "Høy", sub: "Kvalitet teller mest" },
];

export default function PreferanserPage() {
  const { prefs, setPrefs, hydrated } = usePreferences();
  const [savedFlash, setSavedFlash] = useState(false);

  // Auto-flash "Lagret" briefly after any change (except initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    setSavedFlash(true);
    const t = setTimeout(() => setSavedFlash(false), 1500);
    return () => clearTimeout(t);
  }, [prefs, hydrated]);

  const toggleAllergy = (a: string) => {
    setPrefs({
      allergies: prefs.allergies.includes(a)
        ? prefs.allergies.filter((x) => x !== a)
        : [...prefs.allergies, a],
    });
  };

  return (
    <div className="px-5 lg:px-12 py-6 lg:py-12 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Preferanser"
        title="Smaken din"
        description="Vi bruker dette til å foreslå middager som passer akkurat deg. Lagres automatisk."
      />

      {/* Floating "Lagret" toast */}
      <AnimatePresence>
        {savedFlash && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 lg:top-6 right-5 lg:right-12 z-40 bg-sage-600 text-white text-[12px] font-medium px-3 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5"
          >
            <Check size={12} strokeWidth={2.5} />
            Lagret
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex flex-col gap-8">
        <Section title="Allergier" hint="Vi unngår disse alltid">
          <div className="flex flex-wrap gap-2">
            {ALLERGIES.map((a) => {
              const on = prefs.allergies.includes(a);
              return (
                <motion.button
                  key={a}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleAllergy(a)}
                  className={[
                    "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all",
                    on
                      ? "bg-sage-600 text-white"
                      : "bg-surface ring-1 ring-[var(--color-line)] text-ink-2 hover:ring-sage-200",
                  ].join(" ")}
                >
                  {on && <Check size={12} strokeWidth={2.5} />}
                  {a}
                </motion.button>
              );
            })}
          </div>
        </Section>

        <Section title="Diett">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DIETS.map((d) => {
              const on = prefs.diet === d;
              return (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPrefs({ diet: d })}
                  className={[
                    "py-3 rounded-xl text-[14px] font-medium transition-all",
                    on
                      ? "bg-sage-50 ring-1 ring-sage-300 text-sage-800"
                      : "bg-surface ring-1 ring-[var(--color-line)] text-ink-2 hover:ring-sage-200",
                  ].join(" ")}
                >
                  {d}
                </motion.button>
              );
            })}
          </div>
        </Section>

        <Section
          title="Misliker"
          hint="Frittekst — skriv det du helst slipper å se"
        >
          <textarea
            value={prefs.dislikes}
            onChange={(e) => setPrefs({ dislikes: e.target.value })}
            rows={3}
            placeholder="f.eks. koriander, oliven, indrefilet…"
            className="w-full bg-surface border border-[var(--color-line)] focus:border-sage-400 rounded-2xl px-4 py-3 text-[14px] placeholder:text-ink-4 transition-colors resize-none"
          />
        </Section>

        <Section title="Husholdning" hint="Hvor mange spiser vanligvis?">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setPrefs({ household: Math.max(1, prefs.household - 1) })
              }
              className="size-11 rounded-xl bg-surface ring-1 ring-[var(--color-line)] hover:ring-sage-200 text-ink-2 transition-all"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <motion.div
                key={prefs.household}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[32px] font-semibold tracking-tight"
              >
                {prefs.household}
              </motion.div>
              <div className="text-[12px] text-ink-3">
                {prefs.household === 1 ? "person" : "personer"}
              </div>
            </div>
            <button
              onClick={() =>
                setPrefs({ household: Math.min(12, prefs.household + 1) })
              }
              className="size-11 rounded-xl bg-surface ring-1 ring-[var(--color-line)] hover:ring-sage-200 text-ink-2 transition-all"
            >
              +
            </button>
          </div>
        </Section>

        <Section title="Budsjett">
          <div className="grid grid-cols-3 gap-2">
            {BUDGETS.map((b) => {
              const on = prefs.budget === b.id;
              return (
                <motion.button
                  key={b.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPrefs({ budget: b.id })}
                  className={[
                    "py-3 px-2 rounded-2xl flex flex-col items-center gap-0.5 transition-all",
                    on
                      ? "bg-sage-50 ring-1 ring-sage-300"
                      : "bg-surface ring-1 ring-[var(--color-line)] hover:ring-sage-200",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-[14px] font-semibold",
                      on ? "text-sage-800" : "text-ink",
                    ].join(" ")}
                  >
                    {b.label}
                  </span>
                  <span className="text-[11px] text-ink-3">{b.sub}</span>
                </motion.button>
              );
            })}
          </div>
        </Section>

        <p className="text-[12px] text-ink-3 text-center pt-2">
          Alle endringer lagres automatisk på enheten din.
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-[14px] font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {hint && <p className="text-[12px] text-ink-3">{hint}</p>}
      </div>
      {children}
    </section>
  );
}
