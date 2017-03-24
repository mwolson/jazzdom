# jazzdom

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM][npm-image]][npm-url]

Promisified jsdom setup and teardown for your test runner.

Inspired from, and wraps, [jsdom-global](https://github.com/rstacruz/jsdom-global).
Depends on [jsdom](https://github.com/tmpvar/jsdom).

## Install

```sh
yarn add -D jazzdom jsdom jsdom-global
```

## Setup

**Setting up and tearing down for tests that need a document object**

```js
import jazzdom from 'jazzdom'

describe('some tests', () => {
    before(() => jazzdom.create())
    after(() => jazzdom.destroy())
    // ... test content here
}
```

**Global setup line for test/mocha.opts**

```js
--require jazzdom/register
```

## Example

In your mocha tests:

```js
import React from 'react'
import { mount, shallow } from 'enzyme'
import jazzdom from 'jazzdom'

describe('Example', () => {
  const Parent = ({ children }) => <div className="parent">{children}</div>

  describe('without jazzdom integration', () => {
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
```

## Best practices

* If you trust your tests to clean up after themselves, you may wish to call `require ('jazzdom/register')` only once across your entire test suite, since that may result in speed improvements.
* It can be good to separate fast and slow tests. "slow" tests would require `jazzdom.create()`, or other expensive tasks, and "fast" tests would not. Name them with slightly different patterns, and have two different test rules in `package.json` to call each suite. Prefer to have more fast tests and less slow tests. Instead of making multiple slow tests, consider making one slow test and spies for the remaining tests, if that makes sense for the situation.
* Try to call `jazzdom.create()` and `jazzdom.destroy()` only when they're needed, such as with `enzyme.mount()`, and omit them with `enzyme.shallow()` and `enzyme.render()`.
* It's almost never a good idea to put `jazzdom.create()` and `jazzdom.destroy()` in a `beforeEach()` or `afterEach()` block. Prefer `before()` and `after()` blocks, or in dedicated `it()` blocks if your test runner doesn't support `before`/`after`.

## Additional features compared to jsdom-global

* Returns promises in separate `create()` and `destroy()` functions
* Automatically routes `console` output from `<script>` tags into the standard node.js `console` object
* Waits for jsdom `created` event to be fired before fulfilling or rejecting promise
* If you forgot to `destroy()` the previous setup, the next `create()` call will throw an error that points to the previous invocation

## License

MIT

[travis-image]: https://travis-ci.org/mwolson/jazzdom.svg?branch=master
[travis-url]: https://travis-ci.org/mwolson/jazzdom

[coveralls-image]: https://coveralls.io/repos/github/mwolson/jazzdom/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/mwolson/jazzdom?branch=master

[npm-image]: https://img.shields.io/npm/v/jazzdom.svg
[npm-url]: https://www.npmjs.com/package/jazzdom
