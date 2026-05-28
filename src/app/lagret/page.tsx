"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link as LinkIcon,
  Bookmark,
  Clock,
  Tag,
  Loader2,
  AlertCircle,
  Trash2,
  Users,
  X,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  useSavedRecipes,
  type SavedRecipe,
} from "@/context/SavedRecipesContext";

export default function LagretPage() {
  const { recipes, save, remove } = useSavedRecipes();
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<SavedRecipe | null>(null);

  const handleImport = async () => {
    const trimmed = url.trim();
    if (!trimmed || importing) return;
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/import-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Klarte ikke å importere oppskriften.");
        return;
      }
      const saved = save({
        title: data.recipe.title,
        description: data.recipe.description,
        source: data.source,
        timeMinutes: data.recipe.timeMinutes ?? 0,
        servings: data.recipe.servings ?? 0,
        ingredients: data.recipe.ingredients ?? [],
        steps: data.recipe.steps ?? [],
        tags: data.recipe.tags ?? [],
      });
      setUrl("");
      setOpenRecipe(saved);
    } catch {
      setError("Klarte ikke å kontakte serveren.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="px-5 lg:px-12 py-6 lg:py-12 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Bibliotek"
        title="Dine lagrede oppskrifter"
        description="Importer fra matprat.no, godt.no eller andre — vi parser oppskriften med AI."
      />

      {/* URL import */}
      <div className="mt-8 card p-4 lg:p-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="flex items-center gap-2 flex-1 bg-cream-deep rounded-xl px-3.5 py-2.5 ring-1 ring-[var(--color-line)] focus-within:ring-sage-300 transition-all">
            <LinkIcon size={15} strokeWidth={1.75} className="text-ink-3" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImport()}
              placeholder="Lim inn URL fra matprat.no, godt.no…"
              disabled={importing}
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-4 disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleImport}
            disabled={!url.trim() || importing}
            className="bg-sage-600 hover:bg-sage-700 disabled:bg-sage-200 disabled:text-sage-400 text-white text-[13px] font-medium px-5 py-2.5 rounded-xl transition-colors inline-flex items-center justify-center gap-2 min-w-[110px]"
          >
            {importing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Leser…
              </>
            ) : (
              "Importer"
            )}
          </button>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-3 py-2 rounded-lg bg-[var(--color-danger-soft)]/40 border border-[var(--color-danger-soft)] flex items-start gap-2">
                <AlertCircle
                  size={14}
                  strokeWidth={1.75}
                  className="text-[var(--color-danger)] mt-0.5 shrink-0"
                />
                <span className="text-[12.5px] text-ink-2">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-[11.5px] text-ink-3">
          Testet med matprat.no, godt.no, oppskrift.no, trinesmatblogg.no
        </p>
      </div>

      {/* List header */}
      <div className="mt-8 flex items-center gap-2 px-1">
        <Bookmark size={14} strokeWidth={1.75} className="text-ink-3" />
        <h2 className="text-[13px] font-semibold tracking-tight text-ink-2">
          {recipes.length} lagrede
        </h2>
      </div>

      {/* Recipes list */}
      <div className="mt-3 flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {recipes.map((r, i) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="card p-4 lg:p-5 flex items-center gap-4 hover:border-sage-200 hover:shadow-[var(--shadow-md)] transition-all"
            >
              <button
                onClick={() => setOpenRecipe(r)}
                className="size-12 rounded-2xl bg-sage-50 grid place-items-center shrink-0 hover:bg-sage-100 transition-colors"
                aria-label={`Åpne ${r.title}`}
              >
                <Bookmark
                  size={16}
                  strokeWidth={1.75}
                  className="text-sage-700"
                />
              </button>
              <button
                onClick={() => setOpenRecipe(r)}
                className="flex-1 min-w-0 text-left"
              >
                <div className="text-[15px] font-semibold tracking-tight text-ink truncate">
                  {r.title}
                </div>
                <div className="flex items-center gap-3 mt-1 text-[12px] text-ink-3">
                  {r.timeMinutes > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} /> {r.timeMinutes} min
                    </span>
                  )}
                  <span>{r.source}</span>
                </div>
                {r.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {r.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream-deep text-ink-3 text-[10.5px] font-medium ring-1 ring-[var(--color-line)]"
                      >
                        <Tag size={9} />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
              <button
                onClick={() => remove(r.id)}
                aria-label="Slett"
                className="size-8 rounded-lg grid place-items-center text-ink-4 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]/30 transition-colors"
              >
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {recipes.length === 0 && (
          <div className="text-center py-12 text-[13px] text-ink-3">
            Ingen oppskrifter lagret ennå.
          </div>
        )}
      </div>

      {/* Recipe modal */}
      <AnimatePresence>
        {openRecipe && (
          <RecipeModal
            recipe={openRecipe}
            onClose={() => setOpenRecipe(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RecipeModal({
  recipe,
  onClose,
}: {
  recipe: SavedRecipe;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        aria-label="Lukk"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full sm:max-w-xl max-h-[88dvh] overflow-hidden bg-surface rounded-t-3xl sm:rounded-3xl border border-[var(--color-line)] shadow-lg flex flex-col"
      >
        <div className="flex items-start justify-between gap-4 p-5 lg:p-6 border-b border-[var(--color-line-soft)]">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-600">
              {recipe.source}
            </span>
            <h2 className="text-[20px] lg:text-[22px] font-semibold tracking-tight text-ink mt-1">
              {recipe.title}
            </h2>
            <p className="text-[13.5px] text-ink-3 mt-1.5 leading-relaxed">
              {recipe.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-[12px] text-ink-3">
              {recipe.timeMinutes > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} /> {recipe.timeMinutes} min
                </span>
              )}
              {recipe.servings > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Users size={12} /> {recipe.servings} porsjoner
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="size-9 rounded-lg grid place-items-center text-ink-3 hover:text-ink hover:bg-[var(--color-line-soft)] transition-colors"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 lg:px-6 py-5 space-y-6">
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-700 mb-3">
              Ingredienser
            </h3>
            <ul className="flex flex-col gap-1.5">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="text-[13.5px] text-ink-2 leading-relaxed flex gap-2"
                >
                  <span className="text-ink-4">·</span>
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-700 mb-3">
              Fremgangsmåte
            </h3>
            <ol className="flex flex-col gap-3">
              {recipe.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[13.5px] text-ink-2 leading-relaxed"
                >
                  <span className="shrink-0 size-5 rounded-full bg-sage-100 text-sage-800 grid place-items-center text-[11px] font-semibold mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {recipe.tags.length > 0 && (
            <section className="pt-2">
              <div className="flex flex-wrap gap-1.5">
                {recipe.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-deep text-ink-3 text-[11px] font-medium ring-1 ring-[var(--color-line)]"
                  >
                    <Tag size={10} />
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
