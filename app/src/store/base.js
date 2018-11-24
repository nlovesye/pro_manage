let navs = window.localStorage.getItem('navs') || '[]'
try {
  navs = JSON.parse(navs)
} catch (err) {
  navs = []
}

export default {
  state: {
    userName: window.localStorage.getItem('username') || '游客',
    navs,
    siderbarWidth: 260,
    isCollepsed: false
  },
  mutations: {
    initNavs (state, navs) {
      state.navs = navs
    },
    setSiderbar (state, width) {
      state.siderbarWidth = width
    }
  },
  actions: {
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
