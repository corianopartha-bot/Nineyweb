"use client";

// About——节点 0.3。
// 没有事实（不写城市/在不在职/几月入职），只有两条信条。
// 第一条讲方法（怎么搭），第二条讲边界（哪里停）。

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { SpineNode } from "@/components/SpineNode";

export function About() {
  return (
    <section
      id="about"
      className="relative px-6 py-28 md:px-10 md:py-40"
    >
      <SpineNode position="0.3" label="ABOUT" />

      <div className="mx-auto mt-20 max-w-3xl space-y-10 md:mt-28 md:space-y-14">
        {site.credo.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
              delay: 0.1 + i * 0.2,
            }}
            className="text-display text-3xl leading-[1.3] text-[color:var(--color-paper-90)] md:text-5xl lg:text-[3.5rem]"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
