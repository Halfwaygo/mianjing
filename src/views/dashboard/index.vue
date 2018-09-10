<template>
    <div class="dashboard">
        <div class="sidebar">
            <div class="sidebar-operation clearfix mb15">
                <div class="add-basic cursor" @click="onAddDashboard">
                    <!-- <i class="el-icon-plus"></i> -->
                    <div class="rect"></div>
                    新建
                </div>
                <div class="currency-model">
                    <i class="icon-item-box"></i>常用看板
                </div>
            </div>
            <el-menu :default-active="currentActiveIndex" :unique-opened="true" @select="handleSelect">
                <el-menu-item index="/dashboard/summary">
                    概览
                </el-menu-item>

                <el-menu-item index="/dashboard/realTime">
                    实时
                </el-menu-item>

                <el-menu-item index="/dashboard/userRetention" style="display: none">
                    用户留存分析
                </el-menu-item>

                <el-menu-item index="/dashboard/userActivity" style="display: none">
                    用户活跃分析
                </el-menu-item>

                <el-menu-item index="/dashboard/appVersion" style="display: none">
                    App版本更新分析
                </el-menu-item>

                <el-menu-item index="/dashboard/terminal" style="display: none">
                    终端分析
                </el-menu-item>
                <el-menu-item v-for="(item, k) in items" :key="k" :index="`/dashboard/userCreate?id=${item.id}`" class="itit">
                    {{ item.name }}<span class="delMenuItem" @click.stop="delMenuItem(item.id, k)"><i class="el-icon-error"></i></span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="dashboard-content">
            <router-view></router-view>
        </div>
        <dialog-container :is-disabled="isEmpty" :di="createBoardItem" @closeDialog="hiddenDialog" @saveDialog="onSaveDashboard">
            <div slot="container" class="container-dialog">
                <el-input v-model="dashboardName" maxlength="20" size="small" placeholder="请输入看板名称" class="small-input" @input="isInputEmpty"></el-input>
                <span v-if="pageLoading">正在努力加载中...</span>
            </div>
        </dialog-container>
        <scroll-top :scroll-query="`dashboard-content`"></scroll-top>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import {mapActions, mapState} from 'vuex'
import WaterMark from '../../mixins/watermark'
import Modal from '../../components/Modal'
import MessageMixins from '../../mixins/messages'
import ScrollTop from '../../components/common/ScrollTop.vue'
import DialogContainer from '../../components/common/DialogWrapper.vue'
export default {
    name: 'DashboardIndex',
    components: {
        Modal,
        ScrollTop,
        DialogContainer
    },
    mixins: [MessageMixins, WaterMark],
    data() {
        return {
            dashboardName: '',
            items: [],
            clickMenu: [],
            createBoardItem: {
                Visible: false,
                Title: '创建看板',
                Width: '640px'
            },
            isEmpty: true
        }
    },
    computed: {
        ...mapState({
            pageLoading: ({root}) => root.pageLoading,
            // 获取app ID
            appId: ({root}) => root.appId
        }),
        currentActiveIndex() {
            const path = this.$route.path
            return path
        }
    },
    beforeMount() {
        this.waterMk()
    },
    mounted() {
        Api.getAllBoard({appId: this.appId}).then(res => {
            // 获取所有的自定义看板 type=0
            this.items = []
            if (res.datas && res.datas.length > 0) {
                for (let i = 0; i < res.datas.length; i++) {
                    if (res.datas[i].type === 0) {
                        this.items.push(res.datas[i])
                    }
                }
            }
        })
        // 获取所有看板（包括搜索）不晓得这个接口是干嘛用的。。。
        // let paramsG = {
        //     appId: this.appId,
        //     pageNo: 1,
        //     name: '',
        //     pageSize: 10
        // }
        // Api.getAllBoardSearch(paramsG).then(res => {
        //     console.log(res)
        // })
    },
    methods: {
        ...mapActions(['showPageLoading', 'hidePageLoading']),
        delMenuItem(id, k) {
            // 删除自定义看板
            let params = {
                appId: this.appId,
                boardId: id
            }
            this.$confirm('是否删除看板。删除后不可恢复，是否确定删除？', '删除看板', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.delDashboard(params).then(res => {
                    this.items.splice(k, 1)
                })
                this.$alerts({
                    type: 'success',
                    content: '删除看板成功'
                })
            }).catch(() => {
            })
        },
        isInputEmpty() {
            this.isEmpty = this.dashboardName === ''
        },
        scrollTop($event) {
            console.log($event)
        },
        onAddDashboard() {
            this.createBoardItem.Visible = true
        },
        hiddenDialog() {
            this.dashboardName = ''
            this.createBoardItem.Visible = false
        },
        onSaveDashboard() {
            if (this.dashboardName === '') {
                this.$message.warning('看板名称未填')
                return
            }
            let parmas = {
                appId: this.appId,
                name: this.dashboardName
            }
            Api.addDashboard(parmas).then(res => {
                // 新建自定义看板
                if (res.name && res.id) {
                    this.items.push(res)
                    this.showPageLoading()
                    setTimeout(() => {
                        this.hidePageLoading()
                        this.createBoardItem.Visible = false
                        this.showSuccess()
                    }, 1500)
                }
            })
        },
        handleSelect(key, keyPath) {
            this.$router.push(keyPath[0])
            // 解决新建的看板点击后没有背景阴影问题
            if (this.clickMenu.indexOf(key) === -1) {
                this.clickMenu = []
                this.clickMenu.push(key)
                window.setTimeout(() => {
                    try {
                        document.getElementById(keyPath[0]).click()
                    } catch (c) {}
                }, 500)
            }
        }
    }

}
</script>

