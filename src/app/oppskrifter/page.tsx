"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clock,
  Plus,
  ChefHat,
  ArrowRight,
  AlertCircle,
  Wand2,
  RefreshCw,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useRefrigerator } from "@/context/RefrigeratorContext";

type Mode = "inventory" | "craving";

interface Recipe {
  title: string;
  description: string;
  timeMinutes: number;
  estimatedMissingCost: number;
  usesExpiring: string[];
  ingredients: string[];
  missingIngredients: string[];
  steps: string[];
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const ease = [0.22, 1, 0.36, 1] as const;

export default function OppskrifterPage() {
  const { items } = useRefrigerator();
  const [mode, setMode] = useState<Mode>("inventory");
  const [craving, setCraving] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const canGenerate =
    items.length > 0 && (mode === "inventory" || craving.trim().length > 0);

  const generate = async () => {
    if (!canGenerate || loading) return;
    setLoading(true);
    setError(null);
    setRecipes([]);
    setExpanded(null);

    const payload = {
      items: items.map((it) => ({
        name: it.name,
        daysInFridge: Math.floor((Date.now() - it.addedDate) / MS_PER_DAY),
      })),
      craving: mode === "craving" ? craving.trim() : undefined,
    };

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Noe gikk galt.");
      } else {
        setRecipes(data.recipes ?? []);
      }
    } catch {
      setError("Klarte ikke å kontakte serveren.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 lg:px-12 py-6 lg:py-12 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Oppskrifter"
        title="Hva blir det i kveld?"
        description="La AI lage forslag basert på det du har — eller fortell hva du har lyst på."
      />

      {/* Mode toggle */}
      <div className="mt-8 inline-flex p-1 bg-surface ring-1 ring-[var(--color-line)] rounded-2xl relative">
        {(["inventory", "craving"] as Mode[]).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setRecipes([]);
                setError(null);
              }}
              className="relative px-4 py-2 text-[13px] font-medium z-10"
            >
              {active && (
                <motion.span
                  layoutId="mode-pill"
                  className="absolute inset-0 bg-sage-50 ring-1 ring-sage-200 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={`relative ${active ? "text-sage-800" : "text-ink-3"}`}
              >
                {m === "inventory" ? "Lag av det jeg har" : "Jeg har lyst på…"}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {mode === "craving" && (
          <motion.div
            key="craving"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-6">
              <input
                value={craving}
                onChange={(e) => setCraving(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="f.eks. pasta med kylling, noe asiatisk, en lett salat…"
                className="w-full bg-surface border border-[var(--color-line)] focus:border-sage-400 rounded-2xl px-5 py-4 text-[15px] placeholder:text-ink-4 transition-colors"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate button */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={generate}
          disabled={!canGenerate || loading}
          className="inline-flex items-center gap-2 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-200 disabled:text-sage-400 disabled:cursor-not-allowed text-white text-[14px] font-medium px-5 py-3 rounded-xl transition-colors shadow-[0_4px_14px_-4px_rgba(74,107,94,0.5)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2"
              >
                <Wand2 size={15} strokeWidth={1.75} className="animate-pulse" />
                Tenker…
              </motion.span>
            ) : recipes.length > 0 ? (
              <motion.span
                key="regen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2"
              >
                <RefreshCw size={15} strokeWidth={1.75} />
                Nye forslag
              </motion.span>
            ) : (
              <motion.span
                key="gen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2"
              >
                <Sparkles size={15} strokeWidth={1.75} />
                Foreslå middager
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {items.length > 0 && (
          <span className="text-[12px] text-ink-3">
            basert på{" "}
            <span className="text-ink-2 font-medium">{items.length}</span>{" "}
            {items.length === 1 ? "vare" : "varer"}
          </span>
        )}
      </div>

      {/* Empty state — no items in fridge */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 card p-6 flex items-center gap-4"
        >
          <div className="size-12 rounded-2xl bg-sage-50 grid place-items-center text-sage-700 shrink-0">
            <ChefHat size={18} strokeWidth={1.75} />
          </div>
          <div className="flex-1 leading-tight">
            <div className="text-[14px] font-semibold text-ink">
              Legg til varer først
            </div>
            <div className="text-[12.5px] text-ink-3 mt-0.5">
              AI trenger noe å jobbe med. Gå til kjøleskapet og legg inn det du
              har.
            </div>
          </div>
        </motion.div>
      )}

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-6 rounded-2xl border border-[var(--color-danger-soft)] bg-[var(--color-danger-soft)]/40 px-4 py-3.5 flex items-start gap-2.5"
          >
            <AlertCircle
              size={16}
              strokeWidth={1.75}
              className="text-[var(--color-danger)] mt-0.5 shrink-0"
            />
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-[var(--color-danger)]">
                Noe gikk galt
              </div>
              <div className="text-[12.5px] text-ink-2 mt-0.5">{error}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skeleton while loading */}
      {loading && (
        <div className="mt-7 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <RecipeSkeleton key={i} delay={i * 0.1} />
          ))}
        </div>
      )}

      {/* Real recipes */}
      <div className="mt-7 flex flex-col gap-3">
        <AnimatePresence>
          {!loading &&
            recipes.map((r, i) => (
              <RecipeCard
                key={`${r.title}-${i}`}
                recipe={r}
                index={i}
                expanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? null : i)}
              />
            ))}
        </AnimatePresence>

