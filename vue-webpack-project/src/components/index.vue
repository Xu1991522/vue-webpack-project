<template>
  <div id="app">
    <div class="header">
      <img class="title-logo" :src="logoimg" alt="">
      <div class="right-login-part" @click.stop="operationlistshow = !operationlistshow">
        <img class="guy-head" src="../assets/guy-head.png" alt="">
        <div class="accountnum">{{ user.loginName }}</div>
        <transition name="fold">
          <div class="operationlist" v-show="operationlistshow">
            <div class="operationitem" @click="$router.push('/account')">个人信息</div>
            <div class="operationitem" @click="logOff">退出登录</div>
          </div>
        </transition>
      </div>
    </div>
    <div class="container">
      <div class="aside nav__aside">
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="true" :default-active="defaultactive"
          background-color="#2e3c50" text-color="#fff">
          <div class="menu-top-collapse" @click="isCollapse = !isCollapse">
            <div :class="['menu-icon',isCollapse?'spread-icon':'return-icon']"></div>
          </div>
          <menu-item
            v-for="item in menus" :item="item" :key="item.sequence"
            style="display: inline-block; width: 100%"
            @click="changeTab"
            :collapse="isCollapse"
            :title-class="titleClasses[item.name]"
          ></menu-item>
        </el-menu>
      </div>
      <div class="main">
        <el-tabs v-model="activetab" type="border-card" @tab-remove="removeTab" @tab-click="tabturnrouter">
          <el-tab-pane v-for="(item, index) in openedtabs" :key="item.name" :label="item.title" :name="item.name" :closable="index!==0">
          </el-tab-pane>
          <router-view class="router__view" />
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'
import { routes } from '../router'
import flatten from '../helpers/flatten'

const MenuItem = {
  props: {
    collapse: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    titleClass: {
      type: String
    }
  },
  render () {
    const { collapse, item, titleClass } = this.$props
    const depth = item.subMenu.length

    if (depth === 0) {
      return (
        <el-menu-item index={item.sequence} onClick={() => this.$emit('click', item.name)}>
          <div class={'menu-icon' + (titleClass ? ' ' + titleClass : '')}></div>
          <template slot="title">
            <span>{item.name}</span>
          </template>
        </el-menu-item>
      )
    }

    return (
      <el-submenu index={item.sequence}>
        <template slot="title">
          <div class={'menu-icon' + (titleClass ? ' ' + titleClass : '')}></div>
          <span>{item.name}</span>
        </template>
        <el-menu-item-group>
          {collapse && <div class="item-inner-tile">{item.name}</div>}
          {item.subMenu.map(x =>
            <el-menu-item
              style="padding-left: 60px;"
              key={x.sequence} index={x.sequence}
              onClick={() => this.$emit('click', x.name)}
            >{x.name}</el-menu-item>
          )}
        </el-menu-item-group>
      </el-submenu>
    )
  }
}

const { titleToPathMap, pathToTitleMap } =
  routes.find(x => x.path === '/').children
    .reduce((acc, route) => {
      if (!route.meta) {
        return acc
      }

      const { path, meta: { name: title } } = route

      return {
        titleToPathMap: { ...acc.titleToPathMap, [title]: '/' + path },
        pathToTitleMap: { ...acc.pathToTitleMap, ['/' + path]: title }
      }
    }, {})

export default {
  name: 'app',
  data () {
    return {
      activetab: '1',
      logoimg: './static/title-logo.png',
      defaultactive: '',
      openedtabs: [
        {
          title: '总览',
          name: '1',
          path: '/home'
        }
      ],
      isCollapse: false,
      operationlistshow: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    menus () {
      // traverse menus to el-menu props
      const traverse = (menus, parentId) =>
        menus.reduce((acc, item) => {
          const currenIndex = (parentId ? parentId + '-' : '') + item.sequence

          return [
            ...acc,
            {
              name: item.name,
              sequence: currenIndex,
              subMenu: item.subMenu
                ? traverse(item.subMenu, currenIndex)
                : []
            }
          ]
        }, [])

      return traverse(this.$store.getters.permissions)
    },
    titleClasses () {
      return {
        '合作方管理': 'cop-icon',
        '运营管理': 'operate-icon',
        '记录管理': 'record-icon',
        '系统管理': 'system-icon',
        '短信管理': 'sms-icon',
        '客户管理': 'sms-icon',
        '账户管理': 'business-icon'
      }
    }
  },
  methods: {
    // 退出登录
    logOff () {
      this.$store.dispatch('SIGNOUT')
    },
    getLogoUrl (domain) {
      api.IHomeLogoManager.getLogoUrl({
        url: domain
      }).then(res => {
        if (res === 'appmedia') {
          this.logoimg = './static/appmedia-title.png'
        } else {
          this.logoimg = res
        }
      })
    },
    changeTab (name) {
      this.$router.push(titleToPathMap[name])
    },
    findMenuByPath (path) {
      const name = pathToTitleMap[path]

      return this.menus.find(x => x.name === name) || flatten(this.menus.map(x => x.subMenu)).find(x => x.name === name)
    },
    showoperatio () {
      this.operationlistshow = !this.operationlistshow
    },
    removeTab (targetName) {
      let tabs = this.openedtabs

      const index = tabs.findIndex(x => x.name === targetName)

      this.openedtabs = tabs.filter(x => x.name !== targetName)

      if (targetName === this.activetab) {
        // [1, 2, 3 √] -> [1, 2 √]
        // [1, 2 √, 3] -> [1, 3 √]
        this.$router.push({ path: this.openedtabs[index === tabs.length - 1 ? index - 1 : index].path })
      }
    },
    tabturnrouter (tab) {
      this.$router.push({ path: this.openedtabs[tab.index].path })
    }
  },
  created () {
    const domain = document.domain

    if (domain !== 'iot-cust.combmobile.com' &&
      domain !== 'iot.aetest.bwae.org' &&
      domain !== 'iot.bwae.org' &&
      domain !== 'localhost'
    ) {
      if (domain === 'appmedia.com') {
        this.logoimg = './static/appmedia-title.png'
      } else {
        this.getLogoUrl(domain)
      }
    }
  },
  mounted () {
    this.operate$ = () => {
      this.operationlistshow = false
    }

    document.addEventListener('click', this.operate$)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.operate$)

    this.operate$ = null
  },
  watch: {
    '$route.path': {
      handler (path) {
        // eval hack
        // match a nest path
        // case: /agentManage/agentOperation -> /agentManage
        path = '/' + path.slice(1).split('/')[0]

        const title = pathToTitleMap[path]

        if (!title) {
          throw Error('title was not found that matched to path ' + path)
        }

        const tab = this.openedtabs.find(item => item.path === path)

        if (tab) {
          this.activetab = tab.name
        } else {
          // get next tab name
          const newTabName = (Math.max(...this.openedtabs.map(x => +x.name)) + 1) + ''

          this.openedtabs.push({
            title,
            name: newTabName,
            content: '',
            path
          })

          this.activetab = newTabName
        }

        const menu = this.findMenuByPath(path)

        this.defaultactive = menu ? menu.sequence : 'UNEXISTS_MENU_SEQUENCE'
      },
      immediate: true
    }
  },
  components: {
    MenuItem
  }
}
</script>

