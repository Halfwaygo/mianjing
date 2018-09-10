import {delCookie,getCookie,setCookie} from '../utils/util'
import Vue from "vue";
import VueRouter from "vue-router";

import pageHeader from "../components/pageHeader"
// import addCourse from "../components/addCourse"



Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/pageHeader',
            component: pageHeader,
            name:'pageHeader',
            meta: { requireAuth: true }
        },
    ]
});
//注册一个全局的before钩子

router.beforeEach((to, from, next) => {
   // if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (to.matched.length == 0) {
        next('/fontEnd');
    } else {
        next();
    }
});

// if (to.meta.requireAuth) {

// router.beforeEach((to, from, next) => {
//     if (to.matched.length == 0) {
//         next('/dataOverview');
//     } else {
//         next()
//     }
// });


export default router;
