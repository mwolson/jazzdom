import jsdom from 'jsdom'

export function createVirtualConsole(...args) {
  return jsdom.createVirtualConsole(...args)
}
