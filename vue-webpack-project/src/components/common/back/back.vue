<template>
  <div class="tab-header">
    <el-button class="el-icon-arrow-left back-button" @click="turnrouter"></el-button>{{title}}
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: ''
    }
  },
  created () {
    this.title = this.$route.query.title
  },
  methods: {
    turnrouter () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.tab-header {
  height: 30px;
  line-height: 30px;
  padding: 0 10px 10px;
  border-bottom: 1px solid #333;
}
.back-button {
  display: inline-block;
  margin-right: 20px;
  font-size: 16px;
  padding: 5px 5px;
}
</style>
