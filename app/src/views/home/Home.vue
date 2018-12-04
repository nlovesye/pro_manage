<template>
  <Layout class="page-home">
    <Modal
      v-model='modalTimeout'
      title="token信息"
      :loading='modalLoading'
      @on-ok='timerOk'
      :mask-closable='false'
    >
      <p>token 过期了，请重新登录</p>
    </Modal>
    <Header class="home-header">
      <Menu mode="horizontal" theme="dark" active-name="1">
        <div class="layout-logo">
          <img src="@/assets/logo.png" alt="">
        </div>
        <div class="layout-nav">
          <Dropdown
            trigger='click'
            placement="bottom-end"
            @on-click="headerSetting"
          >
            <a href="javascript:void(0)">
              {{base.userName || '游客'}}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name='logout'>注销</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Menu>
    </Header>
    <Layout class="home-container">
      <Sider
        class="home-sider"
        :hide-trigger='false'
        v-model="base.isCollepsed"
        :collapsible='true'
        :collapsed-width="0"
        :width='base.siderbarWidth'
        @on-collapse="doCollapse"
      >
        <Menu
          :active-name="activeMenu"
          theme="dark"
          width="auto"
          :accordion='true'
          :open-names="['1']"
          @on-select='selectNav'
        >
          <TreeItem
            v-for='item in base.navs'
            :key='item.key'
            :node='item'
          />
        </Menu>
      </Sider>
      <Layout :class="['home-content', base.isCollepsed ? 'siderclose' : 'sideropen']">
        <Breadcrumb class="content-head">
          <BreadcrumbItem>nloves</BreadcrumbItem>
          <BreadcrumbItem>{{curPageName}}</BreadcrumbItem>
        </Breadcrumb>
        <Content class="content-area">
          <Tabs
            class="root-ivu-tabs"
            v-if="openPages.length"
            type="card"
            closable
            animated
            :value="activeTab"
            @on-click="tabClick"
            @on-tab-remove="tabClose"
          >
            <TabPane
              class="root-ivu-tabpane"
              :label="item.name"
              v-for="item in openPages"
              :key="item.path"
              :name="item.key"
            >
              <router-view class="page-router-view" :name="item.key" />
            </TabPane>
          </Tabs>
          <div v-else>hello</div>
        </Content>
      </Layout>
    </Layout>
    <Footer class="home-footer">2018-2019 &copy; nlovesye</Footer>
  </Layout>
</template>

<script>
import {
  Layout,
  Header,
  Footer,
  Sider,
  Menu,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Modal,
  Tabs,
  TabPane
} from 'iview'
import { mapState, mapActions } from 'vuex'
import TreeItem from './TreeItem'
export default {
  name: 'home',
  components: {
    Layout,
    Header,
    Footer,
    Sider,
    Menu,
    Content,
    Breadcrumb,
    BreadcrumbItem,
    Icon,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Modal,
    TreeItem,
    Tabs,
    TabPane
  },
  data () {
    return {
      modalTimeout: false,
      modalLoading: true,
      curPageName: '',
      activeMenu: 'HOME',
      openPages: [],
      activeTab: '',
      noFoundObj: {
        path: '/home/404',
        name: 'nofound',
        routerName: '404'
      }
    }
  },
  computed: {
    ...mapState([
      'base'
    ])
  },
  methods: {
    ...mapActions([
      'setSiderbar',
      'logout',
      'setRouter'
    ]),
    init () {
      console.log('init', this.$route)
      let path = this.$route.path.split('/')
      let key = path[path.length - 1]
      let name = this.$route.name
      this.selectNav(key, name)
    },
    /* token到期确定按钮事件 */
    timerOk () {
      this.$router.push('/login')
      this.modalTimeout = false
    },
    /* 顶部栏设置事件 */
    async headerSetting (name) {
      if (name === 'logout') {
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('routers')
        window.localStorage.removeItem('navs')
        await this.logout()
        this.$router.push('/login')
      }
    },
    /* 导航菜单点击事件 */
    selectNav (routerKey = '', name = '') {
      console.log('进入路由页面:', routerKey || name, this.base.navs)
      let target = this.getRouterObj(this.base.navs, 'key', routerKey) || this.getRouterObj(this.base.navs, 'name', name)
      if (!target) {
        console.log('未找到路由')
        return false
      }
      this.curPageName = target.name
      this.activeTab = routerKey
      if (!this.openPages.some(item => item.key === target.key)) {
        this.openPages.push(target)
      } else {}
      this.$router.push({
        path: target.path,
        name: target.name
      })
    },
    // 寻找对应路由
    getRouterObj (arr = [], keyName, keyVal, rt = null) {
      arr.forEach(item => {
        if (item.children && item.children.length && !rt) {
          rt = this.getRouterObj(item.children, keyName, keyVal, rt)
        }
        if (item[keyName] === keyVal) {
          rt = rt || item
        }
      })
      return rt
    },
    /* 收缩菜单 */
    doCollapse (flag) {
      // console.log(flag, this.base.siderbarWidth)
    },
    /* 关闭页面tab */
    tabClose (routerKey) {
      let closeIndex = 0
      this.openPages = this.openPages.filter((item, index) => {
        closeIndex = item.key === routerKey ? index - 1 : closeIndex
        return item.key !== routerKey
      })
      if (this.activeTab === routerKey && closeIndex > -1) {
        this.tabClick(this.openPages[closeIndex].key)
      }
    },
    /* 点击tab */
    tabClick (routerKey) {
      if (this.activeTab !== name) {
        let target = this.getRouterObj(this.base.navs, 'key', routerKey)
        this.activeTab = routerKey
        this.activeMenu = routerKey
        this.curPageName = target.name
        this.$router.push({
          path: target.path,
          name: target.name
        })
      }
    }
  },
  mounted () {
    this.init()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {})
  }
}
</script>

<style lang="scss" src='./home.scss'></style>
