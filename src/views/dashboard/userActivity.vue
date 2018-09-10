<template>
    <div class="dashboard-user-activity mainBox">
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
                    <el-radio-group v-model="choicesDay" size="small" class="choiceDay topBtnGroup">
                        <el-radio-button label="日"></el-radio-button>
                        <el-radio-button label="周"></el-radio-button>
                        <el-radio-button label="月"></el-radio-button>
                    </el-radio-group>
                    <el-button class="btn-icon" icon="icon-choose" @click="showSelect()"></el-button>
                </el-col>
            </el-row>
            <select-type :is-show-select="isShowSelect" @notshow="showSelect()" @selects="selectList"></select-type>
        </div>
        <div class="chart-container">
            <div class="writeBack">
                <div class="chartHeadTitle">
                    <el-row>
                        <el-col :span="12">
                            <div class="title">
                                <el-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right-start">
                                    <span >周活跃用户构成</span>
                                </el-tooltip>
                            </div>
                            <div class="time">上周期2018/03/20-2018/03/28 &nbsp;&nbsp; 本周期2018/03/20-2018/03/28</div>
                        </el-col>
                        <el-col :span="12">
                            <div class="compareBox rightBtn">
                                <div class="compare">
                                    <span>当周新用户流失数</span>
                                    <span class="bigNum">177</span>
                                    <i class="icon-down-red"></i>
                                </div>
                                <div class="compare">
                                    <span>相比上周</span>
                                    <span class="preNum down">+6.49%</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="behavior nonMagin">
                        <span class="box">起始行为 <span class="graySpan">任意行为</span></span>
                        <span class="box">留存行为 <span class="graySpan">任意行为</span></span>
                        <span class="box">目标用户 <span class="graySpan">任意行为</span></span>
                    </div>
                </div>
                <div id="chartColumn" class="chartBox activeUserChart"></div>
            </div>
            <el-row :gutter="16">
                <el-col :span="12">
                    <div class="writeBack">
                        <div class="chartHeadTitle">
                            <el-row>
                                <el-col :span="12">
                                    <div class="title">
                                        <el-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right-start">
                                            <span >新用户流失量及占比</span>
                                        </el-tooltip>
                                    </div>
                                    <div class="time">2018/03/20-2018/03/28</div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="compareBox rightBtn">
                                        <div class="compare margin">
                                            <span>当周新用户流失数</span>
                                            <span class="bigNum">177</span>
                                            <i class="icon-up-green"></i>
                                        </div>
                                        <div class="compare margin">
                                            <span>相比上周</span>
                                            <span class="preNum up">+6.49%</span>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <div class="behavior">
                                <span class="box">起始行为 <span class="graySpan">任意行为</span></span>
                                <span class="box">留存行为 <span class="graySpan">任意行为</span></span>
                                <span class="box">目标用户 <span class="graySpan">任意行为</span></span>
                            </div>
                        </div>
                        <div id="newUserLoseChart" class="chartBox activeUserChart"></div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import SelectType from '~/components/dashboard/SelectType'
import DatePicker from '../../components/datePicker.vue'

export default {
    name: 'UserActivityDashboard',
    components: {SelectType, DatePicker},
    data() {
        return {
            isShowSelect: false,
            choicesDay: '日',
            choicesType: '全部',
            newUserLoseChartLine: null,
            chartColumn: null,
            value7: '',
            showPickText: true,
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        console.log(this.showPickText)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }
        }
    },
    watch: {
        showPickText: function (vaule, oldVaule) {
            this.showPickText = vaule
        }
    },
    mounted() {
        this.drawChart()
        this.drawNewUserLoseChart()
    },
    methods: {
        showSelect () {
            this.isShowSelect = !this.isShowSelect
        },
        getDateInfo(vv) {
            console.log(vv)
        },
        selectList(list) {
            console.log(list)
        },
        drawChart() {
            // 用户留存概况
            this.chartColumn = echarts.init(document.getElementById('chartColumn'))
            this.chartColumn.setOption({
                title: {},
                tooltip: {
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
                xAxis: {
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#6D7684'
                        }
                    },
                    axisTick: {
                        show: false,
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
                    data: ['上周活跃用户数', '上周期新用户\n本周期流失数', '上周期活跃老用户\n本周期流失数', '上周期活跃用户\n本周期留存数', '上周期末活跃老用户\n本周期回流数', '本周期新用户数', '本周期总活跃用户数']
                },
                grid: {
                    top: 40,
                    right: 65
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
                        },
                        formatter: function(value) {
                            return (parseInt(value) / 1000) + 'k'
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
                        name: '辅助',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 22,
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            }
                        },
                        tooltip: {
                            show: false
                        },
                        data: [0, 999, 962, 0, 1004, 1004, 0]
                    },
                    {
                        name: '上周活跃用户数',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 22,
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#74BB5C'
                            }
                        },
                        data: [1004, '-', '-', '-', '-', '-', '-']
                    },
                    {
                        name: '上周期新用户本周期流失数',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 22,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '- {@c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#7262BA'
                            }
                        },
                        data: ['-', 5, '-', '-', '-', '-', '-']
                    },
                    {
                        name: '上周期活跃老用户本周期流失数',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 22,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '- {@c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#3392FF'
                            }
                        },
                        data: ['-', '-', 42, '-', '-', '-', '-']
                    },
                    {
                        name: '上周期活跃用户本周期留存数',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 22,
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#3CAF41'
                            }
                        },
                        data: ['-', '-', '-', 957, '-', '-', '-']
                    },
                    {
                        name: '上周期末活跃老用户本周期回流数',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 22,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '+ {@c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#F5D41E'
                            }
                        },
                        data: ['-', '-', '-', '-', 30, '-', '-']
                    },
                    {
                        name: '本周期新用户数',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 22,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '+ {@c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#42B5E4'
                            }
                        },
                        data: ['-', '-', '-', '-', '-', 202, '-']
                    },
                    {
                        name: '本周期总活跃用户数',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 22,
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#F5A61D'
                            }
                        },
                        data: ['-', '-', '-', '-', '-', '-', 1189]
                    }
                ]
            })
        },
        drawNewUserLoseChart() {
            this.newUserLoseChartLine = echarts.init(document.getElementById('newUserLoseChart'))
            this.newUserLoseChartLine.setOption({
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
                    data: ['新用户流失量', '新用户流失占比'],
                    align: 'auto',
                    bottom: 25,
                    icon: 'roundRect',
                    itemWidth: 30,
                    itemHeight: 6,
                    textStyle: {
                        color: '#5A6D82'
                    }
                },
                grid: {
                    top: 40,
                    left: 43,
                    right: 60,
                    bottom: 75
                },
                xAxis: {
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#6D7684'
                        }
                    },
                    axisTick: {
                        show: false,
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
                    data: ['12/25周一', '12/26周二', '12/27周三', '12/28周四', '12/29周五', '12/30周六', '12/31周日']
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
                        name: '新用户流失量',
                        type: 'bar',
                        smooth: true,
                        barMaxWidth: 20,
                        itemStyle: {
                            normal: {
                                color: '#42B5E4'
                            }
                        },
                        data: [5, 20, 36, 10, 10, 20, 10]
                    },
                    {
                        name: '新用户流失占比',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#F5A61D'
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

</style>
