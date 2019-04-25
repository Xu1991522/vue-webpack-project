import api from '../../../api'

import flatten from '../../../helpers/flatten'

import latestSigninStorage from '../../../local/latest-signin'

const UPDATE_USER = 'UPDATE_USER'
const UPDATE_PERMISSIONS = 'UPDATE_PERMISSIONS'

const state = {
  user: null,
  permissions: {}
}

const mutations = {
  [UPDATE_USER]: (state, payload) => {
    state.user = payload ? { ...(state.user || {}), ...payload } : null
  },
  [UPDATE_PERMISSIONS]: (state, payload) => {
    state.permissions = payload
  }
}

const getters = {
  user: state => state.user,
  permissions: state => state.permissions,
  access: state => traverse(state.permissions)
}

// traverse menus to collect operate permissions
const traverse = menus => {
  // check the result of IUserService.getAllMenuBeans
  const labels = [
    { name: '添加代理商', url: 'aProxy', label: 'ADD_PROXY' },
    { name: '修改代理商', url: 'uProxy', label: 'UPDATE_PROXY' },
    { name: '增加供应商', url: 'aProvider', label: 'ADD_PROVIDER' },
    { name: '修改供应商', url: 'uProvider', label: 'UPDATE_PROVIDER' },
    { name: '导卡入库', url: 'ImCard', label: 'STOCK_CARDS' },
    { name: '导卡出库', url: 'exStoreCard', label: 'DELIVER_CARDS' },
    { name: '叠加套餐', url: 'uCardPackage', label: 'APPEND_PACKAGE' },
    { name: '流量矫正', url: 'uCardFlow', label: 'RECTIFY_FLOW' },
    { name: '卡划拨代理', url: 'uCardOwer', label: 'DELIVER_PROXY' },
    { name: '组管理', url: 'mGroup', label: 'UPDATE_GROUP' },
    { name: '任务操作', url: 'uTask', label: 'UPDATE_TASK' },
    { name: '添加管理员', url: 'bwAddUser', label: 'ADD_MANAGER' },
    { name: '删除管理员', url: 'bwDelUser', label: 'REMOVE_MANAGER' },
    { name: '禁用|恢复管理员', url: 'bwLimitUser', label: 'UPDATE_MANAGER' },
    { name: '添加角色', url: 'bwAddRole', label: 'ADD_ROLE' },
    { name: '删除角色', url: 'bwDelRole', label: 'REMOVE_ROLE' },
    { name: '配置权限', url: 'bwConfigPermissions', label: 'UPDATE_ROLE' }
  ]

  const map = labels.reduce((acc, x) => ({ ...acc, [x.url]: x.label }), {})

  const res = {}

  for (let m of menus) {
    for (let s of m.subMenu || []) {
      for (let a of s.authEntities || []) {
        map[a.url] && (res[map[a.url]] = 1)
      }
    }
  }

  return res
}

const sort = menus => {
  const f = xs => [...xs].sort((a, b) => (a.sequence < b.sequence ? -1 : 1))

  return f(
    menus.map(x => {
      return {
        ...x,
        subMenu: f(
          (x.subMenu || []).map(x => {
            return {
              ...x,
              authEntities: f(x.authEntities || [])
            }
          })
        )
      }
    })
  )
}

const INITIALIZE_ACCOUNT = 'INITIALIZE_ACCOUNT'
const SIGNOUT = 'SIGNOUT'
const REFRESH_PERMISSIONS = 'REFRESH_PERMISSIONS'

const actions = {
  [INITIALIZE_ACCOUNT]: ({ commit }) => {
    return api.IUserService.getCurrentUser({})
      .then(res => {
        if (!res.roleBean) {
          res.roleBean = res.roleBeans[0]
        }

        // compose all menus based on role id
        const menus = Promise.all(res.roleBeans.map(x => api.IUserService.getAuthList({ roleId: x.id })))
          .then(flatten)
          .then(menus => {
            const res = []

            for (let i = 0; i < menus.length; i++) {
              const parent = menus[i]

              let m1 = res.find(x => x.id === parent.id)

              if (!m1) {
                res.push(parent)

                continue
              }

              if (parent.subMenu) {
                for (let j = 0; j < parent.subMenu.length; j++) {
                  const sub = parent.subMenu[j]

                  const m2 = m1.subMenu.find(x => x.id === sub.id)

                  if (!m2) {
                    m1.subMenu.push(m2)

                    continue
                  }

                  if (sub.authEntities) {
                    for (let k = 0; k < sub.authEntities.length; k++) {
                      const auth = sub.authEntities[k]

                      const m3 = m2.authEntities.find(x => x.id === auth.id)

                      if (!m3) {
                        m2.authEntities.push(m3)
                      }
                    }
                  }
                }
              }
            }

            return res
          })

        return Promise.all([
          res,
          menus
        ])
      })
      .then(([user, menus]) => {
        commit(UPDATE_USER, user)
        commit(UPDATE_PERMISSIONS, sort(menus))

        latestSigninStorage.merge('type', user.roleBean.label)
      })
  },
  [SIGNOUT]: ({ commit, state }) => {
    return api.ILoginService.logOff({}).then(() => {
      const internal = state.user.roleBean.label === 'ADMIN'

      if (internal) {
        location.replace('./oa-login.html')
      } else {
        location.replace('./login.html')
      }
    })
  },
  [REFRESH_PERMISSIONS]: ({ commit, state }) => {
    return api.IUserService.getAuthList({
      roleId: state.user.roleBean.id
    }).then(res => {
      commit(UPDATE_PERMISSIONS, sort(res))
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
