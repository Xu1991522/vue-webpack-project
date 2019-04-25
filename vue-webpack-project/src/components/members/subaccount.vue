<template>
  <div class="subaccount--useage-pane">
    <div class="common-top-nav-row">
      <el-select size="small" v-model="role" placeholder="请选择角色">
        <el-option
          label="全部角色"
          value="">
        </el-option>
        <el-option
          v-for="item in rolelist"
          :key="item.value"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-input v-model="loginName" placeholder="登录账号" style="width:200px;display:inline-block;"></el-input>
      <el-button type="primary" @click="getOrganizationSubAccounts(1, pager.size)" style="margin-left:10px;">搜索</el-button>
      <el-button v-if="access.add" size="small" class="confirm-button plus-button" @click="openAddUserPopup">添加子账户</el-button>
    </div>
    <el-table
      :data="users"
      v-loading="loading"
      border style="width: 100%">
      <el-table-column
        prop="loginName"
        label="登录账号"
        min-width="1">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        min-width="1">
      </el-table-column>
      <el-table-column
        label="角色类型"
        min-width="2"
      >
        <template slot-scope="scope">
          {{ scope.row.roleBeans.map(x => x.name).join(',') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="1"
      >
        <template slot-scope="scope">
          {{ multipleRoles(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastLoginOn"
        label="最后登录时间"
        min-width="1"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginOn | time('yyyy-MM-dd HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="1">
        <template slot-scope="scope">
          {{ scope.row.userStatus || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="2">
        <template slot-scope="scope">
          <div>
            <el-button type="text" :disabled="scope.row.id === organization.adminClient || scope.row.id === user.id" @click="openEditUserPopup(scope.row)">修改</el-button>
            <el-button type="text" :disabled="scope.row.id === organization.adminClient || scope.row.id === user.id" @click="openDeleteUserPopup(scope.row)">删除</el-button>
            <el-button type="text" @click="openResetPasswordPopup(scope.row)">重置密码</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="size => getOrganizationSubAccounts(1, size)"
      @current-change="page => getOrganizationSubAccounts(page, pager.size)"
      :current-page="pager.index"
      :page-sizes="[10, 20, 30, 40,50]"
      layout="total, sizes,prev, pager, next,jumper"
      :page-size="pager.size"
      :total="pager.total"
    ></el-pagination>

    <el-dialog
      show-close
      :title="userPopup.id == null ? '添加子账户' : '修改'"
      :visible="userPopup.visible"
      @close="userPopup.visible = false"
      width="500px"
      left>
      <div style="width:80%;margin:0 auto">
        <el-form
          :model="userPopup"
          :rules="rules"
          ref="userForm"
          label-width="70px"
          @validate="onValidate"
        >
          <el-form-item label="登录账号" prop="loginName">
            <el-input v-model="userPopup.loginName" :disabled="userPopup.id != null" placeholder="请输入登录账号"></el-input>
          </el-form-item>
          <el-form-item label="初始密码" required v-if="userPopup.id == null">
            <el-input :value="userPopup.loginName + '123'" placeholder="初始密码" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userPopup.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userPopup.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="userPopup.email" placeholder="请输入电子邮箱"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roles">
            <el-select ref="roles" size="medium" v-model="userPopup.roles" multiple placeholder="请选择角色" style="width: 100%" @blur="onRolesBlur">
              <el-option
                v-for="item in rolelist"
                :key="item.value"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userPopup.visible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'

import api from '../../api'

import time from '../../filters/time'

const validatenumber = (rule, value, callback) => {
  console.log('invoke mobile rule', value)

  if (isNaN(value) || value.length !== 11) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const validatemail = (rule, value, callback) => {
  var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/g

  if (value && !reg.test(value)) {
    callback(new Error('请输入正确的电子邮箱'))
  } else {
    callback()
  }
}

export default {
  data () {
    return {
      loading: false,

      organization: {},

      role: '',
      loginName: '',

      rolelist: [],

      pager: {
        index: 1,
        size: 10,
        total: 0
      },

      users: [],

      rules: {
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
          { required: true, validator: validatenumber, trigger: 'blur' }
        ],
        email: [
          { validator: validatemail, trigger: 'blur' }
        ],
        roles: [
          {
            validator: (rule, value, callback) => {
              console.log('invoke roles validator', value)

              if (!value.length) {
                return callback(Error('请选择角色'))
              }

              callback()
            },
            trigger: 'blur'
          }
        ]
      },

      userPopup: {
        visible: false,
        id: null,
        loginName: '',
        name: '',
        mobile: '',
        email: '',
        roles: [],

        submitting: false
      },
      updateRules: {
        loginName: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入1-20个字符', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatenumber, trigger: 'blur' }
        ],
        email: [
          { validator: validatemail, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    access () {
      const {
        ADD_MANAGER,
        UPDATE_MANAGER,
        REMOVE_MANAGER
      } = this.$store.getters.access

      return {
        add: ADD_MANAGER,
        update: UPDATE_MANAGER,
        remove: REMOVE_MANAGER
      }
    }
  },
  methods: {
    onValidate (...args) {
      console.log('onValidate', ...args)
    },
    onRolesBlur () {
      console.log('blur')
    },
    getOrganizationDetails () {
      api.IOrganizationManager.getOrg({ id: this.user.orgId })
        .then(res => {
          this.organization = res
        })
    },
    getOrganizationSubAccounts (index, size) {
      if (this.loading) {
        return
      }

      this.loading = true

      api.IOrganizationManager.getOrganizationSubUsers({
        role: this.role || null,
        loginName: this.loginName || null,
        page: index - 1,
        size
      })
        .then(res => {
          this.pager = {
            index: res.number + 1,
            size: res.size,
            total: res.totalElements
          }

          this.users = res.content
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取子账号列表失败'
          })
        })
        .then(() => {
          this.loading = false
        })
    },
    getOrganizationRoles () {
      api.IOrganizationManager.getOrgRoles({ userId: this.user.id })
        .then(res => {
          this.rolelist = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取企业下人员角色信息失败'
          })
        })
    },
    save () {
      if (this.userPopup.submitting) {
        return
      }

      this.$refs.userForm.validate(valid => {
        if (!valid) {
          return
        }

        const { id, loginName, name, mobile, email, roles } = this.userPopup

        ;(id == null
          ? api.IOrganizationManager.addOrganizationSubUser({ loginName, name, mobile, email, roles: roles.join(',') })
          : api.IOrganizationManager.updateOrganizationSubUser({ id, loginName, name, mobile, email, roles: roles.join(',') })
        )
          .then(res => {
            this.getOrganizationSubAccounts(1, this.pager.size)

            this.userPopup.visible = false
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || (id ? '修改' : '添加') + '失败'
            })
          })
      })
    },
    openAddUserPopup () {
      this.userPopup = {
        visible: true,
        id: null,
        loginName: '',
        name: '',
        mobile: '',
        email: '',
        roles: [],
        submitting: false
      }

      // $refs.userForm will be created until it's vdom mounted
      Vue.nextTick(() => this.$refs.userForm.clearValidate())
    },
    openEditUserPopup (user) {
      this.userPopup = {
        visible: true,
        id: user.id,
        loginName: user.loginName,
        name: user.name,
        mobile: user.mobile || '',
        email: user.email || '',
        roles: user.roleBeans.map(x => x.name),
        submitting: false
      }

      Vue.nextTick(() => this.$refs.userForm.clearValidate())
    },
    openDeleteUserPopup (user) {
      this.$msgbox({
        type: 'warning',
        title: '删除提示',
        message: '您确定要删除账号【' + user.name + '】?'
      })
        .then(() => {
          api.IOrganizationManager.delteOrganizationSubUser({ subId: user.id })
            .then(res => {
              this.getOrganizationSubAccounts(this.pager.index)

              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message || '删除失败'
              })
            })
        })
        .catch(x => x)
    },
    openResetPasswordPopup (user) {
      this.$msgbox({
        title: '重置密码',
        message: (
          <div style="text-align:center; line-height:24px">
            您确认重置【{user.name}】的登录密码吗?<br />
            <span style="display:block; color:#e6a23c">该账户重置后的初始密码为“{user.name + '123'}”</span>
          </div>
        )
      })
        .then(() => {
          api.IUserService.resetPassword({ loginName: user.loginName })
            .then(res => {
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
        })
        .catch(x => x)
    }
  },
  created () {
    this.getOrganizationDetails()

    this.getOrganizationRoles()

    this.getOrganizationSubAccounts(1, this.pager.size)
  },
  watch: {
    'userPopup.roles' () {
      // element bug: can't re validate multiple select when value changes
      this.$refs.userForm && this.$refs.userForm.validateField('roles', x => x)
    }
  },
  filters: {
    time
  }
}
</script>
<style lang="scss">
.subaccount--useage-pane {
  .el-select .el-select--medium {
    margin-right: 8px;
    float: left;
    width: 100%;
  }
}
</style>

<style scoped>
.search-button {
  margin-left: 10px;
}
.plus-button {
  position: absolute;
  right: 25px;
  top: 20px;
}
.row-class-name {
  color: red;
}
</style>
