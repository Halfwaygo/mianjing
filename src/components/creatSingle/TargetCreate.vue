<template>
    <div class="setting">
        <div class="type-generate chart-type-operate">
            <el-popover
                ref="popoverEvent"
                placement="right-start"
                title=""
                width="320"
                trigger="click"
                popper-class="popper-graph"
                content="">
                <div v-popover:detailPopoverEvent class="targetPopover">
                    <div class="input-suffix">
                        <el-input
                            v-model="insertValue"
                            size="small"
                            class="insert-search"
                            placeholder="搜索">
                            <i slot="suffix" size="mini" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <div class="typeBox">
                            <el-select v-model="selectValue" :disabled="selectEnable" placeholder="请选择" size="small" class="selected">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="selectPlaceValue" placeholder="请选择" size="small" class="selected" @change="placeChange">
                                <el-option
                                    v-for="item in placeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="search-end">
                        <div v-for="item in targetTypeList" v-show="(selectValue === item.typeId || selectValue === 3) && item.data && item.data.length > 0" :key="item.typeId" class="targetChooseBox" >
                            <div class="title">{{ item.name }}</div>
                            <ul>
                                <li v-for="info in item.data" v-show="info.isShowitem && (info.type === selectPlaceValue || selectPlaceValue === 0)" :key="info.id" @mouseover="showTargetDetail(info)" >
                                    <input v-model="info.ischeck" :disabled="targetTypeChooseList.length >= maxLen && info.ischeck === false" type="checkbox" name="target" class="checkLi" @change="changeTargetType(info)"/>
                                    <div :class="{'checked': info.ischeck}" class="targetInfoList" >
                                        <span class="iconBox"><i class="el-icon-check"></i></span>
                                        <span v-if="info.isComplex === 0">{{ info.name }} ({{ info.type === 1 ? 'android' : (info.type === 2 ? 'ios' : (info.type === 3 ? 'web' : '' )) }})</span>
                                        <span v-else >{{ info.name }}</span>
                                        <span v-if="info.comments.length > 0" class="describeText" style="float: right">
                                            <el-tooltip class="item" placement="right" effect="dark">
                                                <div slot="content">{{ info.comments }}</div>
                                                <i class="el-icon-question"></i>
                                            </el-tooltip>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-popover>
            <el-popover
                ref="detailPopoverEvent"
                placement="right-start"
                title=""
                width="320"
                trigger="hover"
                popper-class="popper-graph"
                content="">
                <div class="targetDetailPopover">
                    <div class="target-detail-title">指标详情</div>
                    <div class="h-title">
                        <div class="blue"></div>
                        <div class="h-title-tro">基本信息</div>
                    </div>
                    <div class="base-info">
                        <div class="base-info-name">
                            <span>名称</span>  <el-input v-model="zbName" class="base-info-input" disabled maxlength="20"></el-input>
                        </div>
                        <div class="base-info-page">
                            <span>页面</span>  <el-input v-model="zbPage" class="base-info-input" disabled ></el-input>
                        </div>
                    </div>
                    <div class="h-title">
                        <div class="blue"></div>
                        <div class="h-title-tro">统计趋势</div>
                    </div>
                    <div id="staCharts" class="show-charts"></div>
                </div>
            </el-popover>
            <div class="header">{{ name }} <el-button class="new-event-button" size="mini" @click="isShow = true">新建复合指标</el-button></div>
            <div class="event-icon">
                <slot name="metric"></slot>
                <div v-popover:popoverEvent v-show="!disable" class="metric-select" ><div class="text-name"><i class="icon-add-gray selectIcon"></i>选择指标</div></div>
                <draggable v-model="targetTypeChooseList" :options="dragOptions" :move="onMove" element="div" class="list-group" @start="isDragging=true" @end="onEnd" >
                    <transition-group :name="'flip-list'" type="transition" >
                        <div v-for="(item, index) in targetTypeChooseList" :key="item.id" class="metricList">
                            <div v-if="item.enable === 1" class="metric-select no-margin-top">
                                <div :class="{'hasSelect': item.isComplex === 0}" class="text-name">{{ item.name }}</div>
                                <el-select v-show="item.isComplex === 0" v-model="item.innerType" placeholder="" size="small" class="selected select-type" @change="changeSelect">
                                    <el-option
                                        v-for="item in item.selectList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else class="metric-select no-margin-top">
                                <div class="text-name enable">该指标已于{{ item.updateTime }}被删除</div>
                            </div>
                            <span v-show="!disable" class="delBtn" @click="delMetricInfo(item, index)"><i class="icon-delete-gray delIcon"></i></span>
                        </div>
                    </transition-group>
                </draggable>
            </div>
            <div class="event-icon">
                <slot></slot>
            </div>
        </div>
        <composite-create :is-show="isShow" @noneshow="getShow" @addSuccess="addSuccess"></composite-create>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapActions, mapState } from 'vuex'
