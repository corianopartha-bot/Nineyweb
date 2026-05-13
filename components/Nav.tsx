"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import LangToggle from "./LangToggle";

const ROUTES = [
  { href: "/", key: "home" },
  { href: "/writing", key: "writing" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/now", key: "now" },
  { href: "/contact", key: "contact" },
] as const;

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--bg)]/75 border-b border-[color:var(--border)]">
      <div className="mx-auto max-w-[var(--container)] px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-mono text-sm tracking-[0.18em] uppercase hover:text-[color:var(--accent)] transition-colors"
        >
          PUYU<span className="text-[color:var(--accent)]">·</span>JIAO
        </Link>

        {/* Primary nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {ROUTES.map((r) => {
            const active =
              r.href === "/"
                ? pathname === "/"
                : pathname.startsWith(r.href);
            return (
              <Link
                key={r.href}
                href={r.href}
                className={cn(
                  "relative font-mono uppercase tracking-[0.14em] text-xs transition-colors",
                  active
                    ? "text-[color:var(--fg)]"
                    : "text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]"
                )}
              >
                {t(r.key)}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[color:var(--accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <LangToggle />
      </div>
    </header>
  );
}
