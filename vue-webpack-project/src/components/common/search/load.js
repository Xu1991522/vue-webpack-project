import search from './search.vue'
// 这里是重点
const SearchButton = {
  install: function (Vue) {
    Vue.component('SearchButton', search)
  }
}

// 导出组件
export default SearchButton
