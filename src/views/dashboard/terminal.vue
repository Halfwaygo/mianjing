<template>
    <div class="dashboard-terminal">
        <div class="top-menu">
            <div class="menu-button">
                <el-radio-group v-model="choicesType" size="small" class="topBtnGroup">
                    <el-radio-button label="全部"></el-radio-button>
                    <el-radio-button label="IOS"></el-radio-button>
                    <el-radio-button label="Android"></el-radio-button>
                </el-radio-group>
                <!-- <div :class="{'active-btn': active == 'all'}" class="menu-button-block" @click="changeTab('all')">全部</div>
                <div :class="{'active-btn': active == 'ios'}" class="menu-button-block" @click="changeTab('ios')">ios</div>
                <div :class="{'active-btn': active == 'Android'}" class="menu-button-block" @click="changeTab('Android')">Android</div> -->
            </div>
            <div class="time-button">
                <!-- 昨日 -->
                <date-picker @getDateValue="getDateInfo"></date-picker>
            </div>
        </div>
        <div class="live-map">
            <div class="title">活跃用户地理分布</div>
            <div id="echMap" class="ech-map"></div>
        </div>
        <div class="ter-bar-ech">
            <div id="terBrand" class="ter-show-ech"></div>
        </div>
        <div class="ter-bar-ech">
            <div id="terModel" class="ter-show-ech"></div>
        </div>
        <div class="ter-bar-ech">
            <div id="terSystem" class="ter-show-ech"></div>
        </div>
        <div class="ter-bar-ech">
            <div id="terRes" class="ter-show-ech"></div>
        </div>
        <div class="ter-pub">
            <div class="ter-pub-block ter-ope-sub">
                <div id="opeSub" class="ech-acc-sub">

                </div>
                <div class="tro-sub">
                    <div class="tro-sub-block">
                        <div class="xu"><span class="sz color1">1</span></div>
                        <div class="title">中国移动</div>
                        <div class="num">53.92%</div>
                    </div>
                    <div class="tro-sub-block">
                        <div class="xu"><span class="sz color2">2</span></div>
                        <div class="title">中国联通</div>
                        <div class="num">53.92%</div>
                    </div>
                    <div class="tro-sub-block">
                        <div class="xu"><span class="sz color3">3</span></div>
                        <div class="title">中国电信</div>
                        <div class="num">53.92%</div>
                    </div>
                    <div class="tro-sub-block">
                        <div class="xu"><span class="sz color4">4</span></div>
                        <div class="title">其它</div>
                        <div class="num">53.92%</div>
                    </div>
                </div>
            </div>

            <div class="ter-pub-block">
                <div id="interSub" class="ech-acc-sub">

                </div>
                <div class="tro-sub">
                    <div class="tro-sub-block">
                        <div class="xu"><span class="sz color1">1</span></div>
                        <div class="title">中国移动</div>
                        <div class="num">53.92%</div>
                    </div>
                    <div class="tro-sub-block">
                        <div class="xu"><span class="sz color2">2</span></div>
                        <div class="title">中国联通</div>
                        <div class="num">53.92%</div>
                    </div>
                    <div class="tro-sub-block">
                        <div class="xu"><span class="sz color3">3</span></div>
                        <div class="title">中国电信</div>
                        <div class="num">53.92%</div>
                    </div>
                    <div class="tro-sub-block">
                        <div class="xu"><span class="sz color4">4</span></div>
                        <div class="title">其它</div>
                        <div class="num">53.92%</div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import ChinaJSON from '../../constants/china.json'
import utils from '../../utils/changeDate'
import DatePicker from '../../components/datePicker.vue'
import * as D from '../../constants/dashboard'

