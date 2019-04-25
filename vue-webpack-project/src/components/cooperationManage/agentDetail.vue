<template>
  <div v-if="!pending" class="container--proxy-details">
    <BackButton></BackButton>

    <div class="header">
      <h2 class="text--company">{{ entity.company }}</h2>
      <span class="text--type">{{ formatLevel(entity) }}</span>
    </div>

    <div class="cards__panel">
      <el-row class="cards__line" :gutter="50">
        <el-col :span="12">
          <div class="card__panel">
            <div class="panel__inner w50">
              <div class="card__content">
                <span class="card__text">总卡数</span>
                <span class="card__number card__number--total">{{ counts[entity.id] && counts[entity.id].total || 0 }}</span>
              </div>
              <span class="card__icon card__icon--total"></span>
            </div>

            <div class="graph__wrapper--status w50"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card__panel">
            <div class="panel__inner">
              <span class="card__content">
                <span class="card__text">待激活的卡</span>
                <span class="card__number card__number--inactive">{{ counts[entity.id] && counts[entity.id].inactive || 0 }}</span>
              </span>
              <span class="card__icon card__icon--inactive"></span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card__panel">
            <div class="panel__inner">
              <span class="card__content">
                <span class="card__text">使用中的卡</span>
                <span class="card__number card__number--using">{{ counts[entity.id] && counts[entity.id].using || 0 }}</span>
              </span>
              <span class="card__icon card__icon--using"></span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="cards__line" :gutter="50">
        <el-col :span="6">
          <div class="card__panel">
            <div class="panel__inner">
              <span class="card__content">
                <span class="card__text">停机的卡</span>
                <span class="card__number card__number--stopped">{{ counts[entity.id] && counts[entity.id].stopped || 0 }}</span>
              </span>
              <span class="card__icon card__icon--stopped"></span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card__panel">
            <div class="panel__inner">
              <span class="card__content">
                <span class="card__text">预约取消的卡</span>
                <span class="card__number card__number--canceling">{{ counts[entity.id] && counts[entity.id].canceling || 0 }}</span>
              </span>
              <span class="card__icon card__icon--canceling"></span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card__panel">
            <div class="panel__inner">
              <span class="card__content">
                <span class="card__text">挂失的卡</span>
                <span class="card__number card__number--lost">{{ counts[entity.id] && counts[entity.id].lost || 0 }}</span>
              </span>
              <span class="card__icon card__icon--lost"></span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="subordinate__proxy" v-if="internal || user.id === entity.id">
      <div :class="['subordinate__op', opened ? 'is-active' : '']" @click="opened = !opened">
        查看旗下的代理商
      </div>
      <div class="subordinate__list" v-show="subs.length && opened">
        <div class="subordinate__item" v-for="item in subs" :key="item.id">
          <div class="subordinate__title">
            <span class="text--company">{{ item.company }}</span>
            <span class="text--type">{{ formatLevel(item) }}</span>
            <router-link :to="$route.fullPath.replace(/proxy=(\d)+/, 'proxy=' + item.id)" class="text__link">查看详情</router-link>
          </div>
          <div class="subordinate__cards" v-if="counts[item.id]">
            <div class="sub__card">
              <i class="card__icon card__icon--total"></i>
              <div class="card__content">
                <span class="card__text">总卡数</span>
                <span class="card__number">{{ counts[item.id].total }}</span>
              </div>
            </div>
            <div class="sub__card">
              <i class="card__icon card__icon--inactive"></i>
              <div class="card__content">
                <span class="card__text">待激活的卡</span>
                <span class="card__number">{{ counts[item.id].inactive }}</span>
              </div>
            </div>
            <div class="sub__card">
              <i class="card__icon card__icon--using"></i>
              <div class="card__content">
                <span class="card__text">使用中的卡</span>
                <span class="card__number">{{ counts[item.id].using }}</span>
              </div>
            </div>
            <div class="sub__card">
              <i class="card__icon card__icon--stopped"></i>
              <div class="card__content">
                <span class="card__text">停机的卡</span>
                <span class="card__number">{{ counts[item.id].stopped }}</span>
              </div>
            </div>
            <div class="sub__card">
              <i class="card__icon card__icon--canceling"></i>
              <div class="card__content">
                <span class="card__text">预约取消的卡</span>
                <span class="card__number">{{ counts[item.id].canceling }}</span>
              </div>
            </div>
            <div class="sub__card">
              <i class="card__icon card__icon--lost"></i>
              <div class="card__content">
                <span class="card__text">挂失的卡</span>
                <span class="card__number">{{ counts[item.id].lost }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="empty__notice" v-show="!subs.length && opened">
        暂无次级代理
      </div>
    </div>

    <div class="statistics__panel">
      <div class="panel__header">
        <span class="header__title">卡的流量情况</span>
        <span class="text header__description">上月总量：</span>
        <span class="text">移动：</span>
        <span class="value">{{ total.CMCC }}</span>
        <span class="text">电信：</span>
        <span class="value">{{ total.CNET }}</span>
        <span class="text">联通：</span>
        <span class="value">{{ total.UNICOM }}</span>

        <el-date-picker
          v-model="date"
          type="month"
          placeholder="选择日期"
          class="date__input"
          @change="fetchMonthFlowValues"
        >
        </el-date-picker>
      </div>

      <div class="panel__body">
        <div class="graph__wrapper--flow"></div>
      </div>
      <div class="outer-link-setting" v-if="internal || user.id === entity.id">
        <div>
          <div class="item item-name search-icon">外部查询</div>
          <div class="item item-status" v-if="externalQueryEnum === 'ENABLE'">已开启</div>
          <div class="item item-status" v-if="externalQueryEnum === 'DISABLE'">已关闭</div>
          <el-button type="text" v-if="externalQueryEnum === 'DISABLE'" :disabled="!!!access.update" class="item item-btn"  @click="updateExternalQuery('ENABLE')">开启外部查询</el-button>
          <el-button type="text" v-if="externalQueryEnum === 'ENABLE'" :disabled="!!!access.update" class="item item-btn"   @click="updateExternalQuery('DISABLE')">关闭外部查询</el-button>
        </div>
        <div>
          <div class="item item-name">二维码</div>
          <div class="item item-status">{{externalQueryEnum === 'ENABLE'?'已生效':'已关闭'}}</div>
          <a :href="imgsrc" @click="checkhref" download="二维码" style="color:inherit;">
            <el-button type="text" class="item item-btn" v-if="externalQueryEnum === 'ENABLE'">下载</el-button>
          </a>
        </div>
        <div>
          <div class="item item-name">网址</div>
          <div class="item item-status">{{externalQueryEnum === 'ENABLE'?'已生效':'已关闭'}}</div>
          <el-button type="text" class="item item-btn" v-if="externalQueryEnum === 'ENABLE'"
          v-clipboard:copy="url"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">复制</el-button>
        </div>
        <div>
          <div class="item item-name">售后电话</div>
          <div class="item item-status" v-if="!inputshow">{{hotLine?hotLine:'不显示'}}</div>
          <el-input v-model="hotLine" v-show="inputshow" class="item item-status"></el-input>
          <el-button type="text" class="item item-btn" @click="inputshow = !inputshow" v-if="!inputshow">编辑号码</el-button>
          <el-button type="text" class="item item-btn" @click="updateHotline" v-if="inputshow">确定</el-button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import Vue from 'vue'
import echarts from 'echarts'
import VueClipboard from 'vue-clipboard2'
import QRCode from 'qrcode'
import api from '../../api'
import daysOfMonth from '../../helpers/days-of-month'
import flatten from '../../helpers/flatten'
import toZhDigit from '../../helpers/to-zh-dight'

import time from '../../filters/time'
Vue.use(VueClipboard)
const colors = {
  inactive: '#939090',
  using: '#54bce5',
  stopped: '#cecece',
  canceling: '#f7c94f',
  lost: '#91603f'
}

const names = {
  inactive: '待激活',
  using: '使用中',
  stopped: '停机',
  canceling: '预约取消',
  lost: '挂失'
}

/*
const keys = {
  WAITING_TO_ACTIVE: 'inactive',
  USING: 'using',
  STOPPED: 'stopped',
  WAITING_TO_CLOSE: 'canceling',
  LOSS: 'lost'
}
*/

const categories = {
  0: 'unknown',
  1: 'inactive',
  2: 'using',
  3: 'stopped',
  4: 'canceling',
  5: 'lost'
}

const collect = cards => cards.reduce((acc, x) => ({ ...acc, [categories[x.category]]: x.count, total: acc.total + x.count }), { total: 0 })

export default {
  name: '',
  data () {
    return {
      pending: true,
      externalQueryEnum: '',
      hotLine: '',
      url: '',
      entity: {},
      proxyId: '',
      subs: [],
      counts: {},
      total: {},
      imgsrc: '',
      opened: false,
      inputshow: false,
      date: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    internal () {
      return this.user.roleBean.label === 'ADMIN'
    },
    access () {
      const {
        ADD_PROXY,
        UPDATE_PROXY
      } = this.$store.getters.access

      return {
        add: ADD_PROXY,
        update: UPDATE_PROXY
      }
    }
  },
  methods: {
    checkhref (e) {
      if (this.externalQueryEnum === 'DISABLE') {
        e.preventDefault()
      }
    },
    download () {
      window.open(this.imgsrc)
    },
    updateHotline () {
      this.inputshow = !this.inputshow
      api.IProxyManager.updateHotline({
        proxyId: this.entity.id,
        hotLine: this.hotLine
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.hotLine = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '编辑失败'
          })
        })
    },
    onCopy: function (e) {
      this.$message({
        type: 'success',
        message: '外部查询地址已复制成功'
      })
    },
    onError: function (e) {
      alert('复制失败')
    },
    formatLevel (entity) {
      const internal = this.internal

      if (!internal) {
        return entity.id === this.user.id ? '代理商' : '次级代理'
      }

      return toZhDigit(entity.level) + '级代理'
    },
    renderDailyFlowGraph (days, flow) {
      this.charts && this.charts.flow && this.charts.flow.dispose()

      const fill = arr => {
        const map = arr.reduce((acc, x) => ({ ...acc, [new Date(x.date).getDate()]: x.count }), {})

        const res = []

        for (let i = 0; i < days; i++) {
          res[i] = map[i + 1] || 0
        }

        return res
      }

      let max = Math.max(...flatten(flow.map(x => x.content.map(x => x.count))), 0)

      const g = 2 ** 20

      let interval

      if (max < g) {
        max = g
        interval = g / 5
      } else {
        max = undefined
      }

      const pre = time(this.date, 'yyyy-MM-')

      const option = {
        title: {
          text: '日用量趋势图',
          textStyle: {
            align: 'right',
            fontWeight: 'normal',
            fontColor: '#666',
            fontSize: 12,
            height: 16
          },
          padding: [10, 0, 0, 0],
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          formatter (params, ticket, callback) {
            const xAxisValue = params[0].axisValue
            const d = pre + (xAxisValue < 10 ? '0' + xAxisValue : xAxisValue)
            const l = params.map(x => x.marker + x.seriesName + ': ' + (x.value / (2 ** 20)).toFixed(1) + 'G')

            return `${d}<br/>${l.join('<br/>')}`
          }
        },
        grid: {
          left: '1%',
          top: '10%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Array.from({ length: days }, (_, i) => i + 1)
        },
        yAxis: {
          type: 'value',
          max,
          interval,
          axisLabel: {
            formatter: val => {
              const v = (val / (2 ** 20)).toFixed(1)

              return v === '0.0' ? '0(GB)' : v
            }
          }
        },
        series: flow.map(x => ({ ...x, type: 'line', data: fill(x.content) }))
      }

      const el = this.$el.querySelector('.graph__wrapper--flow')

      const chart = echarts.init(el)

      chart.setOption(option)

      this.charts.flow = chart
    },
    renderStatusPieGraph (counts) {
      this.charts && this.charts.status && this.charts.status.dispose()

      const items = ['inactive', 'using', 'stopped', 'canceling', 'lost'].map(x => ({ value: counts[x], name: names[x], label: x }))

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '各状态卡数',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            hoverOffset: 5,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: items,
            itemStyle: {
              color: item => {
                return colors[item.data.label]
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      const el = this.$el.querySelector('.graph__wrapper--status')

      const chart = echarts.init(el)

      chart.setOption(option)

      this.charts.status = chart
    },
    fetchSubProxies () {
      // only fetch it's children
      api.IProxyManager.getSecProxylist({ proxyId: this.entity.id, deep: false })
        .then(res => {
          this.subs = res

          Promise.all(res.map(x => api.IProxyManager.getCardCount({ proxyId: x.id })))
            .then(arr => {
              arr.forEach((val, i) => {
                Vue.set(this.counts, res[i].id, collect(val))
              })
            })
        })
    },
    fetchCardsCount () {
      return api.IProxyManager.getCardCount({ proxyId: this.entity.id })
        .then(res => {
          Vue.set(this.counts, this.entity.id, collect(res))
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取各状态卡数量失败'
          })

          return Promise.reject(err)
        })
    },
    fetchMonthTotalValue () {
      const d = new Date()

      d.setMonth(d.getMonth() - 1)

      const collect = arr => arr.reduce((acc, x) => ({ ...acc, [x.label]: x.flowMonth ? (x.flowMonth / (2 ** 20)).toFixed(1) + 'G' : 0 }), {})

      api.IProxyManager.cardMonthFlow({ proxyId: this.entity.id, month: +d })
        .then(res => {
          this.total = collect(res)
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取上月总量失败'
          })
        })
    },
    updateExternalQuery (type) {
      api.IProxyManager.updateExternalQuery({
        proxyId: this.entity.id,
        externalQueryEnum: type
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.externalQueryEnum = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '操作失败'
          })
        })
    },
    getExternalUrl () {
      api.IProxyManager.externalUrl({
        userId: this.$route.query.proxy
      })
        .then(res => {
          QRCode.toDataURL(res)
            .then(url => {
              this.imgsrc = url
            })
            .catch(err => {
              console.error(err)
            })
          this.url = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取网址失败'
          })
        })
    },
    fetchMonthFlowValues (date) {
      const month = new Date(date)

      return api.IProxyManager.getFlowCountInMonth({ proxyId: this.entity.id, month: +month })
        .then(res => {
          this.renderDailyFlowGraph(daysOfMonth(month), res)
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取卡日用量趋势数据失败'
          })
        })
    },
    setup () {
      this.pending = true
      const id = +this.$route.query.proxy
      this.entity = {}
      this.counts = {}
      this.total = {}

      this.opened = false

      const date = new Date()
      this.date = date
      this.getExternalUrl()
      api.IProxyManager.getProxy({ id })
        .then(res => {
          this.externalQueryEnum = res.externalQuery
          this.entity = res
          this.hotLine = res.hotLine
          this.pending = false

          this.fetchCardsCount().then(() => {
            this.renderStatusPieGraph(this.counts[this.entity.id])
          })

          this.fetchMonthTotalValue()

          this.fetchMonthFlowValues(date)

          // admin has access to all level proxies
          // otherwise: just it's releated next level proxies
          const accessToLowerLevelProxies = this.internal || this.user.id === this.entity.id

          if (accessToLowerLevelProxies) {
            this.fetchSubProxies()
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取代理商详情失败'
          })
        })

      if (!this.charts) {
        this.charts = {}
      }
    }
  },
  watch: {
    '$route.query.proxy' (val) {
      this.setup()
    }
  },
  mounted () {
    this.setup()
  },
  beforeDestroy () {
    this.charts && this.charts.status && this.charts.status.dispose()
    this.charts && this.charts.flow && this.charts.flow.dispose()

    this.charts = null
  }
}
</script>

