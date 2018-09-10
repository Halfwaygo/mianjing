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
            <div class="writeBack">
                <el-row>
                    <el-col :span="12">
                        <div class="chartHeadTitle">
                            <div class="title">
                                <el-tooltip class="item" effect="dark" content="Right Center 提示文字好的升级换代是根本都会发生实弹射击的山东省客户端" placement="right-start">
                                    <span >活跃用户版本分析</span>
                                </el-tooltip>
                            </div>
                            <div class="time">2018/03/20-2018/03/28</div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="rightBtn filterText">过滤条件：APP版本！＝不适用</div>
                    </el-col>
                </el-row>
                <div id="appVersionLine" class="chartBox topChart"></div>
            </div>
        </div>
        <div class="appVersionPieBox">
            <div class="chartHeadTitle">
                <div class="title">
                    <el-tooltip class="item" effect="dark" content="Right Center 提示文字好的升级换代是根本都会发生实弹射击的山东省客户端" placement="right-start">
                        <span >各版本活跃用户占比</span>
                    </el-tooltip>
                </div>
            </div>
            <div id="appVersionPie" class="chartBox"></div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import SelectType from '../../components/dashboard/SelectType'
import * as D from '../../constants/dashboard'
import DatePicker from '../../components/datePicker.vue'

export default {
    name: 'AppVersionDashboard',
    components: {
        SelectType,
        DatePicker
    },
    data() {
        return {
            choicesType: '全部',
            isShowSelect: false,
            appVersionLine: null,
            appVersionPie: null
        }
    },
    mounted() {
        this.appVersionLineChartBar()
        this.appVersionPieChart()
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
        appVersionLineChartBar() {
            this.appVersionLine = echarts.init(document.getElementById('appVersionLine'))
            this.appVersionLine.setOption({
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
                    data: ['12/17', '12/18'],
                    align: 'auto',
                    bottom: 50,
                    icon: 'roundRect',
                    itemWidth: 16,
                    itemHeight: 16,
                    textStyle: {
                        color: '#5A6D82'
                    }
                },
                grid: {
                    top: 15,
                    bottom: 110
                },
                xAxis: {
                    boundaryGap: false,
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
                series: [
                    {
                        name: '12/17',
                        type: 'line',
                        smooth: true,
                        barWidth: 22,
                        itemStyle: {
                            normal: {
                                color: D.ChartLineColors[0]
                            }
                        },
                        data: [5, 20, 36, 10, 10, 20, 10]
                    },
                    {
                        name: '12/18',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: D.ChartLineColors[1]
                            }
                        },
                        data: [6, 24, 24, 21, 11, 30, 20]
                    }
                ]
            })
        },
        appVersionPieChart() {
            this.appVersionPie = echarts.init(document.getElementById('appVersionPie'))
            this.appVersionPie.setOption({
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    data: ['2.20', '2.30', '2.40', '2.50', '2.60'],
                    textStyle: {
                        color: '#5A6D82'
                    }
                },
                series: [
                    {
                        name: '版本号',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                // formatter: '版本号\n{b}',
                                formatter: [
                                    '{title|版本号}',
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
                                        fontSize: 28
                                    }
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {
                                value: 335,
                                name: '2.20',
                                itemStyle: {
                                    normal: {
                                        color: D.ChartPieColors[0]
                                    }
                                }
                            },
                            {
                                value: 310,
                                name: '2.30',
                                itemStyle: {
                                    normal: {
                                        color: D.ChartPieColors[1]
                                    }
                                }
                            },
                            {
                                value: 234,
                                name: '2.40',
                                itemStyle: {
                                    normal: {
                                        color: D.ChartPieColors[2]
                                    }
                                }
                            },
                            {
                                value: 135,
                                name: '2.50',
                                itemStyle: {
                                    normal: {
                                        color: D.ChartPieColors[3]
                                    }
                                }
                            },
                            {
                                value: 1548,
                                name: '2.60',
                                itemStyle: {
                                    normal: {
                                        color: D.ChartPieColors[4]
                                    }
                                }
                            }
                        ]
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
