<template>
    <div class="page-section">
        <el-popover
            ref="loginOut"
            placement="top-start"
            width="80"
            popper-class="head-popper"
            trigger="hover">
            <div class="headBox">
                <ul @click="logout">
                    <li>
                        <div class="loginOut"><i class="icon-loginOut"></i>退出</div>
                    </li>
                </ul>
            </div>
        </el-popover>
        <div class="page-header">
            <header>
                <div class="logo">
                    Amber
                </div>
                <el-menu :default-active="activeIndex" :router="true" text-color="#5A6D82" class="nav-menu" mode="horizontal">
                    <el-menu-item index="/dashboard/summary" class="opacity-class">看板</el-menu-item>
                    <el-menu-item index="/graph/charts" class="opacity-class">单图</el-menu-item>
                    <el-submenu index="/user" class="opacity-class portrait-menu">
                        <template slot="title">用户画像</template>
                        <el-menu-item index="/segmentations">用户分群</el-menu-item>
                        <el-menu-item v-if="platform === '0'" index="/insights">用户细查</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/circle" class="opacity-class">圈选</el-menu-item>
                    <el-menu-item index="/dimevent/circle" class="opacity-class">事件管理</el-menu-item>
                </el-menu>
                <div v-popover:loginOut class="logout" >
                    <img class="userAvatar" src="../layouts/images/icon/head.png" />
                    {{ userName }}<i class="icon-logout"></i>
                </div>
                <div class="setting" @click="settingView">
                    <i class="icon-el-setting"></i>
                </div>
                <div class="product-list">
                    <el-select v-model="defaultAppId" placeholder="请选择" size="mini" class="add-sel-product" @change="switchProduct">
                        <el-option
                            v-for="item in appList"
                            :key="item.appkey"
                            :label="item.appName"
                            :value="`${item.appId}`">
                        </el-option>
                    </el-select>
                </div>
            </header>
        </div>
        <div class="page-content-wrapper">
            <div class="page-content">
                <router-view></router-view>
            </div>
        </div>
        <scroll-top :scroll-query="`page-content`"></scroll-top>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import * as C from '../constants/api' // eslint-disable-line
// import cookies from '../utils/cookies'
import ScrollTop from '../components/common/ScrollTop.vue'
import Api from '../utils/api'
import platformMixins from '../mixins/platform'
export default {
    name: 'AppManagerIndex',
    components: {
        ScrollTop
    },
    mixins: [platformMixins],
    data() {
        return {
            defaultAppId: ''
        }
    },

    computed: {
        ...mapState({
            currentUser: ({ root }) => root.currentUser,
            appList: ({root}) => root.appList,
            platform: ({root}) => root.platform
        }),
        userName() {
            let user = localStorage.getItem('userName')
            if (!user) {
                this.$router.replace('/login')
            }
            return user
        },

        activeIndex() {
            const path = this.$route.path
            if (~path.indexOf('/dashboard')) {
                return '/dashboard/summary'
            }
            if (~path.indexOf('/graph')) {
                return '/graph/charts'
            }
            if (~path.indexOf('/dimevent')) {
                return '/dimevent/circle'
            }
            return path
        }
    },

    beforeMount() {
        const userName = sessionStorage.getItem('userName')
        userName && this.changeCurrentUser(userName)
        this.defaultAppId = this.getDefaultAppId()
    },

    methods: {
        // 切换产品选择后的处理, 为了方便，直接刷新页面
        switchProduct(appId) {
            const app = this.getDefaultApp(appId)
            this.changeAppId(app)
            this.$nextTick(() => {
                window.location.reload()
            })
        },

        settingView() {
            this.$router.push({path: '/setting'})
        },
        logout() {
            this.$confirm('是否确定退出登录？', '退出登录', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                localStorage.clear()
                sessionStorage.clear()
                Api.loginOut().then(res => {
                    this.$router.push('/login') // = `${C.HOST_BASE}/#/login`
                })
            }).catch(() => {
            })
        },

        ...mapActions(['changeCurrentUser', 'changeAppId'])
    }
}
</script>

