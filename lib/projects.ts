/**
 * Project case-study seeds.
 * Two earlier in-progress cases (llm-consult, medication-reminder) have been
 * pulled until they're cleared for sharing. Reach out via email if you'd like
 * the early version.
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
      zh: "在医疗这种「低分享意愿」品类里，找到一种不让人觉得被利用的邀请机制。",
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
