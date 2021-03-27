import Vue from 'vue';
import App from './App.vue'
import router from './router' // 追加 1.
import store from './store/index'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')