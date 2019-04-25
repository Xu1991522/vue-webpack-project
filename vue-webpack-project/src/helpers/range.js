const range = (start, end, step) => {
  if (start === end) {
    return [start]
  }

  if (step === 0) {
    throw Error('unexpected step in range(start, end, step) {}, step === 0')
  }

  const desc = start > end

  if (!step) {
    step = desc ? -1 : 1
  }

  if ((desc && step > 0) || (!desc && step < 0)) {
    throw Error('unexpected step in range(start, end, step) {}, start ' + (desc ? '<' : '>') + ' end, but step ' + (desc ? '>' : '<') + ' 0')
  }

  const r = []
  let i = start

  while (true) {
    if ((desc && i < end) || (!desc && i > end)) {
      break
    }

    r.push(i)

    i += step
  }

  return r
}

export default range
