<template>
  <div>
    <el-dialog :title="type === 'edit'?'编辑卡分组':'创建卡分组'" :visible.sync="addpop" :close-on-click-modal="false" width="30%">
      名称:<el-input v-model="name" placeholder="2-30个字符" style="width:340px;margin-left:15px;"></el-input>
       <span slot="footer" class="dialog-footer">
          <el-button @click="addpop = false">取 消</el-button>
          <el-button type="primary" @click="addGroup('add')">确 定</el-button>
        </span>
    </el-dialog>
    <BackButton></BackButton>
    <el-button type="primary" size="small" class="filtmanagebutton" @click="addpop = true">添加分组</el-button>
    <el-dialog
        title="编辑卡分组"
        :close-on-click-modal="false"
        :visible.sync="infopop"
        width="25%">
      <div style="margin-left:20px;">
          <span style="margin-right:15px">名称:</span><el-input style="width:70%" placeholder="请输入分组名称" v-model="name"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="infopop = false">取 消</el-button>
        <el-button class="confirm-button" @click="addGroup('edit')">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="pagebean"
      style="width: 100%;margin-top:10px;">
      <el-table-column
        prop="groupName"
        label="组名称"
        min-width="8">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="2">
        <templete slot-scope="scope">
          <span style="color:#279bf9;cursor:pointer" @click="operate('edit',scope.$index)">编辑</span>
          <span style="color:#FF542F;cursor:pointer;margin-left:10px;" @click="operate('delete',scope.$index)">删除</span>
        </templete>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40,50]"
        :current-page="pager.pageIndex"
        layout="sizes, prev, pager, next"
        :page-size="pager.pageSize"
        :total="pager.recCount">
      </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true, // 表格加载
      type: 'add',
      addpop: false,
      editid: '',
      name: '',
      pagebean: [],
      infopop: false,
      pager: {
        pageIndex: 1,
        pageSize: 10,
        recCount: 0
      } // 分
    }
  },
  created () {
    this.getGroupList()
  },
  methods: {
    operate (type, index) {
      if (type === 'delete') {
        this.$confirm('您确定要删除' + this.pagebean[index].groupName + '么?', {
          type: 'warning'
        }).then(() => {
          this.deleteGroup(this.pagebean[index].groupId)
        }).catch(x => x)
      } else {
        this.type = 'edit'
        this.editid = this.pagebean[index].groupId
        this.name = this.pagebean[index].groupName
        this.infopop = true
      }
    },
    deleteGroup (groupId) {
      // 删除分祖
      this.$api.ICardGroupManager.deleteGroup({
        id: groupId
      }).then(res => {
        if (res) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getGroupList()
        } else {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        }
      })
    },
    addGroup (type) {
      if (this.name.length < 2 || this.name.length > 30) {
        this.$message({
          message: '组名为2-30个字符，请重新输入',
          type: 'warning'
        })
      } else {
        if (this.type === 'add') {
          // 增加分组
          this.$api.ICardGroupManager.addGroup({
            name: this.name
          }).then(res => {
            if (res) {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.addpop = false
              this.name = ''
              this.getGroupList()
            } else {
              this.addpop = false
              this.name = ''
              this.$message({
                message: '创建失败',
                type: 'error'
              })
            }
          })
        } else {
          // 编辑分组
          this.$api.ICardGroupManager.updateGroup({
            id: this.editid,
            name: this.name
          }).then(res => {
            if (res) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.infopop = false
              this.getGroupList()
            } else {
              this.$message({
                message: '修改失败',
                type: 'error'
              })
              this.infopop = false
            }
          })
        }
      }
    },
    getGroupList () {
      // 分组们
      this.$api.ICardGroupManager.getGroupList({
        id: this.$store.getters.user.id,
        page: this.pager.pageIndex - 1,
        size: this.pager.pageSize
      }).then(res => {
        this.loading = false
        this.pagebean = res.content
        this.pager.pageIndex = res.number + 1
        this.pager.pageSize = res.size
        this.pager.recCount = res.totalElements
      })
    },
    handleCurrentChange (val) {
      this.pager.pageIndex = val
      this.getGroupList()
    },
    handleSizeChange (val) {
      this.pager.pageSize = val
      this.getGroupList()
    }
  }
}
</script>

<style scoped>
.filtmanagebutton {
  position: absolute;
  top: 14px;
  right: 20px;
}
</style>
