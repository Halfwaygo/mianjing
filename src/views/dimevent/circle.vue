<template>
    <div class="dimevent-circle">
        <dynamic-items
            :total="eventCircleList.totalCount"
            :page-no="eventCircleList.pageNo"
            @sizeChange="onPageSizeChange"
            @pagination="onPagination">
            <table-list :is-loading="eventCircleList.isLoading" :table-data="eventCircleList.result" :class="{'hide-plat-circle-table-list': isShowFilterPlat, 'hide-type-circle-table-list': isShowFilterType}" class="circle-table-list" @filter-change="filterChange" >
                <el-table-column
                    width="30px">
                </el-table-column>
                <el-table-column
                    :render-header="platRenderHeader"
                    prop="type"
                    label="平台">
                    <template slot-scope="scope">
                        <span>{{ formatterPlatformType(scope.row.type) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    :render-header="typeRenderHeader"
                    prop="isPage"
                    label="类型">
                    <template slot-scope="scope">
                        <span>{{ formatterIsPage(scope.row.isPage) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="指标名称">
                </el-table-column>
                <el-table-column
                    prop="path"
                    label="所属页面">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    :render-header="sortTimeHeader"
                    prop="updateTime"
                    label="最后更新时间">
                    <template slot-scope="scope">
                        <span>{{ formatterUpdateDate(scope.row.updateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="isPage"
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

        <dialog-container :di="isDShow" top="0" class="dialog-cantainer" @saveDialog="saveDialog" @closeDialog="isDShow.Visible=false">
            <div slot="container">
                <div class="h-title" style="margin-top: 0;">
                    <div class="blue"></div>
                    <div class="h-title-tro">基本信息</div>
                </div>
                <div class="base-info">
                    <div class="base-info-name">
                        名称：<el-input v-model="zbName" style="width:480px" maxlength="20"></el-input>
                    </div>
                    <div class="base-info-page">
                        页面：<el-input v-model="zbPage" disabled style="width:480px" ></el-input>
                    </div>
                </div>

                <div class="h-title">
                    <div class="blue"></div>
                    <div class="h-title-tro">统计趋势</div>
                </div>

                <div id="staCharts" class="show-charts">

                </div>

                <div class="h-title" style="display: none">
                    <div class="blue"></div>
                    <div class="h-title-tro">截图</div>
                </div>

                <div class="phone-jt" style="display: none">
                    <img src="../../layouts/images/phoneJt.png" class="prop-img">
                </div>

            </div>
        </dialog-container>
    </div>
</template>

<script>
import TableList from '../../components/common/TableList'
import DynamicItems from '../../components/common/DynamicItems'
import DialogContainer from '../../components/common/DialogWrapper'
import Api from '../../utils/api.js' // eslint-disable-line
import platformMixin from '../../mixins/platform'
import {mapActions, mapState} from 'vuex'
import {ORDER_TYPES} from '../../constants/constants'

export default {
    name: 'CircleEvent',
    components: {
        TableList,
        DynamicItems,
        DialogContainer
    },
    mixins: [platformMixin],
    data() {
        return {
            zbName: '',
            zbPage: '',
            isShowFilterPlat: true,
            isShowFilterType: true,
            isDShow: {
                Visible: false,
                Title: '指标详情',
                Width: '640px'
            },
            sortable: 'sort-desc',
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
                    },
                    {
                        downMenuB: 'down-menu-b',
                        isChecked: false
                    }
                ]
            },
            MenuTypeObj: {},
            MenuPlatObj: {},
            currentPage: 1,
            platType: 0,
            isOfPage: 2,
            circleId: '', // 圈选的id
            listItemType: 1
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId,
            eventCircleList: ({dimevent}) => {
                return dimevent.circlePageList
            }
        })
    },
    mounted() {
        this.refreshPage()
    },
    methods: {
        refreshPage(params = {}) {
            this.showPageLoading()
            this.resetTypeMenu()
            this.resetPlatMenu()
            const defaultParams = {
                appId: this.appId,
                type: this.platType,
                isPage: this.isOfPage,
                order: ORDER_TYPES.Desc,
                pageNo: 1,
                pageSize: 10
            }
            this.getMCircleListAction({...defaultParams, ...params}).then(() => {
                this.hidePageLoading()
            }).catch(() => {
                this.hidePageLoading()
                this.eventCircleList.isLoading = false
            })
        },
        filterChange(v) {
        },
        sortTimeHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable, on: {click: this.changeSort}})])
        },
        saveDialog() {
            let params = {
                appId: this.appId,
                selectId: this.circleId,
                selectName: this.zbName,
                type: this.listItemType
            }
            if (!params.selectName) {
                this.$alerts({
                    type: 'fail',
                    content: '名称输入格式错误！'
                })
                return false
            }
            this.isDShow.Visible = false
            this.getMCircleUpdateIndexAction(params).then(() => {
                this.refreshPage()
            })
        },
        editRow(row) { // 编辑事件管理，需要把名称和path取到，然后调用趋势图
            this.zbName = row.name
            this.zbPage = row.path
            this.circleId = row.id
            this.listItemType = row.type
            this.isDShow.Visible = true
            this.getMCircleGetIndexAction({id: row.id, appId: this.appId}).then(res => {
                let dataArr = []
                let axisArr = []
                let name = ''
                if (row.isPage === 0) {
                    name = '点击量'
                } else if (row.isPage === 1) {
                    name = '浏览量'
                }
                res.forEach(item => {
                    let date = item.DAY_ID.split('-')[1] + '/' + item.DAY_ID.split('-')[2]
                    dataArr.push(item.COUNTNUM)
                    axisArr.push(date)
                })
                this.creCharts(name, dataArr, axisArr, row.isPage)
            })
            window.setTimeout(() => {
                // this.creCharts()
            }, 0)
        },
        deleteRow(row) {
            this.$confirm('是否确定删除？', '圈选事件', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.getMCircleDelIndexAction({id: row.id}).then(() => {
                    this.refreshPage()
                })
                this.$alerts({
                    type: 'success',
                    content: '删除事件成功'
                })
            })
        },
        changeSort() { // 时间排序
            this.sortable = this.sortable === 'sort-desc' ? 'sort-asc' : 'sort-desc'
            this.refreshPage({order: this.sortable === 'sort-asc' ? ORDER_TYPES.Asc : ORDER_TYPES.Desc})
        },
        // 平台
        resetPlatMenu() {
            this.MenuPlatObj = JSON.parse(JSON.stringify(this.initMenu))
        },
        changePlatMenu($events) {
            let index = $events.target.getAttribute('index')
            let labelName = $events.target.getAttribute('name')
            let osType = {'all': 0, 'Android': 1, 'iOS': 2, 'web': 3}
            this.platType = osType[labelName]
            this.resetPlatMenu()
            this.isShowFilterType = true
            this.isShowFilterPlat = !this.isShowFilterPlat
            this.MenuPlatObj.dMenu[index].downMenuB = this.MenuPlatObj.dMenu[index].downMenuB === 'down-menu-b' ? 'down-menu-b is-checked' : 'down-menu-b'
            // 重新筛选条件数据
            this.refreshPage({
                pageNo: 1,
                type: this.platType,
                isPage: this.isOfPage
            })
        },
        // 类型
        resetTypeMenu() {
            this.MenuTypeObj = JSON.parse(JSON.stringify(this.initMenu))
        },
        changeTypeMenu($events) {
            let index = $events.target.getAttribute('index')
            let labelName = $events.target.getAttribute('name')
            let osType = {'all': 2, 'element': 0, 'page': 1}
            this.resetTypeMenu()
            this.isOfPage = osType[labelName]
            this.isShowFilterPlat = true
            this.isShowFilterType = !this.isShowFilterType
            this.MenuTypeObj.dMenu[index].downMenuB = this.MenuTypeObj.dMenu[index].downMenuB === 'down-menu-b' ? 'down-menu-b is-checked' : 'down-menu-b'
            // 重新筛选条件数据
            this.refreshPage({
                pageNo: 1,
                type: this.platType,
                isPage: this.isOfPage
            })
        },
        // 平台过滤是否显示弹窗
        showfilterPlat(value) {
            this.isShowFilterPlat = !this.isShowFilterPlat
            if (this.isShowFilterPlat === false) {
                value.path[0].className = 'el-icon-arrow-down'
            } else {
                value.path[1].children[2].className = 'el-icon-arrow-up'
            }
        },
        // 类型过滤是否显示弹窗
        showfilterType(value) {
            this.isShowFilterType = !this.isShowFilterType
            if (this.isShowFilterType === false) {
                value.path[0].className = 'el-icon-arrow-down'
            } else {
                value.path[1].children[2].className = 'el-icon-arrow-up'
            }
        },
        formatterPlatformType(v) { // 平台格式转化
            const typeInfo = {1: 'Android', 2: 'iOS', 3: 'Web'}
            return typeInfo[v] ? typeInfo[v] : '其他平台'
        },
        formatterIsPage(v) {
            const typeInfo = {0: '元素', 1: '页面'}
            return typeInfo[v] ? typeInfo[v] : '其他类型'
        },
        formatterUpdateDate(date) {
            return date.split(' ')[0]
        },
        // 平台
        platRenderHeader(createElement, { column }) {
            if (!this.isApp) {
                return createElement('span', null, column.label)
            }
            return createElement(
                'span', {'class': 'renderTableHead'},
                [
                    createElement(
                        'div',
                        {
                            'class': this.isShowFilterPlat === false ? 'show-mc' : 'hide-show-mc',
                            on: {
                                click: this.showfilterPlat
                            }
                        },
                        []
                    ),
                    createElement(
                        'span',
                        {
                            'class': 'spanclass'
                        },
                        [
                            '' + column.label + ''
                        ]
                    ),
                    createElement(
                        'i',
                        {
                            'class': 'el-icon-arrow-down el-icon-arrow-up',
                            on: {
                                click: this.showfilterPlat
                            }
                        },
                        []
                    ),
                    createElement(
                        'div',
                        {
                            'class': 'down-menu-plat'
                        },
                        [
                            createElement(
                                'div',
                                {
                                    'class': this.MenuPlatObj.dMenu[0].downMenuB,
                                    attrs: {index: 0, name: 'all'},
                                    on: {
                                        click: this.changePlatMenu
                                    }
                                },

                                ['全部']
                            ),
                            createElement(
                                'div',
                                {
                                    'class': this.MenuPlatObj.dMenu[1].downMenuB,
                                    attrs: {index: 1, name: 'iOS'},
                                    on: {
                                        click: this.changePlatMenu
                                    }
                                },
                                ['iOS']
                            ),
                            createElement(
                                'div',
                                {
                                    'class': this.MenuPlatObj.dMenu[2].downMenuB,
                                    attrs: {index: 2, name: 'Android'},
                                    on: {
                                        click: this.changePlatMenu
                                    }
                                },
                                ['Android']
                            )
                        ]
                    )
                ]
            )
        },
        typeRenderHeader(createElement, { column }) {
            return createElement(
                'span', { 'class': 'renderTableHead' }, [createElement(
                    'div', {'class': this.isShowFilterType === false ? 'show-mc' : 'hide-show-mc',
                        on: {click: this.showfilterType}
                    }, []
                ), createElement(
                    'span', { 'class': 'spanclass' }, [`${column.label}`]),
                createElement('i', {'class': 'el-icon-arrow-down el-icon-arrow-up',
                    on: { click: this.showfilterType }
                }, []),
                createElement('div',
                    {'class': this.MenuTypeObj.downMenuType},
                    [createElement('div',
                        {'class': this.MenuTypeObj.dMenu[0].downMenuB, attrs: {index: 0, name: 'all'}, on: { click: this.changeTypeMenu }}, ['全部']),
                    createElement('div', {'class': this.MenuTypeObj.dMenu[1].downMenuB, attrs: {index: 1, name: 'element'}, on: { click: this.changeTypeMenu }}, ['元素']),
                    createElement('div', {'class': this.MenuTypeObj.dMenu[2].downMenuB, attrs: {index: 2, name: 'page'}, on: {click: this.changeTypeMenu}}, ['页面'])
                    ]
                )
                ]
            )
        },
        resetSort(name) {
            return (o, p) => {
                let a
                let b
                if (typeof o === 'object' && typeof p === 'object' && o && p) {
                    a = o[name]
                    b = p[name]
                    if (a === b) {
                        return 0
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1
                    }
                    return typeof a < typeof b ? -1 : 1
                }
            }
        },
        showfilter(e, v) {
            console.log(e)
            console.log(v)
        },
        searchFilter (name) {
            this.refreshPage({name, pageNo: 1})
        },
        onPageSizeChange() {
            // 翻页
        },
        onPagination(currentPage = 1) {
            this.currentPage = currentPage
            this.refreshPage({pageNo: currentPage})
        },
        creCharts(name, dataArr, axisArr) {
            const chart = this.$echarts.init(document.getElementById('staCharts'))
            chart.setOption({
                title: {
                    text: '',
                    top: '5.5%',
                    left: '3.65%',
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: 'rgba(90,109,130,1)',
                        fontSize: '15',
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    type: 'category'
                    /*
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {backgroundColor: '#505765'}
                    }
                    */
                },
                legend: {
                    data: [{'name': name}],
                    bottom: '5',
                    icon: 'rect',
                    itemWidth: 30,
                    itemHeight: 6
                },
                color: ['#74BB5C'],
                grid: {
                    top: '2.5%',
                    left: '7.1%',
                    right: '7.3%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: axisArr,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: '#6D7684'
                        }
                    },
                    splitLine: {
                        show: true,
                        //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: 'rgb(240,240,240)'
                        }
                    },
                    axisLine: {show: false},
                    axisTick: {show: false}
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(109,118,132,1)'
                        }
                    },
                    axisLine: { show: false },
                    // 控制网格线是否显示
                    splitLine: {
                        //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                            type: 'dotted'
                        }
                    },
                    // 刻度
                    axisTick: {show: false}
                },
                series: [
                    {
                        name: name,
                        type: 'line',
                        stack: '总量',
                        data: dataArr
                    }
                ]
            })
        },
        ...mapActions(['showPageLoading', 'hidePageLoading', 'getMCircleListAction', 'getMCircleDelIndexAction', 'getMCircleGetIndexAction', 'getMCircleUpdateIndexAction'])
    }
}
</script>

