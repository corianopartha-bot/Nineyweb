/**
 * Project case-study seeds.
 * S3 will swap these for full MDX case studies. For now they
 * back the /projects and /projects/[slug] routes so timeline
 * links resolve cleanly.
 */
export type Project = {
  slug: string;
  year: string;
  title: { zh: string; en: string };
  role: { zh: string; en: string };
  tagline: { zh: string; en: string };
  result: { zh: string; en: string };
  status: "in-progress" | "draft" | "live";
};

export const projects: Project[] = [
  {
    slug: "llm-consult",
    year: "2026",
    title: {
      zh: "LLM 问诊助手",
      en: "LLM Consultation Assistant",
    },
    role: {
      zh: "AI 产品经理 · 0→1 主导",
      en: "AI PM · 0→1 lead",
    },
    tagline: {
      zh: "把大模型放进合规的医疗场景里，让用户敢于先问出第一个问题。",
      en: "Bringing an LLM into regulated healthcare — letting users dare to ask the first question.",
    },
    result: {
      zh: "上线 4 个月 DAU 破万；平均会话深度 6.3 轮；用户满意度 4.6/5。",
      en: "DAU broke 10k in 4 months; avg session depth 6.3 turns; CSAT 4.6/5.",
    },
    status: "in-progress",
  },
  {
    slug: "medication-reminder",
    year: "2025",
    title: {
      zh: "用药提醒重构",
      en: "Medication Reminder Rebuild",
    },
    role: {
      zh: "产品经理 · 健康管理 App",
      en: "PM · Health-management app",
    },
    tagline: {
      zh: "把'又是一个推送'变成'被记住的承诺'——重新设计提醒模块的认知模型。",
      en: "Turning 'yet another push' into 'a promise being kept' — redesigning the reminder's cognitive model.",
    },
    result: {
      zh: "D30 留存 +18%；提醒打开率 +27%；用户主动配置完成率 92%。",
      en: "D30 retention +18%; reminder open rate +27%; setup completion 92%.",
    },
    status: "in-progress",
  },
  {
    slug: "growth-referral",
    year: "2024",
    title: {
      zh: "裂变激励体系",
      en: "Referral Incentive System",
    },
    role: {
      zh: "增长产品 · 互联网医疗",
      en: "Growth PM · Internet healthcare",
    },
    tagline: {
      zh: "在医疗这种'低分享意愿'品类里，找到一种不让人觉得被利用的邀请机制。",
      en: "Finding an invitation mechanic that doesn't feel exploitative — in a category nobody wants to share.",
    },
    result: {
      zh: "单季新增 40 万用户；分享渗透率 +9.4pp；CAC 下降 31%。",
      en: "+400k new users in a quarter; share rate +9.4pp; CAC −31%.",
    },
    status: "in-progress",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
