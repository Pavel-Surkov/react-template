import { FC, useEffect, useRef, useState } from 'react'

import { clearAllBodyScrollLocks } from 'body-scroll-lock'
import { CSSTransition } from 'react-transition-group'

import { POPUP_DELAY } from '@constants'
import { PopupProps } from '@ui-kit'
import { cn } from '@utils'

import './popup-transitions.css'
import { contentAnimation, overlayAnimation } from './animations'

export const PopupLayout: FC<PopupProps> = ({ onClose, opened, children, mounted, className, ...rest }) => {
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
    <div
      ref={targetRef}
      className={cn(
        'fixed top-0 left-0 z-[1] h-full w-full justify-center items-center overflow-auto overflow-x-hidden py-[30px] max-desktop:p-0',
        mounted ? 'flex' : 'hidden'
      )}
    >
      <CSSTransition in={Boolean(animationIn)} nodeRef={overlayRef} timeout={POPUP_DELAY} classNames={overlayAnimation}>
        <div ref={overlayRef} onClick={onClose} className="fixed inset-0 z-[2] h-full w-full bg-[rgba(0,0,0,0.774)]" />
      </CSSTransition>
      <CSSTransition in={Boolean(animationIn)} nodeRef={contentRef} timeout={POPUP_DELAY} classNames={contentAnimation}>
        <div
          {...rest}
          ref={contentRef}
          className={cn(
            'relative z-[2] m-auto flex w-fit flex-col justify-start rounded-[12rem] bg-popup bg-repeat p-10 [background-size:100%_auto]',
            'max-desktop:w-full max-desktop:min-h-full max-desktop:rounded-none max-desktop:bg-popup-mobile max-desktop:px-2.5 max-desktop:pt-5 max-desktop:pb-10',
            className
          )}
        >
          {children}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              'absolute top-6 right-6 z-[2] m-0 h-8 w-8 cursor-pointer border-none bg-transparent p-0 transition-all duration-300 ease-in-out',
              "before:absolute before:top-1/2 before:left-1/2 before:block before:h-[3.2rem] before:w-full before:bg-white before:content-[''] before:[transform:translateX(-50%)_rotate(45deg)]",
              "after:absolute after:top-1/2 after:left-1/2 after:block after:h-[3.2rem] after:w-full after:bg-white after:content-[''] after:[transform:translateX(-50%)_rotate(-45deg)]",
              'max-desktop:right-2.5 max-desktop:h-4 max-desktop:w-4 max-desktop:before:h-[2px] max-desktop:after:h-[2px]',
              'desktop:hover:opacity-60'
            )}
          />
        </div>
      </CSSTransition>
    </div>
  )
}
