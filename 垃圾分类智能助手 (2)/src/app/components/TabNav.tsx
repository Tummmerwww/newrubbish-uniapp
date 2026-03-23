import { Camera, MapPin, Search, User, Gamepad2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ActiveTab } from "../types";
import { getText } from "../data/dialectData";

export function TabNav() {
  const { activeTab, setActiveTab, mode, dialect } = useApp();
  const t = getText(dialect);

  const baseTabs: { id: ActiveTab; icon: React.ReactNode; label: string }[] = [
    { id: "classify", icon: <Search size={20} />, label: t.classify },
    { id: "camera",   icon: <Camera size={20} />,  label: t.camera   },
    { id: "map",      icon: <MapPin size={20} />,  label: t.map      },
  ];

  const userTab: { id: ActiveTab; icon: React.ReactNode; label: string } =
    { id: "user", icon: <User size={20} />, label: "我的" };

  const gameTab: { id: ActiveTab; icon: React.ReactNode; label: string } =
    { id: "game", icon: <Gamepad2 size={20} />, label: "游戏" };

  const tabs = mode === "children"
    ? [...baseTabs, gameTab, userTab]
    : [...baseTabs, userTab];

  // ── Children Mode ──────────────────────────────────────────────────────────
  if (mode === "children") {
    const emojis: Record<ActiveTab, string> = {
      classify: "🔍", camera: "📷", map: "🗺️", game: "🎮", user: "👤",
    };
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-yellow-200 shadow-lg">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-all cursor-pointer ${
                  active ? "text-yellow-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                    active ? "bg-yellow-100 scale-110" : "bg-gray-50"
                  }`}
                >
                  {emojis[tab.id]}
                </div>
                <span className="text-xs" style={{ fontWeight: active ? 700 : 400 }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // ── Elderly Mode ───────────────────────────────────────────────────────────
  if (mode === "elderly") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-4 gap-1.5 transition-all cursor-pointer ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-500"
                }`}
              >
                <div className={active ? "text-blue-600" : "text-gray-400"}>{tab.icon}</div>
                <span style={{ fontSize: "0.9rem", fontWeight: active ? 700 : 400 }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // ── Standard / Dialect Mode ────────────────────────────────────────────────
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 shadow-lg">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all cursor-pointer ${
                active ? "text-green-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-green-100" : ""}`}>
                {tab.icon}
              </div>
              <span className="text-xs" style={{ fontWeight: active ? 600 : 400 }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
