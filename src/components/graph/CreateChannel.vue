<template>
    <div class="chartMainBox">
        <create-garph-menus :editbasedata="editTitle" :name="titleName" :is-detail="isDetail" @saveCreGraph="createChannelMap"></create-garph-menus>
        <el-container class="chartMain">
            <el-aside width="470px">
                <ChannelSource :source-type="`channels`" @singleinfo="selectChannelid"></ChannelSource>
                <div class="userBox">
                    <target-user :name="'2.选择目标用户'" :default-single-choos-value="channelMapDetailList.groupName" :event-type="`channel`" @selectUser="selectUser"></target-user>
                </div>
                <filter-creat :name="'3.过滤条件'" :selected-list-info="fieldsCondition" @selects="selectBox"></filter-creat>
            </el-aside>
            <el-main>
                <no-data-stone v-show="!channelId"></no-data-stone>
                <div v-show="channelId" class="chartBodyBox">
                    <div class="chartHead">
                        <el-row>
                            <el-col :span="12">
                                <el-radio-group v-model="chartStatus" size="mini" @change="chartChange">
                                    <el-radio-button :label="1">新增用户</el-radio-button>
                                    <el-radio-button :label="2">活跃用户</el-radio-button>
                                </el-radio-group>
                            </el-col>
                            <el-col :span="12">
                                <div class="textRight">
                                    <div class="timeBolck">
                                        <date-picker :get-cyclce="editTime" @getDateValue="getDateInfo"></date-picker>
                                    </div>
                                    <el-button :class="{'active': !chartType}" class="chartTypeIco" @click="changeChartType('bar')"><i class="icon-chart-bar"></i></el-button>
                                    <el-button :class="{'active': chartType}" class="chartTypeIco" @click="changeChartType('line')"><i class="icon-chart-line"></i></el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div id="channelChartBar" class="chartBox"></div>
                </div>
            </el-main>
        </el-container>

    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex' //eslint-disable-line
