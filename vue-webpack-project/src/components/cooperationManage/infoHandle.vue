<template>
  <div>
    <BackButton></BackButton>
    <el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" class="iot__form form-pos">
      <div class="info-item">
        <div class="inner-filt">通道信息</div>
      </div>
      <el-form-item label="通道名称:" prop="name">
        <el-input v-model.trim="ruleForm.name" placeholder="请输入通道名称"></el-input>
      </el-form-item>
      <el-form-item label="通道名称缩写:" prop="alias">
        <el-input v-model.trim="ruleForm.alias" placeholder="请输入通道名称缩写"></el-input>
      </el-form-item>
      <el-form-item label="所属账户:" prop="account">
        <el-input v-model.trim="ruleForm.account" placeholder="请输入所属账户"></el-input>
      </el-form-item>
       <div class="info-item">
        <div class="inner-filt">管理者信息</div>
      </div>
      <el-form-item label="联系人:" prop="contactor">
        <el-input v-model.trim="ruleForm.contactor" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="手机号码:" prop="mobilePhone">
        <el-input v-model.trim="ruleForm.mobilePhone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
       <div class="info-item">
        <div class="inner-filt">运营商信息</div>
      </div>
      <el-form-item label="运营商:">
        <el-radio-group v-model="ruleForm.operator">
          <el-radio :label="'CMCC'">中国移动</el-radio>
          <el-radio :label="'UNICOM'">中国联通</el-radio>
          <el-radio :label="'CNET'">中国电信</el-radio>
        </el-radio-group>
      </el-form-item>
       <div class="info-item">
        <div class="inner-filt">账户信息</div>
      </div>
      <el-form-item label="登录账号:" prop="loginAccount">
        <el-input v-model.trim="ruleForm.loginAccount" placeholder="请输入登录账号"></el-input>
      </el-form-item>
      <el-form-item label="登录密码:" prop="loginPassword">
        <el-input v-model.trim="ruleForm.loginPassword" placeholder="请输入登录密码"></el-input>
      </el-form-item>
      <el-form-item label="接口KEY:" prop="apiAccessKey">
        <el-input v-model.trim="ruleForm.apiAccessKey" placeholder="请输入接口KEY"></el-input>
      </el-form-item>
       <el-form-item label="接口秘钥:" prop="apiSecretKey">
        <el-input v-model.trim="ruleForm.apiSecretKey" placeholder="请输入接口秘钥"></el-input>
      </el-form-item>
       <el-form-item label="接口地址:" prop="apiUrl">
        <el-input v-model.trim="ruleForm.apiUrl" placeholder="请输入接口地址"></el-input>
      </el-form-item>
       <el-form-item>
        <el-button class="confirm-button" @click="infohandle('change')" :loading="loading" :disabled="disabled">{{handletype==='添加供应商'?'添加':'保存'}}</el-button>
        <el-button @click="infohandle('cancel')" :disabled="disabled">取消</el-button>
       </el-form-item>
    </el-form>
  </div>
</template>

<script>
var validatenumber = (rule, value, callback) => {
  if (isNaN(value) || value.length !== 11) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
export default {
  name: '',
  data () {
    return {
      handletype: '',
      loading: false,
      disabled: false,
      ruleForm: {
      },
      rules: {
        name: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        contactor: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, validator: validatenumber, trigger: 'blur' }
        ],
        loginAccount: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        loginPassword: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        apiAccessKey: [
          { message: '请输入1-40个字符', trigger: 'blur' },
          { min: 1, max: 40, message: '请输入1-40个字符', trigger: 'blur' }
        ],
        apiSecretKey: [
          { message: '请输入1-32个字符', trigger: 'blur' },
          { min: 1, max: 32, message: '请输入1-32个字符', trigger: 'blur' }
        ],
        apiUrl: [
          { message: '请输入1-100个字符', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.handletype = this.$route.query.title
    if (this.handletype === '修改供应商') {
      this.ruleForm = JSON.parse(this.$route.query.ruleForm)
    } else {
      this.ruleForm = {
        name: '',
        alias: '',
        account: '',
        contactor: '',
        mobilePhone: '',
        operator: 'UNICOM',
        loginAccount: '',
        loginPassword: '',
        apiAccessKey: '',
        apiSecretKey: '',
        apiUrl: ''
      }
    }
  },
  methods: {
    // 保存添加或取消
    infohandle (type) {
      if (type === 'cancel') {
        this.$router.push({
          path: '/supplierManage'
        })
      } else {
        this.submitForm('ruleForm')
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.disabled = true
          // 添加
          if (this.handletype === '添加供应商') {
            this.$api.IProviderManager.add({
              provider: this.ruleForm
            }).then(res => {
              this.loading = false
              this.disabled = false
              if (res === 'OK') {
                this.$message({
                  message: this.handletype === '添加供应商' ? '添加成功' : '修改成功',
                  duration: 2000,
                  type: 'success',
                  onClose: () => {
                    this.$router.push({
                      path: '/supplierManage'
                    })
                  }
                })
              } else {
                this.$message({
                  message: '重复的通道名和所属人',
                  type: 'error',
                  duration: 5000
                })
              }
            })
          } else {
            // 修改
            this.$api.IProviderManager.update({
              provider: this.ruleForm
            }).then(res => {
              this.loading = false
              this.disabled = false
              if (res === 'OK') {
                this.$message({
                  message: this.handletype === '添加供应商' ? '添加成功' : '修改成功',
                  duration: 2000,
                  type: 'success',
                  onClose: () => {
                    this.$router.push({
                      path: '/supplierManage'
                    })
                  }
                })
              } else {
                this.$message({
                  message: '重复的通道名和所属人',
                  type: 'error',
                  duration: 5000
                })
              }
            }).catch(err => {
              this.loading = false
              this.disabled = false
              this.$message({
                message: err.message,
                type: 'error',
                duration: 5000
              })
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.info-item {
  width: 100%;
  border-bottom: 2px solid #cccccc;
  margin: 10px 0 15px 0;
  height: 29px;
}
.inner-filt {
  height: 20px;
  width: 100px;
  padding: 0 0 9px 0;
  border-bottom: 2px solid #000;
  overflow: visible;
}
.form-pos {
  margin: 30px 0 0 15px;
  width: 99%;
}
.el-form-item {
  width: 40%;
  margin-left: 20px;
}
</style>
