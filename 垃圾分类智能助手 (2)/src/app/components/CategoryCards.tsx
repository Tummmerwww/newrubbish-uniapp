import { CATEGORIES, CategoryInfo } from "../data/garbageData";

interface CategoryCardProps {
  cat: CategoryInfo;
  onClick: (cat: CategoryInfo) => void;
  isActive: boolean;
}

function CategoryCard({ cat, onClick, isActive }: CategoryCardProps) {
  const colorMap = {
    recyclable: {
      bg: isActive ? "bg-blue-500" : "bg-white",
      border: "border-blue-200",
      text: isActive ? "text-white" : "text-blue-600",
      sub: isActive ? "text-blue-100" : "text-gray-500",
      tag: isActive ? "bg-blue-400 text-white" : "bg-blue-50 text-blue-600",
      shadow: isActive ? "shadow-blue-200" : "",
    },
    hazardous: {
      bg: isActive ? "bg-red-500" : "bg-white",
      border: "border-red-200",
      text: isActive ? "text-white" : "text-red-600",
      sub: isActive ? "text-red-100" : "text-gray-500",
      tag: isActive ? "bg-red-400 text-white" : "bg-red-50 text-red-600",
      shadow: isActive ? "shadow-red-200" : "",
    },
    wet: {
      bg: isActive ? "bg-green-500" : "bg-white",
      border: "border-green-200",
      text: isActive ? "text-white" : "text-green-600",
      sub: isActive ? "text-green-100" : "text-gray-500",
      tag: isActive ? "bg-green-400 text-white" : "bg-green-50 text-green-600",
      shadow: isActive ? "shadow-green-200" : "",
    },
    dry: {
      bg: isActive ? "bg-gray-500" : "bg-white",
      border: "border-gray-200",
      text: isActive ? "text-white" : "text-gray-600",
      sub: isActive ? "text-gray-200" : "text-gray-500",
      tag: isActive ? "bg-gray-400 text-white" : "bg-gray-50 text-gray-600",
      shadow: isActive ? "shadow-gray-200" : "",
    },
  };

  const c = colorMap[cat.id];

  return (
    <button
      onClick={() => onClick(cat)}
      className={`
        ${c.bg} rounded-2xl border ${c.border} p-5 text-left 
        transition-all duration-200 cursor-pointer
        hover:shadow-md ${isActive ? `shadow-lg ${c.shadow}` : ""}
        flex flex-col gap-3
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{cat.emoji}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full ${c.tag}`}>点击查看</span>
      </div>
      <div>
        <h3 className={`${c.text}`}>{cat.name}</h3>
        <p className={`text-sm mt-1 ${c.sub}`}>{cat.description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {cat.examples.slice(0, 3).map((ex) => (
          <span key={ex} className={`text-xs px-2 py-0.5 rounded-full ${c.tag}`}>
            {ex}
          </span>
        ))}
      </div>
    </button>
  );
}

interface CategoryDetailProps {
  cat: CategoryInfo;
  onClose: () => void;
}

function CategoryDetail({ cat, onClose }: CategoryDetailProps) {
  const colorMap: Record<string, { bg: string; border: string; badge: string; title: string }> = {
    recyclable: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", title: "text-blue-700" },
    hazardous: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", title: "text-red-700" },
    wet: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700", title: "text-green-700" },
    dry: { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-700", title: "text-gray-700" },
  };

  const c = colorMap[cat.id];

  return (
    <div className={`mt-4 rounded-2xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{cat.emoji}</span>
          <h3 className={c.title}>{cat.name} — 常见示例</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm px-3 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer"
        >
          收起
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {cat.examples.map((ex) => (
          <span key={ex} className={`text-sm px-3 py-1 rounded-full ${c.badge}`}>
            {ex}
          </span>
        ))}
      </div>
      <p className="mt-4 text-gray-600 text-sm">
        <span className="font-medium">投放指南：</span>{cat.guide}
      </p>
    </div>
  );
}

interface CategoryCardsProps {
  activeCategory: string | null;
  onCategoryClick: (catId: string | null) => void;
}

export function CategoryCards({ activeCategory, onCategoryClick }: CategoryCardsProps) {
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory) || null;

  const handleClick = (cat: CategoryInfo) => {
    if (activeCategory === cat.id) {
      onCategoryClick(null);
    } else {
      onCategoryClick(cat.id);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-gray-700 mb-4">垃圾分类指南</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            onClick={handleClick}
            isActive={activeCategory === cat.id}
          />
        ))}
      </div>
      {activeCat && (
        <CategoryDetail cat={activeCat} onClose={() => onCategoryClick(null)} />
      )}
    </div>
  );
}
