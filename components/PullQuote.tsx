"use client";

// PullQuote——全站最贵的几行字。
// 巨字 italic + 左侧一根血色短线，强迫读者停一下。
// 用在每个项目末尾、Hero 副位、Contact 大句。

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface PullQuoteProps {
  children: React.ReactNode;
  source?: string;
  size?: "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  md: "text-2xl md:text-3xl lg:text-4xl",
  lg: "text-3xl md:text-5xl lg:text-6xl",
  xl: "text-5xl md:text-7xl lg:text-[7rem]",
};

export function PullQuote({
  children,
  source,
  size = "lg",
  className,
}: PullQuoteProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={cn("relative flex gap-6 md:gap-8", className)}
    >
      {/* 左侧血色短线 */}
      <div
        aria-hidden
        className="mt-3 h-[1.2em] w-px shrink-0 bg-[color:var(--color-blood)] md:mt-5"
      />
      <div>
        <blockquote
          className={cn(
            "text-display text-[color:var(--color-paper)]",
            sizeMap[size]
          )}
        >
          {children}
        </blockquote>
        {source && (
          <figcaption className="text-label mt-4 text-[color:var(--color-paper-55)]">
            {source}
          </figcaption>
        )}
      </div>
    </motion.figure>
  );
}
