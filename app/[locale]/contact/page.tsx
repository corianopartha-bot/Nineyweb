import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/lib/site";
import CopyEmail from "@/components/CopyEmail";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-24 pb-32">
      <p className="text-eyebrow mb-6">{t("label")}</p>
      <h1
        className="text-display"
        style={{ fontSize: "var(--step-4)" }}
      >
        {t("title")}
        <span className="text-[color:var(--accent)]">.</span>
      </h1>
      <p className="mt-8 max-w-xl text-lg text-[color:var(--fg-muted)] leading-relaxed">
        {t("body")}
      </p>

      <div className="mt-20 grid md:grid-cols-2 gap-px bg-[color:var(--border)]">
        {/* Email */}
        <div className="bg-[color:var(--bg)] p-8 md:p-10">
          <p className="text-eyebrow mb-4">{t("emailLabel")}</p>
          <a
            href={`mailto:${site.email}`}
            className="text-display text-2xl md:text-3xl underline decoration-[color:var(--accent)] decoration-2 underline-offset-[6px] hover:text-[color:var(--accent)] transition-colors break-all"
          >
            {site.email}
          </a>
          <div className="mt-4">
            <CopyEmail email={site.email} />
          </div>
        </div>

        {/* GitHub */}
        <div className="bg-[color:var(--bg)] p-8 md:p-10">
          <p className="text-eyebrow mb-4">{t("githubLabel")}</p>
          <a
            href={site.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-display text-2xl md:text-3xl underline decoration-[color:var(--accent)] decoration-2 underline-offset-[6px] hover:text-[color:var(--accent)] transition-colors"
          >
            @corianopartha-bot ↗
          </a>
        </div>
      </div>
    </section>
  );
}
