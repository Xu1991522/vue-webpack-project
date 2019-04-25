<template>
  <div id="operationRecords">
    <div class="operateTable">
      <el-table
        :data="data"
        :row-class-name="tableRowClassName"
        border
        style="width: 100%"
      >
        <el-table-column prop="admin" label="操作管理员" width="180" align="center">
        </el-table-column>
        <el-table-column prop="operateType" label="操作类型" align="center" width="380">
        </el-table-column>
        <el-table-column prop="operateContent" align="center" label="操作内容">
        </el-table-column>
        <el-table-column label="操作时间" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.operateTime | time('yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="block pageCon">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          :current-page="pager.page"
          :page-size="pager.size"
          :total="pager.total"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import time from '../../filters/time'

  export default {
    name: 'operationRecords',
    data () {
      return {
        pager: {
          page: 1,
          size: 20,
          total: 1
        },
        data: [
          {
            admin: 'a1',
            operateType: '>>=',
            operateContent: 'some content',
            operateTime: +new Date()
          }
        ]
      }
    },
    created () {},
    methods: {
      tableRowClassName ({ row, rowIndex }) {
        if (rowIndex === 1) {
          return 'color-row'
        }
        return ''
      },
      handleCurrentChange () {}
    },
    filters: {
      time
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
  .tab-header b {
    display: inline-block;
    padding: 2px;
    border-bottom: 2px solid #409eff;
  }
  .tab-con {
    position: relative;
    margin-top: 15px;
  }
  .operateTable {
    position: relative;
    margin-top: 20px;
    width: 100%;
    height: auto;
  }
  .pageCon {
    margin-top: 15px;
    float: right;
  }
  .el-table .color-row {
    background: #f0f9eb;
  }
</style>
