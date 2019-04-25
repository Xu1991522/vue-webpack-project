<template>
  <div>
    <BackButton></BackButton>
    <el-form :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      style="margin-top:15px;"
      label-width="120px">
        <el-form-item label="充值金额: ¥" prop="depositAmount">
          <el-input v-model="ruleForm.depositAmount" auto-complete="off" placeholder="0.00" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="充值凭证上传:">
        <el-upload
          class="upload__container upload--certUrl"
          name="file"
          :show-file-list="false"
          action="/portal-srv/upload/idcard"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess('certUrl')"
          :on-progress="handleUploadProgress('certUrl')"
          :on-remove="handleRemove"
        >
          <img v-if="images.certUrl" :src="images.certUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">充值</el-button>
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
      // 图片上传对象
      images: {
        certUrl: ''
      },
      urls: {
        certUrl: ''
      },
      progress: {
        certUrl: 0
      },
      ruleForm: {
        depositAmount: ''
      },
      rules: {
        depositAmount: [
          { required: true, message: '请输入充值金额', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.deposit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deposit () {
      api.IAccountManager.deposit({
        orgId: this.user.orgId,
        depositAmount: this.form.depositAmount,
        certUrl: this.urls.certUrl
      })
        .then(res => {
          setTimeout(this.$route.back(-1), 1000)
          this.$message({
            type: 'success',
            message: '充值成功'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '充值失败'
          })
        })
    },
    turnrouter () {
      this.$router.back(-1)
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
    }
  }
}
</script>

<style scoped>
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

  width: 250px;
  height: 150px;
}
.upload--certUrl .avatar-uploader-icon {
  background-image: url('../../assets/icon-cdard-license.png');
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
.avatar-uploader-icon:before {
  display: none;
}
</style>