export default {
    name: 'TerminalDashboard',
    components: {
        DatePicker
    },
    data() {
        return {
            choicesType: '全部',
            pickerOptions2: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime())
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '7天前',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '30天前',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '90天前',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            active: 'all',
            fromDate: '',
            toDate: '',
            searchDate: '昨日'
        }
    },
    watch: {
        searchDate(newVal, oldVal) {
            const fromDate = utils.formatDate(newVal[0])
            const toDate = utils.formatDate(newVal[1])
            this.fromDate = fromDate
            this.toDate = toDate
            this.searchDate = fromDate + '与' + toDate
        }
    },
    mounted() {
        this.creEchLine()
        const brandData = ['华为', '荣耀', '小米', 'vivo', '三星', 'OPPO', '红米', '乐视', '锤子', '魅族']
        this.creEchBar('终端品牌Top10', 'terBrand', '#74BB5C', brandData)
        const modelData = ['x86_64', 'mha-a100', 'huaweinex-al10', 'iphone6plus', 'iphone10.3', 'iphone10.2', 'iphone10.1', 'iphone10.5', 'iphone10.6', 'iphone10.7']
        this.creEchBar('机型Top10', 'terModel', '#FFBA48', modelData)
        const systemData = ['ios11.1', 'ios11.2', 'ios11.3', 'ios11.4', 'ios11.5', 'ios11.6', 'ios11.7', 'ios11.8']
        this.creEchBar('操作系统Top10', 'terSystem', '#74BB5C', systemData)
        const tersData = ['1776*1080', '1280*720', '2560*1440', '1794*1080', '640*1136', '1812*1080', '1125*2001', '1920*1080']
        this.creEchBar('分辨率Top10', 'terRes', '#FFBA48', tersData)
        this.creEchPub('运营商分布', 'opeSub')
        this.creEchPub('网络类型分布', 'interSub')
    },
    methods: {
        changeTab(value) {
            this.active = value
        },
        getDateInfo(vv) {
            console.log(vv)
        },
        showDate() {
            document.getElementById('e').focus()
        },
        creEchLine() {
            echarts.registerMap('HK', ChinaJSON)
            const chart = echarts.init(document.getElementById('echMap'))
            chart.setOption({
                title: {
                    text: '',
                    subtext: '',
                    sublink: 'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c} (p / km2)'
                },
                toolbox: {
                    show: false
                },
                visualMap: {
                    type: 'continuous',
                    right: 0,
                    min: 800,
                    max: 50000,
                    text: ['High', 'Low'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['#D9EBFF', '#3392FF']
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'map',
                        mapType: 'HK', // 自定义扩展图表类型
                        itemStyle: {
                            normal: {label: {show: true}},
                            emphasis: {label: {show: true}}
                        },
                        data: [
                            {name: '辽宁', value: 20057.34},
                            {name: '河北', value: 15477.48},
                            {name: '北京', value: 31686.1},
                            {name: '上海', value: 6992.6},
                            {name: '江苏', value: 44045.49},
                            {name: '吉林', value: 40689.64},
                            {name: '黑龙江', value: 37659.78},
                            {name: '内蒙古', value: 45180.97},
                            {name: '青海', value: 55204.26},
                            {name: '山东', value: 21900.9},
                            {name: '天津', value: 4918.26},
                            {name: '宁夏', value: 5881.84},
                            {name: '陕西', value: 4178.01},
                            {name: '台湾', value: 2227.92},
                            {name: '海南', value: 2180.98},
                            {name: '河南', value: 9172.94},
                            {name: '新疆', value: 3368},
                            {name: '甘肃', value: 806.98},
                            {name: '香港', value: 806.98},
                            {name: '西藏', value: 806.98},
                            {name: '四川', value: 806.98},
                            {name: '云南', value: 806.98},
                            {name: '贵州', value: 806.98},
                            {name: '澳门', value: 806.98},
                            {name: '广西', value: 806.98},
                            {name: '广东', value: 806.98},
                            {name: '重庆', value: 806.98},
                            {name: '湖北', value: 806.98},
                            {name: '湖南', value: 806.98},
                            {name: '江西', value: 806.98},
                            {name: '安徽', value: 806.98},
                            {name: '福建', value: 806.98},
                            {name: '浙江', value: 806.98},
                            {name: '山西', value: 80611.98}
                        ],
                        // 自定义名称映射
                        nameMap: {
                            'Central and Western': '中西区',
                            'Eastern': '东区',
                            'Islands': '离岛',
                            'Kowloon City': '九龙城',
                            'Kwai Tsing': '葵青',
                            'Kwun Tong': '观塘',
                            'North': '北区',
                            'Sai Kung': '西贡',
                            'Sha Tin': '沙田',
                            'Sham Shui Po': '深水埗',
                            'Southern': '南区',
                            'Tai Po': '大埔',
                            'Tsuen Wan': '荃湾',
                            'Tuen Mun': '屯门',
                            'Wan Chai': '湾仔',
                            'Wong Tai Sin': '黄大仙',
                            'Yau Tsim Mong': '油尖旺',
                            'Yuen Long': '元朗'
                        }
                    }
                ]
            })
        },
        creEchBar(tileValue, id, color, getData) {
            const chart = echarts.init(document.getElementById(id))
            chart.setOption({
                title: {
                    text: tileValue,
                    top: '5.5%',
                    left: '10',
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: '#5A6D82',
                        fontSize: '15',
                        fontWeight: 'normal'
                    }
                },
                color: [color],
                tooltip: {
                    width: 20,
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
                    left: '50',
                    right: '50',
                    bottom: '30',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: getData,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            lineStyle: {
                                // 使用深浅的间隔色
                                color: 'rgb(240,240,240)'
                            }
                        },
                        axisLabel: {
                            color: '#5A6D82'
                        }
                    }
                ],
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
                            color: '#5A6D82'
                        },
                        splitLine: {
                        //  改变轴线颜色
                            lineStyle: {
                            // 使用深浅的间隔色
                                type: 'dotted'
                            }
                        }
                    }
                ],
                series: [
                    {
                        barMaxWidth: 20,
                        name: '直接访问',
                        type: 'bar',
                        data: [1000, 52, 200, 334, 390, 330, 220, 100, 20, 10],
                        itemStyle: {
                        }
                    }
                ]
            })
        },
        creEchPub(titleValue, id) {
            const chart = echarts.init(document.getElementById(id))
            chart.setOption({
                backgroundColor: '#F9FAFC',
                title: {
                    text: titleValue,
                    top: '5.5%',
                    left: '3.65%',
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: 'rgba(90,109,130,1)',
                        fontSize: '15',
                        fontWeight: 'normal'
                    }
                },
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
                        data: [
                            {
                                value: 335,
                                name: '其它',
                                itemStyle: {
                                    normal: {
                                        color: D.ChartPieColors[0]
                                    }
                                }
                            },
                            {
                                value: 310,
                                name: '中国电信',
                                itemStyle: {
                                    normal: {
                                        color: D.ChartPieColors[1]
                                    }
                                }
                            },
                            {
                                value: 135,
                                name: '中国移动',
                                itemStyle: {
                                    normal: {
                                        color: '#7065BB'
                                    }
                                }
                            },
                            {
                                value: 1548,
                                name: '中国联通',
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
.dashboard-terminal {
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
            .time-button-el {
                z-index: -1;
                width: 50px;
                right: 0;
                margin-top: -36px;
                opacity: 0;
                position: absolute;
            }

            @include pub-button;
            position: relative;
            float: right;
            width: auto;
            color: #3392FF;
            border-radius: 2px;
        }
        height: 32px;
    }
    @mixin ech-block(){
        font-size: 14px;
        background-color: #fff;
    }
    .live-map {
        .title {
        font-size:14px;
        font-family:MicrosoftYaHei;
        color:rgba(90,109,130,1);
        }
        .ech-map {
            width: 567px;
            height: 436px;
            margin-left: 208px;
            margin-top: 24px;
        }
        @include ech-block;
        height: 540px;
        padding-top: 20px;
        padding-left: 21px;
        margin-top: 30px;
    }
    .ter-bar-ech {
        .title {
        position: absolute;
        z-index: 1;
        }
        .ter-show-ech {
        position: absolute;
        width: 100%;
        height: 100%;
        }
        @include ech-block;
        position: relative;
        height: 320px;
        margin-top: 32px;
    }
    .ter-pub {
        .ter-pub-block {
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
                position: absolute;
                height: 174px;
                width: 100%;
                bottom: 0;
            }
            position: relative;
            float: left;
            background-color: #fff;
            width: 410px;
            height: 490px;
            margin-left: 15px;
        }
        .ter-ope-sub {
            margin-left: 0
        }
        .ech-acc-sub {
            height: 316px;
        }
        position: relative;
        height: 490px;
        margin-top: 24px;
    }
  min-width: 900px;
}
</style>
