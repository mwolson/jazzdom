import * as jsdom from './jsdom'
import * as jsdomGlobal from './jsdom-global'
import abbreviateStackLine from './abbreviate-stack-line'

const defaultDestroyFn = () => {}
let destroyFn = defaultDestroyFn
let firstStackLine

export const destroy = () => Promise.resolve().then(() => {
  destroyFn()
  destroyFn = defaultDestroyFn
})

export function create(html, { virtualConsole, created, ...restOptions }={}) {
  if (destroyFn === defaultDestroyFn) {
    firstStackLine = abbreviateStackLine(new Error(), 1)
  } else {
    throw new Error(`previous create() called without a matching destroy() ${firstStackLine}`)
  }

  return new Promise((resolve, reject) => {
    destroyFn = jsdomGlobal.create(html, {
      virtualConsole: virtualConsole || jsdom.createVirtualConsole().sendTo(console),
      created: (err, window) => {
        err ? reject(err) : resolve(window)
        created && created(err, window)
      },
      ...restOptions,
    })
  })
}

export default { create, destroy }