<style lang="scss">
.nav__aside {
  height: 100%;
  float: left;
  margin-right: 20px;
  overflow: auto;

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }

  .el-menu {
    height: 100%;
    font-size: 0;
  }

  .menu-icon {
    width: 20px;
    height: 100%;
    display: inline-block;
    margin-right: 20px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 20px 20px;
  }

  .spread-icon {
    background-image: url('../assets/spread.png');
    background-size: 23px 23px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .return-icon {
    background-image: url('../assets/return.png');
    background-size: 23px 23px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .cop-icon {
    background-image: url('../assets/cop-wh.png');
  }

  .el-menu--vertical:hover li.cop-icon {
    background-image: url('../assets/cop-bl.png');
  }

  .el-submenu:hover .cop-icon {
    background-image: url('../assets/cop-bl.png');
  }

  .operate-icon {
    background-image: url('../assets/operate-wh.png');
  }

  .el-submenu:hover .operate-icon {
    background-image: url('../assets/operate-bl.png');
  }

  .system-icon {
    background-image: url('../assets/system-wh.png');
  }

  .el-submenu:hover .system-icon {
    background-image: url('../assets/system-bl.png');
  }

  .record-icon {
    background-image: url('../assets/record-wh.png');
  }

  .el-submenu:hover .record-icon {
    background-image: url('../assets/record-bl.png');
  }

  .sms-icon {
    background-image: url('../assets/sms-wh.png');
  }

  .el-submenu:hover .sms-icon {
    background-image: url('../assets/sms-bl.png');
  }
  .business-icon {
    background-image: url('../assets/business-wh.png');
  }

  .el-submenu:hover .business-icon {
    background-image: url('../assets/business-bl.png');
  }
}

.item-inner-tile {
  padding: 7px 0 7px 60px;
  line-height: normal;
  font-size: 12px;
  color: #909399;
}
</style>

<style scoped>
.header {
  height: 70px;
  width: 100%;
  background: #2e3c50;
  position: relative;
  z-index: 99;
}

.menu-top-collapse {
  width: 100%;
  height: 40px;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;
  line-height: 40px;
  color: #fff;
  position: relative;
  background: #405065;
}

.container {
  width: 100%;
  margin: 0 auto;
  height: calc(100vh - 70px);
}

.main {
  height: calc(100% - 20px);
  overflow: hidden;
  padding-top: 20px;
  margin-right: 20px;
}

.allview-text-show {
  position: absolute;
  left: 60px;
  font-size: 15px;
  opacity: 1;
  transition: all 2s;
}

.allview-text-fade {
  position: absolute;
  left: 60px;
  font-size: 15px;
  opacity: 0;
  transition: all 2s;
}

.title-logo {
  position: absolute;
  top: 50%;
  left: 25px;
  transform: translate(0, -50%);
  width: 152px;
  height: 34px;
}

.right-login-part {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  height: 32px;
  width: 180px;
  cursor: pointer;
  user-select: none;

  line-height: 32px;
}

.guy-head {
  width: 27px;
  height: 27px;
  display: inline-block;
  vertical-align: middle;
  height: 26px;
}

.accountnum {
  display: inline-block;
  vertical-align: middle;

  color: #038ae3;
  font-size: 14px;
  margin-left: 5px;
}

.auth-radio {
  position: absolute;
  top: 19px;
  left: 33px;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  word-break: keep-all;
  font-size: 10px;
}
.operationlist {
  position: absolute;
  top: 45px;
  left: -50px;
  width: 135px;
  background: #fff;
  border: 1px solid #dadada;
  box-shadow: 0 0 3px #dadada;
}
.operationitem {
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  width: 100%;
  border-bottom: 1px solid #efefef;
  padding: 8px 0;
  line-height: 1.5;
}
.operationitem:hover {
  background: #efefef;
}
::-webkit-scrollbar {
  display: none;
}
.fold-enter-active {
  animation-name: fold-in;
  animation-duration: 0.5s;
}
.fold-leave-active {
  animation-name: fold-out;
  animation-duration: 0.5s;
}
@keyframes fold-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fold-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* case: .el-tabs__content padding: 15px */
.router__view {
  overflow: auto;
  margin: -15px;
  padding: 15px;
  height: 80vh;
}
</style>
