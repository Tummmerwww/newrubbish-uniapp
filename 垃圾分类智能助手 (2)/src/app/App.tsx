import { Recycle, Leaf } from "lucide-react";
import { AppProvider, useApp } from "./context/AppContext";
import { TabNav } from "./components/TabNav";
import { ModeSelector } from "./components/ModeSelector";
import { ClassifyPage } from "./pages/ClassifyPage";
import { CameraPage } from "./pages/CameraPage";
import { MapPage } from "./pages/MapPage";
import { UserPage } from "./pages/UserPage";
import { GamePage } from "./pages/GamePage";
import { getText } from "./data/dialectData";
import { DIALECT_INFO } from "./data/dialectData";

const MODE_HEADER_STYLES = {
  standard: { bg: "bg-white/90 backdrop-blur", border: "border-gray-100",   logo: "text-green-600",  tag: "bg-green-50 text-green-600 border-green-100"   },
  children: { bg: "bg-white/90 backdrop-blur", border: "border-yellow-100", logo: "text-purple-600", tag: "bg-purple-50 text-purple-600 border-purple-100" },
  elderly:  { bg: "bg-blue-600",               border: "border-blue-600",   logo: "text-white",      tag: "bg-white/20 text-white border-white/20"         },
  dialect:  { bg: "bg-white/90 backdrop-blur", border: "border-purple-100", logo: "text-purple-600", tag: "bg-purple-50 text-purple-600 border-purple-100" },
};

function AppHeader() {
  const { mode, dialect } = useApp();
  const t = getText(dialect);
  const s = MODE_HEADER_STYLES[mode];
  const dialectInfo = DIALECT_INFO[dialect];

  return (
    <header className={`${s.bg} border-b ${s.border} sticky top-0 z-40`}>
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${mode === "elderly" ? "bg-white" : "bg-green-500"}`}>
            <Recycle size={18} className={mode === "elderly" ? "text-blue-600" : "text-white"} />
          </div>
          <div>
            <p className={`leading-none ${s.logo}`} style={{ fontWeight: 700, fontSize: mode === "elderly" ? "1.1rem" : "0.95rem" }}>
              {mode === "children" ? "🎨 垃圾分类小助手" : "垃圾分类智能助手"}
            </p>
            {mode !== "elderly" && (
              <p className="text-gray-400 leading-none mt-0.5" style={{ fontSize: "0.65rem" }}>
                Smart Garbage Classification
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === "dialect" && (
            <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${s.tag}`}>
              {dialectInfo.emoji} {dialectInfo.name}
            </span>
          )}
          {mode === "children" && (
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border bg-yellow-50 text-yellow-700 border-yellow-200">
              🎨 儿童版
            </span>
          )}
          {mode === "elderly" && (
            <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border bg-white/20 text-white border-white/30">
              👴 老年版
            </span>
          )}
          {mode === "standard" && (
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-green-100 bg-green-50 text-green-600">
              <Leaf size={11} />
              保护环境
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  const { activeTab, mode } = useApp();
  return (
    <>
      <AppHeader />
      <main>
        {activeTab === "classify" && <ClassifyPage />}
        {activeTab === "camera"   && <CameraPage />}
        {activeTab === "map"      && <MapPage />}
        {activeTab === "user"     && <UserPage />}
        {activeTab === "game" && mode === "children" && <GamePage />}
      </main>
      <TabNav />
      <ModeSelector />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
