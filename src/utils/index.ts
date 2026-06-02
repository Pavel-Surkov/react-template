export type ClassValue = string | false | null | undefined

/** Join truthy class names into a single space-separated string. */
export const cn = (...classes: ClassValue[]): string => classes.filter(Boolean).join(' ')
