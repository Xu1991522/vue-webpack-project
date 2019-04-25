import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import user from './modules/user'

Vue.use(Vuex)

const production = process.env.NODE_ENV === 'production'

const plugins = production ? [] : [createLogger()]
const strict = !production

const store = new Vuex.Store({
  modules: {
    user
  },
  plugins,
  strict
})

export default store
