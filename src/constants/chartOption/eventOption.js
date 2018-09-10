
import echarts from 'echarts'
// 线图 纵向柱状图
const chart1Optine = {
    title: {},
    tooltip: {
        trigger: 'axis',
        /*
        axisPointer: {
            type: 'cross',
            animation: false,
            label: {
                backgroundColor: '#505765'
            }
        },
        */
        textStyle: {
            align: 'left' // toast 左对齐
        }
    },
    legend: {
        data: [],
        align: 'auto',
        bottom: 0,
        icon: 'roundRect',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
            color: '#5A6D82',
            fontSize: 11
        },
        formatter(value) {
            return value.length > 7 ? value.substring(0, 6) + '...' : value
        }
    },
    grid: {
        top: 70,
        left: 40,
        right: 60,
        bottom: 70
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
        data: []
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
            },
            formatter (value) {
                let t = value >= 10000 ? (value >= 100000000 ? value / 100000000 + '亿' : value / 10000 + '万') : value
                return `${t}`
            }
        },
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: []
}
// 横向柱状图
const chart2Option = {
    title: {
        text: '',
        textStyle: {
            fontFamily: 'MicrosoftYaHei',
            color: 'rgba(90,109,130,1)',
            fontSize: '15',
            fontWeight: 'normal'
        }
    },
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
    grid: {
        top: '20',
        left: '35',
        right: '100',
        bottom: '10',
        containLabel: true
    },
    xAxis: {
        position: 'top',
        type: 'value',
        axisLabel: {
            show: true,
            textStyle: {
                fontFamily: 'MicrosoftYaHei',
                color: 'rgba(109,118,132,1)'
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
            show: false
        },
        axisTick: {
            show: false
        }
    },
    yAxis: {
        type: 'category',
        data: [],
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#5A6D82'
            },
            formatter(value) {
                return value === '' ? 'N/A' : value
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
                        return `${data.data} (${data.data / 40}%)`
                    },
                    textStyle: {
                        fontSize: '12',
                        fontFamily: 'MicrosoftYaHei',
                        color: '#5A6D82'
                    }
                }
            },
            data: [],
            itemStyle: {
                // 通常情况下：
                normal: {
                    show: true,
                    barBorderRadius: [0, 20, 20, 0],
                    // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: '#3CAF41'
                },
                // 鼠标悬停时：
                emphasis: {
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
}
// 数值图
const chart5Option = {
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
        left: 40,
        right: 40
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
            show: false,
            textStyle: {
                color: '#6D7684'
            }
        },
        data: []
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false,
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
                color: '#ffffff'
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#ffffff'
                }, {
                    offset: 1,
                    color: '#ffffff'
                }])
            }
        },
        data: [5, 20, 36, 10, 10, 20, 10]
    }]
}

// 渠道的图
const channelChartOption = {
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
        left: 40,
        right: 60
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
        data: [] // ['12/25周一', '12/27周三', '12/28周四', '12/29周五', '12/30周六', '12/31周日']
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
    series: []
}
// 漏斗图
const funnelsOption = {
    title: {
        text: '',
        subtext: '',
        top: '0.5%',
        left: '4.65%',
        textStyle: {
            fontFamily: 'MicrosoftYaHei',
            color: 'rgba(90,109,130,1)',
            fontSize: '15',
            fontWeight: 'normal'
        }
    },
    tooltip: {
        trigger: 'axis',
        /*
        axisPointer: {
            type: 'cross',
            animation: false,
            label: {
                backgroundColor: '#505765'
            }
        },
        */
        formatter (value) {
            return value[0].axisValue + '<br />' + '转化率: ' + (parseFloat(value[0].data.value) * 100).toFixed(1) + '%' + '<br />' + '转化人数:' + value[0].data.name
        }
    },
    legend: {
        show: false
    },
    grid: {
        top: 8,
        left: 48,
        right: 40,
        bottom: 20
    },
    color: ['#74BB5C'],
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLabel: {
            textStyle: {
                color: '#6D7684'
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
        splitLine: {
            //  改变轴线颜色
            lineStyle: {
                // 使用深浅的间隔色
                type: 'dotted'
            }
        },
        axisLabel: {
            formatter (value) {
                return (value * 100) + '%'
            }
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        }
    },
    series: [{
        name: '转化率',
        type: 'line',
        smooth: true,
        data: []
    }, {
        name: '',
        type: 'line',
        smooth: true,
        data: [],
        line: {
            markLine: {
                silent: true
            }
        },
        lineStyle: {
            // 使用深浅的间隔色
            opacity: 0
        }
    }]
}
// 留存的图
const retentionChartOption = {
    title: {},
    tooltip: {
        trigger: 'axis',
        /*
        axisPointer: {
            type: 'cross',
            animation: false,
            label: {
                backgroundColor: '#505765'
            }
        },
        */
        formatter (res) {
            let items = res[0]
            let percents = parseFloat((items.value * 100).toFixed(2))
            return `${items.name}<br/>${items.seriesName}: ${percents}%`
        }
    },
    grid: {
        top: 8,
        left: 48,
        right: 40,
        bottom: 20
    },
    xAxis: {
        boundaryGap: false,
        axisLabel: {
            textStyle: {
                color: '#6D7684'
            }
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        data: [] // ['当日', '次日', '2日后', '3日后', '4日后', '5日后', '6日后']
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        interval: 0.2,
        axisLabel: {
            show: true,
            textStyle: {
                fontFamily: 'MicrosoftYaHei',
                color: 'rgba(109,118,132,1)'
            },
            formatter: (f) => {
                return `${f * 100}%`
            }
        },
        axisLine: {
            show: false
        },
        // 控制网格线是否显示
        splitLine: {
            //  改变轴线颜色
            lineStyle: {
                // 使用深浅的间隔色
                type: 'dotted'
            }
        },
        // 刻度
        axisTick: {
            show: false
        }
    },
    series: [{
        name: '留存率',
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
        data: [] // [5, 20, 36, 10, 10, 20, 10]
    }]
}
const echartColor = {
    1: {
        value: '#3392FF',
        rgbaValue: 'rgba(41,123,254,0.2)'
    },
    2: {
        value: '#7262BA',
        rgbaValue: 'rgba(93,74,171,0.2)'
    },
    3: {
        value: '#D587E3',
        rgbaValue: 'rgba(52,163,50,0.2)'
    },
    4: {
        value: '#F35974',
        rgbaValue: 'rgba(237,63,97,0.2)'
    },
    5: {
        value: '#F5D41D',
        rgbaValue: 'rgba(241,205,24,0.2)'
    }
}
const lineColors = ['#3392FF', '#D587E3', '#F5D41D', '#F5A61D', '#E85054', '#7262BA', '#F35974', '#74BB5C', '#42B5E4', '#425DE4']
const timeItem = {
    ischeck: false,
    name: '时间',
    id: 0
}
export default {
    chart2Option,
    chart5Option,
    echartColor,
    chart1Optine,
    lineColors,
    channelChartOption,
    funnelsOption,
    retentionChartOption,
    timeItem
}
