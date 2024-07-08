export const Category = {
  Utilities: 'Utilities',
} as const;

export type CategoryEnumType = typeof Category[keyof typeof Category];