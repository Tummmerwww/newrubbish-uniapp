import { useState, useRef } from "react";
import { Camera, Upload, RefreshCw, Sparkles, CheckCircle, AlertCircle, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getText } from "../data/dialectData";
import { GARBAGE_DATABASE, GarbageItem, getCategoryInfo } from "../data/garbageData";

// Simulated AI analysis results pool
const MOCK_RESULTS: Array<{ name: string; confidence: number }[]> = [
  [{ name: "塑料瓶", confidence: 94 }, { name: "矿泉水瓶", confidence: 89 }, { name: "饮料瓶", confidence: 72 }],
  [{ name: "废电池", confidence: 97 }, { name: "干电池", confidence: 88 }],
  [{ name: "纸板箱", confidence: 92 }, { name: "快递盒", confidence: 85 }, { name: "硬纸板", confidence: 76 }],
  [{ name: "香蕉皮", confidence: 95 }, { name: "果皮", confidence: 90 }],
  [{ name: "卫生纸", confidence: 91 }, { name: "纸巾", confidence: 80 }],
  [{ name: "荧光灯管", confidence: 93 }, { name: "灯管", confidence: 78 }],
  [{ name: "旧衣服", confidence: 89 }, { name: "旧衣物", confidence: 84 }],
  [{ name: "剩饭剩菜", confidence: 96 }, { name: "食物残渣", confidence: 88 }],
];

