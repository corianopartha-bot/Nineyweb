// 极简 Footer：一行版权 + build 标记。
// 不放社交矩阵、不放回到顶部按钮——脊柱已经是导航。

import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-[6] border-t border-[color:var(--color-paper-05)] px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-label text-[color:var(--color-paper-55)] md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="led-blood h-1.5 w-1.5 rounded-full opacity-70" />
          <span>© {year} · {site.name}</span>
        </div>
        <div className="opacity-70">
          Build · {site.role} · 0→1
        </div>
      </div>
    </footer>
  );
}
