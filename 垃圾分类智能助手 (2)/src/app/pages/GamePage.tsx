import { useState, useEffect } from "react";
import { Trophy, RefreshCw, Home } from "lucide-react";
import { useApp } from "../context/AppContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Category = "recyclable" | "hazardous" | "wet" | "dry";

const GAME_ITEMS: { name: string; emoji: string; category: Category }[] = [
  { name: "矿泉水瓶", emoji: "🍶", category: "recyclable" },
  { name: "废电池",   emoji: "🔋", category: "hazardous"  },
  { name: "香蕉皮",   emoji: "🍌", category: "wet"        },
  { name: "卫生纸",   emoji: "🧻", category: "dry"        },
  { name: "纸板箱",   emoji: "📦", category: "recyclable" },
  { name: "荧光灯管", emoji: "💡", category: "hazardous"  },
  { name: "剩饭剩菜", emoji: "🍱", category: "wet"        },
  { name: "快餐盒",   emoji: "🥡", category: "dry"        },
  { name: "玻璃瓶",   emoji: "🍾", category: "recyclable" },
  { name: "过期药品", emoji: "💊", category: "hazardous"  },
  { name: "蔬菜",     emoji: "🥦", category: "wet"        },
  { name: "烟蒂",     emoji: "🚬", category: "dry"        },
  { name: "旧衣服",   emoji: "👕", category: "recyclable" },
  { name: "油漆桶",   emoji: "🪣", category: "hazardous"  },
  { name: "水果皮",   emoji: "🍊", category: "wet"        },
  { name: "陶瓷碎片", emoji: "🏺", category: "dry"        },
  { name: "金属罐",   emoji: "🥫", category: "recyclable" },
  { name: "指甲油",   emoji: "💅", category: "hazardous"  },
  { name: "茶叶渣",   emoji: "🍵", category: "wet"        },
  { name: "牙刷",     emoji: "🪥", category: "dry"        },
  { name: "报纸",     emoji: "📰", category: "recyclable" },
  { name: "水银温度计",emoji: "🌡️", category: "hazardous" },
  { name: "蛋壳",     emoji: "🥚", category: "wet"        },
  { name: "一次性筷子",emoji: "🥢", category: "dry"       },
];

const BINS: { category: Category; label: string; emoji: string; color: string; light: string; border: string }[] = [
  { category: "recyclable", label: "可回收物", emoji: "♻️", color: "#3b82f6", light: "#eff6ff", border: "#bfdbfe" },
  { category: "hazardous",  label: "有害垃圾", emoji: "⚠️", color: "#ef4444", light: "#fef2f2", border: "#fecaca" },
  { category: "wet",        label: "湿垃圾",   emoji: "🌿", color: "#22c55e", light: "#f0fdf4", border: "#bbf7d0" },
  { category: "dry",        label: "干垃圾",   emoji: "🗑️", color: "#6b7280", light: "#f9fafb", border: "#e5e7eb" },
];

const TOTAL = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getStars(score: number) {
  if (score >= 9) return 3;
  if (score >= 6) return 2;
  if (score >= 4) return 1;
  return 0;
}

// ─── Idle Screen ──────────────────────────────────────────────────────────────

