<template>
    <div class="insights-section">
        <div class="select-option clearfix">
            <div class="user-select">
                <el-select v-model="selectUser">
                    <el-option
                        v-for="(item, index) in userOption"
                        :key="index"
                        :label="item.name"
                        :value="index"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="search-btn">
                <el-input placeholder="搜索用户ID" size="small" class="input-with-select">
                    <el-button slot="append" type="primary" icon="icon-search"></el-button>
                </el-input>
            </div>
        </div>
        <dynamic-items
            :total="100"
            :page-no="10"
            @sizeChange="onPageSizeChange"
            @pagination="onPagination">
            <table-list :is-loading="false" :table-data="prePageData" :class="{'hide-plat-circle-table-list': isShowFilterPlat, 'hide-type-circle-table-list': isShowFilterType}" class="circle-table-list">
                <el-table-column
                    v-for="(item, index) in options"
                    :render-header="item.render"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label">
                    <template slot-scope="scope">
                        <el-button v-if="index === 0" type="text" @click="openInsightsDetail(scope.row.appid)">{{ scope.row.appid }}</el-button>
                        <div v-else>{{ scope.row.appid }}</div>
                    </template>
                </el-table-column>
            </table-list>
        </dynamic-items>
    </div>
</template>

<script>
import WaterMark from '../../mixins/watermark'
import TableList from '../../components/common/TableList'
import DynamicItems from '../../components/common/DynamicItems'

export default {
    name: 'Insights',
    components: {
        TableList,
        DynamicItems
    },
    mixins: [WaterMark],
    data() {
        return {
            name: 'ins',
            selectUser: '',
            isShowFilterPlat: true,
            isShowFilterType: true,
            userOption: [
                {
                    name: '今日访问用户'
                },
                {
                    name: 'Android用户'
                }
            ],
            prePageData: [{
                appid: '123'
            }, {
                appid: '456'
            }, {
                appid: '789'
            }],
            sortable: {
                thrityNum: 'sort-desc',
                lateTime: 'sort-desc'
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
            MenuPlatObj: {},
            options: [{
                'prop': 'appid',
                'label': '用户ID',
                'render': null
            }, {
                'prop': 'appid',
                'label': '最近30天来访次数',
                'render': this.sortThirtyNumHeader
            }, {
                'prop': 'appid',
                'label': '最近访问地点',
                'render': null
            }, {
                'prop': 'appid',
                'label': '最近来访时间',
                'render': this.sortTimeHeader
            }, {
                'prop': 'appid',
                'label': '操作系统',
                'render': this.typeRenderHeader
            }, {
                'prop': 'appid',
                'label': '设备品牌'
                // 'render': this.platRenderHeader
            }]
        }
    },
    mounted() {
        this.refreshPage()
    },
    beforeMount() {
        this.waterMk()
    },
    methods: {
        refreshPage() {
            this.resetTypeMenu()
            this.resetPlatMenu()
            // this.getMCircleListAction({appId: this.appId, type: 0, isPage: 2})
        },
        onPageSizeChange(v) {
            console.log(v)
        },
        onPagination(v) {
            console.log(v)
        },
        // 平台
        resetPlatMenu() {
            this.MenuPlatObj = JSON.parse(JSON.stringify(this.initMenu))
        },
        changePlatMenu($events) {
            let index = $events.target.getAttribute('index')
            let labelName = $events.target.getAttribute('name')
            let osType = {'all': 0, 'android': 1, 'ios': 2}
            this.platType = osType[labelName]
            this.resetPlatMenu()
            this.isShowFilterType = true
            this.isShowFilterPlat = !this.isShowFilterPlat
            this.MenuPlatObj.dMenu[index].downMenuB = this.MenuPlatObj.dMenu[index].downMenuB === 'down-menu-b' ? 'down-menu-b is-checked' : 'down-menu-b'
            // 重新筛选条件数据
            // this.getMCircleListAction({appId: this.appId, type: this.platType, isPage: this.isOfPage}).then(() => {
            //     this.currentPage = 1
            //     this.eventCircleList.pageNo = 0
            // })
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
            // this.getMCircleListAction({appId: this.appId, type: this.platType, isPage: this.isOfPage}).then(() => {
            //     this.currentPage = 1
            //     this.eventCircleList.pageNo = 0
            // })
        },
        // 平台过滤是否显示弹窗
        showfilterPlat(value) {
            this.isShowFilterPlat = !this.isShowFilterPlat
            if (this.isShowFilterPlat === false) {
                value.path[0].className = 'el-icon-arrow-down'
            } else {
                value.path[0].className = 'el-icon-arrow-up'
            }
        },
        // 类型过滤是否显示弹窗
        showfilterType(value) {
            this.isShowFilterType = !this.isShowFilterType
            if (this.isShowFilterType === false) {
                value.path[0].className = 'el-icon-arrow-down'
            } else {
                value.path[0].className = 'el-icon-arrow-up'
            }
        },
        formatterPlatformType(v) { // 平台格式转化
            const typeInfo = {1: 'Android', 2: 'Ios', 3: 'Web'}
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
            return createElement(
                'span', {'class': 'renderTableHead'},
                [
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
                                    attrs: {index: 1, name: 'ios'},
                                    on: {
                                        click: this.changePlatMenu
                                    }
                                },
                                ['ios']
                            ),
                            createElement(
                                'div',
                                {
                                    'class': this.MenuPlatObj.dMenu[2].downMenuB,
                                    attrs: {index: 2, name: 'android'},
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
        // 时间排序
        sortTimeHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable.lateTime, on: {click: this.changeLateTimeSort}})])
        },
        // 改变时间顺序触发事件
        changeLateTimeSort() {
            let { lateTime } = this.sortable
            this.sortable.lateTime = lateTime === 'sort-desc' ? 'sort-asc' : 'sort-desc'
        },
        // 最近30天次数排序
        sortThirtyNumHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable.thrityNum, on: {click: this.changeThrityNumSort}})])
        },
        // 改变最近30天次数顺序触发事件
        changeThrityNumSort() {
            let { thrityNum } = this.sortable
            this.sortable.thrityNum = thrityNum === 'sort-desc' ? 'sort-asc' : 'sort-desc'
        },
        openInsightsDetail(appid) {
            this.$router.push({path: `/insightsDetail`, query: {appid: appid}})
        }
    }
}
</script>

<style lang="scss">
$inputBorder: #3392FF;

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
      height: 177px;
      position: absolute;
   }
    .renderTableHead {
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
            height: 123px;
            font-size: 12px;
            z-index: 1000;
            background-color: #fff;
        }
    }
}

.insights-section {
    padding: 0 24px;
    .select-option {
        margin-top: 30px;
        .el-select {
          width: 220px;
          .el-input__inner {
            color: #3392FF;
            height: 32px;
            line-height: 32px;
          }
        }
        .user-select {
            display: inline-block;
        }
        .search-btn {
            display: inline-block;
            float: right;
            height: 30px;
            .input-with-select{
                 .el-input__inner,.el-input-group__append{
                     border: 1px solid $inputBorder;
                 }
                 .el-input-group__append{
                     background-color: $inputBorder;
                     color: #FFFFFF;
                 }
                 .el-input-group__prepend {
                     background-color: #fff;
                 }
                .el-button{
                    padding: 12px 14px;
                }
            }
        }
    }

}
</style>
