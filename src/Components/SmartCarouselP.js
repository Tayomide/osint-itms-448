import React from 'react'
import styled from 'styled-components'

export const SmartCarouselP = ({name, value}) => {
  return (
    <Container>{name}: {value}</Container>
  )
}

const Container = styled.p`
  width: max-content;
  height: max-content;
  text-transform: capitalize;
  padding: 0.3em 0.7em;
  border-radius: 1em;
  background-color: var(--default-color);
  box-shadow: 0px 1px 3px 1px #00000010;
`