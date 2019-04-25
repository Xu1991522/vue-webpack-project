import { flatten, extract, enhance } from './helpers/generate'
import tap from './middlewares/tap'
import error from './middlewares/error'

import daysOfMonth from '../helpers/days-of-month'

import LoginResult from '../constants/login-result'
import UserStatus from '../constants/user-status'

const mock = succeed => transform => (...args) => {
  return new Promise((resolve, reject) =>
    setTimeout(succeed ? resolve : reject, 0 * 100, transform(...args))
  )
}

const Succeed = true

// eslint-disable-next-line no-unused-vars
const Failed = false

const ILoginService = {
  loginByClient: mock(Succeed)(
    ({ userName, passWord, code }) => LoginResult.OK
  ),
  loginByOA: mock(Succeed)(({ token }) => LoginResult.OK),
  logOff: mock(Succeed)(() => void 0),
  getOaRedirectUrl: mock(Succeed)(
    () =>
      'https://authcenter.bwae.org/authpage/auth.html?accesskey=5580f75e-e2b7-4d62-9d77-90533bcbb300&projectname='
  )
}

const user = {
  id: 2000,
  name: '羡辙',
  loginName: 'xianzhe',
  password: null,
  orgId: 1,
  createTime: null,
  lastLoginOn: null,
  userStatus: UserStatus.NORMAL,
  email: 'xianzhe@163.com',
  mobile: '18258963246',
  roleBean: null,
  roleBeans: [
    {
      id: 1,
      name: '系统管理员',
      label: 'ADMIN'
    },
    {
      id: 2,
      name: '运营人员',
      label: 'CLIENT'
    }
  ]
}

const roles = [
  { id: 1, name: '系统管理员', label: 'ADMIN' },
  { id: 2, name: '运营人员', label: 'CLIENT' },
  { id: 3, name: '测试人员', label: 'CLIENT' }
]

