<template>
  <div @click="hideAllMenuparameters">
    <div class="common-top-nav-rown">
      <el-tabs v-model="type">
        <el-tab-pane label="月表" name="month">
          <useage-pane
            :providers="providers"
            :proxies="proxies"
            :operators="operators"
            :query="month.query"
            @search="query => month.query = query"
            @download="download('month', month.query)"
          />
          <div>
            <el-table
              :data="month.result"
              v-loading="loadingMonth"
              style="width: 100%"
              empty-text="暂无相关卡信息"
              @header-contextmenu="(column, event) => headerclick('month', column, event)"
            >
              <el-table-column
                label="月份"
                width="100"
                v-if="menuparameters.month.selected.indexOf('月份') > -1"
              >
                <template slot-scope="{ row }">
                  <span style="color: #038ae3; cursor: pointer" @click="redirectToDailyFlow(row, month.query.date)">{{ month.query.date | time('yyyy-MM') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="卡号"
                :min-width="month.result.every(x => !x.cardNumber) ? 60 : 180"
                v-if="menuparameters.month.selected.indexOf('卡号') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.cardNumber || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="ICCID"
                v-if="menuparameters.month.selected.indexOf('ICCID')>-1"
                :width="month.result.every(x => !x.iccid) ? 65 : 181">
                <template slot-scope="scope">
                  {{scope.row.iccid === ''||scope.row.iccid === null?'-':scope.row.iccid}}
                </template>
              </el-table-column>
              <el-table-column
                label="运营商"
                width="80"
                v-if="menuparameters.month.selected.indexOf('运营商') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.operatorName || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="供应商"
                :width="month.result.every(x => !x.providerName) ? 70 : 140"
                v-if="internal && menuparameters.month.selected.indexOf('供应商') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.providerName || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="所属代理商"
                :width="month.result.every(x => !x.proxyName) ? 110 : 160"
                v-if="internal && menuparameters.month.selected.indexOf('所属代理商') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.proxyName || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="总流量（MB）"
                :width="month.result.every(x => !x.total) ? 140 : 160"
                v-if="menuparameters.month.selected.indexOf('总流量（MB）') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.total || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="使用量（MB）"
                width='120'
                v-if="menuparameters.month.selected.indexOf('使用量（MB）') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.used || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="剩余流量（MB）"
                :width="month.result.every(x => !x.remainder) ? 140 : 160"
                v-if="menuparameters.month.selected.indexOf('剩余流量（MB）') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.remainder || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="已超流量（MB）"
                :width="month.result.every(x => !x.exceed) ? 140 : 160"
                v-if="menuparameters.month.selected.indexOf('已超流量（MB）') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.exceed || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="使用占比"
                :width="month.result.every(x => !x.utilizationRate) ? 140 : 160"
                v-if="menuparameters.month.selected.indexOf('使用占比') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.utilizationRate || '-' }}
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @size-change="size => handleSizeChange('month', size)"
              @current-change="index => handleCurrentChange('month', index)"
              :page-sizes="[10, 20, 30, 40,50]"
              :current-page="month.pager.index"
              layout="total, sizes, prev, pager, next, jumper"
              :page-size="month.pager.size"
              :total="month.pager.count"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="日表" name="daily">
          <useage-pane
            :providers="providers"
            :proxies="proxies"
            :query="daily.query"
            :operators="operators"
            @search="query => daily.query = query"
            @download="download('daily', daily.query)"
          />
          <div>
            <el-table
              :data="daily.result"
              v-loading="loadingDaily"
              style="width: 100%"
              empty-text="暂无相关卡信息"
              @header-contextmenu="(column, event) => headerclick('daily', column, event)"
            >
              <el-table-column
                label="月 份"
                width="100"
                v-if="menuparameters.daily.selected.indexOf('月份') > -1"
              >
                <template slot-scope="{ row }">
                  {{ daily.query.date | time('yyyy-MM') }}
                </template>
              </el-table-column>
              <el-table-column
                label="卡号"
                :min-width="daily.result.every(x => !x.cardNumber) ? 60 : 180"
                v-if="menuparameters.daily.selected.indexOf('卡号') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.cardNumber || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="ICCID"
                v-if="menuparameters.daily.selected.indexOf('ICCID')>-1"
                :width="daily.result.every(x => !x.iccid) ? 65 : 181">
                <template slot-scope="scope">
                  {{scope.row.iccid === ''||scope.row.iccid === null?'-':scope.row.iccid}}
                </template>
              </el-table-column>
              <el-table-column
                label="运营商"
                width="80"
                v-if="menuparameters.daily.selected.indexOf('运营商') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.operatorName || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="供应商"
                :width="daily.result.every(x => !x.providerName) ? 70 : 140"
                v-if="internal && menuparameters.daily.selected.indexOf('供应商') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.providerName || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="所属代理商"
                :width="daily.result.every(x => !x.proxyName) ? 100 : 160"
                v-if="internal && menuparameters.daily.selected.indexOf('所属代理商') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.proxyName || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="总流量（MB）"
                :width="daily.result.every(x => !x.used) ? 115 : 120"
                v-if="menuparameters.daily.selected.indexOf('总流量（MB）') > -1"
              >
                <template slot-scope="{ row }">
                  {{ row.used || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                v-for="i in 31"
                :key="i"
                :label="'' + i"
                :min-width="daily.result.every(x => !x.dailyCount[i]) ? 60 : 120"
                v-if="menuparameters.daily.selected.indexOf(i) > -1"
              >
                <template slot-scope="{ row }">
                  <span>{{ row.dailyCount[i] || '-' }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @size-change="size => handleSizeChange('daily', size)"
              @current-change="index => handleCurrentChange('daily', index)"
              :page-sizes="[10, 20, 30, 40,50]"
              :current-page="daily.pager.index"
              layout="total, sizes, prev, pager, next, jumper"
              :page-size="daily.pager.size"
              :total="daily.pager.count"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <Contextmenu :menuparameter="menuparameters.month" @selectedchanged="val => selectedchanged('month', val)"></Contextmenu>
    <Contextmenu :menuparameter="menuparameters.daily" @selectedchanged="val => selectedchanged('daily', val)"></Contextmenu>
  </div>
</template>

<script>
import api from '../../api'

import range from '../../helpers/range'

import taskRunner from '../common/task/task'
import UseagePane from './cardUseagePane'

import time from '../../filters/time'

export default {
  name: 'cardUsedMountManage',
  data () {
    const internal = this.$store.getters.user.roleBean.label === 'ADMIN'

    // always show 31 days
    const days = range(1, 31)

    const monthList = ['月份', '卡号', 'ICCID', '运营商', ...(internal ? ['供应商', '所属代理商'] : []), '总流量（MB）', '使用量（MB）', '剩余流量（MB）', '已超流量（MB）', '使用占比']
    const monthSelected = monthList.slice()

    const dailyList = ['月份', '卡号', 'ICCID', '运营商', ...(internal ? ['供应商', '所属代理商'] : []), '总流量（MB）', ...days]
    const dailySelected = dailyList.slice()

    return {
      loadingMonth: true, // 表格加载
      loadingDaily: true, // 表格加载
      type: 'month',

      providers: [],
      proxies: [],
      operators: [
        { value: 'CMCC', label: '中国移动' },
        { value: 'UNICOM', label: '中国联通' },
        { value: 'CNET', label: '中国电信' }
      ],

      month: {
        pager: {
          index: 1,
          size: 10,
          count: 0
        },
        query: {},
        result: []
      },
      daily: {
        pager: {
          index: 1,
          size: 10,
          count: 0
        },
        query: {},
        days: 30,
        result: []
      },

      menuparameters: {
        month: {
          show: false,
          position: {
            clientX: 0,
            clientY: 0
          },
          list: monthList,
          selected: monthSelected
        },
        daily: {
          show: false,
          position: {
            clientX: 0,
            clientY: 0
          },
          list: dailyList,
          selected: dailySelected
        }
      }
    }
  },
  computed: {
    internal () {
      return this.$store.getters.user.roleBean.label === 'ADMIN'
    }
  },
  methods: {
    getmaxlength (transform, title, array) {
      let max = 0

      array.forEach(el => {
        const realStr = transform(el)

        const temp = realStr.replace(/[^0-9a-zA-Z]/g, '--').length

        max = temp > max ? temp : max
      })

      if (title && max < title.replace(/[^0-9a-zA-Z]/g, '--').length) {
        max = title.replace(/[^0-9a-zA-Z]/g, '--').length
      }

      return max * 8 + 21
    },
    selectedchanged (type, val) {
      this.menuparameters[type].selected = val
    },
    headerclick (type, column, event) {
      this.menuparameters[type].position.clientX = event.clientX
      this.menuparameters[type].position.clientY = event.clientY

      this.menuparameters[type].show = true

      event.preventDefault()
    },
    hideAllMenuparameters () {
      this.menuparameters.month.show = false
      this.menuparameters.daily.show = false
    },
    monthSearch (index, size, query) {
      const params = {
        page: index - 1,
        size,
        proxyId: query.proxy || null,
        providerId: query.provider || null,
        operator: query.operator || null,
        month: +new Date(query.date),
        cardNumber: query.number
      }
      api.ICardFlowManager.listMonthCardFlowPageOnCondition(params)
        .then(res => {
          // total, used, exceed, count in dailyCount, unit was k
          const m = 2 ** 10

          this.month.result = res.content.map(x => ({
            ...x,
            total: x.total ? (x.total / m).toFixed(2) : 0,
            used: x.used ? (x.used / m).toFixed(2) : 0,
            remainder: x.remainder ? (x.remainder / m).toFixed(2) : 0,
            exceed: x.exceed ? (x.exceed / m).toFixed(2) : 0
          }))

          this.month.pager = {
            index: res.number + 1,
            size: res.size,
            count: res.totalElements
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '卡用量月表查询失败'
          })
        })
        .then(() => {
          this.loadingMonth = false
        })
    },
    dailySearch (index, size, query) {
      const params = {
        page: index - 1,
        size,
        proxyId: query.proxy || null,
        providerId: query.provider || null,
        operator: query.operator || null,
        month: +new Date(query.date),
        cardNumber: query.number
      }

      api.ICardFlowManager.listDailyCardFlowPageOnCondition(params)
        .then(res => {
          // en cn time zone, 8 hours
          const t = 8 * 60 * 60 * 1000

          // total, used, exceed, count in dailyCount, unit was k
          const m = 2 ** 10

          const resolve = xs => xs.reduce((acc, x) => ({ ...acc, [new Date(x.date + t).getDate()]: x.count ? (x.count / m).toFixed(2) : 0 }), {})

          this.daily.result = res.content.map(x => ({
            ...x,
            total: x.total ? (x.total / m).toFixed(2) : 0,
            used: x.used ? (x.used / m).toFixed(2) : 0,
            remainder: x.remainder ? (x.remainder / m).toFixed(2) : 0,
            exceed: x.exceed ? (x.exceed / m).toFixed(2) : 0,
            dailyCount: resolve(x.dailyCount || [])
          }))

          this.daily.pager = {
            index: res.number + 1,
            size: res.size,
            count: res.totalElements
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '卡用量日表查询失败'
          })
        })
        .then(() => {
          this.loadingDaily = false
        })
    },
    handleSizeChange (type, size) {
      const { pager, query } = this[type]

      this[type + 'Search'](pager.index, size, query)
    },
    handleCurrentChange (type, index) {
      const { pager, query } = this[type]

      this[type + 'Search'](index, pager.size, query)
    },
    redirectToDailyFlow (row, date) {
      this.type = 'daily'

      this.daily.query = {
        number: row.cardNumber,
        date
      }
    },
    download (type, query) {
      let p

      const resolve = query => {
        return {
          proxyId: query.proxy || null,
          providerId: query.provider || null,
          operator: query.operator || null,
          month: +new Date(query.date),
          cardNumber: query.number
        }
      }

      if (type === 'month') {
        p = api.ICardFlowManager.excelMonthFlow(resolve(query))
      } else if (type === 'daily') {
        p = api.ICardFlowManager.excelDailyFlow(resolve(query))
      } else {
        throw Error('unexpected download type in download(type, query) {}')
      }

      p.then(res => {
        if (!res.fileUrl) {
          return Promise.reject(Error(res.message))
        }

        this.$message({
          type: 'success',
          message: '文件下载任务已开启，文件生成后将提醒您下载'
        })

        taskRunner.add(res.fileUrl)
      })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '文件生成失败'
          })
        })
    }
  },
  created () {
    if (this.internal) {
      api.IProxyManager.listBriefProxies({})
        .then(res => {
          this.proxies = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取代理商列表失败'
          })
        })

      api.IProviderManager.listBriefProviders({})
        .then(res => {
          this.providers = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取供应商列表失败'
          })
        })
    }
  },
  watch: {
    'month.query' (query) {
      this.monthSearch(this.month.pager.index, this.month.pager.size, query)
    },
    'daily.query' (query) {
      this.dailySearch(this.daily.pager.index, this.daily.pager.size, query)
    }
  },
  filters: {
    time
  },
  components: {
    UseagePane
  }
}
</script>

<style lang="scss">
.common-top-nav-rown {
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    margin-left: -10px;
  }
  .el-tabs--top.el-tabs--border-card .el-tabs__item:last-child,
  .el-tabs__item {
    margin-left: 20px;
  }
}
</style>

<style scoped>
</style>
