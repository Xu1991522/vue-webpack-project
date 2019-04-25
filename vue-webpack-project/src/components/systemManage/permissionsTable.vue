<template>
  <el-table
    :data="data"
    :span-method="colspan"
    border
    style="width: 100%"
  >
    <el-table-column label="一级菜单" width="240" align="left">
      <template slot-scope="scope">
        <div class="content-rowspan">
          <el-checkbox
            v-if="configurable"
            :value="!!selected[scope.row.parent.label]"
            @change="checked => select(scope.row.parent, checked)"
          >
            {{ scope.row.parent.name }}
          </el-checkbox>
          <span v-else>{{ scope.row.parent.name }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="二级菜单" align="left" width="240">
      <template slot-scope="scope">
        <div class="content-rowspan">
          <el-checkbox
            v-if="configurable && !scope.row.empty"
            :value="!!selected[scope.row.label]"
            @change="checked => select(scope.row, checked)"
          >
            {{ scope.row.name }}
          </el-checkbox>
          <span v-else>{{ scope.row.empty ? '无' : scope.row.name }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="功能模块" align="left">
      <template slot-scope="scope">
        <div v-if="!scope.row.empty && scope.row.children.filter(x => x.category !== '4').length" class="content-rowspan">
          <div v-if="configurable">
            <el-checkbox
              v-for="child in scope.row.children.filter(x => x.category !== '4')"
              :key="child.id"
              :value="!!selected[child.label]"
              @change="checked => select(child, checked)"
            >
              {{ child.name }}
            </el-checkbox>
          </div>
          <span v-else>{{ scope.row.children.filter(x => x.category !== '4').map(x => x.name).join('、') }}</span>
        </div>
        <div v-else class="content-rowspan">无</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  /*
    render, colspan according to menus of level 2
    notice: auto check, uncheck search permissions(whose category were '4')
  */

  import flatten from '../../helpers/flatten'

  // transform: menus -> tree
  const transform = menus => {
    const res = []

    for (let menu of menus) {
      const parent = { parent: '', id: menu.id, name: menu.name, label: 1 + '-' + menu.id, children: [] }

      for (let sub of menu.subMenu) {
        const item = { parent, id: sub.id, name: sub.name, label: 2 + '-' + sub.id, children: [] }

        for (let entiny of sub.authEntities) {
          item.children.push({ parent: item, id: entiny.id, name: entiny.name, label: 3 + '-' + entiny.id, category: entiny.category, children: [] })
        }

        parent.children.push(item)
      }

      // eval hack
      // fill children by an empty node with an empty flag
      // nodes at level 2 were requied when render, calculate colspan
      if (!menu.subMenu.length) {
        parent.children.push({ parent, empty: true })
      }

      res.push(parent)
    }

    return res
  }

  // traverse: menus -> selected map
  const traverse = menus => {
    const map = {}

    for (let menu of menus) {
      map[1 + '-' + menu.id] = true

      for (let sub of (menu.subMenu || [])) {
        map[2 + '-' + sub.id] = true

        for (let entiny of (sub.authEntities || [])) {
          map[3 + '-' + entiny.id] = true
        }
      }
    }

    return map
  }

  // select: (node, old selected map, checked) -> new selected map
  const select = (node, map, checked) => {
    const res = {}

    const reset = node => {
      if (node.empty) {
        return
      }

      res[node.label] = false

      node.children.forEach(reset)
    }

    const add = node => {
      res[node.label] = true

      node.parent && add(node.parent)
    }

    if (!checked) {
      reset(node)
    } else {
      add(node)
    }

    return {
      ...map,
      ...res
    }
  }

  // collect: (nodes, selected map) => menus
  const collect = (nodes, map) => {
    const menus = []

    nodes.forEach(x => {
      if (map[x.label]) {
        const menu = { id: x.id, subMenu: [], authEntities: [] }

        menus.push(menu)

        x.children.forEach(y => {
          if (map[y.label]) {
            const sub = { id: y.id, subMenu: [], authEntities: [] }

            menu.subMenu.push(sub)

            y.children.forEach(z => {
              if (map[z.label]) {
                sub.authEntities.push({ id: z.id, menu_id: sub.id })
              }
            })
          }
        })
      }
    })

    return menus
  }

  export default {
    name: '',
    props: {
      permissions: {
        type: Array,
        required: true
      },
      granted: {
        type: Array,
        required: true
      },
      configurable: {
        props: Boolean,
        default: false
      }
    },
    data () {
      return {
        nodes: [],
        selected: {}
      }
    },
    computed: {
      data () {
        return flatten(this.nodes.map(x => x.children))
      },
      colspan () {
        // every range was the parents's children length
        const last = arr => arr[arr.length - 1]

        const { res, range } = this.nodes.reduce(({ res, range }, node) => {
          const count = node.children.length

          return { res: [...res, count], range: [...range, last(range) + count] }
        }, { res: [], range: [0] })

        return ({ row, column, rowIndex, columnIndex }) => {
          if (columnIndex === 0) {
            const index = range.indexOf(rowIndex)

            if (index > -1) {
              return {
                rowspan: res[index],
                colspan: 1
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
    methods: {
      setup () {
        const sort = xs => xs.sort((a, b) => a.sequence < b.sequence ? -1 : 1)

        this.nodes = transform(sort(this.permissions.map(x => {
          return {
            ...x,
            subMenu: sort((x.subMenu || []).map(x => {
              return {
                ...x,
                authEntities: sort(x.authEntities || [])
              }
            }))
          }
        })))

        this.selected = traverse(this.granted)

        this.$emit('change', collect(this.nodes, this.selected))
      },
      select (node, checked) {
        let map = select(node, this.selected, checked)

        let temp = []

        // case level 1 checked
        if (node.label.match(/^1-/) && checked) {
          // auto select level 2 under it
          node.children.forEach(child => {
            if (child.empty) {
              return
            }

            map = select(child, map, checked)

            // when level 2 was auto selected, check searching permissions under it
            temp.push(child)
          })
        }

        // case level 2 was selected
        if (!node.empty && node.label.match(/^2-/) && checked) {
          temp.push(node)
        }

        // case level 3 was selected
        if (node.label.match(/^3-/) && checked) {
          temp.push(node.parent)
        }

        // if level 2 was checked, auto select level 3 of searching permission (category = '4') under it
        temp.forEach(node => {
          node.children.forEach(child => {
            if (child.category === '4') {
              map = select(child, map, checked)
            }
          })
        })

        this.selected = map
      }
    },
    created () {
      this.setup()
    },
    watch: {
      permissions () {
        this.setup()
      },
      granted () {
        this.setup()
      },
      selected (val) {
        this.$emit('change', collect(this.nodes, val))
      }
    }
  }
</script>
