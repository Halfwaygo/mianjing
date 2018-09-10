<template>
    <div class="dashboard-summary">
        <!-- <ve-line :data="chartData"></ve-line> -->
        <div class="top-menu">
            <div v-if="platform === '0'">
                <div class="menu-button">
                    <el-radio-group v-model="choicesType" size="small" class="topBtnGroup">
                        <el-radio-button label="全部"></el-radio-button>
                        <el-radio-button label="IOS"></el-radio-button>
                        <el-radio-button label="Android"></el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div class="time-button">
                <!-- 昨日 -->
                <date-picker @getDateValue="getDateInfo"></date-picker>
            </div>
        </div>
        <div class="el-layout-height">
            <el-row :gutter="10" type="flex" class="row-bg" justify="space-around">
                <el-col v-for="(item, index) in platform === '0' ? faceOptions : webFaceOptions" :span="platform === '0' ? 5 : 6" :key="index" :class="{'is-enter': isEnter[index+1]}" class="face-block flip-container">
                    <div class="flipper">
                        <div class="front">
                            <!-- 前面内容 -->
                            <div :class="filterIcon(index)" class="face-block-num user-num">
                                {{ filterNum(item.num) }}<span v-show="index==4" class="second">/秒</span>
                            </div>
                            <div class="face-block-title" ontouchstart="this.classList.toggle('hover');">
                                <span class="tro-title">{{ item.title }}</span>
                                <span class="qus" @mouseenter="mouseEnter(index+1)">?</span>
                            </div>
                        </div>

                        <div class="back" @mouseleave="mouseLeave(index+1)">
                            <!-- 背面内容 -->
                            {{ item.tro }}
                        </div>
                    </div>
                </el-col>

            </el-row>

        </div>

        <div v-show="platform === '0'" class="show-echarts">
            <div class="show-echarts-line">
                <el-row :gutter="16">
                    <el-col v-for="(item, index) in lineOptions" :span="12" :key="index" class="grid-content bg-purple show-echarts-b">
                        <div style="background-color:#fff" class="show-prove-s">
                            <div class="show-prove">

                                <div class="com-prove-num">
                                    <el-tooltip :content="item.tro" class="item" effect="dark" placement="right-start">
                                        <div class="show-prove-title">
                                            <div class="tro">{{ item.label }}</div>
                                        </div>
                                    </el-tooltip>
                                    <span class="get-num">{{ item.difference }}</span>
                                    <span v-show="item.ratio !== '--'" class="prove-xia">
                                        <img v-show="item.ratio < 0" src="../../layouts/images/icon/icon-down-red.png">
                                        <img v-show="item.ratio >= 0" src="../../layouts/images/icon/icon-up-green.png">
                                    </span>
                                </div>
                                <div class="com-prove-day">
                                    <div class="time">{{ titleTime }}</div>
                                    <span v-show="item.ratio !== '--'" class="circle">{{ cicleTro }}</span>
                                    <span v-show="item.ratio !== '--'" :class="{'is-prove-up':item.isup}" class="prove-up">
                                        {{ item.ratio>0 ? '+':'' }}{{ item.ratio+'%' }}
                                    </span>
                                </div>
                                <chart-loading-failed v-if="item.failedLoading"></chart-loading-failed>
                                <chart-no-data v-if="item.noData"></chart-no-data>
                            </div>
                            <div :id="item.id" class="show-echarts-r"></div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="show-echarts-a-v">
                <el-row :gutter="16">
                    <el-col :span="10">
                        <div class="acc-user">
                            <el-tooltip :content="'一定周期内使用账号登录应用的用户占全部活跃用户数的比重'" class="item show-ech-title" effect="dark" placement="right-start">
                                <div class="show-prove-title">
                                    <div class="tro">账号用户占比</div>
                                </div>
                            </el-tooltip>
                            <chart-loading-failed v-if="loadAccRadioFailed"></chart-loading-failed>
                            <div v-if="!loadAccRadioFailed" class="acc-user-zb">
                                <div class="acc-user-zb-title">占比</div>
                                <div class="acc-user-zb-num">
                                    <span class="show-zb-num">{{ accRatio }}</span>
                                    <span class="zb-num-bf">%</span>
                                </div>
                            </div>
                            <div id="accUser" class="ech-acc-user">

                            </div>
                        </div>
                    </el-col>
                    <el-col :span="14">
                        <div class="ver-dis">
                            <el-tooltip :content="'不同App版本活跃用户数排名前5的分布情况'" class="item show-ech-title" effect="dark" placement="right-start">
                                <div class="show-prove-title">
                                    <div class="tro">App TOP5版本分布</div>
                                </div>
                            </el-tooltip>
                            <chart-loading-failed v-if="loadAppFailed"></chart-loading-failed>
                            <chart-no-data v-if="noAppData"></chart-no-data>
                            <div id="verDis" class="ech-content"></div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="show-echarts-a-f">
                <el-row :gutter="16">
                    <el-col :span="10">
                        <div class="acc-sub">
                            <div class="ech-acc-sub">
                                <el-tooltip :content="'使用不同方式登录应用的用户分布情况'" class="item show-ech-title" effect="dark" placement="right-start">
                                    <div class="show-prove-title">
                                        <div class="tro">用户登录分布</div>
                                    </div>
                                </el-tooltip>
                                <div id="accSub" class="ech-content"></div>
                            </div>
                            <chart-loading-failed v-if="loadAccLoginFailed"></chart-loading-failed>
                            <chart-no-data v-if="noAccLoginData"></chart-no-data>
                            <div class="tro-sub">
                                <div v-for="(item, index) in loginOption" :key="index" class="tro-sub-block">
                                    <div class="xu"><span :style="filterLoginColor(index)" class="sz">{{ index + 1 }}</span></div>
                                    <div class="title">{{ item.name }}</div>
                                    <div class="num">{{ item.ratio }}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="10">
                    </el-col>
                </el-row>
            </div>

        </div>
        <div v-show="platform === '1'" class="show-echarts">
            <div class="show-echarts-line">
                <el-row :gutter="16">
                    <el-col v-for="(item, index) in webChartOptions" :span="12" :key="index" class="grid-content bg-purple show-echarts-b">
                        <div style="background-color:#fff; position:relative;" class="show-prove-s">
                            <div class="show-prove">

                                <div class="com-prove-num">
                                    <el-tooltip :content="item.tro" class="item" effect="dark" placement="right-start">
                                        <div class="show-prove-title">
                                            <div class="tro">{{ item.label }}</div>
                                        </div>
                                    </el-tooltip>
                                    <span v-show="index < 3" class="get-num">{{ item.difference }}</span>
                                    <span v-show="item.ratio !== '--' && index < 3" class="prove-xia">
                                        <img v-show="item.ratio < 0" src="../../layouts/images/icon/icon-down-red.png">
                                        <img v-show="item.ratio >= 0" src="../../layouts/images/icon/icon-up-green.png">
                                    </span>
                                </div>
                                <div class="com-prove-day">
                                    <div class="time">{{ titleTime }}</div>
                                    <div v-show="index < 3">
                                        <span v-show="item.ratio !== '--'" class="circle">{{ cicleTro }}</span>
                                        <span v-show="item.ratio !== '--'" :class="{'is-prove-up':item.isup}" class="prove-up">
                                            {{ item.ratio>0 ? '+':'' }}{{ item.ratio+'%' }}
                                        </span>
                                    </div>
                                </div>
                                <chart-loading-failed v-if="item.failedLoading"></chart-loading-failed>
                                <chart-no-data v-if="item.noData"></chart-no-data>
                            </div>
                            <div v-if="index === 3 && !item.failedLoading && !item.noData" class="web-from-total">
                                <div class="web-from-total-title">总访问用户量</div>
                                <div class="web-from-total-num">{{ filterNum(344344) }}</div>
                            </div>
                            <div :id="item.id" class="show-echarts-r"></div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>

    </div>

