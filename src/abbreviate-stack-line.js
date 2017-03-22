import stackTrace from 'stack-trace'

export default function abbreviateStackLine(err, offset=0) {
  if (!err) throw new Error('err argument containing stack was not provided')
  const trace = stackTrace.parse(err)[offset]

  return `at ${trace.getFileName()}:${trace.getLineNumber()}`
}
