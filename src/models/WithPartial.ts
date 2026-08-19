/* eslint-disable @typescript-eslint/no-explicit-any */

export type WithPartial<T extends Record<string, any>, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
