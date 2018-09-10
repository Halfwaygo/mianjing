import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.config.devtools = __DEV__

!__DEV__ &&
    (Vue.config.errorHandler = function(err, vm) {
        vm.$store.dispatch('hidePageLoading')
        console.error(err.message)
    })

// 自动引入actions下的js文件，将文件的各个对象合并为一个大对象
const actionContext = require.context('../actions', false, /.*\.js/)
const actions = actionContext
    .keys()
    .reduce((prev, cur) => ({ ...prev, ...actionContext(cur).default }), {})

// 自动引入mutation文件下的js文件，以文件名字作为对象的key
const mutationContext = require.context('../mutations', false, /.*\.js/)
const modules = mutationContext.keys().reduce((prev, cur) => {
    const key = cur.match(/(\w+)\.js/)[1]
    prev[key] = mutationContext(cur).default
    return prev
}, {})

export default new Vuex.Store({
    actions,
    modules,
    strict: false
})
