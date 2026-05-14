import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type PostFrontmatter = {
  title: string;
  description?: string;
  date: string;          // ISO yyyy-mm-dd
  tags?: string[];
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  locale: string;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;       // raw MDX body
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "writing");

function fallbackLocale(locale: string) {
  return locale === "en" ? "en" : "zh";
}

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

async function readPostFile(locale: string, fileName: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_ROOT, locale, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  if (!fm.title || !fm.date) return null;
  if (fm.draft) return null;
  const slug = fileName.replace(/\.mdx?$/, "");
  return {
    ...fm,
    slug,
    locale,
    content,
    readingTime: readingTime(content).text,
  };
}

export async function listPostsMeta(locale: string): Promise<PostMeta[]> {
  const lang = fallbackLocale(locale);
  const dir = path.join(CONTENT_ROOT, lang);
  const files = await readDirSafe(dir);
  const posts = (
    await Promise.all(
      files
        .filter((f) => /\.mdx?$/.test(f))
        .map(async (f) => readPostFile(lang, f))
    )
  ).filter((p): p is Post => p !== null);

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  // Strip content for list responses
  return posts.map(({ content, ...meta }) => {
    void content;
    return meta;
  });
}

export async function getPost(locale: string, slug: string): Promise<Post | null> {
  const lang = fallbackLocale(locale);
  const dir = path.join(CONTENT_ROOT, lang);
  const files = await readDirSafe(dir);
  const match = files.find(
    (f) => f.replace(/\.mdx?$/, "") === slug && /\.mdx?$/.test(f)
  );
  if (!match) return null;
  return readPostFile(lang, match);
}

export async function getAllSlugs(): Promise<{ locale: string; slug: string }[]> {
  const out: { locale: string; slug: string }[] = [];
  for (const locale of ["zh", "en"]) {
    const dir = path.join(CONTENT_ROOT, locale);
    const files = await readDirSafe(dir);
    for (const f of files) {
      if (!/\.mdx?$/.test(f)) continue;
      const filePath = path.join(dir, f);
      const raw = await fs.readFile(filePath, "utf8");
      const { data } = matter(raw);
      if (data?.draft) continue;
      out.push({ locale, slug: f.replace(/\.mdx?$/, "") });
    }
  }
  return out;
}
