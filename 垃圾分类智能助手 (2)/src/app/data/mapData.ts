import { GarbageCategory } from "./garbageData";

export interface RecyclePoint {
  id: string;
  name: string;
  address: string;
  distance: number; // meters
  types: GarbageCategory[];
  isOpen: boolean;
  hours: string;
  phone?: string;
  top: number; // percentage for mock map position
  left: number;
}

export const NEARBY_POINTS: RecyclePoint[] = [
  {
    id: "1",
    name: "阳光小区垃圾分类驿站",
    address: "阳光路12号小区门口",
    distance: 80,
    types: ["recyclable", "hazardous", "wet", "dry"],
    isOpen: true,
    hours: "07:00–09:00 / 18:00–20:00",
    phone: "021-12345678",
    top: 38,
    left: 48,
  },
  {
    id: "2",
    name: "绿色回收驿站（超市旁）",
    address: "文明路58号大润发旁",
    distance: 230,
    types: ["recyclable"],
    isOpen: true,
    hours: "09:00–18:00（全天）",
    phone: "021-87654321",
    top: 22,
    left: 62,
  },
  {
    id: "3",
    name: "社区有害垃圾收集点",
    address: "和平街道办事处院内",
    distance: 360,
    types: ["hazardous"],
    isOpen: false,
    hours: "周一至周五 09:00–17:00",
    top: 60,
    left: 30,
  },
  {
    id: "4",
    name: "蓝天旧衣物回收站",
    address: "幸福里商业街B区入口",
    distance: 470,
    types: ["recyclable"],
    isOpen: true,
    hours: "全天 24 小时",
    top: 18,
    left: 35,
  },
  {
    id: "5",
    name: "大件垃圾临时收集点",
    address: "朝阳路绿地公园北门",
    distance: 610,
    types: ["dry"],
    isOpen: true,
    hours: "08:00–12:00（每周六）",
    top: 70,
    left: 65,
  },
  {
    id: "6",
    name: "智慧垃圾分类站",
    address: "科技园区智谷路88号",
    distance: 890,
    types: ["recyclable", "wet", "dry"],
    isOpen: true,
    hours: "全天 24 小时",
    phone: "400-888-9999",
    top: 80,
    left: 50,
  },
  {
    id: "7",
    name: "菜场旁湿垃圾收集点",
    address: "民生路农贸市场北侧",
    distance: 1100,
    types: ["wet"],
    isOpen: false,
    hours: "06:00–08:30（每日）",
    top: 30,
    left: 78,
  },
];

export const CATEGORY_MAP_COLORS: Record<GarbageCategory, string> = {
  recyclable: "#3b82f6",
  hazardous: "#ef4444",
  wet: "#22c55e",
  dry: "#6b7280",
};

export const CATEGORY_MAP_EMOJIS: Record<GarbageCategory, string> = {
  recyclable: "♻️",
  hazardous: "⚠️",
  wet: "🌿",
  dry: "🗑️",
};