const CAT_STYLES = {
  recyclable: { gradient: "from-blue-500 to-blue-600", light: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  hazardous:  { gradient: "from-red-500 to-red-600",  light: "bg-red-50",  border: "border-red-200",  badge: "bg-red-100 text-red-700" },
  wet:        { gradient: "from-green-500 to-green-600", light: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700" },
  dry:        { gradient: "from-gray-500 to-gray-600", light: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-700" },
};

type AnalysisState = "idle" | "analyzing" | "done";

interface AnalysisCandidate {
  item: GarbageItem;
  confidence: number;
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%`, transition: "width 0.8s ease" }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>
    </div>
  );
}

export function CameraPage() {
  const { mode, dialect, addPoints, addRecentQuery } = useApp();
  const t = getText(dialect);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>("idle");
  const [candidates, setCandidates] = useState<AnalysisCandidate[]>([]);
  const [primaryResult, setPrimaryResult] = useState<GarbageItem | null>(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setState("idle");
    setCandidates([]);
    setPrimaryResult(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const runAnalysis = () => {
    if (!imageUrl) return;
    setState("analyzing");
    setProgress(0);
    setCandidates([]);
    setPrimaryResult(null);

    // Simulate progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        // Pick random mock result set
        const mockSet = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
        const resolved: AnalysisCandidate[] = mockSet
          .map((r) => {
            const found = GARBAGE_DATABASE.find(
              (i) => i.name === r.name || (i.keywords || []).includes(r.name)
            );
            return found ? { item: found, confidence: r.confidence } : null;
          })
          .filter(Boolean) as AnalysisCandidate[];

        setTimeout(() => {
          setState("done");
          setCandidates(resolved);
          setPrimaryResult(resolved[0]?.item ?? null);
          if (resolved[0]) {
            addPoints(10);
            addRecentQuery({ name: resolved[0].item.name, category: resolved[0].item.category, timestamp: Date.now() });
          }
        }, 300);
      }
      setProgress(Math.min(p, 100));
    }, 200);
  };

  const reset = () => {
    setImageUrl(null);
    setState("idle");
    setCandidates([]);
    setPrimaryResult(null);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const catInfo = primaryResult ? getCategoryInfo(primaryResult.category) : null;
  const s = primaryResult ? CAT_STYLES[primaryResult.category] : null;

  const isElderly = mode === "elderly";
  const isChildren = mode === "children";

  return (
    <div
      className={`min-h-screen pb-28 ${
        isChildren
          ? "px-4 pt-4"
          : isElderly
          ? "px-4 pt-5 bg-white"
          : "px-4 pt-5 bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50"
      }`}
      style={isChildren ? { background: "linear-gradient(160deg,#fef9c3 0%,#fce7f3 40%,#dbeafe 100%)" } : {}}
    >
      <div className={`max-w-lg mx-auto space-y-5`}>
        {/* Header */}
        {isElderly ? (
          <div className="bg-green-600 text-white rounded-3xl p-5 text-center">
            <p style={{ fontSize: "2rem", fontWeight: 700 }}>{t.cameraTitle}</p>
            <p style={{ fontSize: "1.1rem", opacity: 0.85, marginTop: 4 }}>{t.cameraSub}</p>
          </div>
        ) : isChildren ? (
          <div className="text-center mb-2">
            <div className="text-6xl mb-2">📸</div>
            <h1 style={{ fontSize: "1.6rem", color: "#7c3aed" }}>{t.cameraTitle}</h1>
            <p style={{ color: "#6b7280" }}>{t.cameraSub}</p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-gray-800 mb-1" style={{ fontSize: "1.4rem", fontWeight: 700 }}>{t.cameraTitle}</h1>
            <p className="text-gray-400 text-sm">{t.cameraSub}</p>
          </div>
        )}

        {/* Upload Area */}
        {!imageUrl ? (
          <div
            className={`relative border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
              ${isElderly ? "border-green-300 bg-green-50 py-12" : isChildren ? "border-purple-300 bg-white/70 py-10" : "border-green-300 bg-white/70 py-12 hover:border-green-400 hover:bg-white/90"}`}
            onClick={() => fileRef.current?.click()}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center
                ${isElderly ? "bg-green-100" : isChildren ? "bg-purple-100" : "bg-green-100"}`}
            >
              <Camera size={isElderly ? 44 : 36} className={isElderly ? "text-green-600" : isChildren ? "text-purple-500" : "text-green-500"} />
            </div>
            <div className="text-center px-4">
              <p
                className={isElderly ? "text-green-700" : isChildren ? "text-purple-700" : "text-gray-700"}
                style={{ fontWeight: 700, fontSize: isElderly ? "1.4rem" : "1rem" }}
              >
                {t.uploadPhoto}
              </p>
              <p className="text-gray-400 text-sm mt-1" style={{ fontSize: isElderly ? "1rem" : "0.8rem" }}>
                点击选择图片 / 拍摄照片
              </p>
            </div>
            <div className="flex gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                ${isElderly ? "bg-green-600 text-white" : isChildren ? "bg-purple-500 text-white" : "bg-green-500 text-white"}`}
                style={{ fontSize: isElderly ? "1.1rem" : "0.875rem" }}
              >
                <Upload size={isElderly ? 20 : 14} />
                上传图片
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                ${isElderly ? "bg-blue-600 text-white" : isChildren ? "bg-blue-500 text-white" : "bg-blue-500 text-white"}`}
                style={{ fontSize: isElderly ? "1.1rem" : "0.875rem" }}
              >
                <Camera size={isElderly ? 20 : 14} />
                拍照
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        ) : (
          /* Preview */
          <div className="relative rounded-3xl overflow-hidden shadow-lg bg-black">
            <img src={imageUrl} alt="preview" className="w-full object-cover max-h-64" />
            <button
              onClick={reset}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 cursor-pointer"
            >
              <X size={16} />
            </button>
            {state === "done" && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-400" /> AI 识别完成
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analyze Button */}
        {imageUrl && state !== "done" && (
          <button
            onClick={runAnalysis}
            disabled={state === "analyzing"}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all
              ${isElderly
                ? "bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
                : isChildren
                ? "bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-60"
                : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white disabled:opacity-60"
              }`}
            style={{ fontSize: isElderly ? "1.3rem" : "1rem", fontWeight: 700 }}
          >
            {state === "analyzing" ? (
              <>
                <RefreshCw size={isElderly ? 24 : 18} className="animate-spin" />
                {t.analyzing}
              </>
            ) : (
              <>
                <Sparkles size={isElderly ? 24 : 18} />
                {t.analyzeBtn}
              </>
            )}
          </button>
        )}

        {/* Progress */}
        {state === "analyzing" && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>AI 图像分析中...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-2 text-xs text-gray-400">
              {["图像预处理", "特征提取", "分类匹配"].map((step, i) => (
                <span key={step} className={`flex items-center gap-1 ${progress > i * 33 ? "text-green-500" : ""}`}>
                  {progress > i * 33 ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {state === "done" && primaryResult && catInfo && s && (
          <>
            {/* Primary */}
            <div className={`rounded-3xl overflow-hidden border-2 ${s.border} shadow-lg`}>
              <div className={`bg-gradient-to-r ${s.gradient} p-5 text-white`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{catInfo.emoji}</span>
                  <div>
                    <p className="text-white/70 text-xs">{t.aiResult}</p>
                    <h2 className="text-white" style={{ fontSize: isElderly ? "2rem" : "1.5rem" }}>{primaryResult.name}</h2>
                    <p className="text-white/90 text-sm mt-0.5">属于 · {catInfo.name}</p>
                  </div>
                </div>
                <ConfidenceBar value={candidates[0]?.confidence ?? 90} color="bg-white/80" />
              </div>
              <div className={`${s.light} p-5 space-y-3`}>
                {primaryResult.tips && (
                  <div className={`p-4 rounded-2xl border ${s.border} bg-white/60`}>
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">💡 投放提示：</span>{primaryResult.tips}
                    </p>
                  </div>
                )}
                <div className={`p-4 rounded-2xl border ${s.border} bg-white/60`}>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">📌 投放指南：</span>{catInfo.guide}
                  </p>
                </div>
              </div>
            </div>

            {/* Other candidates */}
            {candidates.length > 1 && (
              <div className="bg-white/80 rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
                  <Sparkles size={12} /> AI 其他可能匹配
                </p>
                <div className="space-y-3">
                  {candidates.slice(1).map((c, i) => {
                    const ci = getCategoryInfo(c.item.category);
                    const cs = CAT_STYLES[c.item.category];
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xl">{ci.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-700">{c.item.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${cs.badge}`}>{ci.name}</span>
                          </div>
                          <ConfidenceBar value={c.confidence} color={`bg-gradient-to-r ${cs.gradient}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Retake button */}
            <button
              onClick={reset}
              className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
              style={{ fontSize: isElderly ? "1.2rem" : "0.9rem" }}
            >
              <RefreshCw size={16} />
              {t.retake}
            </button>
          </>
        )}

        {/* Tips section (idle) */}
        {state === "idle" && !imageUrl && (
          <div className={`rounded-2xl p-4 space-y-3 ${isChildren ? "bg-white/70 border-2 border-purple-100" : "bg-white/60 border border-gray-100"}`}>
            <p className="text-gray-600 text-sm font-semibold">📷 拍照小技巧</p>
            <div className="space-y-2 text-xs text-gray-500">
              {[
                "确保物品在镜头中央，光线充足",
                "单次识别一件物品效果更佳",
                "图片清晰度越高，识别越准确",
                "支持 JPG、PNG、WEBP 等格式",
              ].map((tip, i) => (
                <p key={i} className="flex items-start gap-2">
                  <CheckCircle size={12} className="text-green-400 mt-0.5 shrink-0" />
                  {tip}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}