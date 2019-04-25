<template>
  <div>
    <BackButton></BackButton>

    <div class="tab-con">
      <div class="permissionTable">
        <permissions-table
          v-if="permissions.length"
          :permissions="permissions"
          :granted="granted"
          :configurable="access.update"
          @change="val => { selected = val }"
        />
        <div v-else style="padding: 20px">权限加载中...</div>
      </div>
      <div class="buttonCon" v-if="access.update">
        <el-row>
          <el-button type="primary" size="small" @click="save" style="margin-right:15px;">保存配置</el-button>
          <el-button @click="cancel" size="small">&emsp;取消&emsp;</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api'

  import permissionsTable from './permissionsTable'

  export default {
    name: 'assignPermissions',
    data () {
      return {
        action: '',
        role: {
          id: '',
          name: ''
        },
        permissions: [],
        granted: [],
        selected: [],

        submitting: false
      }
    },
    computed: {
      access () {
        const {
          UPDATE_ROLE
        } = this.$store.getters.access

        return {
          update: UPDATE_ROLE
        }
      }
    },
    methods: {
      save () {
        if (this.submitting) {
          return
        }

        if (!this.selected.length) {
          return this.$message({
            type: 'error',
            message: '请配置角色权限'
          })
        }

        this.submitting = true

        api.IUserService.addRole({ roleId: this.role.id, roleName: this.role.name, role: this.selected })
          .then(res => {
            if (!res) {
              return Promise.reject(Error('保存失败'))
            }

            // case: user is admin
            // refresh current operate permissions
            if (this.role.id === this.$store.getters.user.roleBean.id) {
              this.$store.dispatch('REFRESH_PERMISSIONS')
                .then(() => this.$router.back())
                .catch(err => {
                  this.$message({
                    type: 'error',
                    message: err.message || '重新获取权限失败'
                  })
                })
            } else {
              this.$router.back()
            }
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
    created () {
      const query = this.$route.query

      if (query.id) {
        this.role = {
          id: +query.id,
          name: query.name
        }

        api.IUserService.getAuthList({ roleId: +query.id })
          .then(res => {
            this.granted = res

            this.selected = res
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取角色[' + query.name + ']权限失败'
            })
          })
      }

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
    components: {
      permissionsTable
    }
  }
</script>

<style scoped>
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
  .permissionTable {
    margin-bottom: 50px;
  }
  .mark {
    color: red;
    font-style: normal;
  }
</style>
