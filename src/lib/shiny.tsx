/* Global shiny-mode toggle (design.md §9.1 navbar Sparkles toggle) */
/* eslint-disable react-refresh/only-export-components -- context + hook colocated by design */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ShinyState {
  shiny: boolean;
  toggleShiny: () => void;
}

const ShinyContext = createContext<ShinyState>({ shiny: false, toggleShiny: () => undefined });

const KEY = 'pdx:shiny-mode';

export function ShinyProvider({ children }: { children: ReactNode }) {
  const [shiny, setShiny] = useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, shiny ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [shiny]);

  return (
    <ShinyContext.Provider value={{ shiny, toggleShiny: () => setShiny((s) => !s) }}>
      {children}
    </ShinyContext.Provider>
  );
}

export function useShiny(): ShinyState {
  return useContext(ShinyContext);
}
