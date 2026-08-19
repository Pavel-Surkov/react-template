/* eslint-disable @typescript-eslint/no-explicit-any */

export type WithRequired<T extends Record<string, any>, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