        {!loading && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 flex items-center justify-center text-[11.5px] text-ink-3 gap-1.5"
          >
            <Sparkles size={11} /> Generert av Claude AI
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- Recipe card ---------- */

function RecipeCard({
  recipe: r,
  index,
  expanded,
  onToggle,
}: {
  recipe: Recipe;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: 0.06 * index, duration: 0.4, ease }}
      layout
      className="card p-5 lg:p-6 flex flex-col gap-4 hover:shadow-[var(--shadow-md)] hover:border-sage-200 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-sage-50 grid place-items-center text-sage-700 shrink-0">
          <ChefHat size={18} strokeWidth={1.75} />
        </div>
        <div className="flex-1 leading-tight min-w-0">
          <div className="text-[16px] font-semibold tracking-tight text-ink">
            {r.title}
          </div>
          <p className="text-[13px] text-ink-3 mt-1 leading-relaxed">
            {r.description}
          </p>
          <div className="flex items-center gap-3 mt-2.5 text-[12px] text-ink-3">
            <span className="inline-flex items-center gap-1">
              <Clock size={11} /> {r.timeMinutes} min
            </span>
            {r.missingIngredients.length > 0 && (
              <span>
                mangler{" "}
                <span className="text-ink-2 font-medium">
                  {r.missingIngredients.length}
                </span>{" "}
                · ~{r.estimatedMissingCost} kr
              </span>
            )}
          </div>
        </div>
      </div>

      {r.usesExpiring.length > 0 && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[var(--color-warn-soft)]/60 border border-[var(--color-warn-soft)]">
          <span className="size-1.5 rounded-full bg-[var(--color-warn)] mt-1.5 shrink-0" />
          <p className="text-[12px] text-ink-2 leading-relaxed">
            Bruker opp:{" "}
            <span className="font-medium text-ink">
              {r.usesExpiring.join(", ")}
            </span>
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {r.ingredients.map((u) => (
          <span
            key={u}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sage-50 text-sage-800 text-[11px] font-medium ring-1 ring-sage-100"
          >
            <span className="size-1.5 rounded-full bg-sage-500" />
            {u}
          </span>
        ))}
        {r.missingIngredients.map((m) => (
          <span
            key={m}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-deep text-ink-3 text-[11px] font-medium ring-1 ring-[var(--color-line)]"
          >
            <Plus size={10} strokeWidth={2} />
            {m}
          </span>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease }}
            className="overflow-hidden"
          >
            <div className="pt-2 border-t border-[var(--color-line-soft)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-700 mt-3 mb-3">
                Slik gjør du
              </div>
              <ol className="flex flex-col gap-2.5">
                {r.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-[13.5px] text-ink-2 leading-relaxed"
                  >
                    <span className="shrink-0 size-5 rounded-full bg-sage-100 text-sage-800 grid place-items-center text-[11px] font-semibold mt-0.5">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onToggle}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white text-[13px] font-medium transition-colors"
        >
          {expanded ? "Skjul oppskrift" : "Se oppskrift"}
          <ArrowRight
            size={13}
            strokeWidth={2}
            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </button>
        <button className="inline-flex items-center justify-center gap-1.5 px-4 rounded-lg text-[13px] font-medium text-ink-2 hover:bg-[var(--color-line-soft)] transition-colors">
          Lagre
        </button>
      </div>
    </motion.div>
  );
}

/* ---------- Loading skeleton ---------- */

function RecipeSkeleton({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-5 lg:p-6 flex flex-col gap-4"
    >
      <div className="flex items-start gap-3">
        <Shimmer className="size-10 rounded-xl" />
        <div className="flex-1 flex flex-col gap-2">
          <Shimmer className="h-4 rounded w-2/3" />
          <Shimmer className="h-3 rounded w-full" />
          <Shimmer className="h-3 rounded w-4/5" />
          <div className="flex gap-3 mt-1">
            <Shimmer className="h-3 rounded w-16" />
            <Shimmer className="h-3 rounded w-24" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Shimmer className="h-6 w-16 rounded-full" />
        <Shimmer className="h-6 w-20 rounded-full" />
        <Shimmer className="h-6 w-14 rounded-full" />
        <Shimmer className="h-6 w-24 rounded-full" />
      </div>
      <Shimmer className="h-9 rounded-lg" />
    </motion.div>
  );
}

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-[var(--color-line-soft)] ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
