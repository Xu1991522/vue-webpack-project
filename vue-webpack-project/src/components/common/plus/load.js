import plus from './plus.vue'
// 这里是重点
const PlusButton = {
  install: function (Vue) {
    Vue.component('PlusButton', plus)
  }
}

// 导出组件
export default PlusButton
