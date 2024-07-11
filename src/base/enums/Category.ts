export const Category = {
  Utilities: "Utilities",
  Developer: "Developer",
} as const;

export type CategoryEnumType = (typeof Category)[keyof typeof Category];
