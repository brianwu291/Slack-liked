const setActiveIndex = (titleProps, stateIndex) => {
  const { index } = titleProps
  return stateIndex === index ? -1 : index
}

describe('setActiveIndex', () => {
  it('should return correct index', () => {
    const result = setActiveIndex({ active: false, index: 0 }, 2)
    expect(result).toBe(0)
  })
})
