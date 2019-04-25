<template>
  <div class="container__roles">
    <div>
      <div class="tab-con">
        <div class="authCreate" v-if="access.add">
          <el-row class="roleBtn">
            <el-button @click="$router.push({ path: '/authorityManage/addRoles', query: { title: '添加角色' } })" type="primary" size="small">添加角色</el-button>
          </el-row>
        </div>
        <div class="authTable">
          <el-table :data="roles" v-loading="loading" border style="width: 100%">
            <el-table-column prop="name" label="角色名称" align="center" width="280">
            </el-table-column>
            <el-table-column label="权限列表" align="left">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #038ae3"
                  @click="$router.push({ path: '/authorityManage/assignPermissions', query: { id: scope.row.id, name: scope.row.name, title: scope.row.name + '权限列表' } })"
                >
                  查看详情
                </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="90">
              <template slot-scope="scope">
                <el-button v-if="access.remove" :disabled="removable.indexOf(scope.row.id) === -1" @click="deleteRole(scope.row)" type="text">删除</el-button>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @current-change="index => { pager.index = index }"
            :current-page="pager.index"
            layout="prev, pager, next"
            :page-size="pager.size"
            :total="pager.count"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api'

  export default {
    name: '',
    data () {
      return {
        loading: true, // 表格加载
        source: [],
        removable: [],
        pager: {
          index: 1,
          size: 10,
          count: 0
        }
      }
    },
    computed: {
      roles () {
        const { index, size } = this.pager
        const from = (index - 1) * size

        return this.source.slice(from, from + size)
      },
      access () {
        const {
          ADD_ROLE,
          REMOVE_ROLE
        } = this.$store.getters.access

        return {
          add: ADD_ROLE,
          remove: REMOVE_ROLE
        }
      }
    },
    methods: {
      setup () {
        // const all = api.IUserService.getAllRole({})
        const all = api.IOrganizationManager.getOrgRoles({ userId: this.$store.getters.user.id })
        const removable = [] // api.IUserService.getDeleteAuth({})

        Promise.all([all, removable])
          .then(([r1, r2]) => {
            this.source = r1

            this.pager = {
              index: 1,
              size: this.pager.size,
              count: r1.length
            }

            this.removable = r2.map(x => x.id)

            this.loading = false
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取角色信息失败'
            })
          })
      },
      deleteRole (role) {
        const fn = () => {
          const roleId = role.id

          api.IUserService.deleteRole({ roleId })
            .then(res => {
              this.source = this.source.filter(x => x.id !== roleId)

              // re compute pager
              // check index was not larger than total pages
              const { index, size } = this.pager
              const count = this.source.length
              const total = Math.ceil(count / size)

              this.pager = {
                index: index > total ? total : index,
                size,
                count
              }

              this.$message({
                type: 'success',
                message: '角色删除成功'
              })
            }).catch(err => {
              this.$message({
                type: 'error',
                message: err.message || '角色删除失败'
              })
            })
        }

        this.$msgbox({
          title: '删除角色',
          message: '您确定要删除该角色吗？',
          showCancelButton: true
        })
          .then(fn)
          .catch(x => x)
      }
    },
    created () {
      this.setup()
    }
  }
</script>

<style>
  .container__roles .el-button.is-disabled {
    color: #ccc;
  }
</style>

<style scoped>
  a {
    text-decoration: none;
    color: #3573a4;
  }

  .tab-header b {
    display: inline-block;
    padding: 2px;
    border-bottom: 2px solid #409eff;
  }

  .tab-con {
    position: relative;
  }
  .authCreate {
    display: block;
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .roleBtn {
    float: right;
  }
  .roleIpt {
    width: 250px;
    display: inline-block;
  }
  .roleBtn {
    display: inline-block;
    margin-left: 20px;
  }
  .authTable {
    position: relative;
    margin-top: 20px;
    width: 100%;
    height: auto;
  }
</style>
