import { Notification } from 'element-ui'

import store from '../../store'

import login from '../helpers/login'

const production = process.env.NODE_ENV === 'production'

const error = action => next => (...args) => {
  return next(...args)
    .catch(err => {
      production && console.log('----- error occur ----', err)

      return new Promise((resolve, reject) => {
        const timeout = err.message && err.message.indexOf('session id') > -1

        if (!timeout) {
          return reject(err)
        }

        const user = store.getters.user

        if (!user) {
          return login()
        }

        Notification({
          type: 'warning',
          title: '登录过期',
          message: '2s后您将返回到登录页面'
        })

        setTimeout(login, 2 * 1000)
      })
    })
}

export default error
