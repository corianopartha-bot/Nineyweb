import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, loadPostMDX } from "@/lib/posts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Spine } from "@/components/Spine";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} · Niney`,
    description: post.meta.excerpt ?? undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const MDX = await loadPostMDX(slug);
  if (!MDX) notFound();

  return (
    <>
      <Spine />
      <Nav />
      <main className="relative">
        <article className="mx-auto max-w-3xl px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
          {/* 返回链接 */}
          <Link
            href="/#writing"
            className="text-label group inline-flex items-center gap-2 text-[color:var(--color-paper-55)] hover:text-[color:var(--color-paper)]"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            <span>BACK TO ARCHIVE</span>
          </Link>

          {/* 标题与元信息 */}
          <header className="mt-10 mb-12 md:mt-14 md:mb-16">
            <h1 className="text-display text-3xl leading-[1.15] text-[color:var(--color-paper)] md:text-5xl lg:text-6xl">
              {post.meta.title}
            </h1>
            <div className="text-label mt-6 flex flex-wrap items-center gap-3 text-[color:var(--color-paper-55)]">
              {post.meta.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="border border-[color:var(--color-paper-10)] px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
              {post.meta.date && (
                <>
                  <span className="opacity-50">·</span>
                  <span>{post.meta.date}</span>
                </>
              )}
            </div>
            {post.meta.excerpt && (
              <p className="mt-8 border-l border-[color:var(--color-blood)] pl-4 text-lg leading-relaxed text-[color:var(--color-paper-70)] md:text-xl">
                {post.meta.excerpt}
              </p>
            )}
          </header>

          {/* MDX 正文 */}
          <div className="prose-cn">
            <MDX />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
