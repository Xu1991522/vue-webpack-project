<template>
  <div @click="menuparameter.show = false">
    <Contextmenu :menuparameter="menuparameter" @selectedchanged="selectedchanged"></Contextmenu>
    <div>
      <div class="common-top-nav-row">
        <span class="form__label">代理商名称</span>
        <el-select v-model="iptValue" filterable placeholder="请选择代理商" @change="handleSelect">
          <el-option
            label="全部代理商"
            value=""
          ></el-option>
          <el-option
            v-for="item in proxylist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-button v-if="access.add" class="plus-button" type="info" size="small" @click="tochangeinfo('add')">添加代理商</el-button>
      </div>
      <div>
        <el-table
          v-loading="loading"
          :data="tableData"
          :span-method="colspan"
          @header-contextmenu="headerclick"
          border
          :max-height="clientHeight"
          style="width: 100%;"
          empty-text="暂无相关代理信息"
        >
          <el-table-column
            v-if="showType === 'ALL'"
            label=""
            :width="50"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.topped"
                :class="['el-table__expand-icon', expandKeys.indexOf(scope.row.id) > -1 ? 'el-table__expand-icon--expanded' : '']"
                @click="handleExpandChange(scope.row.id)"
              >
                <i class="el-icon el-icon-arrow-right"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="代理名称"
            :width="getmaxlength(row => row.name,'代理名称')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('公司名称')>-1"
            :width="getmaxlength(row => row.company,'公司名称')"
            label="公司名称"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.company }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('用户等级')>-1"
            :width="agentData.every((el)=>el.level===''||el.level===null)?'80':'80'"
            label="用户等级"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ formatLevel(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('所属账户')>-1"
            :width="getmaxlength(row => row.account,'所属账户')"
            label="所属账户"
            prop="account"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.account ? scope.row.account : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('联系人')>-1"
            :width="getmaxlength(row => row.contactor,'联系人')"
            label="联系人"
            prop="contactor"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.contactor }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('手机号')>-1"
            :width="agentData.every((el)=>el.mobilePhone===''||el.mobilePhone===null)?'78':'120'"
            label="手机号"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.mobilePhone }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('身份证号码')>-1"
            :width="agentData.every((el)=>el.idCard===''||el.idCard===null)?'110':'180'"
            label="身份证号码"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.idCard }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('电话号码')>-1"
            :width="getmaxlength(row => row.phone,'电话号码')"
            label="电话号码"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('电子邮箱')>-1"
            :width="agentData.every((el)=>el.email===''||el.email===null)?'80':'160'"
            label="电子邮箱"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('APPID')>-1"
            prop="appid"
            label="APPID"
            :width="getmaxlength(row => row.contactor,'appid')">
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('api密码')>-1"
            :width="getmaxlength(row => row.apiPwd,'api密码')"
            label="api密码"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.apiPwd }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('登录账户')>-1"
            :width="getmaxlength(row => row.loginName,'登录账户')"
            label="登录账户"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else>{{ scope.row.loginName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('外部查询')>-1"
            label="外部查询"
            width="80"
          >
            <template slot-scope="scope">
             <div v-if="scope.row.externalQuery === 'DISABLE'">已关闭</div>
             <div v-if="scope.row.externalQuery === 'ENABLE'">已开启</div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('证件图片')>-1"
            label="证件图片"
            width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <span v-else @click="showIdCardImages(scope.row)" class="item__btn">查看</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="menuparameter.selected.indexOf('操作')>-1"
            label="操作"
            width="140"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.empty" style="display: inline-block; width: 100%; text-align: center">暂无次级代理</span>
              <div v-else>
                <span v-if="access.update" @click="tochangeinfo('edit', scope.row)" class="item__btn">修改</span>&emsp;
                <span @click="tochangeinfo('detail', scope.row)" class="item__btn">查看详情</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- page -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40,50]"
          :current-page="pager.pageIndex"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pager.pageSize"
          :total="pager.recCount">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="证件照片"
      @close="closeImgDialog"
      :visible.sync="idCardImgDialog.visible"
      width="700px"
    >
      <div class="img__container--idcard">
        <img v-if="idCardImgDialog.up" class="img__item" :src="idCardImgDialog.up" alt="">
        <div v-else class="img__item img__placeholder">正面照未上传</div>

        <img v-if="idCardImgDialog.down" class="img__item" :src="idCardImgDialog.down" alt="">
        <div v-else class="img__item img__placeholder">反面照未上传</div>

        <img v-if="idCardImgDialog.hand" class="img__item" :src="idCardImgDialog.hand" alt="">
        <div v-else class="img__item img__placeholder">手持照未上传</div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api'

import toZhDigit from '../../helpers/to-zh-dight'

export default {
  name: '',
  data () {
    return {
      proxyId: '',
      iptValue: '',
      proxylist: [],
      clientHeight: 0, // 高度
      pager: {
        pageIndex: 1,
        pageSize: 10,
        recCount: 0
      },
      agentData: [],
      secProxy: {},
      menuparameter: {
        show: false,
        position: {},
        list: ['公司名称', '用户等级', '所属账户', '联系人', '手机号', '身份证号码', '电话号码', '电子邮箱', 'APPID', 'api密码', '登录账户', '外部查询', '证件图片', '操作'],
        selected: ['公司名称', '用户等级', '所属账户', '联系人', '手机号', '身份证号码', '电话号码', '电子邮箱', 'APPID', 'api密码', '登录账户', '外部查询', '证件图片', '操作']
      }, // 右键菜单参数

      expandKeys: [],

      idCardImgDialog: {
        visible: false,
        up: '',
        down: '',
        hand: ''
      },

      showType: 'ALL',

      loading: true
    }
  },
  computed: {
    access () {
      const {
        ADD_PROXY,
        UPDATE_PROXY
      } = this.$store.getters.access

      return {
        add: ADD_PROXY,
        update: UPDATE_PROXY
      }
    },
    tableData () {
      const parents = this.agentData
      const children = this.secProxy
      const keys = this.expandKeys.reduce((acc, x) => ({ ...acc, [x]: 1 }), {})

      // console.log('recompute tableData', keys)

      return parents.reduce((acc, x) => [...acc, x, ...(keys[x.id] ? children[x.id] : [])], [])
    },
    colspan () {
      const parents = this.agentData
      const children = this.secProxy
      const keys = this.expandKeys.reduce((acc, x) => ({ ...acc, [x]: 1 }), {})

      const res = {}

      let s = 0

      for (let p of parents) {
        const opened = keys[p.id]

        s += 1

        if (opened) {
          res[s] = { start: 1, len: children[p.id].length }

          children[p.id].slice(1).forEach((c, i) => {
            res[s + i + 1] = { follow: 1 }
          })

          s += children[p.id].length
        }
      }

      // console.log('recompute colspan', keys, res)

      return ({ row, column, rowIndex, columnIndex }) => {
        // console.log('rowIndex', rowIndex, 'columnIndex', columnIndex, res.indexOf(rowIndex) > -1)

        const val = res[rowIndex]

        if (val) {
          // console.log('in ----', rowIndex)

          if (columnIndex === 0) {
            if (val.start) {
              return {
                rowspan: val.len,
                colspan: 1
              }
            }

            if (val.follow) {
              return {
                rowspan: 0,
                colspan: 0
              }
            }
          }

          if (row.empty) {
            if (columnIndex === 1) {
              return {
                rowspan: 1,
                colspan: 13
              }
            }

            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    user () {
      return this.$store.getters.user
    },
    internal () {
      return this.user.roleBean.label === 'ADMIN'
    }
  },
  methods: {
    getmaxlength (transform, title) {
      let max = 0

      this.tableData.forEach(el => {
        const realStr = transform(el)

        const temp = realStr ? realStr.replace(/[^0-9a-zA-Z]/g, '--').length : 0
        max = temp > max ? temp : max
      })

      if (title && max < title.replace(/[^0-9a-zA-Z]/g, '--').length) {
        max = title.replace(/[^0-9a-zA-Z]/g, '--').length
      }
      return max * 8 + 21
    },
    // tableData one news
    getProxy (id) {
      this.resetExpandKeys()

      // 获取指定代理商信息
      api.IProxyManager.getProxy({ id })
        .then(res => {
          // only show the searched item
          // it's child proxies was not required
          this.agentData = [res]

          this.showType = 'ONE'

          this.pager = {
            pageIndex: 1,
            pageSize: 10,
            recCount: 1
          }

          /*
          return (
            this.internal || res.id === this.user.id
            ? api.IProxyManager.getSecProxylist({ proxyId: res.id, deep: true })
            : Promise.resolve([])
          )
            .then(subs => {
              this.agentData = [{ ...res, topped: true }]

              this.secProxy = ({
                [res.id]: subs.length ? subs.map(c => ({ ...c, parentId: res.id })) : [{ empty: true, parentId: res.id }]
              })

              this.pager = {
                pageIndex: 1,
                pageSize: 10,
                recCount: 1
              }
            })
          */
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '代理商查询失败'
          })
        })
    },
    // tableData all news
    listProxies (index, size) {
      this.resetExpandKeys()

      // 获取全部代理商信息
      api.IProxyManager.listProxies({
        page: index - 1,
        size
      }).then(res => {
        // deep
        // when true -> deep search it's all descendants
        // when false -> only search it't children
        return Promise.all(res.content.map(x => api.IProxyManager.getSecProxylist({ proxyId: x.id, deep: true })))
          .then(arr => {
            this.agentData = res.content.map(x => ({ ...x, topped: true }))

            this.showType = 'ALL'

            this.secProxy = res.content.reduce((acc, x, i) => ({
              ...acc,
              [x.id]: arr[i].length ? arr[i].map(c => ({ ...c, parentId: x.id })) : [{ empty: true, parentId: x.id }]
            }), {})
            this.pager = {
              pageIndex: res.number + 1,
              pageSize: res.size,
              recCount: res.totalElements
            }
          })
      })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取代理商列表失败'
          })
        })
        .then(() => {
          this.loading = false
        })
    },
    // 取消表头某列
    selectedchanged (val) {
      this.menuparameter.selected = val
    },
    headerclick (column, event) {
      this.menuparameter.position.clientX = event.clientX
      this.menuparameter.position.clientY = event.clientY
      this.menuparameter.show = true
      event.preventDefault()
    },
    // 获取简要信息
    listBriefProxies () {
      api.IProxyManager.listBriefProxies({})
        .then(res => {
          this.proxylist = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取代理商选项失败'
          })
        })
    },
    handleCurrentChange (val) {
      this.listProxies(val, this.pager.pageSize)
    },
    handleSizeChange (val) {
      this.listProxies(1, val)
    },
    tochangeinfo (type, row) {
      if (type === 'add') {
        this.$router.push({
          path: '/agentManage/agentOperation',
          query: {
            title: this.internal ? '添加代理商' : '添加次级代理商'
          }
        })
      } else if (type === 'detail') {
        this.$router.push({
          path: '/agentManage/agentDetail',
          query: {
            title: '代理商详情',
            proxy: row.id
          }
        })
      } else if (type === 'edit') {
        const topped = row.topped

        this.$router.push({
          path: '/agentManage/agentOperation',
          query: {
            title: topped ? '修改代理商' : '修改次级代理商',
            proxy: row.id
          }
        })
      } else {
        throw Error('unexpected type in tochangeinfo(type, row) {}')
      }
    },
    // img
    showIdCardImages (row) {
      this.idCardImgDialog = {
        visible: true,
        up: row.cdUpPhotoUrl,
        down: row.cdDownPhotoUrl,
        hand: row.cdHandPhotoUrl
      }
      // console.log(this.idCardImgDialog.up + '/' + this.idCardImgDialog.down + '/' + this.idCardImgDialog.hand)
    },
    // close imgDialog
    closeImgDialog () {
      this.idCardImgDialog = {
        visible: false,
        up: '',
        down: '',
        hand: ''
      }
    },
    handleSelect (id) {
      if (!id) {
        this.listProxies(1, this.pager.pageSize)
      } else {
        this.getProxy(id)
      }
    },
    handleExpandChange (id) {
      const opened = this.expandKeys.indexOf(id) > -1

      if (opened) {
        this.expandKeys = this.expandKeys.filter(x => x !== id)
      } else {
        this.expandKeys = this.expandKeys.concat(id)
      }
    },
    resetExpandKeys () {
      if (this.internal) {
        this.expandKeys = []
      } else {
        this.expandKeys = [this.user.id]
      }
    },
    setup () {
      this.iptValue = ''

      this.listProxies(1, 10)

      this.listBriefProxies()
    },
    formatLevel (row) {
      const internal = this.internal

      if (!internal) {
        return row.id === this.user.id ? '代理商' : '次级代理'
      }

      return toZhDigit(row.level) + '级代理'
    }
  },
  created () {
    this.clientHeight = document.body.clientHeight > 662 ? 550 : 400
    this.setup()
  }
}
</script>

<style lang="scss" scoped>
.search-button {
  display: inline-block;
  margin-left: 10px;
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
}
.plus-button {
  float: right;
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  right: 10px;
  z-index: 99;
  background: #038ae3;
  border: 1px solid #038ae3;
}
.form__label {
  line-height: 36px;
  float: left;
  color: #606266;
  font-size: 14px;

  margin-right: 10px;
}

.ipt {
  width: 15%;
  margin-right: 10px;
}
.secondAgent {
  left: -50%;
  margin-top: 12px;
}
.secondAgentTxt {
  position: absolute;
  left: 50.5%;
  top: 31%;
  font-size: 14px;
  color: #75a5ff;
}
.table-head-th {
  background-color: #f4f4f4;
  font-size: large;
}

.img__container--idcard {
  text-align: center;

  .img__item {
    width: 200px;
    height: 120px;
    box-sizing: border-box;
    vertical-align: top;
  }

  .img__item + .img__item {
    margin-left: 20px;
  }

  .img__placeholder {
    display: inline-block;
    line-height: 120px;
    font-size: 13px;
    color: #888;
    border: 1px dotted #aaa;
    text-align: center;
  }
}

.item__btn {
  color: #038ae3;
  cursor: pointer;
}
</style>
