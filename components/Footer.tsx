import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="wrap">
        <span>
          © {year} NINE·Y · {t("footer.rights")} · {site.domain}
        </span>
        <span className="center">SET IN SPACE GROTESK / JETBRAINS MONO / NOTO SANS SC</span>
        <span className="right">
          v3.0 · designed by hand, AI in the loop · <a href="#top">↑ TOP</a>
        </span>
      </div>

      <style>{`
        .foot {
          padding: 32px 0 40px;
          border-top: 1px solid var(--line);
          margin-top: 0;
        }
        .foot .wrap {
          max-width: var(--container);
          margin: 0 auto;
          padding: 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          align-items: center;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--ink-3);
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .foot .center { text-align: center; }
        .foot .right { text-align: right; }
        .foot a:hover { color: var(--acid); }
        @media (max-width: 1024px) {
          .foot .wrap { grid-template-columns: 1fr; padding: 0 24px; }
          .foot .center, .foot .right { text-align: left; }
        }
      `}</style>
    </footer>
  );
}
