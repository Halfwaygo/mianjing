/**
 * Created by wangxy on 2018/5/4.
 */
export const chart = {
    setOpt: {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '6%',
            containLabel: true
        },
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
        },
        yAxis: {
            type: 'value',
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
        },
        series: [
            {
                name: '访问量',
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: '#D5E1EA'
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '用户数',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#F4AA37'
                    }
                },
                stack: '总量',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    }
}
