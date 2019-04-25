if (typeof JSON === 'undefined' || !JSON.stringify || !JSON.parse) {
  throw new Error('a high version of JSON is required when request, please add a JSON polyfill - see https://json.org')
}

if (typeof Promise === 'undefined') {
  throw new Error(
    'Promise is required when request, please add a Promise polyfill - ' +
    'see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'
  )
}

const request = function (url, params) {
  if (typeof params !== 'object') {
    throw new Error(
      'Request to ' +
        url +
        ', params expected to be an object, but received type: ' +
        typeof params
    )
  }

  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(params)

    const xhr = new XMLHttpRequest()

    xhr.open('POST', url, true)

    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText)

          const code = res.c

          if (code !== 0) {
            const err = {
              code: code,
              exception: res.d.e,
              message: res.d.m
            }

            return reject(err)
          }

          const data = res.d

          resolve(data)
        } else {
          const netError = {
            code: 2000,
            message: xhr.responseText || '网络异常'
          }

          reject(netError)
        }
      }
    }

    xhr.send(payload)
  })
}

export default request
