import { Dialect } from "../types";

export type { Dialect };

export const DIALECT_INFO: Record<Dialect, { name: string; emoji: string; desc: string }> = {
  mandarin: { name: "普通话", emoji: "🇨🇳", desc: "标准普通话" },
  shanghainese: { name: "沪语", emoji: "🏙️", desc: "上海方言" },
  cantonese: { name: "粤语", emoji: "🏮", desc: "广东话" },
  sichuan: { name: "四川话", emoji: "🌶️", desc: "天府方言" },
  northeast: { name: "东北话", emoji: "❄️", desc: "东北方言" },
};

export interface DialectText {
  searchPlaceholder: string;
  searchBtn: string;
  heroTitle: string;
  heroHighlight: string;
  heroSub: string;
  quickLabel: string;
  recentLabel: string;
  resultPrefix: string;
  notFoundMsg: string;
  notFoundTip: string;
  categoryTitle: string;
  tipLabel: string;
  guideLabel: string;
  classify: string;
  camera: string;
  map: string;
  cameraTitle: string;
  cameraSub: string;
  mapTitle: string;
  mapSub: string;
  categoryLabels: { recyclable: string; hazardous: string; wet: string; dry: string };
  analyzeBtn: string;
  analyzing: string;
  uploadPhoto: string;
  takePhoto: string;
  retake: string;
  aiResult: string;
  nearby: string;
  distance: string;
  open: string;
  closed: string;
  filterAll: string;
  locate: string;
}

