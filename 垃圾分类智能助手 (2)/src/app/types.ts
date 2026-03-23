export type AppMode = "standard" | "children" | "elderly" | "dialect";
export type Dialect = "mandarin" | "shanghainese" | "cantonese" | "sichuan" | "northeast";
export type ActiveTab = "classify" | "camera" | "map" | "user" | "game";

export interface RecentQuery {
  name: string;
  category: string; // GarbageCategory
  timestamp: number;
}