</template>

<script>
import echarts from 'echarts'
import {mapActions, mapState} from 'vuex'
import DatePicker from '../../components/datePicker.vue'
import ChartLoadingFailed from '../../components/ChartLoadingFailed.vue'
import ChartNoData from '../../components/ChartNoData.vue'
import * as D from '../../constants/dashboard'
import Api from '../../utils/api.js'

export default {
    name: 'SummaryDashboard',
    components: {
        DatePicker,
        ChartLoadingFailed,
        ChartNoData
    },
    data() {
        return {
            initChart: [],
            defaultTime: '20180601',
            choicesType: '全部',
            active: 'all', // 导航
            typeId: 0,
            titleTime: '',
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            comStartTime: '', // 对比开始时间
            comEndTime: '', // 对比结束时间
            cicleTro: '相比7天前', // 默认相比7天前,可能是相比上一周期
            accRatio: 0, // 账号用户占比
            loadAccRadioFailed: false,
            loadAppFailed: false,
            noAppData: false,
            loadAccLoginFailed: false,
            noAccLoginData: false,
            loginOption: [], // 用户登录分布
            checkedVal: false,
            isEnter: [false, false, false, false, false],
            staticData: {},
            faceOptions: [
                {
                    num: 0,
                    title: '累计用户',
                    tro: '使用统计SDK以来，启动过应用的所有独立用户数(去重)(以设备号区分用户)'
                },
                {
                    num: 0,
                    title: '活跃用户',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)'
                },
                {
                    num: 0,
                    title: '新增用户',
                    tro: '一定周期内第一次访问应用的独立用户数(卸载后重装不重复计算)'
                }, {
                    num: 0,
                    title: '人均启动次数',
                    tro: '一定周期内平均每个用户启动应用的次数'
                }, {
                    num: 0,
                    title: '人均使用时长',
                    tro: '一定周期内平均每个用户使用应用的时长'
                }
            ],
            webFaceOptions: [
                {
                    num: 3409955,
                    title: '累计用户数',
                    tro: '使用统计SDK以来，启动过应用的所有独立用户数(去重)(以设备号区分用户)'
                },
                {
                    num: 86,
                    title: '访问用户量',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)'
                },
                {
                    num: 10,
                    title: '新访问用户量',
                    tro: '一定周期内第一次访问应用的独立用户数(卸载后重装不重复计算)'
                }, {
                    num: 0,
                    title: '页面浏览量',
                    tro: '一定周期内平均每个用户启动应用的次数'
                }
            ],
            lineOptions: [
                {
                    id: 'live',
                    label: '活跃用户数',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)',
                    color: '#3CAF41',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'user',
                    label: '新增用户数',
                    tro: '一定周期内第一次访问应用的独立用户数(卸载后重装不重复计算)',
                    color: '#3392FF',
                    bgcolor: 'rgb(210,242,254)',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'start',
                    label: '启动次数',
                    tro: '一定周期内启动应用的次数(APP切换到后台后重新打开会导致旧的访问结束，新的访问开始)',
                    color: '#3392FF',
                    bgcolor: 'rgb(210,242,254)',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'personStart',
                    label: '人均启动次数',
                    tro: '一定周期内平均每个用户启动应用的次数',
                    color: '#E85054',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'personTime',
                    label: '人均使用时长',
                    tro: '一定周期内平均每个用户使用应用的时长',
                    color: '#3392FF',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'cjTime',
                    label: '次均使用时长',
                    tro: '一定周期内平均每个用户每次使用应用的时长',
                    color: '#3392FF',
                    bgcolor: 'rgb(210,242,254)',
                    ratio: 0,
                    difference: 0
                }
            ],
            webChartOptions: [
                {
                    id: 'webScan',
                    label: '页面浏览量',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)',
                    color: '#3CAF41',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'webUser',
                    label: '访问用户量',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)',
                    color: '#3CAF41',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'webNewUser',
                    label: '新访问用户量',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)',
                    color: '#3CAF41',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'webUserFrom',
                    label: '访问用户一级访问来源',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)',
                    color: '#3CAF41',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'webUrlTop',
                    label: '页面（URL）进入量TOP10',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)',
                    color: '#3CAF41',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'webSearchTop',
                    label: '站内搜索搜索词进入量TOP10',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)',
                    color: '#3CAF41',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                },
                {
                    id: 'webCityTop',
                    label: '城市名称访问用户量TOP10',
                    tro: '一定周期内访问过应用的独立用户数(去重，访问过一次即视为活跃)',
                    color: '#3CAF41',
                    bgcolor: '#fff',
                    ratio: 0,
                    difference: 0
                }
            ],
            value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
            value5: '',
            titleEcharts: '折线图'
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId,
            platform: ({root}) => root.platform
        })
    },
    watch: {
        choicesType(newVal, oldVal) {
            if (newVal === '全部') {
                this.typeId = 0
            } else if (newVal === 'Android') {
                this.typeId = 1
            } else {
                this.typeId = 2
            }
            this.resetData()
        }
    },
    mounted() {
        // 获取昨天时间
        let nowDate = new Date()
        // 昨天
        let t = new Date(nowDate.getTime() - 24 * 3600 * 1000)
        let time = `${t.getFullYear()}${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
        this.defaultTime = this.startTime = this.endTime = time
        // 昨天的7天前
        let y = new Date(nowDate.getTime() - 8 * 24 * 3600 * 1000)
        let ytime = `${y.getFullYear()}${(y.getMonth() + 1) < 10 ? ('0' + (y.getMonth() + 1)) : y.getMonth()}${y.getDate() < 10 ? ('0' + y.getDate()) : y.getDate()}`
        this.comStartTime = this.comEndTime = ytime
        // this.getIndexData()
        this.resetData()

        // 自适应echarts
        window.onresize = () => {
            this.initChart.forEach(item => {
                item.resize()
            })
        }
    },
    methods: {
        ...mapActions(['login']),
        resetData() {
            if (this.platform === '0') {
                // 顶部数据统计
                this.getSummaryGrandTotal()
                // 活跃用户到次均使用时长数据
                this.activeToTime()
                // 获取账号用户占比
                this.getSummaryAccRadio()
                // 获取用户登录方式分布
                this.getSummaryLoginWay()
                // 获取APP TOP5版本分布
                this.getSummaryAppTop()
            } else {
                this.drawWebChart()
            }
        },
        // 格式化数据
        formatterData(res) {
            let axisNames = []
            let nowData = []
            let comData = []
            if (res.queryDataList.length === 24) {
                for (let i = 0; i < 24; i++) {
                    axisNames.push(`${i}:00`)
                }
            }
            res.queryDataList.forEach(item => {
                if (res.queryDataList.length !== 24) {
                    axisNames.push(item.groupField.substring(5, 7) + '/' + item.groupField.substring(8, 10))
                }
                nowData.push(item.countNum)
            })
            res.comparedDataList.forEach(item => {
                comData.push(item.countNum)
            })
            return [axisNames, nowData, comData]
        },
        // 获取顶部数据
        getSummaryGrandTotal() {
            // 顶部-累计用户
            Api.summaryGrandTotal({
                appId: this.appId,
                type: this.typeId,
                endTime: this.defaultTime
            }).then(res => {
                this.faceOptions[0].num = typeof res === 'object' ? '0' : res
                // 获取四个方格数据
                this.getSummaryFourIsc()
            }).catch(res => {
                console.log(res)
            })
        },
        // 获取四个方格数据（活跃用户、新增用户、人均启动次数、人均使用时长）
        getSummaryFourIsc() {
            let type = 0
            if (this.platform === 0) {
                type = this.typeId
            } else {
                type = 3
            }
            Api.summaryFourIsc({
                appId: this.appId,
                type: type,
                startTime: this.startTime,
                endTime: this.endTime
            }).then(res => {
                // console.log(res)
                // 顶部-活跃用户
                this.faceOptions[1].num = res.activeUserNum || '0'
                // 顶部-新增用户
                this.faceOptions[2].num = res.increasedUserNum || '0'
                // 顶部-人均启动次数
                this.faceOptions[3].num = res.openNumPerUser || '0'
                // 顶部-人均使用时长
                this.faceOptions[4].num = res.usingTimePerUser || '0'
            })
        },
        beforeCreateLine(index, ratio, difference, mainData, chart) {
            // index表示表的第几个， ratio表示增长百分比, diference表示用户变化数, mainData是json数据
            if (ratio === '--') {
                this.lineOptions[index].ratio = ratio
            } else {
                this.lineOptions[index].ratio = parseFloat(ratio)
                parseFloat(ratio) >= 0 ? this.lineOptions[index].isup = true : this.lineOptions[index].isup = false
            }
            this.lineOptions[index].difference = difference
            this.$set(this.lineOptions, index, this.lineOptions[index])
            let formeterData = this.formatterData(mainData)
            this.creEchLine(chart, this.lineOptions[index].label, this.lineOptions[index].color, this.lineOptions[index].bgcolor, formeterData)
        },
        beforeCreateWebChart(index, ratio, difference, mainData, chart) {
            // index表示表的第几个， ratio表示增长百分比, diference表示用户变化数, mainData是json数据
            if (ratio === '--') {
                this.webChartOptions[index].ratio = ratio
            } else {
                this.webChartOptions[index].ratio = parseFloat(ratio)
            }
            this.webChartOptions[index].difference = difference
            this.$set(this.webChartOptions, index, this.webChartOptions[index])
            let formeterData = this.formatterData(mainData)
            if (index < 3) {
                this.creEchLine(chart, this.lineOptions[index].label, this.lineOptions[index].color, this.lineOptions[index].bgcolor, formeterData)
            } else if (index === 3) {
                this.creEchPie()
            } else {
                this.creEchBar(chart, this.webChartOptions[index].label, this.webChartOptions[index].color, this.webChartOptions[index].bgcolor, formeterData)
            }
        },
        // 活跃用户到次均使用时长数据
        activeToTime() {
            let interfaceArr = ['summaryLiveUser', 'summaryAddUser', 'summaryStartUp', 'summaryPersonStartUp', 'summaryPersonUseTime', 'summaryOnceUseTime']
            interfaceArr.forEach((item, index) => {
                const chart = echarts.init(document.getElementById(this.lineOptions[index].id))
                chart.showLoading({
                    text: '正在加载',
                    color: '#409EFF'
                })
                Api[item]({
                    appId: this.appId,
                    type: this.typeId,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    comparedStartTime: this.comStartTime,
                    comparedEndTime: this.comEndTime
                }).then(res => {
                    if (res.comparedDataList.length === 0 || res.queryDataList.length === 0) {
                        // this.lineOptions[index].noData = true
                        this.$set(this.lineOptions[index], 'noData', true)
                        chart.hideLoading()
                        return
                    }
                    this.$set(this.lineOptions[index], 'noData', false)
                    this.$set(this.lineOptions[index], 'failedLoading', false)
                    this.beforeCreateLine(index, res.ratio, res.difference, res, chart)
                }).catch(res => {
                    chart.hideLoading()
                    this.$set(this.lineOptions[index], 'failedLoading', true)
                })
            })
        },
        // 账号用户占比
        getSummaryAccRadio() {
            Api.summaryAccRadio({
                appId: this.appId,
                type: this.typeId,
                startTime: this.startTime,
                endTime: this.endTime
            }).then(res => {
                this.accRatio = res.ratio.split('%')[0]
                this.creEchAcc(res.accountNum, res.blankAccountNum)
                this.loadAccRadioFailed = false
            }).catch(res => {
                this.loadAccRadioFailed = true
            })
        },
        // 用户登录方式分布
        getSummaryLoginWay() {
            Api.summaryLoginWay({
                appId: this.appId,
                type: this.typeId,
                startTime: this.startTime,
                endTime: this.endTime
            }).then(res => {
                this.loginOption = res
                let echData = []
                res.forEach((item, index) => {
                    let obj = {}
                    obj.value = item.number
                    obj.name = item.name
                    obj.itemStyle = {
                        normal: {
                            color: D.ChartPieColors[index]
                        }
                    }
                    echData.push(obj)
                })
                if (echData.length === 0) {
                    this.noAccLoginData = true
                    return
                }
                this.noAccLoginData = false
                this.loadAccLoginFailed = false
                this.creEchSub(echData)
                // console.log(JSON.stringify(echData))
            }).catch(res => {
                this.loadAccLoginFailed = true
            })
        },
        // APP TOP5版本分布
        getSummaryAppTop() {
            Api.summaryAppTop({
                appId: this.appId,
                type: this.typeId,
                startTime: this.startTime,
                endTime: this.endTime
            }).then(res => {
                alert(1)
                let dataArr = []
                let nameArr = []
                let allNum = 0
                res.forEach(item => {
                    dataArr.push(item.number)
                    nameArr.push(item.name)
                    allNum += item.number
                })
                if (dataArr.length === 0) {
                    this.noAppData = true
                    return
                }
                this.noAppData = false
                this.loadAppFailed = false
                this.creEchApp(dataArr, nameArr, allNum)
            }).catch(res => {
                this.loadAppFailed = true
            })
        },
        // 获取次均使用时长
        getIndexData() {
            let obj = {
                'data1': {
                    'increaseusers': '2055',
                    'startupsper': '25555',
                    'usingtimeper': '234',
                    'activeusers': '22',
                    'totalUsers': '2210'
                },
                'data2': {
                    'rate1': '0',
                    'rate2': '0',
                    ' activeaccountusers ': '0',
                    ' totalaccountusers ': '0'
                },
                'data3': {
                    'onebutton': '100',
                    'rate1': ' 25 % ',
                    'other': '12',
                    'rate2': ' 25 % ',
                    'message': '10',
                    'rate3': ' 25 % ',
                    'account': '9',
                    'rate4': ' 25 % '
                },
                'datas': [{
                    'version': '2.2 .0',
                    'count': '35',
                    'rate': ' 20 %'
                },
                {
                    'version': '2.2 .0',
                    'count': '35',
                    'rate': ' 20 %'
                },
                {
                    'version': '2.2 .0',
                    'count': '35',
                    'rate': ' 20 %'
                }
                ]
            }
            this.staticData = obj
            this.faceOptions[0].num = obj.data1.totalUsers
            this.faceOptions[1].num = obj.data1.activeusers
            this.faceOptions[2].num = obj.data1.increaseusers
            this.faceOptions[3].num = obj.data1.startupsper
            this.faceOptions[4].num = obj.data1.usingtimeper
        },
        filterIcon(index) {
            return `icon${index}`
        },
        filterColorQus(index) {
            return `color-qus${index}`
        },
        filterNum(nStr) {
            nStr += ''
            let x = nStr.split('.')
            let x1 = x[0]
            let x2 = x.length > 1 ? '.' + x[1] : ''
            var rgx = /(\d+)(\d{3})/
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2')
            }
            return x1 + x2
        },
        changeTab(value) {
            this.active = value
        },
        getDateInfo(vv) {
            console.log(vv)
            this.startTime = vv.startTime
            this.endTime = vv.endTime
            this.comStartTime = vv.comStartTime
            this.comEndTime = vv.comEndTime
            if (vv.countDay > 7) {
                this.cicleTro = '相比上周期'
            }
            this.resetData()
        },
        // web图表统计
        drawWebChart() {
            let interfaceArr = ['summaryLiveUser', 'summaryAddUser', 'summaryStartUp', 'summaryPersonStartUp', 'summaryPersonUseTime', 'summaryOnceUseTime', 'summaryOnceUseTime']
            interfaceArr.forEach((item, index) => {
                const chart = echarts.init(document.getElementById(this.webChartOptions[index].id))
                chart.showLoading({
                    text: '正在加载',
                    color: '#409EFF'
                })
                Api[item]({
                    appId: this.appId,
                    type: this.typeId,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    comparedStartTime: this.comStartTime,
                    comparedEndTime: this.comEndTime
                }).then(res => {
                    if (res.comparedDataList.length === 0 || res.queryDataList.length === 0) {
                        this.$set(this.webChartOptions[index], 'noData', true)
                        chart.hideLoading()
                        return
                    }
                    this.$set(this.webChartOptions[index], 'noData', false)
                    this.$set(this.webChartOptions[index], 'failedLoading', false)
                    this.beforeCreateWebChart(index, res.ratio, res.difference, res, chart)
                }).catch(res => {
                    chart.hideLoading()
                    this.$set(this.webChartOptions[index], 'failedLoading', true)
                })
            })
        },
        terDay() {
            document.getElementById('selTime').click()
        },
        mouseEnter(num) {
            this.$set(this.isEnter, num, true)
        },
        mouseLeave(num) {
            this.$set(this.isEnter, num, false)
        },
        creEchLine(chart, titleText, color, bgcolor, formeterData) {
            this.initChart.push(chart)
            let nowTimeStart = `${this.startTime.substring(4, 6)}/${this.startTime.substring(6, 8)}`
            let nowTimeEnd = `${this.endTime.substring(4, 6)}/${this.endTime.substring(6, 8)}`
            let year = this.startTime.substring(0, 4)
            this.titleTime = nowTimeStart === nowTimeEnd ? `${year}/${nowTimeStart}` : `${year}/${nowTimeStart} - ${year}/${nowTimeEnd}`
            let comTimeStart = `${this.comStartTime.substring(4, 6)}/${this.comStartTime.substring(6, 8)}`
            let comTimeEnd = `${this.comEndTime.substring(4, 6)}/${this.comEndTime.substring(6, 8)}`
            chart.setOption({
                title: {
                    text: '',
                    top: '5.5%',
                    left: '3.65%',
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: '#5A6D82',
                        fontSize: '15',
                        fontWeight: 'normal'
                    }
                },
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
                    data: [
                        {
                            name: comTimeStart === comTimeEnd ? comTimeStart : `${comTimeStart} - ${comTimeEnd}`
                        }, {
                            name: nowTimeStart === nowTimeEnd ? nowTimeStart : `${nowTimeStart} - ${nowTimeEnd}`
                        }],
                    bottom: '12',
                    icon: 'rect',
                    itemWidth: 30,
                    itemHeight: 6,
                    textStyle: {
                        color: '#6D7684'
                    }
                },
                color: [color, '#D5E1EA'],
                grid: {
                    top: '20',
                    left: '39',
                    right: '35',
                    bottom: '40',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: formeterData[0],
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(109,118,132,1)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgb(240,240,240)'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
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
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dotted'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        name: nowTimeStart === nowTimeEnd ? nowTimeStart : `${nowTimeStart} - ${nowTimeEnd}`,
                        type: 'line',
                        smooth: true,
                        data: formeterData[1],
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: bgcolor
                                }, {
                                    offset: 1,
                                    color: '#ffffff'
                                }])
                            }
                        }
                    },
                    {
                        name: comTimeStart === comTimeEnd ? comTimeStart : `${comTimeStart} - ${comTimeEnd}`,
                        type: 'line',
                        data: formeterData[2]
                    }
                ]
            })
            chart.hideLoading()
        },
        creEchBar(chart, titleText, color, bgcolor, formeterData) {
            this.initChart.push(chart)
            let nowTimeStart = `${this.startTime.substring(4, 6)}/${this.startTime.substring(6, 8)}`
            let nowTimeEnd = `${this.endTime.substring(4, 6)}/${this.endTime.substring(6, 8)}`
            let year = this.startTime.substring(0, 4)
            this.titleTime = nowTimeStart === nowTimeEnd ? `${year}/${nowTimeStart}` : `${year}/${nowTimeStart} - ${year}/${nowTimeEnd}`
            // let comTimeStart = `${this.comStartTime.substring(4, 6)}/${this.comStartTime.substring(6, 8)}`
            // let comTimeEnd = `${this.comEndTime.substring(4, 6)}/${this.comEndTime.substring(6, 8)}`
            chart.setOption({
                title: {
                    text: '',
                    // top: '5.5%',
                    // left: '3.65%',
                    top: '14',
                    left: '20',
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: '#5A6D82',
                        fontSize: '15',
                        fontWeight: 'normal'
                    }
                },
                color: [color, '#D5E1EA'],
                grid: {
                    top: '20',
                    left: '39',
                    right: '35',
                    bottom: '20',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: false,
                    position: 'top',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(109,118,132,1)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgb(240,240,240)'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(240,240,240)',
                            type: 'dashed'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    textStyle: {
                        color: '#6D7684'
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ['林夏', '雅安', '长沙', '郑州', '呼和浩特', '天津', '成都', '上海', '北京'],
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(109,118,132,1)'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dotted'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        type: 'bar',
                        barMaxWidth: 11,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter (data) {
                                    return `${data.data} (${(data.data / 3460 * 100).toFixed(1)}%)`
                                },
                                color: function (params) {
                                    var colorList = ['#F6D51E', '#3CAF41', '#42B5E4', '#3392FF']
                                    return colorList[params.dataIndex]
                                },
                                textStyle: {
                                    fontSize: '12',
                                    fontFamily: 'MicrosoftYaHei',
                                    color: '#6D7684'
                                }
                            }
                        },
                        data: [100, 160, 270, 340, 400, 460, 500, 580, 650],
                        itemStyle: {
                            normal: {
                                color: '#74BB5C',
                                barBorderRadius: [0, 5, 5, 0]
                            }
                        }
                    }
                ]
            })
            chart.hideLoading()
        },
        creEchAcc(accountNum, blankAccountNum) {
            const chart = echarts.init(document.getElementById('accUser'))
            this.initChart.push(chart)
            chart.setOption({
                legend: {
                    // orient: 'vertical',
                    // top: 'middle',
                    bottom: 22,
                    left: 'center',
                    icon: 'rect',
                    itemWidth: 30,
                    itemHeight: 6,
                    textStyle: {
                        color: '#6D7684'
                    }
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['52%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            // formatter: '版本号\n{b}',
                            formatter: [
                                '{value|{b}}'
                            ].join('\n'),
                            align: 'center',
                            rich: {
                                title: {
                                    color: '#5A6D82',
                                    align: 'center',
                                    fontSize: 12
                                },
                                value: {
                                    align: 'center',
                                    fontSize: 18
                                }
                            }
                        }
                    },
                    animation: false,
                    tooltip: {
                        show: true,
                        trigger: 'none'
                    },
                    color: ['#3392FF', '#D5E1EA'],
                    data: [
                        {
                            value: accountNum,
                            name: `用户数${accountNum}`,
                            itemStyle: {
                                normal: {
                                    color: '#3392FF'
                                }
                            }
                        },
                        {
                            value: blankAccountNum,
                            name: '',
                            itemStyle: {
                                normal: {
                                    color: '#D5E1EA'
                                }
                            }
                        }
                    ]
                }]
            })
        },
        creEchPie() {
            const chart = echarts.init(document.getElementById('webUserFrom'))
            this.initChart.push(chart)
            chart.setOption({
                legend: {
                    bottom: 15,
                    left: 'center',
                    icon: 'rect',
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: '#6D7684'
                    }
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['60%', '75%'],
                    center: ['50%', '40%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    animation: false,
                    tooltip: {
                        show: true,
                        trigger: 'none'
                    },
                    color: ['#3392FF', '#7065BB', '#42B5E4', '#F5D41E'],
                    data: [
                        {
                            value: 90000,
                            name: `直接访问`,
                            itemStyle: {
                                normal: {
                                    color: '#3392FF'
                                }
                            }
                        },
                        {
                            value: 65000,
                            name: '外部链接',
                            itemStyle: {
                                normal: {
                                    color: '#7065BB'
                                }
                            }
                        },
                        {
                            value: 70000,
                            name: '社交媒体',
                            itemStyle: {
                                normal: {
                                    color: '#42B5E4'
                                }
                            }
                        },
                        {
                            value: 80000,
                            name: '搜索引擎',
                            itemStyle: {
                                normal: {
                                    color: '#F5D41E'
                                }
                            }
                        }
                    ]
                }]
            })
            chart.hideLoading()
        },
        creEchApp(dataArr, nameArr, allNum) {
            if (dataArr.length === 0) {
                document.getElementById('verDis').innerHTML = '暂无数据'
                return
            }
            const chart = echarts.init(document.getElementById('verDis'))
            this.initChart.push(chart)
            chart.setOption({
                title: {
                    text: '',
                    top: '14',
                    left: '20',
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: '#5A6D82',
                        fontSize: '15',
                        fontWeight: 'normal'
                    }
                },
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
                    data: []
                },
                grid: {
                    left: '75',
                    right: '100',
                    bottom: '53',
                    top: '74'
                },
                xAxis: {
                    position: 'top',
                    type: 'value',
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
                    axisLine: {
                        lineStyle: {
                            color: 'rgb(240,240,240)'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    textStyle: {
                        color: '#6D7684'
                    }
                },
                yAxis: {
                    type: 'category',
                    data: nameArr,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: '#6D7684'
                        }
                    }
                },
                series: [
                    {
                        barMaxWidth: 11,
                        name: '',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter (data) {
                                    return `${data.data} (${(data.data / allNum * 100).toFixed(1)}%)`
                                },
                                color: function (params) {
                                    var colorList = ['#F6D51E', '#3CAF41', '#42B5E4', '#3392FF']
                                    return colorList[params.dataIndex]
                                },
                                textStyle: {
                                    fontSize: '12',
                                    fontFamily: 'MicrosoftYaHei',
                                    color: '#6D7684'
                                }
                            }
                        },
                        data: dataArr,
                        itemStyle: {
                            // 通常情况下：
                            normal: {
                                show: true,
                                barBorderRadius: [0, 20, 20, 0],
                                // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                color: function (params) {
                                    var colorList = ['#F6D51E', '#3CAF41', '#42B5E4', '#3392FF']
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }
                ]
            })
        },
        creEchSub(echData) {
            // if (echData.length === 0) {
            //     document.getElementById('accSub').innerHTML = '暂无数据'
            //     return
            // }
            const chart = echarts.init(document.getElementById('accSub'))
            this.initChart.push(chart)
            chart.setOption({
                backgroundColor: '#F9FAFC',
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show: false,
                    orient: 'vertical',
                    x: 'right'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['45%', '62%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                // formatter: '版本号\n{b}',
                                formatter: [
                                    '{value|{b}}'
                                ].join('\n'),
                                align: 'center',
                                rich: {
                                    title: {
                                        color: '#5A6D82',
                                        align: 'center',
                                        fontSize: 12
                                    },
                                    value: {
                                        align: 'center',
                                        fontSize: 18
                                    }
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '15',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: echData
                    }
                ]
            })
        },
        filterLoginColor(index) {
            let color = D.ChartPieColors[index]
            return `background-color:${color}`
        }
    }
}
</script>

<style lang="scss">
  $color-7262BA: #7262BA;
  $color-3CAF41: #3CAF41;
  $color-42B5E4: #42B5E4;
  $color-F6D51E: #F6D51E;
  $color-E85054: #E85054;
  .dashboard-summary {
    .top-menu {
       @mixin pub-button() {
         cursor: pointer;
         font-size: 14px;
         height: 32px;
         line-height: 32px;
         text-align: center;
       }
       .menu-button {
         @include pub-button;
         .menu-button-block {
           flex: 1;
           border-right: 2px solid #F3F4F8;
           color: #3392FF;
           border-radius: 2px;
         }
         .active-btn {
           color: #fff;
           background-color: #3392FF;
         }
         display: flex;
         float: left;
         width: 240px;
       }
       .sel-time {
         @include pub-button;
         float: right;
         width: 400px;
       }
       .time-button {
           @include pub-button;
           float: right;
           color: #3392FF;
           border-radius: 2px;
        }
        height: 32px;
    }
    .el-layout-height {
         .flip-container {
            perspective: 1000;
            transform-style: preserve-3d;
        }
            .is-enter .back {
               transform: rotateY(0deg);
            }
            .is-enter .front {
               transform: rotateY(180deg);
            }

        .flip-container, .front, .back {
            position: relative;
            // width: 216px;
            height: 106px;
        }
        .flip-container .back {
          padding: 30px 10px 10px 10px
        }
        .back .back-intro {
            width: 100px;
            margin-top: 20px;
        }
        .front, .back {
            width: 100%;
            background-color: #fff
        }

        /* flip speed goes here */
        .flipper {
            transition: 0.6s;
            transform-style: preserve-3d;
            width: 100%;
            position: relative;
        }

        /* hide back of pane during swap */
        .front, .back {
            backface-visibility: hidden;
            transition: 0.6s;
            transform-style: preserve-3d;
            position: absolute;
            top: 0;
            left: 0;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
        }

        /*  UPDATED! front pane, placed above back */
        .front {
            z-index: 2;
            transform: rotateY(0deg);
        }

        /* back, initially hidden pane */
        .back {
            transform: rotateY(-180deg);
        }

        /*
            Some vertical flip updates
        */
        .vertical.flip-container {
            position: relative;
        }

            .vertical .back {
                transform: rotateX(180deg);
            }
      .face-block {
        @mixin fontStyle {
          font-family: sfuidisplay-thin;
        }
        .icon0 {
            @include fontStyle;
            color: $color-7262BA;
        }
        .icon1 {
            @include fontStyle;
            color: $color-3CAF41;
        }
        .icon2 {
            @include fontStyle;
            color: $color-42B5E4;
        }
        .icon3 {
            @include fontStyle;
            color: $color-F6D51E;
        }
        .icon4 {
            @include fontStyle;
            color: $color-E85054;
        }
        .face-block-title {
          .tro-title {
            color: #5A6D82;
            opacity: 0.8;
          }
          .qus {
            display: inline-block;
            width: 14px;
            line-height: 14px;
            color: #fff;
            height: 14px;
            border-radius: 7px;
            background: #DFDFDF;
          }
          .color-qus0 {
              color: $color-7262BA;
          }
          .color-qus1 {
              color: $color-3CAF41;
          }
          .color-qus2 {
              color: $color-42B5E4;
          }
          .color-qus3 {
              color: $color-F6D51E;
          }
          .color-qus4 {
              color: $color-E85054;
          }
          margin-top: 8px;
          font-size: 12px;
        }
        .face-block-num {
            .second {
              font-size: 12px;
            }
            font-weight: 600;
            height: 26px;
            line-height: 26px;
            font-size: 30px;
            margin-top: 33px;
        }
        .live-num {
            color: #3CAF41
        }
        .add-num {
            color: #42B5E4
        }
        .starup-num {
            color: #F6D51E
        }
        .time-num {
            color: #E85054
        }
        // border-right: 10px solid #F5F5F5;
        // flex: 1;
      }
      .face-block-last {
          border-right: 0px;
      }
    //   display: flex;
      margin-top: 30px;
    //   height: 106px;
      text-align: center;

        .el-row {
            margin-bottom: 20px;
            &:last-child {
            margin-bottom: 0;
            }
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
    }

    .show-echarts{
          .show-echarts-line {
             .el-row {
            margin-bottom: 20px;
            &:last-child {
            margin-bottom: 0;
            }
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
            //
            .show-echarts-b {
                .show-prove-s {
                  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15) ;
                  .show-prove {
                        .com-prove-num {
                            .show-prove-title {
                                .tro {
                                font-size: 14px;
                                }
                                float: left;
                                text-align: left;
                                margin-left: 20px;
                                color: #6D7684;
                            }
                            .get-num {
                                font-family: sfuidisplay-thin;
                                font-size: 30px;
                            }
                            .prove-xia {
                                img {
                                    width: 17px;
                                    height: 22px;
                                }
                                color: red;
                            }
                            font-size: 14px;
                            height: 23px;
                            line-height: 23px;
                            color:#5A6D82
                        }
                        .com-prove-day {
                            .time {
                            float: left;
                            opacity: 0.7;
                            font-size: 12px;
                            }
                            .circle {
                                opacity: 0.7;
                            }
                            .is-prove-up {
                                color: #74BB5C !important;
                            }
                            .prove-up {
                                div {
                                    display: inline-block;
                                }
                                font-size: 14px;
                                color: #F66254;
                                margin-left: 3px;
                            }
                            padding-left: 20px;
                            font-size:12px;
                            margin-top: 3px;
                            font-family:MicrosoftYaHei;
                            color:#8b99a7;
                        }
                        .check-class {
                            .el-checkbox__inner {
                                border-radius: 50%;
                            }
                            right: -7px;
                            position: absolute;
                            top: -29px;
                            display: none;
                        }
                        .is-del-checked {
                            display: block;
                        }
                        text-align: right;
                        padding-right: 20px;
                        width: 100%;
                        height: 50px;
                        z-index: 11;
                    }
                    padding-top: 18px;
                    background-color: #fff;
                    height: 325px;
                }

                .show-echarts-r {
                    position: relative;
                    width: 100%;
                    height: 245px;
                }
                .show-echarts-r2 {
                    position: relative;
                    width: 100%;
                    height: 168px;
                    margin-top: 20px;
                    padding-left: 66px;
                    padding-right: 45px;
                    .line {
                       border-bottom: 1px dashed #ddd;
                       margin-bottom: 40px;
                    }
                }
                .show-data {
                    .show-data-b {
                        text-align: center;
                        float: right;
                        .num {
                            height: 20px;
                            line-height: 20px;
                            font-size: 24px;
                            color: #5A6D82;
                        }
                        .zu {
                            height: 8px;
                            background-color: #3392FF;
                            border-radius: 4px;
                            margin-top: 19px;
                        }
                        .tro {
                            height: 12px;
                            line-height: 12px;
                            font-size: 12px;
                            margin-top: 10px;
                            color: #6D7684;
                        }
                        width: 160px;
                    }
                    position: absolute;
                    height: 80px;
                    width: 100%;
                    top: 151px;
                }
                position: relative;
                height: 325px;
                margin-top: 16px;
            }
            .show-echarts-b-no-boder {
                border-right: 0;
                border-left: 12.5px solid #F3F4F8;
            }
            .show-echarts-b:hover .check-class {
              display: block;
            }
            overflow: hidden;
          }
          .e-clear-border {
            border-right: 0px;
          }
      .show-ech-title {
            margin-top: 19px;
            color: #6D7684;
            z-index: 1000;
            margin-left: 22px;
            font-size: 14px;
            position: absolute;
      }
      .show-echarts-a-v {
           //  账号用户占比与版本分布
          .ech-acc-user {
              box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
              height: 346px;
              background-color: #fff;
           }
            .ver-dis {
               box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
              .title {
                padding-left: 20px;
                padding-top: 18px;
                font-size: 14px;
                color: #5A6D82;
                text-align: left;
              }
              .ech-content {
                text-align: center;
                height: 280px;
                line-height: 250px;
              }
              height: 346px;
              width: 100%;
              background-color: #fff;
              color: #5A6D82;
              position: relative;
            }

          .acc-user {
            .acc-user-zb {
              .acc-user-zb-title {
                color: #5A6D82;
                opacity: 0.7;
                font-size: 14px;
              }
              .acc-user-zb-num {
                color: #5A6D82;
                height: 40px;
                line-height: 40px;
                font-size: 40px;
                .show-zb-num {
                    font-family: sfuidisplay-thin;
                }
                .zb-num-bf {
                    font-size: 14px;
                    margin-left: -9px;
                }
              }
            position: absolute;
            text-align: center;
            width: 100%;
            height: 60px;
            margin-top: 138px;
            }
            position: relative;
            height: 346px;
          }
        //   display: flex;
          margin-top: 16px;
          height: 346px;
        //   background-color: #fff;
      }
      .show-echarts-a-f {
          .acc-sub {
            .ech-acc-sub {
              box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
              .title {
                padding-left: 20px;
                padding-top: 18px;
                font-size: 14px;
                color: #5A6D82;
                text-align: left;
              }
              .ech-content {
                text-align: center;
                height: 280px;
                line-height: 250px;
                padding-top: 20px;
              }
              height: 316px;
            //   line-height: 316px;
              background-color: #f9fafc;
              color: #5A6D82;
            }
            .tro-sub {
                .tro-sub-block {
                    .xu {
                      .sz {
                        display:inline-block;
                        width: 26px;
                        height: 26px;
                        border-radius: 4px;
                        line-height: 26px;
                        text-align: center;
                        color: #fff;
                      }
                      .color1 {
                        background-color: #7065BB;
                      }
                      .color2 {
                        background-color: #42B5E4;
                      }
                      .color3 {
                        background-color: #F5D41E;
                      }
                      .color4 {
                        background-color: #3590FD;
                      }
                      padding-left: 16px;
                      flex: 1;
                    }
                    .title {
                      flex: 7;
                      color: #8b99a7;
                    }
                    .num {
                      text-align: right;
                      padding-right: 12px;
                      flex: 2;
                    }
                    display: flex;
                    height: 43.5px;
                    line-height: 43.5px;
                    color: #5A6D82;
                    border-bottom: 1px solid #F9FAFC;
                }
                background-color: #fff;
                // height: 174px;
                width: 100%;
                bottom: 0;
            }
            position: relative;
            height: 346px;
          }
          position: relative;
          margin-top: 24px;
          height: 490px;
      }
      .boot-char {
          .el-col {
            border-radius: 4px;
            }
            .bg-purple-dark {
            background: #99a9bf;
            }
            .bg-purple-light {
            background: #e5e9f2;
            }
            .grid-content {
            border-radius: 4px;
            min-height: 36px;
            }

      }
      margin-bottom: 25px;
    }
    min-width: 900px;

    .web-from-total {
        color: #5A6D82;
        position: absolute;
        text-align: center;
        width: 100%;
        height: 60px;
        margin-top: 60px;
        .web-from-total-title {
            font-size: 14px;
        }
        .web-from-total-num {
            font-size: 36px;
            font-weight: 100;
        }
    }
  }
</style>
