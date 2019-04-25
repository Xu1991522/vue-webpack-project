<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="管理员权限" name="first">
        <div>
          <el-table
            :data="tableData1"
            :span-method="objectSpanMethod"
            border
            style="width: 100%">
            <el-table-column
              prop="levelOne"
              label="一级菜单"
              min-width="1">
              <template slot-scope="scope">
                <el-checkbox v-model="checked">{{scope.row.levelOne}}</el-checkbox>
                <!-- <el-checkbox :key="scope.row.iccid" :value="!!multipleSelection[scope.row.iccid]" @change="toggleSelect(scope.row)"></el-checkbox> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="levelTwo"
              label="二级菜单"
              min-width="1">
              <template slot-scope="scope">
                <el-checkbox v-model="checked">{{scope.row.levelTwo}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="levelThree"
              label="三级菜单"
              min-width="1">
              <template slot-scope="scope">
                <div v-if="scope.row.levelThree.length === 1">
                  <el-checkbox
                    v-model="checked"
                  >{{ scope.row.levelThree }}</el-checkbox>
                </div>
                <div v-else-if="scope.row.levelThree === ''">
                  <span>无</span>
                </div>
                <div v-else>
                  <el-checkbox
                    v-model="checked"
                    v-for="value in scope.row.levelThree"
                    :key="value.id"
                  >{{ value }}</el-checkbox>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="运营权限" name="second">运营权限</el-tab-pane>
      <el-tab-pane label="销售权限" name="third">销售权限</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeName: 'first',
        checked: true,
        tableData1: [
            {
              levelOne: '合作方管理',
              levelTwo: '代理商管理',
              levelThree: ['添加代理商', '修改代理商']
            },
            {
              levelOne: '合作方管理',
              levelTwo: '供应商管理',
              levelThree: ['添加供应商', '修改供应商']
            },
            {
              levelOne: '运营管理',
              levelTwo: '卡库存管理',
              levelThree: ['导卡入库', '导卡出库']
            },
            {
              levelOne: '运营管理',
              levelTwo: '卡管理',
              levelThree: ['套餐操作', '流量矫正', '卡划拨代理']
            },
            {
              levelOne: '运营管理',
              levelTwo: '任务管理',
              levelThree: '任务操作'
            },
            {
              levelOne: '运营管理',
              levelTwo: '卡用量管理',
              levelThree: ''
            },
            {
              levelOne: '记录管理',
              levelTwo: '套餐订购记录',
              levelThree: ''
            },
            {
              levelOne: '短信管理',
              levelTwo: '短信收发记录',
              levelThree: '新建短信发送任务'
            },
            {
              levelOne: '系统管理',
              levelTwo: '管理员账号',
              levelThree: ['添加管理员', '删除管理员', '禁用|恢复管理员']
            },
            {
              levelOne: '系统管理',
              levelTwo: '权限管理',
              levelThree: ['添加角色', '删除角色', '配置权限']
            },
            {
              levelOne: '系统管理',
              levelTwo: '操作记录',
              levelThree: ''
            }
        ],
        dataP2: [],
        dataP3: []
      }
    },
    methods: {
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else if (rowIndex % 6 === 0) {
            return {
              rowspan: 4,
              colspan: 1
            }
          } else if (rowIndex % 11 === 0) {
            return {
              rowspan: 3,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      handleClick (tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
