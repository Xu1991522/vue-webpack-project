import contextmenu from './contextmenu.vue'
// 这里是重点
const Contextmenu = {
  install: function (Vue) {
    Vue.component('Contextmenu', contextmenu)
  }
}

// 导出组件
export default Contextmenu
