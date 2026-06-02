import styled from 'styled-components'

import { Breakpoints, Colors } from '@app/tokens'

export const PopupClose = styled.button`
  position: absolute;
  top: 24rem;
  right: 24rem;

  width: 32rem;
  height: 32rem;

  z-index: 2;

  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.4s ease-in-out;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;

    width: 100%;
    height: 3.2rem;
    background-color: ${Colors.WHITE};

    transition-property: transform;
    transform: translateX(-50%) rotate(45deg);

    @media (max-width: ${Breakpoints.DESKTOP}px) {
      height: 2px;
    }
  }

  &::after {
    transform: translateX(-50%) rotate(-45deg);
  }

  @media (max-width: ${Breakpoints.DESKTOP}px) {
    width: 16rem;
    height: 16rem;
    right: 10rem;
  }

  &:hover,
  &:focus {
    @media (min-width: ${Breakpoints.DESKTOP}px) {
      opacity: 0.6;
    }
  }
`
