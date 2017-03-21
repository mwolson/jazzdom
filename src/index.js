import jsdom from 'jsdom'
import jsdomGlobal from 'jsdom-global'

const defaultDestroyFn = () => {}
let destroyFn = defaultDestroyFn

export const destroy = () => Promise.resolve().then(() => {
  destroyFn()
  destroyFn = defaultDestroyFn
})

export function create(html, { virtualConsole, created, ...restOptions }={}) {
  return Promise.resolve().then(() => {
    return destroyFn !== defaultDestroyFn ? destroy() : Promise.resolve()
  })
  .then(() => new Promise((resolve, reject) => {
    destroyFn = jsdomGlobal(html, {
      virtualConsole: virtualConsole || jsdom.createVirtualConsole().sendTo(console),
      created: (err, window) => {
        err ? reject(err) : resolve(window)
        created && created(err, window)
      },
      ...restOptions,
    })
  }))
}

export default { create, destroy }
