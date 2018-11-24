import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'iview/dist/styles/iview.css'
import './public.scss'
import http from './http/index'
import {
  Message,
  Poptip,
  Button
} from 'iview'

Vue.config.productionTip = false
Vue.prototype.oAxios = http
Vue.prototype.expiresTimer = null
Vue.prototype.$Message = Message
Vue.component('Poptip', Poptip)
Vue.component('Button', Button)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
