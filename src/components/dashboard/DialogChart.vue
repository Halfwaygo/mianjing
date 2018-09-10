<template>
    <el-container direction="vertical" class="dialog-chart">
        <div class="icon-header title-header">
            <span class="header-title-text">{{ name }}</span><br>
            <span class="header-title-date">{{ date }}</span><br>
        </div>
        <div v-show="showtype === 3" class="icon-main charts-main">
            <el-table
                :data="chartObj.tableData3"
                height="350"
                border
                style="width: 100%">
                <el-table-column v-for="(hItem, i) in chartObj.tableHead" :key="i" :prop="hItem.prop " :label="hItem.name">
                </el-table-column>
            </el-table>
        </div>
        <div v-show="showtype !== 3" id="mainIdDialog" class="icon-main charts-main"></div>
    </el-container>
</template>
<script>
import Api from '../../utils/api.js'
import { mapState, mapActions } from 'vuex'
import createChart from '../../constants/chartOption/eventOption'
import weekDate from '../../utils/changeDate'
export default {
    name: 'DialogChart',
    props: {
        defaultValue: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            chartObj: {},
            date: '',
            name: '',
            showtype: 0
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    watch: {
        defaultValue(newValue, old) {
            this.chartObj = newValue
            this.initData()
        }
    },
    beforeMount() {
    },
    mounted() {
        this.chartObj.id && this.initData()
    },
    methods: {
        initData() {
            this.chartObj.options = {}
            this.showtype = 0
            this.name = this.chartObj.name
            this.showPageLoading()
            this.chartObj.type === 0 && this.getEventData()
            this.chartObj.type === 1 && this.getFunnelsData()
            this.chartObj.type === 2 && this.getRetention()
            this.chartObj.type === 3 && this.getChannelData()
            this.chartObj.type === 4 && this.getCluster()
        },
        getEventData() {
            // 事件分析
            Api.graphQueryEventMap({appId: this.appId, id: this.chartObj.id}).then(chart => {
                this.date = chart.starttime.substring(0, 10).replace(/-/g, '/') + '-' + chart.endtime.substring(0, 10).replace(/-/g, '/')
                this.chartObj.updatetime = chart.updatetime.substring(0, 10).replace(/-/g, '/')
                this.chartObj.createUser = chart.createUser
                this.showtype = chart.showtype
                this.chartObj.dataObj = chart
                if (chart.showtype === 3) {
                    // 表格
                    this.chartObj.tableHead = []
                    this.chartObj.tableData3 = []
                    this.tableChart()
                } else {
                    this.chartObj.chart = this.$echarts.init(document.getElementById('mainIdDialog'))
                    this.chartObj.chart && this.chartObj.chart.clear()
                    this.chartObj.chart.showLoading({
                        text: '正在加载',
                        color: '#409EFF'
                    })
                    this.dataCell()
                }
            })
        },
        getFunnelsData() {
            // 漏斗分析
            Api.graphQueryFunnelMap({ id: this.chartObj.id }).then(res => {
                this.hidePageLoading()
                this.date = res.starttime.substring(0, 10).replace(/-/g, '/') + '-' + res.endtime.substring(0, 10).replace(/-/g, '/')
                this.chartObj.updatetime = res.updatetime.substring(0, 10).replace(/-/g, '/')
                this.chartObj.createUser = res.createUser
                this.chartObj.dataObj = res
                this.chartObj.chart = this.$echarts.init(document.getElementById('mainIdDialog'))
                this.chartObj.chart && this.chartObj.chart.clear()
                this.chartObj.chart.showLoading({
                    text: '正在加载',
                    color: '#409EFF'
                })
                // 漏斗的数据接口
                let obj = {}
                obj.appId = this.appId
                obj.name = 'mr'
                obj.type = 1
                obj.startTime = res.starttime.split(' ')[0].replace(/-/g, '')
                obj.endTime = res.endtime.split(' ')[0].replace(/-/g, '')
                obj.cyclceTime = res.cyclcetime
                obj.cyclce = res.cyclce
                obj.conditionType = res.conditiontype === 'AND' ? '0' : '1'
                obj.groupId = res.groupId
                // obj.fields = JSON.stringify(res.fields)
                let fieldsLS = []
                res.fields.forEach(item => {
                    let fildObj = {}
                    fildObj.fieldId = item.fieldId
                    fildObj.value = item.value
                    fildObj.type = item.type
                    fieldsLS.push(fildObj)
                })
                obj.fields = JSON.stringify(fieldsLS)
                let newIndexs = []
                res.indexs.forEach((item, index) => {
                    newIndexs.push({
                        'selectId': item.id,
                        'innerType': item.innerType,
                        'orderNum': index + 1
                    })
                })
                obj.indexs = JSON.stringify(newIndexs)
                Api.graphGetFunnelMapIndex(obj).then(res2 => {
                    let daysArr = []
                    let rateArr = []
                    for (let item in res2.daysData) {
                        let {out, rate} = res2.daysData[item]
                        let t = new Date(parseInt(item))
                        let day = `${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                        daysArr.push(day)
                        rateArr.push({'name': out, 'value': rate.toFixed(3)})
                    }
                    createChart.funnelsOption.xAxis.data = daysArr
                    createChart.funnelsOption.series[0].data = rateArr
                    this.chartObj.chart.setOption(createChart.funnelsOption)
                    this.chartObj.chart.hideLoading()
                })
            })
        },
        getRetention() {
            // 留存分析
            this.graphQueryRetainMapAction({id: this.chartObj.id}).then(chart => {
                this.hidePageLoading()
                this.date = chart.starttime.substring(0, 10).replace(/-/g, '/') + '-' + chart.endtime.substring(0, 10).replace(/-/g, '/')
                this.chartObj.updatetime = chart.updatetime.substring(0, 10).replace(/-/g, '/')
                this.chartObj.createUser = chart.createUser
                this.chartObj.dataObj = chart
                this.chartObj.chart = this.$echarts.init(document.getElementById('mainIdDialog'))
                this.chartObj.chart && this.chartObj.chart.clear()
                this.chartObj.chart.showLoading({
                    text: '正在加载',
                    color: '#409EFF'
                })
                // 留存的数据接口
                let fieldsList = chart.fields.map(item => {
                    let params = {
                        fieldId: item.fieldId,
                        fieldName: item.fieldName,
                        type: item.type,
                        value: item.value
                    }
                    return params
                })
                let mapIndex = {
                    appId: chart.appid,
                    firstId: chart.behavior1,
                    secondId: chart.behavior2,
                    cycle: chart.cyclce,
                    startTime: chart.starttime.split(' ')[0].replace(/-/g, ''),
                    endTime: chart.endtime.split(' ')[0].replace(/-/g, ''),
                    conditionType: chart.conditiontype,
                    groupId: chart.groupId, // result.groupId, 目标用户暂时不用，分群分析处理好之后添加，
                    fields: JSON.stringify(fieldsList)
                }
                Api.graphGetRetainMapIndex(mapIndex).then(detail => {
                    let daysList = []
                    let dataList = []
                    detail[0].filter((item, k) => {
                        let days = ''
                        if (chart.cyclce === 1) {
                            days = k === 0 ? '当日' : k === 1 ? '次日' : `${k}日后`
                        } else if (chart.cyclce === 2) {
                            days = k === 0 ? '当周' : k === 1 ? '次周' : `${k}周后`
                        } else {
                            days = k === 0 ? '当月' : k === 1 ? '次月' : `${k}月后`
                        }
                        daysList.push(days)
                        dataList.push(parseFloat(item.ratio) / 100)
                    })
                    this.chartObj.options = createChart.retentionChartOption
                    this.chartObj.options.xAxis.data = daysList
                    this.chartObj.options.series[0].data = dataList
                    this.chartObj.chart.setOption(this.chartObj.options)
                    this.chartObj.chart.hideLoading()
                })
            })
        },
        getChannelData() {
            // 渠道分析
            this.graphQueryChannelMapAction({id: this.chartObj.id}).then(chart => {
                this.hidePageLoading()
                this.date = chart.starttime.substring(0, 10).replace(/-/g, '/') + '-' + chart.endtime.substring(0, 10).replace(/-/g, '/')
                this.chartObj.updatetime = chart.updatetime.substring(0, 10).replace(/-/g, '/')
                this.chartObj.createUser = chart.createUser
                this.chartObj.dataObj = chart
                this.chartObj.chart = this.$echarts.init(document.getElementById('mainIdDialog'))
                this.chartObj.chart && this.chartObj.chart.clear()
                this.chartObj.chart.showLoading({
                    text: '正在加载',
                    color: '#409EFF'
                })
                let fieldList = []
                chart.fields.forEach(f => {
                    fieldList.push({
                        fieldId: f.fieldId,
                        type: f.type,
                        value: f.value
                    })
                })
                let params = {
                    appid: chart.appid,
                    channelid: chart.channelid,
                    groupId: chart.groupId,
                    conditiontype: chart.conditiontype,
                    fields: JSON.stringify(fieldList),
                    starttime: chart.starttime.split(' ')[0].replace(/-/g, ''),
                    endtime: chart.endtime.split(' ')[0].replace(/-/g, '')
                }
                this.graphGetChannelMapIndexAction(params).then(result => {
                    this.chartObj.options = createChart.channelChartOption
                    let dataX = []
                    let dataNum = []
                    let datalist = chart.chartStatus === '1' ? result.increaseUserList : result.activeUserList
                    datalist.filter(item => {
                        let week = weekDate.getWeekName(item.groupField)
                        dataX.push(item.groupField.replace(/-/g, '/').substring(5, 10) + week)
                        dataNum.push(item.countNum)
                    })
                    let seriesLis = [
                        {
                            name: '新用户流失量',
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
                            name: '新用户流失量',
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
                    let series = chart.chartType === 2 ? seriesLis[1] : seriesLis[0]
                    this.chartObj.options.xAxis.data = dataX
                    this.chartObj.options.series = series
                    this.chartObj.chart.setOption(this.chartObj.options)
                    this.chartObj.chart.hideLoading()
                })
            })
        },
        getCluster(item, index) {
            // 分群分析
            console.log('分群' + index)
        },
        tableChart() {
            // 表格 多指标和多维度 如果维度中有选择时间，粒度可选择，如果没有，删除粒度的值
            // delete params['cycle']  表格的接口是单独的
            let chartData = this.chartObj.dataObj
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
                cyclceTime: chartData.cyclceTime,
                startTime: chartData.starttime.substring(0, 10).replace(/-/g, ''),
                endTime: chartData.endtime.substring(0, 10).replace(/-/g, ''),
                fields: JSON.stringify(fieldsList),
                groupId: chartData.groupId,
                dimensionIds: dimensionList
            }
            Api.graphGerEventTableMapIndex(params).then(res => {
                this.hidePageLoading()
                // 表格
                // 表格的头部信息只取一次
                let t = Object.keys(res[0][0])
                // 如果有周的粒度，返回两个值，删除其中一个
                let index = t.indexOf('WEEK_END')
                if (index > -1) {
                    t.splice(index, 1)
                }
                if (this.chartObj.tableHead.length <= 0) {
                    for (let j = 0; j < t.length - 1; j++) {
                        this.chartObj.tableHead.push({
                            name: chartData.dimentions[j].name,
                            prop: t[j]
                        })
                    }
                }
                res.forEach((tl, i) => {
                    this.chartObj.tableHead.push({
                        name: chartData.indexs[i].name,
                        prop: chartData.indexs[i].id
                    })
                    // 第一次指标的记录维度的信息  后面的指标参数直接嵌入
                    if (this.chartObj.tableData3.length > 0) {
                        this.chartObj.tableData3.forEach((item, k) => {
                            item[chartData.indexs[i].id] = tl[k].COUNTNUM
                        })
                    } else {
                        tl.forEach(item => {
                            item[chartData.indexs[i].id] = item.COUNTNUM
                            // 如果有时间的
                            if (item.WEEK_BEGIN) {
                                item.WEEK_BEGIN = item.WEEK_BEGIN.replace(/-/g, '/').substring(5, 10) + '-' + item.WEEK_END.replace(/-/g, '/').substring(5, 10)
                            }
                        })
                        this.chartObj.tableData3 = tl
                    }
                })
                this.$forceUpdate()
            })
        },
        dataCell() {
            let chartData = this.chartObj.dataObj
            // 数据接口
            // 指标
            // let targetList = []
            if (chartData.showtype === 0 || chartData.showtype === 2) {
                // 线性 或 纵向柱状图
                this.chartObj.options = createChart.chart1Optine
                this.chartObj.options.series = []
            } else if (chartData.showtype === 1) {
                // 横向柱状图
                this.chartObj.options = createChart.chart2Option
            } else if (chartData.showtype === 4) {
                // 数值图
                this.chartObj.options = createChart.chart5Option
                this.chartObj.options.series = []
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
                        cyclceTime: chartData.cyclceTime,
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
                        params.dimensionIds = dimensionList
                    }
                    if (chartData.showtype === 4) {
                        // 数值图 单指标和颜色S
                        delete params['cycle']
                        params.comparedStartTime = chartData.comparedStartTime.substring(0, 10).replace(/-/g, '')
                        params.comparedEndTime = chartData.comparedEndTime.substring(0, 10).replace(/-/g, '')
                    }
                    Api.graphGetEventMapIndex(params).then(res => {
                        this.hidePageLoading()
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
                            this.chartObj.options.xAxis.data = chartTime
                            this.chartObj.options.legend.data = legendName
                            this.chartObj.options.series = targetDataList
                            this.chartObj.chart.setOption(this.chartObj.options)
                            this.chartObj.chart.hideLoading()
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
                            this.chartObj.options.yAxis.data = chart2Time
                            this.chartObj.options.series[0].label = label
                            this.chartObj.options.series[0].data = datList
                            // this.line2Res.option.series.push(ser)
                            this.chartObj.chart.setOption(this.chartObj.options)
                            this.chartObj.chart.hideLoading()
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
                            this.chartObj.options.xAxis.data = chart5Time
                            this.chartObj.options.series = targetDataList
                            this.chartObj.chart.setOption(this.chartObj.options)
                            this.chartObj.chart.hideLoading()
                        }
                    })
                }
            }
        },
        ...mapActions(['graphQueryRetainMapAction', 'graphQueryChannelMapAction', 'graphGetChannelMapIndexAction', 'showPageLoading', 'hidePageLoading'])
    }
}
</script>

<style scoped lang="scss">
.dialog-chart{
    padding: 5px;
    height: 270px;
    .charts-main{
        height:210px;
    }
}
</style>
