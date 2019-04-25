  <template>
    <div>
      <div class="pannel__header">
        企业信息
      </div>
      <el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" class="iot__form form-pos">
        <div class="info-item">
          <div class="inner-filt">基本信息</div>
        </div>
        <el-form-item label="企业简称:" prop="shortName">
          <span>{{ ruleForm.shortName}}</span>
        </el-form-item>
        <el-form-item label="企业全称:" prop="fullName">
          <div class="panel__content" v-if="internal">
            <el-input
              v-if="editing.value && editing.prop === 'fullName'"
              ref="email"
              style="display: inline-block; width: 200px"
              :value="ruleForm.fullName"
              @blur="updateFullName"
            ></el-input>
            <template v-else>
              <span>{{ ruleForm.fullName }}</span>
              <i class="edit__btn el-icon-edit-outline" @click="edit('fullName')"></i>
            </template>
          </div>
          <span v-else>{{ ruleForm.fullName }}</span>
        </el-form-item>
        <el-form-item label="企业ID:" prop="id">
           <span>{{ ruleForm.id}}</span>
        </el-form-item>
        <el-form-item label="营业执照扫描件:">
          <el-upload
            class="upload__container upload--license"
            name="file"
            :show-file-list="false"
            action="/portal-srv/upload/idcard"
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess('up')"
            :on-progress="handleUploadProgress('up')"
          >
            <img v-if="images.up" :src="images.up" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="APP ID:" prop="appId">
           <span>{{ ruleForm.appId}}</span>
        </el-form-item>
        <el-form-item label="API密码:" prop="apiPass">
          <span>{{ ruleForm.apiPass}}</span>
        </el-form-item>
        <div class="info-item">
          <div class="inner-filt">企业联系人</div>
        </div>
        <el-form-item label="姓名:" prop="contact">
          <div class="panel__content" v-if="internal">
            <el-input
              v-if="editing.value && editing.prop === 'contact'"
              ref="contact"
              style="display: inline-block; width: 200px"
              :value="ruleForm.contact"
              @blur="updateContact"
            ></el-input>
            <template v-else>
              <span>{{ ruleForm.contact}}</span>
              <i class="edit__btn el-icon-edit-outline" @click="edit('contact')"></i>
            </template>
          </div>
          <span v-else>{{ ruleForm.contact }}</span>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobilePhone">
          <!-- <el-input v-model.trim="ruleForm.mobilePhone" placeholder="请输入手机号码" :disabled="false"></el-input> -->
          <div class="panel__content" v-if="internal">
            <el-input
              v-if="editing.value && editing.prop === 'mobilePhone'"
              ref="mobilePhone"
              style="display: inline-block; width: 200px"
              :value="ruleForm.mobilePhone"
              @blur="updateMobilePhone"
            ></el-input>
            <template v-else>
              <span>{{ ruleForm.mobilePhone }}</span>
              <i class="edit__btn el-icon-edit-outline" @click="edit('mobilePhone')"></i>
            </template>
          </div>
          <span v-else>{{ ruleForm.mobilePhone }}</span>
        </el-form-item>
        <el-form-item label="身份证号码:" prop="idCard">
          <span>{{ ruleForm.idCard }}</span>
        </el-form-item>
        <el-form-item label="电话号码:" prop="phone">
          <span>{{ ruleForm.phone }}</span>
        </el-form-item>
        <el-form-item label="电子邮箱:" prop="email">
          <span>{{ ruleForm.email }}</span>
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
          >
            <img v-if="images.hand" :src="images.hand" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </template>

  <script>
  import Vue from 'vue'

  import api from '../../api'
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
            license: ''
          },
          progress: {
            up: 0,
            down: 0,
            hand: 0,
            license: 0
          },
          ruleForm: {},
          rules: {
            fullName: [
            { required: true, message: '请输入企业全称，与营业执照一致', trigger: 'blur' }
            ],
            contact: [
            { required: true, min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
            ],
            mobilePhone: [
            { required: true, validator: validatenumber, trigger: 'blur' }
            ]
          },
          editing: {
            value: false,
            prop: ''
          }
        }
      },
      computed: {
        user () {
          return this.$store.getters.user
        },
        internal () {
          return this.user.roleBean.label === 'ADMIN'
        }
      },
      created () {
        this.org = Number(this.$route.query.org)
        this.getOrg()
      },
      methods: {
        // 获取指定机构
        getOrg () {
          api.IOrganizationManager.getOrg({
            id: this.org
          }).then(res => {
            this.ruleForm = res
            // 图片获取
            this.urls = {
              up: res.cdUpPhotoUrl || '',
              down: res.cdDownPhotoUrl || '',
              hand: res.cdHandPhotoUrl || '',
              license: res.licenseUrl || ''
            }
            this.images = {
              up: res.cdUpPhotoUrl || '',
              down: res.cdDownPhotoUrl || '',
              hand: res.cdHandPhotoUrl || '',
              license: res.licenseUrl || ''
            }
            // this.brokerselected = !!res.isBroker
            // this.distributorselected = !!res.isDistributor
          })
        },

        edit (prop) {
          console.log(prop, { ...this.editing })

          if (this.editing.value) {
            return
          }

          this.editing = {
            value: true,
            prop
          }

          Vue.nextTick(() => {
            this.$refs[prop].focus()
          })
        },

        updateFullName (e) {
          Promise.resolve(true)
            .then(() => {
              this.$store.commit('UPDATE_USER', { fullName: e.target.value })

              this.editing.value = false
            })
            .catch(err => {
              e.target.focus()

              this.$message({
                type: 'error',
                message: err.message || '企业全称修改失败'
              })
            })
        },
        updateContact (e) {
          Promise.resolve(true)
            .then(() => {
              this.$store.commit('UPDATE_USER', { mobilePhone: e.target.value })

              this.editing.value = false
            })
            .catch(err => {
              e.target.focus()

              this.$message({
                type: 'error',
                message: err.message || '手机号修改失败'
              })
            })
        },
        updateMobilePhone (e) {
          Promise.resolve(true)
            .then(() => {
              this.$store.commit('UPDATE_USER', { mobilePhone: e.target.value })

              this.editing.value = false
            })
            .catch(err => {
              e.target.focus()

              this.$message({
                type: 'error',
                message: err.message || '手机号修改失败'
              })
            })
        },

        // upload
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
        }
      }
    }
  </script>

  <style lang="scss" scoped>
    $color: #2bc3c2;
    .pannel__header{
      height: 30px;
      line-height: 30px;
      padding: 0 10px 10px;
      border-bottom: 1px solid #333;
    }
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

    .avatar-uploader-icon:before {
      display: none;
    }

    .el-input__icon{
      position: absolute;
      left: 15px;
      cursor: pointer !important;
    }
    .panel__content {
      display: inline-block;
    }
    .edit__btn {
      margin-left: 10px;
      color: $color;
      transform: scale(1.3);
      cursor: pointer;
    }
  </style>
