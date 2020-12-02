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
  "signal-off"
] as const;

export type MDIIcon = typeof mdiIcons[number];
