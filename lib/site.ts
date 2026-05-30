// 全站文案与品牌信息的唯一来源——改这里，全站跟着变。

export const site = {
  // TODO: 替换为你想公开的名字（中文/英文/handle 都可以）。
  // 在 Hero、Nav、Footer、metadata 都会用到。
  name: "Niney",

  email: "corianopartha@gmail.com",

  role: "AI × 医疗产品负责人",
  experience: "2 年",

  // 全站第一句话（Hero 巨字）
  philosophy: {
    line1: "能用，好用，才轮到惊喜——",
    line2: "顺序错了，再美的设计也得砍。",
  },

  // 副位金句（拉自文章 #3）
  heroSubQuote: {
    text: "数据救不了方向。",
    source: "—— 我在 AI 产品上踩了三连坑后想明白的事",
  },

  // About 两条信条
  credo: [
    "我做产品，先立脊柱，再长血肉。",
    "我相信医疗 AI 的边界，由责任划，不由能力划。",
  ],

  // 终点
  contact: {
    headline: "我在找：",
    body: "AI×医疗的下一段 0→1，\n一个能让我对取舍负责的位置。",
    emailSubject: "AI×医疗 PM 机会",
  },
} as const;
