<template>
  <div v-if="flase" class="container--home">
    <div class="total__container">
      <div class="total__left">
        <div class="total__title total__title--all">总卡数</div>
        <div class="total__content">
          <span class="total__text">{{ total }}</span>
          <span class="total__unit">（张）</span>
        </div>
      </div>

      <div class="total__right">
        <div class="total__title total__title--stock">库存待出库</div>
        <div class="total__content">
          <span class="total__type total__type--cmcc" title="移动">{{ stock.CMCC ? stock.CMCC.inStore : 0 }} </span>
          <span class="total__type total__type--unicom" title="联通">{{ stock.UNICOM ? stock.UNICOM.inStore : 0 }} </span>
          <span class="total__type total__type--cnet" title="电信">{{ stock.CNET ? stock.CNET.inStore : 0 }} </span>
        </div>
      </div>
    </div>

    <div class="section__title">卡数量</div>

    <div class="pie__container">
      <div class="pie__item">
        <div class="pie__header">移动各状态卡数</div>
        <div class="pie__body">
          <div class="pie__wrapper pie__wrapper--cmcc"></div>
        </div>
      </div>

      <div class="pie__item">
        <div class="pie__header">联通各状态卡数</div>
        <div class="pie__body">
          <div class="pie__wrapper pie__wrapper--unicom"></div>
        </div>
      </div>

      <div class="pie__item">
        <div class="pie__header">电信各状态卡数</div>
        <div class="pie__body">
          <div class="pie__wrapper pie__wrapper--cnet"></div>
        </div>
      </div>
    </div>

    <div class="section__title">月用量</div>

    <div class="flow__container">
      <div class="flow__header">
        <el-date-picker
          v-model="date"
          type="month"
          placeholder="选择日期"
          class="date__input"
          @change="fetchMonthFlowValues"
        />
      </div>
      <div class="flow__body">
        <div class="graph__wrapper--flow"></div>
      </div>
    </div>
  </div>
  <h1 v-else>to be continued</h1>
</template>

<script>
  import echarts from 'echarts'

  import api from '../../api'

  import daysOfMonth from '../../helpers/days-of-month'
  import flatten from '../../helpers/flatten'

  import time from '../../filters/time'

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

  const categories = {
    WAITING_TO_ACTIVATE: 'inactive',
    USING: 'using',
    STOPPED: 'stopped',
    APPOINT_TO_CANCEL_ACCOUNT: 'canceling',
    LOST: 'lost'
  }

  // const categories = {
  //   0: 'unknown',
  //   1: 'inactive',
  //   2: 'using',
  //   3: 'stopped',
  //   4: 'canceling',
  //   5: 'lost'
  // }

  // case: [{}, null, null, ..., null]
  const collect = cards => cards.reduce(
    (acc, x) => !x ? acc : { ...acc, [categories[x.category]]: x.count, total: acc.total + x.count },
    { total: 0, ...Object.keys(categories).reduce((acc, x) => ({ ...acc, [categories[x]]: 0 }), {}) }
  )

  export default {
    name: 'home',
    data () {
      return {
        total: 0,
        stock: {},
        date: new Date()
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      internal () {
        return this.user.roleBean.label === 'ADMIN'
      }
    },
    methods: {
      fetchCardStockCounts () {
        api.ICardManager.getSummary({})
          .then(res => {
            this.total = res.total
            this.stock = res.countByOperator.reduce((acc, x) => ({ ...acc, [x.label]: x }), {})

            res.countByOperator.forEach(x => this.renderStatusPieGraph(x.label, collect(x.countInCategory)))
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取库存数量失败'
            })
          })
      },
      fetchMonthFlowValues (date) {
        const d = new Date(date)

        ;(this.internal
          ? api.IProxyManager.getHomeFlowCountInMonth({ proxyId: this.user.id, month: +d })
          : api.IProxyManager.getFlowCountInMonth({ proxyId: this.user.id, month: +d })
        )
          .then(res => {
            this.renderDailyFlowGraph(daysOfMonth(d), res)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取月流量趋势数据失败'
            })
          })
      },
      renderStatusPieGraph (key, counts) {
        if (!this.charts) {
          return
        }

        this.charts && this.charts[key] && this.charts[key].dispose()

        const arr = ['inactive', 'using', 'stopped', 'canceling', 'lost']

        const items = arr.map(x => ({ value: counts[x], name: names[x], label: x }))

        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            x: 'center',
            y: 'bottom',
            data: arr.map(x => ({ name: names[x], icon: 'circle' }))
          },
          series: [
            {
              name: '各状态卡数',
              type: 'pie',
              radius: '60%',
              center: ['50%', '45%'],
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

        const el = this.$el.querySelector('.pie__wrapper--' + key.toLowerCase())

        const chart = echarts.init(el)

        chart.setOption(option)

        this.charts[key] = chart
      },
      renderDailyFlowGraph (days, flow) {
        if (!this.charts) {
          return
        }

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
      }
    },
    created () {
      /*
      this.charts = {}

      this.fetchCardStockCounts()
      this.fetchMonthFlowValues(this.date)
      */
    },
    beforeDestroy () {
      Object.keys(this.charts).forEach(k => {
        if (this.charts[k]) {
          this.charts[k].dispose()

          this.charts[k] = null
        }
      })

      this.charts = null
    }
  }
</script>

<style lang="scss" scoped>
  .container--home {
    padding-right: 10px
  }

  .total__container {
    overflow: hidden;
    text-align: left;
    padding: 20px 0;

    border: 1px solid #ddd;
    box-shadow: 0 0 1px rgba(0, 0, 0, .1);
  }

  .total__left {
    float: left;
    width: 200px;
    padding: 0 50px;

    border-right: 1px solid #ddd;
  }

  .total__right {
    width: 100%;
    margin-left: 300px;
    padding-left: 50px;
  }

  .total__title {
    padding-left: 30px;
    background-repeat: no-repeat;
    background-position: left center;

    line-height: 40px;
    font-size: 16px;
    color: #555;

    &--all {
      background-image: url('../../assets/total-icon.png');
    }

    &--stock {
      background-image: url('../../assets/stock-icon.png');
    }
  }

  .total__content {
    line-height: 40px;
    font-size: 20px;
    color: #222;
  }

  .total__text {
    display: inline-block;
  }

  .total__unit {
    display: inline-block;
    font-size: 13px;
    vertical-align: bottom;
  }

  .total__type {
    display: inline-block;
    padding-right: 35px;
    background-repeat: no-repeat;
    background-position: right center;

    margin-right: 20px;

    &--cmcc {
      background-image: url('../../assets/cmcc.png');
    }

    &--cnet {
      background-image: url('../../assets/cnet.png');
    }

    &--unicom {
      background-image: url('../../assets/unicom.png');
    }
  }

  .section__title {
    font-size: 18px;
    margin: 15px 0;
    color: #222;
    font-weight: 600;
  }

  .pie__container {
    border: 1px solid #ddd;
    box-shadow: 0 0 1px rgba(0, 0, 0, .1);
  }

  .pie__item {
    display: inline-block;
    box-sizing: border-box;
    width: 33%;

    &:nth-child(2) {
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }
  }

  .pie__header {
    font-size: 16px;
    color: #222;
    padding: 10px 20px;
  }

  .pie__wrapper {
    height: 260px
  }

  .graph__wrapper--flow {
    height: 400px;

    canvas {
      height: 100%;
    }
  }
</style>
