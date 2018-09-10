<template>
    <div class="dimevent-composite">
        <dynamic-items
            :page-size="10"
            :total="compositePageList.totalCount"
            :page-no="compositePageList.pageNo"
            @sizeChange="onPageSizeChange"
            @pagination="onPagination">
            <table-list :is-loading="compositePageList.isLoading" :table-data="compositePageList.result" @rowClick="rowClick">
                <el-table-column
                    width="30px">
                    <template slot-scope="scope">
                        <span>&nbsp;</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="指标名称">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    width="120"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    :render-header="sortTimeHeader"
                    prop="updateTime"
                    width="150"
                    label="最后更新时间">
                    <template slot-scope="scope"><span>{{ resetDate(scope.row.updateTime) }}</span></template>
                </el-table-column>
                <el-table-column
                    prop="operator"
                    label-class-name="center"
                    align="center"
                    width="200"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" class="iconI" icon="el-icon-edit-outline" @click.stop="editRow(scope.row)"></el-button>
                        <el-button type="text" size="small" class="iconI" icon="el-icon-delete" @click.stop="deleteRow(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </table-list>
        </dynamic-items>
        <dialog-container :di="isDShow" @closeDialog="isDShow.Visible=false" @saveDialog="isDShow.Visible=false">
            <div slot="container" class="maxHeight">
                <div class="comLogTitle pt0"><span class="colorTitle"></span>基本信息</div>
                <div class="comLogList">
                    <div class="compositeTable">
                        <div class="titleName">指标构成</div>
                        <div class="drapBox">
                            <div class="list-group">
                                <ul>
                                    <li v-for="(item, index) in compositeItemDetail.firstData" :key="index">
                                        <div v-if="item.enable === 1" class="dragList">
                                            <span class="inputSpan">{{ item.selectName }}</span>
                                            <span v-if="item.isComplex === 0" class="selectedSpan">
                                                <span class="selectName">{{ item.indexType===1? '浏览量': '点击量' }}<i class="el-icon-arrow-down"></i></span>
                                            </span>
                                            <span class="addSpan">x</span>
                                            <span class="numberSpan">{{ item.weight }}</span>
                                        </div>
                                        <div v-else class="dragList">
                                            <span class="inputMaxSpan">该指标已于{{ item.updateTime }}被删除</span>
                                        </div>
                                        <div v-if="compositeItemDetail.firstData.length > 1 && index === 0" class="addLineFrist"></div>
                                        <div v-if="index > 0" class="addLine">
                                            <div class="line"></div>
                                            <div class="rowLine"></div>
                                            <span class="addLineSelectSpan">
                                                <span class="miniSelectedSpan">{{ item.symbolType ===1 ? '+': '-' }}</span>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="addBox">
                            <span class="miniSelectedSpan">{{ compositeItemDetail.symbolType ===1 ? 'X': '/' }}</span>
                        </div>
                        <div class="drapBox">
                            <div class="list-group">
                                <ul>
                                    <li v-for="(item, index) in compositeItemDetail.secondData" :key="index">
                                        <div v-if="item.enable === 1" class="dragList">
                                            <span class="inputSpan">{{ item.selectName }}</span>
                                            <span v-if="item.isComplex === 0" class="selectedSpan">
                                                <span class="selectName">{{ item.indexType===1? '浏览量': '点击量' }}<i class="el-icon-arrow-down"></i></span>
                                            </span>
                                            <span class="addSpan">x</span>
                                            <span class="numberSpan">{{ item.weight }}</span>
                                        </div>
                                        <div v-else class="dragList">
                                            <span class="inputMaxSpan">该指标已于{{ item.updateTime }}被删除</span>
                                        </div>
                                        <div v-if="compositeItemDetail.secondData.length > 1 && index === 0" class="addLineFrist"></div>
                                        <div v-if="index > 0" class="addLine">
                                            <div class="line"></div>
                                            <div class="rowLine"></div>
                                            <span class="addLineSelectSpan">
                                                <span class="miniSelectedSpan">{{ item.symbolType ===1 ? '+': '-' }}</span>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="comLogTitle"><span class="colorTitle"></span>统计趋势</div>
                <div class="comLogList">
                    <div id="totalChart" class="comLogChart" ></div>
                </div>
            </div>
        </dialog-container>
        <composite-create :is-show="isShowCom" :edit-id="compositeId" @noneshow="getShow" @addSuccess="addSuccess"></composite-create>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import M from '../../utils/misc' // eslint-disable-line
