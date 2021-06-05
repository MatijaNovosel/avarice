const Alignment = ["left", "center", "right"] as const;
const Currency = ["HRK", "EUR", "USD"] as const;
const GqlRequestType = ["query", "mutation"] as const;

export type Alignment = typeof Alignment[number];
export type Currency = typeof Currency[number];
export type GqlRequestType = typeof GqlRequestType[number];
