"use client";

// Hero——脊柱起点 0.0。
// 中央放产品哲学（巨字 italic），上方放名字与身份，下方放副位金句。
// 不放头像、不放视频、不放滚动序列帧——克制是最大的视觉武器。

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { SpineNode } from "@/components/SpineNode";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col items-center justify-between px-6 pt-28 pb-16 md:px-10 md:pt-32 md:pb-20"
    >
      {/* 顶部：名字 + 身份行 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="text-label text-center text-[color:var(--color-paper-70)]"
      >
        {site.role} · {site.experience} · 0→1
      </motion.div>

      {/* 中部：哲学巨字 */}
      <div className="relative z-10 w-full max-w-5xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.5 }}
          className="text-display text-[color:var(--color-paper)]"
        >
          <span className="block text-4xl leading-[1.05] md:text-6xl lg:text-7xl xl:text-[5.5rem]">
            {site.philosophy.line1}
          </span>
          <span className="mt-2 block text-4xl leading-[1.05] md:text-6xl lg:text-7xl xl:text-[5.5rem]">
            {site.philosophy.line2}
          </span>
        </motion.h1>

        {/* 副位金句 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 1.1 }}
          className="mx-auto mt-10 flex max-w-xl items-baseline justify-center gap-3 md:mt-14"
        >
          <span className="inline-block h-px w-6 shrink-0 translate-y-[-0.4em] bg-[color:var(--color-blood)]" />
          <p className="text-left text-base text-[color:var(--color-paper-70)] md:text-lg">
            <span className="text-[color:var(--color-paper-90)]">
              "{site.heroSubQuote.text}"
            </span>
            <span className="text-label ml-2 inline-block">
              {site.heroSubQuote.source}
            </span>
          </p>
        </motion.div>
      </div>

      {/* 底部：脊柱起点节点 + 滚动提示 */}
      <div className="w-full">
        <SpineNode position="0.0" label={site.name.toUpperCase()} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="text-label mt-12 text-center text-[color:var(--color-paper-30)]"
        >
          SCROLL ↓
        </motion.div>
      </div>
    </section>
  );
}
