import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '',
          name: '首页',
          components: {
            HOME: () => import(/* webpackChunkName: "首页" */ '@/views/home/pages/index/Index.vue')
          }
        },
        {
          path: 'test',
          name: '测试',
          components: {
            TEST: () => import(/* webpackChunkName: "测试" */ '@/views/home/pages/test/Index.vue')
          }
        },
        {
          path: '404',
          name: 'nofound',
          components: {
            404: () => import(/* webpackChunkName: "404" */ '@/views/home/pages/layout/404.vue')
          }
        }
      //   {
      //     path: 'basedata_address',
      //     name: '地址档案',
      //     components: {
      //       ADDRESS_FILE: () => import(/* webpackChunkName: "地址档案" */ './pages/basedata/address/Index.vue')
      //     }
      //   },
      //   {
      //     path: 'basedata_cartype',
      //     name: '车型管理',
      //     components: {
      //       BASIC_DATA_CAR_TYPE: () => import(/* webpackChunkName: "车型管理" */ './pages/basedata/cartype/Index.vue')
      //     }
      //   },
      //   {
      //     path: 'basedata_costitem',
      //     name: '费用项目',
      //     components: {
      //       BASIC_DATA_COST_ITEM: () => import(/* webpackChunkName: "费用项目" */ './pages/basedata/costitem/Index.vue')
      //     }
      //   },
      //   {
      //     path: 'basedata_legalperson',
      //     name: '公司法人',
      //     components: {
      //       LEGAL_PERSON_LIST: () => import(/* webpackChunkName: "公司法人" */ './pages/basedata/legalperson/Index.vue')
      //     }
      //   },
      //   {
      //     path: 'basedata_unitconfig',
      //     name: '单位配置',
      //     components: {
      //       BASIC_DATA_UNIT_CONFIG: () => import(/* webpackChunkName: "单位配置" */ './pages/basedata/unitconfig/Index.vue')
      //     }
      //   },
      //   {
      //     path: 'basedata_databook',
      //     name: '数据字典',
      //     components: {
      //       WORD_BOOK: () => import(/* webpackChunkName: "数据字典" */ './pages/basedata/databook/Index.vue')
      //     }
      //   },
      //   {
      //     path: 'partner_customerinfo',
      //     name: '客户资料',
      //     components: {
      //       CLIENT_SOURCE: () => import(/* webpackChunkName: "客户资料" */ './pages/partner/customerinfo/Index.vue')
      //     }
      //   },
      //   {
      //     path: 'system_viewsregister',
      //     name: '视图注册',
      //     components: {
      //       POWER_REGISTERED: () => import(/* webpackChunkName: "视图注册" */ './pages/system/viewsregister/Index.vue')
      //     }
      //   }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/Login.vue')
    }
  ]
})
