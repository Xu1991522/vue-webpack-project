// import mock from './mock'

// export default mock

import generate from './helpers/generate'

import remote from './middlewares/remote'
import error from './middlewares/error'
import tap from './middlewares/tap'

import usrconf from './portal-usr/config'
import srvconf from './portal-srv/config'

const usr = generate(usrconf.urls)
const srv = generate(srvconf.urls)

const production = process.env.NODE_ENV === 'production'
const middlewares = production ? [error] : [tap, error]

usr.use(...middlewares, remote(usrconf.prefix))
srv.use(...middlewares, remote(srvconf.prefix))

const api = {
  ...usr,
  ...srv
}

export default api
