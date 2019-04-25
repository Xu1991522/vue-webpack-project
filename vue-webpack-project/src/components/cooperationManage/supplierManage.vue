<template>
  <div @click="menuparameter.show = false">
    <Contextmenu :menuparameter="menuparameter" @selectedchanged="selectedchanged"></Contextmenu>

    <div class="common-top-nav-row">
      <span style="line-height:36px;float:left;margin-right:10px;color: #606266;font-size:14px;">供应商名称</span>
      <el-select v-model="selectsupplier" filterable placeholder="请选择供应商" @change="getProvider">
        <el-option
          :label="'全部供应商'"
          :value="''">
        </el-option>
        <el-option
          v-for="item in providerlist"
          :key="item.id"
          :label="item.name+'('+item.enName+')-'+item.account"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button v-if="access.add" type="info" class="plus-button" size="small" @click="tochangeinfo('add')">添加供应商</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="providerbean"
      :max-height="clientHeight"
      @header-contextmenu="headerclick"
      border style="width: 100%">
      <el-table-column
        prop="name"
        label="通道名称"
        min-width="167">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('通道别名')>-1"
        prop="alias"
        label="通道别名"
        :width="getmaxlength(row => row.alias,'通道别名')">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('所属账户')>-1"
        prop="account"
        label="所属账户"
        :width="getmaxlength(row => row.account,'所属账户')">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('供应商号码')>-1"
        prop="serviceNum"
        label="供应商号码"
        :width="getmaxlength(row => row.account,'供应商号码')">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('联系人')>-1"
        prop="contactor"
        label="联系人"
        :width="getmaxlength(row => row.contactor,'联系人')">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('手机号')>-1"
       prop="mobilePhone"
        label="手机号"
        width="110">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('运营商')>-1"
        label="运营商"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.operator | operator }}
        </template>
      </el-table-column>
       <el-table-column
        v-if="menuparameter.selected.indexOf('创建时间')>-1"
        label="创建时间"
        width="155">
          <template slot-scope="scope">
            <span>{{ scope.row.createOn | time('yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('登录账号')>-1"
        prop="loginAccount"
        label="登录账号"
        :width="getmaxlength(row => row.loginAccount,'登录账号')">
      </el-table-column>
     <el-table-column
        v-if="menuparameter.selected.indexOf('接口信息')>-1"
        label="接口信息"
        width="80">
        <template slot-scope="scope">
          <span @click="showinfo(scope.$index)" style="color:#038ae3;cursor:pointer">查看详情</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="50"
        v-if="access.update"
      >
        <template slot-scope="scope">
          <span style="color:#038ae3;cursor:pointer" @click="tochangeinfo('edit',scope.$index)">修改</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pager.pageIndex"
      :page-sizes="[10, 20, 30, 40,50]"
      :page-size="pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pager.recCount">
    </el-pagination>

    <el-dialog
      title="接口信息"
      :close-on-click-modal="false"
      :visible.sync="infopop"
      width="30%">
      <div style="margin-left:20px;">
          <div v-if="!popupparam.apiAccessKey&&!popupparam.apiSecretKey&&!popupparam.apiUrl">暂无相关接口信息</div>
          <div v-if="popupparam.apiAccessKey || popupparam.apiSecretKey || popupparam.apiUrl">
            <div class="innerinfo">接口key:&nbsp;&nbsp;{{popupparam.apiAccessKey === '' || popupparam.apiAccessKey === null?'---':popupparam.apiAccessKey}}</div>
            <div class="innerinfo">接口秘钥:&nbsp;{{popupparam.apiSecretKey === ''|| popupparam.apiSecretKey === null?'---':popupparam.apiSecretKey}}</div>
            <div class="innerinfo">接口地址:&nbsp;{{popupparam.apiUrl=== ''|| popupparam.apiUrl=== null?'---':popupparam.apiUrl}}</div>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="confirm-button" @click="infopop = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import time from '../../filters/time'

export default {
  data () {
    return {
      loading: true, // 表格加载
      infopop: false, // 信息弹出层
      providerbean: [], // 供应商简要信息列表
      providerlist: [], // 供应商下拉筛选
      selectsupplier: '', // 选择的供应商
      menuparameter: {
        show: false,
        position: {},
        list: ['通道别名', '所属账户', '供应商号码', '联系人', '手机号', '运营商', '创建时间', '登录账号', '接口信息'],
        selected: ['通道别名', '所属账户', '供应商号码', '联系人', '手机号', '运营商', '创建时间', '登录账号', '接口信息']
      }, // 右键菜单参数
      popupparam: {
        apiAccessKey: '',
        apiSecretKey: '',
        apiUrl: ''
      }, // 弹出层参数
      pager: {
        pageIndex: 1,
        pageSize: 10,
        recCount: 0
      }, // 分页
      clientHeight: 0, // 高度
      title: ''// back组件title
    }
  },
  computed: {
    access () {
      const {
        ADD_PROVIDER,
        UPDATE_PROVIDER
      } = this.$store.getters.access

      return {
        add: ADD_PROVIDER,
        update: UPDATE_PROVIDER
      }
    }
  },
  created () {
    this.clientHeight = document.body.clientHeight > 662 ? 550 : 400
    this.listBriefProviders()// 获取所有供应商简要信息
    this.getProvider() // 获取表格
  },
  watch: {
    '$route' (to, from) {
      this.listBriefProviders()// 获取所有供应商简要信息
      this.getProvider() // 获取表格
    }
  },
  methods: {
    getmaxlength (transform, title) {
      let max = 0

      this.providerbean.forEach(el => {
        const realStr = transform(el)

        const temp = realStr ? realStr.replace(/[^0-9a-zA-Z]/g, '--').length : 0
        max = temp > max ? temp : max
      })

      if (title && max < title.replace(/[^0-9a-zA-Z]/g, '--').length) {
        max = title.replace(/[^0-9a-zA-Z]/g, '--').length
      }
      return max * 8 + 21
    },
    getProvider () {
      if (this.selectsupplier !== '') {
        // 获取指定供应商信息
        this.$api.IProviderManager.getProvider({
          id: this.selectsupplier
        }).then(res => {
          // 只有一条
          this.providerbean = []
          this.providerbean.push(res)
          this.pager.pageIndex = 1
          this.pager.pageSize = 10
          this.pager.recCount = 1
        })
      } else {
        // 获取全部供应商信息
        this.$api.IProviderManager.listProviders({
          page: this.pager.pageIndex - 1,
          size: this.pager.pageSize
        }).then(res => {
          this.providerbean = res.content
          this.pager.pageIndex = res.number + 1
          this.pager.pageSize = res.size
          this.pager.recCount = res.totalElements
        })
      }
    },
    listBriefProviders () {
      this.$api.IProviderManager.listBriefProviders({
      }).then(res => {
        this.loading = false
        this.providerlist = res
      })
    },
    selectedchanged (val) {
      this.menuparameter.selected = val
    },
    headerclick (column, event) {
      this.menuparameter.position.clientX = event.clientX
      this.menuparameter.position.clientY = event.clientY
      this.menuparameter.show = true
      event.preventDefault()
    },
    tochangeinfo (type, index) {
      if (type === 'edit') {
        this.$router.push({
          path: '/supplierManage/infoHandle',
          query: {
            title: type === 'edit' ? '修改供应商' : '添加供应商',
            ruleForm: JSON.stringify(this.providerbean[index])
          }
        })
      } else {
        this.$router.push({
          path: '/supplierManage/infoHandle',
          query: {
            title: type === 'edit' ? '修改供应商' : '添加供应商'
          }
        })
      }
    },
    showinfo (index) {
      this.infopop = !this.infopop
      this.popupparam.apiAccessKey = this.providerbean[index].apiAccessKey
      this.popupparam.apiSecretKey = this.providerbean[index].apiSecretKey
      this.popupparam.apiUrl = this.providerbean[index].apiUrl
    },
    handlsearch () {
      alert('组件触发搜索，在这里调接口')
    },
    handleCurrentChange (val) {
      this.pager.pageIndex = val
      this.getProvider()
    },
    handleSizeChange (val) {
      this.pager.pageSize = val
      this.getProvider()
    },
    turnrouter (route) {
      this.$router.push({
        path: route
      })
    }
  },
  filters: {
    time,
    channelStatus: (val) => {
      const status = {
        ENABLED: '启用',
        DISABLED: '关闭'
      }

      return status[val] || val
    },
    operator: val => {
      const operators = {
        CMCC: '中国移动',
        UNICOM: '中国联通',
        CNET: '中国电信'
      }

      return operators[val] || val
    }
  }
}
</script>

<style scoped>
.row-class-name {
  color: red;
}
.plus-button {
  float: right;
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  right: 10px;
  z-index: 99;
  background: #038ae3;
  border: 1px solid #038ae3;
}
.innerinfo {
  margin: 5px 0;
}
</style>
