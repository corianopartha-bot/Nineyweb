"use client";

// 全站脊柱——固定在视口水平中心，从顶到底贯穿。
// 暖白细线作底，血色细线随滚动从上往下"长"出。
// 不参与内容流，纯视觉。z-index 比内容低、比 grain 高。

import { motion, useScroll, useTransform } from "framer-motion";

export function Spine() {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-1/2 z-[5] hidden -translate-x-1/2 md:block"
    >
      {/* 底色：暖白 10% 透明 */}
      <div className="relative h-full w-px bg-[color:var(--color-paper-10)]">
        {/* 进度填充：暖白 30%，从顶端 scaleY 增长 */}
        <motion.div
          style={{ scaleY }}
          className="absolute inset-0 origin-top bg-[color:var(--color-paper-30)]"
        />
      </div>
    </div>
  );
}
