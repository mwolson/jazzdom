import stackTrace from 'stack-trace'

export default function abbreviateStackLine(err, offset=0) {
  if (!err) throw new Error('expected an Error containing stack as first argument')
  const trace = stackTrace.parse(err)[offset]

  return `at ${trace.getFileName()}:${trace.getLineNumber()}`
}
