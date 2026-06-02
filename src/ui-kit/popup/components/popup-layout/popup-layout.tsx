import { FC, useEffect, useRef, useState } from 'react'

import { clearAllBodyScrollLocks } from 'body-scroll-lock'
import { CSSTransition } from 'react-transition-group'

import { POPUP_DELAY } from '@constants'
import { PopupProps } from '@ui-kit'

import * as S from './styled-components'

export const PopupLayout: FC<PopupProps> = ({ onClose, opened, children, mounted, ...rest }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)
  const root = document.getElementById('root')

  const [animationIn, setAnimationIn] = useState(false)

  useEffect(() => {
    setAnimationIn(opened)

    if (!targetRef.current) return
    if (opened) {
      root!.style.overflow = 'hidden'
    } else {
      root!.style.overflow = ''
    }

    return () => {
      clearAllBodyScrollLocks()
      root!.style.overflow = ''
    }
  }, [opened])

  return (
    <S.PopupLayout ref={targetRef} $mounted={mounted}>
      <CSSTransition
        in={Boolean(animationIn)}
        nodeRef={overlayRef}
        timeout={POPUP_DELAY}
        classNames={S.overlayAnimation}
      >
        <S.PopupOverlay ref={overlayRef} onClick={onClose} />
      </CSSTransition>
      <CSSTransition
        in={Boolean(animationIn)}
        nodeRef={contentRef}
        timeout={POPUP_DELAY}
        classNames={S.contentAnimation}
      >
        <S.PopupContainer {...rest} ref={contentRef}>
          {children}
          <S.PopupClose onClick={onClose} />
        </S.PopupContainer>
      </CSSTransition>
    </S.PopupLayout>
  )
}
