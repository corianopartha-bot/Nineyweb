import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Ticker from "@/components/Ticker";
import Chips from "@/components/Chips";
import TimelineRow, { type TimelineEntry } from "@/components/TimelineRow";
import { projects } from "@/lib/projects";
import { listPostsMeta } from "@/lib/posts";
import { site } from "@/lib/site";
import "./home.css";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const lang = (locale === "en" ? "en" : "zh") as "zh" | "en";

  const ticker = t.raw("ticker") as string[];
  const chips = t.raw("exploringChips") as string[];
  const timeline = t.raw("timeline") as TimelineEntry[];
  const beliefs = t.raw("about.beliefs") as { title: string; body: string }[];
  const posts = (await listPostsMeta(locale)).slice(0, 5);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="kicker">
            <span>Portfolio</span><span className="br" />
            <span>2026 — V.3</span><span className="br" />
            <span className="acc">● Shenzhen · GMT+8</span>
          </div>

          <h1 className="dsp">
            <div className="row"><span>NINE</span><span className="dotMark" /></div>
            <div className="row"><span className="stroke">Y<span className="punct">·</span></span></div>
          </h1>

          <div className="subline">
            <span className="zh-name">Niney</span>
            <span className="role">
              <span className="acc">AI</span> {t("hero.intro")}
            </span>
          </div>

          <div className="body">
            <div className="lines">
              <p>{t("hero.lineA")}</p>
              <p>{t("hero.lineB")}</p>
              <p>{t("hero.lineC")}</p>
            </div>
            <aside className="meta-card">
              <div className="row"><span className="k">Status</span><span className="v acc">{lang === "zh" ? "开放面试 / 合作" : "Open · FT / Collab"}</span></div>
              <div className="row"><span className="k">Domain</span><span className="v">{lang === "zh" ? "AI × 医疗健康" : "AI × Healthcare"}</span></div>
              <div className="row"><span className="k">YOE</span><span className="v">3+ yrs · ToC PM</span></div>
              <div className="row"><span className="k">Site</span><span className="v">{site.domain}</span></div>
              <div className="row"><span className="k">Location</span><span className="v">Shenzhen · CN</span></div>
            </aside>
          </div>

          <div className="chips-wrap">
            <span className="label">→ <span className="acc">{t("home.exploring")}</span></span>
            <Chips items={chips} />
          </div>
        </div>
      </section>

      <Ticker items={ticker} />

      {/* ABOUT */}
      <section className="s" id="about">
        <div className="wrap">
          <div className="sec-head">
            <span className="ix">01</span>
            <h2><span className="zh">{lang === "zh" ? "关于" : "About"}</span> <span className="acc">Niney</span></h2>
            <div className="meta"><span>identity</span><span className="v">/ long-form</span></div>
          </div>

          <div className="about-grid">
            <div className="about-text">
              <p className="intro">{t("about.intro")}</p>
              {(t.raw("about.paragraphs") as string[]).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div>
              <div className="text-eyebrow" style={{ marginBottom: 16 }}>
                // {t("about.beliefsLabel")}
              </div>
              <div className="beliefs">
                {beliefs.map((b, i) => (
                  <div className="belief" key={i}>
                    <div className="n">/ 0{i + 1}</div>
                    <div className="t">{b.title}</div>
                    <div className="d">{b.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE / TIMELINE */}
      <section className="s" id="experience">
        <div className="wrap">
          <div className="sec-head">
            <span className="ix">02</span>
            <h2><span className="zh">{lang === "zh" ? "经历" : "Experience"}</span> · <span className="acc">Timeline</span></h2>
            <div className="meta"><span>{lang === "zh" ? "6 年路径" : "6 years"}</span><span className="v">2021 → now</span></div>
          </div>
          <div className="timeline">
            {timeline.map((row) => (
              <TimelineRow key={row.year} entry={row} variant="home" />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="s" id="projects">
        <div className="wrap">
          <div className="sec-head">
            <span className="ix">03</span>
            <h2><span className="zh">{lang === "zh" ? "代表项目" : "Selected"}</span> · <span className="acc">{lang === "zh" ? "Cases" : "Projects"}</span></h2>
            <div className="meta"><span>{lang === "zh" ? "公开案例 · 更多准备中" : "Public cases · more in prep"}</span></div>
          </div>

          <div className="pj-list">
            {projects.map((p, i) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="pj-row">
                <div className="ix-num">P / 0{i + 1}</div>
                <div>
                  <div className="yr-line">{p.year} · {p.status}</div>
                  <div className="nm">{p.title[lang]}</div>
                  <div className="role-meta">{p.role[lang]}</div>
                  <span className="status-pill">{p.status === "live" ? "LIVE" : "SHIPPED"}</span>
                </div>
                <div className="tagline">{p.tagline[lang]}</div>
                <div className="result">
                  <div className="k">// Result</div>
                  <div className="v">{p.result[lang]}</div>
                </div>
              </Link>
            ))}

            {/* Placeholder for upcoming cases */}
            <div className="pj-row" style={{ opacity: 0.55 }}>
              <div className="ix-num">P / 0{projects.length + 1}</div>
              <div>
                <div className="yr-line">{lang === "zh" ? "2025 / 2026 · 案例准备中" : "2025 / 2026 · case in prep"}</div>
                <div className="nm">{lang === "zh" ? "更多案例正在准备" : "More cases on the way"}</div>
                <div className="role-meta">{lang === "zh" ? "医疗 AI · 产品负责人" : "Healthcare AI · Lead PM"}</div>
                <span className="status-pill" style={{ borderColor: "var(--ink-3)", color: "var(--ink-3)" }}>DRAFT</span>
              </div>
              <div className="tagline">
                {lang === "zh"
                  ? "近两年的 AI × 医疗工作正在脱敏整理中——围绕慢病管理、患者教育、LLM 问诊。如果你想先聊，欢迎直接发邮件。"
                  : "Recent AI × healthcare work is being scrubbed for sharing — chronic care, patient education, LLM consultation. Reach out if you want the early version."}
              </div>
              <div className="result">
                <div className="k">// Status</div>
                <div className="v">{lang === "zh" ? "合规审阅中 · 预计 2026 Q3 上线" : "Under compliance review · expected Q3 2026."}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WRITING */}
      <section className="s" id="writing">
        <div className="wrap">
          <div className="sec-head">
            <span className="ix">04</span>
            <h2><span className="zh">{lang === "zh" ? "精选写作" : "Selected"}</span> · <span className="acc">Writing</span></h2>
            <div className="meta"><span>{posts.length} {lang === "zh" ? "篇" : "posts"}</span><span className="v">on {site.domain}</span></div>
          </div>

          {posts.length === 0 ? (
            <p className="text-eyebrow">// {lang === "zh" ? "还没有发布文章" : "no posts yet"}</p>
          ) : (
            <div className="wr-list">
              {posts.map((p, i) => (
                <Link key={p.slug} href={`/writing/${p.slug}`} className="wr-row">
                  <span className="n">/ 0{i + 1}</span>
                  <span className="date">{p.date}</span>
                  <span className="ttl">
                    {p.title}
                    {p.description && <span className="desc">{p.description}</span>}
                  </span>
                  <span className="tags">
                    {(p.tags ?? []).slice(0, 2).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                  <span className="arr">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-home" id="contact">
        <div className="wrap">
          <div className="kicker"><span>[05] / Contact · {lang === "zh" ? "聊聊" : "Get in touch"}</span></div>
          <h2>
            {lang === "zh"
              ? <><span className="zh">{t("contact.title")}</span><span className="acc">.</span></>
              : <>{t("contact.title").replace(".", "")} <span className="acc">.</span></>}
          </h2>
          <p className="body">{t("contact.body")}</p>
          <div>
            <a className="contact-email" href={`mailto:${site.email}`}>
              {site.email} <span> →</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
