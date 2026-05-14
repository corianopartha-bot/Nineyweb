import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

export type TimelineEntry = {
  year: string;
  role: string;
  desc: string;
  slug?: string;
};

export default function TimelineRow({
  entry,
  variant = "about",
}: {
  entry: TimelineEntry;
  variant?: "about" | "home";
}) {
  const grid =
    variant === "home"
      ? "md:grid-cols-[88px_minmax(0,1fr)_minmax(0,1.4fr)_auto]"
      : "md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1.6fr)_auto]";

  const inner = (
    <>
      <span className="font-mono text-sm text-[color:var(--accent)] tracking-wider">
        {entry.year}
      </span>
      <h3 className={variant === "home" ? "text-display text-xl md:text-2xl" : "text-display text-xl md:text-2xl"}>
        {entry.role}
      </h3>
      <p className="text-[color:var(--fg-muted)]">{entry.desc}</p>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--fg-muted)] flex items-center gap-1 justify-self-end">
        {entry.slug ? (
          <>
            CASE
            <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        ) : (
          ""
        )}
      </span>
    </>
  );

  const baseClasses = `grid items-baseline gap-4 py-7 border-b border-[color:var(--border)] last:border-0 ${grid}`;

  if (entry.slug) {
    return (
      <li>
        <Link
          href={`/projects/${entry.slug}`}
          className={`${baseClasses} group transition-colors hover:bg-[color:var(--paper-deep)] -mx-3 px-3 rounded-sm`}
        >
          {inner}
        </Link>
      </li>
    );
  }
  return <li className={baseClasses}>{inner}</li>;
}
