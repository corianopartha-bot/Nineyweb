import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export function Callout({
  type = "note",
  children,
}: {
  type?: "note" | "tip" | "warn";
  children: React.ReactNode;
}) {
  const tone =
    type === "warn"
      ? "border-l-[color:var(--accent)] bg-[color:var(--accent-tint)]/40"
      : type === "tip"
      ? "border-l-[color:var(--accent)] bg-[color:var(--paper-deep)]"
      : "border-l-[color:var(--fg)]/40 bg-[color:var(--paper-deep)]";
  const label = type === "warn" ? "WARN" : type === "tip" ? "TIP" : "NOTE";
  return (
    <aside className={`my-8 border-l-2 ${tone} px-5 py-4 not-prose`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent)] mb-2">
        {label}
      </p>
      <div className="text-[color:var(--fg)]/90 leading-relaxed">{children}</div>
    </aside>
  );
}

export function SourceAttribution({ url }: { url: string }) {
  return (
    <div className="not-prose mt-16 pt-6 border-t border-[color:var(--border)] font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--fg-muted)]">
      本文首发于「一点一竖一横捺」专栏 @{" "}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[color:var(--accent)] hover:underline"
      >
        人人都是产品经理 ↗
      </a>
    </div>
  );
}

export function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-12 not-prose">
      <p
        className="text-display text-[color:var(--fg)]"
        style={{ fontSize: "var(--step-2)", lineHeight: 1.25 }}
      >
        <span className="text-[color:var(--accent)]">"</span>
        {children}
        <span className="text-[color:var(--accent)]">"</span>
      </p>
    </blockquote>
  );
}

/**
 * Components map for MDXRemote — styled headings, lists, links, code, etc.
 * Tailwind v4 has no `prose` plugin baked in; we style by element directly.
 */
export const mdxComponents: MDXComponents = {
  h1: (p) => (
    <h1
      className="text-display mt-16 mb-6"
      style={{ fontSize: "var(--step-3)", lineHeight: 1.1 }}
      {...p}
    />
  ),
  h2: (p) => (
    <h2
      className="text-display mt-14 mb-5"
      style={{ fontSize: "var(--step-2)", lineHeight: 1.2 }}
      {...p}
    />
  ),
  h3: (p) => (
    <h3
      className="text-display mt-10 mb-4"
      style={{ fontSize: "var(--step-1)", lineHeight: 1.25 }}
      {...p}
    />
  ),
  p: (p) => (
    <p
      className="my-5 text-[color:var(--fg)]/90"
      style={{ fontSize: "var(--step-0)", lineHeight: 1.8 }}
      {...p}
    />
  ),
  a: (p) => (
    <a
      className="underline decoration-[color:var(--accent)] decoration-2 underline-offset-4 hover:text-[color:var(--accent)] transition-colors"
      {...p}
    />
  ),
  ul: (p) => <ul className="my-5 list-disc pl-6 space-y-2" {...p} />,
  ol: (p) => <ol className="my-5 list-decimal pl-6 space-y-2" {...p} />,
  li: (p) => (
    <li
      className="text-[color:var(--fg)]/90 leading-relaxed"
      style={{ fontSize: "var(--step-0)" }}
      {...p}
    />
  ),
  blockquote: (p) => (
    <blockquote
      className="my-8 border-l-2 border-[color:var(--accent)] pl-5 italic text-[color:var(--fg-muted)]"
      {...p}
    />
  ),
  hr: () => (
    <hr className="my-12 border-0 border-t border-[color:var(--border)]" />
  ),
  code: (p) => (
    <code
      className="font-mono text-[0.9em] px-1.5 py-0.5 bg-[color:var(--paper-deep)] text-[color:var(--accent)] rounded-sm"
      {...p}
    />
  ),
  pre: (p) => (
    <pre
      className="my-6 p-5 bg-[color:var(--paper-deep)] border border-[color:var(--border)] overflow-x-auto font-mono text-sm"
      {...p}
    />
  ),
  img: (p) => {
    const { src, alt = "" } = p as { src: string; alt?: string };
    return (
      <span className="block my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full" />
      </span>
    );
  },
  Image,
  Callout,
  Pullquote,
  SourceAttribution,
};
