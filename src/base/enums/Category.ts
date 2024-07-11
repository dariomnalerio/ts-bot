export const Category = {
  Utilities: "Utilities",
  Developer: "Developer",
  Fun: "Fun",
} as const;

export type CategoryEnumType = (typeof Category)[keyof typeof Category];
