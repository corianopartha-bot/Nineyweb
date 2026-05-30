"use client";

// MetricRow——单行关键指标：标签 + before → after。
// 用于"响应时间 30-60 min → 1 min"这种压缩感强的展示。

import { motion } from "framer-motion";

interface MetricRowProps {
  label: string;
  before: string;
  after: string;
}

export function MetricRow({ label, before, after }: MetricRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-baseline gap-4 border-t border-[color:var(--color-paper-10)] py-4 md:gap-8"
    >
      <div className="text-label w-32 shrink-0 text-[color:var(--color-paper-55)]">
        {label}
      </div>
      <div className="flex flex-1 items-baseline gap-3 md:gap-5">
        <span className="text-display text-2xl text-[color:var(--color-paper-55)] line-through decoration-[color:var(--color-paper-30)] md:text-3xl">
          {before}
        </span>
        <span className="text-[color:var(--color-paper-30)]">→</span>
        <span className="text-display text-3xl text-[color:var(--color-paper)] md:text-4xl">
          {after}
        </span>
      </div>
    </motion.div>
  );
}
