<template>
  <div class="menulist-container" :style="{left:menuparameter.position.clientX+'px',top:menuparameter.position.clientY+'px'}" v-if="menuparameter.show">
    <div v-if=" menuparameter.list.length<11">
      <el-checkbox-group v-model="selected">
      <el-checkbox :label="el" v-for="(el,index) in menuparameter.list" :key="index" class="checkitem"></el-checkbox>
    </el-checkbox-group>
    </div>
    <div v-if="menuparameter.list.length>=11" :style="{ 'min-width': Math.ceil(menuparameter.list.length / 10) * 130 + 'px' }">
      <el-checkbox-group v-model="selected">
        <div class="left" style="width: 25%; min-width: 130px">
          <el-checkbox :label="el" v-for="(el,index) in menuparameter.list.slice(0, 10)" :key="index" class="checkitem"></el-checkbox>
        </div>
        <div class="left" style="width: 25%; min-width: 130px">
          <el-checkbox :label="el" v-for="(el,index) in menuparameter.list.slice(10, 20)" :key="10 + index" class="checkitem"></el-checkbox>
        </div>
        <div class="left" v-if="menuparameter.list.length > 20" style="width: 25%; min-width: 130px">
          <el-checkbox :label="el" v-for="(el,index) in menuparameter.list.slice(20, 30)" :key="20 + index" class="checkitem"></el-checkbox>
        </div>
        <div class="right"  v-if="menuparameter.list.length > 30" style="width: 25%; min-width: 130px">
          <el-checkbox :label="el" v-for="(el,index) in menuparameter.list.slice(30)" :key="20 + index" class="checkitem"></el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menuparameter: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selected: []
    }
  },
  created () {
    this.selected = [...this.menuparameter.selected]
  },
  watch: {
    selected (val) {
      this.$emit('selectedchanged', val)
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.menulist-container {
  border: 2px solid #cccccc;
  position: fixed;
  z-index: 99;
  background: #fff;
}
.checkitem {
  display: block;
  text-align: left;
  margin: 10px;
}
.left {
  float: left;
  width: 50%;
}
.right {
  float: right;
  width: 50%;
}
</style>
