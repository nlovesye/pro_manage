export default {
  HOME: {
    HOME: () => import(/* webpackChunkName: "首页" */ '@/views/home/pages/index/Index.vue')
  },
  // COST_ITEM: {
  //   COST_ITEM: () => import(/* webpackChunkName: "费用项" */ '@/views/home/pages/basedata/costitem/Index.vue')
  // },
  TASK: {
    TASK: () => import(/* webpackChunkName: "任务" */ '@/views/home/pages/index/Index.vue')
  },
  SYSTEM_SET: {
    SYSTEM_SET: () => import(/* webpackChunkName: "系统设置" */ '@/views/home/pages/system/set/Index.vue')
  }
}
