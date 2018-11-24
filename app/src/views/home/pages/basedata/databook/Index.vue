<template>
  <div class="page-basedata-databook">
    <div class="left-menu">
      <Menu
        theme="light"
        class="menu-container"
        :accordion="true"
        width="220px"
        @on-select="selectNav"
      >
        <Submenu
          :name="nav.code"
          v-for="nav in menuList"
          :key="nav.id"
        >
          <template slot="title">
            <Icon type="ios-paper" />
            {{nav.name}}
          </template>
          <menu-item
            v-for="item in nav.children"
            :key="item.id"
            :name="item.code"
            v-text="item.name"
          ></menu-item>
        </Submenu>
      </Menu>
    </div>
    <div class="right-content">
      <Table
        border
        ref="selection"
        :columns="bookColumns"
        :data="bookData"
        width='500px'
        :loading="tbLoading"
        height="740"
      >
      </Table>
    </div>
  </div>
</template>

<script>
import {
  Menu,
  Submenu,
  MenuItem,
  Icon,
  Table
} from 'iview'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      menuList: [],
      bookColumns: [
        {
          type: 'selection',
          fixed: 'left',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          fixed: 'left',
          width: 80,
          align: 'center',
          title: '序号'
        },
        {
          title: '值',
          key: 'title',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true,
          minWidth: 150
        },
        {
          title: '状态',
          key: 'status',
          ellipsis: true,
          minWidth: 150,
          render: (h, params) => {
            let { row } = params
            return h('span', `${row.status === 0 ? '已启用' : '禁用'}`)
          }
        },
        {
          className: 'action',
          title: '操作',
          fixed: 'right',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                class: 'btn',
                on: {
                  click: () => {
                    // this.show(params.index)
                  }
                }
              }, '编辑'),
              h('span', {
                class: 'btn',
                on: {
                  click: () => {
                    // this.remove(params.index)
                  }
                }
              }, '禁用')
            ])
          }
        }
      ],
      bookData: [],
      tbLoading: false
    }
  },
  components: {
    Menu,
    Submenu,
    MenuItem,
    Icon,
    Table
  },
  computed: {
    ...mapState([
      'base'
    ])
  },
  methods: {
    /* 初始化数据字典菜单数据 */
    initMenuList () {
      const codeName = 'WORD_BOOK_NAV'
      let wordBookNav = this.getDatabook([...this.base.navs], codeName, null)
      this.menuList = [...wordBookNav.children]
    },
    /* 获取数据字典数据 */
    getDatabook (arr, codeName, result) {
      if (!result) {
        arr.forEach(item => {
          if (item.children && item.children.length) {
            result = this.getDatabook(item.children, codeName, result)
          }
          if (item.code === codeName) {
            result = { ...item }
          }
        })
      }
      return result
    },
    /* 获取字典数据 */
    async getDatabookItems (url) {
      this.tbLoading = true
      try {
        let res = await this.oAxios.get(`/common/dictionary/${url}`)
        this.bookData = [...res]
        this.tbLoading = false
      } catch (err) {
        this.tbLoading = false
      }
    },
    /* 左侧菜单选中事件 */
    selectNav (name) {
      let target = this.getDatabook(this.menuList, name, null)
      this.getDatabookItems(target.url)
      console.log(target)
    }
  },
  mounted () {
    this.initMenuList()
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
