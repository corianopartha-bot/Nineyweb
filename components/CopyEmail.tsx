"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check } from "lucide-react";

export default function CopyEmail({ email }: { email: string }) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] transition-colors"
      aria-label={t("copyEmail")}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? t("copied") : t("copyEmail")}
    </button>
  );
}
