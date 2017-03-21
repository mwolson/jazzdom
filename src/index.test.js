import React from 'react'
import { mount, shallow } from 'enzyme'
import jazzdom from './'

describe('jazzdom', () => {
  const Parent = ({ children }) => <div className="parent">{children}</div>

  describe('before integration', () => {
    it('shallow renders without need of jsdom', () => {
      const wrapper = shallow(
        <Parent><div className="child" /></Parent>
      )
      expect(wrapper.find('div.child')).to.exist
    })
  })

  describe('with basic integration', () => {
    before(() => jazzdom.create())
    after(() => jazzdom.destroy())

    it('mounts with the help of jsdom', () => {
      const wrapper = mount(
        <Parent><div className="child" /></Parent>
      )
      expect(wrapper.find('div.child')).to.exist
    })
  })
})