const permissions = [
  {
    id: 6,
    name: '合作方管理',
    url: '#',
    sequence: 5,
    subMenu: [
      {
        id: 7,
        name: '代理商管理',
        url: 'agent.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 13,
            name: '代理商列表查询',
            url: 'sProxyList',
            sequence: 13,
            category: '4',
            menu_id: 7
          },
          {
            id: 14,
            name: '代理商详情查询',
            url: 'sProxyDetail',
            sequence: 14,
            category: '4',
            menu_id: 7
          },
          {
            id: 15,
            name: '添加代理商',
            url: 'aProxy',
            sequence: 15,
            category: '1',
            menu_id: 7
          },
          {
            id: 16,
            name: '修改代理商',
            url: 'uProxy',
            sequence: 16,
            category: '3',
            menu_id: 7
          }
        ]
      },
      {
        id: 8,
        name: '供应商管理',
        url: 'supplierUI.do',
        sequence: 2,
        subMenu: null,
        authEntities: [
          {
            id: 17,
            name: '供应商列表查询',
            url: 'sProviderList',
            sequence: 17,
            category: '4',
            menu_id: 8
          },
          {
            id: 18,
            name: '供应商详情查询',
            url: 'sProviderDetail',
            sequence: 18,
            category: '4',
            menu_id: 8
          },
          {
            id: 19,
            name: '增加供应商',
            url: 'aProvider',
            sequence: 19,
            category: '1',
            menu_id: 8
          },
          {
            id: 20,
            name: '修改供应商',
            url: 'uProvider',
            sequence: 20,
            category: '3',
            menu_id: 8
          }
        ]
      }
    ],
    authEntities: null
  },
  {
    id: 10,
    name: '运营管理',
    url: '#',
    sequence: 10,
    subMenu: [
      {
        id: 11,
        name: '卡库存管理',
        url: 'cardStoreIndex.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 21,
            name: '卡库存列表查询',
            url: 'sCardStoreList',
            sequence: 21,
            category: '4',
            menu_id: 11
          },
          {
            id: 22,
            name: '卡库存详情查询',
            url: 'sCardStoreDetail',
            sequence: 22,
            category: '4',
            menu_id: 11
          },
          {
            id: 23,
            name: '导卡入库',
            url: 'ImCard',
            sequence: 23,
            category: '0',
            menu_id: 11
          },
          {
            id: 24,
            name: '导卡出库',
            url: 'exStoreCard',
            sequence: 24,
            category: '0',
            menu_id: 11
          }
        ]
      },
      {
        id: 19,
        name: '卡管理',
        url: 'cards.do',
        sequence: 2,
        subMenu: null,
        authEntities: [
          {
            id: 25,
            name: '卡列表查询',
            url: 'sCardList',
            sequence: 25,
            category: '4',
            menu_id: 19
          },
          {
            id: 26,
            name: '卡详情查询',
            url: 'sCardDetail',
            sequence: 26,
            category: '4',
            menu_id: 19
          },
          {
            id: 27,
            name: '卡信息报表导出',
            url: 'exCardInfo',
            sequence: 27,
            category: '4',
            menu_id: 19
          },
          {
            id: 29,
            name: '叠加套餐',
            url: 'uCardPackage',
            sequence: 29,
            category: '1',
            menu_id: 19
          },
          {
            id: 30,
            name: '流量矫正',
            url: 'uCardFlow',
            sequence: 30,
            category: '1',
            menu_id: 19
          },
          {
            id: 31,
            name: '卡划拨代理',
            url: 'uCardOwer',
            sequence: 31,
            category: '1',
            menu_id: 19
          }
        ]
      },
      {
        id: 20,
        name: '任务管理',
        url: 'jobUI.do',
        sequence: 3,
        subMenu: null,
        authEntities: [
          {
            id: 11,
            name: '更新任务状态',
            url: 'updateJobInfoStatus',
            sequence: 11,
            category: '3',
            menu_id: 20
          },
          {
            id: 36,
            name: '任务查询',
            url: 'sTaskList',
            sequence: 36,
            category: '4',
            menu_id: 20
          },
          {
            id: 37,
            name: '任务执行',
            url: 'uTask',
            sequence: 37,
            category: '3',
            menu_id: 20
          }
        ]
      },
      {
        id: 21,
        name: '卡用量管理',
        url: 'cardFlowUsed.do',
        sequence: 4,
        subMenu: null,
        authEntities: [
          {
            id: 33,
            name: '卡月用量查询',
            url: 'sCardFlowMonth',
            sequence: 33,
            category: '4',
            menu_id: 21
          },
          {
            id: 34,
            name: '卡日用量查询',
            url: 'sCardFlowDaily',
            sequence: 34,
            category: '4',
            menu_id: 21
          },
          {
            id: 35,
            name: '卡用量报表导出',
            url: 'exCardFlowDaily',
            sequence: 35,
            category: '4',
            menu_id: 21
          }
        ]
      },
      {
        id: 22,
        name: '卡池管理',
        url: 'cardPool.do',
        sequence: 5,
        subMenu: null,
        authEntities: null
      },
      {
        id: 24,
        name: '实名管理',
        url: 'authenRealName.do',
        sequence: 6,
        subMenu: null,
        authEntities: null
      }
    ],
    authEntities: null
  },
  {
    id: 14,
    name: '记录管理',
    url: '#',
    sequence: 15,
    subMenu: [
      {
        id: 15,
        name: '套餐订购记录',
        url: 'packageRecordUI.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 38,
            name: '套餐订购记录',
            url: 'sPackageList',
            sequence: 38,
            category: '4',
            menu_id: 15
          }
        ]
      }
    ],
    authEntities: null
  },
  {
    id: 114,
    name: '短信管理',
    url: '#',
    sequence: 6,
    subMenu: [
      {
        id: 115,
        name: '短信收发记录',
        url: 'packageRecordUI.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 38,
            name: '短信收发记录',
            url: 'sPackageList',
            sequence: 38,
            category: '4',
            menu_id: 15
          }
        ]
      }
    ],
    authEntities: null
  },
  {
    id: 1,
    name: '系统管理',
    url: '#',
    sequence: 20,
    subMenu: [
      {
        id: 2,
        name: '管理员账号',
        url: 'bwAdminUsers.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 1,
            name: '添加管理员',
            url: 'bwAddUser',
            sequence: 1,
            category: '2',
            menu_id: 2
          },
          {
            id: 2,
            name: '删除管理员',
            url: 'bwDelUser',
            sequence: 2,
            category: '2',
            menu_id: 2
          },
          {
            id: 3,
            name: '禁用|恢复管理员',
            url: 'bwLimitUser',
            sequence: 3,
            category: '2',
            menu_id: 2
          },
          {
            id: 39,
            name: '企业账号信息查询',
            url: 'sManagerInfoList',
            sequence: 39,
            category: '4',
            menu_id: 2
          },
          {
            id: 40,
            name: '增加账号',
            url: 'aManager',
            sequence: 40,
            category: '1',
            menu_id: 2
          },
          {
            id: 41,
            name: '修改账户状态',
            url: 'uManager',
            sequence: 41,
            category: '3',
            menu_id: 2
          }
        ]
      },
      {
        id: 3,
        name: '权限管理',
        url: 'bwAdminRoles.do',
        sequence: 2,
        subMenu: null,
        authEntities: [
          {
            id: 4,
            name: '添加角色',
            url: 'bwAddRole',
            sequence: 4,
            category: '3',
            menu_id: 3
          },
          {
            id: 5,
            name: '删除角色',
            url: 'bwDelRole',
            sequence: 5,
            category: '3',
            menu_id: 3
          },
          {
            id: 6,
            name: '配置权限',
            url: 'bwConfigPermissions',
            sequence: 6,
            category: '3',
            menu_id: 3
          },
          {
            id: 42,
            name: '查询角色列表',
            url: 'sRoleList',
            sequence: 42,
            category: '4',
            menu_id: 3
          }
        ]
      },
      /*
      {
        id: 4,
        name: '菜单管理',
        url: 'bwAdminMenus.do',
        sequence: 3,
        subMenu: null,
        authEntities: [
          {
            id: 7,
            name: '添加菜单',
            url: 'bwAddMenu',
            sequence: 7,
            category: '4',
            menu_id: 4
          },
          {
            id: 8,
            name: '删除菜单',
            url: 'bwDelMenu',
            sequence: 8,
            category: '4',
            menu_id: 4
          },
          {
            id: 9,
            name: '添加功能',
            url: 'bwAddLimit',
            sequence: 9,
            category: '4',
            menu_id: 4
          }
        ]
      },
      */
      {
        id: 5,
        name: '操作记录',
        url: 'bwOPRecordIndex.do',
        sequence: 4,
        subMenu: null,
        authEntities: null
      }
    ],
    authEntities: null
  },
  {
    id: 20,
    name: '客户管理',
    url: '#',
    sequence: 1
  },
  {
    id: 21,
    name: '企业组织',
    url: '#',
    sequence: 200,
    subMenu: [
      {
        id: 6,
        name: '子账号管理',
        url: 'bwSubaccountIndex.do',
        sequence: 5,
        subMenu: null,
        authEntities: null
      },
      {
        id: 7,
        name: '企业信息',
        url: 'bwEnterpriseInfoIndex.do',
        sequence: 6,
        subMenu: null,
        authEntities: null
      }
    ]
  }
]

