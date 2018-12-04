import routerComponent from '@/data/routerComponent'

let navs = window.localStorage.getItem('navs') || '[]'
// 默认路由
let routers = window.localStorage.getItem('routers') || '[]'
try {
  routers = JSON.parse(routers)
  navs = JSON.parse(navs)
} catch (err) {
  routers = []
  navs = []
}

// 设置路由组件
const setComponents = (arr) => arr.map(item => {
  item.components = routerComponent[item.key]
  return item
})

export default {
  state: {
    userName: window.localStorage.getItem('username') || '游客',
    navs,
    siderbarWidth: 260,
    isCollepsed: false,
    routers
  },
  mutations: {
    setLogin (state, username) {
      state.userName = username
    },
    setRouter (state, payload) {
      let rts = payload.routers.sort((a, b) => a.sort - b.sort)
      let navs = [payload._.$router.options.routes[1].children[0], ...rts]
      // 将二级菜单提出home级路由
      let dealRouters = rts.reduce((rt, cur) => {
        if (cur.children && cur.children.length) {
          return [...rt, ...cur.children]
        } else {
          return [...rt, cur]
        }
      }, [])
      dealRouters = setComponents(dealRouters)
      dealRouters.forEach(r => {
        payload._.$router.options.routes[1].children.push(r)
      })
      payload._.$router.addRoutes(payload._.$router.options.routes)
      window.localStorage.setItem('routers', JSON.stringify(rts))
      window.localStorage.setItem('navs', JSON.stringify(navs))
      state.routers = [...rts]
      state.navs = navs
    },
    logout (state, payload) {
      state.userName = '游客'
      state.navs = []
      state.routers = []
    },
    initNavs (state, navs) {
      state.navs = navs
    },
    setSiderbar (state, width) {
      state.siderbarWidth = width
    }
  },
  actions: {
    async loginSucess ({ commit }, payload = {}) {
      // console.log('loginSuccess', payload)
      commit('setLogin', payload.res.username)
    },
    async setRouter ({ commit }, payload = {}) {
      commit('setRouter', payload)
    },
    // 退出登录
    async logout ({ commit }, payload = null) {
      commit('logout', payload)
    },
    initNavs ({ commit }, navs) {
      commit('initNavs', navs)
    },
    setSiderbar ({ commit }, width) {
      commit('setSiderbar', width)
    },
    /* 根据 name 获取数据字典项 */
    findBook ({ state }, title) {
      const getBookData = (arr, target, key, result) => {
        if (!result) {
          arr.forEach(item => {
            if (item.children && item.children.length) {
              result = getBookData(item.children, target, key, result)
            }
            if (item[key] === target) {
              result = { ...item
              }
            }
          })
        }
        return result
      }
      let rt = getBookData(state.navs, title, 'name', null)
      return rt
    },
    /* 获取数据对应项字典列表数据 */
    async getBookList ({ dispatch }, payload) {
      let book = await dispatch('findBook', payload.target)
      let res = await payload.oAxios.get(`/common/dictionary/${book.url}`)
      let rt = res || []
      return rt
    }
  }
}
