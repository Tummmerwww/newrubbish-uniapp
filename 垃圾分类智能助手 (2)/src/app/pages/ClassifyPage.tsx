import { useState } from "react";
import { Search, X, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getText } from "../data/dialectData";
import { GarbageItem, GarbageCategory, CATEGORIES, GARBAGE_DATABASE, searchGarbage, getCategoryInfo } from "../data/garbageData";
import { useVoiceInput, DIALECT_LANG } from "../hooks/useVoiceInput";
import { VoiceButton } from "../components/VoiceButton";

// ─── Shared utilities ───────────────────────────────────────────────────────

const CAT_STYLES = {
  recyclable: { gradient: "from-blue-500 to-blue-600", light: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", icon: "text-blue-500", pill: "bg-blue-500" },
  hazardous:  { gradient: "from-red-500 to-red-600",  light: "bg-red-50",  border: "border-red-200",  badge: "bg-red-100 text-red-700",  icon: "text-red-500",  pill: "bg-red-500" },
  wet:        { gradient: "from-green-500 to-green-600", light: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700", icon: "text-green-500", pill: "bg-green-500" },
  dry:        { gradient: "from-gray-500 to-gray-600", light: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-700", icon: "text-gray-500", pill: "bg-gray-400" },
};

const QUICK_ITEMS = ["矿泉水瓶", "废电池", "剩饭", "卫生纸", "纸板箱", "荧光灯管", "香蕉皮", "快餐盒", "旧衣服", "过期药品"];

// ─── Standard + Dialect ─────────────────────────────────────────────────────

function StandardClassifyPage() {
  const { dialect, addPoints, addRecentQuery } = useApp();
  const t = getText(dialect);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GarbageItem[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [result, setResult] = useState<GarbageItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [recent, setRecent] = useState<GarbageItem[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const addRecent = (item: GarbageItem) =>
    setRecent((prev) => [item, ...prev.filter((i) => i.name !== item.name)].slice(0, 5));

  const select = (item: GarbageItem) => {
    setResult(item); setNotFound(false); setQuery(item.name); setShowSugg(false); addRecent(item);
    addPoints(5);
    addRecentQuery({ name: item.name, category: item.category, timestamp: Date.now() });
  };

  const doSearch = (q: string) => {
    const res = searchGarbage(q);
    if (res.length) { select(res[0]); } else { setResult(null); setNotFound(true); }
    setShowSugg(false);
  };

  const handleChange = (val: string) => {
    setQuery(val);
    if (val.trim()) { setSuggestions(searchGarbage(val)); setShowSugg(true); }
    else { setSuggestions([]); setShowSugg(false); }
  };

  // ── Voice ──
  const voiceLang = DIALECT_LANG[dialect] ?? "zh-CN";
  const voice = useVoiceInput({
    lang: voiceLang,
    onResult: (text) => {
      setQuery(text);
      doSearch(text);
    },
  });

  const catInfo = result ? getCategoryInfo(result.category) : null;
  const s = result ? CAT_STYLES[result.category] : null;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero */}
      <div className="bg-white/70 backdrop-blur border-b border-gray-100 px-4 pt-8 pb-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-800" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {t.heroTitle}
            <span className="text-green-500"> {t.heroHighlight}</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">{t.heroSub}</p>

          {/* Search */}
          <div className="relative mt-5 max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-md border border-gray-100 overflow-visible focus-within:shadow-lg focus-within:border-green-300 transition-all">
              <Search size={18} className="ml-4 text-gray-400 shrink-0" />
              <input
                value={voice.status === "listening" && voice.interimText ? voice.interimText : query}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && query.trim() && doSearch(query.trim())}
                onFocus={() => query.trim() && setShowSugg(true)}
                placeholder={
                  voice.status === "listening"
                    ? "🎤 正在聆听，请说话..."
                    : t.searchPlaceholder
                }
                className="flex-1 py-3.5 px-3 bg-transparent outline-none text-gray-800 placeholder-gray-300"
                readOnly={voice.status === "listening"}
              />
              {query && voice.status === "idle" && (
                <button onClick={() => { setQuery(""); setSuggestions([]); setShowSugg(false); }} className="p-2 text-gray-300 hover:text-gray-500 cursor-pointer">
                  <X size={16} />
                </button>
              )}
              {/* Voice Button */}
              <div className="px-1">
                <VoiceButton
                  status={voice.status}
                  interimText={voice.interimText}
                  supported={voice.supported}
                  onToggle={voice.toggle}
                  variant="standard"
                  showTooltip={false}
                />
              </div>
              <button
                onClick={() => query.trim() && doSearch(query.trim())}
                className="m-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t.searchBtn}
              </button>
            </div>

            {/* Listening indicator strip */}
            {voice.status === "listening" && (
              <div className="mt-1.5 flex items-center gap-2 px-3">
                <div className="flex gap-0.5 items-end h-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-red-400"
                      style={{
                        height: `${Math.random() * 12 + 4}px`,
                        animation: `pulse 0.${i + 3}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-red-400 text-xs">正在聆听… {voice.interimText && `"${voice.interimText}"`}</span>
              </div>
            )}

            {/* Suggestions */}
            {showSugg && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                {suggestions.map((item, i) => {
                  const cat = getCategoryInfo(item.category);
                  return (
                    <button key={i} onClick={() => select(item)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer border-b border-gray-50 last:border-0">
                      <span>{cat.emoji}</span>
                      <span className="flex-1 text-gray-800 text-sm">{item.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_STYLES[item.category].badge}`}>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Voice hint */}
          {voice.supported && voice.status === "idle" && (
            <p className="text-gray-400 mt-2" style={{ fontSize: "0.72rem" }}>
              🎤 点击麦克风图标，直接说出物品名称
            </p>
          )}
          {voice.status === "error" && (
            <p className="text-red-400 mt-2 text-xs">⚠️ 麦克风权限被拒绝，请在浏览器设置中允许访问麦克风</p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Quick Tags */}
        <div className="space-y-3">
          {recent.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">{t.recentLabel}</p>
              <div className="flex flex-wrap gap-2">
                {recent.map((item) => {
                  const cat = getCategoryInfo(item.category);
                  return (
                    <button key={item.name} onClick={() => select(item)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${CAT_STYLES[item.category].badge} border-transparent hover:opacity-80`}>
                      {cat.emoji} {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-2">{t.quickLabel}</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ITEMS.map((name) => {
                const item = GARBAGE_DATABASE.find((i) => i.name === name || (i.keywords||[]).includes(name));
                const cat = item ? getCategoryInfo(item.category) : null;
                return (
                  <button key={name} onClick={() => item && select(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${cat ? CAT_STYLES[cat.id].badge + " border-transparent hover:opacity-80" : "bg-gray-50 text-gray-600 border-gray-100"}`}>
                    {cat?.emoji} {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result */}
        {notFound && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-sm">{t.notFoundMsg}</p>
              <p className="text-amber-600 text-xs mt-1">{t.notFoundTip}</p>
            </div>
          </div>
        )}

        {result && catInfo && s && (
          <div className={`rounded-2xl border ${s.border} overflow-hidden shadow-md`}>
            <div className={`bg-gradient-to-r ${s.gradient} p-5 text-white`}>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{catInfo.emoji}</span>
                <div>
                  <p className="text-white/70 text-xs mb-0.5">{t.resultPrefix}</p>
                  <h2 className="text-white">{result.name}</h2>
                  <p className="text-white/90 text-sm mt-0.5">属于 · {catInfo.name}</p>
                </div>
              </div>
            </div>
            <div className={`${s.light} p-5 space-y-3`}>
              <div className="flex items-start gap-2">
                <Info size={15} className={`${s.icon} shrink-0 mt-0.5`} />
                <p className="text-gray-700 text-sm">{catInfo.description}</p>
              </div>
              {result.tips && (
                <div className="flex items-start gap-2">
                  <CheckCircle size={15} className={`${s.icon} shrink-0 mt-0.5`} />
                  <p className="text-gray-700 text-sm">{result.tips}</p>
                </div>
              )}
              <div className={`${s.light} border ${s.border} rounded-xl p-3.5 bg-white/60`}>
                <p className="text-gray-600 text-sm">📌 {catInfo.guide}</p>
              </div>
            </div>
          </div>
        )}

        {/* Category Guide */}
        <div>
          <h2 className="text-gray-700 mb-3">{t.categoryTitle}</h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const isActive = activeCat === cat.id;
              const st = CAT_STYLES[cat.id as GarbageCategory];
              return (
                <button key={cat.id} onClick={() => setActiveCat(isActive ? null : cat.id)}
                  className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${isActive ? `${st.light} ${st.border} shadow-md` : "bg-white border-gray-100 hover:border-gray-200"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{cat.emoji}</span>
                    {isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 text-gray-600">收起</span>}
                  </div>
                  <h3 className={isActive ? st.icon : "text-gray-700"}>{cat.name}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{cat.description}</p>
                  {isActive && (
                    <div className="mt-3 pt-3 border-t border-current/10">
                      <div className="flex flex-wrap gap-1.5">
                        {cat.examples.map((ex) => (
                          <span key={ex} className={`text-xs px-2 py-0.5 rounded-full ${st.badge}`}>{ex}</span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-2">{cat.guide}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Eco Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 p-5 text-white flex gap-4 items-center">
          <span className="text-4xl">🌍</span>
          <div>
            <h3 className="text-white mb-1">为什么要垃圾分类？</h3>
            <p className="text-green-100 text-sm">垃圾分类减少污染、节约资源，共同守护绿色家园。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Children Mode ───────────────────────────────────────────────────────────

const CHILDREN_CATS = [
  { id: "recyclable" as GarbageCategory, emoji: "♻️", label: "可以再用的", color: "from-blue-400 to-blue-500", light: "bg-blue-50", border: "border-blue-300", badge: "bg-blue-100 text-blue-700" },
  { id: "hazardous" as GarbageCategory, emoji: "⚠️", label: "危险的垃圾", color: "from-red-400 to-red-500", light: "bg-red-50", border: "border-red-300", badge: "bg-red-100 text-red-700" },
  { id: "wet" as GarbageCategory, emoji: "🌿", label: "厨房垃圾", color: "from-green-400 to-green-500", light: "bg-green-50", border: "border-green-300", badge: "bg-green-100 text-green-700" },
  { id: "dry" as GarbageCategory, emoji: "🗑️", label: "其他垃圾", color: "from-gray-400 to-gray-500", light: "bg-gray-50", border: "border-gray-300", badge: "bg-gray-100 text-gray-600" },
];

function ChildrenClassifyPage() {
  const { addPoints, addRecentQuery } = useApp();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<GarbageItem | null>(null);
  const [activeCat, setActiveCat] = useState<GarbageCategory | null>(null);
  const [bounce, setBounce] = useState(false);

  const doSearch = (q?: string) => {
    const term = q ?? query;
    const res = searchGarbage(term);
    if (res.length) {
      setResult(res[0]);
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
      addPoints(5);
      addRecentQuery({ name: res[0].name, category: res[0].category, timestamp: Date.now() });
    }
  };

  // ── Voice ──
  const voice = useVoiceInput({
    lang: "zh-CN",
    onResult: (text) => {
      setQuery(text);
      doSearch(text);
    },
  });

  const catData = result ? CHILDREN_CATS.find((c) => c.id === result.category) : null;
  const catInfo = result ? getCategoryInfo(result.category) : null;
  const activeCatFull = activeCat ? CATEGORIES.find((c) => c.id === activeCat) : null;
  const activeCatChild = activeCat ? CHILDREN_CATS.find((c) => c.id === activeCat) : null;

  return (
    <div className="min-h-screen pb-24 px-4 pt-4" style={{ background: "linear-gradient(160deg, #fef9c3 0%, #fce7f3 40%, #dbeafe 100%)" }}>
      <div className="max-w-lg mx-auto">
        {/* Mascot */}
        <div className="text-center mb-5">
          <div className="text-7xl mb-2" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>
            {voice.status === "listening" ? "🎤" : "🤖"}
          </div>
          <h1 style={{ fontSize: "1.7rem", color: "#7c3aed" }}>垃圾分类小助手</h1>
          <p style={{ color: "#6b7280", fontSize: "1rem" }}>
            {voice.status === "listening"
              ? "我在听！说出物品名称吧～"
              : "告诉我你想扔什么，我来帮你！"}
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl border-4 border-purple-200 p-4 mb-3 shadow-lg">
          <div className="flex gap-2 items-center">
            <input
              value={voice.status === "listening" && voice.interimText ? voice.interimText : query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder={voice.status === "listening" ? "🎤 说话中..." : "输入物品名称，比如：矿泉水瓶"}
              className="flex-1 outline-none text-gray-700 bg-transparent placeholder-gray-300"
              style={{ fontSize: "1rem" }}
              readOnly={voice.status === "listening"}
            />
            {/* Voice Button */}
            <VoiceButton
              status={voice.status}
              interimText={voice.interimText}
              supported={voice.supported}
              onToggle={voice.toggle}
              variant="children"
              showTooltip={false}
            />
            <button onClick={() => doSearch()}
              className="px-5 py-2 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white cursor-pointer transition-colors"
              style={{ fontSize: "1rem", fontWeight: 700 }}>
              查！
            </button>
          </div>

          {/* Listening wave */}
          {voice.status === "listening" && (
            <div className="mt-2 flex items-center gap-1.5 px-1">
              {[1,2,3,4,5,6].map((i) => (
                <span key={i} className="flex-1 rounded-full bg-red-400 block"
                  style={{ height: `${Math.floor(Math.random() * 14) + 4}px`, animation: `pulse 0.${i+2}s ease-in-out infinite alternate` }} />
              ))}
              <span className="text-red-400 ml-2 shrink-0" style={{ fontSize: "0.75rem" }}>
                {voice.interimText ? `"${voice.interimText}"` : "正在聆听～"}
              </span>
            </div>
          )}
        </div>

        {/* Voice hint */}
        {voice.supported && voice.status === "idle" && (
          <p className="text-center mb-4" style={{ color: "#a78bfa", fontSize: "0.8rem" }}>
            🎤 点麦克风，直接说出物品名，超方便！
          </p>
        )}
        {voice.status === "error" && (
          <p className="text-center text-red-400 mb-3" style={{ fontSize: "0.8rem" }}>
            ⚠️ 麦克风权限被拒绝，请在浏览器中允许
          </p>
        )}

        {/* Quick items */}
        <div className="flex flex-wrap gap-2 mb-5 justify-center">
          {["矿泉水瓶", "废电池", "香蕉皮", "卫生纸", "荧光灯管"].map((name) => {
            const item = GARBAGE_DATABASE.find((i) => i.name === name || (i.keywords||[]).includes(name));
            return (
              <button key={name} onClick={() => { if (item) { setQuery(name); setResult(item); } }}
                className="px-4 py-2 bg-white rounded-2xl border-2 border-purple-100 text-purple-700 cursor-pointer hover:border-purple-300 transition-colors"
                style={{ fontSize: "0.9rem" }}>
                {name}
              </button>
            );
          })}
        </div>

        {/* Result */}
        {result && catData && catInfo && (
          <div className={`rounded-3xl overflow-hidden border-4 ${catData.border} mb-5 shadow-lg`}
            style={{ transform: bounce ? "scale(1.03)" : "scale(1)", transition: "transform 0.2s" }}>
            <div className={`bg-gradient-to-r ${catData.color} p-6 text-white text-center`}>
              <div className="text-7xl mb-2">{catInfo.emoji}</div>
              <h2 className="text-white" style={{ fontSize: "1.8rem" }}>{result.name}</h2>
              <p className="text-white/90 mt-1" style={{ fontSize: "1.1rem" }}>应该放进 {catData.label} 桶桶里！</p>
            </div>
            <div className={`${catData.light} p-5 space-y-3`}>
              {result.tips && (
                <div className={`rounded-2xl p-4 border-2 ${catData.border} bg-white/60`}>
                  <p style={{ fontSize: "0.95rem", color: "#374151" }}>💡 小提示：{result.tips}</p>
                </div>
              )}
              <div className={`rounded-2xl p-4 border-2 ${catData.border} bg-white/60`}>
                <p style={{ fontSize: "0.95rem", color: "#374151" }}>📌 {catInfo.guide}</p>
              </div>
            </div>
          </div>
        )}

        {/* Category Cards */}
        <div className="grid grid-cols-2 gap-3">
          {CHILDREN_CATS.map((cat) => {
            const catFull = CATEGORIES.find((c) => c.id === cat.id)!;
            const isActive = activeCat === cat.id;
            return (
              <button key={cat.id}
                onClick={() => setActiveCat(isActive ? null : cat.id)}
                className={`rounded-3xl border-4 p-4 text-center transition-all cursor-pointer ${isActive ? "border-purple-300 shadow-lg" : "border-white bg-white shadow-md hover:shadow-lg"}`}>
                <div className="text-4xl mb-2">{cat.emoji}</div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#374151" }}>{cat.label}</p>
                <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 2 }}>{catFull.examples.slice(0, 2).join("、")}</p>
              </button>
            );
          })}
        </div>

        {/* Active Cat Detail */}
        {activeCat && activeCatChild && activeCatFull && (
          <div className={`mt-3 rounded-3xl border-4 ${activeCatChild.border} ${activeCatChild.light} p-5`}>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "#374151", marginBottom: 8 }}>
              {activeCatChild.emoji} {activeCatChild.label} 有哪些？
            </p>
            <div className="flex flex-wrap gap-2">
              {activeCatFull.examples.map((ex) => (
                <span key={ex} className={`px-3 py-1.5 rounded-full text-sm ${activeCatChild.badge}`}>{ex}</span>
              ))}
            </div>
            <p className="mt-3 text-gray-500 text-sm">{activeCatFull.guide}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Elderly Mode ─────────────────────────────────────────────────────────────

function ElderlyClassifyPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<GarbageItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { addPoints, addRecentQuery } = useApp();

  const doSearch = (q?: string) => {
    const term = q ?? query;
    const res = searchGarbage(term);
    if (res.length) {
      setResult(res[0]); setNotFound(false);
      addPoints(5);
      addRecentQuery({ name: res[0].name, category: res[0].category, timestamp: Date.now() });
    } else { setResult(null); setNotFound(true); }
  };

  // ── Voice ──
  const voice = useVoiceInput({
    lang: "zh-CN",
    onResult: (text) => {
      setQuery(text);
      doSearch(text);
    },
  });

  const catInfo = result ? getCategoryInfo(result.category) : null;
  const s = result ? CAT_STYLES[result.category] : null;

  const ELDERLY_QUICK = ["矿泉水瓶", "废电池", "剩饭", "卫生纸", "纸板箱", "荧光灯管"];

  return (
    <div className="min-h-screen pb-32 bg-white px-4 pt-5">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Title */}
        <div className="bg-green-600 text-white rounded-3xl p-5 text-center">
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>垃圾分类查询</p>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, marginTop: 4 }}>输入物品名称，点击查询</p>
        </div>

        {/* Search */}
        <div className={`border-2 rounded-3xl p-4 space-y-2 transition-colors ${voice.status === "listening" ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
          <div className="flex gap-3 items-center">
            <input
              value={voice.status === "listening" && voice.interimText ? voice.interimText : query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder={voice.status === "listening" ? "🎤 正在聆听，请说话..." : "输入物品，例如：矿泉水瓶"}
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
              style={{ fontSize: "1.3rem" }}
              readOnly={voice.status === "listening"}
            />
            <button onClick={() => doSearch()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl cursor-pointer transition-colors"
              style={{ fontSize: "1.2rem", fontWeight: 700 }}>
              查询
            </button>
          </div>

          {/* Voice row for elderly — big prominent button */}
          {voice.supported && (
            <div className="flex items-center gap-3 pt-1">
              <VoiceButton
                status={voice.status}
                interimText={voice.interimText}
                supported={voice.supported}
                onToggle={voice.toggle}
                variant="elderly"
                showTooltip={false}
              />
              <div className="flex-1">
                {voice.status === "idle" && (
                  <p style={{ fontSize: "1rem", color: "#6b7280" }}>
                    🎤 点击大按钮，说出物品名称，自动查询
                  </p>
                )}
                {voice.status === "listening" && (
                  <div>
                    <p style={{ fontSize: "1.1rem", color: "#dc2626", fontWeight: 700 }}>
                      正在聆听，请说出物品名称…
                    </p>
                    {voice.interimText && (
                      <p style={{ fontSize: "1rem", color: "#6b7280" }}>"{voice.interimText}"</p>
                    )}
                  </div>
                )}
                {voice.status === "processing" && (
                  <p style={{ fontSize: "1rem", color: "#059669" }}>识别中，稍等…</p>
                )}
                {voice.status === "error" && (
                  <p style={{ fontSize: "1rem", color: "#dc2626" }}>
                    ⚠️ 麦克风权限被拒绝，请在设置中允许
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick buttons */}
        <div>
          <p className="text-gray-500 mb-3" style={{ fontSize: "1rem" }}>常见物品（点击查询）：</p>
          <div className="grid grid-cols-2 gap-3">
            {ELDERLY_QUICK.map((name) => {
              const item = GARBAGE_DATABASE.find((i) => i.name === name || (i.keywords||[]).includes(name));
              const cat = item ? getCategoryInfo(item.category) : null;
              return (
                <button key={name}
                  onClick={() => { if (item) { setQuery(name); setResult(item); setNotFound(false); } }}
                  className="py-4 px-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-700 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer flex items-center gap-3">
                  <span style={{ fontSize: "1.5rem" }}>{cat?.emoji || "❓"}</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>{name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Not Found */}
        {notFound && (
          <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-3xl">
            <p style={{ fontSize: "1.2rem", color: "#92400e" }}>⚠️ 没有找到该物品的分类信息</p>
            <p style={{ fontSize: "1rem", color: "#b45309", marginTop: 4 }}>请换个词语重新查询，或参考下面的分类指南</p>
          </div>
        )}

        {/* Result */}
        {result && catInfo && s && (
          <div className={`rounded-3xl border-4 ${s.border} overflow-hidden`}>
            <div className={`bg-gradient-to-r ${s.gradient} p-6 text-white text-center`}>
              <div style={{ fontSize: "4rem" }}>{catInfo.emoji}</div>
              <p style={{ fontSize: "2.2rem", fontWeight: 700, marginTop: 4 }}>{result.name}</p>
              <p style={{ fontSize: "1.4rem", opacity: 0.9 }}>属于：{catInfo.name}</p>
            </div>
            <div className={`${s.light} p-5 space-y-4`}>
              <div className={`p-5 rounded-2xl border-2 ${s.border} bg-white/70`}>
                <p style={{ fontSize: "1.2rem", color: "#374151" }}>
                  <span style={{ fontWeight: 700 }}>说明：</span>{catInfo.description}
                </p>
              </div>
              {result.tips && (
                <div className={`p-5 rounded-2xl border-2 ${s.border} bg-white/70`}>
                  <p style={{ fontSize: "1.2rem", color: "#374151" }}>
                    <span style={{ fontWeight: 700 }}>提示：</span>{result.tips}
                  </p>
                </div>
              )}
              <div className={`p-5 rounded-2xl border-2 ${s.border} bg-white/70`}>
                <p style={{ fontSize: "1.2rem", color: "#374151" }}>
                  <span style={{ fontWeight: 700 }}>投放方法：</span>{catInfo.guide}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bin Guide */}
        <div>
          <p className="text-gray-600 mb-3" style={{ fontSize: "1.1rem", fontWeight: 700 }}>垃圾桶颜色对应：</p>
          <div className="space-y-3">
            {[
              { color: "#3b82f6", label: "蓝色桶", sub: "可回收物（纸板、瓶子等）", emoji: "♻️" },
              { color: "#ef4444", label: "红色桶", sub: "有害垃圾（电池、药品等）", emoji: "⚠️" },
              { color: "#22c55e", label: "绿色桶", sub: "湿垃圾（剩菜剩饭等）", emoji: "🌿" },
              { color: "#6b7280", label: "灰色桶", sub: "干垃圾（纸巾、烟蒂等）", emoji: "🗑️" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-4 bg-white border-2 border-gray-100 rounded-2xl p-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: b.color + "20", border: `3px solid ${b.color}` }}>
                  {b.emoji}
                </div>
                <div>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1f2937" }}>{b.label}</p>
                  <p style={{ fontSize: "1rem", color: "#6b7280" }}>{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function ClassifyPage() {
  const { mode } = useApp();
  if (mode === "children") return <ChildrenClassifyPage />;
  if (mode === "elderly") return <ElderlyClassifyPage />;
  return <StandardClassifyPage />;
}
