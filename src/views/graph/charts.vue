<template>
    <div class="charts-section mainBox">
        <dynamic-items
            :page-size="pageSize"
            :total="allCount"
            :page-no="pageNo"
            @sizeChange="onPageSizeChange"
            @pagination="onPagination">
            <div v-show="$parent.isGridShow" class="list-container" >
                <el-row :gutter="20">
                    <el-col v-for="chart in chartsData" :span="12" :key="chart.id">
                        <div class="items-form">
                            <div class="title">
                                <div class="name">{{ chart.name }}</div>
                                <div class="time">{{ chart.date || weekDate }}</div>
                            </div>
                            <div :id="chart.id" class="charts-line" @click="detail(chart.id)">
                                <!-- showtype == 3表示类型为表格  -->
                                <div v-if="chart.showtype === 3 && !chart.loadingResultType" class="tableChart">
                                    <el-table
                                        :data="chart.tableData3"
                                        empty-text=" "
                                        height="350"
                                        border
                                        style="width: 100%">
                                        <el-table-column v-for="(hItem, k) in chart.tableHead" :key="k" :prop="hItem.prop " :label="hItem.name">
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <!-- loadingResultType是通过mixin设置的 -->
                            <image-presenter :type="chart.loadingResultType" ></image-presenter>
                            <div class="icon-edit">
                                <div class="modify-info">{{ chart.createUser }}修改于{{ chart.updateTime }}</div>
                                <div class="edit-btn">
                                    <i class="icon-add-gray" @click="addToDa(chart.id, chart.name)"></i>
                                    <i class="icon-edit-img" @click="editDa(chart.id)"></i>
                                    <i class="icon-delete-gray" @click="deleChart(chart.id)"></i>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12"></el-col>
                </el-row>
            </div>
            <div v-show="!$parent.isGridShow" class="table-container">
                <table-list
                    :table-data="chartsData" :is-loading="isLoading">
                    <el-table-column
                        width="40">
                    </el-table-column>
                    <el-table-column
                        label="类型">
                        <template slot-scope="scope">
                            <div>事件分析</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        prop="createUser"
                        label="创建人">
                    </el-table-column>
                    <el-table-column
                        :render-header="sortTimeHeader"
                        prop="updateTime"
                        label="最后更新时间">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="300"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="iconI" icon="el-icon-plus " @click="addToDa(scope.row.id, scope.row.name)"></el-button>
                            <el-button type="text" size="small" class="iconI" icon="el-icon-edit-outline" @click="editDa(scope.row.id)" ></el-button>
                            <el-button type="text" size="small" class="iconI" icon="el-icon-delete" @click="deleChart(scope.row.id)"></el-button>
                        </template>
                    </el-table-column>
                </table-list>
            </div>
        </dynamic-items>
        <dialog-add-dash-board :create-dash-board-dialog-visible="dialogVisible" @closeDialog="closeBoardDialog" @addDashBoard="addToBoard"></dialog-add-dash-board>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapActions, mapState } from 'vuex'
