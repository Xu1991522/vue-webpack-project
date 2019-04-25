<template>
  <div>
    <BackButton></BackButton>
    <div style="width:100%;height:36px;position:relative;top:-45px;left:45px;z-index:99;">
          <div style="float:left;line-height:36px;margin:0 10px;">角色类型:</div>
            <el-select v-model="role.id" style="width:300px;">
              <el-option
                  v-for="item in rolelist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
    </div>
    <el-row :gutter="10" style="position:relative;top:-25px;">
      <el-col :span="5">
        <div class="inner-filt">
          <el-input placeholder="搜索成员、部门" style="width:90%;margin:0 0 10px 10px;" v-model="selectvalue" @input="filter"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
          <div v-for="(el,index) in groupedarr" :key="index" :class="[activename===el[0].departmentName?'tree-active':'','tree-item']" @click="selecttabledata(el,el[0].departmentName)"><img src="./../../assets/docu-icon.png" alt=""><span class="department-text">{{el[0].departmentName.length>4?el[0].departmentName.substring(8):el[0].departmentName}}</span></div>
          <div v-if="tipsshow" style="margin:5px 20px;font-size:12px;color:#8791A1">无相关成员或部门</div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="tags-container">
          <span style="margin-right:10px;font-size:12px;line-height:40px;">已选择:</span>
          <el-tag
            v-for="tag in users"
            :key="tag.userName"
            @close="handleClose(tag)"
            closable>
            {{tag.userName}}
          </el-tag>
        </div>
        <el-table
        ref="multipleTable"
          :max-height="clientHeight"
          :data="tabledata"
          style="width: 100%;"
           @selection-change="handleSelectionChange">
           <el-table-column
            type="selection"
            min-width="1">
          </el-table-column>
          <el-table-column
            prop="userId"
            label="用户名"
            min-width="2">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名"
            min-width="2">
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="部门"
            min-width="6">
          </el-table-column>
        </el-table>
        <el-row style="margin-top:20px;">
          <el-col :span="2" :offset="1"><el-button plain @click="insertUser('insert')" :disabled="!users.length" style="background:#038ae3;color:#fff;">添加</el-button></el-col>
          <el-col :span="2"><el-button @click="insertUser('cancel')" style="margin-left:15px">取消</el-button></el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../../api'

import group from '../../helpers/group'

export default {
  name: 'addAdmin',
  data () {
    return {
      treedata: [], // 原始数据
      tipsshow: false, // 查无此人提示
      selectvalue: '', // 搜索框输入值
      filteredarr: [], // 筛选出来符合搜索框里的数据
      groupedarr: [], // 分组后的数据
      tabledata: [], // 表格数据
      users: [], // 添加用户的列表
      activename: '', // 激活的树名字
      role: {
        id: ''
      }, // 路由获取的权限对象
      rolelist: [], // 角色类型
      clientHeight: 0 // 高度
    }
  },
  created () {
    this.clientHeight = document.body.clientHeight > 794 ? 550 : 330
    this.getAllRole()
    this.getAllOaUserInfo()
  },
  methods: {
    getAllRole () {
      api.IUserService.getAllRole({}).then(res => {
        this.rolelist = res
      })
    },
    insertUser (type, rows) {
      if (type === 'insert') {
        if (!this.role.id) {
          this.$message({
            type: 'warning',
            message: '请先选择角色类型'
          })
        } else {
          api.IUserService.insertUser({ users: this.users.map(x => ({ loginName: x.userId, name: x.userName, roleBean: { id: this.role.id } })) })
            .then(res => {
              if (!res) {
                return Promise.reject(Error('该用户已激活'))
              }

              this.$message({
                type: 'success',
                message: '添加成功'
              })

              this.$router.back()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message
              })
            })
        }
      } else {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      }
    },
    handleClose (tag) {
      this.insertUser('cancel', [this.users[this.users.indexOf(tag)]])
      this.users.splice(this.users.indexOf(tag), 1)
    },
    handleSelectionChange (val) {
      this.users = val
    },
    getAllOaUserInfo () {
      this.$api.IUserService.getAllOaUserInfo({
      }).then(res => {
        this.treedata = res.users
        this.filter()
      })
    },
    filter () {
      this.filteredarr = []
      this.treedata.forEach(item => {
        if (item.userName.indexOf(this.selectvalue) > -1 || item.departmentName.indexOf(this.selectvalue) > -1 || item.userId.indexOf(this.selectvalue) > -1) {
          this.filteredarr.push(item)
        }
      })// 筛选
      this.groupedarr = group(k => k.departmentName)(this.filteredarr)// 分组
      this.tabledata = this.groupedarr[Object.keys(this.groupedarr)[0]]
      this.activename = Object.keys(this.groupedarr)[0]
      this.tipsshow = JSON.stringify(this.groupedarr) === '{}' && this.selectvalue !== ''
    },
    selecttabledata (data, name) {
      this.tabledata = data
      this.activename = name
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 0 10px 10px 0;
}
.tags-container {
  width: 100%;
  height: 50px;
  overflow-y: auto;
  margin: 10px 0;
}
.inner-filt {
  background: #f9fbfd;
  padding: 10px 0 20px 0;
  height: 73vh;
  overflow-y: scroll;
}
.tree-item {
  padding: 8px 0 8px 20px;
  cursor: pointer;
}
.tree-active {
  background: #edf1f5;
}
.tree-item:hover {
  background: #edf1f5;
}
.department-text {
  padding-left: 10px;
}
</style>
