import React, { useState, useEffect } from 'react'

import topScrollArrow from '../images/icons/top-scroll-arrow.png'
import bottomScrollArrow from '../images/icons/bottom-scroll-arrow.png'

interface Props {
  scrollId: string
}

const ScrollArrowWrapper: React.FC<Props> = ({ scrollId, children }) => {
  const [showTopScrollArrow, setShowTopScrollArrow] = useState<boolean>(false)
  const [showBottomScrollArrow, setShowBottomScrollArrow] = useState<boolean>(
    false
  )

  //determine wich scrol arrows needs to be displayed on screen
  const handleOnScroll = (e: any) => {
    if (!e) return
    const maxScroll = e.scrollHeight - e.clientHeight
    const scroll = Math.ceil(e.scrollTop)

    if (maxScroll === 0) {
      setShowTopScrollArrow(false)
      setShowBottomScrollArrow(false)
    } else if (scroll < maxScroll) {
      setShowBottomScrollArrow(true)
      setShowTopScrollArrow(scroll > 0)
    } else if (scroll === maxScroll) {
      setShowBottomScrollArrow(false)
    }
  }

  useEffect(() => {
    handleOnScroll(document.getElementById(scrollId))
  })

  const classNameTopScroll = `${showTopScrollArrow ? 'top-scroll-arrow' : 'top-scroll-arrow removing'
    }`
  const classNameBottomScroll = `${showBottomScrollArrow
      ? 'bottom-scroll-arrow'
      : 'bottom-scroll-arrow removing'
    }`

  const scrollTop = () => {
    ; (document as any).getElementById(scrollId).scrollTop = 0
    setShowTopScrollArrow(false)
    setShowBottomScrollArrow(true)
  }

  const scrollBottom = () => {
    ; (document as any).getElementById(scrollId).scrollTop =
      Number.MAX_SAFE_INTEGER
    setShowBottomScrollArrow(false)
    setShowTopScrollArrow(true)
  }

  return (
    <div
      className='scrollWrapper'
      onScroll={(e) => handleOnScroll(e.target)}
      style={{ position: 'relative' }}
    >
      {
        <img
          className={classNameTopScroll}
          src={topScrollArrow}
          alt='topScrollArrow'
          onClick={scrollTop}
        />
      }
      {children}
      {
        <img
          className={classNameBottomScroll}
          src={bottomScrollArrow}
          alt='topScrollArrow'
          onClick={scrollBottom}
        />
      }
    </div>
  )
}

export default ScrollArrowWrapper
