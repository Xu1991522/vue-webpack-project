<template>
  <!-- 卡库存管理 -->
  <div @click="menuparameter.show = false">
    <div class="common-top-nav-rown">
      <div class="labelHead">
        <label class="input__label" for="">供应商名称</label>
        <el-select
          v-model="provider"
          filterable
          class="selectBox"
          placeholder="请选择" style="width:150px;">
          <el-option key="" label="全部" value=""></el-option>
          <el-option
            v-for="item in providers"
            :key="item.id"
            :label="item.name + '(' + item.enName + ')-' + item.account"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <label class="input__label" for="">运营商</label>
        <el-select
          v-model="operator"
          filterable
          class="selectBox"
          placeholder="请选择"
        >
          <el-option key="" label="全部" value=""></el-option>
          <el-option
            v-for="item in operators"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <label class="input__label" for="">库存状态</label>
        <el-select
          v-model="status"
          placeholder="请选择"
          class="selectBox"
        >
          <el-option key="" label="全部" value=""></el-option>
          <el-option
            v-for="item in statuses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-button
          type="primary"
          size="small"
          @click="listPageInWareHouseByCondition(1, pager.size)"
          style="margin-top:3px;"
        >
          查询
        </el-button>
        <el-button
          @click="openMultipleDeliverPopup"
          v-if="access.deliver && Object.keys(multipleSelection).length > 0"
          :disabled="Object.values(multipleSelection).some(x => x.status !== '待出库')"
          type="primary" size="small"
          style="width: 150px;  padding-left: 8px;font-size: 12px;">
          批量出库 （已选择<label>{{ Object.keys(multipleSelection).length }}</label>条）
        </el-button>

        <el-button
          v-if="access.stock"
          @click="openFileStockPopup"
          type="primary"
          size="small"
          class="inStore">
          导卡入库
        </el-button>

        <el-button
          v-if="access.deliver"
          @click="openFileDeliverPopup"
          type="primary"
          size="small"
          class="inStore">
          导卡出库
        </el-button>
      </div>
    </div>
    <Contextmenu :menuparameter="menuparameter" @selectedchanged="selectedchanged"></Contextmenu>
    <el-table
      border
      ref="multipleTable"
      :data="cardStock"
      v-loading="loading"
      tooltip-effect="dark"
      style="width: 100%;margin-top:15px;"
      @header-contextmenu="headerclick"
      empty-text="暂无相关卡信息"
      @select-all="handleAllSelectionChange"
    >
      <el-table-column
        v-if="access.deliver"
        type="selection"
        width="55"
      >
        <template slot-scope="scope">
          <el-checkbox :key="scope.row.iccid" :value="!!multipleSelection[scope.row.iccid]" @change="toggleSelect(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('操作')>-1"
        label="操作"
        width="55">
        <template slot-scope="scope">
          <span
            v-if="access.deliver && scope.row.cardStatusName !== '已出库'"
            @click="openSingleDeliverPopup(scope.row)"
            style="color:#038ae3;cursor:pointer"
          >
            出库
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('卡号')>-1"
        :width="cardStock.every((el)=>el.cardNumber===''||el.cardNumber===null)?'60':'160'"
        prop="cardNumber"
        label="卡号">
      </el-table-column>
      <el-table-column
        prop="iccid"
        label="ICCID"
        :min-width="cardStock.every((el)=>el.iccid===''||el.iccid===null)?'60':'200'">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('供应商名称/账号')>-1"
        label="供应商名称/账号"
        :min-width="cardStock.every((el)=>el.providerName===''||el.providerName===null)?'160':'160'"
      >
        <template slot-scope="scope">
          {{ scope.row.providerName + '/' + scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('运营商')>-1"
        width="80"
        prop="operatorName"
        label="运营商">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('库存状态')>-1"
        prop="cardStatusName"
        label="库存状态"
        width="80"
      >
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('开卡时间')>-1"
        label="开卡时间"
        :width="cardStock.every((el)=>el.openDate===''||el.openDate===null)?'80':'160'"
      >
        <template slot-scope="scope">
          {{ scope.row.openDate | time('yyyy-MM-dd HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('入库时间')>-1"
        label="入库时间"
        :width="cardStock.every((el)=>el.putInDate===''||el.putInDate===null)?'80':'160'"
      >
        <template slot-scope="scope">
          {{ scope.row.putInDate | time('yyyy-MM-dd HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('出库时间')>-1"
        label="出库时间"
        :width="cardStock.every((el)=>el.deliverDate===''||el.deliverDate===null)?'80':'160'"
      >
        <template slot-scope="scope">
          {{ scope.row.deliverDate | time('yyyy-MM-dd HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40,50]"
      :current-page="pager.index"
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="pager.size"
      :total="pager.count">
    </el-pagination>

    <el-dialog
      show-close
      title="出库"
      :fullscreen="false"
      :visible="singleDeliverPopup.visible"
      @close="singleDeliverPopup.visible = false"
      width="500px"
      left
    >
      <el-form style="width:90%;margin:0 auto;">
        <el-form-item label="iccid">
          {{ singleDeliverPopup.target }}
        </el-form-item>
        <el-form-item label="选择代理">
          <el-select v-model="singleDeliverPopup.agent" filterable placeholder="请选择代理商">
            <el-option v-for="item in agents" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费类型">
          <el-radio-group v-model="singleDeliverPopup.charge">
            <el-radio v-for="item in charges" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="singleDeliverPopup.visible = false">取 消</el-button>
        <el-button type="primary" @click="singleDeliver">出 库</el-button>
      </span>
    </el-dialog>

    <el-dialog
      show-close
      title="导卡出库"
      :visible="multipleDeliverPopup.visible"
      @close="multipleDeliverPopup.visible = false"
      width="500px"
      left
    >
      <div style="margin:0 auto;width:90%;">
        <el-form>
          <el-form-item label="出库条数">
            {{ Object.keys(multipleSelection).length }} 张
          </el-form-item>
          <el-form-item label="选择代理">
            <el-select v-model="multipleDeliverPopup.agent" filterable placeholder="请选择代理商">
              <el-option v-for="item in agents" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费类型">
            <el-radio-group v-model="multipleDeliverPopup.charge">
              <el-radio v-for="item in charges" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="multipleDeliverPopup.visible = false">取 消</el-button>
        <el-button type="primary" @click="multipleDeliver">出 库</el-button>
      </span>
    </el-dialog>

    <el-dialog
      show-close
      title="导卡导卡出库"
      :visible="fileDeliverPopup.visible"
      @close="fileDeliverPopup.visible = false"
      width="500px"
      left
    >
      <div style="margin:0 auto;width:90%;">
        <el-form
          :label-position="labelPosition"
          label-width="80px" ref="form"
          :model="fileDeliverPopup">
          <el-form-item label="下载模板">
            <a class="download" target="_black" href="./download/temp_out_store.xlsx">出库模板文件</a>
          </el-form-item>
          <el-form-item label="添加文件">
            <el-upload
              action="/portal-srv/upload/cardsFile"
              :file-list="fileDeliverPopup.files"
              :show-file-list="false"
              :before-upload="handleBeforeUpload('deliver')"
              :on-progress="handleUploadProgress('deliver')"
              :on-success="handleUploadSuccess('deliver')"
              :on-error="handleUploadError('deliver')"
            >
              <el-input :disabled="true" :value="files.deliver.name" style="width: 230px; margin-right: 10px"></el-input>
              <el-button size="small" class="download" type="text">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="选择代理">
            <el-select v-model="fileDeliverPopup.agent" filterable placeholder="请选择代理商">
              <el-option v-for="item in agents" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费类型">
            <el-radio-group v-model="fileDeliverPopup.charge">
              <el-radio v-for="item in charges" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileDeliverPopup.visible = false">取 消</el-button>
        <el-button type="primary" @click="fileDeliver">出 库</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="导卡入库"
      show-close
      :visible="fileStockPopup.visible"
      @close="fileStockPopup.visible = false"
      width="500px"
      left>
      <div style="width:90%;margin:0 auto">
        <el-form>
          <el-form-item label="下载模板">
            <a class="download" target="_black" href="./download/temp_in_store.xlsx">&emsp;入库模板文件</a>
          </el-form-item>
          <el-form-item label="添加文件">
            <el-upload
              action="/portal-srv/upload/cardsFile"
              :file-list="fileStockPopup.files"
              :show-file-list="false"
              :before-upload="handleBeforeUpload('stock')"
              :on-progress="handleUploadProgress('stock')"
              :on-success="handleUploadSuccess('stock')"
              :on-error="handleUploadError('stock')"
            >
              <el-input :disabled="true" :value="files.stock.name" style="width: 230px; margin-right: 10px;margin-left:14px"></el-input>
              <el-button size="small" type="text">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="选择供应商">
            <el-select filterable v-model="fileStockPopup.provider" placeholder="请选择供应商">
              <el-option v-for="item in providers" :key="item.id" :label="item.name + '(' + item.enName + ')-' + item.account" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileStockPopup.visible = false">取 消</el-button>
        <el-button type="primary" @click="fileStock">入 库</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /*
    eval hacks

    1. when one el-checkbox checked state change, trigger all checked state to change
    this.$refs.multipleTable.toggleRowSelection(x, true)

    2. when turn back to some page, restore checked state
    see listPageInWareHouseByCondition
  */

  import Vue from 'vue'

  import api from '../../api'

  import time from '../../filters/time'

  export default {
    name: '',
    data () {
      return {
        loading: true, // 表格加载

        provider: '',
        providers: [],

        agent: '',
        agents: [],

        operator: '',
        operators: [
          { value: 'CMCC', label: '中国移动' },
          { value: 'UNICOM', label: '中国联通' },
          { value: 'CNET', label: '中国电信' }
        ],

        status: '',
        statuses: [
          { value: 'WAITING_TO_DELIVER', label: '待出库' },
          { value: 'DELIVERED', label: '已出库' },
          { value: 'ABANDON', label: '已废弃' }
        ],

        cardStock: [],

        pager: {
          index: 1,
          size: 10,
          count: 0
        },

        multipleSelection: {},

        charges: [
          { label: '流量共享', value: 'FLOW_SHARED' },
          { label: '单卡计费', value: 'SINGLE_CARD' }
        ],

        menuparameter: {
          show: false,
          position: {},
          list: ['操作', '卡号', '供应商名称/账号', '运营商', '库存状态', '开卡时间', '入库时间', '出库时间'],
          selected: ['操作', '卡号', '供应商名称/账号', '运营商', '库存状态', '开卡时间', '入库时间', '出库时间']
        }, // 右键菜单参数
        centerDialogVisible: false,
        outDialogVisible: false,

        labelPosition: 'right',

        inStoreForm: {},

        singleDeliverPopup: {
          visible: false,
          target: '',
          agent: '',
          charge: '',
          submitting: false
        },

        multipleDeliverPopup: {
          visible: false,
          agent: '',
          charge: '',
          submitting: false
        },

        fileDeliverPopup: {
          visible: false,
          agent: '',
          files: [],
          charge: '',
          submitting: false
        },

        fileStockPopup: {
          visible: false,
          files: [],
          provider: '',
          submitting: false
        },

        files: {
          deliver: {
            name: '',
            progress: '',
            url: ''
          },
          stock: {
            name: '',
            progress: '',
            url: ''
          }
        }
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      access () {
        const {
          STOCK_CARDS,
          DELIVER_CARDS
        } = this.$store.getters.access

        return {
          stock: STOCK_CARDS,
          deliver: DELIVER_CARDS
        }
      }
    },
    methods: {
      handleBeforeUpload (prop) {
        return (file) => {
          this.files[prop].name = file.name

          return true
        }
      },
      handleUploadProgress (prop) {
        return (e, file) => {
          if (e.lengthComputable) {
            this.files[prop].progress = e.percent
          }
        }
      },
      handleUploadSuccess (prop) {
        return (res, file) => {
          this.files[prop].url = res
        }
      },
      handleUploadError (prop) {
        return (err, file) => {
          this.$message({
            type: 'error',
            message: err.message || '文件上传失败'
          })

          this.files[prop] = {
            name: '',
            progress: '',
            url: ''
          }
        }
      },

      openSingleDeliverPopup (row) {
        this.singleDeliverPopup = {
          visible: true,
          target: row.iccid,
          agent: '',
          charge: '',
          submitting: false
        }
      },
      singleDeliver () {
        if (this.singleDeliverPopup.submitting) {
          return
        }

        const { target, agent, charge } = this.singleDeliverPopup

        if (!agent) {
          return this.$message({
            type: 'error',
            message: '请选择代理商'
          })
        }

        if (!charge) {
          return this.$message({
            type: 'error',
            message: '请选择计费类型'
          })
        }

        this.singleDeliverPopup.submitting = true

        api.ICardStoreManager.deliver({ iccids: [target], proxyId: agent, chargeType: charge })
          .then(res => {
            if (!res) {
              return Promise.reject(Error(res))
            }

            this.$message({
              type: 'success',
              message: '操作成功'
            })

            const selectedInMultipleSelection = !!this.multipleSelection[target]

            if (selectedInMultipleSelection) {
              Vue.delete(this.multipleSelection, target)
            }

            this.singleDeliverPopup.submitting = false
            this.singleDeliverPopup.visible = false

            this.listPageInWareHouseByCondition(1, this.pager.size)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '操作失败'
            })

            console.log(err)

            this.singleDeliverPopup.submitting = false
          })
      },

      openMultipleDeliverPopup () {
        this.multipleDeliverPopup = {
          visible: true,
          agent: '',
          charge: '',
          submitting: false
        }
      },
      multipleDeliver () {
        if (this.multipleDeliverPopup.submitting) {
          return
        }

        const { agent, charge } = this.multipleDeliverPopup

        if (!agent) {
          return this.$message({
            type: 'error',
            message: '请选择代理商'
          })
        }

        if (!charge) {
          return this.$message({
            type: 'error',
            message: '请选择计费类型'
          })
        }

        this.multipleDeliverPopup.submitting = true

        const iccids = Object.keys(this.multipleSelection)

        api.ICardStoreManager.deliver({ iccids, proxyId: agent, chargeType: charge })
          .then(res => {
            if (!res) {
              return Promise.reject(Error(res))
            }

            this.$message({
              type: 'success',
              message: '操作成功'
            })

            // clear selected cards
            this.multipleSelection = {}

            this.multipleDeliverPopup.submitting = false
            this.multipleDeliverPopup.visible = false

            this.listPageInWareHouseByCondition(1, this.pager.size)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '操作失败'
            })

            console.log(err)

            this.multipleDeliverPopup.submitting = false
          })
      },

      openFileDeliverPopup () {
        this.fileDeliverPopup = {
          visible: true,
          agent: '',
          files: [],
          charge: '',
          submitting: false
        }

        this.files.deliver = {
          name: '',
          progress: '',
          url: ''
        }
      },
      fileDeliver () {
        if (this.fileDeliverPopup.submitting) {
          return
        }

        const file = this.files.deliver

        if (!file.name) {
          return this.$message({
            type: 'error',
            message: '请添加文件'
          })
        }

        if (!file.url) {
          return this.$message({
            type: 'error',
            message: '请等待文件上传完毕'
          })
        }

        const { agent, charge } = this.fileDeliverPopup

        if (!agent) {
          return this.$message({
            type: 'error',
            message: '请选择代理商'
          })
        }

        if (!charge) {
          return this.$message({
            type: 'error',
            message: '请选择计费类型'
          })
        }

        this.fileDeliverPopup.submitting = true

        api.ICardStoreManager.deliverByFile({ fileUrl: file.url, proxyId: agent, chargeType: charge })
          .then(res => {
            if (!res) {
              return Promise.reject(Error(res))
            }

            this.$message({
              type: 'success',
              message: '操作成功'
            })

            this.fileDeliverPopup.submitting = false
            this.fileDeliverPopup.visible = false

            this.listPageInWareHouseByCondition(1, this.pager.size)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '操作失败'
            })

            console.log(err)

            this.fileDeliverPopup.submitting = false
          })
      },

      openFileStockPopup () {
        this.fileStockPopup = {
          visible: true,
          files: [],
          provider: '',
          submitting: false
        }

        this.files.stock = {
          name: '',
          progress: '',
          url: ''
        }
      },

      fileStock () {
        if (this.fileStockPopup.submitting) {
          return
        }

        const file = this.files.stock

        if (!file.name) {
          return this.$message({
            type: 'error',
            message: '请添加文件'
          })
        }

        if (!file.url) {
          return this.$message({
            type: 'error',
            message: '请等待文件上传完毕'
          })
        }

        const { provider } = this.fileStockPopup

        if (!provider) {
          return this.$message({
            type: 'error',
            message: '请选择供应商'
          })
        }

        this.fileStockPopup.submitting = true

        api.ICardStoreManager.putInByFile({ fileUrl: file.url, providerId: provider })
          .then(res => {
            if (!res) {
              return Promise.reject(res)
            }

            this.$message({
              type: 'success',
              message: '操作成功'
            })

            this.fileStockPopup.submitting = false
            this.fileStockPopup.visible = false

            // reload table data
            // think order of items in table
            this.listPageInWareHouseByCondition(1, this.pager.size)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '操作失败'
            })

            // cause message may be too long, hide concreate message
            console.log(err)

            this.fileStockPopup.submitting = false
          })
      },

      selectedchanged (val) {
        this.menuparameter.selected = val
      },
      // Card stock data
      listPageInWareHouse (index, size) {
        api.ICardStoreManager.listPageInWareHouse({
          page: index - 1,
          size
        }).then(res => {
          this.loading = false
          this.cardStock = res.content

          this.pager = {
            index: res.number + 1,
            size: res.size,
            count: res.totalElements
          }
        })
      },
      // list card stock status && proxy && operator
      listPageInWareHouseByCondition (index, size) {
        const params = {
          page: index - 1,
          size,
          providerId: this.provider || null,
          operator: this.operator || null,
          cardStoreStatus: this.status || null
        }

        api.ICardStoreManager.listPageInWareHouseByCondition(params)
          .then(res => {
            this.cardStock = res.content

            this.pager = {
              index: res.number + 1,
              size: res.size,
              count: res.totalElements
            }

            // restore selected state
            Vue.nextTick(() => {
              this.cardStock.forEach(x => {
                const checked = !!this.multipleSelection[x.iccid]

                if (checked) {
                  this.$refs.multipleTable.toggleRowSelection(x, true)
                }
              })
            })
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取库存信息失败'
            })
          })
      },
      handleAllSelectionChange (selection) {
        const checkedKeys = selection.reduce((acc, x) => ({ ...acc, [x.iccid]: 1 }), {})

        this.cardStock.forEach(x => {
          const id = x.iccid
          const checked = !!checkedKeys[id]

          if (checked) {
            Vue.set(this.multipleSelection, id, { id, status: x.cardStatusName })
          } else {
            Vue.delete(this.multipleSelection, id)
          }
        })
      },

      toggleSelect (row) {
        const id = row.iccid

        const checked = this.multipleSelection[id]

        if (!checked) {
          Vue.set(this.multipleSelection, id, { id, status: row.cardStatusName })
        } else {
          Vue.delete(this.multipleSelection, id)
        }

        // update all selected state
        this.$refs.multipleTable.toggleRowSelection(row, !checked)
      },

      headerclick (column, event) {
        this.menuparameter.position.clientX = event.clientX
        this.menuparameter.position.clientY = event.clientY
        this.menuparameter.show = true
        event.preventDefault()
      },

      fetchProviders () {
        api.IProviderManager.listBriefProviders({})
          .then(res => {
            this.providers = res
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取供应商选项失败'
            })
          })
      },
      fetchAgents () {
        // only get 1st proxies
        api.IProxyManager.getOnlyFirstProxylist({ proxyId: this.user.id })
          .then(res => {
            this.agents = res
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取代理商选项失败'
            })
          })
      },

      handleCurrentChange (val) {
        this.listPageInWareHouseByCondition(val, this.pager.size)
      },
      handleSizeChange (val) {
        this.listPageInWareHouseByCondition(1, val)
      }
    },
    created () {
      // fetch stock table data
      this.listPageInWareHouse(1, this.pager.size)

      // fetch provider search options
      this.fetchProviders()

      // fetch agent select options when delivery cards
      this.fetchAgents()
    },
    filters: {
      time
    }
  }
</script>

<style scoped>
  .labelHead{
    border: 1px solid #ebeef5;
    padding: 15px 10px 25px 10px;
    height: 36px;
    line-height: 36px;
  }
  .btn_block{
    display: inline;
  }

  .input__label {
    float: left;
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
    color: #606266;
  }

  .selectBox{
    margin: 0 20px 0 10px;
    width: 110px;
  }

  .inStore{
    float: right;
    margin: 2px 15px 0 0;
  }
  .inStore-title{
    background-color: #606266;
    color: #fff;
    left: 0px;
    top: 0px;
    padding: 10px 0px 10px 0px;
  }
  .titleName{
    display: inline-block;
    margin-left:15px;
    }
  /* .footer-con{
    display: inline-block;
    margin-right: 20px;
  } */
  .inStore-center{
    position: relative;
    width: 92%;
    margin: 20px auto;
  }
  .download{
    display: inline-block;
    color:#038ae3;
    cursor: pointer;
  }
</style>
