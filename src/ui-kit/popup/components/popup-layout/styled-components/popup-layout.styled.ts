import styled, { css } from 'styled-components'

import { Breakpoints } from '@app/tokens'
import { POPUP_DELAY } from '@constants'

export const overlayAnimation = {
  enter: 'overlayEnter',
  enterActive: 'overlayEnterActive',
  exit: 'overlayExit',
  exitActive: 'overlayExitActive',
}

interface TransitionMixinParams {
  duration?: number
  property?: string[] | string
  animation?: string
}

export const contentAnimation = {
  enter: 'contentEnter',
  enterActive: 'contentEnterActive',
  exit: 'contentExit',
  exitActive: 'contentExitActive',
}

const defaultTransition: TransitionMixinParams = {
  duration: POPUP_DELAY,
  property: ['background-color', 'color'],
  animation: 'ease-in-out',
}

export function transitionMixin({ duration, property, animation } = defaultTransition) {
  return css`
    transition-property: ${Array.isArray(property) ? property.join(', ') : property};
    transition-duration: ${duration}ms;
    transition-timing-function: ${animation};
  `
}

export const PopupLayout = styled.div<{ $mounted?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  overflow-x: hidden;

  @media (max-width: ${Breakpoints.DESKTOP}px) {
    padding: 0;
  }

  ${({ $mounted }) => css`
    display: ${$mounted ? 'flex' : 'none'};
  `}

  .${contentAnimation.enter} {
    opacity: 0;
  }

  .${contentAnimation.enterActive} {
    opacity: 1;
    transition: ${transitionMixin({
      duration: POPUP_DELAY,
      property: ['opacity', 'transform'],
    })};
  }

  .${contentAnimation.exit} {
    opacity: 1;
  }

  .${contentAnimation.exitActive} {
    opacity: 0;
    transition: ${transitionMixin({
      duration: POPUP_DELAY,
      property: ['opacity', 'transform'],
    })};
  }

  .${overlayAnimation.enter} {
    opacity: 0;
  }

  .${overlayAnimation.enterActive} {
    transition: ${transitionMixin({
      duration: POPUP_DELAY,
      property: ['opacity'],
    })};
    opacity: 1;
  }

  .${overlayAnimation.exit} {
    opacity: 1;
  }

  .${overlayAnimation.exitActive} {
    transition: ${transitionMixin({
      duration: POPUP_DELAY,
      property: ['opacity'],
    })};
    opacity: 0;
  }
`
