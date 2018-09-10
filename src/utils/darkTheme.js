define(function () {
    
    var fs = 14;
    var titleFs = 14,
        titleC = '#333',
        legendFs = 14,
        legendC = '#666',
        axisFs = 12,
        axisLabelTextColor = '#6d7684',
        tipFs = 14,
        tooltipBC = '#5e687a';

    var XsplitLineBC = '#eee',
        YsplitLineBC = '#ddd';

    //var colorPalette = ['#46bafe','#ff9587', '#4bf4e3', '#b763ff', '#00cc00', '#1e6a99'];//['#1e6a99', '#00cc00', '#b763ff', '#4bf4e3','#f3e500', '#46bafe',];
    //var colorPalette = ['#ffa72a','#00ce00', '#0099e0', '#2d41ac', '#fb4f4f', '#b75bff'];//['#1e6a99', '#00cc00', '#b763ff', '#4bf4e3','#f3e500', '#46bafe',];
    var colorPalette = ['#0099df','#00ce01','#ffa72b',  '#2b42aa', '#fb4f4f', '#b75bfe'];//['#1e6a99', '#00cc00', '#b763ff', '#4bf4e3','#f3e500', '#46bafe',];


    var theme = {
        // 全图默认背景
        backgroundColor: '#fff',//'rgba(56, 83, 113, 0.2)',
        /*xAxis : [
            {
                type : 'category',
                axisLabel:{
                    interval:3
                },
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],*/
        // 全图默认字体样式
        textStyle: {
            fontFamily: 'Microsoft YaHei'
        },

        // 默认色板
        color: colorPalette,
        /*[
            '#46bafe','#f3e500', '#4bf4e3', '#b763ff', '#00cc00', '#1e6a99',
            '#00b7ee', '#fafa93', '#ae5da1', '#FE8463', '#9BCA63', '#FAD860','#60C0DD', '#0084C6',
            '#D7504B', '#C6E579', '#26C0C0', '#F0805A', '#F4E001',
            '#B5C334'
        ],*/

        // 图表标题
        title: {
            x: 'center',
            padding: 0,
            top:26,
            textStyle: {
                fontSize: titleFs,
                fontWeight: 'bolder',
                color: titleC          // 主标题文字颜色
            }
        },

        // 图例
        legend: {
            itemWidth: 22,
            itemHeight: 12,
            itemGap: 40,
            top: 75,
            textStyle: {
                fontSize: legendFs,
                color: legendC          // 图例文字颜色
            }
        },

        // 值域
        dataRange: {
            itemWidth: 15,
            color: ['#FFF808', '#21BCF9'],
            textStyle: {
                color: '#ccc'          // 值域文字颜色
            }
        },

        // 提示盒子
        toolbox: {
            top: 18,
            left: 105,
            itemSize: 15,
            color: ['#000', '#000', '#000', '#000'],
            effectiveColor: '#FE8463',
            disableColor: '#666',
            borderWidth: 1,
            borderColor: '#e6e7ed',
            showTitle: false,
            /*iconStyle: {
                normal: {
                    color:'#e6e7ed',
                },
                emphasis: {
                    color:'#40b6fa',
                }
            },*/
        },

        // 提示框
        tooltip: {
            show: true,
            trigger: 'item',
            borderWidth: 0,
            padding: [10, 10, 10, 25],
            extraCssText: 'border-radius: 8px;',
            backgroundColor: tooltipBC,     // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow',         // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {          // 直线指示器样式设置
                    color: '#666'
                },
                crossStyle: {
                    color: '#666'
                },
                shadowStyle: {                     // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0)'
                }
            },
            textStyle: {
                color: '#fff',
                fontSize: tipFs
            }
        },

        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#555',            // 数据背景颜色
            fillerColor: 'rgba(200,200,200,0.2)',   // 填充颜色
            handleColor: '#eee'     // 手柄颜色
        },

        // 网格
        grid: {
            borderWidth: 0,
            top: 75,
            left: 60,
            right: 15,
            bottom: 35,
        },

        // x轴 - 类目轴
        categoryAxis: {
            axisLine: {            // 坐标轴线
                show: true,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: XsplitLineBC, //横坐标颜色
                    type: 'dashed'
                },
                height: 0.5
            },
            axisTick: {            // 坐标轴小标记
                show: false
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: axisLabelTextColor, //横坐标文字颜色大小
                    fontSize: axisFs
                },
                interval: 0,
                margin: 12
            },         
            splitLine: {            // 分隔线
                show: true,
                lineStyle: {
                    color: [XsplitLineBC],
                }
            },
            boundaryGap: ['15px', '15px'],
        },

        // Y轴, 数值型坐标轴默认参数
        valueAxis: {
            nameGap: 50,     //顶部name距离y坐标轴的间距
            nameTextStyle: { //顶部name文本样式
                color: '#fff',
                fontSize: fs
            },
            axisLine: {                 // 坐标轴线
                show: true,
                lineStyle: {            // 属性lineStyle（详见lineStyle）控制线条样式
                    color: '#fff', //纵坐标颜色
                    width: 0.5
                }
            },
            axisTick: {            // 坐标轴小标记
                show: false
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: axisLabelTextColor, //纵坐标文字颜色大小
                    fontSize: axisFs
                },
                interval: 0, //横轴信息全部显示
                margin: 14
            },
            splitLine: {           // 分隔线
                show: true,
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: [YsplitLineBC],
                    type: 'dashed'
                }
            },
            splitArea: {           // 分隔区域
                show: false
            }
        },

        //极坐标系
        polar: {
            name: {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#ccc'
                }
            },
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.2)', 'rgba(200,200,200,0.2)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },

        timeline: {
            label: {
                textStyle: {
                    color: '#ccc'
                }
            },
            lineStyle: {
                color: '#aaa'
            },
            controlStyle: {
                normal: {color: '#fff'},
                emphasis: {color: '#FE8463'}
            },
            symbolSize: 3
        },

        // 折线图默认参数
        line: {
            smooth: true,
            //height: 10,
            symbol: 'emptyCircle',  // 拐点图形类型
            symbolSize: 10           // 拐点图形大小
        },

        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#FE8463',       // 阳线填充颜色
                    color0: '#9BCA63',      // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#FE8463',   // 阳线边框颜色
                        color0: '#9BCA63'   // 阴线边框颜色
                    }
                }
            }
        },

        // 雷达图默认参数
        radar: {
            symbol: 'emptyCircle',    // 图形类型
            symbolSize: 3
            //symbol: null,         // 拐点图形类型
            //symbolRotate : null,  // 图形旋转控制
        },

        pie: {
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                },
                emphasis: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 1)'
                }
            }
        },

        map: {
            itemStyle: {
                normal: {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            // color: '#ccc'
                        }
                    }
                },
                emphasis: {                 // 也是选中样式
                    areaStyle: {
                        color: '#FE8463'
                    },
                    label: {
                        textStyle: {
                            // color: 'ccc'
                        }
                    }
                }
            }
        },

        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        color: '#fff'
                    }
                }
            }
        },

        chord: {
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(228, 228, 228, 0.2)',
                    chordStyle: {
                        lineStyle: {
                            color: 'rgba(228, 228, 228, 0.2)'
                        }
                    }
                },
                emphasis: {
                    borderWidth: 1,
                    borderColor: 'rgba(228, 228, 228, 0.9)',
                    chordStyle: {
                        lineStyle: {
                            color: 'rgba(228, 228, 228, 0.9)'
                        }
                    }
                }
            }
        },

        gauge: {
            axisLine: {            // 坐标轴线
                show: true,        // 默认显示，属性show控制显示与否
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#9BCA63'], [0.8, '#60C0DD'], [1, '#D7504B']],
                    width: 3,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: {            // 坐标轴小标记
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: {           // 分隔线
                length: 25,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {           // 分隔线
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
            },
            title: {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: fs,
                    fontStyle: 'italic',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            detail: {
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
                offsetCenter: [0, '50%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#fff'
                }
            }
        },

        funnel: {
            itemStyle: {
                normal: {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 1
                },
                emphasis: {
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1
                }
            }
        },

        textStyle: {
            fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
        }
    };

    return theme;
});