import Api from '../../utils/api' // eslint-disable-line
import TableList from '../../components/common/TableList'
import DynamicItems from '../../components/common/DynamicItems'
import DialogContainer from '../../components/common/DialogWrapper'
import CompositeCreate from '../../components/creatSingle/CompositeCreate'
import {ORDER_TYPES} from '../../constants/constants'
export default {
    name: 'CompositeEvent',
    components: {
        TableList,
        DynamicItems,
        DialogContainer,
        CompositeCreate
    },
    data() {
        return {
            isDShow: {
                Visible: false,
                Title: '指标详情',
                Width: '640px'
            },
            isShowCom: false,
            totalChartLine: null,
            sortable: 'sort-desc',
            currentPage: 1,
            compositeId: ''
        }
    },
    computed: {
        prePageData: {
            get(e) {
                let start = parseInt(`${this.currentPage - 1}0`)
                return this.compositePageList.result.slice(start, start + 10)
            },
            set(newObject) {
                return newObject
            }
        },
        ...mapState({
            appId: ({root}) => root.appId,
            compositePageList: ({dimevent}) => dimevent.compositePageList,
            compositeItemDetail: ({dimevent}) => dimevent.compositeItemDetail
        })
    },
    mounted() {
        this.refreshPage()
    },
    methods: {
        refreshPage(params = {}) {
            this.showPageLoading()
            const defaultParams = {
                appId: this.appId,
                order: ORDER_TYPES.Desc,
                pageNo: 1,
                pageSize: 10
            }
            this.compositeGetMultiIndexListAction({...defaultParams, ...params}).then(() => {
                this.hidePageLoading()
            })
        },
        sortTimeHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable, on: {click: this.changeSort}})])
        },
        changeSort() {
            this.sortable = this.sortable === 'sort-desc' ? 'sort-asc' : 'sort-desc'
            // this.compositePageList.result.reverse()
            this.refreshPage({pageNo: this.currentPage, order: this.sortable === 'sort-asc' ? ORDER_TYPES.Asc : ORDER_TYPES.Desc})
        },
        searchFilter (name) {
            this.refreshPage({name: name, pageNo: 1})
        },
        rowClick(row) {
            this.compositeQueryMultiIndexListAction({id: row.id})
            this.isDShow.Visible = true
            Api.compositeTrend({appId: this.appId, id: row.id}).then(res => {
                let data = []
                res.forEach(d => {
                    data.push(d.COUNTNUM)
                })
                let _this = this
                setTimeout(() => {
                    _this.drawTotalChart(data)
                }, 800)
            })
        },
        onPageSizeChange(pageSize) {
        },
        onPagination(currentPage = 1) {
            this.currentPage = currentPage
            this.refreshPage({pageNo: currentPage})
        },
        editRow(item) {
            this.isShowCom = true
            this.compositeId = item.id
        },
        deleteRow(id) {
            this.$confirm('是否确定删除？', '复合指标', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.compositeDelMultiIndexListAction({id}).then(res => {
                    this.refreshPage({pageNo: 1})
                })
                this.$alerts({
                    type: 'success',
                    content: '删除指标成功'
                })
            }).catch(() => {
                this.$alerts({
                    type: 'fail',
                    content: '取消删除'
                })
            })
        },
        createEvent (ev) {
            this.isShowCom = true
            this.compositeId = ''
        },
        getShow(v) {
            this.isShowCom = false
        },
        drawTotalChart(data) {
            this.totalChartLine = this.$echarts.init(document.getElementById('totalChart'))
            this.totalChartLine.setOption({
                title: {},
                tooltip: {
                    trigger: 'axis'
                    /*
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765'
                        }
                    }
                    */
                },
                legend: {
                    data: ['打卡率'],
                    align: 'auto',
                    bottom: 5,
                    icon: 'roundRect',
                    itemWidth: 22,
                    itemHeight: 4
                },
                grid: {
                    top: 15,
                    left: 40,
                    right: 60
                },
                xAxis: {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#6D7684'
                        }
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: '#6D7684'
                        },
                        inside: true,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#6D7684'
                        }
                    },
                    boundaryGap: false,
                    data: ['当日', '次日', '2日后', '3日后', '4日后', '5日后', '6日后']
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#6D7684'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                series: [
                    {
                        name: '打卡率',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#3CAF41'
                            }
                        },
                        data: data
                    }
                ]
            })
        },
        resetDate(date) {
            return date.split(' ')[0]
        },
        addSuccess() {
            // 创建成功
            this.compositeId = ''
            this.refreshPage({pageNo: 1})
        },
        ...mapActions(['showPageLoading', 'hidePageLoading', 'compositeGetMultiIndexListAction', 'compositeDelMultiIndexListAction', 'compositeQueryMultiIndexListAction'])
    }
}
</script>