import CompositeCreate from '../creatSingle/CompositeCreate'
import draggable from 'vuedraggable'
import * as Select from '../../constants/composite'

export default {
    name: 'TargetCreate',
    components: {
        CompositeCreate,
        draggable
    },
    props: {
        defaultInfo: {
            type: Array
        },
        name: {
            type: String,
            default: '选择指标'
        },
        maxNumber: {
            type: Number,
            default: 5
        },
        disable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            zbName: '',
            zbPage: '',
            maxLen: 5,
            isShow: false,
            options: [{
                value: 3,
                label: '全部类型'
            }, {
                value: 1,
                label: '预定义指标'
            }, {
                value: 0,
                label: '圈选指标'
            }, {
                value: 2,
                label: '复合指标'
            }],
            insertValue: '',
            selectValue: 3,
            targetTypeChooseList: [],
            targetTypeList: [],
            selectPlaceValue: 0,
            placeOptions: [{
                value: 0,
                label: '全部平台'
            }, {
                value: 1,
                label: 'android'
            }, {
                value: 2,
                label: 'ios'
            }, {
                value: 3,
                label: 'web'
            }],
            selectEnable: false
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId,
            platform: ({root}) => root.platform
        }),
        dragOptions () {
            return {
                animation: 0,
                group: 'targetDrag',
                disabled: false,
                ghostClass: 'ghost'
            }
        }
    },
    watch: {
        maxNumber(value, oldValue) {
            this.maxLen = value
            if (value < oldValue) {
                if (this.targetTypeChooseList.length > value) {
                    this.targetTypeChooseList.splice(value)
                    this.initData()
                    this.$emit('targetlistinfo', this.targetTypeChooseList)
                }
            }
        },
        defaultInfo(vale, oldValue) {
            this.targetTypeChooseList = vale
            this.initData()
        },
        insertValue(val, oldval) {
            this.insertValue = val
            this.findeTarget()
        },
        disable(val, olde) {
            this.disable = val
        }
    },
    mounted() {
        this.maxLen = this.maxNumber
        this.targetTypeChooseList = this.defaultInfo || []
        this.initPlaceOptions()
        this.getTargetTypeList()
    },
    methods: {
        initPlaceOptions() {
            if (this.platform === '0') {
                this.placeOptions = [{
                    value: 0,
                    label: '全部平台'
                }, {
                    value: 1,
                    label: 'android'
                }, {
                    value: 2,
                    label: 'ios'
                }]
            } else if (this.platform === '1') {
                this.placeOptions = [{
                    value: 0,
                    label: '全部平台'
                }, {
                    value: 3,
                    label: 'web'
                }]
            }
        },
        initData() {
            // console.log(this.targetTypeList)
            // 格式化数据，出现选中的样式
            for (let j = 0; j < this.targetTypeList.length; j++) {
                let item = this.targetTypeList[j].data
                for (let k = 0; k < item.length; k++) {
                    item[k].ischeck = false
                    for (let i = 0; i < this.targetTypeChooseList.length; i++) {
                        if (this.targetTypeList[j].typeId === this.targetTypeChooseList[i].isComplex && item[k].id === this.targetTypeChooseList[i].id) {
                            item[k].ischeck = true
                        }
                    }
                }
            }
        },
        placeChange() {
            // 平台的切换
            if (this.selectPlaceValue === 0) {
                this.selectEnable = false
            } else {
                this.selectValue = 0
                this.selectEnable = true
            }
        },
        changeTargetType(item) {
            // 返回选中的值
            if (item.ischeck) {
                this.targetTypeChooseList.push(item)
            } else {
                let index = 0
                for (let i = 0; i < this.targetTypeChooseList.length; i++) {
                    if (this.targetTypeChooseList[i].id === item.id) {
                        index = i + 1
                        break
                    }
                }
                if (index > 0) {
                    this.targetTypeChooseList.splice(index - 1, 1)
                }
            }
            console.log(this.targetTypeChooseList)
            this.$emit('targetlistinfo', this.targetTypeChooseList)
        },
        changeSelect() {
            console.log(this.targetTypeChooseList)
            this.$emit('targetlistinfo', this.targetTypeChooseList)
        },
        getShow(v) {
            this.isShow = false
        },
        delMetricInfo(item, index) {
            // 删除选中的指标
            this.targetTypeChooseList.splice(index, 1)
            this.initData()
            this.$emit('targetlistinfo', this.targetTypeChooseList)
        },
        onMove ({relatedContext, draggedContext}) {
            // this.$emit('targetlistinfo', this.targetTypeChooseList)
            const relatedElement = relatedContext.element
            const draggedElement = draggedContext.element
            return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        },
        onEnd() {
            this.$emit('targetlistinfo', this.targetTypeChooseList)
        },
        addSuccess() {
            // 复合指标添加成功，重新获取指标
            this.getTargetTypeList()
        },
        getTargetTypeList() {
            // 获取圈选指标、预定义指标及复合指标
            let params = {
                appId: this.appId,
                type: 0, // this.selectValue(数据少，直接获取全部)
                id: ''
            }
            Api.graphGetEventAllIndexList(params).then(res => {
                let dataList1 = []
                let dataList2 = []
                let dataList3 = []
                // 圈选指标
                if (res.data1 && res.data1.length > 0) {
                    res.data1.forEach(item => {
                        let list1 = {
                            name: item.name,
                            isPage: item.isPage,
                            id: item.id,
                            comments: item.comments,
                            ischeck: item.isCheck === 1,
                            isComplex: item.isComplex,
                            isShowitem: true,
                            selectList: item.isPage === 1 ? Select.pageSelectList : Select.elementSelectList,
                            innerType: item.isPage === 1 ? 1 : 2,
                            enable: item.enable,
                            updateTime: item.updateTime,
                            type: item.type
                        }
                        dataList1.push(list1)
                    })
                }
                // 预定义指标
                if (res.data2 && res.data2.length > 0) {
                    res.data2.forEach(item => {
                        let list2 = {
                            name: item.name,
                            isPage: item.isPage,
                            id: item.id,
                            comments: item.comments,
                            ischeck: item.isCheck === 1,
                            isComplex: item.isComplex,
                            isShowitem: true,
                            selectList: [],
                            innerType: 0,
                            enable: item.enable,
                            updateTime: item.updateTime,
                            type: item.type
                        }
                        if (this.platform === '0' && (item.type === 1 || item.type === 2)) {
                            dataList2.push(list2)
                        } else if (this.platform === '1' && item.type === 3) {
                            dataList2.push(list2)
                        }
                    })
                }
                // 复合指标
                if (res.data3 && res.data3.length > 0) {
                    res.data3.forEach(item => {
                        let list3 = {
                            name: item.name,
                            isPage: item.isPage,
                            id: item.id,
                            comments: item.comments,
                            ischeck: item.isCheck === 1,
                            isComplex: item.isComplex,
                            isShowitem: true,
                            selectList: [],
                            innerType: 0,
                            enable: item.enable,
                            updateTime: item.updateTime,
                            type: item.type
                        }
                        dataList3.push(list3)
                    })
                }
                this.targetTypeList = [
                    {name: '圈选指标',
                        typeId: 0,
                        data: dataList1
                    },
                    {name: '预定义指标',
                        typeId: 1,
                        data: dataList2
                    },
                    {name: '复合指标',
                        typeId: 2,
                        data: dataList3
                    }
                ]
                this.initData()
            })
        },
        findeTarget() {
            // 搜索功能
            this.targetTypeList.forEach((item) => {
                item.data.forEach(res => {
                    res.isShowitem = !this.insertValue
                    if (res.name.indexOf(this.insertValue) !== -1) {
                        res.isShowitem = true
                    }
                })
                // if (item.typeId === this.selectValue || this.selectValue === 3) {
                //
                // }
            })
        },
        showTargetDetail(info) {
            this.zbName = info.name
            let params = {
                id: info.id
            }
            Api.getMCircleDetailIndex(params).then(res => {
                this.zbPage = res.path
            })
            this.getMCircleGetIndexAction({id: info.id, appId: this.appId}).then(res => {
                let dataArr = []
                let axisArr = []
                let name = ''
                if (info.isPage === 0) {
                    name = '点击量'
                } else if (info.isPage === 1) {
                    name = '浏览量'
                }
                res.forEach(item => {
                    let date = item.DAY_ID.split('-')[1] + '/' + item.DAY_ID.split('-')[2]
                    dataArr.push(item.COUNTNUM)
                    axisArr.push(date)
                })
                this.creCharts(name, dataArr, axisArr)
            })
        },
        creCharts(name, dataArr, axisArr) {
            const chart = this.$echarts.init(document.getElementById('staCharts'))
            chart.setOption({
                title: {
                    text: '',
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
                    type: 'category'
                    /*
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {backgroundColor: '#505765'}
                    }
                    */
                },
                legend: {
                    data: [{'name': name}],
                    bottom: '5',
                    icon: 'rect',
                    itemWidth: 30,
                    itemHeight: 6
                },
                color: ['#74BB5C'],
                grid: {
                    top: '2.5%',
                    left: '7.1%',
                    right: '7.3%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: axisArr,
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
                    axisLine: {show: false},
                    axisTick: {show: false}
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
                    axisLine: { show: false },
                    // 控制网格线是否显示
                    splitLine: {
                        //  改变轴线颜色
                        lineStyle: {
                            // 使用深浅的间隔色
                            type: 'dotted'
                        }
                    },
                    // 刻度
                    axisTick: {show: false}
                },
                series: [
                    {
                        name: name,
                        type: 'line',
                        stack: '总量',
                        data: dataArr
                    }
                ]
            })
        },
        ...mapActions(['getMCircleGetIndexAction'])
    }
}
</script>

<style lang="scss">
    @import "../../layouts/css/createSingle/create";

</style>
