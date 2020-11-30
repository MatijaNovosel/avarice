const mdiIcons = [
  "credit-card",
  "wallet",
  "credit-card-outline",
  "currency-eur",
  "sigma"
] as const;

export type MDIIcon = typeof mdiIcons[number];
