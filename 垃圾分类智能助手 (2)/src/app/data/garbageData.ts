export type GarbageCategory = "recyclable" | "hazardous" | "wet" | "dry";

export interface GarbageItem {
  name: string;
  category: GarbageCategory;
  tips?: string;
  keywords?: string[];
}

export interface CategoryInfo {
  id: GarbageCategory;
  name: string;
  color: string;
  bgColor: string;
  lightBg: string;
  borderColor: string;
  emoji: string;
  description: string;
  guide: string;
  examples: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "recyclable",
    name: "可回收物",
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-300",
    emoji: "♻️",
    description: "适合回收利用的废弃物",
    guide: "投放时需清洁、干燥，纸张需叠放整齐",
    examples: ["纸板", "塑料瓶", "玻璃瓶", "金属罐", "旧衣物"],
  },
  {
    id: "hazardous",
    name: "有害垃圾",
    color: "text-red-600",
    bgColor: "bg-red-500",
    lightBg: "bg-red-50",
    borderColor: "border-red-300",
    emoji: "⚠️",
    description: "对人体或环境有害的废弃物",
    guide: "请投放至红色有害垃圾桶，不可随意丢弃",
    examples: ["废电池", "荧光灯管", "过期药品", "油漆桶", "农药瓶"],
  },
  {
    id: "wet",
    name: "湿垃圾",
    color: "text-green-600",
    bgColor: "bg-green-500",
    lightBg: "bg-green-50",
    borderColor: "border-green-300",
    emoji: "🌿",
    description: "易腐烂的生物质废弃物（厨余垃圾）",
    guide: "投放时沥干水分，去除外包装",
    examples: ["剩饭剩菜", "蔬菜瓜果", "鱼骨", "茶叶渣", "花卉植物"],
  },
  {
    id: "dry",
    name: "干垃圾",
    color: "text-gray-600",
    bgColor: "bg-gray-500",
    lightBg: "bg-gray-50",
    borderColor: "border-gray-300",
    emoji: "🗑️",
    description: "除上述三类之外的其他垃圾",
    guide: "其他垃圾投入灰色桶，含水垃圾需沥干",
    examples: ["卫生纸", "烟蒂", "尿不湿", "陶瓷碎片", "一次性餐具"],
  },
];

