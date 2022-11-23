import { useEffect, useState } from 'react'
import { useRef} from 'react'
import styled from 'styled-components'
import { SmartCarouselChild } from './SmartCarouselChild'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


export const SmartCarousel = ({list, type}) => {
  const CarouselRef = useRef()
  const [gap, setGap] = useState()
  const [overflow, setOverflow] = useState(false)
  // document.querySelector(".nzDta").scrollWidth > document.querySelector(".nzDta").clientWidth
  const scrollLeft = (e) => {
    CarouselRef.current.scrollTo({
      left: CarouselRef.current.scrollLeft + gap,
      behavior: 'smooth'
    })
  }
  const scrollRight = (e) => {
    CarouselRef.current.scrollTo({
      left: CarouselRef.current.scrollLeft - gap,
      behavior: 'smooth'
    })
  }
  useEffect(() => {
    const tempVariable = CarouselRef.current
    if(CarouselRef.current && CarouselRef.current.scrollWidth > CarouselRef.current.clientWidth)setOverflow(true)
    if(tempVariable && tempVariable.childNodes && tempVariable.childNodes.length > 0)setGap(tempVariable?.childNodes[1].offsetWidth)
  }, [])
  return (
    <Container ref={CarouselRef} className={!overflow?"pad":""}>
      {overflow && <button className="arrow left" onClick={scrollRight}>
        <ChevronLeftIcon sx={{
          width:"35px",
          height:"35px"
        }}/>
      </button>}
      {
        list.map((item, idx)=> <SmartCarouselChild obj={item} key={idx} type={type} />)
      }
      {overflow && <button className="arrow right" onClick={scrollLeft}>
        <ChevronRightIcon sx={{
          width:"35px",
          height:"35px"
        }}/>
      </button>}
    </Container>
  )
}

const Container = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: max-content;
  overflow-x: scroll;
  width: 100%;
  /* Hide Scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;
  &.pad{
    padding: 0 2.5em;
  }
  button{
    color: inherit
  }
  .arrow{
    align-items: center;
    background-color: #ffffff;
    display: flex;
    height: auto;
    padding: 0 1em;
  }
  .left{
    position: sticky;
    left: 0;
  }
  .right{
    position: sticky;
    right: 0;
  }
`
