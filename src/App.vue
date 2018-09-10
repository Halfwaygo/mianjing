<template>
    <div class="page-wrapper">
        <loading-indicator :showing="pageLoading"></loading-indicator>
        <router-view></router-view>
    </div>
</template>

<script>
import Vue from 'vue'
import {mapState, mapActions} from 'vuex'
import LoadingIndicator from './components/LoadingIndicator'
import Element from 'element-ui'
Vue.use(Element)

export default {

    name: 'App',

    components: {
        LoadingIndicator
    },

    computed: mapState({
        pageLoading: ({root}) => root.pageLoading
    }),

    beforeMount() {
        this.loadMigratedAppList()
    },

    mounted() {
        window.onpopstate = () => {
            if (this.$route.meta.notAllowBack) {
                //    这个allowBack 是存在vuex里面的变量
                history.go(1)
            }
        }
    },
    methods: {
        ...mapActions(['loadMigratedAppList'])
    }
}
</script>

<style lang="scss">
@import "../node_modules/font-awesome/css/font-awesome.css";
@import "../node_modules/element-ui/lib/theme-chalk/index.css";
@import "./layouts/css/index.scss";
@import "./layouts/css/imagefont.css";
.page-wrapper {
    width: 100%;
    height: 100%;
}
</style>
