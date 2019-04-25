<template>
  <div>
    <div class="common-top-nav-row">
      <el-select v-model="roleid" placeholder="请选择">
        <el-option
          label="全部角色"
          value="">
        </el-option>
        <el-option
          v-for="item in rolelist"
          :key="item.value"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="status" placeholder="请选择">
        <el-option
          label="全部状态"
          value="">
        </el-option>
        <el-option
          v-for="item in statusoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <SearchButton class="search-button" @handlsearch="getUserByRoleAndStatus(pager.index)"></SearchButton>
      <el-button v-if="access.add" size="small" class="confirm-button plus-button" :title="'创建'" @click="turnrouter('/adminAccount/addAdmin')">添加子账号</el-button>
    </div>

    <el-table
      :data="userEntities"
      v-loading="loading"
      border style="width: 100%">
      <el-table-column
        prop="loginName"
        label="登录账号"
        min-width="1">
      </el-table-column>
      <el-table-column
        prop="name"
        label="真实姓名"
        min-width="1">
      </el-table-column>
      <el-table-column
        prop="roleBean.name"
        label="角色类型"
        min-width="1">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="2"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | time('yyyy-MM-dd HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastLoginOn"
        label="最后登录时间"
        min-width="2"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginOn | time('yyyy-MM-dd HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="1">
        <template slot-scope="scope">
          {{ scope.row.userStatus | userStatus }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="1">
        <template slot-scope="scope">
          <div v-if="access.update || access.remove">
            <span v-if="access.update && scope.row.userStatus === 'NORMAL'" @click="updateUserStatus('STOPPING', scope.row)" style="color: #038ae3; cursor: pointer">禁用</span>
            <span v-if="access.update && scope.row.userStatus === 'STOPPING'" @click="updateUserStatus('NORMAL', scope.row)" style="color: #038ae3; cursor: pointer">启用</span>
            <span v-if="access.remove && access.update"> | </span>
            <span v-if="access.remove" @click="updateUserStatus('DELETE', scope.row)" style="color: #ff335d; cursor: pointer">删除</span>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="pager.index"
      layout="prev, pager, next"
      :page-size="pager.size"
      :total="pager.total"
    ></el-pagination>
  </div>
</template>

<script>
import api from '../../api'

import UserStatus from '../../constants/user-status'

import time from '../../filters/time'

export default {
  data () {
    return {
      loading: true, // 表格加载
      roleid: '',
      status: '',
      rolelist: [],
      pager: {
        index: 1,
        size: 10,
        total: 0
      },
      statusoptions: [
            /* {
              label: '删除',
              value: UserStatus.DELETE
            }, */ {
          label: '正常',
          value: UserStatus.NORMAL
        }, {
          label: '禁用',
          value: UserStatus.STOPPING
        }
      ],
      userEntities: []
    }
  },
  computed: {
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
    getUserByRoleAndStatus (pageIndex) {
      api.IUserService.getUserByRoleAndStatus({
        roleId: this.roleid,
        status: this.status || null,
        pageIndex: pageIndex - 1,
        pageSize: this.pager.size
      }).then(res => {
        this.loading = false
        this.pager = {
          index: res.number + 1,
          size: res.size,
          total: res.totalElements
        }

        this.userEntities = res.content
      })
    },
    updateUserStatus (status, user) {
      const texts = {
        NORMAL: '启用',
        STOPPING: '禁用',
        DELETE: '删除'
      }

      const text = texts[status]

      this.$confirm('您确定要' + text + '【' + user.name + '】成员吗?', text + '用户', {
        type: 'warning',
        confirmButtonClass: 'confirmButtonClass'
      })
        .then(() => {
          (
            status === 'DELETE'
              ? api.IUserService.deleteManager({ loginName: user.loginName })
              : api.IUserService.updateUserStatus({ status: status, id: user.id })
          )
            .then(res => {
              this.getUserByRoleAndStatus(this.pager.index)

              this.$message({
                type: 'success',
                message: text + '成功'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message || text + '失败'
              })
            })
        })
        .catch(x => x)
    },
    getAllRole () {
      api.IUserService.getAllRole({}).then(res => {
        this.rolelist = res
      })
    },
    handlsearch () {
      alert('组件触发搜索，在这里调接口')
    },
    handleCurrentChange (val) {
      this.getUserByRoleAndStatus(val)
    },
    turnrouter (route) {
      this.$router.push({
        path: route
      })
    },
    setup () {
      this.getAllRole()// 获取所有角色信息
      this.getUserByRoleAndStatus(1)// 获取表格
    }
  },
  created () {
    this.setup()
  },
  filters: {
    time,
    userStatus: status => {
      switch (status) {
        case UserStatus.DELETE:
          return '已删除'

        case UserStatus.NORMAL:
          return '正常'

        case UserStatus.STOPPING:
          return '禁用'

        default:
          throw Error('unexpected user status: ' + status)
      }
    }
  }
}
</script>

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
