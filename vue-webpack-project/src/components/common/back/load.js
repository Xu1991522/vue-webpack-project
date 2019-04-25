import back from './back.vue'
// 这里是重点
const BackButton = {
  install: function (Vue) {
    Vue.component('BackButton', back)
  }
}

// 导出组件
export default BackButton
