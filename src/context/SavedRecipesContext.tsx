"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type SavedRecipe = {
  id: string;
  title: string;
  description: string;
  source: string; // "matprat.no" | "AI-generert" | etc
  timeMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
  savedAt: number;
};

const STORAGE_KEY = "mykitchen_saved_recipes";

const DEFAULT_RECIPES: SavedRecipe[] = [
  {
    id: "demo-1",
    title: "Pasta cacio e pepe",
    description:
      "Tre ingredienser, full smak. Klassisk romersk pasta med pecorino og masse sortpepper.",
    source: "matprat.no",
    timeMinutes: 20,
    servings: 2,
    ingredients: ["200g spaghetti", "80g pecorino romano", "2 ts sortpepper", "salt"],
    steps: [
      "Kok pastaen i godt saltet vann.",
      "Riv pecorino og knus pepperen grovt.",
      "Bland pasta, ost og pepper med litt pastavann til en kremet saus.",
      "Server umiddelbart.",
    ],
    tags: ["Italiensk", "Rask"],
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "demo-2",
    title: "Krydret laks med ris",
    description:
      "Bakt laks med soya, ingefær og hvitløk, servert med dampende ris.",
    source: "AI-generert",
    timeMinutes: 30,
    servings: 2,
    ingredients: [
      "2 laksefileter",
      "200g basmatiris",
      "2 ss soyasaus",
      "1 stykke ingefær",
      "2 fedd hvitløk",
      "1 ss honning",
      "Limesaft",
    ],
    steps: [
      "Sett ovnen på 200°C. Kok risen.",
      "Bland soya, hakket ingefær, hvitløk, honning og limesaft.",
      "Legg laksen i en form, hell over marinaden.",
      "Stek i 12-15 min til laksen er flakkende.",
      "Server over risen med litt fersk koriander.",
    ],
    tags: ["Hverdag", "Fisk"],
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
];

interface Ctx {
  recipes: SavedRecipe[];
  save: (r: Omit<SavedRecipe, "id" | "savedAt">) => SavedRecipe;
  remove: (id: string) => void;
  hydrated: boolean;
}

const SavedCtx = createContext<Ctx | undefined>(undefined);

export function SavedRecipesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recipes, setRecipes] = useState<SavedRecipe[]>(DEFAULT_RECIPES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecipes(JSON.parse(saved));
      } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes, hydrated]);

  const save = useCallback(
    (r: Omit<SavedRecipe, "id" | "savedAt">) => {
      const recipe: SavedRecipe = {
        ...r,
        id: `r-${Date.now()}`,
        savedAt: Date.now(),
      };
      setRecipes((prev) => [recipe, ...prev]);
      return recipe;
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <SavedCtx.Provider value={{ recipes, save, remove, hydrated }}>
      {children}
    </SavedCtx.Provider>
  );
}

export function useSavedRecipes() {
  const ctx = useContext(SavedCtx);
  if (!ctx) {
    throw new Error(
      "useSavedRecipes must be used within a SavedRecipesProvider",
    );
  }
  return ctx;
}