<style lang="scss" scoped>
.header {
  padding: 10px 0;

  .text--company {
    display: inline-block;
    margin: 0;
    color: #666;
  }

  .text--type {
    display: inline-block;
    vertical-align: bottom;

    font-size: 12px;
    vertical-align: bottom;
    margin-left: 6px;
  }
}

.cards__line {
  margin-left: 0 !important;
  margin-right: 0 !important;

  & + & {
    margin-top: 20px;
  }

  & > div:first-child {
    padding-left: 0 !important;
  }

  &:first-child > div:last-child {
    padding-right: 0 !important;
  }
}

.card__panel {
  height: 108px;
  padding: 10px 30px;
  box-sizing: border-box;

  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.panel__inner {
  display: inline-block;
  vertical-align: middle;
  width: 100%;

  &.w50 {
    width: calc(50% - 20px);

    .card__icon {
      margin-right: 35px;
      margin-top: 0;
      left: 10px;
      position: relative;
    }
  }

  .card__content {
    display: inline-block;
    width: 60px;

    .card__text {
      display: inline-block;
      vertical-align: middle;
      width: 100px;
      line-height: 30px;
      font-size: 16px;
      color: #666;
    }

    .card__number {
      display: inline-block;
      vertical-align: middle;
      width: 100px;
      font-size: 36px;
      font-weight: 600;

      &--total {
        color: #fa8564;
      }

      &--using {
        color: #f08542;
      }

      &--inactive,
      &--stopped,
      &--canceling,
      &--lost {
        color: #999;
      }
    }
  }

  .card__icon {
    display: block;
    float: right;

    width: 80px;
    height: 80px;

    background-repeat: no-repeat;
    background-position: center center;

    margin-top: 2px;

    &--total {
      background-image: url('../../assets/card-icon-total.png');
    }

    &--inactive {
      background-image: url('../../assets/card-icon-inactive.png');
    }

    &--using {
      background-image: url('../../assets/card-icon-using.png');
    }

    &--stopped {
      background-image: url('../../assets/card-icon-stopped.png');
    }

    &--canceling {
      background-image: url('../../assets/card-icon-canceling.png');
    }

    &--lost {
      background-image: url('../../assets/card-icon-lost.png');
    }
  }
}

.graph__wrapper--status {
  vertical-align: top;
  width: 220px;
  height: 108px;
  margin-top: -10px;
  float: right;

  & > div {
    display: inline-block;
  }

  canvas {
    height: 100%;
  }
}

.graph__wrapper--flow {
  height: 400px;

  canvas {
    height: 100%;
  }
}

.subordinate__proxy {
  .empty__notice {
    line-height: 40px;
    font-size: 13px;
    color: #777;
    text-align: left;
    text-indent: 20px;
  }
}

.subordinate__op {
  padding-left: 30px;
  margin-top: 20px;
  margin-bottom: 12px;
  display: inline-block;

  color: #038ae3;
  font-size: 14px;
  cursor: pointer;

  background-repeat: no-repeat;
  background-position: left center;

  background-image: url('../../assets/sub-proxy-collapsed.png');

  &.is-active {
    background-image: url('../../assets/sub-proxy-expanded.png');
  }
}

.subordinate__title {
  height: 20px;
  margin-bottom: 10px;

  .text--company {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    color: #333;

    line-height: 1;
  }

  .text--type {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    color: #666;

    margin-left: 8px;
    margin-right: 10px;
  }

  .text__link {
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    color: #038ae3;
    text-decoration: underline;
  }
}

.subordinate__cards {
  border: 1px solid #ddd;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);

  background: #fdfdfd;

  .sub__card {
    display: inline-block;
    width: 16.666%;
    padding: 20px;
    box-sizing: border-box;
    position: relative;

    &:not(:last-child):after {
      display: block;
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 1px;
      height: 60px;
      background: #ddd;
    }
  }

  .card__content {
    width: 80px;
    display: inline-block;
    vertical-align: middle;
  }

  .card__text {
    display: inline-block;
    vertical-align: middle;
    width: 100px;
    line-height: 30px;
    font-size: 12px;
    color: #999;
  }

  .card__number {
    display: inline-block;
    vertical-align: middle;
    width: 100px;
    font-size: 20px;
    font-weight: 600;
    color: #999;
  }

  .card__icon {
    display: inline-block;
    vertical-align: middle;

    width: 60px;
    height: 60px;

    margin-right: 20px;

    background-repeat: no-repeat;
    background-position: center center;

    margin-top: 2px;

    &--total {
      background-image: url('../../assets/sub-card-icon-total.png');
    }

    &--inactive {
      background-image: url('../../assets/sub-card-icon-inactive.png');
    }

    &--using {
      background-image: url('../../assets/sub-card-icon-using.png');
    }

    &--stopped {
      background-image: url('../../assets/sub-card-icon-stopped.png');
    }

    &--canceling {
      background-image: url('../../assets/sub-card-icon-canceling.png');
    }

    &--lost {
      background-image: url('../../assets/sub-card-icon-lost.png');
    }
  }
}

.statistics__panel {
  margin-top: 10px;

  .panel__header {
    .header__title {
      font-size: 12px;
      color: #333;
      font-weight: 600;

      margin-right: 12px;
    }

    .header__description {
      margin-right: 10px;
    }

    .text {
      font-size: 12px;
      color: #999;
    }

    .value {
      font-size: 12px;
      color: #333;

      margin-right: 16px;
    }

    .date__input {
      float: right;
    }
  }
}
.outer-link-setting {
  margin: 20px 0 25px -10px;
}
.item {
  display: inline-block;
  margin: 5px 10px;
  font-size: 14px;
  text-align: right;
}
.item-name {
  width: 100px;
}
.search-icon {
  background: url('./../../assets/search.png') no-repeat 0 0;
  background-size: 25px 20px;
}
.item-status {
  color: #b7b7b7;
  width: 160px;
  text-align: left;
}
.item-btn {
  color: #038ae3;
  cursor: pointer;
}
</style>
