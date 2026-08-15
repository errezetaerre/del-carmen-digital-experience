export const colors = {
  background: "#0B0B0B",
  surface: "#111111",
  surfaceDeep: "#090908",
  surfaceIvory: "#F4F1EC",

  text: "#F5F5F5",
  textMuted: "#A1A1AA",
  textCharcoal: "#2F2E2C",

  border: "rgba(255,255,255,0.08)",

  bronze: "#A27B48",
  gold: "#C9A35A",

  success: "#6B7B5B",
  error: "#A25A45",
} as const;

export const typography = {
  fonts: {
    display: "var(--font-cormorant)",
    body: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
  },

  bodyMaxWidth: "42rem",

  tracking: {
    heading: "0.01em",
    navigation: "0.12em",
    label: "0.30em",
    brand: "0.25em",
    button: "0.28em",
  },
} as const;

export const layout = {
  contentWidth: "80rem",
  contentWidthWide: "90rem",
} as const;

export const motion = {
  duration: {
    fast: 300,
    medium: 500,
    slow: 700,
  },
} as const;

export const shadows = {
  artwork: "0 40px 100px rgba(0,0,0,0.7)",
} as const;