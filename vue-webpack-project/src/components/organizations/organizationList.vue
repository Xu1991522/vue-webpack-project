<template>
  <div>
    <div class="search">
      <span class="input__label">企业简称：</span>
      <el-select v-model="shortName" @change="search">
        <el-option value="" label="全部企业"></el-option>
        <el-option v-for="item in shortNames" :key="item.id" :value="item.id" :label="item.shortName"></el-option>
      </el-select>

      <el-button type="primary" class="adder__btn" @click.stop="adderVisible = !adderVisible">添加客户</el-button>

      <i style="display: block; clear: both"></i>

      <ul v-if="adderVisible" class="adder">
        <li class="adder__item" @click="openAssociateDialog">关联已有代理商</li>
        <li class="adder__item" @click="$router.push({ path: '/organizations/detail', query: { title: '添加新客户' } })">添加新客户</li>
      </ul>
    </div>

    <div class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x el-table--enable-row-hover el-table--enable-row-transition">
      <table class="el-table__body org__list">
        <thead>
          <tr class="el-table__row">
            <th>企业简称</th>
            <th>企业全称</th>
            <th>联系人</th>
            <th>关联销售</th>
            <th>企业网址</th>
            <th>业务关系</th>
            <th style="width: 100px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="el-table__row">
            <td>{{ item.shortName }}</td>
            <td>{{ item.companyName }}</td>
            <td @mouseenter="openContactDetail($event, item)" @mouseleave="closeContactDetail($event, item)">
              {{ item.contact }}
              <i class="icon__contact"></i>

              <el-popover
                v-if="popover.visible && item.id === popover.target.id"
                class="org-contact__popover"
                placement="left"
                width="270"
                v-model="popover.visible"
                :style="{ zIndex: 200, position: 'fixed', left: popover.left + 'px', top: popover.top + 'px' }"
              >
                <p class="header">
                  {{ popover.target.contact }}
                </p>
                <p class="item">
                  <span class="item__label">手机</span>
                  {{ popover.target.mobile }}
                </p>
                <p class="item">
                  <span class="item__label">邮箱</span>
                  {{ popover.target.email }}
                </p>
                <p class="item">
                  <span class="item__label">电话</span>
                  {{ popover.target.telephone }}
                </p>
                <p class="item">
                  <span class="item__label">身份证号</span>
                  {{ popover.target.idCard }}
                </p>
              </el-popover>
            </td>
            <td>{{ item.userInfo.loginName }}</td>
            <td>
              <a class="link" v-if="item.accessUrl" :href="item.accessUrl" target="_blank">{{ item.accessUrl }}</a>
              <span v-else>-</span>
            </td>
            <td>
              <el-checkbox v-if="relations[item.id].isDistributor != null" :value="relations[item.id].isDistributor" :disabled="true">渠道商</el-checkbox>
              <el-checkbox v-if="relations[item.id].isBroker != null" :value="relations[item.id].isBroker" @change="checked => toggleAblity(item, 'isBroker', checked)">代理商</el-checkbox>
            </td>
            <td>
              <el-button type="text" style="font-size: 13px; padding: 0" @click="$router.push({ path: '/organizations/detail', query: { title: '修改客户信息', org: item.id } })">修改</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <el-dialog title="关联已有代理商" width="420px" :visible="form.visible" @close="form.visible = false" custom-class="associate-proxy__popup">
      <el-form :model="form">
        <el-form-item label="企业ID" label-width="70px" required :error="form.error">
          <el-input style="width: 250px" v-model="form.id" @input="searchOrganizationById" placeholder="请输入企业ID"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" label-width="70px" required>
          <el-input style="width: 250px" :value="form.shortName || '企业简称'" disabled></el-input>
        </el-form-item>
        <el-form-item label="关联销售" label-width="70px" required>
          <el-select style="width: 250px" v-model="form.salesperson" placeholder="请选择关联销售">
            <el-option v-for="p in form.salespeople" :key="p.id" :label="p.loginName" :value="p.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="form.visible = false">取消</el-button>
        <el-button type="primary" @click="associateProxyOrganization">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'

  import api from '../../api'

  import debounce from '../../helpers/debounce'

  export default {
    data () {
      return {
        shortName: '',
        shortNames: [],

        adderVisible: false,

        items: [],
        relations: {},

        pager: {
          index: 1,
          size: 10,
          count: 0
        },

        popover: {
          visible: false,
          target: '',
          left: 0,
          top: 0
        },

        form: {
          visible: false,
          id: '',
          salesperson: '',
          salespeople: [],

          error: '',

          submitting: false
        }
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      }
    },
    methods: {
      fetchOrganizations (index, size) {
        api.IOrganizationManager.listOrgsByConditions({ superOrg: this.user.orgId, page: index - 1, size, shortName: null })
          .then(res => {
            // isDistributor, isBroker: 'true' | 'false' | ''
            const { items, relations } = res.content.reduce(({ items, relations }, x) => {
              return {
                items: [...items, x.subOrg],
                relations: {
                  ...relations,
                  [x.subOrg.id]: {
                    isDistributor: x.isDistributor ? Boolean(x.isDistributor) : null,
                    isBroker: x.isBroker ? Boolean(x.isBroker) : null
                  }
                }
              }
            }, { items: [], relations: {} })

            this.items = items
            this.relations = relations

            this.pager = {
              index: res.number + 1,
              size: res.size,
              count: res.totalElements
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取企业列表失败'
            })
          })
      },
      search (val) {
        if (!val) {
          return this.fetchOrganizations(1, this.pager.size)
        }

        api.IOrganizationManager.getOrg({ id: val })
          .then(res => {
            this.items = [res]

            this.pager = {
              index: 1,
              size: this.pager.size,
              count: 1
            }
          })
      },
      toggleAblity (item, prop, checked) {
        // only proxy releation could be modified
        api.IOrganizationManager.updateAssociateBroker({ currentOrgId: this.user.orgId, brokerId: item.id, operation: checked ? 'RECOVER' : 'CANCEL' })
          .then(() => {
            const val = this.relations[item.id]

            Vue.set(val, prop, checked)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '修改代理关系失败'
            })
          })
      },
      openContactDetail (e, item) {
        if (item.id === this.popover.target.id) {
          return
        }

        const clientHeight = document.body.clientHeight
        const offsetHeight = 140

        let top

        if (e.clientY + offsetHeight <= clientHeight) {
          top = e.clientY
        } else {
          top = clientHeight - offsetHeight
        }

        this.popover = {
          visible: true,
          target: item,
          left: e.clientX + 60,
          top
        }
      },
      closeContactDetail (e, item) {
        if (item.id !== this.popover.target.id) {
          return
        }

        this.popover = {
          visible: false,
          target: '',
          left: '',
          top: ''
        }
      },
      openAssociateDialog () {
        this.form = {
          visible: true,
          id: '',
          shortName: '',
          salesperson: '',
          salespeople: []
        }

        api.IOrganizationManager.getAvailableAssociateSales({ orgId: this.user.orgId, targetOrg: null })
          .then(res => {
            this.form.salespeople = res
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '获取销售人员列表失败'
            })
          })
      },
      associateProxyOrganization () {
        api.IOrganizationManager.addAssociateBroker({ currentOrgId: 1, brokerId: this.form.id, userId: this.form.salesperson })
          .then(res => {
            this.form.visible = false

            this.fetchOrganizations(1, this.pager.size)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.message || '关联代理商失败'
            })
          })
      },
      searchOrganizationById (val) {
        this.form.shortName = ''
        this.form.error = ''
        this.form.salesperson = ''
        this.form.salespeople = []

        if (!val) {
          this.form.error = '请输入代理商ID'
        }

        if (val.match(/\D/)) {
          this.form.error = '代理商ID不符合规范'
        }

        if (this.form.error) {
          return
        }

        api.IOrganizationManager.getBrokers({ brokerId: +val })
          .then(r1 => r1 ? Promise.all([r1, api.IOrganizationManager.getAvailableAssociateSales({ orgId: this.user.orgId, targetOrg: r1.id })]) : [r1])
          .then(([r1, r2]) => {
            if (val !== this.form.id) {
              return
            }

            if (!r1) {
              this.form.error = '该代理商未找到'

              return
            }

            this.form.shortName = r1.shortName

            if (r1.orgCategory.indexOf('BROKER') === -1) {
              this.form.error = '非代理商账户'

              return
            }

            this.form.salespeople = r2
          })
      }
    },
    created () {
      api.IOrganizationManager.getAllSubOrgs({})
        .then(res => {
          this.shortNames = res
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message || '获取企业简称列表失败'
          })
        })

      this.fetchOrganizations(1, this.pager.size)

      this.searchOrganizationById = debounce(1000)(this.searchOrganizationById)
    },
    mounted () {
      this.adder$ = () => {
        this.adderVisible = false
      }

      document.addEventListener('click', this.adder$)
    },
    beforeDestroy () {
      document.removeEventListener('click', this.adder$)
      this.adder$ = null

      this.searchOrganizationById = null
    }
  }
