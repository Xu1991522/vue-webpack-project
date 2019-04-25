<template>
  <div>
    <div class="search">
      <div class="item__control" v-if="internal">
        <span class="item__label">供应商</span>
        <el-select
          filterable
          v-model="provider"
          placeholder="请选择"
          style="width: 180px"
        >
          <el-option key="" label="全部" value="">
          </el-option>
          <el-option
            v-for="item in providers"
            :key="item.value"
            :label="item.name + '(' + item.enName + ')-' + item.account"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="item__control" v-if="internal">
        <span class="item__label">代理商</span>
        <el-select
          filterable
          v-model="proxy"
          placeholder="请选择"
          style="width: 180px"
        >
          <el-option key="" label="全部" value=""></el-option>
          <el-option
            v-for="item in proxies"
            :key="item.value"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="item__control">
        <span class="item__label">运营商</span>
        <el-select
          filterable
          v-model="operator"
          placeholder="请选择"
          style="width: 180px"
        >
          <el-option key="" label="全部" value=""></el-option>
          <el-option
            v-for="item in operators"
            :key="item.value"
            :label="item.value | operator"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="item__control">
        <span class="item__label">接收时间</span>
        <el-date-picker
          v-model="startTime"
          type="date"
          style="width: 150px"
          placeholder="开始日期">
        </el-date-picker>
        <span class="time__spliter">至</span>
        <el-date-picker
          v-model="endTime"
          type="date"
          style="width: 150px"
          placeholder="结束日期">
        </el-date-picker>
      </div>

      <el-input
        class="item__control"
        placeholder="请输入卡号"
        v-model="number"
        style="width: 200px"
      ></el-input>

      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <el-table
      border
      v-loading="loading"
      :data="receivedRecords"
      style="width: 100%; margin-top: 15px;"
      empty-text="暂无数据"
    >
      <el-table-column
        label="回复号码"
      >
        <template slot-scope="scope">
          {{ scope.row.msisdn }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="internal"
        label="供应商"
      >
        <template slot-scope="scope">
          {{ scope.row.supplierName }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="internal"
        label="代理商"
      >
        <template slot-scope="scope">
          {{ scope.row.clientName }}
        </template>
      </el-table-column>

      <el-table-column
        label="运营商"
      >
        <template slot-scope="scope">
          {{ scope.row.operatorName }}
        </template>
      </el-table-column>

      <el-table-column
        label="短信内容"
      >
        <template slot-scope="scope">
          {{ scope.row.content == null ? '******' : scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column
        label="接收时间"
      >
        <template slot-scope="scope">
          {{ scope.row.receiveTime | time('yyyy-MM-dd HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="size => fetchReceivedSmsRecords(query, 1, size)"
      @current-change="index => fetchReceivedSmsRecords(query, index, pager.size)"
      :page-sizes="[10, 20, 30, 40, 50]"
      :current-page="pager.index"
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="pager.size"
      :total="pager.count">
    </el-pagination>
  </div>
</template>

<script>
  import api from '../../api'

  import time from '../../filters/time'
  import operator from '../../filters/operator'

  export default {
    props: {
      providers: {
        type: Array,
        required: true
      },
      proxies: {
        type: Array,
        required: true
      },
      operators: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        provider: '',

        proxy: '',

        operator: '',

        startTime: '',
        endTime: '',
        number: '',

        receivedRecords: [],

        pager: {
          index: 1,
          size: 10,
          count: 0
        },

        query: {},

        loading: false
      }
    },
    computed: {
      internal () {
        return this.$store.getters.user.roleBean.label === 'ADMIN'
      }
    },
    methods: {
      fetchReceivedSmsRecords (query, index, size) {
        // issue: https://github.com/ElemeFE/element/pull/10247
        // size-change will trigger current-change
        // just fetch once
        if (this.loading) {
          return
        }

        this.loading = true

        api.ISmsManager.listSmsReceiveRecord({ ...query, page: index - 1, size })
          .then(res => {
            if (res.code === 1000) {
              // case smsReceiveRecordBeanList: null
              return res.smsReceiveRecordBeanList || {
                number: index - 1,
                size,
                content: [],
                totalElements: 0
              }
            }

            return Promise.reject(Error(res.msg))
          })
          .then(res => {
            this.query = query

            this.receivedRecords = res.content

            this.pager = {
              index: res.number,
              size: res.size,
              count: res.totalElements
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '查询短信接受记录失败'
            })
          })
          .then(() => {
            this.loading = false
          })
      },
      handleSearch () {
        const query = {}

        let {
          internal,
          provider, proxy, operator, startTime, endTime, number
        } = this

        if (internal) {
          if (provider) {
            query.supplierId = provider
          }

          if (proxy) {
            query.clientId = proxy
          }
        }

        if (operator) {
          query.operator = operator
        }

        if (startTime || endTime) {
          const d1 = startTime ? +new Date(startTime) : 0
          const d2 = endTime ? +new Date(endTime) : +new Date()

          if (d1 > d2) {
            return this.$message({
              type: 'error',
              message: '时间间隔不符合规范'
            })
          }

          query.startTime = d1

          // set the end of a day
          query.endTime = d2 + 86400 * 1000
        }

        if (number) {
          query.msisdn = number
        }

        this.fetchReceivedSmsRecords(query, 1, this.pager.size)
      }
    },
    created () {
      this.fetchReceivedSmsRecords({}, 1, this.pager.size)
    },
    filters: {
      time,
      operator
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    margin-top: -20px;

    .el-input, .el-select {
      float: none;
    }

    .item__control {
      display: inline-block;

      &:not(:last-child) {
        margin-right: 20px;
      }

      margin-top: 20px;
    }

    .time__spliter {
      display: inline-block;
      vertical-align: middle;
      margin: 0 6px;
      font-size: 14px;
    }

    .item__label {
      display: inline-block;
      height: 100%;
      margin-right: 10px;
      font-size: 14px;
    }
  }
</style>
