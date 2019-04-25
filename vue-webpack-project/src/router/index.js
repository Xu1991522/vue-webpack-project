import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'
import { Notification } from 'element-ui'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    component: () => import('../components/index.vue'),
    children: [
      { path: '', redirect: 'home' },
      {
        path: 'home',
        meta: {
          name: '总览'
        },
        component: () => import('../components/home/home.vue')
      },
      // 合作方管理
      {
        path: 'agentManage',
        meta: {
          name: '代理商管理'
        },
        component: () =>
          import('../components/cooperationManage/agentManage.vue')
      },
      {
        path: 'agentManage/agentOperation',
        component: () =>
          import('../components/cooperationManage/agentOperation.vue')
      },
      {
        path: 'agentManage/agentDetail',
        component: () =>
          import('../components/cooperationManage/agentDetail.vue')
      },
      {
        path: 'supplierManage',
        meta: {
          name: '供应商管理'
        },
        component: () =>
          import('../components/cooperationManage/supplierManage.vue')
      },
      {
        path: 'supplierManage/infoHandle',
        component: () =>
          import('../components/cooperationManage/infoHandle.vue')
      },
      // 运营管理
      {
        path: 'cardManage',
        meta: {
          name: '卡管理'
        },
        component: () => import('../components/operateManage/cardManage')
      },
      {
        path: 'cardDivide',
        component: () => import('../components/operateManage/cardDivide')
      },
      {
        path: 'cardPoolManage',
        meta: {
          name: '卡池管理'
        },
        component: () => import('../components/operateManage/cardPoolManage')
      },
      {
        path: 'cardStockManage',
        meta: {
          name: '卡库存管理'
        },
        component: () => import('../components/operateManage/cardStockManage')
      },
      {
        path: 'cardUsedMountManage',
        meta: {
          name: '卡用量管理'
        },
        component: () =>
          import('../components/operateManage/cardUsedMountManage')
      },
      {
        path: 'realNameManage',
        meta: {
          name: '实名管理'
        },
        component: () => import('../components/operateManage/realNameManage')
      },
      {
        path: 'taskManage',
        meta: {
          name: '任务管理'
        },
        component: () => import('../components/operateManage/taskManage')
      },
      // 记录管理
      {
        path: 'packageOrderManage',
        meta: {
          name: '套餐订购记录'
        },
        component: () =>
          import('../components/recordsManage/packageOrderManage')
      },
      {
        path: 'smsRecords',
        meta: {
          name: '短信收发记录'
        },
        component: () => import('../components/smsManage/smsRecords.vue')
      },
      {
        path: 'smsRecords/newSMS',
        component: () => import('../components/smsManage/newSMS.vue')
      },
      // 系统管理
      {
        path: 'adminAccount',
        meta: {
          name: '管理员账号'
        },
        component: () => import('../components/systemManage/adminAccount')
      },
      {
        path: 'adminAccount/addAdmin',
        component: () => import('../components/systemManage/addAdmin')
      },
      {
        path: 'authorityManage',
        meta: {
          name: '权限管理'
        },
        component: () => import('../components/systemManage/authorityManage')
      },
      {
        path: 'authorityManage/addRoles',
        component: () => import('../components/systemManage/addRoles')
      },
      {
        path: 'authorityManage/assignPermissions',
        component: () => import('../components/systemManage/assignPermissions')
      },
      {
        path: 'menuManage',
        meta: {
          name: '菜单管理'
        },
        component: () => import('../components/systemManage/menuManage')
      },
      {
        path: 'operationRecords',
        meta: {
          name: '操作记录'
        },
        component: () => import('../components/systemManage/operationRecords')
      },
      // 客户管理
      {
        path: 'organizations',
        meta: {
          name: '客户管理'
        },
        component: () => import('../components/organizations/organizationList')
      },
      {
        path: 'organizations/detail',
        component: () =>
          import('../components/organizations/organizationDetail')
      },

      {
        path: 'subaccount',
        component: () => import('./../components/members/subaccount'),
        meta: {
          name: '子账号管理'
        }
      },
      {
        path: 'enterpriseInfo',
        component: () => import('./../components/members/enterpriseInfo'),
        meta: {
          name: '企业信息'
        }
      },
      // 账户管理
      {
        path: 'proxy',
        meta: {
          name: '代理商账户'
        },
        component: () => import('./../components/business/proxy')
      },
      {
        path: 'proxy/withdraw',
        component: () => import('./../components/business/withdraw')
      },
      {
        path: 'proxy/detail',
        component: () => import('./../components/business/detail')
      },
      {
        path: 'distributor',
        meta: {
          name: '渠道商账户'
        },
        component: () => import('./../components/business/distributor')
      },
      {
        path: 'distributor/withdraw',
        component: () => import('./../components/business/withdraw')
      },
      {
        path: 'distributor/charge',
        component: () => import('./../components/business/charge')
      },
      {
        path: 'bankinfo',
        meta: {
          name: '银行信息'
        },
        component: () => import('./../components/business/bankinfo')
      },
      {
        path: 'account',
        meta: {
          name: '个人信息'
        },
        component: () => import('../components/account/account')
      }
    ]
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  const { user } = store.getters

  if (!user) {
    return store
      .dispatch('INITIALIZE_ACCOUNT')
      .then(() => {
        // prevent cycle redirect when to is already /
        /*
        if (to.path !== '/home') {
          // eval hack
          // always go to home
          next('/home')
        } else {
          next()
        }
        */

        next()
      })
      .catch(err => {
        Notification({
          type: 'error',
          title: '初始化失败',
          message: (err && (err.message || err.exception)) || '未知错误'
        })

        throw err
      })
  }

  next()
})

export default router
