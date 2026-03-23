import { GarbageItem, getCategoryInfo } from "../data/garbageData";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

interface ResultCardProps {
  item: GarbageItem;
  notFound?: boolean;
  query?: string;
}

const categoryStyles = {
  recyclable: {
    gradient: "from-blue-500 to-blue-600",
    light: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    icon: "text-blue-500",
    ring: "ring-blue-200",
  },
  hazardous: {
    gradient: "from-red-500 to-red-600",
    light: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    icon: "text-red-500",
    ring: "ring-red-200",
  },
  wet: {
    gradient: "from-green-500 to-green-600",
    light: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    icon: "text-green-500",
    ring: "ring-green-200",
  },
  dry: {
    gradient: "from-gray-500 to-gray-600",
    light: "bg-gray-50",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-700",
    icon: "text-gray-500",
    ring: "ring-gray-200",
  },
};

export function ResultCard({ item, notFound, query }: ResultCardProps) {
  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
        <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={22} />
        <div>
          <p className="text-amber-800">
            未找到「<span className="font-medium">{query}</span>」的分类信息
          </p>
          <p className="text-amber-600 text-sm mt-1">
            请尝试其他关键词，或参考下方分类指南进行判断。
          </p>
        </div>
      </div>
    );
  }

  const cat = getCategoryInfo(item.category);
  const styles = categoryStyles[item.category];

  return (
    <div className={`max-w-2xl mx-auto mt-8 rounded-2xl overflow-hidden border ${styles.border} shadow-lg ring-4 ${styles.ring}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${styles.gradient} p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="text-5xl">{cat.emoji}</div>
          <div>
            <p className="text-white/80 text-sm mb-1">查询结果</p>
            <h2 className="text-white">{item.name}</h2>
            <p className="text-white/90 mt-1">属于 · {cat.name}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`${styles.light} p-6 space-y-4`}>
        {/* Description */}
        <div className="flex items-start gap-3">
          <Info size={18} className={`${styles.icon} shrink-0 mt-0.5`} />
          <div>
            <p className="text-gray-500 text-sm">分类说明</p>
            <p className="text-gray-800">{cat.description}</p>
          </div>
        </div>

        {/* Tips */}
        {item.tips && (
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className={`${styles.icon} shrink-0 mt-0.5`} />
            <div>
              <p className="text-gray-500 text-sm">投放提示</p>
              <p className="text-gray-800">{item.tips}</p>
            </div>
          </div>
        )}

        {/* Guide */}
        <div className={`rounded-xl p-4 border ${styles.border} bg-white/60`}>
          <p className="text-gray-500 text-sm mb-1">📌 投放指南</p>
          <p className="text-gray-700">{cat.guide}</p>
        </div>
      </div>
    </div>
  );
}
