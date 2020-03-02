import Vue from 'vue'
import App from './App.vue'
import axios from  'axios';
import VueAxios from 'vue-axios';
import router from './router'
import vuetify from './plugins/vuetify';
import {store} from './store/index'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
import SweetAlertIcons from 'vue-sweetalert-icons';
Vue.use(SweetAlertIcons);

Vue.config.productionTip = false
Vue.use(VueAxios,axios);
Vue.use(Vuelidate);
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(BootstrapVue)

new Vue({
  router,
  SweetAlertIcons,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
