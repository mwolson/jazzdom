# jazzdom

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM][npm-image]][npm-url]

Promisified jsdom setup and teardown for your test runner.

## Install

```sh
yarn add -D jazzdom jsdom jsdom-global
```

## Setup

```js
import jazzdom from 'jazzdom'
```

## Example

In your mocha tests:

```js
import React from 'react'
import { mount, shallow } from 'enzyme'
import jazzdom from 'jazzdom'

describe('Example', () => {
  const Parent = ({ children }) => <div className="parent">{children}</div>

  before(() => jazzdom.create())
  after(() => jazzdom.destroy())

  it('shallow renders without need of jsdom', () => {
    const wrapper = shallow(
      <Parent><div className="child" /></Parent>
    )
    expect(wrapper.find('div.child')).to.exist
  })

  it('mounts with the help of jsdom', () => {
    const wrapper = mount(
      <Parent><div className="child" /></Parent>
    )
    expect(wrapper.find('div.child')).to.exist
  })
})
```

## Additional features compared to jsdom-global

* Returns promises in separate `create()` and `destroy()` functions
* Waits for jsdom `created` event to be fired before fulfilling or rejecting promise
* If you forgot to `destroy()` the previous setup, `create()` does it for you automatically

## License

MIT

[travis-image]: https://travis-ci.org/mwolson/jazzdom.svg?branch=master
[travis-url]: https://travis-ci.org/mwolson/jazzdom

[coveralls-image]: https://coveralls.io/repos/github/mwolson/jazzdom/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/mwolson/jazzdom?branch=master

[npm-image]: https://img.shields.io/npm/v/jazzdom?style=flat
[npm-url]: https://www.npmjs.com/package/jazzdom
