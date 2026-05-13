import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-3">
        {/* Subscribe */}
        <div className="md:col-span-2">
          <p className="text-eyebrow mb-3">{t("sections.subscribe")}</p>
          <p className="text-display text-2xl md:text-3xl max-w-xl">
            {t("footer.subscribePrompt")}
          </p>
          <form className="mt-6 flex max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="you@somewhere.com"
              className="flex-1 bg-transparent border-b border-[color:var(--border)] focus:border-[color:var(--accent)] outline-none py-2 font-mono text-sm placeholder:text-[color:var(--fg-muted)]"
            />
            <button
              type="submit"
              className="font-mono text-xs uppercase tracking-[0.18em] border border-[color:var(--fg)] px-4 py-2 hover:bg-[color:var(--fg)] hover:text-[color:var(--bg)] transition-colors"
            >
              POST
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--fg-muted)]">
          <Link href="/writing" className="hover:text-[color:var(--fg)]">Writing</Link>
          <Link href="/projects" className="hover:text-[color:var(--fg)]">Projects</Link>
          <Link href="/about" className="hover:text-[color:var(--fg)]">About</Link>
          <Link href="/now" className="hover:text-[color:var(--fg)]">Now</Link>
          <Link href="/contact" className="hover:text-[color:var(--fg)]">Contact</Link>
          <a href="/rss.xml" className="hover:text-[color:var(--fg)]">RSS</a>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pb-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--fg-muted)]">
        <span>© {year} {site.name}. {t("footer.rights")}.</span>
        <span>{site.domain}</span>
      </div>
    </footer>
  );
}
