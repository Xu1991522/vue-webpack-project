<template>
  <div>
    <BackButton></BackButton>
    <el-form :model="form"
    ref="form"
    :rules="rules"
    style="margin-top:15px;"
    label-width="120px">
        <el-form-item label="提现金额:" prop="withdrawAmount">
          <el-input v-model="form.withdrawAmount" auto-complete="off" placeholder="请输入企业ID" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="可提金额:" >
          ¥{{OrganizationBean.banlance}}
        </el-form-item>
        <el-form-item label="收款账号:" >
          {{OrganizationBean.debitAccount}}
        </el-form-item>
        <el-form-item label="收款企业/人:" >
          {{OrganizationBean.accountName}}
        </el-form-item>
        <el-form-item label="开户银行:">
          {{OrganizationBean.debitAccount}}
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提现</el-button>
          <el-button @click="turnrouter">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '../../api'
export default {
  data () {
    return {
      form: {
        withdrawAmount: 0
      },
      brokerOrder: {},
      OrganizationBean: {
        balance: '',
        debitAccount: '',
        accountName: '',
        bankName: ''
      },
      rules: {
        withdrawAmount: [
          { required: true, message: '请输入提现金额', trigger: 'blur' },
          { type: 'number', message: '请输入正确的金额', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getBankAccount()
    this.getOrg()
    if (this.$route.query.orgCategory === 'BROKER') {
      this.listBrokerOrders()
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    distributorId () {
      // 代理商表格传参提现
      return this.$route.query.distributorId ? this.$route.query.distributorId : ''
    }
  },
  methods: {
    listBrokerOrders () {
      api.IAccountManager.listBrokerOrders({
        brokerId: this.user.orgId,
        distributorId: this.distributorId,
        index: 0,
        pageSize: 10
      })
        .then(res => {
          this.brokerOrder = res.brokerOrderBeans[0]
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取提现代理商对象失败'
          })
        })
    },
    getOrg () {
      api.IAccountManager.getOrg({
        orgId: this.user.orgId
      })
        .then(res => {
          this.OrganizationBean.balance = res.distributorBalance || res.brokerBalance
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取余额失败'
          })
        })
    },
    getBankAccount () {
      api.IAccountManager.getBankAccount({
        orgId: this.user.orgId
      })
        .then(res => {
          this.OrganizationBean.debitAccount = res.debitAccount
          this.OrganizationBean.accountName = res.accountName
          this.OrganizationBean.bankName = res.bankName
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取银行信息失败'
          })
        })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.withdraw()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    withdraw () {
      api.IAccountManager.withdraw({
        orgId: this.user.orgId,
        orgCategory: this.$route.query.orgCategory,
        withdrawAmount: this.form.withdrawAmount,
        orderForm: this.brokerOrder
      })
        .then(res => {
          setTimeout(this.$route.back(-1), 1000)
          this.$message({
            type: 'success',
            message: '提现成功'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '提现失败'
          })
        })
    },
    turnrouter () {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
</style>