<style lang='scss'>
    @import '../layouts/css/index.scss';

    $activeColor : #fb9678;
    $activeFolderColor : #fb9678;
    .page-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        min-width: 100%;
        box-shadow:0 1px 3px rgba(5, 42, 85, 0.1);
        header {
            height: $header-height;
            background-color: $header-background;
            min-width: 790px;
            display: block;
            position: relative;
            padding-left: 20px;
            overflow: hidden;
            .logo {
                color: #3392FF;
                line-height: $header-height;
                display: inline-block;
                font-size: 28px;
                vertical-align: top;
                padding-right: 72px;
            }

            .nav-menu {
                background: transparent;
                display: inline-block;
                .el-menu-item {
                    padding: 0 6px;
                    margin-left: 32px;
                    letter-spacing: 2px !important;
                    &:hover, &:focus {
                        background-color: transparent;
                    }
                }
                .opacity-class {
                    &:hover {
                        opacity: 1;
                        color: #3392FF !important;
                        border-bottom: 2px solid #409EFF !important;
                    }
                }
                .opacity-class {
                    opacity: 0.7;
                }
                .portrait-menu {
                    margin-left: 32px;
                }
                .el-submenu__title:hover{
                    color: #3392FF !important;
                    border-bottom: 2px solid #409EFF !important;
                }
                .is-active {
                    opacity: 1;
                    color: #3392FF !important;
                    .el-submenu__title{
                        height: 60px;
                        line-height: 60px;
                        color: #3392FF !important;
                    }
                }
            }

            .avatar {
                position: absolute;
                top: 0;
                right: 120px;
                padding-left: 35px;
                background: transparent url('../layouts/images/avatar.png') left center no-repeat;
                span {
                    text-align: center;
                    color: #fff;
                    line-height: $header-height;
                    font-size: 16px;
                }
            }
            .setting{
                float: right;
                height: $header-height;
                line-height: $header-height;
                width: $setting-width;
                border-left: $setting-border;
                border-right: $setting-border;
                margin-right: 20px;
                text-align: center;
                .icon-el-setting{
                    cursor: pointer;
                    width: 18px;
                    height: 18px;
                    margin-top: 20px;
                    display: inline-block;
                    background: url("../layouts/images/icon/icon-setting.png") no-repeat;
                    background-size: contain;
                }
            }
            .product-list{
                float: right;
                height: $header-height;
                margin-right: 10px;
                display: flex;
                align-items: center;
                .add-sel-product{
                }
            }
            .logout {
                float: right;
                font-size: 14px;
                color: #5A6D82;
                height: $header-height;
                padding-right: 24px;
                cursor: pointer;
                .userAvatar{
                    width: 30px;
                    height: 30px;
                    border-radius: 2px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                i {
                    line-height: $header-height;
                }
            }
        }
    }

    .el-menu--horizontal .el-menu .el-menu-item.is-active {
        color: white;
        background-color: #3392FF;
    }

    .page-content-wrapper {
        width: 100%;
        position: absolute;
        top: $header-height;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;

        .sidebar {
            width: 200px;
            height: 100%;
            border-right: 1px solid #e7e7e7;
            background-color: #fff;
            float: left;

            .fa {
                margin-right: 4px;
                font-size: 18px;
            }

            .el-menu {
                background-color: #fff;
                border-right: none;
            }

            .el-menu-item {
                &:hover,
                &:focus {
                    background-color: transparent;
                    color: $activeColor;
                }
                &.is-active {
                    color: $activeColor;
                }
            }

            .el-submenu {
                &.is-active {
                    .el-submenu__title {
                        color: $activeFolderColor;
                        i {
                            color: inherit;
                        }
                    }
                }
            }
        }

        .page-content {
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
    .el-popper[x-placement^=bottom].head-popper{
        padding: 0;
        margin: 0;
        min-width: 100px;
        .popper__arrow{
            display: none;
        }
    }
    .headBox{
        margin: 10px 0;
        ul{
            padding: 0;
            margin: 0;
            list-style: none;
            li{
                padding: 0 12px;
                background: #ffffff;
                color: #5A6D82;
                font-size: 14px;
                cursor: pointer;
                .loginOut{
                    .icon-loginOut{
                        display: inline-block;
                        width: 19px;
                        height: 18px;
                        background-image: url("../layouts/images/icon/icon-loginOut-gray.png");
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                        position: relative;
                        top: 3px;
                        margin-right: 9px;
                    }
                }
                &:hover{
                    background: #3392FF;
                    color: #ffffff;
                    .loginOut{
                        .icon-loginOut{
                            background-image: url("../layouts/images/icon/icon-loginOut.png");
                        }
                    }
                }
            }
        }

    }
</style>