// just grant all permissions
const granted = [
  {
    id: 6,
    name: '合作方管理',
    url: '#',
    sequence: 5,
    subMenu: [
      {
        id: 7,
        name: '代理商管理',
        url: 'agent.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 13,
            name: '代理商列表查询',
            url: 'sProxyList',
            sequence: 13,
            category: '4',
            menu_id: 7
          },
          {
            id: 14,
            name: '代理商详情查询',
            url: 'sProxyDetail',
            sequence: 14,
            category: '4',
            menu_id: 7
          },
          {
            id: 15,
            name: '添加代理商',
            url: 'aProxy',
            sequence: 15,
            category: '1',
            menu_id: 7
          },
          {
            id: 16,
            name: '修改代理商',
            url: 'uProxy',
            sequence: 16,
            category: '3',
            menu_id: 7
          }
        ]
      },
      {
        id: 8,
        name: '供应商管理',
        url: 'supplierUI.do',
        sequence: 2,
        subMenu: null,
        authEntities: [
          {
            id: 17,
            name: '供应商列表查询',
            url: 'sProviderList',
            sequence: 17,
            category: '4',
            menu_id: 8
          },
          {
            id: 18,
            name: '供应商详情查询',
            url: 'sProviderDetail',
            sequence: 18,
            category: '4',
            menu_id: 8
          },
          {
            id: 19,
            name: '增加供应商',
            url: 'aProvider',
            sequence: 19,
            category: '1',
            menu_id: 8
          },
          {
            id: 20,
            name: '修改供应商',
            url: 'uProvider',
            sequence: 20,
            category: '3',
            menu_id: 8
          }
        ]
      }
    ],
    authEntities: null
  },
  {
    id: 10,
    name: '运营管理',
    url: '#',
    sequence: 10,
    subMenu: [
      {
        id: 11,
        name: '卡库存管理',
        url: 'cardStoreIndex.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 21,
            name: '卡库存列表查询',
            url: 'sCardStoreList',
            sequence: 21,
            category: '4',
            menu_id: 11
          },
          {
            id: 22,
            name: '卡库存详情查询',
            url: 'sCardStoreDetail',
            sequence: 22,
            category: '4',
            menu_id: 11
          },
          {
            id: 23,
            name: '导卡入库',
            url: 'ImCard',
            sequence: 23,
            category: '0',
            menu_id: 11
          },
          {
            id: 24,
            name: '导卡出库',
            url: 'exStoreCard',
            sequence: 24,
            category: '0',
            menu_id: 11
          }
        ]
      },
      {
        id: 19,
        name: '卡管理',
        url: 'cards.do',
        sequence: 2,
        subMenu: null,
        authEntities: [
          {
            id: 25,
            name: '卡列表查询',
            url: 'sCardList',
            sequence: 25,
            category: '4',
            menu_id: 19
          },
          {
            id: 26,
            name: '卡详情查询',
            url: 'sCardDetail',
            sequence: 26,
            category: '4',
            menu_id: 19
          },
          {
            id: 27,
            name: '卡信息报表导出',
            url: 'exCardInfo',
            sequence: 27,
            category: '4',
            menu_id: 19
          },
          {
            id: 29,
            name: '叠加套餐',
            url: 'uCardPackage',
            sequence: 29,
            category: '1',
            menu_id: 19
          },
          {
            id: 30,
            name: '流量矫正',
            url: 'uCardFlow',
            sequence: 30,
            category: '1',
            menu_id: 19
          },
          {
            id: 31,
            name: '卡划拨代理',
            url: 'uCardOwer',
            sequence: 31,
            category: '1',
            menu_id: 19
          }
        ]
      },
      {
        id: 20,
        name: '任务管理',
        url: 'jobUI.do',
        sequence: 3,
        subMenu: null,
        authEntities: [
          {
            id: 11,
            name: '更新任务状态',
            url: 'updateJobInfoStatus',
            sequence: 11,
            category: '3',
            menu_id: 20
          },
          {
            id: 36,
            name: '任务查询',
            url: 'sTaskList',
            sequence: 36,
            category: '4',
            menu_id: 20
          },
          {
            id: 37,
            name: '任务执行',
            url: 'uTask',
            sequence: 37,
            category: '3',
            menu_id: 20
          }
        ]
      },
      {
        id: 21,
        name: '卡用量管理',
        url: 'cardFlowUsed.do',
        sequence: 4,
        subMenu: null,
        authEntities: [
          {
            id: 33,
            name: '卡月用量查询',
            url: 'sCardFlowMonth',
            sequence: 33,
            category: '4',
            menu_id: 21
          },
          {
            id: 34,
            name: '卡日用量查询',
            url: 'sCardFlowDaily',
            sequence: 34,
            category: '4',
            menu_id: 21
          },
          {
            id: 35,
            name: '卡用量报表导出',
            url: 'exCardFlowDaily',
            sequence: 35,
            category: '4',
            menu_id: 21
          }
        ]
      },
      {
        id: 22,
        name: '卡池管理',
        url: 'cardPool.do',
        sequence: 5,
        subMenu: null,
        authEntities: null
      },
      {
        id: 24,
        name: '实名管理',
        url: 'authenRealName.do',
        sequence: 6,
        subMenu: null,
        authEntities: null
      }
    ],
    authEntities: null
  },
  {
    id: 14,
    name: '记录管理',
    url: '#',
    sequence: 15,
    subMenu: [
      {
        id: 15,
        name: '套餐订购记录',
        url: 'packageRecordUI.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 38,
            name: '套餐订购记录',
            url: 'sPackageList',
            sequence: 38,
            category: '4',
            menu_id: 15
          }
        ]
      }
    ],
    authEntities: null
  },
  {
    id: 114,
    name: '短信管理',
    url: '#',
    sequence: 6,
    subMenu: [
      {
        id: 115,
        name: '短信收发记录',
        url: 'packageRecordUI.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 38,
            name: '短信收发记录',
            url: 'sPackageList',
            sequence: 38,
            category: '4',
            menu_id: 15
          }
        ]
      }
    ],
    authEntities: null
  },
  {
    id: 1,
    name: '系统管理',
    url: '#',
    sequence: 20,
    subMenu: [
      {
        id: 2,
        name: '管理员账号',
        url: 'bwAdminUsers.do',
        sequence: 1,
        subMenu: null,
        authEntities: [
          {
            id: 1,
            name: '添加管理员',
            url: 'bwAddUser',
            sequence: 1,
            category: '2',
            menu_id: 2
          },
          {
            id: 2,
            name: '删除管理员',
            url: 'bwDelUser',
            sequence: 2,
            category: '2',
            menu_id: 2
          },
          {
            id: 3,
            name: '禁用|恢复管理员',
            url: 'bwLimitUser',
            sequence: 3,
            category: '2',
            menu_id: 2
          },
          {
            id: 39,
            name: '企业账号信息查询',
            url: 'sManagerInfoList',
            sequence: 39,
            category: '4',
            menu_id: 2
          },
          {
            id: 40,
            name: '增加账号',
            url: 'aManager',
            sequence: 40,
            category: '1',
            menu_id: 2
          },
          {
            id: 41,
            name: '修改账户状态',
            url: 'uManager',
            sequence: 41,
            category: '3',
            menu_id: 2
          }
        ]
      },
      {
        id: 3,
        name: '权限管理',
        url: 'bwAdminRoles.do',
        sequence: 2,
        subMenu: null,
        authEntities: [
          {
            id: 4,
            name: '添加角色',
            url: 'bwAddRole',
            sequence: 4,
            category: '3',
            menu_id: 3
          },
          {
            id: 5,
            name: '删除角色',
            url: 'bwDelRole',
            sequence: 5,
            category: '3',
            menu_id: 3
          },
          {
            id: 6,
            name: '配置权限',
            url: 'bwConfigPermissions',
            sequence: 6,
            category: '3',
            menu_id: 3
          },
          {
            id: 42,
            name: '查询角色列表',
            url: 'sRoleList',
            sequence: 42,
            category: '4',
            menu_id: 3
          }
        ]
      },
      /*
      {
        id: 4,
        name: '菜单管理',
        url: 'bwAdminMenus.do',
        sequence: 3,
        subMenu: null,
        authEntities: [
          {
            id: 7,
            name: '添加菜单',
            url: 'bwAddMenu',
            sequence: 7,
            category: '4',
            menu_id: 4
          },
          {
            id: 8,
            name: '删除菜单',
            url: 'bwDelMenu',
            sequence: 8,
            category: '4',
            menu_id: 4
          },
          {
            id: 9,
            name: '添加功能',
            url: 'bwAddLimit',
            sequence: 9,
            category: '4',
            menu_id: 4
          }
        ]
      },
      */
      {
        id: 5,
        name: '操作记录',
        url: 'bwOPRecordIndex.do',
        sequence: 4,
        subMenu: null,
        authEntities: null
      }
    ],
    authEntities: null
  },
  {
    id: 20,
    name: '客户管理',
    url: '#',
    sequence: 1
  }
]

