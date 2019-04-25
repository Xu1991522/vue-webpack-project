<template>
  <div>
    <div class="plus-button" :title="title" @click="turnrouter"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    routepath: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    turnrouter (role) {
      this.$router.push({
        path: this.routepath,
        query: {
          title: '添加管理员'
        }
      })
    }
  }
}
</script>

<style scoped>
.plus-button {
  height: 21px;
  width: 21px;
  background-size: 100% 100%;
  background: url('./plus-icon.png') no-repeat 0 0;
  cursor: pointer;
}
</style>
