"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";
import { Plus, X, Sparkles } from "lucide-react";
import { useRefrigerator } from "@/context/RefrigeratorContext";

type SectionId = "top" | "middle" | "vegetable";

const SECTIONS: { id: SectionId; label: string; sub: string }[] = [
  { id: "top", label: "Øverste hylle", sub: "Meieri & drikke" },
  { id: "middle", label: "Midthylle", sub: "Kjøtt, fisk & rester" },
  { id: "vegetable", label: "Grønnsakskuff", sub: "Frukt & grønt" },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Premium fridge. Click the door to open.
 * Door swings on a 1.2s ease-out, then shelves stagger in.
 */
export default function Fridge() {
  const { items, addItem, removeItem } = useRefrigerator();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState<SectionId | null>(null);
  const [draft, setDraft] = useState("");

  const bySection = useMemo(
    () =>
      ({
        top: items.filter((i) => i.section === "top"),
        middle: items.filter((i) => i.section === "middle"),
        vegetable: items.filter((i) => i.section === "vegetable"),
      } as Record<SectionId, typeof items>),
    [items],
  );

  const handleAdd = (section: SectionId) => {
    const name = draft.trim();
    if (!name) {
      setAdding(null);
      return;
    }
    addItem(name, section);
    setDraft("");
    setAdding(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-[480px] px-4 sm:px-0 select-none">
      {/* Stage */}
      <div
        className="relative aspect-[9/14] w-full"
        style={{ perspective: "1800px" }}
      >
        {/* Floor shadow */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-8 w-[82%] rounded-full bg-sage-800/20 blur-2xl"
        />

        {/* Fridge body (cavity) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="relative size-full rounded-[40px] overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Cavity = interior background visible only when door swings out */}
          <Cavity
            bySection={bySection}
            open={open}
            onRemove={removeItem}
            onAdd={(s) => setAdding(s)}
          />

          {/* Hinge column (always visible — at left edge) */}
          <div
            aria-hidden
            className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-sage-800/40 via-sage-700/30 to-sage-800/40 z-30"
          />

          {/* Door */}
          <AnimatePresence>
            {!open && (
              <motion.button
                key="door"
                onClick={() => setOpen(true)}
                aria-label="Åpne kjøleskapet"
                initial={{ rotateY: 0, opacity: 1 }}
                exit={{
                  rotateY: -118,
                  x: -10,
                  opacity: 0,
                  transition: { duration: 1.2, ease: EASE_OUT },
                }}
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                className="absolute inset-0 cursor-pointer focus:outline-none z-20"
              >
                <DoorFace />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Top inner highlight (visible always — frame edge) */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/40 to-transparent z-40 rounded-t-[40px]"
          />
        </motion.div>
      </div>

      {/* Status line */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-7 flex items-center justify-between px-1"
      >
        <p className="text-[13px] text-ink-3">
          {open ? (
            <>
              <span className="text-ink-2 font-medium">{items.length}</span>{" "}
              {items.length === 1 ? "vare" : "varer"} i kjøleskapet
            </>
          ) : (
            "Trykk på døren for å åpne"
          )}
        </p>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-[12px] font-medium text-ink-3 hover:text-sage-700 transition-colors"
        >
          {open ? "Lukk" : "Åpne"}
        </button>
      </motion.div>

      {/* Add item sheet */}
      <AnimatePresence>
        {adding && (
          <AddItemSheet
            section={SECTIONS.find((s) => s.id === adding)!}
            value={draft}
            onChange={setDraft}
            onSubmit={() => handleAdd(adding)}
            onClose={() => {
              setAdding(null);
              setDraft("");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===================================================================== */
/* DOOR — the visible face when fridge is closed                          */
/* ===================================================================== */

function DoorFace() {
  return (
    <div className="relative size-full overflow-hidden rounded-[40px]">
      {/* Base panel — soft pearl/sage gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, #F4F2EC 0%, #E8E5DD 35%, #DCDED2 60%, #C9CFC3 100%)",
        }}
      />

      {/* Very subtle vertical brushed metal texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,0.5) 2px 3px)",
        }}
      />

      {/* Top glossy reflection */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[42%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 40%, transparent 100%)",
        }}
      />

      {/* Bottom soft shadow */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-[30%]"
        style={{
          background:
            "linear-gradient(0deg, rgba(36,59,51,0.10) 0%, transparent 100%)",
        }}
      />

      {/* Horizontal seam line — fridge/freezer style break */}
      <div
        aria-hidden
        className="absolute left-6 right-6 top-[28%] h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(36,59,51,0.18) 20%, rgba(36,59,51,0.18) 80%, transparent 100%)",
        }}
      />

      {/* Branding chip */}
      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <div className="size-12 rounded-2xl bg-white/85 backdrop-blur-sm grid place-items-center shadow-[0_2px_8px_rgba(36,59,51,0.10),inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-sage-200/40">
            <span className="text-xl">🧊</span>
          </div>
          {/* Soft halo */}
          <div className="absolute inset-0 rounded-2xl bg-sage-400/10 blur-xl -z-10" />
        </motion.div>
        <div className="text-[10.5px] font-semibold tracking-[0.22em] text-sage-800/80 uppercase">
          MyKitchen
        </div>
      </div>

      {/* LED indicator — subtle pulse */}
      <div className="absolute top-[14%] right-7 flex items-center gap-1.5">
        <motion.div
          className="size-1.5 rounded-full bg-sage-500"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 6px rgba(95,126,104,0.7)" }}
        />
      </div>

      {/* Recessed handle — long vertical strip on the right */}
      <div className="absolute right-4 top-[36%] bottom-[18%] w-[14px]">
        {/* Recess (darker shadow inset) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(36,59,51,0.18) 0%, rgba(36,59,51,0.08) 50%, transparent 100%)",
            boxShadow:
              "inset 1px 0 0 rgba(36,59,51,0.22), inset -1px 0 0 rgba(255,255,255,0.4)",
          }}
        />
        {/* Metal grip */}
        <div
          className="absolute left-[3px] right-[3px] top-2 bottom-2 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #8A938A 0%, #BFC7BC 30%, #DEE3D9 50%, #BFC7BC 70%, #8A938A 100%)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        />
      </div>

      {/* "Click to open" prompt — bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute inset-x-0 bottom-9 flex flex-col items-center gap-2.5"
      >
        <motion.div
          animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm ring-1 ring-sage-200/50 shadow-sm"
        >
          <span className="text-[10.5px] font-medium tracking-wider text-sage-800 uppercase">
            Trykk for å åpne
          </span>
        </motion.div>
      </motion.div>

      {/* Hinge shadow on left edge */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-6 z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(36,59,51,0.22) 0%, rgba(36,59,51,0.06) 60%, transparent 100%)",
        }}
      />

      {/* Top hinge cap */}
      <div className="absolute left-[-2px] top-7 w-3 h-5 rounded-full bg-gradient-to-b from-sage-700 to-sage-800 shadow-md ring-1 ring-black/10" />
      {/* Bottom hinge cap */}
      <div className="absolute left-[-2px] bottom-7 w-3 h-5 rounded-full bg-gradient-to-b from-sage-700 to-sage-800 shadow-md ring-1 ring-black/10" />
    </div>
  );
}

/* ===================================================================== */
/* CAVITY — visible interior when door is open                            */
/* ===================================================================== */

function Cavity({
  bySection,
  open,
  onRemove,
  onAdd,
}: {
  bySection: Record<SectionId, ReturnType<typeof useRefrigerator>["items"]>;
  open: boolean;
  onRemove: (id: string) => void;
  onAdd: (s: SectionId) => void;
}) {
  const shelfContainer: Variants = {
    closed: {},
    open: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  };
  const shelfItem: Variants = {
    closed: { opacity: 0, y: 18, scale: 0.97 },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: EASE_OUT },
    },
  };

  return (
    <div className="absolute inset-0 z-10">
      {/* Inner wall — soft cream depth */}
      <div
        aria-hidden
        className="absolute inset-1.5 rounded-[34px]"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FAFAF7 30%, #F4F2EC 100%)",
          boxShadow:
            "inset 0 2px 12px rgba(36,59,51,0.08), inset 0 -2px 8px rgba(36,59,51,0.05)",
        }}
      />

      {/* LED light strip at the top — only visible when open */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ delay: open ? 0.2 : 0, duration: 0.5 }}
        className="absolute top-3.5 left-6 right-6 h-1 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,250,235,0.95) 20%, rgba(255,250,235,1) 50%, rgba(255,250,235,0.95) 80%, transparent 100%)",
          boxShadow:
            "0 6px 22px rgba(255,237,180,0.55), 0 2px 8px rgba(255,237,180,0.4)",
        }}
      />

      {/* Warm glow wash from the top */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ delay: open ? 0.2 : 0, duration: 0.6 }}
        className="absolute inset-1.5 rounded-[34px] pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 60% at 50% -10%, rgba(255,237,180,0.35) 0%, transparent 55%)",
        }}
      />

      {/* Shelves */}
      <motion.div
        variants={shelfContainer}
        animate={open ? "open" : "closed"}
        initial="closed"
        className="relative h-full flex flex-col gap-3 px-4 pt-9 pb-4"
      >
        {SECTIONS.map((sec, idx) => (
          <motion.div
            key={sec.id}
            variants={shelfItem}
            className="relative flex-1 min-h-0"
          >
            {/* Glass shelf — thin pane under the items */}
            <div
              aria-hidden
              className="absolute -bottom-1 left-1 right-1 h-1 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(220,225,215,0.5) 100%)",
                boxShadow:
                  "0 1px 2px rgba(36,59,51,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            />

            <div className="relative h-full rounded-2xl bg-white/75 backdrop-blur-[2px] ring-1 ring-sage-100/70 shadow-[0_1px_2px_rgba(36,59,51,0.04)] px-3 py-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="leading-tight">
                  <div className="text-[11.5px] font-semibold text-ink tracking-tight">
                    {sec.label}
                  </div>
                  <div className="text-[10px] text-ink-3">{sec.sub}</div>
                </div>
                <button
                  onClick={() => onAdd(sec.id)}
                  aria-label={`Legg til i ${sec.label}`}
                  className="size-6 rounded-full bg-sage-50 hover:bg-sage-100 text-sage-700 grid place-items-center transition-colors ring-1 ring-sage-200/60"
                >
                  <Plus size={12} strokeWidth={2.25} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 content-start overflow-hidden">
                <AnimatePresence initial={false} mode="popLayout">
                  {bySection[sec.id].length === 0 ? (
                    <motion.span
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10.5px] text-ink-4 italic py-0.5"
                    >
                      Tomt
                    </motion.span>
                  ) : (
                    bySection[sec.id].map((item) => {
                      const days = daysSince(item.addedDate);
                      const expiring = days >= 5;
                      return (
                        <motion.button
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.85, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            scale: 0.85,
                            transition: { duration: 0.15 },
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 28,
                          }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => onRemove(item.id)}
                          className="group inline-flex items-center gap-1 rounded-full bg-cream ring-1 ring-[var(--color-line)] hover:ring-sage-300 px-2.5 py-1 text-[11px] font-medium text-ink-2 transition-colors"
                        >
                          {expiring && (
                            <span
                              aria-label="Snart ut på dato"
                              className="size-1.5 rounded-full bg-[var(--color-warn)]"
                            />
                          )}
                          <span>{item.name}</span>
                          <X
                            size={10}
                            strokeWidth={2.25}
                            className="text-ink-4 group-hover:text-danger transition-colors"
                          />
                        </motion.button>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ===================================================================== */
/* ADD-ITEM SHEET                                                         */
/* ===================================================================== */

function AddItemSheet({
  section,
  value,
  onChange,
  onSubmit,
  onClose,
}: {
  section: { id: SectionId; label: string; sub: string };
  value: string;
  onChange: (s: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        aria-label="Lukk"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.32, ease: EASE_OUT }}
        className="relative w-full sm:max-w-sm bg-surface rounded-t-3xl sm:rounded-3xl border border-[var(--color-line)] shadow-lg p-5"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-[var(--color-line)] sm:hidden mb-4" />
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-[11px] uppercase tracking-wider text-sage-600 font-semibold">
            Legg til i {section.label}
          </span>
          <h3 className="text-[17px] font-semibold tracking-tight">
            Hva har du?
          </h3>
        </div>

        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
            if (e.key === "Escape") onClose();
          }}
          placeholder="f.eks. melk, egg, paprika…"
          className="w-full bg-cream-deep border border-[var(--color-line)] rounded-xl px-4 py-3 text-[15px] placeholder:text-ink-4 focus:border-sage-400 focus:bg-white transition-all"
        />

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[14px] font-medium text-ink-2 hover:bg-[var(--color-line-soft)] transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="flex-1 py-3 rounded-xl text-[14px] font-medium bg-sage-600 hover:bg-sage-700 disabled:bg-sage-200 disabled:text-sage-400 text-white transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} strokeWidth={2} />
            Legg til
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function daysSince(ts: number) {
  return Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
}
