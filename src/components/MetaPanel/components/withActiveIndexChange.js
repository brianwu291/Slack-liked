import React, { useState } from 'react'

const withActiveIndexChange = Component => props => {
  const [ activeIndex, setActiveIndex ] = useState(0)
  const changeActiveIndex = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }
  return (
    <Component
      {...props}
      activeIndex={activeIndex}
      changeActiveIndex={changeActiveIndex}
    />
  )
}

export default withActiveIndexChange
