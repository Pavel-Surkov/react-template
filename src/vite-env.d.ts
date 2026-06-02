/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  const content: string
  export default content
}

// declare module '*.svg?react' {
//   import React = require('react')
//   export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
//   const src: string
//   export default src
// }

declare module '*.png'
declare module '*.jpeg'
declare module '*.jpg'
