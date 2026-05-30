// MDX 自定义组件——文章里写 h2/h3/blockquote/code 等元素时，统一走这里的样式。
// 不引入 @tailwindcss/typography，自己定义有限几条规则，保持站点字体语言一致。

import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="text-display mt-16 mb-6 text-2xl text-[color:var(--color-paper)] md:text-4xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-display mt-12 mb-4 text-xl text-[color:var(--color-paper-90)] md:text-2xl">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-5 text-base leading-[1.85] text-[color:var(--color-paper-90)] md:text-lg">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-5 space-y-2 pl-5 text-base leading-[1.85] text-[color:var(--color-paper-90)] md:text-lg">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-base leading-[1.85] text-[color:var(--color-paper-90)] md:text-lg">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-[1.85]">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l border-[color:var(--color-blood)] pl-5 text-[color:var(--color-paper-70)] italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="border-b border-[color:var(--color-paper-30)] text-[color:var(--color-paper)] hover:border-[color:var(--color-paper)]"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[color:var(--color-paper-05)] px-1.5 py-0.5 font-mono text-[0.9em] text-[color:var(--color-paper)]">
      {children}
    </code>
  ),
  hr: () => (
    <hr className="my-12 border-0 border-t border-[color:var(--color-paper-10)]" />
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[color:var(--color-paper)]">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="text-display italic text-[color:var(--color-paper)]">
      {children}
    </em>
  ),
};
