import styled from 'styled-components'

import { Breakpoints } from '@app/tokens'
export const PopupContainer = styled.div`
  position: relative;
  z-index: 2;

  padding: 40rem;
  margin: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  background: #0d1a2a repeat;
  background-size: 100% auto;

  width: fit-content;
  min-height: auto;
  overflow: unset;
  border-radius: 12rem;

  @media (max-width: ${Breakpoints.DESKTOP}px) {
    background: #01203d;
    padding: 20rem 10rem 40rem;
    width: 100%;
    min-height: 100%;
    border-radius: 0;
  }
`
