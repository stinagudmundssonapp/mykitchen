import type { Store } from "@/components/StoreMap";

/**
 * Hand-picked grocery stores across Norway.
 * Real chains, real (approximate) coordinates, realistic mock prices.
 * Replace with OSM Overpass or Kassal.app for live data later.
 */
export const NORWAY_STORES: Store[] = [
  // ────────────────────────── OSLO ──────────────────────────
  { id: "kiwi-grunerlokka", name: "Kiwi Grünerløkka", chain: "Kiwi", lng: 10.7591, lat: 59.9239, matchedItems: 4, weeklyEstimate: 248 },
  { id: "kiwi-bjorvika", name: "Kiwi Bjørvika", chain: "Kiwi", lng: 10.7570, lat: 59.9075, matchedItems: 5, weeklyEstimate: 244 },
  { id: "rema-majorstuen", name: "Rema 1000 Majorstuen", chain: "Rema 1000", lng: 10.7128, lat: 59.9295, matchedItems: 5, weeklyEstimate: 232 },
  { id: "rema-grunerlokka", name: "Rema 1000 Grünerløkka", chain: "Rema 1000", lng: 10.7610, lat: 59.9220, matchedItems: 5, weeklyEstimate: 235 },
  { id: "rema-toyen", name: "Rema 1000 Tøyen", chain: "Rema 1000", lng: 10.7748, lat: 59.9156, matchedItems: 5, weeklyEstimate: 230 },
  { id: "coop-sthanshaugen", name: "Coop Extra St. Hanshaugen", chain: "Coop Extra", lng: 10.7437, lat: 59.9263, matchedItems: 3, weeklyEstimate: 264 },
  { id: "coop-storo", name: "Coop Extra Storo", chain: "Coop Extra", lng: 10.7790, lat: 59.9450, matchedItems: 4, weeklyEstimate: 259 },
  { id: "meny-solli", name: "Meny Solli", chain: "Meny", lng: 10.7194, lat: 59.9156, matchedItems: 6, weeklyEstimate: 281 },
  { id: "meny-aker-brygge", name: "Meny Aker Brygge", chain: "Meny", lng: 10.7268, lat: 59.9095, matchedItems: 6, weeklyEstimate: 285 },
  { id: "bunnpris-frogner", name: "Bunnpris Frogner", chain: "Bunnpris", lng: 10.7037, lat: 59.9197, matchedItems: 4, weeklyEstimate: 256 },

  // ────────────────────────── BERGEN ──────────────────────────
  { id: "kiwi-bergen-sentrum", name: "Kiwi Bergen Sentrum", chain: "Kiwi", lng: 5.3221, lat: 60.3925, matchedItems: 4, weeklyEstimate: 252 },
  { id: "rema-bergen-nordnes", name: "Rema 1000 Nordnes", chain: "Rema 1000", lng: 5.3127, lat: 60.3946, matchedItems: 5, weeklyEstimate: 238 },
  { id: "coop-bergen-laksevag", name: "Coop Extra Laksevåg", chain: "Coop Extra", lng: 5.2980, lat: 60.3760, matchedItems: 4, weeklyEstimate: 266 },
  { id: "meny-bergen-fjosanger", name: "Meny Fjøsanger", chain: "Meny", lng: 5.3438, lat: 60.3622, matchedItems: 6, weeklyEstimate: 289 },
  { id: "bunnpris-bergen", name: "Bunnpris Møhlenpris", chain: "Bunnpris", lng: 5.3185, lat: 60.3855, matchedItems: 4, weeklyEstimate: 261 },

  // ────────────────────────── TRONDHEIM ──────────────────────────
  { id: "kiwi-trondheim-sentrum", name: "Kiwi Trondheim Sentrum", chain: "Kiwi", lng: 10.3950, lat: 63.4305, matchedItems: 5, weeklyEstimate: 246 },
  { id: "rema-trondheim-lade", name: "Rema 1000 Lade", chain: "Rema 1000", lng: 10.4500, lat: 63.4470, matchedItems: 5, weeklyEstimate: 234 },
  { id: "coop-trondheim-byasen", name: "Coop Extra Byåsen", chain: "Coop Extra", lng: 10.3580, lat: 63.4280, matchedItems: 4, weeklyEstimate: 260 },
  { id: "meny-trondheim-solsiden", name: "Meny Solsiden", chain: "Meny", lng: 10.4090, lat: 63.4358, matchedItems: 6, weeklyEstimate: 283 },

  // ────────────────────────── STAVANGER ──────────────────────────
  { id: "kiwi-stavanger-sentrum", name: "Kiwi Stavanger Sentrum", chain: "Kiwi", lng: 5.7331, lat: 58.9700, matchedItems: 5, weeklyEstimate: 250 },
  { id: "rema-stavanger-hillevag", name: "Rema 1000 Hillevåg", chain: "Rema 1000", lng: 5.7245, lat: 58.9512, matchedItems: 5, weeklyEstimate: 236 },
  { id: "coop-stavanger-madla", name: "Coop Extra Madla", chain: "Coop Extra", lng: 5.6880, lat: 58.9505, matchedItems: 4, weeklyEstimate: 263 },
  { id: "meny-stavanger-storhaug", name: "Meny Storhaug", chain: "Meny", lng: 5.7515, lat: 58.9700, matchedItems: 6, weeklyEstimate: 286 },

  // ────────────────────────── DRAMMEN ──────────────────────────
  { id: "kiwi-drammen-bragernes", name: "Kiwi Bragernes", chain: "Kiwi", lng: 10.2040, lat: 59.7440, matchedItems: 4, weeklyEstimate: 249 },
  { id: "rema-drammen-stromso", name: "Rema 1000 Strømsø", chain: "Rema 1000", lng: 10.2060, lat: 59.7395, matchedItems: 5, weeklyEstimate: 233 },
  { id: "coop-drammen-grønland", name: "Coop Extra Grønland", chain: "Coop Extra", lng: 10.1900, lat: 59.7475, matchedItems: 4, weeklyEstimate: 261 },

  // ────────────────────────── KRISTIANSAND ──────────────────────────
  { id: "kiwi-kristiansand-sentrum", name: "Kiwi Kvadraturen", chain: "Kiwi", lng: 7.9956, lat: 58.1467, matchedItems: 4, weeklyEstimate: 251 },
  { id: "rema-kristiansand-lund", name: "Rema 1000 Lund", chain: "Rema 1000", lng: 8.0150, lat: 58.1545, matchedItems: 5, weeklyEstimate: 237 },
  { id: "meny-kristiansand", name: "Meny Kristiansand", chain: "Meny", lng: 7.9930, lat: 58.1490, matchedItems: 6, weeklyEstimate: 288 },

  // ────────────────────────── TROMSØ ──────────────────────────
  { id: "kiwi-tromso-sentrum", name: "Kiwi Tromsø Sentrum", chain: "Kiwi", lng: 18.9550, lat: 69.6492, matchedItems: 4, weeklyEstimate: 268 },
  { id: "rema-tromso", name: "Rema 1000 Tromsø", chain: "Rema 1000", lng: 18.9620, lat: 69.6520, matchedItems: 5, weeklyEstimate: 252 },
  { id: "coop-tromso", name: "Coop Extra Tromsø", chain: "Coop Extra", lng: 18.9420, lat: 69.6610, matchedItems: 4, weeklyEstimate: 278 },

  // ────────────────────────── BODØ ──────────────────────────
  { id: "kiwi-bodo", name: "Kiwi Bodø Sentrum", chain: "Kiwi", lng: 14.3850, lat: 67.2845, matchedItems: 4, weeklyEstimate: 264 },
  { id: "rema-bodo", name: "Rema 1000 Bodø", chain: "Rema 1000", lng: 14.4080, lat: 67.2820, matchedItems: 5, weeklyEstimate: 248 },

  // ────────────────────────── FREDRIKSTAD ──────────────────────────
  { id: "kiwi-fredrikstad", name: "Kiwi Fredrikstad Sentrum", chain: "Kiwi", lng: 10.9335, lat: 59.2178, matchedItems: 4, weeklyEstimate: 250 },
  { id: "rema-fredrikstad", name: "Rema 1000 Fredrikstad", chain: "Rema 1000", lng: 10.9290, lat: 59.2185, matchedItems: 5, weeklyEstimate: 234 },
];
