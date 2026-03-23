import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { searchGarbage, GarbageItem, getCategoryInfo } from "../data/garbageData";

interface SearchBarProps {
  onSelect: (item: GarbageItem) => void;
  onSearch: (query: string) => void;
}

export function SearchBar({ onSelect, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GarbageItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      const results = searchGarbage(val);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSelect = (item: GarbageItem) => {
    setQuery(item.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(item);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const categoryColors: Record<string, string> = {
    recyclable: "bg-blue-100 text-blue-700",
    hazardous: "bg-red-100 text-red-700",
    wet: "bg-green-100 text-green-700",
    dry: "bg-gray-100 text-gray-700",
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all focus-within:shadow-xl focus-within:border-green-300">
          <div className="pl-5 pr-3 text-gray-400">
            <Search size={22} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            placeholder="输入物品名称，例如：矿泉水瓶、电池..."
            className="flex-1 py-4 pr-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="submit"
            className="m-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors cursor-pointer"
          >
            查询
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {suggestions.map((item, i) => {
            const cat = getCategoryInfo(item.category);
            return (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="flex-1 text-gray-800">{item.name}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${categoryColors[item.category]}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
