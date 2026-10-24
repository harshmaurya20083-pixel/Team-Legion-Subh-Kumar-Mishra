// Saved items: one shared list of IDs, kept in React context and mirrored to localStorage.
// Every page reads from the same place, so save state is always consistent.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "myworld:saved";

interface SavedContextValue {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Read from the browser after the page loads (localStorage doesn't exist on the server).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedIds(JSON.parse(raw));
    } catch {
      /* ignore broken storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds, loaded]);

  const toggleSaved = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <SavedContext.Provider value={{ savedIds, isSaved: (id) => savedIds.includes(id), toggleSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside <SavedProvider>");
  return ctx;
}