const appendixGrants = [
  {
    id: 21,
    name: '企业组织',
    url: '#',
    sequence: 200,
    subMenu: [
      {
        id: 6,
        name: '子账号管理',
        url: 'bwSubaccountIndex.do',
        sequence: 5,
        subMenu: null,
        authEntities: null
      },
      {
        id: 7,
        name: '企业信息',
        url: 'bwEnterpriseInfoIndex.do',
        sequence: 6,
        subMenu: null,
        authEntities: null
      }
    ]
  },
  {
    id: 1,
    name: '账户管理',
    url: '#',
    sequence: 201,
    subMenu: [
      {
        id: 6,
        name: '代理商账户',
        url: 'bwSubaccountIndex.do',
        sequence: 2,
        subMenu: null,
        authEntities: null
      },
      {
        id: 7,
        name: '渠道商账户',
        url: 'bwEnterpriseInfoIndex.do',
        sequence: 1,
        subMenu: null,
        authEntities: null
      },
      {
        id: 7,
        name: '银行信息',
        url: 'bwEnterpriseInfoIndex.do',
        sequence: 3,
        subMenu: null,
        authEntities: null
      }
    ]
  }
]

const userEntities = [
  {
    id: 2,
    loginName: 'xugx',
    name: '徐光兴',
    password: '96E79218965EB72C92A549DD5A330112',
    userStatus: UserStatus.NORMAL,
    lastLoginOn: 1515553849000,
    createTime: 1510542835000,
    roleBeans: [{
      id: 1,
      name: '系统管理员',
      label: 'ADMIN'
    }]
  },
  {
    id: 3,
    loginName: 'fenghq',
    name: '冯会强',
    password: 'fenghq388',
    userStatus: UserStatus.NORMAL,
    lastLoginOn: 1523423471000,
    createTime: 1510542806000,
    roleBeans: [{
      id: 1,
      name: '系统管理员',
      label: 'ADMIN'
    }]
  }
]

const wrapPage = (val, size, page) => {
  const found = val.slice(size * page, size * (page + 1))

  return {
    last: true,
    totalPages: Math.ceil(val.length / size),
    totalElements: val.length,
    size,
    number: page,
    first: true,
    fieldMetaData: null,
    conditionMetaData: null,
    content: found
  }
}

const oaUsersResponse = {
  code: 0,
  message: '成功',
  users: [
    {
      userId: 'mbing',
      userName: '孟冰',
      departmentName: 'DC010200产品部（研发）',
      departmentCode: 'DC010200',
      jobposition: '员工',
      state: '正式',
      companyid: 1,
      companyname: '北纬科技'
    },
    {
      userId: 'wangb',
      userName: '王波',
      departmentName: 'DC020000信息安全中心',
      departmentCode: 'DC020000',
      jobposition: '总经理',
      state: '正式',
      companyid: 1,
      companyname: '北纬科技'
    },
    {
      userId: 'liuly',
      userName: '刘鲁亚',
      departmentName: 'DB030000蜂巢互联',
      departmentCode: 'DB030000',
      jobposition: '总经理助理',
      state: '正式',
      companyid: 1,
      companyname: '北纬科技'
    }
  ]
}

const IUserService = {
  addOrgSubUser: mock(Succeed)(({ loginName, name, mobile, email, roles, orgId }) => true),
  addRole: mock(Succeed)(({ menuBeans, roleName, roleId }) => true),
  addUser: mock(Succeed)(({ loginName, name, roleId }) => 3),
  delOrgSubUser: mock(Succeed)(({ subId }) => true),
  deleteManager: mock(Succeed)(({ loginName }) => true),
  deleteRole: mock(Succeed)(({ roleId }) => true),
  getAllMenuBeans: mock(Succeed)(() => permissions),
  getAllOaUserInfo: mock(Succeed)(() => oaUsersResponse),
  getAllRole: mock(Succeed)(() => roles),
  getAllUserInfo: mock(Succeed)(() => userEntities),
  getAuthList: mock(Succeed)(({ roleId }) => roleId === 1 ? granted : appendixGrants),
  getCurrentUser: mock(Succeed)(() => user),
  // case: no user
  // getCurrentUser: mock(Failed)(() => ({ message: 'session id is lost' })),
  getDeleteAuth: mock(Succeed)(() => roles.filter(x => x.label !== 'ADMIN')),
  getOperatePermissions: mock(Succeed)(() => granted),
  getOrgLoginAccount: mock(Succeed)(({ admClientId }) => user),
  getOrgSalers: mock(Succeed)(({ orgId }) => salespeople),
  getOrgSubUsers: mock(Succeed)(({ page, size }) => wrapPage(userEntities, size, page)),
  getUser: mock(Succeed)(({ sessionId }) => user),
  getUserByRoleAndStatus: mock(Succeed)(
    ({ roleId, status, pageIndex, pageSize }) =>
      wrapPage(
        userEntities.filter(
          x =>
            (x.status === status || !status) &&
            ((x.role && x.role.id === roleId) || !roleId)
        ),
        pageSize,
        pageIndex
      )
  ),
  hasPower: mock(Succeed)(({ sessionId, action }) => true),
  insertUser: mock(Succeed)(({ users }) => true),
  resetPassword: mock(Succeed)(({ loginName }) => void 0),
  updateDefaultPassword: mock(Succeed)(({ loginName, password }) => LoginResult.OK),
  updateOrgSubAdmBySuperLevel: mock(Succeed)(({ id, name, mobile, email }) => user),
  updateOrgSubUser: mock(Succeed)(({ id, name, mobile, email, roles }) => user),
  updateUser: mock(Succeed)(({ userId, name, roleId }) => true),
  updateUserStatus: mock(Succeed)(({ status, id }) => true)
}
const proxies = [
  {
    id: 1,
    name: '徐光兴',
    company: '北京北纬通信科技股份有限公司',
    level: 1,
    account: null,
    contactor: ' ',
    mobilePhone: '15311528981',
    idCard: '121323123123111111',
    phone: '',
    email: 'xugx@bw30.com',
    externalQuery: 'ENABLE',
    apiPwd: 'sdfes$d',
    hotLine: '133389877',
    loginName: 'xugx1',
    cdUpPhotoUrl:
      'http://172.16.10.188:8080/uploadImage/201711/88d1ba8b209c47db93af873d67bbed17.png',
    cdDownPhotoUrl:
      'http://172.16.10.188:8080/uploadImage/201711/f1ddac07d67d4ae2a1f1fea6ef524cb3.png',
    roleId: null,
    resourceName: '徐光兴'
  },
  {
    id: 2,
    name: 'wangfang',
    company: 'beiweitongxin',
    level: 1,
    account: '徐光兴',
    contactor: 'wangfangf`',
    mobilePhone: '15510259907',
    idCard: '658965233652365200',
    hotLine: '133389877',
    phone: '',
    email: 'sasuke@live.cn',
    externalQuery: 'DISABLE',
    apiPwd: 'ss1AVvl9qi',
    loginName: 'wangfang',
    cdUpPhotoUrl:
      'http://172.16.10.188:8080/uploadImage/201711/88d1ba8b209c47db93af873d67bbed17.png',
    cdDownPhotoUrl:
      'http://172.16.10.188:8080/uploadImage/201711/f1ddac07d67d4ae2a1f1fea6ef524cb3.png',
    roleId: null,
    resourceName: null
  }
]

