export default function Chips({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((c) => (
        <li
          key={c}
          className="border border-[color:var(--border)] px-3 py-1 text-xs font-mono uppercase tracking-[0.12em] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors"
        >
          {c}
        </li>
      ))}
    </ul>
  );
}
