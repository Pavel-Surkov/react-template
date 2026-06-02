export const Colors = {
  WHITE: '#ffffff',
  BLACK: '#000000',
}

export type ColorT = (typeof Colors)[keyof typeof Colors]
