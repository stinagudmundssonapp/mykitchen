"use client";

import { useEffect, useMemo, useState } from "react";
import Map, {
  Marker,
  Popup,
  type MapRef,
  type ViewStateChangeEvent,
} from "react-map-gl/mapbox";
import { motion } from "framer-motion";
import { MapPin, Navigation as NavIcon } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

export type Store = {
  id: string;
  name: string;
  chain: "Kiwi" | "Rema 1000" | "Coop Extra" | "Meny" | "Bunnpris";
  lng: number;
  lat: number;
  /** Number of items on your list available at this store, used for sizing */
  matchedItems?: number;
  /** Cheapest-total estimate for this week */
  weeklyEstimate?: number;
};

const CHAIN_COLORS: Record<Store["chain"], string> = {
  Kiwi: "#5F7E68",
  "Rema 1000": "#4A6B5E",
  "Coop Extra": "#2D5F5F",
  Meny: "#7C9885",
  Bunnpris: "#36544A",
};

// Default centred on southern Norway, zoom out to show major cities
const DEFAULT_VIEW = {
  longitude: 10.5,
  latitude: 61.5,
  zoom: 4.3,
};

export default function StoreMap({
  stores,
  userLocation,
  highlightedId,
  onSelectStore,
}: {
  stores: Store[];
  userLocation?: { lng: number; lat: number };
  highlightedId?: string | null;
  onSelectStore?: (id: string | null) => void;
}) {
  const [popupId, setPopupId] = useState<string | null>(null);
  const [view, setView] = useState(DEFAULT_VIEW);
  const [hasFocusedUser, setHasFocusedUser] = useState(false);

  // When user location resolves the first time, zoom in to them
  useEffect(() => {
    if (userLocation && !hasFocusedUser) {
      setView({
        longitude: userLocation.lng,
        latitude: userLocation.lat,
        zoom: 12,
      });
      setHasFocusedUser(true);
    }
  }, [userLocation, hasFocusedUser]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const popupStore = useMemo(
    () => stores.find((s) => s.id === popupId) ?? null,
    [popupId, stores],
  );

  if (!token) {
    return (
      <div className="h-64 lg:h-72 rounded-3xl ring-1 ring-[var(--color-line)] bg-cream-deep grid place-items-center text-[13px] text-ink-3 px-6 text-center">
        Mapbox-token mangler. Sett{" "}
        <code className="mx-1 px-1.5 py-0.5 rounded bg-surface ring-1 ring-[var(--color-line)] text-[11px]">
          NEXT_PUBLIC_MAPBOX_TOKEN
        </code>{" "}
        i .env.local
      </div>
    );
  }

  return (
    <div className="relative h-64 lg:h-80 rounded-3xl overflow-hidden ring-1 ring-[var(--color-line)] shadow-[var(--shadow-sm)]">
      {/* Warm cream wash to soften default Mapbox light style */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 mix-blend-multiply"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,250,247,0.15) 0%, rgba(244,242,236,0.25) 100%)",
        }}
      />

      <Map
        mapboxAccessToken={token}
        {...view}
        onMove={(e: ViewStateChangeEvent) => setView(e.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        reuseMaps
      >
        {/* Store markers */}
        {stores.map((store) => {
          const isHighlight = highlightedId === store.id;
          const color = CHAIN_COLORS[store.chain];
          return (
            <Marker
              key={store.id}
              longitude={store.lng}
              latitude={store.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupId(store.id);
                onSelectStore?.(store.id);
              }}
            >
              <StorePin
                color={color}
                label={store.chain}
                highlighted={isHighlight}
              />
            </Marker>
          );
        })}

        {/* User location */}
        {userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
            anchor="center"
          >
            <UserDot />
          </Marker>
        )}

        {/* Popup */}
        {popupStore && (
          <Popup
            longitude={popupStore.lng}
            latitude={popupStore.lat}
            anchor="top"
            offset={14}
            onClose={() => {
              setPopupId(null);
              onSelectStore?.(null);
            }}
            closeButton={false}
            className="mk-popup"
          >
            <div className="px-3.5 py-3 min-w-[180px]">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: CHAIN_COLORS[popupStore.chain] }}
                />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                  {popupStore.chain}
                </span>
              </div>
              <div className="text-[14px] font-semibold tracking-tight text-ink">
                {popupStore.name}
              </div>
              <div className="mt-2 text-[11.5px] text-ink-3 flex flex-col gap-0.5">
                {popupStore.matchedItems !== undefined && (
                  <div>
                    Har{" "}
                    <span className="text-ink-2 font-medium">
                      {popupStore.matchedItems}
                    </span>{" "}
                    av varene dine på tilbud
                  </div>
                )}
                {popupStore.weeklyEstimate !== undefined && (
                  <div>
                    Totalt denne uka:{" "}
                    <span className="text-ink-2 font-medium tabular-nums">
                      {popupStore.weeklyEstimate} kr
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Map controls — bottom-right */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => {
            if (userLocation) {
              setView({
                longitude: userLocation.lng,
                latitude: userLocation.lat,
                zoom: 13.5,
              });
            }
          }}
          aria-label="Sentrer på meg"
          className="size-9 rounded-xl bg-white/95 backdrop-blur-sm ring-1 ring-[var(--color-line)] shadow-sm grid place-items-center text-ink-2 hover:text-sage-700 transition-colors"
        >
          <NavIcon size={14} strokeWidth={1.75} />
        </button>
      </div>

      {/* Branded attribution corner */}
      <div className="absolute bottom-2 left-3 z-20 text-[9px] text-ink-3/70 tracking-wide">
        © Mapbox · OpenStreetMap
      </div>

      {/* Global tweaks for mapbox popup */}
      <style jsx global>{`
        .mk-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 16px;
          background: var(--color-surface);
          box-shadow: 0 12px 32px -8px rgba(36, 59, 51, 0.18),
            0 4px 12px -2px rgba(36, 59, 51, 0.08);
          border: 1px solid var(--color-line);
        }
        .mk-popup .mapboxgl-popup-tip {
          border-top-color: var(--color-surface);
          border-bottom-color: var(--color-surface);
        }
      `}</style>
    </div>
  );
}

/* ---------- Pins ---------- */

function StorePin({
  color,
  label,
  highlighted,
}: {
  color: string;
  label: string;
  highlighted: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0, y: -10 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="relative flex flex-col items-center -translate-y-1"
    >
      {highlighted && (
        <motion.div
          className="absolute -inset-3 rounded-full"
          style={{ background: color, opacity: 0.2 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0, 0.25] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <div
        className="relative size-7 rounded-full ring-2 ring-white shadow-[0_3px_10px_-2px_rgba(36,59,51,0.4)] grid place-items-center transition-transform hover:scale-110 cursor-pointer"
        style={{ background: color }}
      >
        <MapPin size={12} strokeWidth={2.25} className="text-white" />
      </div>
      <div
        className="mt-1 px-1.5 py-0.5 rounded-md bg-white/95 ring-1 ring-black/[0.04] text-[9.5px] font-semibold whitespace-nowrap"
        style={{ color }}
      >
        {label}
      </div>
    </motion.div>
  );
}

function UserDot() {
  return (
    <div className="relative grid place-items-center">
      <motion.div
        className="absolute size-8 rounded-full bg-sage-500"
        animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
      />
      <div className="relative size-3.5 rounded-full bg-sage-700 ring-[3px] ring-white shadow-md" />
    </div>
  );
}
