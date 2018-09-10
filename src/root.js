import Vue from "vue";
import store from "./store";
import router from "./router/index";
import {sync} from "vuex-router-sync";
import App from './App';
//import a from './num.js'
// console.log(a)
sync(store, router);
import {eventBus,num} from './eventBus.js'
new Vue({
    el:'#root',
    store,
    router,
    render: h => h(App)
    /*render:function(h){
    	return h(App)
    }	*/
});

