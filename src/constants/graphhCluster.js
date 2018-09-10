/**
 * Created by wangxy on 2018/4/27.
 */
import echarts from 'echarts'
export const clusterList = {
    name: 'as1',
    optionInfo: {
        title: {
            text: '',
            subtext: '',
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    show: true
                }
            },
            extraCssText: 'text-align: left'
        },
        toolbox: {
            show: false,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        legend: {
            data: ['所有用户', '近30日启动次数大于10的用户'],
            itemGap: 20,
            itemWidth: 30,
            itemHeight: 6
        },
        grid: {
            top: '10%',
            left: '0%',
            right: '0%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['华为', '荣耀', '小米', 'vivo', '三星', 'OPPO', '红米', '乐视'],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#6D7684',
                        type: 'dashed'
                    }
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    formatter(a) {
                        a = +a
                        return isFinite(a) ? echarts.format.addCommas(+a / 10) : ''
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }
        ],
        dataZoom: [
            {
                height: 14,
                showDataShadow: false,
                backgroundColor: '#F3F4F8',
                fillerColor: '#A9AFB6',
                show: true,
                start: 20,
                end: 80,
                zoomLock: false
            },
            {
                type: 'inside',
                start: 20,
                end: 80,
                zoomLock: false
            }
        ],
        series: [
            {
                name: '所有用户',
                type: 'bar',
                barMaxWidth: 20,
                data: [132, 323, 423, 532, 163, 362, 17, 41],
                itemStyle: {
                    normal: {
                        show: true,
                        color: '#37A2DA'
                    }
                }
            },
            {
                name: '近30日启动次数大于10的用户',
                type: 'bar',
                barMaxWidth: 20,
                data: [4, 1, 12, 45, 153, 3, 9, 13],
                itemStyle: {
                    normal: {
                        show: true,
                        color: '#ffd85c'
                    }
                }
            }
        ]
    }
}
export const createClusterList = {
    name: 89,
    optionsBar: {
        tooltip: {
            show: false, // 隐藏的hover
            extraCssText: 'text-align: left'
        },
        grid: {
            top: '15%',
            bottom: '10%'
        },
        xAxis: {
            type: 'category',
            data: ['小米', '苹果', '华为', '一加', '中兴', '三星', '锤子', '坚果', '魅族', '红米'],
            axisLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#6D7684'
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: [{
            type: 'value',
            min: 0,
            max: 1200,
            interval: 240,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        }, {
            type: 'value', //  根据实际的比例调整
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
                formatter: '{value} %'
            },
            splitLine: {
                show: false,
                lineStyle: {
                    type: 'none'
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        }],
        series: [{
            data: [900, 800, 400, 300, 100, 50, 1030, 630, 520, 770],
            type: 'bar',
            barWidth: 22,
            itemStyle: {
                normal: {
                    show: true,
                    color: '#74BB5C'
                }
            }
        }, {
            data: [48, 45, 20, 12, 9, 3, 90, 50, 30, 29],
            type: 'line',
            yAxisIndex: 1, // 根据y轴的右侧指标来
            showSymbol: false // 控制显示hover的值
        }]
    },
    optionsPie: {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        grid: {
            top: '0'
        },
        color: ['#F35974', '#F5A61D', '#F5D41D', '#74BB5C', '#42B5E4', '#D587E3', '#D587E3', '#425DE4', '#346DFE', '#3491FE'],
        legend: [ {
            x: 'center',
            bottom: '22px',
            data: ['小米', '苹果', '华为'],
            itemWidth: 30,
            itemHeight: 6,
            itemGap: 20
        },
        {
            x: 'center',
            bottom: '0',
            data: ['一加', '中兴', '三星'],
            itemWidth: 30,
            itemHeight: 6,
            itemGap: 20
        }],
        //     {
        //     orient: 'horizontal',
        //     x: 'center',
        //     y: 'bottom',
        //     data: ['小米', '苹果', '华为', 'vivo', 'OPPO', '三星'],
        //     itemWidth: 30,
        //     itemHeight: 6,
        //     itemGap: 20
        // },
        series: [
            {
                name: '占比率',
                type: 'pie',
                radius: ['40%', '60%'],
                center: ['50%', '42%'],
                avoidLabelOverlap: true,
                data: [
                    {value: 900, name: '小米'},
                    {value: 800, name: '苹果'},
                    {value: 400, name: '华为'},
                    {value: 300, name: '一加'},
                    {value: 100, name: '中兴'},
                    {value: 50, name: '三星'}
                ]
            }
        ]
    }
}