const subs = [
  {
    id: 1109,
    name: null,
    company: 'hello',
    level: 2,
    account: null,
    contactor: null,
    mobilePhone: '13718327898',
    idCard: '678878288734898399',
    phone: '010-68317777',
    email: '',
    apiPwd: 'Fdfdfdfdodfdfd[SbA8ysPk',
    loginName: null,
    cdUpPhotoUrl:
      'http://172.16.10.188:8080/uploadImage/201711/88d1ba8b209c47db93af873d67bbed17.png',
    cdDownPhotoUrl:
      'http://172.16.10.188:8080/uploadImage/201711/f1ddac07d67d4ae2a1f1fea6ef524cb3.png',
    roleId: null
  },
  {
    id: 1110,
    name: null,
    company: 'world',
    level: 2,
    account: null,
    contactor: null,
    mobilePhone: '13718327898',
    idCard: '678878288734898399',
    phone: '010-68317777',
    email: '',
    apiPwd: 'dfdfdfF[SbA8ysdfdfdfdfskfsdPk',
    loginName: null,
    cdUpPhotoUrl:
      'http://172.16.10.188:8080/uploadImage/201711/88d1ba8b209c47db93af873d67bbed17.png',
    cdDownPhotoUrl:
      'http://172.16.10.188:8080/uploadImage/201711/f1ddac07d67d4ae2a1f1fea6ef524cb3.png',
    roleId: null
  }
]

const counts = [
  { category: '0', description: '未知', count: 0 },
  { category: '2', description: '正使用', count: 5 },
  { category: '1', description: '待激活', count: 10 },
  { category: '3', description: '停机', count: 3 },
  { category: '5', description: '挂失', count: 0 },
  { category: '4', description: '预约销户', count: 2 }
]

const total = [
  { label: 'CMCC', name: null, flowMonth: 2 ** 20 + 1024 },
  { label: 'CNET', name: null, flowMonth: 0 },
  { label: 'UNICOM', name: null, flowMonth: 0 }
]

const mockDailyCount = d => {
  const res = []

  const days = daysOfMonth(d)

  const m = 2 ** 20

  let i = 1

  while (i <= days) {
    d.setDate(i)

    res.push({ count: Math.floor(Math.random() * m), date: +d })

    i++
  }

  return res
}

const mockFlow = month => {
  const d = new Date(month)

  const now = new Date()

  const empty =
    d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()

  return [
    { name: 'name-1', label: 'CMCC', content: empty ? [] : mockDailyCount(d) },
    { name: 'name-2', label: 'CNET', content: empty ? [] : mockDailyCount(d) },
    { name: 'name-3', label: 'UNICOM', content: empty ? [] : mockDailyCount(d) }
  ]
}

const IProxyManager = {
  listProxies: mock(Succeed)(({ page, size }) => wrapPage(proxies, size, page)),
  externalUrl: mock(Succeed)(
    ({ userId }) => 'https://iot.bwae.org/queryPackagesUI/' + userId
  ),
  updateExternalQuery: mock(Succeed)(
    ({ externalQueryEnum, id }) => externalQueryEnum
  ),
  updateHotline: mock(Succeed)(({ proxyId, hotLine }) => '18729287726'),
  listBriefProxies: mock(Succeed)(() =>
    proxies.map(x => ({ id: x.id, name: x.name }))
  ),
  getProxy: mock(Succeed)(
    ({ id }) => proxies.find(x => x.id === id) || subs.find(x => x.id === id)
  ),
  add: mock(Succeed)(() => void 0),
  update: mock(Succeed)(() => void 0),
  getSecProxylist: mock(Succeed)(
    ({ proxyId, deep }) => (proxyId === 1 ? subs : [])
  ),
  getOnlyFirstProxylist: mock(Succeed)(
    ({ proxyId }) => (proxyId === 1 ? subs : [])
  ),
  getCardCount: mock(Succeed)(() => counts),
  cardMonthFlow: mock(Succeed)(() => total),
  getFlowCountInMonth: mock(Succeed)(({ proxyId, month }) => mockFlow(month)),
  getHomeFlowCountInMonth: mock(Succeed)(({ proxyId, month }) =>
    mockFlow(month)
  )
}