<style lang="scss">
    .comLogTitle{
        &.pt0{
            padding-top: 0;
        }
        padding-top: 10px;
        .colorTitle{
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: #3392FF;
            border-radius: 2px;
            margin-right: 10px;
        }
    }
    .comLogList{
        padding-top: 18px;
        .comLogChart{
            height: 140px;
            width: 360px;
        }
    }
    .compositeTable{
        .titleName{
            color: #5A6D82;
            font-size: 14px;
            padding-bottom: 12px;
            padding-left: 19px;
        }
        .drapBox{
            background-color: #F7F7FA;
            min-height: 113px;
            margin: 0 20px;
            padding-bottom: 20px;
            position: relative;
            font-size: 12px;
            ul{
                padding-top: 1px;
                li{
                    position: relative;
                    margin-top: 20px;
                    .dragList{
                        position: relative;
                        z-index: 3;
                        span{
                            height: 26px;
                            display: inline-block;
                        }
                        .inputSpan{
                            width: 140px;
                            border: 1px solid #C2D3E0;
                            line-height: 26px;
                            padding: 0 10px;
                            margin-left: 60px;
                        }
                        .inputMaxSpan{
                            border: 1px solid #C2D3E0;
                            line-height: 26px;
                            padding: 0 10px;
                            margin-left: 60px;
                            color: #f66254;
                        }
                        .selectedSpan{
                            width: 80px;
                            position: relative;
                            top: -2px;
                            margin-left: 8px;
                            .selectName{
                                display: block;
                                border: 1px solid #C2D3E0;
                                padding: 0 8px;
                                i{
                                    padding-left: 8px;
                                    font-size: 12px;
                                }
                            }
                        }
                        .addSpan{
                            width: 40px;
                            text-align: center;
                            line-height: 26px;
                        }
                        .numberSpan{
                            width: 64px;
                            border: 1px solid #C2D3E0;
                            background: #F7F7FA;
                            line-height: 26px;
                            text-align: center;
                        }
                        .delSpan{
                            width: 16px;
                            font-size: 16px;
                            float: right;
                            margin-right: 20px;
                        }
                    }
                    .addLineFrist{
                        border-top: 1px solid;
                        width: 31px;
                        position: absolute;
                        top: 50%;
                        left: 29px;
                    }
                    .addLine{
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 1;
                        .line{
                            border-top: 1px solid;
                            width: 31px;
                            position: absolute;
                            top: 50%;
                            left: 29px;
                        }
                        .rowLine{
                            height: 48px;
                            border-left: 1px solid;
                            position: absolute;
                            top: -33px;
                            left: 29px;
                        }
                        .addLineSelectSpan{
                            display: inline-block;
                            width: 40px;
                            position: absolute;
                            top: -22px;
                            left: 10px;
                        }
                    }
                }
            }
            .noDataText{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                font-size: 16px;
                color: #5A6D82;
                text-align: center;
                padding: 45px 0;
            }
        }
        .addBox{
            margin: 20px 0;
            text-align: center;
        }
        .miniSelectedSpan{
            text-align: center;
            width: 40px;
            line-height: 24px;
            border: 1px solid #C2D3E0;
            display: inline-block;
            background: #F7F7FA;
        }
    }
</style>
