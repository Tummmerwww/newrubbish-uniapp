import { useState } from "react";
import { Edit2, Check, Trash2, Clock, Star, Trophy, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

// ─── Level System ────────────────────────────────────────────────────────────

const LEVELS = [
  { min: 0,    label: "环保新手",   emoji: "🌱", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", next: 100  },
  { min: 100,  label: "分类达人",   emoji: "🌿", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", next: 300  },
  { min: 300,  label: "绿色卫士",   emoji: "🌳", color: "#0d9488", bg: "#f0fdfa", border: "#5eead4", next: 600  },
  { min: 600,  label: "地球守护者", emoji: "🌍", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", next: 1000 },
  { min: 1000, label: "环保大师",   emoji: "⭐", color: "#d97706", bg: "#fffbeb", border: "#fde68a", next: Infinity },
];

const CHILDREN_LEVELS = [
  { min: 0,   label: "小小环保员",   emoji: "🐣", stars: 1, color: "#22c55e", bg: "#f0fdf4", next: 50  },
  { min: 50,  label: "分类小达人",   emoji: "🐥", stars: 2, color: "#3b82f6", bg: "#eff6ff", next: 150 },
  { min: 150, label: "垃圾分类能手", emoji: "🦜", stars: 3, color: "#8b5cf6", bg: "#f5f3ff", next: 300 },
  { min: 300, label: "环保小卫士",   emoji: "🦸", stars: 4, color: "#f59e0b", bg: "#fffbeb", next: 500 },
  { min: 500, label: "地球小守护者", emoji: "🌟", stars: 5, color: "#ef4444", bg: "#fef2f2", next: Infinity },
];

function getLevel<T extends { min: number }>(points: number, levels: T[]): T & { index: number } {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) return { ...levels[i], index: i };
  }
  return { ...levels[0], index: 0 };
}

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
  return `${Math.floor(diff / 86400000)} 天前`;
}

const CAT_BADGE: Record<string, { label: string; color: string; emoji: string }> = {
  recyclable: { label: "可回收物", color: "bg-blue-100 text-blue-700",   emoji: "♻️" },
  hazardous:  { label: "有害垃圾", color: "bg-red-100 text-red-700",     emoji: "⚠️" },
  wet:        { label: "湿垃圾",   color: "bg-green-100 text-green-700", emoji: "🌿" },
  dry:        { label: "干垃圾",   color: "bg-gray-100 text-gray-600",   emoji: "🗑️" },
};

// ─── Nickname Editor ─────────────────────────────────────────────────────────

function NicknameEditor({ dark = false }: { dark?: boolean }) {
  const { nickname, setNickname } = useApp();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(nickname);

  const save = () => {
    if (val.trim()) setNickname(val.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          onBlur={save}
          autoFocus
          maxLength={12}
          className={`rounded-xl px-3 py-1 outline-none border flex-1 ${
            dark ? "bg-white/20 text-white border-white/40 placeholder-white/60" : "bg-gray-100 text-gray-800 border-gray-200"
          }`}
          style={{ fontSize: "1rem" }}
        />
        <button onClick={save} className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${dark ? "bg-white/20 hover:bg-white/30" : "bg-green-100 hover:bg-green-200"}`}>
          <Check size={14} className={dark ? "text-white" : "text-green-600"} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={dark ? "text-white font-bold" : "text-gray-800 font-bold"} style={{ fontSize: "1.1rem" }}>
        {nickname}
      </span>
      <button
        onClick={() => { setVal(nickname); setEditing(true); }}
        className={`cursor-pointer opacity-70 hover:opacity-100 transition-opacity`}
      >
        <Edit2 size={14} className={dark ? "text-white" : "text-gray-400"} />
      </button>
    </div>
  );
}

// ─── Recent Queries List ─────────────────────────────────────────────────────

function RecentQueriesList({ large = false }: { large?: boolean }) {
  const { recentQueries, clearRecentQueries } = useApp();

  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden ${large ? "border-2" : ""}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-green-500" />
          <span className="text-gray-700 font-semibold" style={{ fontSize: large ? "1.1rem" : "0.95rem" }}>最近查询</span>
        </div>
        {recentQueries.length > 0 && (
          <button
            onClick={clearRecentQueries}
            className="flex items-center gap-1 text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
            style={{ fontSize: "0.75rem" }}
          >
            <Trash2 size={12} /> 清空记录
          </button>
        )}
      </div>

      {recentQueries.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p style={{ fontSize: large ? "1rem" : "0.875rem" }}>暂无查询记录</p>
          <p style={{ fontSize: large ? "0.9rem" : "0.75rem", marginTop: 4 }}>搜索物品后会记录在这里</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          {recentQueries.map((q, i) => {
            const badge = CAT_BADGE[q.category];
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <span style={{ fontSize: large ? "1.5rem" : "1.2rem" }}>{badge?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 truncate" style={{ fontSize: large ? "1.1rem" : "0.875rem" }}>{q.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${badge?.color}`} style={{ fontSize: large ? "0.85rem" : "0.7rem" }}>
                  {badge?.label}
                </span>
                <span className="text-gray-300 text-xs shrink-0 hidden sm:block" style={{ fontSize: "0.7rem" }}>
                  {formatTime(q.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Standard / Dialect User Page ────────────────────────────────────────────

function StandardUserPage() {
  const { points, recentQueries } = useApp();
  const level = getLevel(points, LEVELS);
  const progress =
    level.next === Infinity
      ? 100
      : Math.min(100, ((points - level.min) / (level.next - level.min)) * 100);

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* Profile Card */}
        <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div
            className="p-6"
            style={{ background: `linear-gradient(135deg, ${level.color}cc, ${level.color}99)` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-white/25">
                {level.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <NicknameEditor dark />
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/25 text-white font-medium">
                    {level.label}
                  </span>
                  <span className="text-white/70 text-xs">Lv.{level.index + 1}</span>
                </div>
              </div>
            </div>

            {/* Points Progress */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-white/80 mb-1.5">
                <span className="flex items-center gap-1"><Zap size={10} /> {points} 积分</span>
                {level.next === Infinity
                  ? <span>🎉 最高等级</span>
                  : <span>距下一级 {level.next - points} 分</span>}
              </div>
              <div className="h-2.5 bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white grid grid-cols-3 divide-x divide-gray-50">
            {[
              { value: points, label: "累计积分", icon: <Trophy size={14} className="text-yellow-400" /> },
              { value: recentQueries.length, label: "查询物品", icon: <Clock size={14} className="text-blue-400" /> },
              { value: `Lv.${level.index + 1}`, label: "当前等级", icon: <Star size={14} className="text-green-400" /> },
            ].map(({ value, label, icon }) => (
              <div key={label} className="text-center py-4">
                <div className="flex justify-center mb-1">{icon}</div>
                <p className="text-gray-800" style={{ fontWeight: 700, fontSize: "1.3rem" }}>{value}</p>
                <p className="text-gray-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Levels Overview */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-600 font-semibold mb-3 text-sm">🏆 等级体系</p>
          <div className="space-y-2">
            {LEVELS.map((lv, i) => {
              const isCurrent = level.index === i;
              const isDone = points >= lv.min;
              return (
                <div
                  key={lv.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                    isCurrent ? "border-2 bg-opacity-20" : "border-transparent"
                  }`}
                  style={isCurrent ? { borderColor: lv.color, backgroundColor: lv.bg } : {}}
                >
                  <span style={{ fontSize: "1.4rem", opacity: isDone ? 1 : 0.3 }}>{lv.emoji}</span>
                  <div className="flex-1">
                    <p style={{ color: isDone ? "#1f2937" : "#9ca3af", fontWeight: isCurrent ? 700 : 400, fontSize: "0.875rem" }}>
                      {lv.label}
                    </p>
                    <p style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                      {lv.next === Infinity ? `${lv.min}+ 积分` : `${lv.min} – ${lv.next} 积分`}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: lv.color }}>
                      当前
                    </span>
                  )}
                  {!isCurrent && isDone && (
                    <span className="text-green-500 text-sm">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <RecentQueriesList />
      </div>
    </div>
  );
}

// ─── Children User Page ───────────────────────────────────────────────────────

function ChildrenUserPage() {
  const { points, recentQueries, setActiveTab } = useApp();
  const level = getLevel(points, CHILDREN_LEVELS);
  const progress =
    level.next === Infinity
      ? 100
      : Math.min(100, ((points - level.min) / (level.next - level.min)) * 100);

  const ACHIEVEMENTS = [
    { emoji: "🔍", label: "初次查询", desc: "完成了第一次查询", unlocked: recentQueries.length >= 1 },
    { emoji: "📚", label: "学习达人", desc: "查询了 5 种物品", unlocked: recentQueries.length >= 5 },
    { emoji: "🌟", label: "积分新星", desc: "获得 50 积分", unlocked: points >= 50 },
    { emoji: "🎮", label: "游戏高手", desc: "获得 100 积分", unlocked: points >= 100 },
    { emoji: "🏆", label: "环保冠军", desc: "查询了 20 种物品", unlocked: recentQueries.length >= 20 },
    { emoji: "💎", label: "积分大王", desc: "获得 300 积分", unlocked: points >= 300 },
  ];

  return (
    <div
      className="min-h-screen pb-28 px-4 pt-4"
      style={{ background: "linear-gradient(160deg,#fef9c3 0%,#fce7f3 40%,#dbeafe 100%)" }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border-4 border-purple-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl bg-white/25 border-4 border-white/40">
                {level.emoji}
              </div>
              <div className="flex-1">
                <NicknameEditor dark />
                <p className="text-white/80 text-sm mt-1">{level.label}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ fontSize: "1.4rem", opacity: s <= level.stars ? 1 : 0.25 }}>⭐</span>
              ))}
              <span className="ml-2 text-white/80 text-sm">{points} 积分</span>
            </div>

            {/* Progress bar */}
            {level.next !== Infinity && (
              <div className="mt-3">
                <div className="h-3 bg-white/25 rounded-full overflow-hidden">
                  <div className="h-full bg-white/80 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-white/70 text-xs mt-1">再得 {level.next - points} 分升级 ⬆️</p>
              </div>
            )}
            {level.next === Infinity && (
              <p className="text-white/90 text-sm mt-3">🎉 已达到最高等级！太棒了！</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-purple-50 bg-purple-50/40">
            {[
              { value: points, label: "总积分", emoji: "🌟" },
              { value: recentQueries.length, label: "认识物品", emoji: "📦" },
              { value: level.stars, label: "获得星星", emoji: "⭐" },
            ].map(({ value, label, emoji }) => (
              <div key={label} className="text-center py-4">
                <p style={{ fontSize: "1.4rem" }}>{emoji}</p>
                <p style={{ fontWeight: 700, fontSize: "1.3rem", color: "#7c3aed" }}>{value}</p>
                <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Game Entry Button */}
        <button
          onClick={() => setActiveTab("game")}
          className="w-full rounded-3xl border-4 border-yellow-200 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 flex items-center gap-4 cursor-pointer hover:from-yellow-500 hover:to-orange-500 transition-all shadow-md"
        >
          <span style={{ fontSize: "3rem" }}>🎮</span>
          <div className="text-left">
            <p style={{ fontSize: "1.2rem", fontWeight: 700 }}>垃圾分类大挑战</p>
            <p style={{ fontSize: "0.85rem", opacity: 0.9 }}>玩游戏赢积分 · 每题 10 分</p>
          </div>
          <span className="ml-auto text-2xl">▶</span>
        </button>

        {/* Achievements */}
        <div className="bg-white rounded-3xl border-4 border-purple-100 shadow-sm p-5">
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "#7c3aed", marginBottom: 12 }}>🏅 成就徽章</p>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.label}
                className={`rounded-2xl p-3 text-center border-2 transition-all ${
                  a.unlocked ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-gray-50 opacity-40"
                }`}
              >
                <p style={{ fontSize: "2rem", filter: a.unlocked ? "none" : "grayscale(1)" }}>{a.emoji}</p>
                <p style={{ fontSize: "0.7rem", fontWeight: 600, color: a.unlocked ? "#374151" : "#9ca3af", marginTop: 4 }}>{a.label}</p>
                <p style={{ fontSize: "0.6rem", color: "#9ca3af", marginTop: 2 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Queries */}
        <div className="bg-white rounded-3xl border-4 border-purple-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50">
            <p style={{ fontWeight: 700, color: "#7c3aed" }}>📋 查询过的物品</p>
          </div>
          {recentQueries.length === 0 ? (
            <div className="py-8 text-center">
              <p style={{ fontSize: "2.5rem" }}>🔍</p>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: 8 }}>还没有查询记录哦～</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-50 max-h-72 overflow-y-auto">
              {recentQueries.map((q, i) => {
                const badge = CAT_BADGE[q.category];
                return (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <span style={{ fontSize: "1.2rem" }}>{badge?.emoji}</span>
                    <p className="flex-1 text-gray-700 text-sm">{q.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge?.color}`}>{badge?.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Elderly User Page ────────────────────────────────────────────────────────

function ElderlyUserPage() {
  const { points, recentQueries, clearRecentQueries } = useApp();
  const level = getLevel(points, LEVELS);

  return (
    <div className="min-h-screen pb-32 bg-white px-4 pt-5">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Header */}
        <div className="bg-green-600 text-white rounded-3xl p-5 text-center">
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>我的账户</p>
        </div>

        {/* Profile */}
        <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl bg-green-100 border-2 border-green-300">
              {level.emoji}
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <p style={{ color: "#6b7280", fontSize: "1rem" }}>我的昵称</p>
                <NicknameEditor />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: level.color }}>
                {level.label}
              </span>
            </div>
          </div>
        </div>

        {/* Big Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-5 text-center">
            <p style={{ fontSize: "2.5rem" }}>🏆</p>
            <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "#92400e" }}>{points}</p>
            <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>累计积分</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-5 text-center">
            <p style={{ fontSize: "2.5rem" }}>📋</p>
            <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1e40af" }}>{recentQueries.length}</p>
            <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>查询物品</p>
          </div>
        </div>

        {/* How to earn */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-5">
          <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#374151", marginBottom: 10 }}>如何获得积分</p>
          {[
            { icon: "🔍", text: "搜索一种垃圾 → 获得 5 积分" },
            { icon: "📷", text: "拍照识别垃圾 → 获得 10 积分" },
            { icon: "🎮", text: "玩分类游戏   → 最高 100 积分" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
              <p style={{ fontSize: "1.1rem", color: "#4b5563" }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Recent Queries - Elderly Style */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
            <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#374151" }}>最近查询记录</p>
            {recentQueries.length > 0 && (
              <button onClick={clearRecentQueries} style={{ fontSize: "0.9rem", color: "#ef4444" }} className="cursor-pointer">
                清空
              </button>
            )}
          </div>
          {recentQueries.length === 0 ? (
            <div className="py-10 text-center">
              <p style={{ fontSize: "2.5rem" }}>📋</p>
              <p style={{ fontSize: "1.1rem", color: "#9ca3af", marginTop: 8 }}>暂无查询记录</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {recentQueries.map((q, i) => {
                const badge = CAT_BADGE[q.category];
                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <span style={{ fontSize: "1.8rem" }}>{badge?.emoji}</span>
                    <p className="flex-1 text-gray-700" style={{ fontSize: "1.2rem" }}>{q.name}</p>
                    <span className={`px-3 py-1 rounded-full ${badge?.color}`} style={{ fontSize: "0.9rem" }}>
                      {badge?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function UserPage() {
  const { mode } = useApp();
  if (mode === "children") return <ChildrenUserPage />;
  if (mode === "elderly") return <ElderlyUserPage />;
  return <StandardUserPage />;
}
