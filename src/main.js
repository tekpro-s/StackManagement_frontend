import Vue from 'vue';
import App from './App.vue'
import router from './router' // 追加 1.
import store from './store/index'
import 'bootstrap/dist/css/bootstrap.css' // add
import 'bootstrap-vue/dist/bootstrap-vue.css' // add
import Toasted from 'vue-toasted';
 
Vue.use(Toasted);

/* ここから */
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)
/* ここまで */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')