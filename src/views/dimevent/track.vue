<template>
    <div class="trackDiv">
        <dynamic-items
            :class="{'hide-type-circle-table-list': isShowFilterType}"
            :page-size="10"
            :data="trackPageList.result"
            :total="trackPageList.totalCount"
            :page-no="trackPageList.pageNo"
            class="circle-table-list"
            @sizeChange="onPageSizeChange"
            @pagination="onPagination">
            <table-list :is-loading="trackPageList.isLoading" :table-data="trackPageList.result" @filter-change="filterChange">
                <el-table-column
                    width="30px">
                </el-table-column>
                <el-table-column
                    prop="eventId"
                    label="事件ID">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="事件名称">
                </el-table-column>
                <el-table-column
                    :render-header="typeRenderHeader"
                    filter-placement="bottom-end"
                    prop="type"
                    label="类型">
                    <template slot-scope="scope">
                        <span>{{ resetType(scope.row.type) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="380"
                    label="描述">
                    <template slot-scope="scope">
                        <div class="describeText">{{ scope.row.comments }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    :render-header="sortTimeHeader"
                    prop="updateTime"
                    width="150"
                    label="最后更新时间">
                    <template slot-scope="scope">
                        <span>{{ resetUpdateDate(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operator"
                    align="center"
                    label-class-name="center"
                    width="200"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" class="iconI" icon="el-icon-edit-outline" @click="editRow(scope.row)"></el-button>
                        <el-button type="text" size="small" class="iconI" icon="el-icon-delete" @click="deleteRow(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </table-list>
        </dynamic-items>
        <dialog-container :di="isDShow" @closeDialog="isDShow.Visible=false" @saveDialog="saveDialog">
            <div slot="container" class="trackEditBox">
                <el-form ref="ruleForm" :model="trackInfo" :rules="rulesTracker" label-width="70px" class="editList">
                    <el-form-item label="事件ID" prop="eventId" class="formInputBox">
                        <el-input v-model="trackInfo.eventId" :disabled="isDShow.Title==='编辑埋点事件'? true: false" placeholder="请输入事件ID" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="eventName">
                        <el-input v-model="trackInfo.eventName" placeholder="请输入名称" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="eventType" class="formInputBox">
                        <el-select v-model="trackInfo.eventType" placeholder="请选择指标" size="medium">
                            <el-option label="计数指标" value="0"></el-option>
                            <el-option label="计算指标" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="comments" class="formInputBox">
                        <el-input
                            v-model="trackInfo.comments"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            type="textarea"
                            size="medium"
                            maxlength="50"
                            placeholder="请输入描述内容"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </dialog-container>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import M from '../../utils/misc' // eslint-disable-line
import Api from '../../utils/api' // eslint-disable-line
import TableList from '../../components/common/TableList'
import DynamicItems from '../../components/common/DynamicItems'
import DialogContainer from '../../components/common/DialogWrapper'
import {ORDER_TYPES} from '../../constants/constants'
import platformMixin from '../../mixins/platform'
export default {
    name: 'TrackerEvent',
    components: {
        TableList,
        DynamicItems,
        DialogContainer
    },
    mixins: [platformMixin],
    data() {
        return {
            rulesTracker: {
                eventId: [
                    { required: true, message: '请输入事件ID', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                eventName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                eventType: [
                    { required: true, message: '请选择总指标', trigger: 'change' }
                ],
                comments: [{ required: false }]
            },
            isShowFilterType: true,
            isDShow: {
                Visible: false,
                Title: '新建自定义事件',
                Width: '440px'
            },
            initMenu: {
                downMenuType: 'down-menu-type',
                dMenu: [
                    {
                        downMenuB: 'down-menu-b',
                        isChecked: false
                    },
                    {
                        downMenuB: 'down-menu-b',
                        isChecked: false
                    },
                    {
                        downMenuB: 'down-menu-b',
                        isChecked: false
                    }
                ]
            },
            MenuTypeObj: {},
            trackInfo: {
                eventName: '',
                comments: '',
                eventId: '',
                eventType: '0'
            },
            options: [{
                value: '0',
                label: '计数指标'
            }, {
                value: '1',
                label: '计算指标'
            }],
            sortable: 'sort-desc',
            sysType: 2, // 默认的系统值
            currentPage: 1,
            platType: 2 // 0  计数指标 1 计算指标 2全部
        }
    },
    computed: {
        prePageData: {
            get(e) {
                let start = parseInt(`${this.currentPage - 1}0`)
                return this.trackPageList.result.slice(start, start + 10)
            },
            set(newObject) {
                return newObject
            }
        },
        ...mapState({
            appId: ({root}) => root.appId,
            trackPageList: ({dimevent}) => dimevent.trackPageList
        })
    },
    mounted() {
        this.resetTypeMenu()
        this.refreshPage()
    },
    methods: {
        refreshPage(params = {}) {
            this.showPageLoading()
            const defaultParams = {
                appId: this.appId,
                type: this.platType,
                order: ORDER_TYPES.Desc,
                pageNo: 1,
                pageSize: 10
            }
            this.trendEventGetListAction({...defaultParams, ...params}).then(() => {
                this.hidePageLoading()
            })
        },
        saveDialog() {
            // 新建保存按钮
            let params = this.trackInfo
            params.appId = this.appId
            let invoker = this.isDShow.Title === '编辑埋点事件' ? this.trendEventUpdateTrendAction : this.trendEventCreateTrendAction
            if (!params.eventId) {
                this.$alerts({
                    type: 'fail',
                    content: '事件ID输入格式错误！'
                })
                return false
            } else if (!params.eventName) {
                this.$alerts({
                    type: 'fail',
                    content: '事件名称输入格式错误！'
                })
                return false
            }
            invoker(params).then(res => {
                // 刷新 页面
                this.refreshPage()
                this.isDShow.Visible = false
            })
        },
        editRow(trend) {
            this.isDShow.Visible = true
            this.isDShow.Title = '编辑埋点事件'
            this.trackInfo = {
                eventName: trend.name,
                comments: trend.comments,
                eventId: trend.eventId,
                eventType: `${trend.type}`
            }
        },
        deleteRow(row) {
            this.$confirm('是否确定删除？', '埋点事件', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.trendEventDelTrendAction({appId: this.appId, eventId: row.eventId}).then(() => {
                    this.refreshPage()
                })
                this.$alerts({
                    type: 'success',
                    content: '删除埋点成功'
                })
            }).catch(() => {
                this.$alerts({
                    type: 'fail',
                    content: '取消删除'
                })
            })
        },
        onPageSizeChange(c) {
            console.log(c)
        },
        onPagination(currentPage = 1) {
            this.currentPage = currentPage
            this.refreshPage({pageNo: currentPage})
        },
        sortTimeHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable, on: {click: this.changeSort}})])
        },
        changeSort() { // 时间升序降序
            this.sortable = this.sortable === 'sort-desc' ? 'sort-asc' : 'sort-desc'
            // this.trackPageList.result.reverse()
            this.refreshPage({pageNo: this.currentPage, order: this.sortable === 'sort-asc' ? ORDER_TYPES.Asc : ORDER_TYPES.Desc})
        },
        // 类型
        resetTypeMenu() {
            this.MenuTypeObj = JSON.parse(JSON.stringify(this.initMenu))
        },
        changeTypeMenu($events) {
            let index = $events.target.getAttribute('index')
            let labelName = $events.target.getAttribute('name')
            let osType = {'all': 2, 'count': 0, 'calculate': 1}
            this.sysType = osType[labelName]
            this.resetTypeMenu()
            this.isShowFilterPlat = true
            this.isShowFilterType = !this.isShowFilterType
            this.MenuTypeObj.dMenu[index].downMenuB = this.MenuTypeObj.dMenu[index].downMenuB === 'down-menu-b' ? 'down-menu-b is-checked' : 'down-menu-b'
            // this.trendEventGetListAction({appId: this.appId, type: this.sysType})
            this.refreshPage({type: this.sysType})
        },
        // 类型过滤是否显示弹窗
        showfilterType(value) {
            this.isShowFilterType = !this.isShowFilterType
            console.log(this.isShowFilterType)
            console.log(value.path[0].className)
            if (this.isShowFilterType === false) {
                value.path[0].className = 'el-icon-arrow-down'
            } else {
                value.path[1].children[2].className = 'el-icon-arrow-up'
            }
        },
        typeRenderHeader(createElement, { column }) {
            return createElement(
                'span', {'class': 'renderTableHead'}, [
                    createElement(
                        'div', {'class': this.isShowFilterType === false ? 'show-mc' : 'hide-show-mc',
                            on: {click: this.showfilterType}
                        }, []
                    ), createElement('span', {'class': 'spanclass'}, [`${column.label}`]),
                    createElement('i', {'class': 'el-icon-arrow-down el-icon-arrow-up', on: {click: this.showfilterType}}),
                    createElement('div', {'class': this.MenuTypeObj.downMenuType},
                        [createElement('div', {'class': this.MenuTypeObj.dMenu[0].downMenuB, attrs: {index: 0, name: 'all'}, on: {click: this.changeTypeMenu}}, ['全部']),
                            createElement('div', {'class': this.MenuTypeObj.dMenu[1].downMenuB, attrs: {index: 1, name: 'count'}, on: {click: this.changeTypeMenu}}, ['计数指标']),
                            createElement('div', {'class': this.MenuTypeObj.dMenu[2].downMenuB, attrs: {index: 2, name: 'calculate'}, on: {click: this.changeTypeMenu}}, ['计算指标'])
                        ]
                    )]
            )
        },
        searchFilter (name) {
            // 搜索筛选的稍后处理
            this.refreshPage({name: name, pageNo: 1})
        },
        createEvent (ev) {
            this.trackInfo = {
                eventName: '',
                comments: '',
                eventId: '',
                eventType: '0'
            }
            this.isDShow.Visible = true
            this.isDShow.Title = '新建埋点事件'
        },
        filterTag(value, row) {
            console.log(value)
            console.log(row)
            return row.type === value
        },
        filterChange(v) {
            console.log(v)
        },
        resetUpdateDate(date) {
            return date.split(' ')[0]
        },
        resetType(type) {
            let typeInt = {'0': '计数指标', '1': '计算指标'}
            return typeInt[type] || type
        },
        ...mapActions(['showPageLoading', 'hidePageLoading', 'trendEventGetListAction', 'trendEventCreateTrendAction', 'trendEventUpdateTrendAction', 'trendEventDelTrendAction'])
    }

}
</script>

<style lang="scss">
.trackDiv {

    .el-table__footer-wrapper, .el-table__header-wrapper {
        overflow: initial;
    }
    .hide-type-circle-table-list {
    .down-menu-type {
            display: none
    }
    }
    .circle-table-list {
        border-radius: 3px;
        th {
            overflow: inherit;
        }
        .el-table__header th>.cell {
        top: 15px;
        height: 177px;
        position: absolute;
    }
        .header-table{
            border-radius: 3px;
            th{
                height: 54px;
                background-color: #F7FAFF;
                text-align: left;
            }
        }

        .renderTableHead {
            .show-mc {
                position: fixed;
                right: 0;
                left: 0;
                bottom: 0;
                top: 0;
                z-index: 100;
            }
            .el-icon-arrow-down, .el-icon-arrow-up {
                cursor: pointer;
                color: #66b1ff;
                margin-left: 4px;
                font-size: 16px;
                font-weight: 600;
            }
            .down-menu-type {
                .down-menu-b {
                    display: block;
                    height: 32px;
                    line-height: 32px;
                }
                .is-checked {
                    background-color: #3392FF !important;
                    color: #fff;
                }
                .down-menu-b:hover {
                background-color: #3392FF;
                color: #fff;
                }
                position: absolute;
                padding-top: 15px;
                padding-bottom: 15px;
                padding-left: 0px;
                padding-right: 0px;
                top: 40px;
                left: 13px;
                border: 1px solid #E5E5E5;
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
                width: 100px;
                height: 123px;
                font-size: 14px;
                z-index: 1000;
                background-color: #fff;
            }
        }
    }
        .trackEditBox{
            color: #5A6D82;
            font-size: 14px;
            padding: 0;
            .editList{
                .title{
                    padding-bottom: 10px;
                    span{
                        color: rgba(72,89,111,0.5);
                    }
                }
                .formInputBox{
                    .el-select--medium{
                        width: 100%;
                    }
                }
                .el-form-item{
                    margin-bottom: 12px;
                }
                .el-form-item.is-success{
                    .el-textarea__inner, .el-input__inner{
                        border-color:#dcdfe6
                    }
                    .el-input__inner:focus, .el-textarea__inner:focus{
                        border-color: #2773c2;
                    }

                }
                .valueBox{
                    .el-select--medium{
                        width: 100%;
                    }
                    .el-select{
                        display: block;
                    }
                }
                padding-bottom: 2px;
            }
        }
        .blockInput .popper__arrow{
            display: none;
        }
}
    .describeText{
        padding-right: 50px;
    }
</style>
