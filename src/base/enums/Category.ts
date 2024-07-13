export const Category = {
  Utilities: "Utilities",
  Developer: "Developer",
  Fun: "Fun",
  Admin: "Admin",
} as const;

export type CategoryEnumType = (typeof Category)[keyof typeof Category];