import M from '../../utils/misc'
import FilterCreat from '../../components/creatSingle/FilterCreat'
import DatePicker from '../../components/datePicker.vue'
import TargetUser from '../../components/TargetUser.vue'
import ChannelSource from '../../components/creatSingle/ChannelSource'
import CreateGarphMenus from '../creatSingle/CreTopMenu'
import D from '../../utils/changeDate'
import NoDataStone from '../../components/NoData' // 无数据
export default {
    name: 'CreateChannel',
    components: {
        FilterCreat,
        DatePicker,
        TargetUser,
        ChannelSource,
        CreateGarphMenus,
        NoDataStone
    },
    data() {
        return {
            chartData: {},
            editTitle: {
                graphName: '',
                graphDescription: ''
            },
            chartStatus: '1',
            channelChartBar: null,
            chartType: false,
            userGroup: '',
            channelId: '',
            dateList: [M.formatDate(new Date(), 'yyyy/MM/dd'), M.formatDate(new Date(new Date().getTime() - 8.64e7), 'yyyy/MM/dd')],
            editTime: '',
            fieldsCondition: {allList: [], conditionType: ''},
            isDetail: this.$route.query.mode && this.$route.query.mode === 'detail',
            titleName: this.$route.query.mode && this.$route.query.mode === 'edit' ? '编辑渠道分析' : (this.$route.query.mode && this.$route.query.mode === 'detail' ? '查看渠道分析' : '新建渠道分析')
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId,
            channelList: ({graph}) => graph.channelList,
            channelQueryGroupList: ({graph}) => graph.channelQueryGroupList,
            channelMapDetailList: ({graph}) => graph.channelMapDetailList
        }),
        editChannelId () {
            return this.$route.query.editid
        }
    },
    mounted() {
        // console.log(M.formatDate(new Date(), 'yyyy/MM/dd'))
        // console.log(M.formatDate(new Date(new Date().getTime() - 8.64e7), 'yyyy/MM/dd'))
        if (this.editChannelId) {
            this.graphQueryChannelMapAction({appid: this.appId, id: this.editChannelId}).then(() => {
                this.fieldsCondition = {
                    allList: this.channelMapDetailList.fields,
                    conditionType: this.channelMapDetailList.conditiontype === 1 ? 'OR' : 'AND'
                }
                this.chartStatus = this.channelMapDetailList.chartStatus // 新增 活跃展示radio
                this.chartType = this.channelMapDetailList.chartType === 2 // 折线 柱状图
                // this.editTime = this.channelMapDetailList.starttime ? `${this.channelMapDetailList.starttime.split(' ')[0].replace(/-/g, '/')}-${this.channelMapDetailList.endtime.split(' ')[0].replace(/-/g, '/')}` : `${this.dateList[0]}-${this.dateList[1]}`
                this.editTime = this.channelMapDetailList.cyclcetime > 0 ? (this.channelMapDetailList.cyclcetime === 1 ? '昨天' : `过去${this.channelMapDetailList.cyclcetime}天`) : this.channelMapDetailList.starttime.substring(0, 10).replace(/-/g, '/') + '-' + this.channelMapDetailList.endtime.substring(0, 10).replace(/-/g, '/')
                this.dateList = {
                    startTime: this.channelMapDetailList.starttime.substring(0, 10).replace(/-/g, ''),
                    endTime: this.channelMapDetailList.endtime.substring(0, 10).replace(/-/g, '')
                }
                this.editTitle = {
                    graphName: this.channelMapDetailList.name,
                    graphDescription: this.channelMapDetailList.comments
                }
                this.channelId = this.channelMapDetailList.channelid
                this.userGroup = this.channelMapDetailList.groupId
                this.getChartData()
            })
        } else {
            // 默认过去7天
            let t = D.getWeekDate()
            this.dateList = {
                startTime: t[0].replace(/\//g, ''),
                endTime: t[1].replace(/\//g, '')
            }
            this.editTime = '过去7天'
            this.userGroup = 0
            this.channelMapDetailList.groupName = '全部用户'
            this.dateList.circleTime = 7
        }
    },
    methods: {
        createChannelMap(obj) {
            if (this.channelId === '') {
                this.$message.warning('未选择渠道')
                return
            }
            if (this.userGroup === '') {
                this.$message.warning('未选择目标用户')
                return
            }
            if (JSON.stringify(this.fieldsCondition.allList).indexOf('""') !== -1 && this.fieldsCondition.allList.length > 0) {
                this.$message.warning('过滤条件请填全')
                return
            }
            let params = {
                id: this.editChannelId,
                appid: this.appId,
                name: obj.name,
                comments: obj.discreption,
                chartType: this.chartType ? 2 : 1, // ,chartType(1柱状，2折线)
                chartStatus: this.chartStatus,
                channelid: this.channelId,
                cyclce: 1, // 1日2周 3月
                conditiontype: this.fieldsCondition.conditionType === 'AND' ? 0 : 1,
                cyclcetime: this.dateList.circleTime,
                starttime: this.dateList.startTime,
                endtime: this.dateList.endTime,
                groupid: this.userGroup,
                fields: JSON.stringify(this.fieldsCondition.allList)
            }
            let inovke = this.editChannelId ? 'graphUpdateChannelMapAction' : 'graphCreateChannelMapAction'
            this[inovke](params).then(() => {
                this.$router.replace({path: `/graph/channel`})
            })
        },
        chartChange() {
            console.log(this.chartStatus)
            this.defaultCharts()
        },
        selectBox(filter) {
            this.fieldsCondition = filter
            this.$nextTick(() => {
                this.getChartData()
            })
        },
        selectUser(obj) {
            this.userGroup = obj.id
            this.$nextTick(() => {
                this.getChartData()
            })
        },
        selectChannelid(obj) {
            this.channelId = obj.id
            this.$nextTick(() => {
                this.getChartData()
            }, 500)
        },
        getDateInfo(v) {
            this.dateList = v
            this.$nextTick(() => {
                this.getChartData()
            })
        },
        changeChartType(e) {
            if (e === 'line') {
                this.chartType = true
            } else {
                this.chartType = false
            }
            this.defaultCharts()
        },
        getChartData() {
            // 校验
            if (!this.channelId || (JSON.stringify(this.fieldsCondition.allList).indexOf('""') !== -1 && this.fieldsCondition.allList.length > 0) || !this.dateList.startTime || !this.dateList.endTime) {
                return
            }
            let params = {
                appid: this.appId,
                channelid: this.channelId,
                groupId: this.userGroup,
                conditiontype: this.fieldsCondition.conditionType === 'AND' ? 0 : 1,
                fields: JSON.stringify(this.fieldsCondition.allList),
                starttime: this.dateList.startTime,
                endtime: this.dateList.endTime
            }
            this.graphGetChannelMapIndexAction(params).then(res => {
                let dataX = []
                let dataNum = []
                let adataX = []
                let adataNum = []
                res.increaseUserList.filter(item => {
                    let week = D.getWeekName(item.groupField)
                    dataX.push(item.groupField.replace(/-/g, '/').substring(5, 10) + week)
                    dataNum.push(item.countNum)
                })
                res.activeUserList.filter(item => {
                    let week = D.getWeekName(item.groupField)
                    adataX.push(item.groupField.replace(/-/g, '/').substring(5, 10) + week)
                    adataNum.push(item.countNum)
                })
                this.chartData = {
                    increaseUserList: {
                        dataX: dataX,
                        dataNum: dataNum
                    },
                    activeUserList: {
                        dataX: adataX,
                        dataNum: adataNum
                    }
                }
                this.defaultCharts()
            })
        },
        defaultCharts() {
            let dataNum = parseInt(this.chartStatus) === 1 ? this.chartData.increaseUserList : this.chartData.activeUserList
            // if (!dataNum.dataNum) { return }
            let seriesLis = [
                {
                    name: parseInt(this.chartStatus) === 1 ? '新增用户' : '活跃用户',
                    type: 'bar',
                    smooth: true,
                    barMaxWidth: 22,
                    itemStyle: {
                        normal: {
                            color: '#74BB5C'
                        }
                    },
                    data: dataNum.dataNum
                },
                {
                    name: parseInt(this.chartStatus) === 1 ? '新增用户' : '活跃用户',
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
                    data: dataNum.dataNum
                }]
            let series = this.chartType ? seriesLis[1] : seriesLis[0]
            this.channelChartBar && this.channelChartBar.clear()
            this.channelChartBar = this.$echarts.init(document.getElementById('channelChartBar'))
            this.channelChartBar.setOption({
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
                grid: {
                    top: 35,
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
                    data: dataNum.dataX
                },
                yAxis: [
                    {
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
                    {
                        type: 'value',
                        max: 100,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#6D7684'
                            },
                            formatter: '{value} %'
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    series
                ]
            })
        },
        ...mapActions(['graphGetChannelListAction', 'graphGetChannelQueryGroupListAction', 'graphCreateChannelMapAction', 'graphQueryChannelMapAction', 'graphUpdateChannelMapAction', 'graphGetChannelMapIndexAction'])
    }
}
</script>

<style scoped lang="scss">
    @import "../../layouts/css/createSingle/eventChannel.scss";
    .icon-chart-bar{
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url("../../layouts/images/icon/icon-chart-bar-gray.png") no-repeat center;
        background-size: contain;
    }
    .icon-chart-line{
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url("../../layouts/images/icon/icon-chart-line-gray.png") no-repeat center;
        background-size: contain;
    }
    .active{
        .icon-chart-bar{
            background: url("../../layouts/images/icon/icon-chart-bar.png") no-repeat center;
            background-size: contain;
        }
        .icon-chart-line{
            background: url("../../layouts/images/icon/icon-chart-line.png") no-repeat center;
            background-size: contain;
        }
    }
</style>
