import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Link } from "@/i18n/navigation";
import { getPost, getAllSlugs } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export async function generateStaticParams() {
  return await getAllSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPost(locale, slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-20 pb-32">
      <Link
        href="/writing"
        className="inline-block font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] mb-10"
      >
        ← Writing
      </Link>

      <header className="mb-16 max-w-[var(--measure)]">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)] mb-8">
          <span>{post.date}</span>
          <span className="opacity-30">/</span>
          <span>{post.readingTime}</span>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="opacity-30">/</span>
              <span className="text-[color:var(--accent)]">
                {post.tags.join(" · ")}
              </span>
            </>
          )}
        </div>
        <h1
          className="text-display"
          style={{ fontSize: "var(--step-3)", lineHeight: 1.1 }}
        >
          {post.title}
        </h1>
        {post.description && (
          <p
            className="mt-6 text-[color:var(--fg-muted)]"
            style={{ fontSize: "var(--step-1)", lineHeight: 1.5 }}
          >
            {post.description}
          </p>
        )}
      </header>

      <div className="max-w-[var(--measure)]">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
              ],
            },
          }}
        />
      </div>
    </article>
  );
}