const providers = [
  {
    id: 1,
    name: '佛山移动',
    enName: 'fushan-cmcc',
    alias: 'GDYD',
    status: 'ENABLED',
    account: '赛贝尔',
    contactor: '李婷change5',
    mobilePhone: '12333333333',
    operator: 'CMCC',
    createOn: 1510824827000,
    loginAccount: '2000456262',
    loginPassword: '123',
    apiAccessKey: 'oo21vravy4',
    apiSecretKey: '444060ac6499022f166cc9a75762bd6f',
    apiUrl: 'http://120.197.89.173:8081/openapi/router'
  },
  {
    id: 2,
    name: '扬州电信',
    enName: 'yangzhou-cnet',
    alias: 'ZGDX',
    status: 'ENABLED',
    account: '赛贝尔',
    contactor: null,
    mobilePhone: null,
    operator: 'CNET',
    createOn: 1510824831000,
    loginAccount: 'bjsbr2017',
    loginPassword: 'bjsbr123.A',
    apiAccessKey: '',
    apiSecretKey: 's59PW69m5',
    apiUrl: 'http://api.ct10649.com:9001'
  },
  {
    id: 3,
    name: '上海联通',
    enName: 'shagnhai-unicom',
    alias: 'ZGLT',
    status: 'ENABLED',
    account: '刘鲁亚',
    contactor: null,
    mobilePhone: null,
    operator: 'UNICOM',
    createOn: 1510824833000,
    loginAccount: 'liuluya015781',
    loginPassword: 'Bwcm123456',
    apiAccessKey: '51321529-04c6-401c-8c67-cafd3451190f',
    apiSecretKey: ' ',
    apiUrl: ' '
  }
]

const IProviderManager = {
  getProvider: mock(Succeed)(({ id }) => providers.find(x => x.id === id)),
  add: mock(Succeed)(({ provider }) => void 0),
  update: mock(Succeed)(({ provider }) => void 0),
  listProviders: mock(Succeed)(({ page, size }) =>
    wrapPage(providers, size, page)
  ),
  listBriefProviders: mock(Succeed)(() =>
    providers.map(x => ({
      id: x.id,
      name: x.name,
      enName: x.enName,
      account: x.account
    }))
  )
}

const stock = [
  {
    cardNumber: '1064998261064',
    iccid: '852679B2728270996833',
    providerName: '扬州电信',
    operatorName: '中国电信',
    cardStatusName: '待出库',
    openDate: 1526313600000,
    putInDate: 1526367453000,
    deliverDate: 1526368401000,
    account: '北纬科技'
  },
  {
    cardNumber: '1064822168535',
    iccid: '661377B8439141495209',
    providerName: '扬州电信',
    operatorName: '中国电信',
    cardStatusName: '已出库',
    openDate: 1526313600000,
    putInDate: 1526367453000,
    deliverDate: 1526368401000,
    account: '北纬科技'
  }
]

const ICardStoreManager = {
  listPageInWareHouseByCondition: mock(Succeed)(
    ({ page, size, providerId, operator, cardStoreStatus }) =>
      wrapPage(stock, size, page)
  ),
  putInByFile: mock(Succeed)(({ providerId, fileUrl }) => true),
  listPageInWareHouse: mock(Succeed)(({ page, size }) =>
    wrapPage(stock, size, page)
  ),
  deliver: mock(Succeed)(({ proxyId, chargeType, iccids }) => true),
  deliverByFile: mock(Succeed)(({ proxyId, chargeType, fileUrl }) => true)
}

const flows = {
  month: [
    {
      cardNumber: '1064349582956',
      operatorName: '中国电信',
      providerName: '扬州电信',
      proxyName: '厦门锐谷通信',
      total: 146789361,
      used: 468361,
      remainder: 146321000,
      exceed: 0,
      utilizationRate: 0.0032,
      dailyCount: null
    },
    {
      cardNumber: '1064148476953',
      operatorName: '中国联通',
      providerName: '上海联通',
      proxyName: '安付股份',
      total: 10240000,
      used: 102400,
      remainder: 10137600,
      exceed: 0,
      utilizationRate: 0.01,
      dailyCount: null
    },
    {
      cardNumber: '1064807475823',
      operatorName: '中国移动',
      providerName: '佛山移动',
      proxyName: '安付股份',
      total: 10240000,
      used: 102400,
      remainder: 10137600,
      exceed: 0,
      utilizationRate: 0.01,
      dailyCount: null
    }
  ],
  daily: [
    {
      cardNumber: '1064349582956',
      operatorName: '中国电信',
      providerName: '扬州电信',
      proxyName: '厦门锐谷通信',
      total: 146789361,
      used: 468361,
      remainder: 146321000,
      exceed: 0,
      utilizationRate: 0.0032,
      dailyCount: [{ date: 1525104000000, count: 1111 }]
    },
    {
      cardNumber: '1064148476953',
      operatorName: '中国联通',
      providerName: '上海联通',
      proxyName: '安付股份',
      total: 10240000,
      used: 102400,
      remainder: 10137600,
      exceed: 0,
      utilizationRate: 0.01,
      dailyCount: [
        { date: 1525104000000, count: 1024 },
        { date: 1525190400000, count: 1024 },
        { date: 1525276800000, count: 1024 },
        { date: 1525363200000, count: 20480 }
      ]
    },
    {
      cardNumber: '1064807475823',
      operatorName: '中国移动',
      providerName: '佛山移动',
      proxyName: '安付股份',
      total: 10240000,
      used: 102400,
      remainder: 10137600,
      exceed: 0,
      utilizationRate: 0.01,
      dailyCount: []
    }
  ]
}

const ICardFlowManager = {
  listMonthCardFlowPageOnCondition: mock(Succeed)(
    ({ page, size, proxyId, providerId, operator, month, cardNumber }) =>
      wrapPage(flows.month, size, page)
  ),
  listMonthCardFlowPage: mock(Succeed)(({ page, size }) =>
    wrapPage(flows.month, size, page)
  ),
  listDailyCardFlowPageOnCondition: mock(Succeed)(
    ({ page, size, proxyId, providerId, operator, month, cardNumber }) =>
      wrapPage(flows.daily, size, page)
  ),
  listDailyCardFlowPage: mock(Succeed)(({ page, size }) =>
    wrapPage(flows.daily, size, page)
  )
}

const cards = [
  {
    id: 11171,
    cardNumber: null,
    iccid: '8986031749203191442',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾马腾马腾马腾马腾马腾马腾马腾马腾马腾',
    parentProxyName: '马腾马腾马腾马腾马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: null,
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  },
  {
    id: 11180,
    cardNumber: null,
    iccid: '26912608566694440413',
    imsi: null,
    imei: null,
    operatorName: '中国电信',
    providerName: '扬州电信',
    rootProxyName: '马腾',
    parentProxyName: '马腾',
    ownnerName: '马腾',
    ownerId: 1167,
    chargeTypeName: '单卡计费',
    localStatusName: '正常',
    operatorStatusName: '待激活',
    openTime: null,
    activeTime: null,
    remark: null,
    groupName: '默认组',
    orderPackages: [],
    appendix: null
  }
]