</script>

<style lang="scss">
  .org-contact__popover {
    .el-popover {
      display: inline-block;
      box-shadow: 0 0 2px 1px #038ae3;
      border-radius: 0;
    }

    .header {
      font-size: 15px;
      color: #444;
      line-height: 30px;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    .header {
      border-bottom: 1px solid #ddd;
      font-weight: 500;
    }

    .item {
      line-height: 26px;
      font-size: 12px;
    }

    .item__label {
      display: inline-block;
      vertical-align: middle;
      min-width: 54px;
      color: #aaa;
      text-align: right;
      margin-right: 40px;
    }
  }

  .associate-proxy__popup {
    margin-top: 20vh !important;

    .el-form {
      padding-left: 30px;
    }
  }
</style>

<style lang="scss" scoped>
  .search {
    margin-bottom: 14px;
    position: relative;
    z-index: 1;

    .input__label {
      float: left;
      line-height: 32px;
      margin-left: 20px;
    }
  }

  .adder__btn {
    float: right;
  }

  .adder {
    position: absolute;
    right: 0;
    bottom: -80px;
    padding: 0 20px;
    border: 1px solid #ddd;
    background: #fff;

    .adder__item {
      color: #666;
      padding: 8px 0;
      font-size: 14px;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: #038ae3;
      }
    }

    .adder__item + .adder__item {
      border-top: 1px solid #ddd;
    }
  }

  .org__list {
    width: 100%;
    table-layout: fixed;

    td, th {
      border-left: 0;
      border-right: 0;
      border-top: 0;
      border-bottom: 1px solid #ebeef5;
    }

    td {
      padding: 6px 10px;
    }

    th {
      padding: 10px;
    }

    .icon__contact {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url('../../assets/icon-contact.png') no-repeat center center;
      vertical-align: middle;
      margin-left: 10px;
    }

    .link {
      color: #038ae3;
    }
  }
</style>
