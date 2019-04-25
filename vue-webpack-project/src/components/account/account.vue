<template>
  <div>
    <div class="panel__group">
      <div class="panel__title">
        基本信息
      </div>
      <ul class="panel__items">
        <li class="panel__item">
          <label class="panel__label label--account">登录账号：</label>
          <div class="panel__content">
            {{ user.loginName }}
          </div>
        </li>

        <li class="panel__item">
          <label class="panel__label label--password">密码：</label>
          <div class="panel__content">
            <a class="link" @click="openPasswordResetPopup">修改密码</a>
          </div>
        </li>

        <li class="panel__item">
          <label class="panel__label label--name">姓名：</label>
          <div class="panel__content">
            {{ user.name }}
          </div>
        </li>

        <li class="panel__item">
          <label class="panel__label label--role">角色：</label>
          <div class="panel__content">
            {{ user.roleBeans.map(x => x.name).join(' || ') }}
          </div>
        </li>
      </ul>
    </div>

    <div class="panel__group">
      <div class="panel__title">
        联系方式
      </div>
      <ul class="panel__items">
        <li class="panel__item">
          <label class="panel__label label--email">邮箱</label>
          <div class="panel__content">
            <el-input
              v-if="editing.value && editing.prop === 'email'"
              ref="email"
              style="display: inline-block; width: 200px"
              :value="user.email"
              @blur="updateEmail"
            ></el-input>
            <template v-else>
              <span>{{ user.email }}</span>
              <i class="edit__btn el-icon-edit-outline" @click="edit('email')"></i>
            </template>
          </div>
        </li>

        <li class="panel__item">
          <label class="panel__label label--telephone">手机号</label>
          <div class="panel__content">
            <el-input
              v-if="editing.value && editing.prop === 'mobile'"
              ref="mobile"
              style="display: inline-block; width: 200px"
              :value="user.mobile"
              @blur="updateMobile"
            ></el-input>
            <template v-else>
              <span>{{ user.mobile }}</span>
              <i class="edit__btn el-icon-edit-outline" @click="edit('mobile')"></i>
            </template>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog
      title="修改密码"
      width="450px"
      :visible="changePasswordPopup.visible"
      @close="changePasswordPopup.visible = false"
    >
      <el-form>
        <el-form-item
          label="新密码"
          required
          label-width="120px"
          :error="changePasswordPopup.oldPassword.error"
        >
          <el-input
            type="password"
            v-model="changePasswordPopup.oldPassword.value"
            placeholder="请输入1-20个字符"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="再次输入新密码"
          required
          label-width="120px"
          :error="changePasswordPopup.newPassword.error"
        >
          <el-input
            type="password"
            v-model="changePasswordPopup.newPassword.value"
            placeholder="再次输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePasswordPopup.visible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'

  import api from '../../api'

  export default {
    data () {
      return {
        changePasswordPopup: {
          visible: false,
          oldPassword: {
            value: '',
            error: ''
          },
          newPassword: {
            value: '',
            error: ''
          }
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
      }
    },
    methods: {
      openPasswordResetPopup () {
        this.changePasswordPopup = {
          visible: true,
          oldPassword: {
            value: '',
            touched: false,
            valid: false,
            error: ''
          },
          newPassword: {
            value: '',
            touched: false,
            valid: false,
            error: ''
          }
        }
      },
      changePassword () {
        const { oldPassword, newPassword } = this.changePasswordPopup

        const oldValue = oldPassword.value.trim()
        const newValue = newPassword.value.trim()

        if (!oldValue) {
          oldPassword.valid = false
          oldPassword.error = '请输入新密码'
        } else if (oldValue.length > 20) {
          oldPassword.valid = false
          oldPassword.error = '新密码1-20个字符'
        } else {
          oldPassword.valid = true
          oldPassword.error = ''
        }

        console.log('check changePasswordPopup.oldPassword', { ...oldPassword })

        if (!newValue) {
          newPassword.valid = false
          newPassword.error = '请再次输入新密码'
        } else if (newValue !== oldPassword.value) {
          newPassword.valid = false
          newPassword.error = '新密码两次输入不一致'
        } else {
          newPassword.valid = true
          newPassword.error = ''
        }

        console.log('check changePasswordPopup.newPassword', { ...newPassword })

        if (!(oldPassword.valid && newPassword.valid)) {
          return
        }

        api.IUserService.updateDefaultPassword({ loginName: this.user.loginName, password: newValue })
          .then(() => {
            this.changePasswordPopup.visible = false
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '密码修改失败'
            })
          })
      },
      updateEmail (e) {
        const email = e.target.value.trim()

        api.IOrganizationManager.updateOrganizationSubUser({ ...this.user, email, roles: this.user.roleBeans.map(x => x.name).join(',') })
          .then(() => {
            this.$store.commit('UPDATE_USER', { email })

            this.editing.value = false
          })
          .catch(err => {
            e.target.focus()

            this.$message({
              type: 'error',
              message: err.message || '邮箱修改失败'
            })
          })
      },
      updateMobile (e) {
        const mobile = e.target.value.trim()

        api.IOrganizationManager.updateOrganizationSubUser({ ...this.user, mobile, roles: this.user.roleBeans.map(x => x.name).join(',') })
          .then(() => {
            this.$store.commit('UPDATE_USER', { mobile })

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
      edit (prop) {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  $color: #038ae3;

  .panel__title {
    position: relative;
    padding-left: 8px;
    line-height: 20px;
    font-size: 14px;
    color: #555;
    font-weight: bolder;

    &:before {
      display: block;
      content: '';
      width: 4px;
      height: 80%;
      position: absolute;
      left: 0;
      top: 10%;
      background: $color;
    }
  }

  .panel__items {
    padding: 10px 0 10px 40px;
    font-size: 13px;
  }

  .panel__item {
    padding: 8px 0;
  }

  .panel__label {
    display: inline-block;
    width: 100px;
    padding-left: 24px;
    background-repeat: no-repeat;
    background-position: left center;
    color: #666;

    &.label--account {
      background-image: url('../../assets/icon-user-account.png');
    }

    &.label--password {
      background-image: url('../../assets/icon-user-password.png');
    }

    &.label--name {
      background-image: url('../../assets/icon-user-name.png');
    }

    &.label--role {
      background-image: url('../../assets/icon-user-role.png');
    }

    &.label--email {
      background-image: url('../../assets/icon-user-email.png');
    }

    &.label--telephone {
      background-image: url('../../assets/icon-user-telephone.png');
    }
  }

  .panel__content {
    display: inline-block;
  }

  .link {
    color: $color;
    text-decoration: underline;
    cursor: pointer;
  }

  .edit__btn {
    margin-left: 10px;
    color: $color;
    transform: scale(1.3);
    cursor: pointer;
  }
</style>
