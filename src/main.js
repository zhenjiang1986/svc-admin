import Vue from 'vue'
import App from './App.vue'
import Cookies from 'js-cookie'
import {Log} from '@/utils/log'

import 'normalize.css/normalize.css' //a modern alternative to CSS resets

import Element from 'element-ui'

import '@/styles/element-variables.scss'

import '@/styles/index.scss'

import store from './store'
import router from './router'

Log.level = Log.DEBUG

Log.logger = console

import './icons' // icon
import './routeGuard' // route guard control

Vue.use(Element,{
size:Cookies.get('size') || 'medium'
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
