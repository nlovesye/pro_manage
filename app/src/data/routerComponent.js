export default {
  HOME: {
    HOME: () => import(/* webpackChunkName: "首页" */ '@/views/home/pages/index/Index.vue')
  },
  TEST: {
    TEST: () => import(/* webpackChunkName: "测试" */ '@/views/home/pages/test/Index.vue')
  },
  TASK: {
    TASK: () => import(/* webpackChunkName: "任务" */ '@/views/home/pages/task/Index.vue')
  },
  ACHIEVEMENT: {
    ACHIEVEMENT: () => import(/* webpackChunkName: "成就管理" */ '@/views/home/pages/achievement/Index.vue')
  },
  MENU_SET: {
    MENU_SET: () => import(/* webpackChunkName: "系统设置" */ '@/views/home/pages/system/set/Index.vue')
  }
}