const pacakges = [
  {
    id: 232,
    name: '物联网（数据）月加餐包定向 3 元 30MB',
    total: 30720,
    scope: 2,
    packageType: 5
  },
  {
    id: 233,
    name: '物联网（数据）月加餐包定向 6 元 100MB',
    total: 102400,
    scope: 2,
    packageType: 5
  },
  {
    id: 234,
    name: '物联网（数据）月加餐包定向 12 元 300MB',
    total: 307200,
    scope: 2,
    packageType: 5
  }
]

const ICardManager = {
  addFlowPackage: mock(Succeed)(({ cardId, pacakgeId }) => ({
    code: 0,
    message: 'success'
  })),
  asignToProxy: mock(Succeed)(({ ids, proxyId }) => true),
  excelCards: mock(Succeed)(({ condition }) => ({
    code: 0,
    message: 'success',
    fileUrl: 'http://cn.bing.com'
  })),
  getCardDetailInfo: mock(Succeed)(({ cardId }) =>
    cards.find(x => x.id === cardId)
  ),
  getSummary: mock(Succeed)(() => {
    const countInCategory = counts
    const total = counts.reduce((acc, x) => acc + x.count, 0)

    return {
      total: total * 3,
      countByOperator: [
        {
          name: 'cmcc',
          label: 'CMCC',
          total,
          inStore: 5,
          countInCategory
        },
        {
          name: 'cnet',
          label: 'CNET',
          total,
          inStore: 6,
          countInCategory
        },
        {
          name: 'unicom',
          label: 'UNICOM',
          total,
          inStore: 7,
          countInCategory
        }
      ]
    }
  }),
  listDetailInPage: mock(Succeed)(({ page, size }) =>
    wrapPage(cards, size, page)
  ),
  listDetailInPageByCondition: mock(Succeed)(({ page, size, condition }) =>
    wrapPage(cards, size, page)
  ),
  listFlowPackageByCardId: mock(Succeed)(({ id }) => pacakges),
  moveToGroup: mock(Succeed)(({ ids, groupId }) => true),
  updateFlowPackage: mock(Succeed)(({ cardId, pacakgeId }) => ({
    code: 0,
    message: 'success'
  })),
  updateRemark: mock(Succeed)(({ ids, remark }) => true)
}

const tasks = [
  {
    name: 'test1',
    description: '',
    runningStatusName: '就绪待执行',
    statusName: '启用'
  }
]

const ITaskManager = {
  disable: mock(Succeed)(({ name }) => true),
  enableJob: mock(Succeed)(({ name }) => true),
  getTaskResult: mock(Succeed)(({ name }) => tasks.find(x => x.name === name)),
  list: mock(Succeed)(({ page, size }) => wrapPage(tasks, size, page)),
  runRightNow: mock(Succeed)(({ name }) => true)
}

const ICardGroupManager = {
  addGroup: mock(Succeed)(({ name }) => true),
  deleteGroup: mock(Succeed)(({ id }) => true),
  getGroupList: mock(Succeed)(({ id, page, size }) => wrapPage([], size, page)),
  getGroupsById: mock(Succeed)(({ id }) => []),
  updateGroup: mock(Succeed)(({ id, name }) => true)
}

// const userInfo = [
//   {
//     id: 2,
//     loginName: 'xugx',
//     name: '徐光兴',
//     password: '96E79218965EB72C92A549DD5A330112',
//     userStatus: UserStatus.NORMAL,
//     lastLoginOn: 1515553849000,
//     createTime: 1510542835000,
//     email: '1333@bw.com',
//     orgId: 22,
//     mobile: '13387654890',
//     roleBean: {
//       id: 1,
//       name: '系统管理员',
//       label: 'ADMIN'
//     },
//     roleBeans: [
//       { id: 1, name: '系统管理员', label: 'ADMIN' },
//       { id: 2, name: '运营人员', label: 'CLIENT' },
//       { id: 3, name: '测试人员', label: 'CLIENT' }
//     ]
//   },
//   {
//     id: 3,
//     loginName: 'fenghq',
//     name: '冯会强',
//     password: 'fenghq388',
//     userStatus: UserStatus.NORMAL,
//     lastLoginOn: 1523423471000,
//     createTime: 1510542806000,
//     email: '1333@bw.com',
//     orgId: 22,
//     mobile: '13387654890',
//     roleBean: {
//       id: 1,
//       name: '系统管理员',
//       label: 'ADMIN'
//     },
//     roleBeans: [
//       { id: 1, name: '系统管理员', label: 'ADMIN' },
//       { id: 2, name: '运营人员', label: 'CLIENT' },
//       { id: 3, name: '测试人员', label: 'CLIENT' }
//     ]
//   }
// ]
const smsTargetMsisdn = [
  {
    operator: '中国移动',
    operatorStatus: '停机',
    msisdn: '1345653324',
    openTime: 1520265600000,
    activeTime: 1520265600000
  },
  {
    operator: '中国电信',
    operatorStatus: '使用中',
    msisdn: '1345653324',
    openTime: 1520265600000,
    activeTime: 1520265600000
  },
  {
    operator: '中国联通',
    operatorStatus: '待激活',
    msisdn: '1345653324',
    openTime: 1520265600000,
    activeTime: 1520265600000
  }
]

const smsSendBatchList = [
  {
    batchId: '1345653324',
    content: 'send content',
    totalNum: 500,
    successNum: 50,
    category: '短消息',
    sendTime: 1520265600000
  },
  {
    batchId: '1345653325',
    content: '',
    totalNum: 500,
    successNum: 150,
    category: '短消息',
    sendTime: 1520265600000
  },
  {
    batchId: '1345653326',
    content: null,
    totalNum: 300,
    successNum: 100,
    category: '短消息',
    sendTime: +new Date()
  }
]

const smsSendRecordList = [
  {
    msisdn: '1345653324',
    sendTime: 1520265600000,
    supplierName: 'provider-1',
    clientName: 'proxy-1',
    operatorName: '中国电信',
    smsSendStatus: 'SUCCEDD'
  },
  {
    msisdn: '1345653324',
    sendTime: 1520265600000,
    supplierName: 'provider-2',
    clientName: 'proxy-2',
    operatorName: '中国移动',
    smsSendStatus: 'UNKNOWN'
  }
]

