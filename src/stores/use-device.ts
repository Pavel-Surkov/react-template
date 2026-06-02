import debounce from 'lodash/debounce'
import { create } from 'zustand'

import { Breakpoints } from '@tokens'

interface DeviceStore {
  isMobile: boolean
}

const checkIsMobile = () => window.innerWidth < Breakpoints.DESKTOP

export const useDeviceStore = create<DeviceStore>((set) => {
  const handleWindowResize = debounce(() => {
    set({ isMobile: checkIsMobile() })
  }, 200)

  window.addEventListener('resize', handleWindowResize)

  return { isMobile: checkIsMobile() }
})
