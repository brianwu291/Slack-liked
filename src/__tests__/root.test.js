import React from 'react'
import { shallow } from 'enzyme'
import Root from '../Root'


it('can render three component when loading is false', () => {
  let wrapper = shallow(<Root isLoading={false} />)
  expect(wrapper.get(0).props.children.length).toBe(3)
})

it('can render three component when loading is true', () => {
  let wrapper = shallow(<Root isLoading={true} />)
  expect(wrapper.get(0).props.children).toBe(undefined)
})