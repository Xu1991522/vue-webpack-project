<template>
  <div>
    <div class="title">银行信息</div>
    <div class="item-conatiner">
      <div class="label">收款账号 :</div>
      <div class="content">
        <span v-if="!accountedit">{{org.debitAccount}}</span>
        <el-input ref="inputdebitAccount" v-if="accountedit" @input="handlenumby4" style="width:300px;" v-model="org.debitAccount" @blur="edit('收款账号')"></el-input>
      </div>
      <div class="edit-icon" v-if="!accountedit" @click="accountedit = !accountedit"></div>
    </div>
    <div class="item-conatiner">
      <div class="label">收款企业/人 :</div>
      <div class="content">
        <span v-if="!companyedit">{{org.accountName}}</span>
        <el-input ref="inputcompanyedit" style="width:300px;" v-model="org.accountName" v-if="companyedit" @blur="edit('收款企业')"></el-input>
      </div>
      <div class="edit-icon" v-if="!companyedit" @click="companyedit = !companyedit"></div>
    </div>
    <div class="item-conatiner">
      <div class="label">开户银行 :</div>
      <div class="content">
        <span v-if="!bankedit">{{org.bankName}}</span>
        <el-input ref="inputbankedit" style="width:300px;" v-model="org.bankName" v-if="bankedit" @blur="edit('开户银行')"></el-input>
      </div>
      <div class="edit-icon" v-if="!bankedit" @click="bankedit = !bankedit"></div>
    </div>
    <div class="remind-text">
      <div>温馨提示:</div>
      <div>1.此银行卡信息仅用于账户余额的提现,平台内交易不会引起银行账户内金额的增减</div>
      <div>2.每家企业仅有一个银行账户信息,且此银行卡信息对企业内所有账户共享</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from '../../api'
export default {
  data () {
    return {
      accountedit: false,
      companyedit: false,
      bankedit: false,
      org: {
        debitAccount: '', // 收款账号
        accountName: '', // 收款企业/人
        bankName: '' // 开户银行
      }
    }
  },
  created () {
    this.getBankAccount()
  },
  watch: {
    accountedit (val) {
      if (val) {
        Vue.nextTick(() => {
          this.$refs['inputdebitAccount'].focus()
        })
      }
    },
    companyedit (val) {
      if (val) {
        Vue.nextTick(() => {
          this.$refs['inputcompanyedit'].focus()
        })
      }
    },
    bankedit (val) {
      if (val) {
        Vue.nextTick(() => {
          this.$refs['inputbankedit'].focus()
        })
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    handlenumby4 () {
      this.ruleForm.debitAccount = this.ruleForm.debitAccount.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    getBankAccount () {
      api.IAccountManager.getBankAccount({
        orgId: this.user.orgId
      })
        .then(res => {
          this.org = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取银行信息失败'
          })
        })
    },
    edit (editype) {
      if (editype === '开户银行') {
        this.bankedit = !this.bankedit
      } else if (editype === '收款企业') {
        this.companyedit = !this.companyedit
      } else {
        this.accountedit = !this.accountedit
      }
      api.IAccountManager.updateBankAccount({
        org: this.org
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '编辑失败'
          })
        })
    }
  }
}
</script>

<style scoped>
.title {
  width: 98%;
  border-bottom: 2px solid #f2f2f2;
  height: 40px;
  margin: 10px 15px;
}
.item-conatiner {
  margin: 25px 15px;
  height: 30px;
  line-height: 30px;
}
.label {
  display: inline-block;
  width: 100px;
  color: #9a9a9a;
  font-size: 14px;
}
.content {
  display: inline-block;
  font-size: 14px;
}
.edit-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  position: relative;
  top: 3px;
  left: 15px;
  cursor: pointer;
  background: url('./../../assets/edit-icon.png') no-repeat 0 0;
}
.remind-text {
  color: #feb865;
  font-size: 14px;
  margin: 50px 20px;
  line-height: 30px;
}
</style>
