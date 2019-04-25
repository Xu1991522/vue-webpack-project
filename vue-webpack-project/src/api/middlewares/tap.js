const tap = action => next => (...args) => {
  console.log('%c [Request] ' + action + ' <- ', 'color: #f2711c; font-weight: 400', ...args)

  return next(...args).then(
    res => {
      console.log('%c [Response] ' + action + ' -> ', 'color: #f2711c; font-weight: 400', res)

      return res
    },
    err => {
      console.log('%c [Response] ' + action + ' -> ', 'color: #f2711c; font-weight: 400', err)

      return Promise.reject(err)
    }
  )
}

export default tap
