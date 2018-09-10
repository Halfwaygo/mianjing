<template>
    <!-- <div class='page-wrapper' :class="{mac:isMac, win: isWin}"> -->
    <div class='page-wrapper'>
        <loading-indicator :showing='pageLoading'></loading-indicator>
        <router-view></router-view>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Element from 'element-ui';
    import {mapState, mapActions} from 'vuex';
    import LoadingIndicator from './components/LoadingIndicator';

    import utils from './utils/misc';

    //import {delCookie,getCookie,setCookie} from './utils/util';
    Vue.use(Element);

    export default {

        name: 'Root',

        data(){
            return {
            }
        },

        beforeMount(){
        },

        components: {
            LoadingIndicator
        },

        computed: mapState({
            pageLoading: ({root}) => root.pageLoading
        }),

        methods: {
            ...mapActions(["showPageLoading", "hidePageLoading"]),
        },
    };

</script>


<style lang="less">
    @import "./layouts/css/index";
    @import "../node_modules/element-ui/lib/theme-default/index.css";
</style>


