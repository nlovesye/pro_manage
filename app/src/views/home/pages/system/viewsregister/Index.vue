<template>
  <div class="page-system-viewsregister">
    <Tree
      class="menu-tree"
      :data="treeList"
      :render="renderTree"
    ></Tree>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  Tree
} from 'iview'
export default {
  data () {
    return {
      treeList: [
        {
          id: -1,
          name: 'FRD',
          depth: -1,
          children: []
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'base'
    ])
  },
  components: {
    Tree
  },
  methods: {
    async getTreeList () {
      try {
        let resp = await this.oAxios.get('/account/permission/list')
        this.treeList[0].children = resp.data
      } catch (err) {
        this.treeList[0].children = []
      }
    },
    /* tree渲染 */
    renderTree (h, { root, node, data }) {
      const showAdd = data.type !== 'view'
      const showRemove = data.id !== -1 && data.type !== 'view'
      return h('span', {
        style: {
          display: 'inline-block',
          padding: '4px 8px',
          width: '100%'
        }
      }, [
        h('span', {
          style: {
            // marginRight: '20px'
          }
        }, data.name),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            padding: '0 4px'
          }
        }, [
          showAdd ? h('Button', {
            props: {
              type: 'default',
              size: 'small',
              icon: 'ios-add'
            },
            on: {
              click: () => {
                this.addLevel(data)
              }
            }
          }) : null,
          showRemove ? h('Button', {
            style: {
              marginLeft: '8px'
            },
            props: {
              type: 'default',
              size: 'small',
              icon: 'ios-remove'
            },
            on: {
              click: () => {
                this.removeLevel(root, node, data)
              }
            }
          }) : null
        ])
      ])
    },
    /* 添加 */
    addLevel (data) {
      console.log('add', data)
    },
    /* 删除 */
    removeLevel (root, node, data) {
      console.log('remove', root, node, data)
    },
    init () {
      this.getTreeList()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
