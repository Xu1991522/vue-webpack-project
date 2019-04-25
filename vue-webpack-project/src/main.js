import Vue from 'vue'

import ElementUI from 'element-ui'

import './element-variables.scss'
import './styles/index.scss'

import App from './App.vue'
import store from './store'
import router from './router'

// 全局组件
import plusbutton from './components/common/plus/load' // 添加按钮
import searchbutton from './components/common/search/load' // 搜索按钮
import backButton from './components/common/back/load' // 返回按钮
import contextmenu from './components/common/contextmenu/load' // 右键表格显示列表
Vue.use(plusbutton)
Vue.use(searchbutton)
Vue.use(backButton)
Vue.use(contextmenu)

Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false

const vm = new Vue({
  store,
  router,
  render: h => h(App)
})

vm.$mount('#app')
