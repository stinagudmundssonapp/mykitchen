"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown,
  Navigation,
  List,
  Check,
  Plus,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StoreMap, { type Store } from "@/components/StoreMap";

type SortMode = "cheapest" | "nearest" | "general";

// Real Oslo grocery store locations (approximate, hand-picked)
const STORES: Store[] = [
  {
    id: "kiwi-grunerlokka",
    name: "Kiwi Grünerløkka",
    chain: "Kiwi",
    lng: 10.7591,
    lat: 59.9239,
    matchedItems: 4,
    weeklyEstimate: 248,
  },
  {
    id: "rema-majorstuen",
    name: "Rema 1000 Majorstuen",
    chain: "Rema 1000",
    lng: 10.7128,
    lat: 59.9295,
    matchedItems: 5,
    weeklyEstimate: 232,
  },
  {
    id: "coop-sthanshaugen",
    name: "Coop Extra St. Hanshaugen",
    chain: "Coop Extra",
    lng: 10.7437,
    lat: 59.9263,
    matchedItems: 3,
    weeklyEstimate: 264,
  },
  {
    id: "meny-solli",
    name: "Meny Solli",
    chain: "Meny",
    lng: 10.7194,
    lat: 59.9156,
    matchedItems: 6,
    weeklyEstimate: 281,
  },
  {
    id: "bunnpris-frogner",
    name: "Bunnpris Frogner",
    chain: "Bunnpris",
    lng: 10.7037,
    lat: 59.9197,
    matchedItems: 4,
    weeklyEstimate: 256,
  },
];

const FALLBACK_LOCATION = { lng: 10.7522, lat: 59.9111 }; // Oslo S

const MOCK_LIST = [
  { name: "Melk 1L", store: "Rema 1000", price: 19.9 },
  { name: "Brød grovt", store: "Rema 1000", price: 34.5 },
  { name: "Smør 500g", store: "Kiwi", price: 59.9 },
  { name: "Egg 12pk", store: "Coop Extra", price: 39.0 },
  { name: "Bananer", store: "Rema 1000", price: 21.9 },
  { name: "Hakket biff", store: "Meny", price: 89.0 },
];

