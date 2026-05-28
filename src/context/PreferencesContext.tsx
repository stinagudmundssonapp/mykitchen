"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Preferences = {
  allergies: string[];
  diet: string;
  dislikes: string;
  household: number;
  budget: "low" | "mid" | "high";
};

const DEFAULT_PREFS: Preferences = {
  allergies: [],
  diet: "Alt",
  dislikes: "",
  household: 2,
  budget: "mid",
};

const STORAGE_KEY = "mykitchen_preferences";

interface PreferencesContextType {
  prefs: Preferences;
  setPrefs: (patch: Partial<Preferences>) => void;
  hydrated: boolean;
}

const Ctx = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setState] = useState<Preferences>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<Preferences>;
        setState({ ...DEFAULT_PREFS, ...parsed });
      } catch {
        // ignore corrupt data
      }
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }
  }, [prefs, hydrated]);

  const setPrefs = useCallback((patch: Partial<Preferences>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <Ctx.Provider value={{ prefs, setPrefs, hydrated }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "usePreferences must be used within a PreferencesProvider",
    );
  }
  return ctx;
}
