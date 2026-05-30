// Writing 元数据层——读 content/writing/ 下的 MDX frontmatter，
// 按 frontmatter.order 升序排列（"战略性排序"）。

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface PostMeta {
  slug: string;
  title: string;
  date?: string;
  tags: string[];
  excerpt?: string;
  order: number;
  pinned?: boolean;
  readingMinutes: number;
}

const POSTS_DIR = path.join(process.cwd(), "content/writing");

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map<PostMeta>((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const rt = readingTime(content);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? undefined,
      tags: data.tags ?? [],
      excerpt: data.excerpt ?? undefined,
      order: typeof data.order === "number" ? data.order : 999,
      pinned: data.pinned ?? false,
      readingMinutes: Math.max(1, Math.round(rt.minutes)),
    };
  });

  return posts.sort((a, b) => a.order - b.order);
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { meta: data, content, slug };
}

// 静态 import 映射——bundler 需要字面量路径才能追踪 .mdx 模块。
// 添加新文章时：在 content/writing/ 创建 mdx + 这里加一行。
type MDXModule = { default: React.ComponentType<{ components?: unknown }> };

const mdxLoaders: Record<string, () => Promise<MDXModule>> = {
  "data-cant-save-direction": () =>
    import("@/content/writing/data-cant-save-direction.mdx"),
  "medical-ai-privacy": () => import("@/content/writing/medical-ai-privacy.mdx"),
  "build-an-ai-health-companion": () =>
    import("@/content/writing/build-an-ai-health-companion.mdx"),
  "multi-agent-from-upload": () =>
    import("@/content/writing/multi-agent-from-upload.mdx"),
  "user-research-sop": () => import("@/content/writing/user-research-sop.mdx"),
  "why-we-still-share": () => import("@/content/writing/why-we-still-share.mdx"),
};

export async function loadPostMDX(slug: string) {
  const loader = mdxLoaders[slug];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}
