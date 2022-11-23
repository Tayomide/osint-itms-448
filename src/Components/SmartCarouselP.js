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
  padding: 0.3em;
  border: 1px solid #efefef;
  border-radius: 1em;
`