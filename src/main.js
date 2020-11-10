// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from './store'
import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.prototype.$ajax=axios
Vue.prototype.$qs=qs
// Vue.prototype.$ajax.defaults.baseURL='http://172.18.2.168:1234'
// Vue.prototype.$ajax.defaults.baseURL='http://121.36.193.217:10022'
Vue.prototype.$ajax.defaults.baseURL='http://59.207.104.101:8006/'
Vue.prototype.$ajax.defaults.timeout = 5000
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
