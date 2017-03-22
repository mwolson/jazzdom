const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const td = require('testdouble')
const tdChai = require('testdouble-chai')

chai.use(chaiAsPromised)
chai.use(tdChai(td))

chai.config.includeStack = true
chai.config.showDiff = false
global.expect = chai.expect

// if any unhandled rejections happen in promises, treat them as fatal errors
process.on('unhandledRejection', function(err) {
  throw err
})
