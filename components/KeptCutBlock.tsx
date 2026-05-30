"use client";

// 取舍块——双列对位：左 KEPT、右 CUT，下方一句 REASONING。
// 是这个站点叙事方法的物理表达：每个项目都被还原成"留下了什么 / 砍掉了什么 / 为什么"。
// 视觉上左列淡入稍慢，右列淡入稍快 0.1s——动作感强调"砍"。

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface KeptCutBlockProps {
  kept: string[];
  cut: string[];
  reasoning?: string;
  className?: string;
}

export function KeptCutBlock({
  kept,
  cut,
  reasoning,
  className,
}: KeptCutBlockProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        {/* KEPT */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="text-label mb-4 text-[color:var(--color-paper-70)]">
            ▸ KEPT · 留下了
          </div>
          <ul className="space-y-3">
            {kept.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 text-base leading-relaxed text-[color:var(--color-paper-90)] md:text-lg"
              >
                <span className="mt-2 inline-block h-px w-3 shrink-0 bg-[color:var(--color-paper-70)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CUT */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0 }}
        >
          <div className="text-label mb-4 flex items-center gap-2 text-[color:var(--color-paper-70)]">
            <span>▸ CUT · 砍掉了</span>
            <span className="led-blood h-1.5 w-1.5 rounded-full" />
          </div>
          <ul className="space-y-3">
            {cut.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 text-base leading-relaxed text-[color:var(--color-paper-70)] line-through decoration-[color:var(--color-blood)]/60 md:text-lg"
              >
                <span className="mt-2 inline-block h-px w-3 shrink-0 bg-[color:var(--color-blood)]/60 no-underline" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {reasoning && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
          className="mt-10 border-t border-[color:var(--color-paper-10)] pt-6"
        >
          <div className="text-label mb-2 text-[color:var(--color-paper-55)]">
            ▸ 为什么
          </div>
          <p className="text-base leading-relaxed text-[color:var(--color-paper-90)] md:text-lg">
            {reasoning}
          </p>
        </motion.div>
      )}
    </div>
  );
}
