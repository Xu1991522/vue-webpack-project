<template>
  <div>
    <BackButton></BackButton>
    <el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" class="iot__form form-pos">
      <div class="info-item">
        <div class="inner-filt">企业信息</div>
      </div>
      <el-form-item label="企业简称:" prop="shortName">
        <el-input v-model.trim="ruleForm.shortName" placeholder="请输入1-15个字符，创建后不可修改"></el-input>
      </el-form-item>
      <el-form-item label="企业全称:" prop="companyName">
        <el-input v-model.trim="ruleForm.companyName" placeholder="请输入企业全称，与营业执照一致"></el-input>
      </el-form-item>
      <el-form-item label="企业域名:" prop="accessUrl" ref="accessUrlItem">
        <el-radio-group v-model="accessType" @change="handleAccessTypeChange">
          <el-radio label="public">公用域名</el-radio>
          <el-radio label="custom">自定二级域名</el-radio>
          <el-radio label="private">自有域名</el-radio>
        </el-radio-group>

        <template v-if="accessType === 'public'">
          <el-input v-model="ruleForm.accessUrl" disabled></el-input>
        </template>

        <template v-if="accessType === 'custom'">
          <el-input v-model.trim="ruleForm.accessUrl" placeholder="请输入1-15个字符" style="width: 434px"></el-input>.appmedia.cn
        </template>

        <template v-if="accessType === 'private'">
          <el-input v-model="ruleForm.accessUrl"></el-input>
        </template>
      </el-form-item>

      <el-form-item label="营业执照扫描件:">
        <el-upload
          class="upload__container upload--license"
          name="file"
          :show-file-list="false"
          action="/portal-srv/upload/idcard"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess('licenseUp')"
          :on-progress="handleUploadProgress('licenseUp')"
          :on-remove="handleRemove"
        >
          <img v-if="images.licenseUp" :src="images.licenseUp" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
       <div class="info-item">
        <div class="inner-filt">联系人信息</div>
      </div>
      <el-form-item label="姓名:" prop="contact">
        <el-input v-model.trim="ruleForm.contact" placeholder="请输入联系人姓名" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="mobile">
        <el-input v-model.trim="ruleForm.mobile" placeholder="请输入手机号码" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码:" prop="idCard">
        <el-input maxlength="18" v-model.trim="ruleForm.idCard" placeholder="请输入身份证号" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="电话号码:" prop="telephone">
        <el-input v-model.trim="ruleForm.telephone" placeholder="请输入电话号码" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model.trim="ruleForm.email" placeholder="请输入电子邮箱" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="证件图片:" style="min-width:800px">
        <el-upload
          class="upload__container upload--up"
          name="file"
          :show-file-list="false"
          action="/portal-srv/upload/idcard"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess('up')"
          :on-progress="handleUploadProgress('up')"
          :on-remove="handleRemove"
        >
          <img v-if="images.cardUp" :src="images.up" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          action="/portal-srv/upload/idcard"
          class="upload__container upload--down"
          name="file"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess('down')"
          :on-progress="handleUploadProgress('down')"
          :on-remove="handleRemove"
        >
          <img v-if="images.cardDown" :src="images.down" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          action="/portal-srv/upload/idcard"
          class="upload__container upload--hand"
          name="file"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess('hand')"
          :on-progress="handleUploadProgress('hand')"
          :on-remove="handleRemove"
        >
          <img v-if="images.cardHand" :src="images.hand" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

       <div class="info-item">
        <div class="inner-filt">账户信息</div>
      </div>
      <el-form-item label="登录账号:" prop="userInfo.loginName">
        <el-input v-model.trim="ruleForm.userInfo.loginName" placeholder="请输入1-20个字符，创建后不可修改" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="初始密码:" required>
        <el-input :value="ruleForm.userInfo.loginName + '123'" placeholder="请输入初始密码" :disabled="true" v-if="this.handletype === 'add'"></el-input>
        <el-button
          v-if="this.handletype !== 'add'"
          type="primary"
          style="vertical-align: top;"
          @click="resetPassword"
        >
          重置密码
        </el-button>
      </el-form-item>
      <el-form-item label="姓名:" prop="userInfo.name">
        <el-input v-model.trim="ruleForm.userInfo.name" placeholder="请输入联系人姓名" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="userInfo.mobile">
        <el-input v-model.trim="ruleForm.userInfo.mobile" placeholder="请输入手机号码" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="userInfo.email">
        <el-input v-model.trim="ruleForm.userInfo.email" placeholder="请输入电子邮箱" :disabled="false"></el-input>
      </el-form-item>

      <el-form-item label="业务类型:" required :error="orgTypes.error">
        <el-checkbox v-model="orgTypes.distributor" :disabled="distributorselected">渠道商账户</el-checkbox>
        <el-checkbox v-model="orgTypes.broker" :disabled="brokerselected">代理商账户</el-checkbox>

        <el-popover
          placement="top-start"
          trigger="hover"
          width="300"
        >
          <div>
            <p>渠道商账户：用于管理卡及套餐相关费用的账户</p>
            <p>代理商账户：用于给代理人佣金分成的账户</p>
          </div>
          <i class="notice__icon" slot="reference"></i>
        </el-popover>
      </el-form-item>
      <el-form-item label="关联销售:" prop="associateSale">
        <el-select v-model="ruleForm.associateSale" placeholder="请选择">
          <el-option
            v-for="item in salespeople"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="其他:">
        <el-checkbox v-model="showbankinfo">添加银行卡信息</el-checkbox>
      </el-form-item>
       <el-form-item label="开户姓名:" prop="accountName" v-if="showbankinfo">
        <el-input v-model.trim="ruleForm.accountName" placeholder="请输入开户姓名" :disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="储蓄卡号:" prop="debitAccount" v-if="showbankinfo">
        <el-input type="text" maxlength="23" v-model="ruleForm.debitAccount" placeholder="请输入储蓄卡号" :disabled="false" @input="validateNum"></el-input>
      </el-form-item>
      <el-form-item label="收款银行:" prop="bankName" v-if="showbankinfo">
        <el-input v-model.trim="ruleForm.bankName" placeholder="请输入收款银行" :disabled="false"></el-input>
      </el-form-item>
       <el-form-item style="margin-bottom:40px;">
        <el-button class="confirm-button" @click="infohandle('change')" :loading="loading" :disabled="disabled">{{handletype==='添加新客户'?'添加':'保存'}}</el-button>
        <el-button @click="infohandle('cancel')" :disabled="disabled">取消</el-button>
       </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '../../api'

