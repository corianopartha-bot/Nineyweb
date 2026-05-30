"use client";

// Contact——终点 1.0。
// 一句"我在找..."硬话 + 唯一一个邮箱链接 + 终点常亮的血色 LED。
// 不放表单、不放 LinkedIn、不放微信二维码——邮箱是过滤器。

import { motion } from "framer-motion";
import { useState } from "react";
import { site } from "@/lib/site";
import { SpineNode } from "@/components/SpineNode";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    // Cmd/Ctrl + 点击 = 复制；普通点击 = mailto
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(site.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* noop */
      }
    }
  };

  return (
    <section
      id="contact"
      className="relative px-6 py-28 md:px-10 md:py-40"
    >
      <SpineNode position="1.0" label="END" terminal />

      <div className="mx-auto mt-20 max-w-3xl text-center md:mt-28">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="text-label mb-6 text-[color:var(--color-paper-70)]">
            ▸ {site.contact.headline}
          </div>
          <h2 className="text-display text-3xl leading-[1.25] text-[color:var(--color-paper)] md:text-5xl lg:text-[3.5rem]">
            {site.contact.body.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          className="mt-16 md:mt-20"
        >
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(
              site.contact.emailSubject
            )}`}
            onClick={handleCopy}
            className="group inline-flex items-baseline gap-3 border-b border-[color:var(--color-paper-30)] pb-2 text-lg text-[color:var(--color-paper-90)] hover:border-[color:var(--color-paper)] hover:text-[color:var(--color-paper)] md:text-2xl"
          >
            <span className="text-display italic">{site.email}</span>
            <span className="text-[color:var(--color-paper-30)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              →
            </span>
          </a>
          <div className="text-label mt-3 text-[color:var(--color-paper-30)]">
            {copied ? "邮箱已复制" : "点击拉起邮件 · Cmd/Ctrl+点击复制"}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
