<template>
  <div>
    <el-dialog title="开通渠道商账户" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" >
        <el-form-item label="关联渠道商ID：" label-width="120px" prop="distributorId">
          <el-input v-model="form.distributorId" auto-complete="off" placeholder="请输入企业ID" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="企业简称：" label-width="120px">
          <el-input v-model="form.shortName" auto-complete="off" placeholder="企业简称" style="width:70%" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="企业关联销售：" label-width="120px">
          <el-input v-model="form.name" auto-complete="off" placeholder="企业关联销售" style="width:70%" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">开 通</el-button>
      </div>
    </el-dialog>
    <div v-if="opened">
    <div class="top">
      <div class="value-container">
        <div class="icon-style icon-moneybag"></div>
        <div class="text">安全保障金</div>
        <div class="value-num">¥{{OrganizationBean.frozenAmount}}</div>
        <el-button type="text" v-if="status === 1" class="refresh-button" @click="refreshFrozenAmount">刷新</el-button>
        <div class="conculating" v-if="status === 0">计算中...</div>
      </div>
      <div class="value-container">
        <div class="icon-style icon-sheild"></div>
        <div class="text">账户余额</div>
        <div class="value-num2">¥{{OrganizationBean.balance}}</div>
      </div>
      <div class="right-bottom-container">
        <el-button class="charge" @click="turnrouter('充值')">充值</el-button>
        <el-button class="tomoney" @click="turnrouter('提现')">提现</el-button>
        <!-- <div class="alert">
          余额预警
         </div>
         <el-switch
              class="switch1"
              active-color="#13ce66"
              inactive-color="#ff4949">
        </el-switch>
         <div class="alert-set">
            预警值:¥
         </div>
          <el-input class="set-num-input"></el-input> -->
      </div>
    </div>
    <div class="middle-line"></div>
    <div class="bottom">
      <div class="title">财务帐单</div>
      <div class="search-row">
        <span class="search-type">交易类型</span>
        <el-select v-model="orderCategory" placeholder="请选择交易类型">
           <el-option
            label="全部类型"
            value="">
          </el-option>
          <el-option
            v-for="item in orderCategoryoptions"
            :key="item.type"
            :label="item.name"
            :value="item.type">
          </el-option>
        </el-select>
        <span class="search-type">订单创建时间</span>
        <el-date-picker
          clearable
          v-model="createTimeStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span style="margin:0 10px;font-size:14px;">到</span>
        <el-date-picker
          clearable
          type="date"
          v-model="createTimeEnd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <el-button style="margin-left:10px;width:100px;" type="primary" @click="listOrdersByConditions">搜索</el-button>
        <span class="racleicon reverse" @click="listOrdersByConditions('referesh')"></span>
        <span class="racleicon donwload"></span>
      </div>
      <el-table
          :data="orderFormBeans"
          :max-height="clientHeight"
          v-loading="loading"
          border
          style="width: 100%;margin-top:10px;">
          <el-table-column
          label="订单编号"
          :min-width="orderFormBeans.every((el)=>el.orderId===''||el.orderId===null)?'90':'200'">
              <template slot-scope="scope">
                <span style="color:#038ae3;cursor:pointer">
                  {{scope.row.orderId === ''||scope.row.orderId === null?'-':scope.row.orderId}}
                </span>
              </template>
          </el-table-column>
          <el-table-column
          label="交易类型"
          :min-width="orderFormBeans.every((el)=>el.orderCategory===''||el.orderCategory===null)?'90':'120'">
              <template slot-scope="scope">
                {{scope.row.orderCategory === ''||scope.row.orderCategory === null?'-':scope.row.orderCategory}}
              </template>
          </el-table-column>
          <el-table-column
          label="金额"
          :min-width="orderFormBeans.every((el)=>el.amount===''||el.amount===null)?'90':'200'">
              <template slot-scope="scope">
                {{scope.row.amount === ''||scope.row.amount === null?'-':'¥'+scope.row.amount}}
              </template>
          </el-table-column>
          <el-table-column
          label="订单状态"
          :min-width="orderFormBeans.every((el)=>el.orderStatus===''||el.orderStatus===null)?'90':'200'">
              <template slot-scope="scope">
                {{scope.row.orderStatus === ''||scope.row.orderStatus === null?'-':scope.row.orderStatus}}
              </template>
          </el-table-column>
          <el-table-column
          label="订单创建时间"
          :min-width="orderFormBeans.every((el)=>el.createTime===''||el.createTime===null)?'130':'200'">
              <template slot-scope="scope">
                {{scope.row.createTime === ''||scope.row.createTime === null?'-':scope.row.createTime | time('yyyy-MM-dd HH:mm:ss')}}
              </template>
          </el-table-column>
          <el-table-column
          label="订单处理时间"
          :min-width="orderFormBeans.every((el)=>el.completeTime===''||el.completeTime===null)?'130':'200'">
              <template slot-scope="scope">
                {{scope.row.completeTime === ''||scope.row.completeTime === null?'-':scope.row.completeTime | time('yyyy-MM-dd HH:mm:ss')}}
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
      status: 1, //  保障金刷新状态
      form: {},
      rules: {
        distributorId: [
          { required: true, message: '请输入企业id', trigger: 'blur' }
        ]
      },
      orderFormBeans: [], // 展示渠道商的财务账单
      orderCategoryoptions: [
        {
          type: 'PURCHASE',
          name: '采购'
        },
        {
          type: 'HANDLE',
          name: '订购'
        },
        {
          type: 'SETTLE',
          name: '结算'
        },
        {
          type: 'CHANGE',
          name: '变更'
        },
        {
          type: 'WITHDRAW',
          name: '提现'
        },
        {
          type: 'DEPOSIT',
          name: '充值'
        }
      ],
      clientHeight: 0, // 高度
      dialogVisible: false,
      loading: true, // 表格加载
      createTimeStart: '',
      createTimeEnd: '',
      OrganizationBean: {
        balance: '',
        frozenAmount: ''
      },
      opened: false,
      orderCategory: '',
      pager: {
        pageIndex: 1,
        pageSize: 10,
        recCount: 0
      } // 分页
    }
  },
  created () {
    this.clientHeight = document.body.clientHeight >= 794 ? 550 : 160
    this.getOrg()
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  watch: {
    dialogVisible (val) {
      this.$refs['form'].resetFields()
    }
  },
  methods: {
    refreshFrozenAmount () {
      api.IAccountManager.refreshFrozenAmount({
        orgId: this.user.orgId
      })
        .then(res => {
          this.status = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '更改保障金刷新状态失败'
          })
        })
    },
    listOrdersByConditions (type) {
      api.IAccountManager.listOrdersByConditions({
        distributorId: this.user.orgId,
        orderCategory: this.orderCategory,
        createTimeStart: this.createTimeStart,
        createTimeEnd: this.createTimeEnd,
        index: this.pager.index - 1,
        pageSize: this.pager.pageSize
      })
        .then(res => {
          this.loading = false
          this.orderFormBeans = res
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
            message: err.message || '获取渠道商财务账单失败'
          })
        })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addAssociateSuperiorDistributor()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addAssociateSuperiorDistributor () {
      api.IAccountManager.addAssociateSuperiorDistributor({
        brokerId: this.user.orgId,
        distributorId: this.form.distributorId,
        userId: this.user.id
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
    getOrg () {
      api.IAccountManager.getOrg({
        id: this.user.orgId
      })
        .then(res => {
          // 是否已开通
          this.opened = res.orgCategory === 'DISTRIBUTOR'
          if (res.orgCategory === 'DISTRIBUTOR') {
            this.form.shortName = res.shortName
            this.OrganizationBean.balance = res.distributorBalance || res.brokerBalance
            this.OrganizationBean.frozenAmount = res.frozenAmount
            this.getRefreshFrozenAmountStatus()
            this.listOrdersByConditions()
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '初始化创建开通失败'
          })
        })
    },
    getRefreshFrozenAmountStatus () {
      api.IAccountManager.getRefreshFrozenAmountStatus({
        orgId: this.user.orgId
      })
        .then(res => {
          this.status = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取保障金刷新状态失败'
          })
        })
    },
    getAvailableAssociateSales () {
      api.IAccountManager.getAvailableAssociateSales({
        distributorId: this.form.distributorId,
        brokerId: this.user.orgId
      })
        .then(res => {
          this.form.shortName = res.shortName
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '初始化创建开通失败'
          })
        })
    },
    turnrouter (type) {
      this.$router.push({
        path: type === '充值' ? 'distributor/charge' : 'distributor/withdraw',
        query: {
          title: type,
          orgCategory: 'DISTRIBUTOR'
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
  top: 15px;
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
  top: 10px;
  width: 100px;
  background: #038ae3;
  color: #fff;
}
.tomoney {
  position: absolute;
  margin: 0;
  left: 10px;
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
.refresh-button {
  position: absolute;
  top: 3px;
  right: 10px;
}
.conculating {
  position: absolute;
  bottom: 7px;
  right: 25px;
  font-size: 12px;
  color: #999999;
}
</style>