const receivedSmsRecords = [
  {
    supplierName: 'provider-1',
    msisdn: '852679B2728270996833',
    operatorName: 'CMCC',
    clientName: 'proxy-1',
    receiveTime: +new Date(),
    content: 'some content'
  },
  {
    supplierName: 'provider-2',
    msisdn: '661377B8439141495209',
    operatorName: 'CNET',
    clientName: 'proxy-2',
    receiveTime: +new Date('2018/5/11 23:20:42'),
    content: ''
  },
  {
    supplierName: 'provider-3',
    msisdn: '623356B8439245495212',
    operatorName: 'UNICOM',
    clientName: 'proxy-3',
    receiveTime: +new Date('2018/6/8 09:53:20'),
    content: null
  }
]

const ISmsManager = {
  cancelSmsSendReq: mock(Succeed)(({ batchId }) => ({
    code: 1000,
    msg: 'success',
    info: ''
  })),
  confirmSmsSendReq: mock(Succeed)(
    ({ smsCategory, content, msisdns, batchId }) => ({
      code: 1000,
      msg: 'success',
      info: ''
    })
  ),
  importMsisdnsForSms: mock(Succeed)(({ msisdns, fileUrl, exact }) => ({
    batchId: '1345653324',
    smsTargetMsisdnList: wrapPage(smsTargetMsisdn)
  })),
  listSmsCardTempInfo: mock(Succeed)(({ page, size }) => ({
    batchId: '1345653324',
    smsTargetMsisdnList: wrapPage(smsTargetMsisdn, size, page)
  })),
  listSmsReceiveRecord: mock(Succeed)(
    ({
      page,
      size,
      supplier,
      client,
      operator,
      startTime,
      endTime,
      msisdn
    }) => ({
      code: 1000,
      msg: 'success',
      smsReceiveRecordBeanList: wrapPage(receivedSmsRecords, size, page)
    })
  ),
  listSmsSendBatchInfo: mock(Succeed)(({ page, size, startTime, endTime }) => ({
    code: 1000,
    msg: 'success',
    smsBatchInfoList: wrapPage(smsSendBatchList, size, page)
  })),
  listSmsSendRecord: mock(Succeed)(({ page, size, startTime, endTime }) => ({
    code: 1000,
    msg: 'success',
    smsSendRecordList: wrapPage(smsSendRecordList, size, page)
  }))
}

const IHomeLogoManager = {
  getLogoUrl: mock(Succeed)(
    ({ domain }) => 'https://image.flaticon.com/icons/png/128/356/356461.png'
  )
}

const randomCond = (conds) => {
  const val = Math.floor(Math.random() * conds.length)

  return conds[val]
}

const mockOrgination = id => ({
  id,

  shortName: 'org' + id + ' short-name',
  companyName: 'organization' + id + ' full name',
  accessUrl: randomCond(['iot-cust.combmobile.org', 'org' + id + 'appmedia.cn', 'org' + id + '.iot.bwae.org']),

  licenseUp: '',
  licenseDown: '',

  idCard: '142745896015517155',
  cardDown: '',
  cardHand: '',
  cardUp: '',

  contact: 'org' + id + '-contact',
  email: 'org' + id + '@google.com',
  mobile: '18210254786',
  telephone: '010-6831-7777',

  adminClient: id,

  orgCategory: 'DISTRIBUTOR' + (Math.random() > 0.5 ? ',BROKER' : ''),

  associateSale: 'org' + id + '-sale',

  bankName: 'org' + id + '-bank',
  accountName: 'org' + id + '-account',
  debitAccount: 'org' + id + '-debit',

  userInfo: {
    loginName: 'org-' + id + '-admin'
  }
})

const organizations = [
  mockOrgination(1),
  mockOrgination(2),
  mockOrgination(3),
  mockOrgination(4)
]

const salespeople = [
  { id: 1, loginName: 'sale-1', name: 'sale-1-real', lastLoginOn: +new Date() },
  { id: 2, loginName: 'sale-2', name: 'sale-2-real', lastLoginOn: +new Date() }
]

const IOrganizationManager = {
  addAssociateBroker: mock(Succeed)(({ currentOrgId, brokerId, userId }) => 0),
  addOrg: mock(Succeed)(({ superOrg, org, salerId }) => 1000),
  addOrganizationSubUser: mock(Succeed)(({ loginName, name, mobile, email, roles }) => true),
  delteOrganizationSubUser: mock(Succeed)(({ subId }) => true),
  existLoginName: mock(Succeed)(({ loginName }) => false),
  existOrgShortName: mock(Succeed)(({ shortName }) => false),
  getAllSubOrgs: mock(Succeed)(() => organizations),
  getAvailableAssociateSales: mock(Succeed)(({ orgId, targetOrg }) => salespeople),
  getBrokers: mock(Succeed)(({ brokerId }) => organizations.find(x => x.id === +brokerId)),
  getOrg: mock(Succeed)(({ id }) => organizations.find(x => x.id === id)),
  getOrgRoles: mock(Succeed)(({ userId }) => roles),
  getOrganizationSubUsers: mock(Succeed)(({ role, loginName, page, size }) => wrapPage(userEntities, size, page)),
  getSubOrg: mock(Succeed)(({ superId, subId }) =>
    organizations
      .filter(x => x.id === subId)
      .map(x => ({ subOrg: x, isDistributor: x.orgCategory.indexOf('DISTRIBUTOR') > -1, isBroker: x.orgCategory.indexOf('BROKER') > -1 }))[0]
  ),
  listOrgsByConditions: mock(Succeed)(({ superOrg, page, size, shortName }) =>
    wrapPage(
      organizations
        .filter(x => x.shortName.indexOf(shortName || '') > -1)
        .map(x => ({ subOrg: x, isDistributor: x.orgCategory.indexOf('DISTRIBUTOR') > -1, isBroker: x.orgCategory.indexOf('BROKER') > -1 }))
      , size
      , page
    )
  ),
  updateAssociateBroker: mock(Succeed)(({ currentOrgId, brokerId, operation: AssociateBrokerOperation }) => 0),
  updateOrg: mock(Succeed)(({ org }) => 0),
  updateOrganizationSubUser: mock(Succeed)(x => x)
}

const services = {
  ILoginService,
  IUserService,
  IProviderManager,
  IProxyManager,
  ICardStoreManager,
  ICardFlowManager,
  ICardManager,
  ITaskManager,
  ICardGroupManager,
  ISmsManager,
  IHomeLogoManager,
  IOrganizationManager
}

// with error middleware
const actions = flatten(services)

// with log middleware
const enhancers = enhance(tap, error)(actions)

// with error middleware

export default extract(enhancers)
