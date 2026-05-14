import { Feed } from "feed";
import { listPostsMeta } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const posts = await listPostsMeta("zh");

  const feed = new Feed({
    title: site.name,
    description: "写产品 × 模型边界的思考",
    id: site.url,
    link: site.url,
    language: "zh-CN",
    favicon: `${site.url}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${site.name}`,
    feedLinks: {
      rss: `${site.url}/rss.xml`,
    },
    author: {
      name: site.author,
      email: site.email,
      link: site.url,
    },
  });

  for (const p of posts) {
    feed.addItem({
      title: p.title,
      id: `${site.url}/writing/${p.slug}`,
      link: `${site.url}/writing/${p.slug}`,
      description: p.description ?? "",
      date: new Date(p.date),
      category: (p.tags ?? []).map((t) => ({ name: t })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
