<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="20%"
      :before-close="handleClose">
      <span class="popup-text-top">您确定开通代理商账户?</span>
      <div class="popup-text-bottom">此开通账户操作不可逆</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrgCategory">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="opened">
      <div class="top">
      <div class="value-container">
        <div class="icon-style icon-moneybag"></div>
        <div class="text">账户余额</div>
        <div class="value-num">¥{{OrganizationBean.balance}}</div>
      </div>
      <div class="right-bottom-container">
        <el-button class="charge" @click="withdrawall">全部提现</el-button>
      </div>
      </div>
      <div class="middle-line"></div>
      <div class="bottom">
        <div class="title">余额明细</div>
        <div class="search-row">
          <span class="search-type">渠道商名称</span>
          <el-select v-model="distributorId" placeholder="请选择渠道商" @change="listBrokerOrders">
            <el-option
              label="全部渠道商"
              value="">
            </el-option>
            <el-option
              v-for="item in BrokerOrderlist"
              :key="item.distributorId"
              :label="item.distributorName"
              :value="item.distributorId">
            </el-option>
          </el-select>
          <span class="racleicon reverse" @click="listOrdersByConditions('referesh')"></span>
          <span class="racleicon donwload"></span>
        </div>
        <el-table
            :data="brokerOrderBeans"
            v-loading="loading"
            :max-height="clientHeight"
            border
            style="width: 100%;margin-top:10px;">
            <el-table-column
            label="渠道商"
            :min-width="brokerOrderBeans.every((el)=>el.distributorName===''||el.distributorName===null)?'90':'200'">
                <template slot-scope="scope">
                  {{scope.row.distributorName === ''||scope.row.distributorName === null?'-':scope.row.distributorName}}
                </template>
            </el-table-column>
            <el-table-column
            label="关联销售"
            :min-width="brokerOrderBeans.every((el)=>el.salerName===''||el.salerName===null)?'90':'200'">
                <template slot-scope="scope">
                  {{scope.row.salerName === ''||scope.row.salerName === null?'-':scope.row.salerName}}
                </template>
            </el-table-column>
            <el-table-column
            label="可提金额"
            :min-width="brokerOrderBeans.every((el)=>el.amount===''||el.amount===null)?'90':'180'">
                <template slot-scope="scope">
                  {{scope.row.amount === ''||scope.row.amount === null?'-':'¥'+scope.row.amount}}
                </template>
            </el-table-column>
            <el-table-column
            label="操作"
            min-width="140">
                <template slot-scope="scope">
                  <el-button type="text" @click="towithdraw(scope.row.distributorId)">提现</el-button>
                  <el-button type="text" @click="todetail(scope.row.distributorId)">交易明细</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40,50]"
          :current-page="pager.pageIndex"
          layout="sizes, prev, pager, next"
          :page-size="pager.pageSize"
          :total="pager.recCount">
        </el-pagination>
      </div>
    </div>
    <!--未开通-->
    <div v-if="!opened" class="no-proxy">
      <div class="remind-text"></div>
      <el-button @click="dialogVisible = !dialogVisible" class="openbutton">开通渠道商账</el-button>
    </div>
  </div>
</template>

<script>
import * as fecha from 'element-ui/lib/utils/date'
import api from '../../api'
export default {
  data () {
    return {
      opened: false,
      dialogVisible: false,
      loading: true, // 表格加载
      clientHeight: 0, // 高度
      distributorId: '', // 查询渠道商ID
      BrokerOrderlist: [], // 获取关联渠道商列表
      brokerOrderBeans: [], // 展示代理商余额明细
      OrganizationBean: {
        balance: ''
      },
      pager: {
        pageIndex: 1,
        pageSize: 10,
        recCount: 0
      } // 分页
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  created () {
    this.clientHeight = document.body.clientHeight >= 794 ? 550 : 160
    this.getOrg()
  },
  methods: {
    addOrgCategory () {
      api.IAccountManager.addOrgCategory({
        orgId: this.user.orgId,
        orgCategory: 'BROKER'
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: '开通成功'
          })
          this.dialogVisible = !this.dialogVisible
          window.location.reload()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '开通失败'
          })
        })
    },
    towithdraw (distributorId) {
      this.$router.push({
        path: 'proxy/withdraw',
        query: {
          distributorId: distributorId,
          orgCategory: 'BROKER'
        }
      })
    },
    todetail (distributorId) {
      // this.$router.push({
      //   path: 'proxy/detail',
      //   query: {
      //     title: '交易明细',
      //     distributorId: distributorId
      //   }
      // })
    },
    getOrg () {
      api.IAccountManager.getOrg({
        orgId: this.user.orgId
      })
        .then(res => {
          // 是否已开通
          this.opened = res.orgCategory === 'BROKER'
          if (res.orgCategory === 'BROKER') {
            this.OrganizationBean.balance = res.distributorBalance || res.brokerBalance
            this.listBrokerOrdersInfo()
            this.listBrokerOrders()
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取余额失败'
          })
        })
    },
    listBrokerOrdersInfo () {
      api.IAccountManager.listBrokerOrdersInfo({
        distributorId: this.user.orgId
      })
        .then(res => {
          this.loading = false
          this.BrokerOrderlist = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取关联渠道商列表失败'
          })
        })
    },
    listBrokerOrders (type) {
      api.IAccountManager.listBrokerOrders({
        brokerId: this.user.orgId,
        distributorId: this.distributorId,
        index: this.pager.pageIndex - 1,
        pageSize: this.pager.pageSize
      })
        .then(res => {
          this.brokerOrderBeans = res.brokerOrderBeans
          this.pager.pageIndex = res.index
          this.pager.recCount = res.totalElements
          if (type === 'refresh') {
            this.$message({
              type: 'success',
              message: '数据刷新'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取表格失败'
          })
        })
    },
    withdrawall () {
      this.$router.push({
        path: 'proxy/withdraw',
        query: {
          title: '提现',
          orgCategory: 'BROKER'
        }
      })
    },
    handleCurrentChange (val) {
      this.pager.pageIndex = val
      this.listByCondition()
    },
    handleSizeChange (val) {
      this.pager.pageSize = val
      this.listByCondition()
    }
  },
  filters: {
    time: (val, mask) => {
      return (
        val
          ? fecha.format(val, mask)
          : '-'
      )
    }
  }
}
</script>