export const GARBAGE_DATABASE: GarbageItem[] = [
  // 可回收物
  { name: "报纸", category: "recyclable", tips: "保持干燥，叠放整齐", keywords: ["报纸", "旧报纸"] },
  { name: "纸板箱", category: "recyclable", tips: "折叠后投放，去除胶带", keywords: ["纸板", "纸箱", "快递盒", "快递箱"] },
  { name: "杂志", category: "recyclable", tips: "保持干燥", keywords: ["杂志", "书籍", "书本"] },
  { name: "书籍", category: "recyclable", tips: "保持干燥", keywords: ["书", "课本", "教材"] },
  { name: "塑料瓶", category: "recyclable", tips: "清洗干净，拧紧瓶盖压扁", keywords: ["矿泉水瓶", "饮料瓶", "塑料瓶", "pet瓶"] },
  { name: "塑料袋", category: "recyclable", tips: "清洁干燥的塑料袋可回收", keywords: ["塑料袋", "购物袋"] },
  { name: "玻璃瓶", category: "recyclable", tips: "清洗干净，小心碎片", keywords: ["玻璃瓶", "酒瓶", "玻璃杯"] },
  { name: "金属罐", category: "recyclable", tips: "清洗干净，压扁", keywords: ["易拉罐", "铁罐", "铝罐", "金属罐"] },
  { name: "旧衣物", category: "recyclable", tips: "清洗晾干后投放", keywords: ["旧衣服", "旧衣物", "衣服", "衣物", "衬衫", "裤子", "外套"] },
  { name: "废铁", category: "recyclable", tips: "注意安全，避免划伤", keywords: ["铁", "废铁", "铁片", "铁块"] },
  { name: "铜铝", category: "recyclable", tips: "金属类可回收", keywords: ["铜", "铝", "铜线", "铝箔"] },
  { name: "充电宝", category: "recyclable", tips: "电子类废弃物可回收", keywords: ["充电宝", "移动电源"] },
  { name: "手机", category: "recyclable", tips: "电子设备可回收，建议以旧换新", keywords: ["手机", "旧手机", "废手机"] },
  { name: "电脑", category: "recyclable", tips: "大型电子设备可回收", keywords: ["电脑", "笔记本", "台式机"] },
  { name: "纸杯", category: "recyclable", tips: "清洁后可回收（未涂塑料膜）", keywords: ["纸杯", "一次性杯子"] },
  { name: "牛奶盒", category: "recyclable", tips: "清洗展开压扁投放", keywords: ["牛奶盒", "利乐包", "果汁盒"] },
  { name: "硬纸板", category: "recyclable", tips: "可折叠打包投放", keywords: ["硬纸板", "纸板"] },
  { name: "铁锅", category: "recyclable", tips: "金属炊具可回收", keywords: ["铁锅", "锅", "炒锅"] },
  { name: "自行车", category: "recyclable", tips: "大件可联系回收机构上门", keywords: ["自行车", "单车"] },
  { name: "泡沫塑料", category: "recyclable", tips: "干净的泡沫塑料可回收", keywords: ["泡沫", "泡沫塑料", "eps"] },

  // 有害垃圾
  { name: "废电池", category: "hazardous", tips: "不可混入其他垃圾，避免泄漏", keywords: ["电池", "废电池", "干电池", "蓄电池"] },
  { name: "荧光灯管", category: "hazardous", tips: "含汞，轻拿轻放", keywords: ["荧光灯", "灯管", "日光灯", "节能灯"] },
  { name: "过期药品", category: "hazardous", tips: "连同包装一起投放", keywords: ["药品", "过期药", "药物", "药片", "胶囊"] },
  { name: "农药瓶", category: "hazardous", tips: "不可清洗后当普通垃圾", keywords: ["农药", "农药瓶", "除草剂"] },
  { name: "油漆桶", category: "hazardous", tips: "未干的油漆属于有害垃圾", keywords: ["油漆", "油漆桶", "涂料"] },
  { name: "水银温度计", category: "hazardous", tips: "含汞，严禁破碎", keywords: ["温度计", "水银温度计", "体温计"] },
  { name: "墨盒", category: "hazardous", tips: "打印机墨盒含有害物质", keywords: ["墨盒", "打印机墨水", "硒鼓"] },
  { name: "指甲油", category: "hazardous", tips: "含有化学溶剂，属有害垃圾", keywords: ["指甲油", "洗甲水"] },
  { name: "消毒液", category: "hazardous", tips: "有腐蚀性，需单独投放", keywords: ["消毒液", "漂白水", "84消毒液"] },
  { name: "胶水", category: "hazardous", tips: "含有机溶剂，属有害垃圾", keywords: ["胶水", "强力胶", "万能胶"] },
  { name: "杀虫剂", category: "hazardous", tips: "含有毒化学物质", keywords: ["杀虫剂", "蚊香", "杀蟑螂"] },
  { name: "废显影液", category: "hazardous", tips: "含有化学物质，属有害垃圾", keywords: ["显影液", "定影液"] },

  // 湿垃圾（厨余垃圾）
  { name: "剩饭剩菜", category: "wet", tips: "沥干水分后投放", keywords: ["剩饭", "剩菜", "剩余食物", "食物残渣"] },
  { name: "蔬菜", category: "wet", tips: "去除包装，沥干水分", keywords: ["蔬菜", "青菜", "白菜", "菠菜", "芹菜", "韭菜"] },
  { name: "水果", category: "wet", tips: "去除包装", keywords: ["水果", "苹果", "香蕉", "橙子", "西瓜"] },
  { name: "果皮", category: "wet", tips: "直接投放湿垃圾桶", keywords: ["果皮", "橘子皮", "苹果皮", "香蕉皮", "西瓜皮"] },
  { name: "鱼骨", category: "wet", tips: "可直接投放，不含塑料包装", keywords: ["鱼骨", "鱼刺", "骨头"] },
  { name: "肉类", category: "wet", tips: "生熟均可投放湿垃圾", keywords: ["肉", "猪肉", "牛肉", "鸡肉", "肉骨头"] },
  { name: "蛋壳", category: "wet", tips: "直接投放湿垃圾桶", keywords: ["蛋壳", "鸡蛋壳"] },
  { name: "茶叶渣", category: "wet", tips: "去除茶包，单独投放", keywords: ["茶叶", "茶叶渣", "茶渣"] },
  { name: "咖啡渣", category: "wet", tips: "去除滤纸单独投放", keywords: ["咖啡渣", "咖啡粉"] },
  { name: "花卉植物", category: "wet", tips: "去除根部泥土，去除花盆", keywords: ["花", "植物", "花卉", "枯叶", "落叶"] },
  { name: "豆腐", category: "wet", tips: "可直接投放", keywords: ["豆腐", "豆浆", "豆渣"] },
  { name: "面包", category: "wet", tips: "去除包装后投放", keywords: ["面包", "蛋糕", "饼干"] },
  { name: "奶酪", category: "wet", tips: "去除包装后投放", keywords: ["奶酪", "奶制品"] },
  { name: "虾蟹贝壳", category: "wet", tips: "可直接投放湿垃圾", keywords: ["虾壳", "蟹壳", "贝壳", "螺蛳", "扇贝"] },
  { name: "瓜子壳", category: "wet", tips: "直接投放湿垃圾", keywords: ["瓜子", "瓜子壳", "花生", "花生壳"] },
  { name: "榴莲壳", category: "wet", tips: "较大，需分割后投放", keywords: ["榴莲", "榴莲壳"] },
  { name: "淀粉", category: "wet", tips: "可直接投放", keywords: ["淀粉", "面粉"] },

  // 干垃圾
  { name: "卫生纸", category: "dry", tips: "使用后的纸巾不可回收", keywords: ["卫生纸", "纸巾", "面巾纸", "湿巾"] },
  { name: "烟蒂", category: "dry", tips: "熄灭后再丢弃", keywords: ["烟蒂", "烟头", "香烟"] },
  { name: "尿不湿", category: "dry", tips: "折叠后投放", keywords: ["尿不湿", "纸尿裤", "卫生巾"] },
  { name: "陶瓷碎片", category: "dry", tips: "用纸包裹避免划伤", keywords: ["陶瓷", "瓷器", "碗", "盘子", "碎片"] },
  { name: "一次性餐具", category: "dry", tips: "含油污的一次性餐具为干垃圾", keywords: ["一次性餐具", "筷子", "勺子", "叉子"] },
  { name: "快餐盒", category: "dry", tips: "有油污的餐盒为干垃圾", keywords: ["快餐盒", "饭盒", "打包盒", "外卖盒"] },
  { name: "旧玩具", category: "dry", tips: "不含电池的玩具为干垃圾", keywords: ["玩具", "旧玩具", "积木"] },
  { name: "皮革制品", category: "dry", tips: "旧皮包、皮带等为干垃圾", keywords: ["皮革", "皮带", "皮包", "皮鞋"] },
  { name: "橡胶制品", category: "dry", tips: "如破损的拖鞋等", keywords: ["橡胶", "拖鞋", "胶鞋"] },
  { name: "大骨头", category: "dry", tips: "质地坚硬，不易腐烂，归干垃圾", keywords: ["大骨头", "猪骨", "牛骨", "羊骨"] },
  { name: "贝壳（装饰）", category: "dry", tips: "非食物类贝壳为干垃圾", keywords: ["贝壳", "海螺壳"] },
  { name: "毛发", category: "dry", tips: "头发、宠物毛发等", keywords: ["头发", "毛发", "宠物毛"] },
  { name: "胶带", category: "dry", tips: "胶带为干垃圾", keywords: ["胶带", "透明胶", "双面胶"] },
  { name: "餐巾纸", category: "dry", tips: "使用过的餐巾纸为干垃圾", keywords: ["餐巾纸", "纸巾"] },
  { name: "笔", category: "dry", tips: "圆珠笔、铅笔等为干垃圾", keywords: ["笔", "圆珠笔", "铅笔", "钢笔"] },
  { name: "打火机", category: "dry", tips: "无气体残留的打火机为干垃圾", keywords: ["打火机"] },
  { name: "海绵", category: "dry", tips: "洗碗海绵等为干垃圾", keywords: ["海绵", "洗碗布", "钢丝球"] },
  { name: "牙刷", category: "dry", tips: "普通牙刷为干垃圾", keywords: ["牙刷", "电动牙刷"] },
  { name: "创可贴", category: "dry", tips: "医疗废弃物中常见干垃圾", keywords: ["创可贴", "绷带", "棉签"] },
];

export function searchGarbage(query: string): GarbageItem[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  return GARBAGE_DATABASE.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      (item.keywords || []).some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()))
  ).slice(0, 6);
}

export function getCategoryInfo(category: GarbageCategory): CategoryInfo {
  return CATEGORIES.find((c) => c.id === category)!;
}
