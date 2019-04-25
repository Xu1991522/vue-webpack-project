<template>
  <div>
    <div class="common-top-nav-rown">
      <el-tabs v-model="type">
        <el-tab-pane label="短信发送" name="smsSend">
          <div>
            <label class="input__label" for="">发送时间</label>
            <el-date-picker
              style="width:150px;"
              v-model="smsCondition.startTime"
              type="date"
              :editable="false"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
            <span style="margin:0 10px;line-height:36px;font-size:14px;color: #606266;">至</span>
            <el-date-picker
              style="width:150px;"
              v-model="smsCondition.endTime"
              :editable="false"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-button
              type="primary"
              size="small"
              @click="handleSearch"
              style="margin-left:15px;"
            >
              搜索
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="$router.push({ path: '/smsRecords/newSMS', query: { title: '新建短信' } })"
              style="float:right;margin:4px 10px 0 0;"
            >
              新建短信
            </el-button>
          </div>

          <el-table
            :data="smsData"
            v-loading="loading"
            tooltip-effect="dark"
            style="width: 100%; max-height: 400px; overflow: auto;margin-top:15px;">
            <el-table-column
              label="发送批次"
              width="160">
              <template slot-scope="scope">
                <el-button type="text"  @click="openSendBatchPopup(scope.row)">{{ scope.row.batchId }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="category"
              label="短信类型"
              width="80">
            </el-table-column>
            <el-table-column
              label="短信内容">
              <template slot-scope="scope">
                {{ scope.row.content == null ? '******' : scope.row.content }}
              </template>
            </el-table-column>
            <el-table-column
              label="发送状态"
              width="80">
              <template slot-scope="scope"><span style="color:#038ae3;">{{ scope.row.successNum }}</span>/{{ scope.row.totalNum }}</template>
            </el-table-column>
            <el-table-column
              label="发送时间"
              width="180">
              <template slot-scope="scope">
                {{ scope.row.sendTime | time('yyyy-MM-dd HH:mm:ss') }}
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            background
            @size-change="handleBatchListSizeChange"
            @current-change="handleBatchListCurrentChange"
            :page-sizes="[10, 20, 30, 40, 50]"
            :current-page="pager.index"
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="pager.size"
            :total="pager.count">>
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="短信接收" name="smsReceive">
          <useage-pane
            :providers="providers"
            :proxies="proxies"
            :operators="operators"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      :fullscreen="false"
      :visible="sendBatchPopup.visible"
      @close="sendBatchPopup.visible = false"
      left
      :width="internal ? '1280px' : '1000px'"
    >
      <div slot="title">{{ sendBatchPopup.target }}发送详情</div>
      <div class="dialog__body">
        <div class="search__div">
          <template v-if="internal">
            <label class="input__label" for="">供应商</label>
            <el-select
              filterable
              v-model="sendBatchPopup.provider"
              placeholder="请选择"
              class="selectBox"
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
          </template>

          <template v-if="internal">
            <label class="input__label" for="">代理商</label>
            <el-select
              filterable
              v-model="sendBatchPopup.proxy"
              placeholder="请选择"
              class="selectBox"
            >
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in proxies"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>

          <label class="input__label" for="">运营商</label>
          <el-select
            v-model="sendBatchPopup.operator"
            filterable
            class="selectBox"
            placeholder="请选择"
          >
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in operators"
              :key="item.value"
              :value="item.value"
              :label="item.value | operator"
            >
            </el-option>
          </el-select>

          <label class="input__label" for="">发送状态</label>
          <el-select
            v-model="sendBatchPopup.sendStatus"
            filterable
            class="selectBox"
            placeholder="请选择"
          >
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in sendStatuses"
              :key="item.value"
              :value="item.value"
              :label="item.value | sendStatus"
            >
            </el-option>
          </el-select>

          <el-input v-model="sendBatchPopup.msisdn" placeholder="请输入卡号" style="width:200px;"></el-input>
          <el-button
            type="primary"
            size="small"
            @click="listSmsSendRecord(1, pager.size)"
            style="margin-left:15px;"
          >
            搜索
          </el-button>
        </div>

        <el-table
          :data="sendBatchPopup.batchData"
          v-loading="sendBatchPopup.loading"
          style="width: 100%"
        >
          <el-table-column
            prop="msisdn"
            label="号码"
            width="240px"
          >
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
            prop="operatorName"
            label="运营商"
            width="240px"
          >
          </el-table-column>
          <el-table-column
            label="发送状态"
            width="240px"
          >
            <template slot-scope="scope">
              {{ scope.row.smsSendStatusDesc | sendStatus }}
            </template>
          </el-table-column>
          <el-table-column
            label="发送时间"
            width="240px"
          >
            <template slot-scope="scope">
              {{ scope.row.sendTime | time('yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          @current-change="handleSendBatchPopupCurrentChange"
          @size-change="handleSendBatchPopupSizeChange"
          :page-sizes="[10, 20, 30, 40,50]"
          :current-page="sendBatchPopup.pager.index"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="sendBatchPopup.pager.size"
          :total="sendBatchPopup.pager.count">
        </el-pagination>

        <div style="width: 0; height: 0; clear: both"></div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import api from '../../api'

import operators from '../../constants/operators'

import time from '../../filters/time'
import operator from '../../filters/operator'

import UseagePane from './receivedSmsRecords'

export default {
  name: 'smsRecords',
  data () {
    return {
      type: 'smsSend',

      smsCondition: {
        startTime: '',
        endTime: ''
      },

      loading: false,

      smsData: [],

      pager: {
        index: 1,
        size: 10,
        count: 0
      },

      sendBatchPopup: {
        visible: false,
        target: '',
        provider: '',
        proxy: '',
        operator: '',
        sendStatus: '',
        msisdn: '',

        loading: false,

        pager: {
          index: 1,
          size: 10,
          count: 0
        },

        batchData: []
      },

      providers: [],
      proxies: [],
      operators,

      sendStatuses: [
        { value: 'SUCCESS' },
        { value: 'ERR_OPID' },
        { value: 'ERR_SOURCE' },
        { value: 'ERR_TARGET' },
        { value: 'ERR_MSG2LONG' },
        { value: 'UNKNOWN' }
      ]
    }
  },
  computed: {
    internal () {
      return this.$store.getters.user.roleBean.label === 'ADMIN'
    }
  },
  methods: {
    fetchProvidersAndProxies () {
      Promise.all([api.IProviderManager.listBriefProviders({}), api.IProxyManager.listBriefProxies({})])
        .then(([providers, proxies]) => {
          this.providers = providers

          this.proxies = proxies
        })
        .catch(err => {
          this.$message({
            type: err.message || '供应商，代理商，搜索条件加载失败'
          })
        })
    },
    handleSearch () {
      this.listSmsSendBatchInfo(1, this.pager.size)
    },
    listSmsSendBatchInfo (index, size) {
      // issue: https://github.com/ElemeFE/element/pull/10247
      // size-change will trigger current-change
      // just fetch once
      if (this.loading) {
        return
      }

      const { startTime, endTime } = this.smsCondition

      const params = {
        page: index - 1,
        size
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

        params.startTime = d1

        // set the end of a day, 24 * 60 * 60 = 86400s
        params.endTime = d2 + 86400 * 1000
      }

      this.loading = true

      api.ISmsManager.listSmsSendBatchInfo(params)
        .then(res => {
          if (res.code === 1000) {
            return res.smsBatchInfoList || {
              number: index - 1,
              size,
              content: [],
              totalElements: 0
            }
          }

          return Promise.reject(Error(res.msg))
        })
        .then(res => {
          this.smsData = res.content

          this.pager = {
            index: res.number + 1,
            size: res.size,
            count: res.totalElements
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '发送批次查询失败'
          })
        })
        .then(() => {
          this.loading = false
        })
    },
    handleBatchListCurrentChange (val) {
      this.listSmsSendBatchInfo(val, this.pager.size)
    },

    handleBatchListSizeChange (val) {
      this.listSmsSendBatchInfo(1, val)
    },

    openSendBatchPopup (row) {
      this.sendBatchPopup = {
        visible: true,
        target: row.batchId,
        operator: '',
        sendStatus: '',
        msisdn: '',

        loading: true,

        pager: {
          index: 1,
          size: 10,
          count: 0
        },

        batchData: []
      }

      this.listSmsSendRecord(1, this.sendBatchPopup.pager.size)
    },
    listSmsSendRecord (index, size) {
      api.ISmsManager.listSmsSendRecord({
        supplierId: this.sendBatchPopup.provider || null,
        clientId: this.sendBatchPopup.proxy || null,
        operator: this.sendBatchPopup.operator || null,
        sendStatus: this.sendBatchPopup.sendStatus || null,
        msisdn: this.sendBatchPopup.msisdn,
        batchId: this.sendBatchPopup.target,
        page: index - 1,
        size
      })
        .then(res => {
          if (res.code === 1000) {
            return res.smsSendRecordList || {
              number: index - 1,
              size,
              content: [],
              totalElements: 0
            }
          }

          return Promise.reject(Error(res.msg))
        })
        .then(res => {
          this.sendBatchPopup.loading = false

          this.sendBatchPopup.pager = {
            index: res.number + 1,
            size: res.size,
            count: res.totalElements
          }

          this.sendBatchPopup.batchData = res.content
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '发送详情查询失败'
          })
        })
    },
    handleSendBatchPopupCurrentChange (val) {
      this.listSmsSendRecord(val, this.sendBatchPopup.pager.size)
    },
    handleSendBatchPopupSizeChange (val) {
      this.listSmsSendRecord(1, val)
    }
  },
  created () {
    this.internal && this.fetchProvidersAndProxies()

    this.listSmsSendBatchInfo(1, this.pager.size)
  },
  filters: {
    time,
    operator,
    sendStatus (status) {
      const sendStatuses = {
        SUCCESS: '成功',
        ERR_OPID: '运营商标识错误',
        ERR_SOURCE: '发送方地址错误',
        ERR_TARGET: '接收方手机号码错误',
        ERR_MSG2LONG: '短信内容超长',
        UNKNOWN: '未知'
      }

      return sendStatuses[status] || sendStatuses.UNKNOWN
    }
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
  .input__label {
    float: left;
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
    color: #606266;
  }
  .el-se {
    width: 15% !important;
  }
  .selectBox{
    margin: 0 20px 0 10px;
    width: 150px;
  }
  .dialog__body{
    min-height:250px;
  }
  .search__div{
    margin-bottom: 25px;
  }
</style>
