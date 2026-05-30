"use client";

// Writing——节点 0.9。
// 6 篇按 frontmatter.order 排序：#1 镇站，#6 humanity 收尾。
// 每行 = 序号 + 标题 + 标签，hover 时整行向右挪 2px、标题加重。

import { motion } from "framer-motion";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { SpineNode } from "@/components/SpineNode";

const tagColor: Record<string, string> = {
  取舍: "text-[color:var(--color-blood)]",
  判断力: "text-[color:var(--color-blood)]",
  "0→1": "text-[color:var(--color-paper-90)]",
  医疗: "text-[color:var(--color-paper-90)]",
  方法: "text-[color:var(--color-paper-55)]",
  用户洞察: "text-[color:var(--color-paper-55)]",
  思考: "text-[color:var(--color-paper-55)]",
  落地: "text-[color:var(--color-paper-55)]",
  实战: "text-[color:var(--color-paper-55)]",
};

export function Writing({ posts }: { posts: PostMeta[] }) {
  return (
    <section
      id="writing"
      className="relative px-6 py-28 md:px-10 md:py-40"
    >
      <SpineNode position="0.9" label="WRITING" />

      <div className="mx-auto mt-20 max-w-4xl md:mt-28">
        <ul className="divide-y divide-[color:var(--color-paper-10)]">
          {posts.map((post, i) => (
            <motion.li
              key={post.slug}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: i * 0.06,
              }}
            >
              <Link
                href={`/writing/${post.slug}`}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-4 py-6 transition-transform duration-300 hover:translate-x-1 md:grid-cols-[3rem_1fr_auto] md:gap-6 md:py-8"
              >
                {/* 序号 */}
                <span className="text-label text-[color:var(--color-paper-30)] group-hover:text-[color:var(--color-blood)]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* 标题 + 阅读时间 */}
                <div>
                  <h3 className="text-base leading-snug text-[color:var(--color-paper-90)] transition-colors duration-200 group-hover:text-[color:var(--color-paper)] md:text-xl">
                    {post.title}
                  </h3>
                  <div className="text-label mt-2 flex items-center gap-3 text-[color:var(--color-paper-30)]">
                    <span>{post.readingMinutes} MIN READ</span>
                    {post.date && (
                      <>
                        <span className="opacity-50">·</span>
                        <span>{post.date}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 标签 */}
                {post.tags.length > 0 && (
                  <div className="col-span-2 mt-2 flex flex-wrap gap-2 md:col-span-1 md:mt-0 md:flex-nowrap md:justify-end">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-label border border-[color:var(--color-paper-10)] px-2.5 py-1 ${
                          tagColor[tag] ?? "text-[color:var(--color-paper-55)]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
