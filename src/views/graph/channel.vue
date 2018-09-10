<template>
    <div class="charts-section mainBox">
        <dynamic-items
            :total="channelItemList.totalCount"
            :page-no="channelItemList.pageNo"
            @sizeChange="onPageSizeChange"
            @pagination="onPagination">
            <div v-show="$parent.isGridShow" class="list-container" >
                <el-row :gutter="20">
                    <el-col v-for="chart in channellist" :span="12" :key="chart.id">
                        <div class="items-form">
                            <div class="title">
                                <div class="name">{{ chart.name }}</div>
                                <div class="time">{{ startEndDate(chart) }}</div>
                                <div class="behavior">
                                    <span class="box">渠道来源 <span class="graySpan">{{ chart.channelname }}</span></span>
                                    <span class="box">目标用户 <span class="graySpan">{{ chart.groupName }}</span></span>
                                </div>
                            </div>
                            <div :id="`cid${chart.id}`" class="charts-line" @click="detail(chart.id)"></div>
                            <image-presenter :type="chart.loadingResultType"></image-presenter>
                            <div class="icon-edit">
                                <div class="modify-info">{{ modifyDateInfo(chart) }}</div>
                                <div class="edit-btn">
                                    <i class="icon-add-gray" @click="addToDa(chart.id, chart.name)"></i>
                                    <i class="icon-edit-img" @click="editDa(chart.id)"></i>
                                    <i class="icon-delete-gray" @click="deleChart(chart)"></i>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12"></el-col>
                </el-row>
            </div>
            <div v-show="!$parent.isGridShow" class="table-container">
                <table-list
                    :table-data="channellist" :is-loading="isLoading">
                    <el-table-column
                        width="40">
                    </el-table-column>
                    <el-table-column
                        label="类型">
                        <template slot-scope="scope">
                            <span>渠道分析</span>
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
                        prop="updatetime"
                        label="最后更新时间">
                        <template slot-scope="scope">
                            <span>{{ formatterUpdateDate(scope.row) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="300px"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="iconI" icon="el-icon-plus" @click="addToDa(scope.row.id, scope.row.name)"></el-button>
                            <el-button type="text" size="small" class="iconI" icon="el-icon-edit-outline" @click="editDa(scope.row.id)"></el-button>
                            <el-button type="text" size="small" class="iconI" icon="el-icon-delete" @click="deleChart(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </table-list>
            </div>
        </dynamic-items>
        <dialog-add-dash-board :create-dash-board-dialog-visible="dialogVisible" @closeDialog="closeBoardDialog" @addDashBoard="createMapToBoard"></dialog-add-dash-board>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
// import M from '../../utils/misc'
import Api from '../../utils/api'
import DynamicItems from '../../components/common/DynamicItems'
import TableList from '../../components/common/TableList'
import DialogAddDashBoard from '../../components/common/DialogAddDashboard'
import ImagePresenter from '../../components/ImagePresenter'
import D from '../../utils/changeDate'
import createChart from '../../constants/chartOption/eventOption'
import PlatformMixin from '../../mixins/platform'

export default {
    name: 'ChannelCharts',
    components: {
        DynamicItems,
        TableList,
        DialogAddDashBoard,
        ImagePresenter
    },
    mixins: [PlatformMixin],
    data() {
        return {
            searchModel: '',
            dialogVisible: false,
            addToname: '',
            addChart: {
                id: '',
                name: ''
            },
            isChart: true,
            chartsData: [{
                type: '事件分析',
                name: 'Android活跃用户数',
                creatName: '小马工',
                lastTime: '2018/01/03',
                id: 1,
                chart: null
            }, {
                type: '事件分析',
                creatName: '小马工',
                lastTime: '2018/01/03',
                name: '单图标题名2',
                id: 2,
                chart: null
            }, {
                type: '事件分析',
                creatName: '小马工',
                lastTime: '2018/01/03',
                name: '单图标题名3',
                id: 3,
                chart: null
            }],
            channellist: [],
            isLoading: true,
            sortable: 'sort-desc'
        }
    },
    computed: {
        isShowGrid () {
            return this.$parent.isGridShow
        },
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId,
            channelItemList: ({graph}) => graph.channelMapList,
            channelDetailList: ({graph}) => graph.channelMapDetailList,
            channelMapIndexData: ({graph}) => graph.channelMapIndexData
        })
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
        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.chartsData.forEach(res => {
            // this.defaultCharts(res)
            // })
            this.refreshPage({})
        })
    },
    methods: {
        searchFilter(name) {
            this.refreshPage({name: name})
        },
        formatterUpdateDate(r) {
            // return r.updatetime.split(' ')[0]
            return r.updatetime
        },
        // createMapToBoard添加单图到看板 3是固定的渠道创建id
        createMapToBoard(bid) {
            let params = {
                appId: this.appId,
                boardId: bid,
                data: JSON.stringify([{type: 3, id: this.addChart.id, name: this.addChart.name}])
            }
            Api.addSingleMap(params).then(res => {
                this.$alerts({
                    type: 'success',
                    content: '添加单图到看板成功'
                })
            })
        },
        startEndDate(msg) {
            let start = msg.starttime ? msg.starttime.substring(0, 10).replace(/-/g, '/') : ''
            let end = msg.endtime ? msg.endtime.substring(0, 10).replace(/-/g, '/') : ''
            return start && end ? `${start}-${end}` : ''
            // return msg.createtime
        },
        modifyDateInfo(msg) {
            let upTime = msg.updatetime.split(' ')[0].replace(/-/g, '/')
            return `${msg.createUser}修改于${upTime}`
        },
        refreshPage(other) {
            this.showPageLoading()
            // 刷新页面数据
            let params = {
                appid: this.appId,
                name: '',
                pageno: 1,
                pagesize: 10,
                ...other
            }
            this.graphGetChannelMapListAction(params).then(() => {
                this.hidePageLoading()
                this.getChannelQueryMap()
            })
        },
        getChannelQueryMap() {
            this.isLoading = true // loading初始化
            this.channellist = []
            this.channelItemList.result.map((item, index) => {
                this.channellist.push(item)
                this.graphQueryChannelMapAction({id: item.id}).then(res => {
                    this.isLoading = false // loading关闭  res含starttime 需要转驼峰
                    let paramsMap = {
                        appid: res.appid,
                        channelid: res.channelid,
                        groupId: res.groupId,
                        conditiontype: res.conditiontype,
                        fields: res.fields,
                        starttime: res.starttime,
                        endtime: res.endtime,
                        name: res.name,
                        id: res.id,
                        updatetime: res.updatetime,
                        chartType: res.chartType,
                        chartStatus: res.chartStatus,
                        createUser: item.createUser,
                        channelname: res.channelname,
                        groupName: res.groupName
                    }
                    for (let key in paramsMap) {
                        if (paramsMap.hasOwnProperty(key) && (paramsMap[key] === null || paramsMap[key] === undefined || paramsMap[key] === '')) {
                            delete paramsMap[key]
                        }
                    }
                    return paramsMap
                }).then(res => {
                    res.chart = this.$echarts.init(document.getElementById(`cid${item.id}`))
                    res.chart.showLoading({
                        text: '正在加载',
                        color: '#409EFF'
                    })
                    let date = D.getYesterday()
                    let fieldList = []
                    res.fields.forEach(f => {
                        fieldList.push({
                            fieldId: f.fieldId,
                            type: f.type,
                            value: f.value
                        })
                    })
                    let params = {
                        appid: res.appid,
                        channelid: res.channelid,
                        groupId: res.groupId,
                        conditiontype: res.conditiontype,
                        fields: JSON.stringify(fieldList),
                        starttime: res.starttime ? res.starttime.split(' ')[0].replace(/-/g, '') : date[1],
                        endtime: res.endtime ? res.endtime.split(' ')[0].replace(/-/g, '') : date[1]
                    }
                    this.graphGetChannelMapIndexAction(params).then(result => {
                        res = (Object.assign(res, result))
                        this.$set(this.channellist, index, res)
                        // this.channellist.push(res)
                    }).then(() => {
                        this.defaultCharts(this.channellist[index], index)
                    }).catch(() => {
                        res.chart.hideLoading()
                        res.chart.dispose()
                        this.markLoadingFailed(this.channellist[index])
                    })
                })
            })
            // this.channellist.sort(M.resetSort('name')).reverse()
        },
        sortTimeHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable, on: {click: this.changeSort}})])
        },
        changeSort() {
            this.sortable = this.sortable === 'sort-desc' ? 'sort-asc' : 'sort-desc'
            this.channellist.reverse()
        },
        addToDa(id, name) {
            this.dialogVisible = true
            this.addChart.id = id
            this.addChart.name = name
        },
        sureAdd() {
            this.dialogVisible = false
            console.log('添加了' + this.addChart.name)
        },
        onPageSizeChange() {
            // 翻页
        },
        onPagination() {},
        closeBoardDialog() {
            this.dialogVisible = false
        },
        editDa(id) {
            this.$router.push({path: `/graph/new?mode=edit&type=graphChannel&editid=${id}`})
        },
        detail(id) {
            this.$router.push({path: `/graph/new?mode=detail&type=graphChannel&editid=${id}`})
        },
        deleChart(msg) {
            this.$confirm(`此操作会导致该单图从看板中移除。删除后不可恢复，是否确定删除？`, '删除单图', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                // 删除后刷新页面
                this.graphDelChannelMapAction({id: msg.id}).then(() => {
                    this.refreshPage()
                })
                this.$alerts({
                    type: 'success',
                    content: '删除看板成功'
                })
            }).catch(() => {
            })
        },
        defaultCharts(res, index) {
            // 1新增increaseUserList 2活跃activeUserList
            res.options = createChart.channelChartOption
            let dataX = []
            let dataNum = []
            let datalist = parseInt(res.chartStatus) === 1 ? res.increaseUserList : res.activeUserList
            datalist.filter(item => {
                let week = D.getWeekName(item.groupField)
                dataX.push(item.groupField.replace(/-/g, '/').substring(5, 10) + week)
                dataNum.push(item.countNum)
            })
            let seriesLis = [
                {
                    name: parseInt(res.chartStatus) === 1 ? '新增用户' : '活跃用户',
                    type: 'bar',
                    smooth: true,
                    barMaxWidth: 22,
                    itemStyle: {
                        normal: {
                            color: '#74BB5C'
                        }
                    },
                    data: dataNum
                },
                {
                    name: parseInt(res.chartStatus) === 1 ? '新增用户' : '活跃用户',
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#F35974'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(237,63,97,0.2)'
                            }, {
                                offset: 1,
                                color: '#ffffff'
                            }])
                        }
                    },
                    data: dataNum
                }]
            let series = res.chartType === 2 ? seriesLis[1] : seriesLis[0]
            res.options.xAxis.data = dataX
            res.options.series = series
            this.channellist[index].chart.setOption(res.options)
            res.chart.hideLoading()
        },
        ...mapActions(['showPageLoading', 'hidePageLoading', 'graphGetChannelMapListAction', 'graphQueryChannelMapAction', 'graphGetChannelMapIndexAction', 'graphDelChannelMapAction'])
    }
}
</script>

<style lang="scss">
@import "../../layouts/css/graph/charts";
.table-container{
    i.sort-desc{
        background: url("../../layouts/images/icon/icon-down-blue.png") no-repeat;
        background-size: contain;
        height: 12px;
        width: 9px;
        display: inline-block;
        margin-left: 5px;
        translation: all ease-in-out .3s ;
    }
    i.sort-asc{
        background: url("../../layouts/images/icon/icon-down-blue.png") no-repeat;
        transform: rotateZ(180deg);
        background-size: contain;
        height: 12px;
        width: 9px;
        display: inline-block;
        margin-left: 5px;
        translation: all ease-in-out .3s ;
    }
}
</style>
