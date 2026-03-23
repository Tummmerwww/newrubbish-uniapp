import { useState } from "react";
import { Settings, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { AppMode, Dialect } from "../types";
import { DIALECT_INFO } from "../data/dialectData";

const MODES: { id: AppMode; emoji: string; label: string; sub: string; colors: string }[] = [
  {
    id: "standard",
    emoji: "🌿",
    label: "标准版",
    sub: "默认界面",
    colors: "bg-green-50 border-green-300 text-green-700",
  },
  {
    id: "children",
    emoji: "🎨",
    label: "儿童版",
    sub: "趣味动画",
    colors: "bg-yellow-50 border-yellow-300 text-yellow-700",
  },
  {
    id: "elderly",
    emoji: "👴",
    label: "老年版",
    sub: "大字清晰",
    colors: "bg-blue-50 border-blue-300 text-blue-700",
  },
  {
    id: "dialect",
    emoji: "🗣️",
    label: "方言版",
    sub: "多地方言",
    colors: "bg-purple-50 border-purple-300 text-purple-700",
  },
];

const DIALECTS: Dialect[] = ["mandarin", "shanghainese", "cantonese", "sichuan", "northeast"];

export function ModeSelector() {
  const { mode, setMode, dialect, setDialect, activeTab, setActiveTab } = useApp();
  const [open, setOpen] = useState(false);

  const currentMode = MODES.find((m) => m.id === mode)!;

  const handleSetMode = (newMode: AppMode) => {
    setMode(newMode);
    // If currently on the game tab and switching away from children, redirect to classify
    if (activeTab === "game" && newMode !== "children") {
      setActiveTab("classify");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-50 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all cursor-pointer"
        title="切换界面模式"
      >
        <Settings size={20} className="text-gray-600" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-gray-800">界面切换</h2>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Mode Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSetMode(m.id)}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  mode === m.id ? m.colors + " border-opacity-100" : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <div className="text-left">
                  <p className="leading-tight" style={{ fontWeight: 600 }}>{m.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{m.sub}</p>
                </div>
                {mode === m.id && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 bg-white/60 rounded-full">✓ 当前</span>
                )}
              </button>
            ))}
          </div>

          {/* Dialect Selector - shown when mode is dialect */}
          {mode === "dialect" && (
            <div>
              <p className="text-gray-500 text-sm mb-3">选择方言</p>
              <div className="grid grid-cols-1 gap-2">
                {DIALECTS.map((d) => {
                  const info = DIALECT_INFO[d];
                  return (
                    <button
                      key={d}
                      onClick={() => setDialect(d)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        dialect === d
                          ? "bg-purple-50 border-purple-300 text-purple-700"
                          : "bg-white border-gray-100 text-gray-700 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-xl">{info.emoji}</span>
                      <div className="text-left flex-1">
                        <p style={{ fontWeight: 600 }}>{info.name}</p>
                        <p className="text-xs opacity-60">{info.desc}</p>
                      </div>
                      {dialect === d && <span className="text-purple-500 text-sm">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode Descriptions */}
          <div className="mt-5 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-500">
              {mode === "standard" && "📱 标准界面，适合日常使用，功能完整"}
              {mode === "children" && "🎨 儿童版界面色彩鲜艳、语言简单，让小朋友轻松学习垃圾分类"}
              {mode === "elderly" && "👴 老年版字体更大、操作简单、对比度高，方便老年人使用"}
              {mode === "dialect" && "🗣️ 方言版支持上海话、粤语、四川话、东北话等多种地方方言"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}