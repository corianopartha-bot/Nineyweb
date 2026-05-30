"use client";

// 单个项目 section——吃 Project 数据，自动布置 SpineNode + 标题 + 概览 + KeptCut + PullQuote + Metrics + 延伸阅读。
// 两个项目共用这个模板。要加第三个项目，只在 lib/projects.ts 加一条数据即可，无需新写组件。

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { SpineNode } from "@/components/SpineNode";
import { KeptCutBlock } from "@/components/KeptCutBlock";
import { PullQuote } from "@/components/PullQuote";
import { MetricRow } from "@/components/MetricRow";

export function ProjectSection({ project }: { project: Project }) {
  return (
    <section
      id={`project-${project.slug}`}
      className="relative px-6 py-28 md:px-10 md:py-40"
    >
      <SpineNode
        position={project.position}
        label={`PROJECT ${project.number}`}
      />

      <div className="mx-auto mt-20 max-w-5xl md:mt-28">
        {/* 项目标题 + 元信息 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 md:mb-16"
        >
          <div className="text-label mb-4 flex items-center gap-3 text-[color:var(--color-paper-55)]">
            <span>{project.category}</span>
            <span className="opacity-50">·</span>
            <span>{project.role}</span>
          </div>
          <h2 className="text-display text-4xl text-[color:var(--color-paper)] md:text-6xl lg:text-7xl">
            {project.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[color:var(--color-paper-70)] md:text-lg">
            {project.oneLiner}
          </p>
        </motion.div>

        {/* KEPT / CUT / REASONING */}
        <KeptCutBlock
          kept={project.kept}
          cut={project.cut}
          reasoning={project.reasoning}
          className="mb-16 md:mb-20"
        />

        {/* PullQuote */}
        <div className="mb-16 md:mb-20">
          <PullQuote size={project.quoteSize ?? "lg"}>{project.quote}</PullQuote>
        </div>

        {/* Metrics（可选）*/}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-16 md:mb-20">
            <div className="text-label mb-6 text-[color:var(--color-paper-55)]">
              ▸ 关键指标
            </div>
            {project.metrics.map((m) => (
              <MetricRow key={m.label} {...m} />
            ))}
          </div>
        )}

        {/* 延伸阅读——挂回 Writing 节点 */}
        {project.relatedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="border-t border-[color:var(--color-paper-10)] pt-6"
          >
            <div className="text-label mb-3 text-[color:var(--color-paper-55)]">
              ▸ 延伸阅读
            </div>
            <Link
              href={`/writing/${project.relatedPost.slug}`}
              className="group inline-flex items-baseline gap-3 text-base text-[color:var(--color-paper-90)] hover:text-[color:var(--color-paper)] md:text-lg"
            >
              <span className="inline-block h-px w-4 translate-y-[-0.3em] bg-[color:var(--color-paper-30)] group-hover:bg-[color:var(--color-paper)]" />
              <span>《{project.relatedPost.title}》</span>
              <span className="text-[color:var(--color-paper-30)] transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
