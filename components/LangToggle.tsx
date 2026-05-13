"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export default function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em]">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => router.replace(pathname, { locale: l })}
            className={cn(
              "px-1 py-0.5 transition-colors",
              locale === l
                ? "text-[color:var(--accent)]"
                : "text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]"
            )}
            aria-label={`Switch to ${l}`}
          >
            {l}
          </button>
          {i < routing.locales.length - 1 && (
            <span className="text-[color:var(--fg-muted)]/40">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
