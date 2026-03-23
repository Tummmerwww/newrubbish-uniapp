import { createContext, useContext, useState, ReactNode } from "react";
import { AppMode, Dialect, ActiveTab, RecentQuery } from "../types";

export type { AppMode, Dialect, ActiveTab, RecentQuery };

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  dialect: Dialect;
  setDialect: (dialect: Dialect) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // User
  nickname: string;
  setNickname: (name: string) => void;
  points: number;
  addPoints: (n: number) => void;
  recentQueries: RecentQuery[];
  addRecentQuery: (q: RecentQuery) => void;
  clearRecentQueries: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const LS = {
  nickname: "gc_nickname",
  points: "gc_points",
  queries: "gc_recent_queries",
};

function readLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>("standard");
  const [dialect, setDialect] = useState<Dialect>("mandarin");
  const [activeTab, setActiveTab] = useState<ActiveTab>("classify");

  const [nickname, setNicknameState] = useState<string>(
    () => localStorage.getItem(LS.nickname) || "环保达人"
  );
  const [points, setPoints] = useState<number>(
    () => readLS<number>(LS.points, 0)
  );
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>(
    () => readLS<RecentQuery[]>(LS.queries, [])
  );

  const setNickname = (name: string) => {
    setNicknameState(name);
    localStorage.setItem(LS.nickname, name);
  };

  const addPoints = (n: number) => {
    setPoints((prev) => {
      const next = prev + n;
      localStorage.setItem(LS.points, JSON.stringify(next));
      return next;
    });
  };

  const addRecentQuery = (q: RecentQuery) => {
    setRecentQueries((prev) => {
      const filtered = prev.filter((r) => r.name !== q.name);
      const next = [q, ...filtered].slice(0, 30);
      localStorage.setItem(LS.queries, JSON.stringify(next));
      return next;
    });
  };

  const clearRecentQueries = () => {
    setRecentQueries([]);
    localStorage.removeItem(LS.queries);
  };

  return (
    <AppContext.Provider
      value={{
        mode, setMode,
        dialect, setDialect,
        activeTab, setActiveTab,
        nickname, setNickname,
        points, addPoints,
        recentQueries, addRecentQuery, clearRecentQueries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
