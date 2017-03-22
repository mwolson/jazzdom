import abbreviateStackLine from './abbreviate-stack-line'

describe('abbreviateStackLine', () => {
  it('renders stacktrace from error object with filename and line number', () => {
    const stackLine = abbreviateStackLine(new Error())
    expect(stackLine).to.match(/^at.+abbreviate-stack-line\.test\.js:\d+$/gm)
  })

  it('throws when missing first argument', () => {
    expect(() => abbreviateStackLine()).to.throw('expected an Error containing stack as first argument')
  })

  describe('offset argument', () => {
    let nestedError

    function makeNestedError() {
      nestedError = new Error()
    }

    const parseLineNumber = abbrev => Number(abbrev.replace(/^.+:(\d+)$/, '$1'))

    it('applies offset to move up call stack', () => {
      const stackReference = abbreviateStackLine(new Error())
      makeNestedError()
      const stackEarly = abbreviateStackLine(nestedError)
      const stackLate = abbreviateStackLine(nestedError, 1)

      expect(parseLineNumber(stackReference)).to.be.a('number').and.to.be.above(0)
      expect(parseLineNumber(stackEarly)).to.be.below(parseLineNumber(stackReference))
      expect(parseLineNumber(stackLate)).to.be.above(parseLineNumber(stackReference))
    })
  })
})
