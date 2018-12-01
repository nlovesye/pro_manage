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
            :key='item.id'
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
              :name="item.routerName"
            >
              <router-view class="page-router-view" :name="item.routerName" />
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
import routerData from '@/data/routerData.js'
import conf from '@/config/index.js'
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
      'setSiderbar'
    ]),
    init () {
      conf.openPage.forEach(name => {
        this.selectNav(name)
      })
    },
    /* token到期确定按钮事件 */
    timerOk () {
      this.$router.push('/login')
      this.modalTimeout = false
    },
    /* 顶部栏设置事件 */
    headerSetting (name) {
      if (name === 'logout') {
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('token')
        this.$router.push('/login')
      }
    },
    /* 导航菜单点击事件 */
    selectNav (name) {
      console.log('进入路由页面:', name)
      if (routerData[name]) {
        this.curPageName = routerData[name].name
        this.activeTab = name
        if (!this.openPages.some(item => item.path === routerData[name].path)) {
          this.openPages.push({
            ...routerData[name],
            routerName: name
          })
        } else {}
        this.$router.push(routerData[name])
      } else {
        this.activeTab = this.noFoundObj.routerName
        if (!this.openPages.some(item => item.path === this.noFoundObj.path)) {
          this.openPages.push(this.noFoundObj)
        } else {}
        this.$router.push(this.noFoundObj)
        console.log('开发中页面...')
      }
    },
    /* 收缩菜单 */
    doCollapse (flag) {
      // console.log(flag, this.base.siderbarWidth)
    },
    /* 关闭页面tab */
    tabClose (name) {
      let closeIndex = 0
      this.openPages = this.openPages.filter((item, index) => {
        closeIndex = item.routerName === name ? index - 1 : closeIndex
        return item.routerName !== name
      })
      if (this.activeTab === name && closeIndex > -1) {
        this.tabClick(this.openPages[closeIndex].routerName)
      }
    },
    /* 点击tab */
    tabClick (name) {
      if (this.activeTab !== name) {
        if (this.activeTab !== this.noFoundObj.routerName) {
          this.activeTab = name
          this.curPageName = this.noFoundObj.name
          this.$router.push(this.noFoundObj)
          return
        }
        this.activeTab = name
        this.activeMenu = name
        this.curPageName = routerData[name].name
        this.$router.push(routerData[name])
      }
    }
  },
  mounted () {
    // this.init()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {})
  }
}
</script>

<style lang="scss" src='./home.scss'></style>
