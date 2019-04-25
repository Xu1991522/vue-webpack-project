<template>
  <div class="container--useage-pane">
    <div class="condition__line">
      <el-select
        v-if="internal"
        filterable
        v-model="proxy"
        placeholder="请选择"
        style="width:170px">
        <el-option key="" label="全部代理商" value=""></el-option>
        <el-option
          v-for="item in proxies"
          :key="item.value"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select
        v-if="internal"
        filterable
        v-model="provider"
        placeholder="请选择"
        style="width:150px"
      >
        <el-option key="" label="全部供应商" value="">
        </el-option>
        <el-option
          v-for="item in providers"
          :key="item.value"
          :label="item.name + '(' + item.enName + ')-' + item.account"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select
        v-model="operator"
        placeholder="请选择"
        style="width:120px"
      >
        <el-option key="" label="全部运营商" value=""></el-option>
        <el-option
          v-for="item in operators"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="date"
        type="month"
        placeholder="选择日期"
        style="vertical-align: top;width:120px;margin-right:10px"
      >
      </el-date-picker>
      <el-input
        placeholder="请输入卡号或ICCID"
        v-model="number"
        class="icon__input"
      ></el-input>
      <el-button
        type="primary"
        style="vertical-align: top;margin-top:3px;"
        size="small"
        @click="search"
      >
        搜 索
      </el-button>
      <el-button type="primary" size="small" @click="download" style="float: right;margin-top:3px;">导出搜索结果</el-button>
    </div>
  </div>
</template>

<script>
  const resolve = val => Object.keys(val).reduce((acc, k) => ({ ...acc, [k]: val[k] || null }), {})

  export default {
    props: {
      proxies: {
        type: Array,
        required: true
      },
      providers: {
        type: Array,
        required: true
      },
      operators: {
        type: Array,
        required: true
      },
      query: {
        type: Object,
        required: true
      }
    },
    data () {
      const query = this.query

      return {
        number: query.number || '',
        provider: query.provider || '',
        proxy: query.proxy || '',
        operator: query.operator || '',
        date: query.date || '',

        advanced: false
      }
    },
    computed: {
      internal () {
        return this.$store.getters.user.roleBean.label === 'ADMIN'
      }
    },
    methods: {
      search () {
        const { number, provider, proxy, operator, date } = this

        this.$emit('search', resolve({ number, provider, proxy, operator, date }))
      },
      download () {
        this.$emit('download')
      }
    },
    watch: {
      query (query) {
        Object.assign(this, {
          number: query.number || '',
          provider: query.provider || '',
          proxy: query.proxy || '',
          operator: query.operator || '',
          date: query.date || '',

          advanced: false
        })
      }
    },
    created () {
      this.date = new Date()

      this.search()
    }
  }
</script>

<style lang="scss">
  .container--useage-pane {
    .icon__input {
      width: 220px;
      margin-right: 15px;
      position: relative;

    .el-input__inner {
      padding-right: 35px;
    }

    .el-input-group__append {
      width: 20px;
      height: 33px;
      top: 2px;
      right: 1px;
      position: absolute;
      background: #fff;
      border: 0;
      padding: 5px 16px;
      text-align: center;
      box-sizing: border-box;
    }

    .el-button {
      padding: 0;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>

<style scoped>
.condition__line {
  height: 30px;
  line-height: 30px;
  margin-bottom: 30px;
}
</style>