function IdleScreen({ onStart, bestScore }: { onStart: () => void; bestScore: number }) {
  return (
    <div className="min-h-screen pb-28 px-4 pt-6" style={{ background: "linear-gradient(160deg,#fef9c3 0%,#fce7f3 40%,#dbeafe 100%)" }}>
      <div className="max-w-sm mx-auto space-y-5 text-center">
        <div>
          <div style={{ fontSize: "7rem", lineHeight: 1, filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.15))" }}>🎮</div>
          <h1 style={{ fontSize: "2rem", color: "#7c3aed", marginTop: 12 }}>垃圾分类大挑战</h1>
          <p style={{ color: "#6b7280", marginTop: 6 }}>10 道题，挑战你的分类能力！</p>
        </div>

        {bestScore > 0 && (
          <div className="bg-white/80 rounded-3xl border-2 border-yellow-200 p-4 flex items-center justify-center gap-3">
            <Trophy size={24} className="text-yellow-500" />
            <div>
              <p style={{ fontSize: "0.8rem", color: "#92400e" }}>历史最高纪录</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#b45309", lineHeight: 1 }}>{bestScore} / {TOTAL}</p>
            </div>
          </div>
        )}

        <div className="bg-white/70 rounded-3xl border-2 border-purple-100 p-5 text-left space-y-2">
          <p style={{ fontWeight: 700, color: "#374151", marginBottom: 8, fontSize: "0.95rem" }}>📖 游戏规则</p>
          {[
            "看到物品，选它属于哪类垃圾桶",
            "共 10 道题，每题 1 秒后自动下一题",
            "答对 → 得 10 积分 💰",
            "9-10 题全对 → ⭐⭐⭐",
          ].map((rule, i) => (
            <p key={i} style={{ color: "#6b7280", fontSize: "0.875rem" }}>• {rule}</p>
          ))}
        </div>

        {/* Bin Reference */}
        <div className="grid grid-cols-4 gap-2">
          {BINS.map((bin) => (
            <div
              key={bin.category}
              className="rounded-2xl p-3 text-center border-2"
              style={{ backgroundColor: bin.light, borderColor: bin.border }}
            >
              <div style={{ fontSize: "1.4rem" }}>{bin.emoji}</div>
              <p style={{ fontSize: "0.6rem", color: "#374151", marginTop: 4, fontWeight: 600 }}>{bin.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full py-5 rounded-3xl cursor-pointer hover:opacity-90 transition-all shadow-xl"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            color: "white",
            fontSize: "1.4rem",
            fontWeight: 700,
          }}
        >
          🚀 开始挑战！
        </button>
      </div>
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({
  score,
  onRestart,
  onHome,
}: {
  score: number;
  onRestart: () => void;
  onHome: () => void;
}) {
  const stars = getStars(score);
  const msgs = ["再试一次，你一定能更好！🌱", "不错哦，继续加油！💪", "答得很棒！🎊", "太厉害了！垃圾分类小达人！🏆"];
  const msgIndex = score < 4 ? 0 : score < 6 ? 1 : score < 9 ? 2 : 3;

  return (
    <div className="min-h-screen pb-28 px-4 pt-6" style={{ background: "linear-gradient(160deg,#fef9c3 0%,#fce7f3 40%,#dbeafe 100%)" }}>
      <div className="max-w-sm mx-auto space-y-5 text-center">
        <div style={{ fontSize: "5rem", lineHeight: 1 }}>
          {score >= 9 ? "🎉" : score >= 6 ? "😊" : score >= 4 ? "😅" : "😢"}
        </div>
        <h1 style={{ fontSize: "1.8rem", color: "#7c3aed" }}>挑战结束！</h1>

        <div className="bg-white rounded-3xl border-4 border-purple-200 p-7 shadow-lg">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                style={{
                  fontSize: "2.8rem",
                  opacity: i <= stars ? 1 : 0.2,
                  filter: i <= stars ? "drop-shadow(0 2px 4px rgba(234,179,8,0.5))" : "none",
                  transition: `opacity 0.3s ${i * 0.15}s`,
                }}
              >
                ⭐
              </span>
            ))}
          </div>

          <p style={{ fontSize: "4rem", fontWeight: 700, color: "#7c3aed", lineHeight: 1 }}>{score}</p>
          <p style={{ color: "#6b7280", fontSize: "1rem", marginTop: 4 }}>/ {TOTAL} 题答对</p>

          <div
            className="mt-4 inline-block px-5 py-2.5 rounded-2xl"
            style={{ background: "linear-gradient(135deg,#fef08a,#fde68a)", border: "2px solid #fcd34d" }}
          >
            <p style={{ color: "#92400e", fontWeight: 700 }}>🎁 +{score * 10} 积分入账！</p>
          </div>
        </div>

        <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>{msgs[msgIndex]}</p>

        <div className="flex gap-3">
          <button
            onClick={onHome}
            className="flex-1 py-4 rounded-2xl border-2 border-purple-200 bg-white text-purple-600 flex items-center justify-center gap-2 cursor-pointer hover:bg-purple-50 transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Home size={16} /> 返回
          </button>
          <button
            onClick={onRestart}
            className="flex-2 flex-1 py-4 rounded-2xl text-white flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", fontWeight: 700, fontSize: "1rem" }}
          >
            <RefreshCw size={16} /> 再来一次！
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Play Screen ──────────────────────────────────────────────────────────────

function PlayScreen({
  question,
  index,
  score,
  onAnswer,
}: {
  question: (typeof GAME_ITEMS)[0];
  index: number;
  score: number;
  onAnswer: (cat: Category) => void;
}) {
  const [selected, setSelected] = useState<Category | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // Reset on new question
  useEffect(() => {
    setSelected(null);
    setFeedback(null);
  }, [index]);

  const correctBin = BINS.find((b) => b.category === question.category)!;

  const handlePick = (cat: Category) => {
    if (feedback) return;
    const correct = cat === question.category;
    setSelected(cat);
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      onAnswer(cat);
    }, 900);
  };

  const pct = (index / TOTAL) * 100;

  return (
    <div className="min-h-screen pb-28 px-4 pt-4" style={{ background: "linear-gradient(160deg,#fef9c3 0%,#fce7f3 40%,#dbeafe 100%)" }}>
      <div className="max-w-sm mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span style={{ color: "#7c3aed", fontWeight: 700 }}>第 {index + 1} / {TOTAL} 题</span>
          <div className="flex items-center gap-1.5">
            <Trophy size={15} className="text-yellow-500" />
            <span style={{ fontWeight: 700, color: "#374151" }}>{score * 10} 分</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#a78bfa,#f472b6)" }}
          />
        </div>

        {/* Item card */}
        <div
          className="bg-white rounded-3xl p-8 text-center shadow-lg border-4 transition-all duration-300"
          style={{
            borderColor: feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : "#e9d5ff",
          }}
        >
          <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: 8 }}>这个垃圾应该扔哪里？</p>
          <div
            style={{
              fontSize: "5.5rem",
              lineHeight: 1,
              marginBottom: 16,
              transition: "transform 0.15s",
              transform: feedback === "correct" ? "scale(1.15)" : "scale(1)",
            }}
          >
            {question.emoji}
          </div>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>{question.name}</p>

          {feedback && (
            <div
              className="mt-4 px-4 py-2.5 rounded-2xl inline-block"
              style={{
                backgroundColor: feedback === "correct" ? "#f0fdf4" : "#fef2f2",
                border: `2px solid ${feedback === "correct" ? "#bbf7d0" : "#fecaca"}`,
              }}
            >
              <p style={{ fontWeight: 700, color: feedback === "correct" ? "#15803d" : "#dc2626", fontSize: "1rem" }}>
                {feedback === "correct"
                  ? "🎉 答对了！+10分"
                  : `❌ 正确答案：${correctBin.emoji} ${correctBin.label}`}
              </p>
            </div>
          )}
        </div>

        {/* Bin buttons */}
        <div className="grid grid-cols-2 gap-3">
          {BINS.map((bin) => {
            const isSelected = selected === bin.category;
            const isCorrect = bin.category === question.category;
            let borderColor = bin.border;
            let bgColor = bin.light;

            if (feedback) {
              if (isCorrect) { borderColor = "#22c55e"; bgColor = "#dcfce7"; }
              else if (isSelected) { borderColor = "#ef4444"; bgColor = "#fee2e2"; }
            }

            return (
              <button
                key={bin.category}
                onClick={() => handlePick(bin.category)}
                disabled={!!feedback}
                className="rounded-3xl border-4 p-5 text-center cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:cursor-default disabled:hover:scale-100"
                style={{
                  backgroundColor: bgColor,
                  borderColor,
                }}
              >
                <div style={{ fontSize: "2.8rem" }}>{bin.emoji}</div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "#374151", marginTop: 6 }}>{bin.label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Game Page ───────────────────────────────────────────────────────────

type GameState = "idle" | "playing" | "result";

export function GamePage() {
  const { addPoints, setActiveTab } = useApp();

  const [state, setState] = useState<GameState>("idle");
  const [questions, setQuestions] = useState<typeof GAME_ITEMS>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() =>
    parseInt(localStorage.getItem("gc_game_best") || "0", 10)
  );

  const startGame = () => {
    setQuestions(shuffle(GAME_ITEMS).slice(0, TOTAL));
    setIndex(0);
    setScore(0);
    setState("playing");
  };

  const handleAnswer = (cat: Category) => {
    const correct = cat === questions[index].category;
    const newScore = correct ? score + 1 : score;

    if (index + 1 >= TOTAL) {
      // Game over
      setState("result");
      addPoints(newScore * 10);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("gc_game_best", String(newScore));
      }
      if (correct) setScore(newScore);
    } else {
      if (correct) setScore(newScore);
      setIndex((i) => i + 1);
    }
  };

  if (state === "idle") return <IdleScreen onStart={startGame} bestScore={bestScore} />;
  if (state === "result") return (
    <ResultScreen
      score={score}
      onRestart={startGame}
      onHome={() => setState("idle")}
    />
  );

  return (
    <PlayScreen
      question={questions[index]}
      index={index}
      score={score}
      onAnswer={handleAnswer}
    />
  );
}