export default function HandlelistePage() {
  const [mode, setMode] = useState<SortMode>("cheapest");
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [userLocation, setUserLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  // Try to get user's real location (silently fall back)
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(FALLBACK_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
        }),
      () => setUserLocation(FALLBACK_LOCATION),
      { timeout: 5000, maximumAge: 60_000 },
    );
  }, []);

  const toggle = (i: number) => {
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // Recommendations derived from sort mode
  const cheapestStore = useMemo(
    () => [...STORES].sort((a, b) => (a.weeklyEstimate ?? 0) - (b.weeklyEstimate ?? 0))[0],
    [],
  );
  const nearestStore = useMemo(() => {
    if (!userLocation) return STORES[0];
    return [...STORES].sort(
      (a, b) =>
        distance(userLocation, a) - distance(userLocation, b),
    )[0];
  }, [userLocation]);

  const recommendation =
    mode === "cheapest"
      ? cheapestStore
      : mode === "nearest"
      ? nearestStore
      : null;

  const totalPrice = MOCK_LIST.reduce((sum, item, i) => {
    return checked.has(i) ? sum : sum + item.price;
  }, 0);

  return (
    <div className="px-5 lg:px-12 py-6 lg:py-12 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Handleliste"
        title="Smart handletur"
        description="Vi sammenligner tilbud denne uka og finner den billigste butikken totalt."
      />

      {/* Real Mapbox map */}
      <div className="mt-8">
        <StoreMap
          stores={STORES}
          userLocation={userLocation ?? undefined}
          highlightedId={recommendation?.id ?? selectedStore}
          onSelectStore={setSelectedStore}
        />
      </div>

      {/* Sort modes */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <SortChip
          active={mode === "cheapest"}
          onClick={() => setMode("cheapest")}
          Icon={TrendingDown}
          label="Billigst"
          sub="totalt i uka"
        />
        <SortChip
          active={mode === "nearest"}
          onClick={() => setMode("nearest")}
          Icon={Navigation}
          label="Nærmest"
          sub="meg nå"
        />
        <SortChip
          active={mode === "general"}
          onClick={() => setMode("general")}
          Icon={List}
          label="Vanlig"
          sub="liste"
        />
      </div>

      {/* Recommendation banner */}
      {recommendation && (
        <motion.div
          key={recommendation.id + mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 rounded-2xl bg-sage-50 border border-sage-100 p-4 flex items-center gap-3"
        >
          <div className="size-10 shrink-0 rounded-xl bg-white grid place-items-center ring-1 ring-sage-200 text-sage-700">
            {mode === "cheapest" ? (
              <TrendingDown size={16} strokeWidth={1.75} />
            ) : (
              <Navigation size={16} strokeWidth={1.75} />
            )}
          </div>
          <div className="flex-1 leading-tight">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-sage-700">
              {mode === "cheapest" ? "Anbefalt" : "Nærmest deg"}
            </div>
            <div className="text-[14px] font-semibold text-ink mt-0.5">
              {recommendation.name}
            </div>
          </div>
          <div className="text-right leading-tight">
            <div className="text-[15px] font-semibold tabular-nums text-ink">
              {recommendation.weeklyEstimate} kr
            </div>
            <div className="text-[10.5px] text-ink-3">est. total</div>
          </div>
        </motion.div>
      )}

      {/* List */}
      <div className="mt-6 card divide-y divide-[var(--color-line-soft)]">
        {MOCK_LIST.map((item, i) => {
          const on = checked.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 px-4 py-3.5 first:rounded-t-3xl hover:bg-[var(--color-line-soft)]/40 transition-colors text-left"
            >
              <span
                className={[
                  "size-5 rounded-md grid place-items-center transition-colors",
                  on
                    ? "bg-sage-600 text-white"
                    : "bg-cream-deep ring-1 ring-[var(--color-line)]",
                ].join(" ")}
              >
                {on && <Check size={12} strokeWidth={3} />}
              </span>
              <span
                className={[
                  "flex-1 text-[14px] font-medium",
                  on ? "text-ink-4 line-through" : "text-ink",
                ].join(" ")}
              >
                {item.name}
              </span>
              {mode === "cheapest" && (
                <span className="text-[11px] font-medium text-sage-700 bg-sage-50 ring-1 ring-sage-100 px-2 py-0.5 rounded-full">
                  {item.store}
                </span>
              )}
              <span className="text-[13px] font-semibold text-ink-2 tabular-nums">
                {item.price.toFixed(2).replace(".", ",")} kr
              </span>
            </button>
          );
        })}
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[12px] text-ink-3">Igjen å handle</span>
          <span className="text-[14px] font-semibold tabular-nums text-ink">
            {totalPrice.toFixed(2).replace(".", ",")} kr
          </span>
        </div>
        <button className="w-full flex items-center justify-center gap-1.5 py-3.5 last:rounded-b-3xl text-[13px] font-medium text-sage-700 hover:bg-sage-50/40 transition-colors">
          <Plus size={14} strokeWidth={2} />
          Legg til vare
        </button>
      </div>
    </div>
  );
}

function SortChip({
  active,
  onClick,
  Icon,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof TrendingDown;
  label: string;
  sub: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={[
        "py-3 px-3 rounded-2xl flex flex-col items-start gap-1 transition-all",
        active
          ? "bg-sage-50 ring-1 ring-sage-300"
          : "bg-surface ring-1 ring-[var(--color-line)] hover:ring-sage-200",
      ].join(" ")}
    >
      <Icon
        size={16}
        strokeWidth={1.75}
        className={active ? "text-sage-700" : "text-ink-3"}
      />
      <div className="leading-tight text-left">
        <div
          className={[
            "text-[13px] font-semibold",
            active ? "text-sage-800" : "text-ink",
          ].join(" ")}
        >
          {label}
        </div>
        <div className="text-[10.5px] text-ink-3">{sub}</div>
      </div>
    </motion.button>
  );
}

/** Quick haversine-ish distance for sorting; not exact but fine here. */
function distance(
  a: { lng: number; lat: number },
  b: { lng: number; lat: number },
) {
  const dx = (a.lng - b.lng) * Math.cos(((a.lat + b.lat) / 2) * Math.PI / 180);
  const dy = a.lat - b.lat;
  return Math.sqrt(dx * dx + dy * dy);
}
