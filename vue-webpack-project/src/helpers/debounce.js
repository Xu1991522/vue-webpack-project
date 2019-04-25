const debounce = delay => fn => {
  let timer

  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(fn, delay, ...args)
  }
}

export default debounce