<style scoped>
.value-container {
  width: 240px;
  padding: 15px;
  background: #f4f4f4;
  display: inline-block;
  margin: 10px 10px 10px 10px;
  position: relative;
}
.icon-style {
  height: 60px;
  width: 60px;
  background-size: 100% 100%;
}
.icon-moneybag {
  background: url('./../../assets/moneybag.png') no-repeat 0 0;
}
.icon-sheild {
  background: url('./../../assets/sheild.png') no-repeat 0 0;
}
.text {
  position: absolute;
  left: 90px;
  top: 20px;
  color: #999999;
}
.value-num {
  position: absolute;
  left: 90px;
  top: 45px;
  color: #333333;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
}
.value-num2 {
  position: absolute;
  left: 90px;
  top: 45px;
  color: #f8806c;
  word-break: break-all;
  font-weight: 500;
  font-size: 20px;
}
.right-bottom-container {
  position: absolute;
  top: 20px;
  width: 500px;
  height: 100px;
  display: inline-block;
}
.charge {
  position: absolute;
  left: 10px;
  top: 35px;
  width: 100px;
  background: #038ae3;
  color: #fff;
}
.tomoney {
  position: absolute;
  margin: 0;
  left: 0;
  bottom: 10px;
  width: 100px;
  color: #038ae3;
  background: #fff;
}
.alert {
  width: 100px;
  position: absolute;
  left: 140px;
  bottom: 15px;
}
.switch1 {
  position: absolute;
  left: 220px;
  bottom: 15px;
}
.alert-set {
  position: absolute;
  left: 280px;
  bottom: 15px;
}
.set-num-input {
  position: absolute;
  left: 350px;
  bottom: 10px;
  width: 150px;
}
.middle-line {
  width: 100%;
  height: 20px;
  background: #e7ebed;
  float: left;
  padding: 0 20px;
  position: relative;
  left: -20px;
}
.title {
  margin: 40px 10px 20px 0;
  padding: 0 10px;
  border-left: 5px solid #038ae3;
}
.search-row {
  width: 100%;
  margin-left: 10px;
  height: 37px;
  line-height: 37px;
}
.search-type {
  float: left;
  margin-right: 10px;
  font-size: 14px;
}
.racleicon {
  width: 30px;
  height: 30px;
  background-size: 100% 100%;
  float: right;
}
.donwload {
  cursor: pointer;
  background: url('./../../assets/download.png') no-repeat 0 0;
}
.reverse {
  cursor: pointer;
  background: url('./../../assets/reverse.png') no-repeat 0 0;
  margin: 0 15px;
}
.no-proxy {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650px;
  height: 330px;
}
.remind-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  background: url('../../assets/unopen.png') no-repeat 0 0;
  background-size: 100% 100%;
  width: 650px;
  height: 270px;
}
.openbutton {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  color: #999999;
  font-weight: 500;
  background: #078ce3;
  color: #fff;
  width: 300px;
  height: 40px;
  font-size: 20px;
  border-radius: 8px;
}
.popup-text-top {
  width: 100%;
  display: inline-block;
  text-align: center;
}
.popup-text-bottom {
  width: 100%;
  display: inline-block;
  text-align: center;
  color: #ff9900;
  margin-top: 10px;
}
</style>
