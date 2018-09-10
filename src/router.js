import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/login'
import Index from './views/index'
Vue.use(VueRouter)

const dashboardRoutes = [
    {
        path: 'appVersion',
        component: () => import('./views/dashboard/appVersion')
    },

    {
        path: 'realTime',
        component: () => import('./views/dashboard/realTime')
    },

    {
        path: 'summary',
        component: () => import('./views/dashboard/summary')
    },

    {
        path: 'terminal',
        component: () => import('./views/dashboard/terminal')
    },

    {
        path: 'userActivity',
        component: () => import('./views/dashboard/userActivity')
    },

    {
        path: 'userRetention',
        component: () => import('./views/dashboard/userRetention')
    },
    {
        path: 'userCreate',
        component: () => import('./views/dashboard/userCreate')
    }
]
// 单图子路由
const graphRoutes = [
    {
        name: 'graphCharts',
        path: 'charts',
        component: () => import('./views/graph/charts')
    }, {
        name: 'graphFunnels',
        path: 'funnels',
        component: () => import('./views/graph/funnels')
    }, {
        name: 'graphRetention',
        path: 'retention',
        component: () => import('./views/graph/retention')
    }, {
        name: 'graphChannel',
        path: 'channel',
        component: () => import('./views/graph/channel')
    }, {
        name: 'graphCluster',
        path: 'cluster',
        component: () => import('./views/graph/cluster')
    }, {
        name: 'graphNew',
        path: 'new',
        component: () => import('./views/graph/newModel')
    }
]
const dimeventRoutes = [
    {
        name: 'CircleEvent',
        path: 'circle',
        component: () => import('./views/dimevent/circle')
    }, {
        name: 'TrackEvent',
        path: 'track',
        component: () => import('./views/dimevent/track')
    }, {
        name: 'CompositeEvent',
        path: 'composite',
        component: () => import('./views/dimevent/composite')
    }]
const pageRoutes = [
    {
        path: '/dashboard',
        component: () => import('./views/dashboard/index'),
        redirect: '/dashboard/summary',
        children: dashboardRoutes
    },

    {
        path: '/graph',
        component: () => import('./views/graph/index'),
        redirect: '/graph/charts',
        children: graphRoutes
    },

    {
        path: '/circle',
        component: () => import('./views/circle/index')
    },
    {
        path: '/insights',
        component: () => import('./views/user/insights')
    },
    {
        path: '/insightsDetail',
        component: () => import('./views/user/insightsDetail')
    },
    {
        path: '/segmentations',
        component: () => import('./views/user/segmentations')
    },
    {
        path: '/creatSegmentations',
        component: () => import('./views/user/createSeg')
    },
    {
        path: '/dimevent',
        component: () => import('./views/dimevent/index'),
        redirect: '/dimevent/circle',
        children: dimeventRoutes
    },
    {
        path: '/setting',
        component: () => import('./views/setting/setting')
    }
]

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login',
            meta: {notAllowBack: true}
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {notAllowBack: true}
        },
        {
            path: '',
            component: Index,
            children: pageRoutes
        }
    ]
})

router.beforeEach((to, from, next) => {
    //   给个默认值true
    if (to.meta.notAllowBack) {
        history.pushState(null, null, location.href)
    }
    if (to.matched.length === 0) {
        next('/dashboard/summary')
    } else {
        next()
    }
})

export default router
