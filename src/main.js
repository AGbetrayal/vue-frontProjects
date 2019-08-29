import Vue from 'vue'
import App from './App'
import router from './router'
import request from '../src/request'

Vue.config.productionTip = false
Vue.prototype.$request = request

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
