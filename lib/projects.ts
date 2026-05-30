// 两个项目的结构化数据——直接写 TS（不走 MDX），因为内容是 KEPT/CUT/REASONING/quote
// 这种"结构 > 长文"的形态，MDX 反而是过度抽象。
//
// 修改这里 = 修改首页的项目展示。

export interface ProjectMetric {
  label: string;
  before: string;
  after: string;
}

export interface Project {
  slug: string;
  number: string;
  position: string;
  title: string;
  category: string;
  role: string;
  period?: string;
  oneLiner: string;
  kept: string[];
  cut: string[];
  reasoning: string;
  quote: string;
  quoteSize?: "md" | "lg" | "xl";
  metrics?: ProjectMetric[];
  relatedPost?: {
    slug: string;
    title: string;
  };
}

export const projects: Project[] = [
  {
    slug: "health-archive",
    number: "01",
    position: "0.4",
    title: "AI 健康档案管理系统",
    category: "B 端 · 内部工作流",
    role: "产品负责人",
    oneLiner:
      "为陪诊师、健康管理师、全科医生三个角色统一健康档案，解决“慢、漏、错”与数据不一致。",
    kept: [
      "病历资料数据录入",
      "全周期健康数据监测与管理",
      "三角色权限边界与字段一致性",
    ],
    cut: [
      "陪诊卡（陪诊师可见的当日就诊摘要）",
    ],
    reasoning:
      "陪诊卡是惊喜层。它能让客户和陪诊师都感到被照顾，是我自己最得意的小设计。但它必须先排队——核心功能还没到“好用”，惊喜层做了也只是漂浮在沙地上。所以我砍了它。",
    quote: "陪诊卡是惊喜层，但核心还没到好用层——所以它必须死。",
    quoteSize: "lg",
    relatedPost: {
      slug: "multi-agent-from-upload",
      title: "从一个上传病例的需求，我把多 Agent 协作彻底搞明白了",
    },
  },
  {
    slug: "ai-health-companion",
    number: "02",
    position: "0.6",
    title: "AI 在线健康管家",
    category: "C 端 · 7×24 会员服务",
    role: "产品负责人",
    oneLiner:
      "真人值班健康管家响应需 30–60 分钟。AI 在前置首响 + 结构化分诊，1 分钟内开始服务，递给真人时已是一份完整的交接单。",
    kept: [
      "身份验证",
      "结构化信息收集：症状 / 持续时间 / 意向医院 / 所在城市",
      "科室识别",
      "推荐 1–2 个就诊方案",
    ],
    cut: [
      "AI 直接给用户提出健康建议（“建议层”）",
    ],
    reasoning:
      "在做信息分析时，团队曾想让 AI 直接生成健康建议——产品看起来更完整、更“高级”。但经过讨论我们判断：AI 当下既不具备正式提出健康建议的专业能力，也无法承担相应的风险责任。所以我们砍掉了整个建议层，把 AI 严格限定在“收集、识别、推荐方案”这四步。",
    quote: "AI 算得出建议，但担不起开口的责任——AI 的边界，不该由能力划，要由责任划。",
    quoteSize: "lg",
    metrics: [
      {
        label: "首响时间",
        before: "30–60 min",
        after: "≤ 1 min",
      },
    ],
    relatedPost: {
      slug: "build-an-ai-health-companion",
      title:
        "零基础搭一个在线健康管家：AI 客服、RAG、槽位填充、数据库怎么配合",
    },
  },
];

export function getAllProjects(): Project[] {
  return projects;
}
