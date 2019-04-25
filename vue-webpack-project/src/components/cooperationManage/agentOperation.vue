<template>
  <div class="conteiner--proxy-form">
    <BackButton></BackButton>

    <el-form label-width="120px" :inline-message="true" :model="formLabelAlign" ref="formLabelAlign" :rules="rules" label-position="left" class="iot__form form-pos">
      <div class="info-item">
        <div class="inner-filt">企业信息</div>
      </div>
      <el-form-item label="代理名称:" prop="name">
        <el-input v-model="formLabelAlign.name"></el-input>
      </el-form-item>
      <el-form-item label="公司名称:" prop="company">
        <el-input v-model="formLabelAlign.company"></el-input>
      </el-form-item>
      <div class="info-item">
        <div class="inner-filt">管理者信息</div>
      </div>
      <el-form-item label="联系人:" prop="contactor">
        <el-input v-model="formLabelAlign.contactor"></el-input>
      </el-form-item>
      <el-form-item label="手机号码:" prop="mobilePhone">
        <el-input v-model="formLabelAlign.mobilePhone"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码:" prop="idCard">
        <el-input v-model="formLabelAlign.idCard"></el-input>
      </el-form-item>
      <el-form-item label="电话号码:" prop="phone">
        <el-input v-model="formLabelAlign.phone"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model="formLabelAlign.email"></el-input>
      </el-form-item>
      <!-- img upload -->
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
          <img v-if="images.up" :src="images.up" class="avatar">
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
          <img v-if="images.down" :src="images.down" class="avatar">
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
          <img v-if="images.hand" :src="images.hand" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <div class="info-item">
        <div class="inner-filt">账户信息</div>
      </div>
      <el-form-item label="登录账户:" prop="loginName">
        <el-input v-model="formLabelAlign.loginName" :disabled="handletype === 'edit'"></el-input>
      </el-form-item>
      <el-form-item label="初始密码:">
        <el-input
          :value="formLabelAlign.loginName + '123'"
          :disabled="true" style="width:38%"
        ></el-input>
        <el-button
          v-if="handletype === 'edit'&&this.user.roleBean.label === 'ADMIN'"
          type="primary"
          style="vertical-align: top; margin-left: 10px"
          @click="resetPassword"
        >
          重置为初始密码
        </el-button>
      </el-form-item>
      <el-form-item label="角色设置:" prop="roleId" v-if="false">
        <template>
          <el-select v-model="formLabelAlign.roleId" placeholder="请选择" style="width: 38%">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </template>
      </el-form-item>
       <el-form-item>
        <el-button class="confirm-button" plain @click="save" v-if="handletype === 'add'" :loading="submitting" style="margin-right:18px">添加</el-button>
        <el-button class="confirm-button" plain @click="save" v-else :loading="submitting" style="margin-right:18px">{{ handletype === 'add' ? '添加':'保存' }}</el-button>
        <el-button @click="cancel">取消</el-button>
       </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from '../../api'

  // https://blog.csdn.net/lyhjava/article/details/52316438
  const checkIdCard = val => !!val.match(/^\d{15}$/) || !!val.match(/^\d{17}(\d{1}|X)$/i)
  const checkPhone = val => !!val.match(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/)

  const idCardValidator = (rule, value, callback) => {
    value = value.trim()

    if (!value.length) {
      return callback(Error('请输入身份证号'))
    }

    return callback(checkIdCard(value) ? undefined : Error('请输入正确的身份证号'))
  }

  const phoneValidator = (rule, value, callback) => {
    value = value.trim()

    // not required
    if (!value.length) {
      return callback()
    }

    return callback(checkPhone(value) ? undefined : Error('请输入正确的电话号码'))
  }

  export default {
    name: '',
    data () {
      return {
        handletype: '',
        formLabelAlign: {},
        rules: {
          name: [
            { required: true, message: '请输入1-50个字符', trigger: 'blur' },
            { min: 1, max: 50, message: '请输入1-50个字符', trigger: 'blur' }
          ],
          company: [
            { required: true, message: '请输入1-128个字符', trigger: 'blur' },
            { min: 1, max: 128, message: '请输入1-128个字符', trigger: 'blur' }
          ],
          contactor: [
            { required: true, message: '请输入1-20个字符', trigger: 'blur' },
            { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
          ],
          mobilePhone: [
            { required: true, pattern: /^\d{11}$/g, message: '请输入手机号码', trigger: 'blur' }
          ],
          idCard: [
            { required: true, validator: idCardValidator, trigger: 'blur' }
          ],
          phone: [
            { validator: phoneValidator, trigger: 'blur' }
          ],
          email: [
            { required: false, type: 'email', message: '请输入邮箱', trigger: 'blur' }
          ],
          loginName: [
            { required: true, message: '请输入1-20个字符', trigger: 'blur' },
            { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
          ],
          originPswd: [
            { required: false }
          ],
          roleName: [
            { required: false }
          ]
        },
        user: {},
        roles: [],
        images: {
          up: '',
          down: '',
          hand: ''
        },
        urls: {
          up: '',
          down: '',
          hand: ''
        },
        progress: {
          up: 0,
          down: 0,
          hand: 0
        },

        submitting: false
      }
    },
    methods: {
      // getAllRole () {
      //   api.IUserService.getAllRole({}).then(res => {
      //     this.roles = res
      //   })
      // },
      resetPassword () {
        api.IUserService.resetPassword({ loginName: this.formLabelAlign.loginName })
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
      save () {
        this.submitForm('formLabelAlign')
      },
      cancel () {
        this.$router.push({
          path: '/agentManage'
        })
      },
      submitForm (formName) {
        if (this.submitting) {
          return
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitting = true

            if (this.handletype === 'add') {
              api.IProxyManager.add({
                proxy: {
                  ...this.formLabelAlign,
                  cdUpPhotoUrl: this.urls.up,
                  cdDownPhotoUrl: this.urls.down,
                  cdHandPhotoUrl: this.urls.hand
                }
              }).then(res => {
                this.submitting = false

                this.$message({
                  type: 'success',
                  message: '添加成功'
                })

                setTimeout(() => this.$router.push({
                  path: '/agentManage'
                }), 2000)
              }).catch(err => {
                this.submitting = false

                this.$message({
                  type: 'error',
                  message: err.message || '添加失败'
                })
              })
            } else if (this.handletype === 'edit') {
              api.IProxyManager.update({
                proxy: {
                  ...this.formLabelAlign,
                  cdUpPhotoUrl: this.urls.up,
                  cdDownPhotoUrl: this.urls.down,
                  cdHandPhotoUrl: this.urls.hand
                }
              }).then(res => {
                this.submitting = false

                this.$message({
                  type: 'success',
                  message: '修改成功'
                })

                setTimeout(() => this.$router.push({
                  path: '/agentManage'
                }), 2000)
              }).catch(err => {
                this.submitting = false

                this.$message({
                  type: 'error',
                  message: err.message || '修改失败'
                })
              })
            }
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
      handleRemove (file, fileList) {
        console.log('handleRemove', file, fileList)
      }
    },
    created () {
      this.user = this.$store.getters.user
      const proxy = this.$route.query.proxy

      if (proxy) {
        this.handletype = 'edit'

        api.IProxyManager.getProxy({ id: +proxy })
          .then(res => {
            this.formLabelAlign = res

            this.urls = {
              up: res.cdUpPhotoUrl || '',
              down: res.cdDownPhotoUrl || '',
              hand: res.cdHandPhotoUrl || ''
            }

            this.images = {
              up: res.cdUpPhotoUrl || '',
              down: res.cdDownPhotoUrl || '',
              hand: res.cdHandPhotoUrl || ''
            }
          })
      } else {
        this.handletype = 'add'

        this.formLabelAlign = {
          name: '',
          company: '',
          contactor: '',
          mobilePhone: '',
          idCard: '',
          phone: '',
          email: '',
          cdDownPhotoUrl: '',
          cdUpPhotoUrl: '',
          cdHandPhotoUrl: '',
          loginName: '',
          roleId: ''
        }
      }
    }
  }
</script>
<!--
<style lang="scss">
  .conteiner--proxy-form {
    .avatar-uploader-icon {

    }
  }
</style>
-->
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
    margin-right:15px;
    vertical-align: top;

    box-sizing: border-box;

    width: 165px;
    height: 100px;
  }

  .upload__container:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon, .avatar {
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

  .avatar-uploader-icon:before {
    display: none;
  }
</style>
