export const site = {
  name: "PUYUJIAO",
  domain: "pyj9.com",
  url: "https://pyj9.com",
  author: "PUYUJIAO",
  email: "hi@pyj9.com",
  social: {
    x: "",
    github: "",
    linkedin: "",
    wechat: "",
  },
  // newsletter
  newsletter: {
    provider: "buttondown" as const,
    // Will be wired up in S2; set to your Buttondown username later.
    username: "",
  },
} as const;
