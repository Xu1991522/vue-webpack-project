<template>
  <div>
    <BackButton></BackButton>

    <div class="tab-con">
      <div class="creatName">
        <span>
          <em class="mark">*&nbsp;</em>角色名称</span>
        <el-input v-model="role.name" placeholder="请输入角色名称" class="roleIpt"></el-input>
      </div>
      <div class="userDefined">
        <span>
          <em class="mark">*&nbsp;</em>配置权限</span>
          <div class="userTableData">
            <permissions-table
              v-if="permissions.length"
              :permissions="permissions"
              :granted="granted"
              :configurable="true"
              @change="val => { selected = val }"
            />
            <div v-else style="padding: 20px">权限加载中...</div>
        </div>
        <div class="buttonCon">
          <el-row>
            <el-button type="primary" size="small" @click="save" style="margin-right:15px;">&emsp;添加&emsp;</el-button>
            <el-button @click="cancel" size="small">&emsp;取消&emsp;</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api'

  import permissionsTable from './permissionsTable'

  export default {
    name: 'addRoles',
    data () {
      return {
        roles: [],
        role: {
          name: ''
        },
        permissions: [],
        granted: [],
        selected: [],

        submitting: false
      }
    },
    created () {
      api.IUserService.getAllRole({})
        .then(res => {
          this.roles = res
        })

      api.IUserService.getAllMenuBeans({})
        .then(res => {
          this.permissions = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取全部权限失败'
          })
        })
    },
    methods: {
      save () {
        if (this.submitting) {
          return
        }

        const name = this.role.name.trim()

        if (!name) {
          return this.$message({
            type: 'error',
            message: '请填写角色名称'
          })
        }

        const len = name.length

        if (len > 20) {
          return this.$message({
            type: 'error',
            message: '字符超过限制'
          })
        }

        if (this.roles.find(x => x.name === name)) {
          return this.$message({
            type: 'error',
            message: '重复的角色名称'
          })
        }

        if (!this.selected.length) {
          return this.$message({
            type: 'error',
            message: '请配置角色权限'
          })
        }

        this.submitting = true

        api.IUserService.addRole({ roleName: name, role: this.selected })
          .then(res => {
            if (!res) {
              return Promise.reject(Error('保存失败'))
            }

            this.$router.back()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
          })
          .then(() => {
            this.submitting = false
          })
      },
      cancel () {
        this.$router.back()
      }
    },
    components: {
      permissionsTable
    }
  }
</script>

<style scoped>
  html,
  body {
    margin: 0;
    padding: 0;
    background: #e7ebed;
  }
  em {
    font-style: normal;
  }
  b.roleName {
    color: #333;
    position: absolute;
    top: 1.56rem;
    left: 5.2rem;
  }
  .tab-con {
    position: relative;
    margin-top: 20px;
    padding: 0 10px;
  }
  .creatName {
    position: relative;
    margin-bottom: 15px;
  }
  .creatName > span {
    display: inline-block;
    margin-right: 30px;
  }
  .roleIpt {
    display: inline-block;
    width: 500px;
  }
  div.userDefined > span {
    display: block;
    margin-bottom: 15px;
  }
  .buttonCon {
    position: relative;
    margin: 30px 0;
  }
  .mark {
    color: red;
    font-style: normal;
  }
</style>
