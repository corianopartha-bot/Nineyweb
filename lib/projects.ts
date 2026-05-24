/**
 * Project case-study data.
 * Extended schema (S3) supports the spotlight layout on /projects/[slug]:
 *   tags · brand · miniCards (goal/keywords) · loop (01–04) · designLogic · modules · value
 */
export type LocalizedText = { zh: string; en: string };
export type LocalizedList = { zh: string[]; en: string[] };

export type MiniCard = {
  kicker: LocalizedText;
  body: LocalizedText;
};

export type LoopStep = {
  index: string;
  body: LocalizedText;
};

export type ProjectLink = {
  label: LocalizedText;
  href: string;
  external?: boolean;
};

export type Project = {
  slug: string;
  year: string;
  status: "in-progress" | "draft" | "live";
  tags: LocalizedList;
  title: LocalizedText;
  role: LocalizedText;
  tagline: LocalizedText;
  result: LocalizedText;
  links?: ProjectLink[];
  miniCards: MiniCard[];
  loop: LoopStep[];
  designLogic: {
    heading: LocalizedText;
    body: LocalizedText;
  };
  modules: LocalizedList;
  value: LocalizedList;
};

export const projects: Project[] = [
  {
    slug: "ai-health-record",
    year: "2025",
    status: "live",
    tags: {
      zh: ["AI 自动化", "医疗档案", "多 Agent 流水线"],
      en: ["AI Automation", "Medical Records", "Multi-Agent Pipeline"],
    },
    title: {
      zh: "AI 自动化健康档案管理系统",
      en: "AI Health-Record Automation",
    },
    role: {
      zh: "唯一产品负责人 · 0→1 主导",
      en: "Sole PM · 0→1 lead",
    },
    tagline: {
      zh: "用 AI 把陪诊师手工整理诊后纪要的耗时，从 30–60 分钟压到 10 分钟以内。",
      en: "Used AI to compress the companion caregiver's post-visit note from 30–60 min down to under 10.",
    },
    result: {
      zh: "单陪诊师产能放大 5×；关键医疗字段准确率 ≥ 98%；推理成本节省约 30%。",
      en: "5× caregiver throughput · ≥98% accuracy on key fields · ~30% inference cost saved.",
    },
    miniCards: [
      {
        kicker: { zh: "项目背景", en: "Context" },
        body: {
          zh: "陪诊师陪诊后需把录音、检查单、处方单整理为「诊后纪要」，再经健康管理师审核、全科医生医学把关。单份纪要耗时 30–60 分钟，慢、漏、错严重制约规模化。",
          en: "After each visit, caregivers manually turn recordings, lab sheets and prescriptions into a post-visit summary that has to pass health managers and clinicians. Each summary takes 30–60 min — slow, lossy, error-prone — blocking scale.",
        },
      },
      {
        kicker: { zh: "我的角色", en: "My role" },
        body: {
          zh: "唯一产品负责人。对接开发 5 人、健康管理师、全科医生、法务，需求→PRD→AI 流水线架构→开发跟进→验收全流程独立把控。",
          en: "Sole product owner. Coordinated 5 engineers, health managers, GP doctors and legal — from research → PRD → AI pipeline architecture → dev follow-through → sign-off.",
        },
      },
    ],
    loop: [
      {
        index: "01",
        body: {
          zh: "调度层用代码规则识别图片 / PDF / 语音，分发到对应 AI 路径，避免不必要的模型调用。",
          en: "Routing layer uses code rules — not the model — to classify image / PDF / audio and dispatch to the right AI path, skipping unnecessary inferences.",
        },
      },
      {
        index: "02",
        body: {
          zh: "对应 Agent 做识别 / 结构化，落到一份共享的底层数据。",
          en: "Specialized agents extract and structure the content into one shared underlying record.",
        },
      },
      {
        index: "03",
        body: {
          zh: "陪诊师 / 健康管理师 / 全科医生三个角色共用同一份数据，任何修改实时同步。",
          en: "Caregivers, health managers and GP doctors all read and write the same record — every edit syncs in real time.",
        },
      },
      {
        index: "04",
        body: {
          zh: "字段从「锁死」改为「自由编号」结构，医生终审从 5 分钟压到 1–2 分钟。",
          en: "Fields moved from a frozen schema to a freely numbered structure — doctor final review cut from 5 min to 1–2.",
        },
      },
    ],
    designLogic: {
      heading: {
        zh: "不是「AI 替代陪诊师」，而是「AI + 角色协同」",
        en: "Not 'AI replaces the caregiver' — 'AI + roles, in one record'",
      },
      body: {
        zh: "我没有把模型推到最前面，而是先用代码规则筛掉不必要的推理，再用「一份数据、三个视图」让医疗角色之间不再因为复制粘贴而产生数据不一致。模型负责能省下时间的事，人负责必须由人来兜底的事。",
        en: "Instead of putting the model on the front line, I let code rules cut unnecessary inference first, then used a single record with three role-specific views so caregivers, health managers and doctors stop drifting apart through copy-paste. The model handles what it saves time on; humans hold what only humans can.",
      },
    },
    modules: {
      zh: [
        "素材调度层：规则识别图片 / PDF / 语音，分发到对应 AI 路径",
        "一份数据、三个视图：陪诊师 / 健康管理师 / 全科医生共用底层数据",
        "字段自由编号：检查结果与医生建议拆为独立模块，支持加减项",
        "用药清单：支持手动加药、修改剂量",
        "资料交接清单：支持勾选 / 取消 / 新增",
        "医生终审视图：聚合关键字段，1–2 分钟完成把关",
      ],
      en: [
        "Material router: rule-based image / PDF / audio classification",
        "One record, three views: caregiver / health manager / GP doctor",
        "Free-numbered fields: lab results and doctor advice as standalone, addable modules",
        "Medication list: manual add and dose editing",
        "Handover checklist: tickable / removable / addable items",
        "Doctor final-review view: key fields aggregated for 1–2 min sign-off",
      ],
    },
    value: {
      zh: [
        "单陪诊师产能放大 5 倍，把服务规模化的硬瓶颈打开",
        "关键医疗字段准确率 ≥ 98%，从根本上解决「慢、漏、错」",
        "调度层节省约 30% 推理成本",
        "三个角色再也不会因为复制粘贴出现数据不一致",
        "医生终审从 5 分钟压到 1–2 分钟，把医生时间还给医生",
      ],
      en: [
        "5× per-caregiver throughput — unblocks the hard ceiling on service scale",
        "≥98% accuracy on key fields — kills the slow-miss-wrong loop at the root",
        "~30% inference cost saved at the routing layer",
        "Three roles never drift apart again via copy-paste",
        "Doctor final review cut from 5 min to 1–2 — clinicians get their time back",
      ],
    },
  },
  {
    slug: "ai-health-manager",
    year: "2026",
    status: "in-progress",
    tags: {
      zh: ["AI 客服 / 健康管家", "RAG", "三重安全兜底"],
      en: ["AI Concierge", "RAG", "Triple Safety Fallback"],
    },
    title: {
      zh: "AI 在线健康管家",
      en: "AI Online Health Concierge",
    },
    role: {
      zh: "AI 产品经理 · 主导",
      en: "AI PM · lead",
    },
    tagline: {
      zh: "把公司「7×24 小时健康服务」从口号变成实兑承诺——夜间首响从 30–60 分钟压到 1 分钟内。",
      en: "Turned '24×7 health service' from slogan into an actual promise — overnight first-response from 30–60 min down to under 1.",
    },
    result: {
      zh: "夜间 / 节假日首响 < 1 分钟；急症识别 0 漏报；明确不碰诊断、不开药、不直连医生，合规边界清晰。",
      en: "<1 min first-response on nights & holidays · zero misses on emergency signals · no diagnosis, no prescription, no direct doctor handoff — a clean compliance boundary.",
    },
    miniCards: [
      {
        kicker: { zh: "项目背景", en: "Context" },
        body: {
          zh: "公司承诺会员 7×24 小时健康服务，但夜间 / 节假日人工首响延迟达 30–60 分钟，会员需求往往很急（如次日就诊安排），服务承诺无法完全兑现，直接影响续签率。",
          en: "We promise 24×7 health service, but at night and on holidays human first-response slipped to 30–60 min. Members' needs are urgent (e.g. tomorrow's appointment) — the promise was leaking, and renewal rate with it.",
        },
      },
      {
        kicker: { zh: "AI 定位", en: "AI positioning" },
        body: {
          zh: "前置漏斗，不替代人工。负责非工作时段的身份 / 权益核验、症状采集、医院 / 医生推荐、方案确认与工单生成；不碰诊断、不开药、不直接对接医生。",
          en: "A forward funnel, not a replacement. Covers off-hours identity/eligibility checks, symptom intake, hospital/doctor matching, plan confirmation and ticket generation — but never diagnoses, prescribes, or pings a doctor directly.",
        },
      },
    ],
    loop: [
      {
        index: "01",
        body: {
          zh: "会员进入即触发权益前置静默核验：身份 / 权益 / 在途工单，避免无效流转。",
          en: "On entry, a silent check fires: identity, eligibility, and any in-flight ticket — to kill dead routes early.",
        },
      },
      {
        index: "02",
        body: {
          zh: "AI 完成症状采集 / 医院与医生推荐 / 方案确认，仅推荐合作医生确保 100% 可达。",
          en: "AI runs symptom intake, hospital and doctor matching, and plan confirmation — limited to partner doctors for 100% reachability.",
        },
      },
      {
        index: "03",
        body: {
          zh: "急症信号识别后立即急诊指引 + 告警值班，忽略所有权益限制。",
          en: "On emergency signals, immediately surface ER instructions and page the on-call — overriding any eligibility limit.",
        },
      },
      {
        index: "04",
        body: {
          zh: "统一话术兜底：「医朋正在沟通专家中，明早 8 点前管家电话确认」，管理用户预期，工单同步交付人工。",
          en: "A standard hand-off line manages expectations — 'Medical Friend is talking with the specialist now; your concierge will call back before 8 a.m.' — while the ticket is queued for a human.",
        },
      },
    ],
    designLogic: {
      heading: {
        zh: "AI 是前置漏斗，不是替代人工",
        en: "AI as a forward funnel, not a substitute",
      },
      body: {
        zh: "在医疗这个高信任门槛的场景里，让 AI 直接做诊断、开药、对接医生，是用合规风险换效率。我把 AI 收在「前置漏斗」这条线上：覆盖非工作时段的核验、采集、推荐和工单，明确不越线；同时设计三重安全兜底，把医生的判断权完整地留给医生。",
        en: "In a high-trust setting like healthcare, letting AI diagnose, prescribe, or talk to doctors directly trades compliance risk for speed. I kept AI on a single line — forward funnel: identity check, intake, recommendation, ticketing in off-hours — with a hard boundary, and built triple safety fallback so doctors keep the judgement call.",
      },
    },
    modules: {
      zh: [
        "权益前置静默核验：身份 / 权益 / 在途工单",
        "症状采集与医院 / 医生推荐（仅合作医生，确保 100% 可达）",
        "方案确认与工单生成，回流人工管家",
        "急症识别 → 急诊指引 + 告警值班，忽略权益限制",
        "话术与 Prompt 经法务 + 医生双 review",
        "统一兜底话术：管理用户预期，明确次日承诺",
      ],
      en: [
        "Silent pre-check: identity / eligibility / in-flight ticket",
        "Symptom intake & doctor matching (partner doctors only — 100% reachable)",
        "Plan confirmation and ticket creation, handed back to a human concierge",
        "Emergency signal → ER instructions + on-call paging, overriding limits",
        "All scripts & prompts dual-reviewed by legal and clinicians",
        "Standardized hand-off line that manages expectations and commits to a next-morning call",
      ],
    },
    value: {
      zh: [
        "夜间 / 节假日首响从 30–60 分钟压到 1 分钟内",
        "把「7×24 小时」从口号变成实兑承诺，直接保护会员续签率",
        "急症 0 漏报，合规边界清晰",
        "AI 不输出诊断 / 用药，话术经法务 + 医生双 review",
        "100% 推荐合作医生，避免空头承诺",
      ],
      en: [
        "Overnight first-response cut from 30–60 min to <1",
        "Turns '24×7' from a slogan into a kept promise — directly protecting renewal",
        "Zero misses on emergency signals; a clean compliance boundary",
        "No diagnosis or prescription output; every script vetted by legal + clinicians",
        "Only partner doctors are recommended — no hollow promises",
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
