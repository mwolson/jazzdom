import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import td from 'testdouble'
import tdChai from 'testdouble-chai'

chai.use(chaiEnzyme())
chai.use(tdChai(td))

chai.config.includeStack = true
chai.config.showDiff = false
global.expect = chai.expect

// if any unhandled rejections happen in promises, treat them as fatal errors
process.on('unhandledRejection', function(err) {
  throw err
})

// if there are any PropType warnings from React, treat them as fatal errors
const realLogger = console.error
console.error = function error(...args) {
  const msg = args.join(' ')
  if (~msg.indexOf('Failed prop type')) {
    throw new Error(msg)
  } else {
    return realLogger(...args)
  }
}
