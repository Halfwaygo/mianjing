<template>
    <div class="mainBox">
        <div class="headeChioceBox">
            <el-row class="headDiv">
                <el-col :span="12">
                    <el-radio-group v-model="choicesType" size="small" class="topBtnGroup">
                        <el-radio-button label="全部"></el-radio-button>
                        <el-radio-button label="IOS"></el-radio-button>
                        <el-radio-button label="Android"></el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="12" class="rightBtn">
                    <div class="dataBox">
                        <date-picker @getDateValue="getDateInfo"></date-picker>
                    </div>
                    <el-button class="btn-icon" icon="icon-choose" @click="showSelect()"></el-button>
                </el-col>
            </el-row>
            <select-type :is-show-select="isShowSelect" @notshow="showSelect()" @selects="selectList"></select-type>
        </div>
        <div class="chart-container">
            <!-- 30天内是日留存  30-90天是周留存  大于90天 月留存-->
            <div>
                <el-row :gutter="16">
                    <el-col :span="12">
                        <div class="writeBack">
                            <div class="chartHeadTitle">
                                <div class="title">
                                    <el-tooltip class="item" effect="dark" content="Right Center 提示文字好的升级换代是根本都会发生实弹射击的山东省客户端" placement="right-start">
                                        <span >活跃用户留存概况</span>
                                    </el-tooltip>
                                </div>
                                <div class="time">2018/03/20-2018/03/28 &nbsp;&nbsp; 日留存</div>
                                <div class="behavior">
                                    <span class="box">起始行为 <span class="graySpan">任意行为</span></span>
                                    <span class="box">留存行为 <span class="graySpan">任意行为</span></span>
                                    <span class="box">目标用户 <span class="graySpan">任意行为</span></span>
                                </div>
                            </div>
                            <div id="activeChartLine" class="chartBox smallChart"></div>
                        </div>
                    </el-col>
                    <el-col :span="12" >
                        <div class="writeBack">
                            <div class="chartHeadTitle">
                                <el-row>
                                    <el-col :span="24">
                                        <div class="title">
                                            <el-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right-start">
                                                <span >活跃用户量及次日留存率趋势</span>
                                            </el-tooltip>
                                        </div>
                                        <div class="time">2018/03/20-2018/03/28 &nbsp;&nbsp; 日留存</div>
                                    </el-col>
                                    <!--<el-col :span="14" class="rightBtn">-->
                                    <!--<div class="smallChoseDay">-->
                                    <!--<el-button :class="{'active' : choicesDay=== '日'}" type="text" class="dayBtn" size="small" @click="choicesDay= '日'">日</el-button>-->
                                    <!--<el-button :class="{'active' : choicesDay=== '周'}" type="text" class="dayBtn" size="small" @click="choicesDay= '周'">周</el-button>-->
                                    <!--<el-button :class="{'active' : choicesDay=== '月'}" type="text" class="dayBtn" size="small" @click="choicesDay= '月'">月</el-button>-->
                                    <!--</div>-->
                                    <!--</el-col>-->
                                </el-row>
                            </div>
                            <div id="activeChartBar" class="chartBox smallChart"></div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="chartDetail writeBack">
                <div class="title">
                    <el-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right-start">
                        <span >活跃用户留存详情</span>
                    </el-tooltip>
                </div>
                <detali-chart :table-data="tableData"></detali-chart>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import DetaliChart from '~/components/dashboard/DetaliChart'
import SelectType from '../../components/dashboard/SelectType'
import DatePicker from '../../components/datePicker.vue'
import { mapState } from 'vuex'

let tableData = [{
    allUser: '全部访问用户',
    userNum: '12343',
    dataNum: [
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        }]
}, {
    allUser: '03/20 周二',
    userNum: '12343',
    dataNum: [
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '26%',
            num: 2133
        },
        {
            prc: '16%',
            num: 2133
        },
        {
            prc: '76%',
            num: 2133
        },
        {
            prc: '96%',
            num: 2133
        },
        {
            prc: '86%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        }]
}, {
    allUser: '03/21 周三',
    userNum: '12343',
    dataNum: [{prc: '56%', num: 2133},
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '',
            num: ''
        }]
}, {
    allUser: '03/22 周四',
    userNum: '12343',
    dataNum: [{prc: '56%', num: 2133},
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        }]
}, {
    allUser: '03/23 周五',
    userNum: '12343',
    dataNum: [{prc: '56%', num: 2133},
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        }]
}, {
    allUser: '03/24 周六',
    userNum: '12343',
    dataNum: [{prc: '56%', num: 2133},
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        }]
}, {
    allUser: '03/25 周日',
    userNum: '12343',
    dataNum: [{prc: '56%', num: 2133},
        {
            prc: '56%',
            num: 2133
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        }]
}, {
    allUser: '03/26 周一',
    userNum: '12343',
    dataNum: [{prc: '56%', num: 2133},
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        },
        {
            prc: '',
            num: ''
        }]
}]
export default {
    name: 'UserRetentionDashboard',
    components: {
        DetaliChart,
        SelectType,
        DatePicker
    },
    data() {
        return {
            choicesType: '全部',
            activeChartLine: null,
            isShowSelect: false,
            choicesDay: '日',
            tableData: tableData
        }
    },
    computed: mapState({
        appId: ({root}) => root.appId
    }),
    mounted() {
        this.drawUserRetentionChart()
        this.drawUserActiveChartBar()
        console.log(this.appId)
    },
    methods: {
        showSelect() {
            this.isShowSelect = !this.isShowSelect
        },
        getDateInfo(vv) {
            console.log(vv)
        },
        selectList(list) {
            console.log(list)
        },
        drawUserRetentionChart() {
            // 用户留存概况
            this.activeChartLine = echarts.init(document.getElementById('activeChartLine'))
            this.activeChartLine.setOption({
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
                    top: 25,
                    left: 43,
                    right: 40
                },
                xAxis: {
                    boundaryGap: false,
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
                    data: ['当日', '次日', '2日后', '3日后', '4日后', '5日后', '6日后']
                },
                yAxis: {
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
                series: [{
                    name: '销量',
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#F7587C'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(243,61,105,0.1)'
                            }, {
                                offset: 1,
                                color: '#ffffff'
                            }])
                        }
                    },
                    data: [5, 20, 36, 10, 10, 20, 10]
                }]
            })
        },
        drawUserActiveChartBar() {
        //    活跃用户量及次日留存率趋势
            this.activeChartLine = echarts.init(document.getElementById('activeChartBar'))
            this.activeChartLine.setOption({
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
                    top: 15,
                    left: 43,
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
                    data: ['当日', '次日', '2日后', '3日后', '4日后', '5日后', '6日后']
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
                    {
                        name: '访问用户量',
                        type: 'bar',
                        smooth: true,
                        barWidth: 22,
                        itemStyle: {
                            normal: {
                                color: '#74BB5C'
                            }
                        },
                        data: [5, 20, 36, 10, 10, 20, 10]
                    },
                    {
                        name: '访问用户留存率',
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#D5E1EA'
                            }
                        },
                        data: [6, 24, 24, 21, 11, 30, 20]
                    }
                ]
            })
        }
    }
}
</script>

<style lang="scss">
    @import '../../layouts/css/dashboard/userChart';
    .smallChoseDay{
        border-radius: 2px;
        .el-button{
            width: 80px;
            padding: 9px 0;
            color: #8b99a7;
        }
        .el-button.active{
            color: #3392FF;
            background-color: rgba(41,123,254,0.1);
        }
    }
</style>
