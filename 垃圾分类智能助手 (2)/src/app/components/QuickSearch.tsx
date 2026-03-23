import { GarbageItem, GARBAGE_DATABASE, getCategoryInfo } from "../data/garbageData";

interface QuickSearchProps {
  onSelect: (item: GarbageItem) => void;
  recentSearches: GarbageItem[];
}

const HOT_ITEMS = [
  "矿泉水瓶", "废电池", "剩饭", "卫生纸", "纸板箱", "荧光灯管",
  "香蕉皮", "快餐盒", "旧衣服", "过期药品",
];

const categoryColors: Record<string, string> = {
  recyclable: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
  hazardous: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100",
  wet: "bg-green-50 text-green-600 border-green-100 hover:bg-green-100",
  dry: "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100",
};

export function QuickSearch({ onSelect, recentSearches }: QuickSearchProps) {
  const handleHotClick = (name: string) => {
    const item = GARBAGE_DATABASE.find(
      (i) => i.name === name || (i.keywords || []).includes(name)
    );
    if (item) onSelect(item);
  };

  return (
    <div className="space-y-5 mt-6">
      {/* Recent */}
      {recentSearches.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-2">最近查询</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item, i) => {
              const cat = getCategoryInfo(item.category);
              return (
                <button
                  key={i}
                  onClick={() => onSelect(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${categoryColors[item.category]}`}
                >
                  <span>{cat.emoji}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hot items */}
      <div>
        <p className="text-sm text-gray-400 mb-2">🔥 热门查询</p>
        <div className="flex flex-wrap gap-2">
          {HOT_ITEMS.map((name) => {
            const item = GARBAGE_DATABASE.find(
              (i) => i.name === name || (i.keywords || []).includes(name)
            );
            const cat = item ? getCategoryInfo(item.category) : null;
            return (
              <button
                key={name}
                onClick={() => handleHotClick(name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer ${
                  cat ? categoryColors[cat.id] : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
                }`}
              >
                {cat && <span>{cat.emoji}</span>}
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
