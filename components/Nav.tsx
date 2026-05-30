"use client";

// 极简 Nav：左品牌、右单一邮箱 CTA。
// 不放 About/Project/Writing 一堆链接——脊柱本身就是导航。

import { motion } from "framer-motion";
import { site } from "@/lib/site";

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 md:py-6"
    >
      {/* 品牌 */}
      <a href="#top" className="group flex items-center gap-2.5">
        <span className="led-blood h-1.5 w-1.5 rounded-full" />
        <span className="text-label text-[color:var(--color-paper-90)] group-hover:text-[color:var(--color-paper)]">
          {site.name}
        </span>
      </a>

      {/* CTA */}
      <a
        href={`mailto:${site.email}?subject=${encodeURIComponent(
          site.contact.emailSubject
        )}`}
        className="group flex items-center gap-2"
      >
        <span className="text-label text-[color:var(--color-paper-70)] transition-colors duration-200 group-hover:text-[color:var(--color-paper)]">
          Contact
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="text-[color:var(--color-paper-55)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--color-paper)]"
          aria-hidden
        >
          <path
            d="M2 8L8 2M8 2H3M8 2V7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="square"
          />
        </svg>
      </a>
    </motion.header>
  );
}
