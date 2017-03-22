import React from 'react'
import { mount, shallow } from 'enzyme'
import td from 'testdouble'
import abbreviateStackLine from './abbreviate-stack-line'
import jazzdom from './'
import * as jsdom from './jsdom'
import * as jsdomGlobal from './jsdom-global'

describe('jazzdom', () => {
  const Parent = ({ children }) => <div className="parent">{children}</div>

  describe('without jazzdom integration', () => {
    it('shallow renders without need of jsdom', () => {
      const wrapper = shallow(
        <Parent><div className="child" /></Parent>
      )
      expect(wrapper.find('div.child')).to.exist
      expect(global.document).to.be.undefined
    })
  })

  describe('with basic integration', () => {
    before(() => jazzdom.create().then(() => expect(global.document).to.be.ok))
    after(() => jazzdom.destroy().then(() => expect(global.document).to.be.undefined))

    it('mounts with the help of jsdom', () => {
      const wrapper = mount(
        <Parent><div className="child" /></Parent>
      )
      expect(wrapper.find('div.child')).to.exist
    })
  })

  describe('when create() is called multiple times', () => {
    let firstStackLine

    after(() => jazzdom.destroy())

    it('records stacktrace to first instance', () => {
      return jazzdom.create().then(() => (firstStackLine = abbreviateStackLine(new Error())))
        .then(() => expect(firstStackLine).to.match(/^at.+index.test.js:\d+$/))
    })

    function expectCreateToThrowError() {
      expect(() => jazzdom.create())
        .to.throw(`create() called without a matching destroy() ${firstStackLine}`)
    }

    it('throws an error pointing to the first instance when called again', () => expectCreateToThrowError())
    it('when called a third time, still points to the first instance', () => expectCreateToThrowError())
  })

  describe('when destroy() is called multiple times', () => {
    before(() => jazzdom.create().then(() => jazzdom.destroy()))
    it('does nothing', () => jazzdom.destroy())
  })

  describe('when given arguments', () => {
    afterEach(() => jazzdom.destroy())

    it('calls "created" callback', () => {
      const created = td.function()
      return jazzdom.create(null, { created })
        .then(() => expect(created).to.have.been.calledOnce)
    })

    it('passes given HTML', () => {
      const trim = str => str.replace(/[ \t]*\n[ \t]*/g, '')
      const outerHTML = trim(`
<html>
<head></head>
<body><p>Hi</p>
</body>
</html>
`)
      const html = `<!doctype html>${outerHTML}`

      return jazzdom.create(html)
        .then(() => expect(trim(global.document.documentElement.outerHTML)).to.include('<p>Hi</p>'))
    })
  })

  describe('calls to jsdom-global', () => {
    const fakeWindow = 'a window'
    const sendToValue = 'sendToValue'
    let options, destroyFn, sendTo

    beforeEach(() => {
      options = td.matchers.captor()
      destroyFn = td.function()
      td.replace(jsdomGlobal, 'create')
      td.when(jsdomGlobal.create(td.matchers.anything(), options.capture())).thenReturn(destroyFn)

      sendTo = td.function()
      td.replace(jsdom, 'createVirtualConsole')
      td.when(jsdom.createVirtualConsole()).thenReturn({ sendTo })
      td.when(sendTo(td.matchers.anything())).thenReturn(sendToValue)
    })

    afterEach(() => jazzdom.destroy().then(() => td.verify(destroyFn())))
    afterEach(() => td.reset())

    it('rejects the promise when a jsdom error occurs', () => {
      const err = new Error('test')
      const promise = jazzdom.create()
      options.value.created(err)

      return expect(promise).to.be.rejectedWith(err)
    })

    it('creates a virtual console if none is passed', () => {
      const promise = jazzdom.create()
      options.value.created(null, fakeWindow)
      expect(sendTo).to.be.called
      expect(options.value.virtualConsole).to.equal(sendToValue)

      return expect(promise).to.eventually.equal(fakeWindow)
    })

    it('does not create a virtual console if one is passed', () => {
      const promise = jazzdom.create(null, { virtualConsole: 'created by caller' })
      options.value.created(null, fakeWindow)
      expect(sendTo).not.to.be.called
      expect(options.value.virtualConsole).to.equal('created by caller')

      return expect(promise).to.eventually.equal(fakeWindow)
    })
  })
})