<style lang="scss">
.el-table__footer-wrapper, .el-table__header-wrapper {
    overflow: initial;
}
.hide-plat-circle-table-list {
    .down-menu-plat {
        display: none
    }
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
      height: 200px;
      position: absolute;
   }
    .header-table{
        border-radius: 3px;
        th{
            height: 54px;
            background-color: #F7FAFF;
            text-align: left;
            i.sort-desc{
                background: url("../../layouts/images/icon/icon-down-blue.png") no-repeat;
                background-size: contain;
                height: 12px;
                width: 9px;
                display: inline-block;
                margin-left: 5px;
                cursor: pointer;
            }
            i.sort-asc{
                background: url("../../layouts/images/icon/icon-down-blue.png") no-repeat;
                transform: rotateZ(180deg);
                background-size: contain;
                height: 12px;
                width: 9px;
                display: inline-block;
                margin-left: 5px;
                cursor: pointer;
            }
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
        .hide-show-mc {
            display: none;
        }
        .el-icon-arrow-down, .el-icon-arrow-up {
          cursor: pointer;
          color: #66b1ff;
          margin-left: 4px;
          font-size: 16px;
          font-weight: 600;
        }
        .down-menu-type, .down-menu-plat{
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
            max-height: 158px;
            font-size: 12px;
            z-index: 1000;
            background-color: #fff;
        }
    }
}
.dimevent-circle {
    .el-icon-edit-outline, .el-icon-delete {
        color: #409EFF;
        font-size: 18px;
        cursor: pointer;
    }
    .header-table th {
      background-color: #F7FAFF;
    }
    .dialog-cantainer {
        .h-title {
            .blue {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #3392FF;
            }
            .h-title-tro {
              display: inline-block;
              margin-left: 8px;
            }
            height: 20px;
            margin-top: 20px;
        }
        .show-charts {
            margin-top: 20px;
        }
        .phone-jt {
            img {
                width: 281px;
                margin-left: 5px;
            }
            margin-top: 20px;
        }
        .base-info {
          .base-info-name {
            margin-top: 14px;
            margin-left: 5px;
          }
          .base-info-page {
            margin-top: 10px;
            margin-left: 5px;
          }
          .el-input__inner {
              height: 36px;
          }
        }
        .show-charts {
          margin-top: 31px;
          height: 142px;
          width: 300px;
        }

    }
}
</style>