const validatemobile = (rule, value, callback) => {
  if ((!value && isNaN(value)) || value.length !== 11) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
const validatetelephone = (rule, value, callback) => {
  if (value && value.length > 20) {
    callback(new Error('请输入1-20个字符'))
  } else {
    callback()
  }
}

const validatemail = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/g

  if (value && !reg.test(value)) {
    callback(new Error('请输入正确的电子邮箱'))
  } else {
    callback()
  }
}

const validateidcard = (rule, value, callback) => {
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g

  if (value && !reg.test(value)) {
    callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
}

const validatebankcard = (rule, value, callback) => {
  const reg = /^([1-9]{1})(\d{15}|\d{18})$/

  if (value && !reg.test(value.replace(/\s+/g, ''))) {
    callback(new Error('请输入正确的银行卡号码'))
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

      showbankinfo: false,

      distributorselected: false,
      brokerselected: false,

      // 图片上传对象
      images: {
        up: '',
        down: '',
        hand: '',
        license: ''
      },
      urls: {
        up: '',
        down: '',
        hand: '',
        licenseUp: '',
        licenseDown: ''
      },
      progress: {
        up: 0,
        down: 0,
        hand: 0,
        licenseUp: 0,
        licenseDown: ''
      },
      salespeople: [],
      // 图片上传对象结束
      ruleForm: {
        companyName: '',
        shortName: '',
        accessUrl: 'iot-cust.combmobile.org',

        licenseUp: '',
        licenceDown: '',

        contact: '',
        mobile: '',
        telephone: '',
        email: '',

        idCard: '',
        cardUp: '',
        cardDown: '',
        cardHand: '',

        userInfo: {
          loginName: '',
          name: '',
          mobile: '',
          email: ''
        },

        orgCategory: '',
        isBroker: '',
        isDistributor: '',

        associateSale: '',

        accountName: '',
        debitAccount: '',
        bankName: ''
      },

      orgTypes: {
        isDistributor: false,
        isBroker: false,
        error: ''
      },

      accessType: 'public',

      rules: {
        shortName: [
          { required: true, message: '请输入1-15个字符', trigger: 'blur' },
          { min: 1, max: 15, message: '请输入1-15个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              api.IOrganizationManager.existOrgShortName({ shortName: value })
                .then(exists => {
                  if (exists) {
                    return callback(Error('企业简称已存在'))
                  }

                  callback()
                })
                .catch(err => {
                  callback(Error(err.message || '企业简称重复检测失败'))
                })
            },
            trigger: 'blur'
          }
        ],
        accessUrl: [
          {
            validator: (rule, value, callback) => {
              const accessType = this.accessType

              if (accessType === 'public') {
                return callback()
              }

              if (accessType === 'custom') {
                const len = value.length

                return len && (len <= 15)
                  ? callback()
                  : callback(Error('1-15个字符'))
              }

              if (accessType === 'private') {
                // http://www.cnblogs.com/babyhhcsy/articles/4496535.html isUrl

                return value.match(/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/)
                  ? callback()
                  : callback(Error('企业域名不符合规范'))
              }

              throw Error('unexpected accessType [' + accessType + '] when validate accessUrl')
            },
            trigger: 'blur'
          }
        ],
        companyName: [
          { required: true, message: '请输入企业全称，与营业执照一致', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatemobile, trigger: 'blur' }
        ],
        associateSale: [
          { required: true, message: '请分配相关销售人员', trigger: 'blur' }
        ],
        idCard: [
          { validator: validateidcard, trigger: 'blur' }
        ],
        telephone: [
          { validator: validatetelephone, trigger: 'blur' }
        ],
        email: [
          { validator: validatemail, trigger: 'blur' }
        ],
        debitAccount: [
          { validator: validatebankcard, trigger: 'blur' }
        ],
        userInfo: {
          loginName: [
            { required: true, message: '请输入1-20个字符', trigger: 'blur' },
            { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                api.IOrganizationManager.existLoginName({ loginName: value })
                  .then(exists => {
                    if (exists) {
                      return callback(Error('登录账号已存在'))
                    }

                    callback()
                  })
                  .catch(err => {
                    callback(Error(err.message || '登录账号重复检测失败'))
                  })
              },
              trigger: 'blur'
            }
          ],
          name: [
            { required: true, message: '请输入1-20个字符', trigger: 'blur' },
            { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
          ],
          mobile: [
            { required: true, validator: validatemobile, trigger: 'blur' }
          ],
          email: [
            { validator: validatemail, trigger: 'blur' }
          ]
        }
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    orgCategory () {
      return [this.orgTypes.distributor ? 'DISTRIBUTOR' : '', this.orgTypes.broker ? 'BROKER' : ''].filter(x => x).join(',')
    }
  },
  methods: {
    // 保存添加或取消
    infohandle (type) {
      if (type === 'cancel') {
        this.$router.back()
      } else {
        this.submitForm('ruleForm')
      }
    },
    handleAccessTypeChange (val) {
      if (val === 'public') {
        this.ruleForm.accessUrl = 'iot-cust.combmobile.org'
      } else {
        this.ruleForm.accessUrl = ''
      }

      this.$refs.accessUrlItem.clearValidate()
    },
    submitForm (formName) {
      /*
      api.IOrganizationManager.addOrg({
        org: {
          abbrName: 'org-ex1',
          shortName: '测试企业1',
          accountName: '测试企业有限公司1',
          bankName: '北京银行',
          cardDown: '',
          cardHand: '',
          cardUp: '',
          companyName: '测试企业有限公司1',
          contact: '联系人1',
          debitAccount: '1234 5678 9785 4123',
          idCard: '',
          licenceUp: '',
          licenceDown: '',
          mobile: '18210000000',
          orgCategory: 'DISTRIBUTOR,BROKER',
          userInfo: { loginName: 'org-tz1' }
        },
        superOrg: 1,
        salerId: 1255
      })
      */

      // /*
      this.$refs[formName].validate((valid) => {
        const orgCategory = this.orgCategory

        this.orgTypes.error = orgCategory ? '' : '请选择业务类型'

        if (!orgCategory || !valid) {
          return
        }

        this.loading = true
        this.disabled = true

        const accessUrl = this.accessType === 'custom' ? this.ruleForm.accessUrl + '.appmedia.cn' : this.ruleForm.accessUrl

        // 添加
        if (this.handletype === 'add') {
          api.IOrganizationManager.addOrg({
            superOrg: this.user.orgId,
            org: {
              ...this.ruleForm,
              accessUrl,
              licenceUp: this.urls.licenceUp,
              licenceDown: this.urls.licenceDown,

              cardUp: this.urls.up,
              cardDown: this.urls.down,
              cardHand: this.urls.hand,

              orgCategory
            },
            salerId: this.ruleForm.associateSale
          })
            .then(res => {
              if (res !== 0) {
                return Promise.reject(Error('创建失败'))
              }

              this.$message({
                type: 'success',
                message: '创建成功'
              })

              this.$router.back()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message || '创建失败'
              })
            })
            .then(() => {
              this.loading = false
              this.disabled = false
            })
        } else {
          api.IOrganizationManager.updateOrg({
            org: {
              ...this.ruleForm,
              accessUrl,
              licenceUp: this.urls.licenceUp,
              licenceDown: this.urls.licenceDown,

              cardUp: this.urls.up,
              cardDown: this.urls.down,
              cardHand: this.urls.hand,

              orgCategory
            },
            salerId: this.ruleForm.associateSale
          })
            .then(res => {
              if (res !== 0) {
                return Promise.reject(Error('修改失败'))
              }

              this.$message({
                type: 'success',
                message: '修改成功'
              })

              this.$router.back()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message || '修改失败'
              })
            })
            .then(() => {
              this.loading = false
              this.disabled = false
            })
        }
      })
    },
    // upload
    handleUploadSuccess (prop) {
      return (res, file) => {
        // res: file name
        this.images[prop] = URL.createObjectURL(file.raw)

        this.urls[prop] = res
      }
    },
    handleUploadProgress (prop) {
      return (e, file) => {
        if (e.lengthComputable) {
          this.progress[prop] = e.percent
        }
      }
    },
    handleRemove (file, fileList) {
      console.log('handleRemove', file, fileList)
    },
    handleBeforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt3M = file.size / 1024 / 1024 < 3

      if (!(isJPG || isPNG)) {
        this.$message.error('上传图片只支持png，jpeg格式')
      }

      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB')
      }

      return (isJPG || isPNG) && isLt3M
    },
    validateNum (val) {
      // eval hack
      // sync state with ui
      this.$nextTick(() => {
        this.ruleForm.debitAccount = val.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      })
    },
    // 重置密码
    resetPassword () {
      api.IUserService.resetPassword({ loginName: this.ruleForm.loginName })
        .then(() => {
          this.$message({
            type: 'success',
            message: '密码重置成功'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '密码重置失败'
          })
        })
    },
    setup () {
      const superOrgId = this.user.orgId

      const orgId = this.$route.query.org ? +this.$route.query.org : null

      this.handletype = orgId ? 'update' : 'add'

      if (orgId) {
        Promise.all([
          api.IOrganizationManager.getOrg({ id: orgId }),
          api.IOrganizationManager.getAvailableAssociateSales({ orgId: superOrgId, targetOrg: orgId })
        ])
          .then(([r1, r2]) => {
            this.ruleForm = {
              ...r1,
              loginName: r1.userInfo.loginName,
              // eval hack
              // associate salesperson was the first when targetOrg was sent
              associateSale: r2[0].id
            }

            this.accessType =
              r1.accessUrl === 'iot-cust.combmobile.org'
                ? 'public'
                : r1.accessUrl.match(/appmedia\.cn$/)
                  ? 'custom'
                  : 'private'

            // 图片获取
            this.urls = {
              cardUp: r1.cardUp || '',
              cardDown: r1.cardDown || '',
              cardhand: r1.cardHand || '',
              licenseUp: r1.licenseUp || '',
              licenseDown: r1.licenseDown || ''
            }

            this.images = { ...this.urls }

            // check organization type by orgCategory(string)
            const hasDistributorType = r1.orgCategory.indexOf('DISTRIBUTOR') > -1
            const hasBrokerType = r1.orgCategory.indexOf('BROKER') > -1

            this.orgTypes = {
              distributor: hasDistributorType,
              broker: hasBrokerType
            }

            this.distributorselected = hasDistributorType
            this.brokerselected = hasBrokerType

            this.showbankinfo = Boolean(r1.bankName || r1.accountName || r1.debitAccount)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '企业信息获取失败'
            })
          })
      }

      api.IOrganizationManager.getAvailableAssociateSales({ orgId: superOrgId, targetOrg: null })
        .then(res => {
          this.salespeople = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取企业下销售人员列表失败'
          })
        })
    }
  },
  created () {
    this.setup()
  },
  watch: {
    orgCategory (val) {
      this.orgTypes.error = val ? '' : '请选择业务类型'
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
/* upload */
.upload__container {
  display: inline-block;
  border: 1px dashed #bebdbd;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  margin-right: 15px;
  vertical-align: top;

  box-sizing: border-box;

  width: 165px;
  height: 100px;
}

.upload__container:hover {
  border-color: #409eff;
}

.avatar-uploader-icon,
.avatar {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}

.upload--up .avatar-uploader-icon {
  background-image: url('../../assets/icon-cdard-up.png');
}

.upload--down .avatar-uploader-icon {
  background-image: url('../../assets/icon-cdard-down.png');
}

.upload--hand .avatar-uploader-icon {
  background-image: url('../../assets/icon-cdard-hand.png');
}
.upload--license .avatar-uploader-icon {
  background-image: url('../../assets/icon-cdard-license.png');
}
.avatar-uploader-icon:before {
  display: none;
}

.notice__icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url('../../assets/icon-notice.png') no-repeat center center;

  vertical-align: middle;
  margin-left: 10px;
  margin-top: -1px;
  cursor: pointer;
}
</style>
