const mdiIcons = [
  "credit-card",
  "wallet",
  "credit-card-outline",
  "currency-eur",
  "sigma",
  "google",
  "eye",
  "eye-off",
  "dots-horizontal",
  "signal-cellular-3",
  "signal-off",
  "facebook",
  "cog",
  "chevron-down",
  "check-circle",
  "home",
  "clock",
  "scale",
  "shield-check",
  "bell-outline",
  "piggy-bank",
  "bank-transfer-in",
  "bank-transfer-out",
  "swap"
] as const;

const Alignment = ["left", "center", "right"] as const;

export type MDIIcon = typeof mdiIcons[number];
export type Alignment = typeof Alignment[number];