import DynamicItems from '../../components/common/DynamicItems'
import TableList from '../../components/common/TableList'
import DialogAddDashBoard from '../../components/common/DialogAddDashboard'
import ImagePresenter from '~/components/ImagePresenter'
import weekDate from '../../utils/changeDate'
import createChart from '../../constants/chartOption/eventOption'
import PlatformMixin from '../../mixins/platform'
export default {
    name: 'Charts',
    components: {
        DynamicItems,
        TableList,
        DialogAddDashBoard,
        ImagePresenter
    },
    mixins: [PlatformMixin],
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            allCount: 10,
            weekDate: '',
            searchName: '',
            searchModel: '',
            dialogVisible: false,
            isLoading: true,
            addToname: '',
            addChart: {
                id: '',
                name: ''
            },
            isChart: true,
            chartsData: [],
            sortable: 'sort-desc'
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        }),
        isShowGrid () {
            return this.$parent.isGridShow
        }
    },
    watch: {
        isShowGrid(value, oldValue) {
            if (value) {
                let _this = this
                setTimeout(() => {
                    _this.chartsData.forEach(res => {
                        res.chart.resize()
                    })
                }, 600)
            }
        },
        chartsData(v, o) {
            this.chartsData = v
        }
    },
    beforeMount () {
        this.getSingleMapList()
        // 内容类似 2018/08/08-2018/08/14
        this.weekDate = weekDate.getWeekDate().join('-')
    },
    methods: {
        getSingleMapList() {
            this.showPageLoading()
            this.isLoading = true // loading初始化
            let params = {
                appId: this.appId,
                pageNo: this.pageNo,
                name: this.searchName,
                pageSize: this.pageSize
            }
            // let _this = this
            Api.graphGetEventMapList(params).then(res => {
                this.hidePageLoading()
                this.allCount = res.count
                this.chartsData = res.datas
                this.isLoading = false // 关闭loading
                this.chartsData.forEach((item, i) => {
                    item.chart = null
                    item.updateTime = item.updateTime.substring(0, 10)
                    // 获取单图的数据
                    Api.graphQueryEventMap({appId: this.appId, id: item.id}).then(chart => {
                        item.showtype = chart.showtype
                        item.date = chart.starttime.substring(0, 10).replace(/-/g, '/') + '-' + chart.endtime.substring(0, 10).replace(/-/g, '/')
                        if (chart.showtype === 3) {
                            // 表格的是不一样的接口
                            // 表格
                            item.tableHead = []
                            item.tableData3 = []
                            this.tableChart(chart, i)
                        } else {
                            item.chart = this.$echarts.init(document.getElementById(item.id))
                            item.chart.showLoading({
                                text: '正在加载',
                                color: '#409EFF'
                            })
                            this.dataCell(chart, i, item.id)
                        }
                    }).catch(() => {
                        this.isLoading = false
                    })
                })
            }).catch(() => {
                this.hidePageLoading()
                this.isLoading = false
            })
        },
        searchFilter(res) {
            // 通过名称搜索单图
            this.searchName = res
            this.getSingleMapList()
        },
        sortTimeHeader(h, { column, $index }) {
            // console.log(h)
            return h('span', [column.label, h('i', {class: this.sortable, on: {click: this.changeSort}})])
        },
        changeSort() {
            this.sortable = this.sortable === 'sort-desc' ? 'sort-asc' : 'sort-desc'
        },
        addToDa(id, name) {
            this.dialogVisible = true
            this.addChart.id = id
            this.addChart.name = name
        },
        sureAdd() {
            this.dialogVisible = false
            // console.log('添加了' + this.addChart.name)
        },
        onPageSizeChange() {
            // 翻页
        },
        onPagination(num) {
            // 翻页
            this.pageNo = num
            this.getSingleMapList()
        },
        closeBoardDialog() {
            this.dialogVisible = false
        },
        addToBoard(v) {
            // 添加到看板的接口
            let addArr = []
            let addObj = {
                id: this.addChart.id,
                type: 0,
                name: this.addChart.name
            }
            addArr.push(addObj)
            Api.addSingleMap({
                appId: this.appId,
                boardId: v,
                data: JSON.stringify(addArr)
            }).then(res => {
                this.$alerts({
                    type: 'success',
                    content: '成功添加到看板'
                })
            })
        },
        editDa(id) {
            this.$router.push({path: `/graph/new?mode=edit&type=graphCharts&id=${id}`})
        },
        detail(id) {
            this.$router.push({path: `/graph/new?mode=detail&type=graphCharts&id=${id}`})
        },
        deleChart(id) {
            this.$confirm('此操作会导致该单图从看板中移除。删除后不可恢复，是否确定删除？', '删除单图', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.graphDelEventMap({id: id}).then(res => {
                    this.getSingleMapList()
                    this.$alerts({
                        type: 'success',
                        content: '删除看板成功'
                    })
                })
            }).catch(() => {
            })
        },
        tableChart(chartData, n) {
            this.chartsData[n].showtype = chartData.showtype
            // 表格 未做
            // 表格 多指标和多维度 如果维度中有选择时间，粒度可选择，如果没有，删除粒度的值
            // delete params['cycle']  表格的接口是单独的
            let dimensionList = []
            chartData.dimentions.forEach(d => {
                dimensionList.push(parseInt(d.dimensionid))
            })
            if (chartData.cyclce > 0) {
                dimensionList.push(createChart.timeItem.id)
                chartData.dimentions.push(createChart.timeItem)
            }
            let fieldsList = []
            chartData.fields.forEach(f => {
                let fitem = {
                    fieldId: f.fieldId,
                    type: f.type,
                    value: f.value
                }
                fieldsList.push(fitem)
            })
            let itemList = []
            chartData.indexs.forEach(s => {
                let iscomplex = s.isComplex === 0 ? (s.isPage === 1 ? 1 : 0) : parseInt(s.isComplex) + 1
                itemList.push({
                    selectID: s.id,
                    elementType: iscomplex,
                    platform: 0,
                    queryType: s.innerType
                })
            })
            let params = {
                appId: this.appId,
                id: chartData.id,
                showType: chartData.showtype,
                indexs: JSON.stringify(itemList),
                cycle: chartData.cyclce ? chartData.cyclce : 4,
                conditionType: chartData.conditiontype,
                startTime: chartData.starttime.substring(0, 10).replace(/-/g, ''),
                endTime: chartData.endtime.substring(0, 10).replace(/-/g, ''),
                fields: JSON.stringify(fieldsList),
                groupId: chartData.groupId,
                dimensionIds: dimensionList
            }
            Api.graphGerEventTableMapIndex(params).then(res => {
                // 表格
                if (res.length <= 0) {
                    return
                }
                // 表格的头部信息只取一次
                let t = Object.keys(res[0][0])
                // 如果有周的粒度，返回两个值，删除其中一个
                let index = t.indexOf('WEEK_END')
                if (index > -1) {
                    t.splice(index, 1)
                }
                if (this.chartsData[n].tableHead.length <= 0) {
                    for (let j = 0; j < t.length - 1; j++) {
                        this.chartsData[n].tableHead.push({
                            name: chartData.dimentions[j].name,
                            prop: t[j]
                        })
                    }
                }
                res.forEach((tl, i) => {
                    tl.forEach(tlitem => {
                        for (let vlaues in tlitem) {
                            tlitem[vlaues] = (tlitem[vlaues] !== '') ? tlitem[vlaues] : 'N/A'
                        }
                    })
                    this.chartsData[n].tableHead.push({
                        name: chartData.indexs[i].name,
                        prop: chartData.indexs[i].id
                    })
                    // 第一次指标的记录维度的信息  后面的指标参数直接嵌入
                    if (this.chartsData[n].tableData3.length > 0) {
                        this.chartsData[n].tableData3.forEach((item, k) => {
                            item[chartData.indexs[i].id] = tl[k].COUNTNUM
                        })
                    } else {
                        tl.forEach((item) => {
                            item[chartData.indexs[i].id] = item.COUNTNUM
                            // 如果有时间的
                            if (item.WEEK_BEGIN) {
                                item.WEEK_BEGIN = item.WEEK_BEGIN.replace(/-/g, '/').substring(5, 10) + '-' + item.WEEK_END.replace(/-/g, '/').substring(5, 10)
                            }
                        })
                        this.chartsData[n].tableData3 = tl
                    }
                    !this.chartsData[n].tableData3.length && this.markLoadingEmpty(this.chartsData[n])
                })
                // 数据变化 渲染也变化
                this.$nextTick(() => {
                    this.$set(this.chartsData, n, this.chartsData[n])
                })
            }).catch(() => {
                this.markLoadingFailed(this.chartsData[n])
            })
        },
        dataCell(chartData, n, idx) {
            // 数据接口
            // 指标
            // let targetList = []
            if (chartData.showtype === 0 || chartData.showtype === 2) {
                // 线性 或 纵向柱状图
                createChart.chart1Optine.grid.top = 70
                this.chartsData[n].options = createChart.chart1Optine
                this.chartsData[n].options.series = []
            } else if (chartData.showtype === 1) {
                // 横向柱状图
                this.chartsData[n].options = createChart.chart2Option
            } else if (chartData.showtype === 4) {
                // 数值图
                this.chartsData[n].options = createChart.chart5Option
                this.chartsData[n].options.series = []
            }
            let legendName = []
            let fieldsList = []
            let targetDataList = []
            // 转下筛选条件
            chartData.fields.forEach(f => {
                let fitem = {
                    fieldId: f.fieldId,
                    type: f.type,
                    value: f.value
                }
                fieldsList.push(fitem)
            })
            if (chartData.indexs && chartData.indexs.length > 0) {
                for (let i = 0; i < chartData.indexs.length; i++) {
                    let name = chartData.indexs[i].name
                    // 现在只有预定义指标可测
                    let iscomplex = chartData.indexs[i].isComplex === 0 ? (chartData.indexs[i].isPage === 1 ? 1 : 0) : parseInt(chartData.indexs[i].isComplex) + 1
                    let item = {
                        selectID: chartData.indexs[i].id,
                        elementType: iscomplex,
                        platform: 0,
                        queryType: chartData.indexs[i].innerType
                    }
                    let params = {
                        appId: this.appId,
                        id: chartData.id,
                        showType: chartData.showtype,
                        indexs: JSON.stringify(item),
                        cycle: chartData.cyclce ? chartData.cyclce : 4,
                        conditionType: chartData.conditiontype,
                        startTime: chartData.starttime.substring(0, 10).replace(/-/g, ''),
                        endTime: chartData.endtime.substring(0, 10).replace(/-/g, ''),
                        groupId: chartData.groupId,
                        fields: JSON.stringify(fieldsList)
                    }
                    //    线图和 纵向柱状图 只有指标
                    if (chartData.showtype === 1) {
                        // 横向柱状图 有单指标和单维度
                        let dimensionList = []
                        chartData.dimentions.forEach(d => {
                            dimensionList.push(parseInt(d.dimensionid))
                        })
                        params.dimensionIds = dimensionList.join(',')
                    }
                    if (chartData.showtype === 4) {
                        // 数值图 单指标和颜色S
                        delete params['cycle']
                        params.comparedStartTime = chartData.comparedStartTime.substring(0, 10).replace(/-/g, '')
                        params.comparedEndTime = chartData.comparedEndTime.substring(0, 10).replace(/-/g, '')
                    }
                    // 获取某个图标中某条曲线或者柱状图的信息
                    Api.graphGetEventMapIndex(params).then(res => {
                        if (res.length === 0) {
                            this.markLoadingEmpty(this.chartsData[n])
                            return
                        }
                        if (params.showType === 0 || params.showType === 2) {
                            // 线图和 纵向柱状图
                            let chartTime = []
                            legendName.push(name)
                            let targetData = {
                                name: name,
                                type: params.showType === 0 ? 'line' : 'bar',
                                itemStyle: {
                                    normal: {
                                        color: createChart.lineColors[i]
                                    }
                                },
                                barMaxWidth: 20,
                                data: []
                            }
                            res.forEach(item => {
                                if (params.cycle === 1) {
                                    // 粒度为天
                                    let t = item.DAY_ID.replace(/-/g, '/')
                                    let week = weekDate.getWeekName(t)
                                    let time = t.substring(5, 10) + ' ' + week
                                    chartTime.push(time)
                                } else if (params.cycle === 2) {
                                    // 粒度为周
                                    let wtime = item.WEEK_BEGIN.replace(/-/g, '/').substring(5, 10) + '~' + item.WEEK_END.replace(/-/g, '/').substring(5, 10)
                                    chartTime.push(wtime)
                                } else if (params.cycle === 3) {
                                    // 粒度为月
                                    let mtime = item.MONTH_ID.substring(5, 7) + '月️'
                                    chartTime.push(mtime)
                                }
                                targetData.data.push(item.COUNTNUM)
                            })
                            targetDataList.push(targetData)
                            this.chartsData[n].options.xAxis.data = chartTime
                            this.chartsData[n].options.legend.data = legendName
                            this.chartsData[n].options.series = targetDataList
                            this.chartsData[n].chart.setOption(this.chartsData[n].options)
                            this.chartsData[n].chart.hideLoading()
                        } else if (params.showType === 1) {
                            // 横向柱状图
                            let datList = []
                            let totalDat = 0
                            let chart2Time = []
                            res.forEach(item => {
                                datList.push(item.COUNTNUM)
                                totalDat = totalDat + parseInt(item.COUNTNUM)
                                chart2Time.push(item[Object.keys(item)[0]])
                            })
                            let label = {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    formatter (data) {
                                        return `${data.data} (${((data.data / totalDat) * 100).toFixed(2)}%)`
                                    },
                                    textStyle: {
                                        fontSize: '12',
                                        fontFamily: 'MicrosoftYaHei',
                                        color: '#5A6D82'
                                    }
                                }
                            }
                            this.chartsData[n].options.yAxis.data = chart2Time
                            this.chartsData[n].options.series[0].label = label
                            this.chartsData[n].options.series[0].data = datList
                            // this.line2Res.option.series.push(ser)
                            this.chartsData[n].chart.setOption(this.chartsData[n].options)
                            this.chartsData[n].chart.hideLoading()
                        } else if (params.showType === 4) {
                            // 数值图
                            chartData.compareNum = res.difference
                            chartData.comparePre = res.ratio
                            let sersie = {
                                name: name,
                                type: 'line',
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: createChart.echartColor[chartData.color].value
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: createChart.echartColor[chartData.color].rgbaValue
                                        }, {
                                            offset: 1,
                                            color: '#ffffff'
                                        }])
                                    }
                                },
                                data: []
                            }
                            let chart5Time = []
                            res.queryDataList.forEach(item => {
                                sersie.data.push(item.countNum)
                                chart5Time.push(item.groupField)
                            })
                            targetDataList.push(sersie)
                            this.chartsData[n].options.xAxis.data = chart5Time
                            this.chartsData[n].options.series = targetDataList
                            this.chartsData[n].chart.setOption(this.chartsData[n].options)
                            this.chartsData[n].chart.hideLoading()
                        }
                        this.$nextTick(() => {
                            this.$set(this.chartsData, n, this.chartsData[n])
                        })
                    }).catch(() => {
                        this.chartsData[n].chart.hideLoading()
                        // 数据加载报错时销毁echarts组件
                        this.chartsData[n].chart.dispose()
                        this.markLoadingFailed(this.chartsData[n])
                    })
                }
            } else {
                this.chartsData[n].chart.hideLoading()
                this.markLoadingEmpty(this.chartsData[n])
            }
        },
        ...mapActions(['showPageLoading', 'hidePageLoading'])
    }
}
</script>

<style lang="scss">
    @import "../../layouts/css/graph/charts";
    .tableChart{
        height: 294px;
        overflow: hidden;
        padding: 0 5px;
        line-height: 0
    }
</style>
