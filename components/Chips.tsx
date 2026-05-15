export default function Chips({ items }: { items: readonly string[] }) {
  return (
    <ul className="chips">
      {items.map((c) => (
        <li key={c} className="chip">
          {c}
        </li>
      ))}

      <style>{`
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .chip {
          font-family: var(--mono);
          font-size: 12px;
          padding: 7px 14px;
          border: 1px solid var(--line-2);
          border-radius: 99px;
          color: var(--ink-2);
          letter-spacing: 0.04em;
          transition: all 0.2s;
        }
        .chip:hover {
          border-color: var(--acid);
          color: var(--acid);
        }
      `}</style>
    </ul>
  );
}
