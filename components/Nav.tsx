"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";

const ROUTES = [
  { href: "/", key: "home", n: "01" },
  { href: "/about", key: "about", n: "02" },
  { href: "/projects", key: "projects", n: "03" },
  { href: "/writing", key: "writing", n: "04" },
  { href: "/now", key: "now", n: "05" },
  { href: "/contact", key: "contact", n: "06" },
] as const;

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="topbar">
      <div className="wrap">
        <Link href="/" className="brand">
          <span className="glyph">9</span>
          <span className="meta">
            <b>NINE·Y</b> <span className="slash">/</span> pyj9.com
          </span>
        </Link>

        <nav className="primary">
          {ROUTES.map((r) => {
            const active =
              r.href === "/" ? pathname === "/" : pathname.startsWith(r.href);
            return (
              <Link key={r.href} href={r.href} className={active ? "on" : ""}>
                <span className="n">{r.n}</span>
                {t(r.key)}
              </Link>
            );
          })}
        </nav>

        <div className="right">
          <span className="status">
            <span className="dot" />
            <span>Online</span>
          </span>
          <ThemeToggle />
          <LangToggle />
        </div>
      </div>

      <style jsx>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: color-mix(in srgb, var(--bg) 72%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--line);
        }
        .wrap {
          max-width: var(--container);
          margin: 0 auto;
          padding: 14px 48px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 24px;
          align-items: center;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .brand :global(.glyph) {
          width: 28px;
          height: 28px;
          background: var(--acid);
          color: var(--acid-ink);
          display: grid;
          place-items: center;
          font-weight: 700;
          font-family: var(--mono);
          font-size: 14px;
          letter-spacing: 0;
        }
        .brand :global(.meta) {
          color: var(--ink-3);
        }
        .brand :global(.meta b) {
          color: var(--ink);
          font-weight: 500;
        }
        .brand :global(.slash) {
          color: var(--ink-4);
        }
        .primary {
          display: flex;
          gap: 4px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .primary :global(a) {
          padding: 6px 12px;
          border: 1px solid transparent;
          border-radius: 99px;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--ink-2);
          text-decoration: none;
        }
        .primary :global(a:hover),
        .primary :global(a.on) {
          border-color: var(--line-2);
          color: var(--acid);
        }
        .primary :global(a .n) {
          color: var(--ink-4);
          font-size: 9px;
        }
        .right {
          display: flex;
          gap: 14px;
          justify-content: flex-end;
          align-items: center;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-2);
        }
        .status .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--acid);
          box-shadow: 0 0 10px var(--acid);
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse { 50% { opacity: 0.35; } }
        @media (max-width: 1024px) {
          .wrap { padding: 12px 24px; }
          .primary { display: none; }
        }
      `}</style>
    </header>
  );
}
