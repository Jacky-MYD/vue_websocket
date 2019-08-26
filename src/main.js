import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import global from './utils/global.js'
import JsEncrypt from 'jsencrypt'

Vue.config.productionTip = false
Vue.prototype.$jsEncrypt = JsEncrypt

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
