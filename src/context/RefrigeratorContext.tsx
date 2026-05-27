'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Item {
  id: string;
  name: string;
  section: 'top' | 'middle' | 'vegetable';
  addedDate: number; // timestamp
}

interface RefrigeratorContextType {
  items: Item[];
  addItem: (name: string, section: Item['section']) => void;
  removeItem: (id: string) => void;
}

const RefrigeratorContext = createContext<RefrigeratorContextType | undefined>(undefined);

const STORAGE_KEY = 'mykitchen_fridge';

export function RefrigeratorProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Last fra localStorage når appen starter
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load items from localStorage', e);
      }
    }
    setHydrated(true);
  }, []);

  // Lagre til localStorage når items endrer
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = (name: string, section: Item['section']) => {
    const newItem: Item = {
      id: Date.now().toString(),
      name,
      section,
      addedDate: Date.now(),
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <RefrigeratorContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </RefrigeratorContext.Provider>
  );
}

export function useRefrigerator() {
  const context = useContext(RefrigeratorContext);
  if (context === undefined) {
    throw new Error('useRefrigerator must be used within RefrigeratorProvider');
  }
  return context;
}
