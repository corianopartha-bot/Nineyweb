"use client";

// 脊柱节点——放在 section 内部，水平居中后正好落在脊柱线上。
// 显示一个小圆环 + 可选编号标签。当 section 进入视口时点亮血色 LED。

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

interface SpineNodeProps {
  /** 节点编号，比如 "0.3" / "0.5" / "1.0"——对应在脊柱上的位置语义 */
  position: string;
  /** 节点标签，比如 "ABOUT" / "PROJECT 01" */
  label?: string;
  /** 终点节点（"1"）默认常亮血色 */
  terminal?: boolean;
}

export function SpineNode({ position, label, terminal = false }: SpineNodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  // 节点中心进入视口中部时认为"激活"
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  const isActive = terminal || inView;

  return (
    <div
      ref={ref}
      className="relative z-[6] flex w-full justify-center select-none"
    >
      {/* 节点圆环 */}
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1 : 0.7,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "h-2.5 w-2.5 rounded-full bg-[color:var(--color-ink)]",
          isActive
            ? "led-blood border-0"
            : "border border-[color:var(--color-paper-30)]"
        )}
      />

      {/* 编号 + 标签，向右挂出，与脊柱保持一段距离 */}
      {(label || position) && (
        <div className="pointer-events-none absolute left-[calc(50%+18px)] top-1/2 -translate-y-1/2 whitespace-nowrap">
          <div className="text-label flex items-center gap-2">
            <span className="opacity-50">◯ {position}</span>
            {label && (
              <>
                <span className="opacity-30">—</span>
                <span
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-[color:var(--color-paper-90)]" : ""
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
