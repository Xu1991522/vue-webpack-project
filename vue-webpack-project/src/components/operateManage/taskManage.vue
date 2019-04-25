<template>
  <div>
    <el-table
      v-loading="loading"
      :data="pagebean"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="任务名称"
        min-width="25">
      </el-table-column>
      <el-table-column
        prop="runningStatusName"
        label="运行状态"
        min-width="8">
      </el-table-column>
      <el-table-column
        prop="description"
        label="任务描述"
        min-width="40">
      </el-table-column>
      <el-table-column
        prop="statusName"
        label="任务状态"
        width="100">
      </el-table-column>
      <el-table-column v-if="access.update"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="operate('runRightNow',pagebean[scope.$index].name)" v-if="access.update && pagebean[scope.$index].runningStatusName === '就绪待执行'">立即执行</el-button>
          <el-button type="text" size="small" @click="operate('disable',pagebean[scope.$index].name)" v-if="access.update && pagebean[scope.$index].statusName === '启用'">禁用</el-button>
          <el-button type="text" size="small" @click="operate('enable',pagebean[scope.$index].name)" v-if="access.update && pagebean[scope.$index].statusName === '禁用'">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.pageIndex"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.recCount">
      </el-pagination>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      loading: true, // 表格加载
      pager: {
        pageIndex: 1,
        pageSize: 10,
        recCount: 0
      }, // 分页
      pagebean: []
    }
  },
  computed: {
    access () {
      const {
        UPDATE_TASK
      } = this.$store.getters.access

      return {
        update: UPDATE_TASK
      }
    }
  },
  created () {
    this.list()
  },
  methods: {
    list () {
      // 列出任务
      this.$api.ITaskManager.list({
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
      this.list()
    },
    handleSizeChange (val) {
      this.pager.pageSize = val
      this.list()
    },
    enableJob (name) {
      this.$api.ITaskManager.enableJob({
        name: name
      }).then(res => {
        if (res) {
          this.list()
          this.$message({
            message: '启用成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '启用失败，请联系管理员',
            type: 'error'
          })
        }
      })
    },
    runRightNow (name) {
      this.$api.ITaskManager.runRightNow({
        name: name
      }).then(res => {
        if (res) {
          this.list()
          this.$message({
            message: '执行成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '执行失败，请联系管理员',
            type: 'error'
          })
        }
      })
    },
    disable (name) {
      this.$api.ITaskManager.disable({
        name: name
      }).then(res => {
        if (res) {
          this.list()
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '禁用失败，请联系管理员',
            type: 'error'
          })
        }
      })
    },
    operate (type, name) {
      if (type === 'runRightNow') {
        this.$confirm('您确定要立即执行' + name + '么', {
          type: 'warning'
        }).then(() => {
          this.runRightNow(name)
        }).catch(x => x)
      } else if (type === 'disable') {
        this.$confirm('您确定要禁用' + name + '么', {
          type: 'warning'
        }).then(() => {
          this.disable(name)
        }).catch(x => x)
      } else {
        this.$confirm('您确定要启用' + name + '么', {
          type: 'warning'
        }).then(() => {
          this.enableJob(name)
        }).catch(x => x)
      }
    }
  }
}
</script>

<style scoped>
</style>
