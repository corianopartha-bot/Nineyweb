// Next.js App Router 约定：@next/mdx 加载 .mdx 模块时会找根目录的这个文件，
// 用它返回的 components 替换默认 h1/h2/p 等元素的渲染。
// 不需要 @mdx-js/react 的 MDXProvider context。

import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
