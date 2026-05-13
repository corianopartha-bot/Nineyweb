import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en"],
  defaultLocale: "zh",
  // `/` => zh, `/en/...` => en
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