export const DIALECT_TEXT: Record<Dialect, DialectText> = {
  mandarin: {
    searchPlaceholder: "输入物品名称，例如：矿泉水瓶、电池...",
    searchBtn: "查询",
    heroTitle: "不知道怎么分类？",
    heroHighlight: "问我就对了！",
    heroSub: "输入任意物品名称，立即获得垃圾分类结果与投放建议",
    quickLabel: "🔥 热门查询",
    recentLabel: "最近查询",
    resultPrefix: "查询结果",
    notFoundMsg: "未找到该物品的分类信息",
    notFoundTip: "请尝试其他关键词，或参考分类指南",
    categoryTitle: "垃圾分类指南",
    tipLabel: "投放提示",
    guideLabel: "投放指南",
    classify: "分类查询",
    camera: "拍照识别",
    map: "附近回收点",
    cameraTitle: "拍照识别垃圾",
    cameraSub: "拍摄或上传图片，AI 智能识别垃圾分类",
    mapTitle: "附近回收点",
    mapSub: "查找你周边的垃圾桶和回收站",
    categoryLabels: { recyclable: "可回收物", hazardous: "有害垃圾", wet: "湿垃圾", dry: "干垃圾" },
    analyzeBtn: "开始识别",
    analyzing: "AI 正在分析中...",
    uploadPhoto: "上传图片",
    takePhoto: "拍照识别",
    retake: "重新拍摄",
    aiResult: "AI 识别结果",
    nearby: "附近回收点",
    distance: "距离",
    open: "营业中",
    closed: "已关闭",
    filterAll: "全部",
    locate: "定位我的位置",
  },
  shanghainese: {
    searchPlaceholder: "侬想查啥垃圾？输入名称看看...",
    searchBtn: "查一查",
    heroTitle: "勿晓得垃圾咋分？",
    heroHighlight: "问我嘛！",
    heroSub: "输入物品名称，马上告诉侬该放哪个桶桶",
    quickLabel: "🔥 大家都在查",
    recentLabel: "最近查过",
    resultPrefix: "查询结果",
    notFoundMsg: "阿拉找不到这个物品的分类信息",
    notFoundTip: "侬换个关键词试试看，或者参考分类指南",
    categoryTitle: "垃圾分类指南",
    tipLabel: "投放提示",
    guideLabel: "投放指南",
    classify: "分类查询",
    camera: "拍照识别",
    map: "附近回收点",
    cameraTitle: "拍张照识别垃圾",
    cameraSub: "拍张照片，侬就晓得怎么分类了",
    mapTitle: "附近回收点",
    mapSub: "找找侬周边的垃圾桶和回收站",
    categoryLabels: { recyclable: "好额垃圾（可回收）", hazardous: "有害垃圾", wet: "湿垃圾（厨余）", dry: "干垃圾（其他）" },
    analyzeBtn: "开始识别",
    analyzing: "AI 正在分析中...",
    uploadPhoto: "上传图片",
    takePhoto: "拍照识别",
    retake: "重新拍",
    aiResult: "AI 识别结果",
    nearby: "附近回收点",
    distance: "距离",
    open: "营业中",
    closed: "已关闭",
    filterAll: "全部",
    locate: "定位我的位置",
  },
  cantonese: {
    searchPlaceholder: "搵乜嘢垃圾？输入名称睇吓...",
    searchBtn: "查吓",
    heroTitle: "唔知点分类？",
    heroHighlight: "问我啦！",
    heroSub: "输入物品名称，即刻话你知点分类",
    quickLabel: "🔥 大家都在查",
    recentLabel: "最近查过",
    resultPrefix: "查询结果",
    notFoundMsg: "搵唔到呢个物品嘅分类信息",
    notFoundTip: "试下换个关键词，或者参考分类指南",
    categoryTitle: "垃圾分类指南",
    tipLabel: "投放提示",
    guideLabel: "投放指南",
    classify: "分类查询",
    camera: "影相识别",
    map: "附近回收点",
    cameraTitle: "影相识别垃圾",
    cameraSub: "影张相，AI即刻识别分类",
    mapTitle: "附近回收点",
    mapSub: "搵下你附近嘅垃圾桶同回收站",
    categoryLabels: { recyclable: "可回收垃圾", hazardous: "有害废物", wet: "厨余垃圾", dry: "其他垃圾" },
    analyzeBtn: "开始识别",
    analyzing: "AI 紧分析紧...",
    uploadPhoto: "上传图片",
    takePhoto: "影相识别",
    retake: "重新影",
    aiResult: "AI 识别结果",
    nearby: "附近回收点",
    distance: "距离",
    open: "营业中",
    closed: "已关闭",
    filterAll: "全部",
    locate: "定位我嘅位置",
  },
  sichuan: {
    searchPlaceholder: "查哈，要扔啥子？输入名称...",
    searchBtn: "查哈",
    heroTitle: "不晓得咋个分类？",
    heroHighlight: "问我嘛！",
    heroSub: "输入物品名称，马上告诉你该放哪个桶桶",
    quickLabel: "🔥 大家都在查",
    recentLabel: "最近查过",
    resultPrefix: "查询结果",
    notFoundMsg: "找不到这个东西的分类信息哦",
    notFoundTip: "换个关键词试哈嘛，或者看分类指南",
    categoryTitle: "垃圾分类指南",
    tipLabel: "投放提示",
    guideLabel: "投放指南",
    classify: "分类查询",
    camera: "拍照识别",
    map: "附近回收点",
    cameraTitle: "拍照识别垃圾",
    cameraSub: "拍张照片，马上晓得咋个分类",
    mapTitle: "附近回收点",
    mapSub: "找找你周边的垃圾桶和回收站",
    categoryLabels: { recyclable: "可以回收的", hazardous: "有危险的", wet: "厨房垃圾", dry: "其他的" },
    analyzeBtn: "开始识别",
    analyzing: "AI 正在分析中...",
    uploadPhoto: "上传图片",
    takePhoto: "拍照识别",
    retake: "重新拍",
    aiResult: "AI 识别结果",
    nearby: "附近回收点",
    distance: "距离",
    open: "营业中",
    closed: "已关闭",
    filterAll: "全部",
    locate: "定位我的位置",
  },
  northeast: {
    searchPlaceholder: "查查，这玩意儿咋扔？输入名称...",
    searchBtn: "查查看",
    heroTitle: "不知道咋分类？",
    heroHighlight: "问我得了！",
    heroSub: "输入物品名称，马上告诉你该扔哪旮旯",
    quickLabel: "🔥 大家都在查",
    recentLabel: "最近查过",
    resultPrefix: "查询结果",
    notFoundMsg: "没找到这玩意儿的分类信息",
    notFoundTip: "换个词试试吧，或者看看分类指南",
    categoryTitle: "垃圾分类指南",
    tipLabel: "投放提示",
    guideLabel: "投放指南",
    classify: "分类查询",
    camera: "拍照识别",
    map: "附近回收点",
    cameraTitle: "拍照识别垃圾",
    cameraSub: "拍张照，整明白这玩意儿咋扔",
    mapTitle: "附近回收点",
    mapSub: "找找你那嘎哒的垃圾桶和回收站",
    categoryLabels: { recyclable: "能回收滴", hazardous: "有害滴", wet: "厨余垃圾", dry: "其他垃圾" },
    analyzeBtn: "开始识别",
    analyzing: "AI 正在分析中...",
    uploadPhoto: "上传图片",
    takePhoto: "拍照识别",
    retake: "重新拍",
    aiResult: "AI 识别结果",
    nearby: "附近回收点",
    distance: "距离",
    open: "营业中",
    closed: "已关闭",
    filterAll: "全部",
    locate: "定位我的位置",
  },
};

export function getText(dialect: Dialect): DialectText {
  return DIALECT_TEXT[dialect];
}
