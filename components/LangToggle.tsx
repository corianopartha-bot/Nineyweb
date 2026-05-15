"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="lang">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          className={locale === l ? "on" : ""}
          aria-label={`Switch to ${l}`}
        >
          {l === "zh" ? "中" : "EN"}
        </button>
      ))}

      <style jsx>{`
        .lang {
          display: inline-flex;
          border: 1px solid var(--line-2);
          border-radius: 99px;
          padding: 2px;
          font-family: var(--mono);
          font-size: 11px;
        }
        button {
          all: unset;
          padding: 4px 10px;
          cursor: none;
          border-radius: 99px;
          color: var(--ink-3);
          letter-spacing: 0.08em;
          transition: background 0.2s, color 0.2s;
        }
        button.on {
          background: var(--acid);
          color: var(--acid-ink);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
