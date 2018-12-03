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
          key: 'HOME',
          path: '',
          name: '首页',
          components: {
            HOME: () => import(/* webpackChunkName: "首页" */ '@/views/home/pages/index/Index.vue')
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/Login.vue')
    }
  ]
})