<style lang='scss'>
$activeColor: #000;
$activeFolderColor: #999;
$activeBgItem:#F7F7FA;
$color-409EFF: #409EFF;
.dashboard {
    overflow: hidden;
    height: 100%;
    .sidebar {
        width: 200px;
        height: 100%;
        border-right: 1px solid #e7e7e7;
        background-color: #fff;
        float: left;

        .sidebar-operation {
            padding: 30px 20px 0;
            .currency-model{
                border-bottom: 1px solid #E3EAF0;
                margin-top: 35px;
                font-size: 14px;
                height: 30px;
                letter-spacing: 2px;
                color: #5a6d82;
                .icon-item-box{
                    display: inline-block;
                    vertical-align: middle;
                    background-image: url("../../layouts/images/icon/icon-item-box.png");
                    background-repeat: no-repeat;
                    background-size: contain;
                    margin-right: 5px;
                    height: 16px;
                    width: 16px;
                }
            }
            .add-basic{
                .rect {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    background-image: url('../../layouts/images/icon/rect.png')
                }
                float: inherit;
                font-size: 14px;
                height: 54px;
                line-height: 54px;
                text-align: center;
                color: #3392FF;
                border: 1px #3392FF dashed;
                background-color: $activeBgItem;
            }
        }

        .fa {
            margin-right: 4px;
            font-size: 18px;
            &.icon-item{
                display: inline-block;
                vertical-align: middle;
                background-image: url("../../layouts/images/icon/icon-item.png");
                background-repeat: no-repeat;
                background-size: contain;
                width: 11px;
                height: 5px;
                margin-right: 5px;
                margin-left: 4px;
            }
        }

        .el-menu {
            background-color: #fff;
            border-right: none;
        }

        .el-menu-item {
            width: 194px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #5A6D82;
            padding-left: 43px!important;
            font-size: 12px;
            height: 50px;
            line-height: 50px;
            letter-spacing: 1px !important;
            position: relative;
            .delMenuItem{
                position: absolute;
                top: 0px;
                right: 5px;
                display: none;
                i.el-icon-error {
                    color: $color-409EFF;
                }
            }
            &:hover {
                background-color: #F7F7FA;
                color: $color-409EFF;
                .delMenuItem{
                    display: inline-block;
                }
            }
            &:focus {
                background-color: transparent;
                color: $color-409EFF;
            }
            &.is-active {
                color: $color-409EFF;
                background-color: $activeBgItem;
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

    .dashboard-content {
        padding: 30px 20px 120px;
        height: 100%;
        // overflow-x: hidden;
        overflow-y: auto;
    }
    .container-dialog{
        .small-input {
            height: 44px;
            .el-input__inner {
                height: 44px;
            }
        }
        padding: 50px 0;
    }
}
</style>
