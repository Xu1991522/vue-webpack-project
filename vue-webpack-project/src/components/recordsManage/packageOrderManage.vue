<template>
  <div @click="menuparameter.show = false" >
    <div class="common-top-nav-row">
        <span style="float:left;margin-right:10px;line-height:36px;font-size:14px;color: #606266;">运营商:</span>
        <el-select v-model="condition.operator" placeholder="请选择" style="width:130px;">
          <el-option
            :label="'全部'"
            :value="''">
          </el-option>
          <el-option
            v-for="item in operators"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span style="margin:0 10px 0 20px;line-height:36px;font-size:14px;color: #606266;">起始日期</span>
        <el-date-picker
          style="width:150px;"
          v-model="condition.startDate"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span style="margin:0 10px 0 20px;line-height:36px;font-size:14px;color: #606266;">结束日期</span>
        <el-date-picker
          style="width:150px;"
          v-model="condition.endDate"
          :editable="false"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-input v-model="condition.cardNumber" placeholder="请输入卡号" style="width:200px;margin:0 20px;"></el-input>
        <el-button style="background:#038ae3;color:#fff;margin-top:2px;" size="small" @click="listByCondition">搜索</el-button>
      </div>
      <Contextmenu :menuparameter="menuparameter" @selectedchanged="selectedchanged"></Contextmenu>
      <el-table
      :data="pagebean"
      v-loading="loading"
      @header-contextmenu="headerclick"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%;margin-top:10px;">
      <el-table-column
      label="卡号"
      :min-width="pagebean.every((el)=>el.cardNumber===''||el.cardNumber===null)?'90':'200'">
          <template slot-scope="scope">
            {{scope.row.cardNumber === ''||scope.row.cardNumber === null?'-':scope.row.cardNumber}}
          </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('用户')>-1"
        prop="userName"
        label="用户"
        width="110">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('运营商')>-1"
        prop="operatorName"
        label="运营商"
        width="80">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('套餐名称')>-1"
        label="套餐名称"
        :width="pagebean.every((el)=>el.packageName===''||el.packageName===null)?'120':'290'">
          <template slot-scope="scope">
            {{scope.row.packageName === ''||scope.row.packageName === null?'-':scope.row.packageName}}
          </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('提交时间')>-1"
        label="提交时间"
         :width="pagebean.every((el)=>el.commitTime===''||el.commitTime===null)?'80':'155'">
         <template slot-scope="scope">
            <span>{{ scope.row.commitTime | time('yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('订购时间')>-1"
        label="订购时间"
         :width="pagebean.every((el)=>el.orderTime===''||el.orderTime===null)?'80':'155'">
         <template slot-scope="scope">
            <span>{{ scope.row.orderTime | time('yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('办理状态')>-1"
        prop="handleStatus"
        label="办理状态"
         width="80">
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('办理结构描述')>-1"
        label="办理结构描述"
        :width="pagebean.every((el)=>el.description===''||el.description===null)?'150':'200'">
          <template slot-scope="scope">
            {{scope.row.description === ''||scope.row.description === null?'-':scope.row.description}}
          </template>
      </el-table-column>
      <el-table-column
        v-if="menuparameter.selected.indexOf('来源平台')>-1"
        prop="sourcePlatform"
        label="来源平台"
        width="80">
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
import * as fecha from 'element-ui/lib/utils/date'
export default {
  name: '',
  data () {
    return {
      loading: true, // 表格加载
      pagebean: [],
      operators: [
        { value: 'CMCC', label: '中国移动' },
        { value: 'UNICOM', label: '中国联通' },
        { value: 'CNET', label: '中国电信' }
      ], // 三大运营商
      condition: {
        operator: '',
        startDate: new Date().getFullYear() + '-' + (new Date().getMonth() > 10 ? '0' + new Date().getMonth() + 1 : new Date().getMonth() + 1) + '-01',
        endDate: '',
        cardNumber: ''
      },
      pager: {
        pageIndex: 1,
        pageSize: 10,
        recCount: 0
      }, // 分页
      menuparameter: {
        show: false,
        position: {},
        list: ['用户', '运营商', '套餐名称', '提交时间', '订购时间', '办理状态', '办理结构描述', '实际拥有者', '来源平台'],
        selected: ['用户', '运营商', '套餐名称', '提交时间', '订购时间', '办理状态', '办理结构描述', '实际拥有者', '来源平台']
      } // 右键菜单参数
    }
  },
  created () {
    this.listByCondition()
  },
  methods: {
    selectedchanged (val) {
      this.menuparameter.selected = val
    },
    headerclick (column, event) {
      this.menuparameter.position.clientX = event.clientX
      this.menuparameter.position.clientY = event.clientY
      this.menuparameter.show = true
      event.preventDefault()
    },
    listByCondition () {
      var b = Object.assign({}, this.condition)
      Object.keys(b).forEach(function (key) {
        if (b[key] === '') {
          b[key] = null
        }
      })
      this.$api.IFlowPackageManager.listByCondition({
        page: this.pager.pageIndex - 1,
        size: this.pager.pageSize,
        operator: b.operator,
        startDate: b.startDate,
        endDate: b.endDate,
        cardNumber: b.cardNumber
      }).then(res => {
        this.loading = false
        this.pagebean = res.content
        this.pager.pageIndex = res.number + 1
        this.pager.pageSize = res.size
        this.pager.recCount = res.totalElements
      })
    },
    list () {
      // 列出所有订购分页记录
      this.$api.IFlowPackageManager.list({
        page: this.pager.pageIndex - 1,
        size: this.pager.pageSize
      }).then(res => {
        this.pagebean = res.content
        this.pager.pageIndex = res.number + 1
        this.pager.pageSize = res.size
        this.pager.recCount = res.totalElements
      })
    },
    handleCurrentChange (val) {
      this.pager.pageIndex = val
      this.listByCondition()
    },
    handleSizeChange (val) {
      this.pager.pageSize = val
      this.listByCondition()
    }
  },
  filters: {
    time: (val, mask) => {
      return (
        val
          ? fecha.format(val, mask)
          : '-'
      )
    }
  }
}
</script>

<style scoped>

</style>
