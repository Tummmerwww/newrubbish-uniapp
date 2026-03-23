import { useState } from "react";
import { MapPin, Navigation, Clock, Phone, Filter, ChevronRight, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getText } from "../data/dialectData";
import { NEARBY_POINTS, RecyclePoint, CATEGORY_MAP_COLORS, CATEGORY_MAP_EMOJIS } from "../data/mapData";
import { GarbageCategory } from "../data/garbageData";

const FILTER_OPTIONS: { id: GarbageCategory | "all"; label: string; emoji: string; color: string }[] = [
  { id: "all", label: "全部", emoji: "📍", color: "#6b7280" },
  { id: "recyclable", label: "可回收", emoji: "♻️", color: "#3b82f6" },
  { id: "hazardous", label: "有害", emoji: "⚠️", color: "#ef4444" },
  { id: "wet", label: "湿垃圾", emoji: "🌿", color: "#22c55e" },
  { id: "dry", label: "干垃圾", emoji: "🗑️", color: "#6b7280" },
];

function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
}

export function MapPage() {
  const { mode, dialect } = useApp();
  const t = getText(dialect);

  const [filter, setFilter] = useState<GarbageCategory | "all">("all");
  const [selected, setSelected] = useState<RecyclePoint | null>(null);
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);

  const isElderly = mode === "elderly";
  const isChildren = mode === "children";

  const filtered = filter === "all"
    ? NEARBY_POINTS
    : NEARBY_POINTS.filter((p) => p.types.includes(filter));

  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => { setLocating(false); setLocated(true); }, 1800);
  };

  return (
    <div
      className={`min-h-screen pb-28 ${isElderly ? "bg-white" : isChildren ? "" : "bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50"}`}
      style={isChildren ? { background: "linear-gradient(160deg,#fef9c3 0%,#fce7f3 40%,#dbeafe 100%)" } : {}}
    >
      <div className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* Header */}
        {isElderly ? (
          <div className="bg-green-600 text-white rounded-3xl p-5 text-center">
            <p style={{ fontSize: "2rem", fontWeight: 700 }}>{t.mapTitle}</p>
            <p style={{ fontSize: "1.1rem", opacity: 0.85, marginTop: 4 }}>{t.mapSub}</p>
          </div>
        ) : isChildren ? (
          <div className="text-center mb-2">
            <div className="text-5xl mb-2">🗺️</div>
            <h1 style={{ fontSize: "1.5rem", color: "#7c3aed" }}>{t.mapTitle}</h1>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>{t.mapSub}</p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-gray-800 mb-1" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{t.mapTitle}</h1>
            <p className="text-gray-400 text-sm">{t.mapSub}</p>
          </div>
        )}

        {/* Mock Map */}
        <div className="relative rounded-3xl overflow-hidden bg-green-100 shadow-md" style={{ height: isElderly ? 240 : 200 }}>
          {/* Map background pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,0.04) 0px,rgba(0,0,0,0.04) 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,rgba(0,0,0,0.04) 0px,rgba(0,0,0,0.04) 1px,transparent 1px,transparent 40px)",
            background: "linear-gradient(135deg,#d1fae5 0%,#a7f3d0 50%,#6ee7b7 100%)"
          }} />
          {/* Roads */}
          <div className="absolute inset-0">
            <div className="absolute bg-white/60" style={{ top: "50%", left: 0, right: 0, height: 3, transform: "translateY(-50%)" }} />
            <div className="absolute bg-white/60" style={{ left: "50%", top: 0, bottom: 0, width: 3, transform: "translateX(-50%)" }} />
          </div>

          {/* Points */}
          {NEARBY_POINTS.filter((p) => filter === "all" || p.types.includes(filter)).map((point) => {
            const primaryType = point.types[0];
            const color = CATEGORY_MAP_COLORS[primaryType];
            const emoji = CATEGORY_MAP_EMOJIS[primaryType];
            const isSelected = selected?.id === point.id;
            return (
              <button
                key={point.id}
                onClick={() => setSelected(isSelected ? null : point)}
                className="absolute cursor-pointer transition-all"
                style={{ top: `${point.top}%`, left: `${point.left}%`, transform: "translate(-50%,-100%)", zIndex: isSelected ? 20 : 10 }}
              >
                <div
                  className="flex flex-col items-center"
                  style={{ filter: isSelected ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                >
                  <div
                    className="rounded-full flex items-center justify-center text-white"
                    style={{
                      backgroundColor: color,
                      width: isSelected ? 36 : 28,
                      height: isSelected ? 36 : 28,
                      fontSize: isSelected ? 16 : 13,
                      border: isSelected ? "3px solid white" : "2px solid white",
                      transition: "all 0.2s"
                    }}
                  >
                    {emoji}
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${color}` }} />
                </div>
              </button>
            );
          })}

          {/* "You are here" */}
          {located && (
            <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
              <div className="w-5 h-5 bg-blue-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-40" />
            </div>
          )}

          {/* Locate button */}
          <button
            onClick={handleLocate}
            className="absolute top-3 right-3 bg-white rounded-xl shadow-md px-3 py-2 flex items-center gap-1.5 text-xs text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Navigation size={12} className={locating ? "animate-spin text-blue-500" : "text-gray-500"} />
            {locating ? "定位中..." : t.locate}
          </button>

          {/* Map label */}
          <div className="absolute bottom-3 left-3 text-xs text-gray-500 bg-white/70 rounded-lg px-2 py-1">
            📍 模拟地图（示意）
          </div>
        </div>

        {/* Selected detail card */}
        {selected && (
          <div className={`rounded-2xl border-2 overflow-hidden shadow-lg ${isElderly ? "border-green-200" : "border-gray-100"} bg-white`}>
            <div className="flex items-start gap-3 p-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: CATEGORY_MAP_COLORS[selected.types[0]] + "20", border: `2px solid ${CATEGORY_MAP_COLORS[selected.types[0]]}` }}
              >
                {CATEGORY_MAP_EMOJIS[selected.types[0]]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 font-semibold text-sm leading-snug pr-2">{selected.name}</p>
                  <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 cursor-pointer shrink-0">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{selected.address}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selected.types.map((type) => (
                    <span key={type} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: CATEGORY_MAP_COLORS[type] }}>
                      {CATEGORY_MAP_EMOJIS[type]}
                    </span>
                  ))}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selected.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {selected.isOpen ? t.open : t.closed}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-50 px-4 pb-3 pt-2 flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-blue-400" />
                {t.distance} {formatDistance(selected.distance)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-green-400" />
                {selected.hours}
              </span>
              {selected.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={11} className="text-purple-400" />
                  {selected.phone}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-gray-400" />
            <p className="text-gray-500 text-xs">按类型筛选</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTER_OPTIONS.map((opt) => {
              const isActive = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFilter(opt.id as GarbageCategory | "all")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm shrink-0 cursor-pointer transition-all ${isActive ? "text-white border-transparent shadow-md" : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"}`}
                  style={isActive ? { backgroundColor: opt.color, borderColor: opt.color } : {}}
                >
                  <span style={{ fontSize: "0.9rem" }}>{opt.emoji}</span>
                  <span style={{ fontSize: isElderly ? "1rem" : "0.8rem", fontWeight: isActive ? 700 : 400 }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          <p className="text-gray-500 text-xs">共找到 {filtered.length} 个回收点</p>
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">当前筛选条件下暂无回收点</p>
            </div>
          ) : (
            filtered.map((point) => {
              const isSelectedCard = selected?.id === point.id;
              return (
                <button
                  key={point.id}
                  onClick={() => setSelected(isSelectedCard ? null : point)}
                  className={`w-full rounded-2xl border p-4 text-left cursor-pointer transition-all flex items-center gap-3 ${isSelectedCard ? "border-blue-300 bg-blue-50 shadow-md" : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"}`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: CATEGORY_MAP_COLORS[point.types[0]] + "15", border: `2px solid ${CATEGORY_MAP_COLORS[point.types[0]]}40` }}
                  >
                    {CATEGORY_MAP_EMOJIS[point.types[0]]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-gray-800 text-sm font-semibold truncate pr-2" style={{ fontSize: isElderly ? "1.05rem" : "0.875rem" }}>{point.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${point.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`} style={{ fontSize: isElderly ? "0.85rem" : "0.7rem" }}>
                        {point.isOpen ? t.open : t.closed}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs truncate" style={{ fontSize: isElderly ? "0.9rem" : "0.75rem" }}>{point.address}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-blue-500 flex items-center gap-1" style={{ fontSize: isElderly ? "0.9rem" : "0.7rem" }}>
                        <MapPin size={10} /> {formatDistance(point.distance)}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1" style={{ fontSize: isElderly ? "0.9rem" : "0.7rem" }}>
                        <Clock size={10} /> {point.hours.split("（")[0]}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 shrink-0" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
