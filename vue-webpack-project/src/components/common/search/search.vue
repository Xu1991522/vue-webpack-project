<template>
  <div>
    <el-button class="button-style"><i class="el-icon-search" title="搜索" @click="handlsearch"></i></el-button>
  </div>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {}
  },
  created () { },
  methods: {
    handlsearch () {
      this.$emit('handlsearch')
    }
  }
}
</script>

<style scoped>
.button-style {
  color: #fff;
  background: #038ae3;
  font-size:20px;
  padding:7px;
}
</style>
