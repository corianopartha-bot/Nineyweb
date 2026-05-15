import { Link } from "@/i18n/navigation";

export type TimelineEntry = {
  year: string;
  role: string;
  desc: string;
  slug?: string;
};

export default function TimelineRow({
  entry,
}: {
  entry: TimelineEntry;
  variant?: "about" | "home";
}) {
  const Wrap: React.ElementType = entry.slug ? Link : "div";
  const wrapProps = entry.slug ? { href: `/projects/${entry.slug}` } : {};
  return (
    <Wrap {...wrapProps} className="tl-row">
      <span className="yr">{entry.year}</span>
      <span className="role">{entry.role}</span>
      <span className="desc">{entry.desc}</span>
      <span className="arr">{entry.slug ? "→" : "·"}</span>
    </Wrap>
  );
}
