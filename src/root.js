import Vue from 'vue'
import store from './store'
import router from './router'
import {sync} from 'vuex-router-sync'
import App from './App'
import ES6Promise from 'es6-promise'
import echarts from 'echarts'
import alerts from './constants/message'

Vue.prototype.$echarts = echarts
Vue.prototype.$alerts = alerts
ES6Promise.polyfill()

sync(store, router)

/* eslint-disable */
new Vue({
    el: '#root',
    store,
    router,
    render: h => h(App)
})
