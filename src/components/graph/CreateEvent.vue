<template>
    <div class="chartMainBox">
        <create-garph-menus :editbasedata="envetNameObj" :name="titleName" :is-detail="isDetail" @saveCreGraph="saveEvent"></create-garph-menus>
        <el-container class="chartMain">
            <el-aside width="470px">
                <style-create :disable="hasEnable" :choose-id="showType" :name="'1.选择图标样式'" @getstyleid="getstyleid"></style-create>
                <target-create :disable="hasEnable" :name="'2.选择指标'" :max-number="maxNumber" :default-info="targetListInfo" @targetlistinfo="getTargetListInfo">
                    <div v-show="isShowSing || isShowMore || isShowColor" slot="metric" class="titleDiv">选择指标</div>
                    <div v-show="isShowSing || isShowMore " class="titleDiv">选择维度</div>
                    <div v-show="isShowSing" class="singleDimension">
                        <el-select v-model="selectDimensionInfo" :disabled="hasEnable" placeholder="请选择维度" size="small" class="selected" @change="changeDimension">
                            <el-option
                                v-for="item in allDimensionTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="isShowMore">
                        <dimension-create :disable="hasEnable" :all-dimension-type-list="allDimensionTypeList" :default-info="selectDimensionListInfo" @targetlistinfo="getDimensionListInfo"></dimension-create>
                    </div>
                    <div v-show="isShowColor">
                        <div class="titleDiv">选择颜色</div>
                        <div class="chooseColor">
                            <span v-for="(item, index) in chooseColorList" :key="index" :class="['color' + item , item === chooseColor ? 'active': '' ]" class="colorSpan" >
                                <input v-model="chooseColor" :disabled="hasEnable" :value="item" type="radio" name="chooseColor" @change="changeColor"/>
                                <i class="el-icon-check"></i>
                            </span>
                        </div>
                    </div>

                </target-create>
                <div class="userBox">
                    <target-user :disable="hasEnable" :event-type="'event'" :default-single-choos-value="groupName" :name="'3.目标用户'" @selectUser="selectUser"></target-user>
                </div>
                <filter-creat :disable="hasEnable" :selected-list-info="selectList" :name="'4.过滤条件'" @selects="selectBox"></filter-creat>
            </el-aside>
            <el-main>
                <no-data-stone v-show="selectTargetLis.length <= 0"></no-data-stone>
                <div v-show="selectTargetLis.length > 0" class="chartBodyBox">
                    <div class="chartHead">
                        <div class="timeBolck">
                            <date-picker :get-cyclce="defaultTime" @getDateValue="getDateInfo"></date-picker>
                        </div>
                        <div v-show="isShowCycle" class="selectBlock">
                            <el-select v-model="dayTime" placeholder="请选择" size="small" class="selected btn-el" @change="dayTimeChange">
                                <el-option
                                    v-for="item in datTimeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div v-show="showType === 0 || showType === 2">
                        <div id="activeChartBar1" class="chartBox"></div>
                    </div>
                    <div v-show="showType === 1">
                        <div id="activeChartBar2" class="chartBox"></div>
                    </div>
                    <div v-show="showType === 3" id="activeChartBar4" class="chartBox tableBox" style="position: relative;">
                        <el-table
                            :data="tableData3"
                            height="350"
                            border
                            style="width: 100%">
                            <el-table-column v-for="(hItem, k) in tableHead" :key="k" :prop="hItem.prop " :label="hItem.name">
                            </el-table-column>
                        </el-table>
                        <div v-show="tableLoading" id="table3" class="table-loading"></div>
                    </div>
                    <div v-show="showType === 4">
                        <div class="dataCompare">
                            <div class="inline-block toNum">{{ compareNum }}</div>
                            <div class="inline-block">
                                <div v-if="compareNum >= 0" class="compareNum">
                                    {{ comparePre }}
                                    <img src="../../layouts/images/icon/icon-up-green.png"/>
                                </div>
                                <div v-else class="downCopareNum">
                                    {{ comparePre }}
                                    <img src="../../layouts/images/icon/icon-down-red.png"/>
                                </div>
                                <div class="compareTxt">相比上周期</div>
                            </div>
                        </div>
                        <div id="activeChartBar5" class="chartBox smallChart"></div>
                    </div>
                </div>
            </el-main>
        </el-container>

    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapState } from 'vuex'
import FilterCreat from '../../components/creatSingle/FilterCreat'
import StyleCreate from '../../components/creatSingle/StyleCreate'
import TargetCreate from '../../components/creatSingle/TargetCreate'
import DatePicker from '../../components/datePicker.vue'
import DimensionCreate from '../../components/creatSingle/DimensionCreate'
import TargetUser from '../../components/TargetUser.vue'
import CreateGarphMenus from '../creatSingle/CreTopMenu'
import createChart from '../../constants/chartOption/eventOption'
import * as Select from '../../constants/composite'
import weekDate from '../../utils/changeDate'
import NoDataStone from '../../components/NoData' // 无数据
export default {
    name: 'CreateEvent',
    components: {
        FilterCreat,
        StyleCreate,
        TargetCreate,
        DatePicker,
        DimensionCreate,
        TargetUser,
        CreateGarphMenus,
        NoDataStone
    },
    data() {
        return {
            isDetail: this.$route.query.mode && this.$route.query.mode === 'detail',
            titleName: this.$route.query.mode && this.$route.query.mode === 'edit' ? '编辑事件分析' : (this.$route.query.mode && this.$route.query.mode === 'detail' ? '查看事件分析' : '新建事件分析'),
            maxNumber: 5,
            dayTime: 1,
            isShowMore: false,
            isShowSing: false,
            isShowColor: false,
            isShowCycle: true,
            showType: 0,
            datTimeList: [{
                value: 1,
                label: '天'
            }, {
                value: 2,
                label: '周'
            }, {
                value: 3,
                label: '月'
            }],
            selectList: {
                conditionType: '',
                allList: []
            },
            targetListInfo: [],
            selectDimensionListInfo: [],
            allDimensionTypeList: [],
            selectDimensionInfo: '',
            chooseColorList: [ 1, 2, 3, 4, 5 ],
            chooseColor: 1,
            lineRes: {},
            line2Res: {},
            line5Res: {},
            tableData3: [],
            chartColors: createChart.echartColor,
            id: this.$route.query.id || '',
            selectTargetLis: [],
            startTime: '',
            endTime: '',
            groupId: '',
            groupName: '',
            dimensionList: [],
            defaultTime: '',
            envetNameObj: {
                graphName: '',
                graphDescription: ''
            },
            hasEnable: false,
            comStartTime: '',
            comEndTime: '',
            compareNum: 0,
            comparePre: '+0%',
            tableHead: [],
            cyclceTime: 0,
            tableLoading: true
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    mounted() {
        // 获取维度的信息列表
        Api.dimensionGetInfo().then(res => {
            if (res.datas && res.datas.length > 0) {
                let itemList = []
                res.datas.forEach(item => {
                    let itenIfo = {
                        name: item.name,
                        id: item.dimensionid,
                        ischeck: false
                    }
                    itemList.push(itenIfo)
                })
                this.allDimensionTypeList = itemList
            }
        })
        if (this.id) {
            this.getEventMapInfo()
        } else {
            this.drawUserActiveChartBar()
            // 默认过去7天
            let t = weekDate.getWeekDate()
            this.startTime = t[0].replace(/\//g, '')
            this.endTime = t[1].replace(/\//g, '')
            let comStartTime = new Date(t[0]).getTime() - 8.64e7 * 7
            let changeComStartTime = weekDate.formDateTime(comStartTime)
            let comEndTime = new Date(t[1]).getTime() - 8.64e7 * 7
            let changeComEndTime = weekDate.formDateTime(comEndTime)
            this.comStartTime = changeComStartTime
            this.comEndTime = changeComEndTime
            this.defaultTime = '过去7天'
            this.groupId = 0
            this.groupName = '全部用户'
            this.cyclceTime = 7
        }
    },
    methods: {
        getEventMapInfo() {
            //    如果有ID 获取当前的所有信息
            Api.graphQueryEventMap({appId: this.appId, id: this.id}).then(res => {
                this.hasEnable = false
                // 格式化指标
                res.indexs.forEach(item => {
                    let list = {
                        name: item.name,
                        isPage: item.isPage,
                        id: item.id,
                        comments: item.comments,
                        ischeck: item.isCheck === 1,
                        isComplex: item.isComplex,
                        innerType: item.innerType,
                        selectList: item.isComplex === 0 ? (item.isPage === 1 ? Select.pageSelectList : Select.elementSelectList) : [],
                        enable: item.enable,
                        updateTime: item.updateTime
                    }
                    // 判断是否有圈选指标被删除，如果有的，则无法操作，无保存按钮  复合指标被删除，依然可编辑可修改
                    if (item.enable === 0 && item.isComplex === 0) {
                        this.hasEnable = true
                        this.isDetail = true
                    }
                    this.targetListInfo.push(list)
                    this.selectTargetLis.push(list)
                })
                this.groupName = res.groupName
                this.groupId = res.groupId
                let allItem = []
                res.fields.forEach(item => {
                    let list = {
                        fieldId: item.fieldId,
                        value: item.value,
                        type: item.type
                    }
                    allItem.push(list)
                })
                this.selectList = {
                    conditionType: parseInt(res.conditiontype) === 1 ? 'OR' : 'AND',
                    allList: allItem
                }
                this.dayTime = res.cyclce
                this.comStartTime = res.comparedStartTime.substring(0, 10).replace(/-/g, '')
                this.comEndTime = res.comparedEndTime.substring(0, 10).replace(/-/g, '')
                this.cyclcetime = res.cyclcetime
                this.startTime = res.starttime.substring(0, 10).replace(/-/g, '')
                this.endTime = res.endtime.substring(0, 10).replace(/-/g, '')
                this.defaultTime = res.cyclcetime > 0 ? (res.cyclcetime === 1 ? '昨天' : `过去${res.cyclcetime}天`) : res.starttime.substring(0, 10).replace(/-/g, '/') + '-' + res.endtime.substring(0, 10).replace(/-/g, '/')
                this.envetNameObj = {
                    graphName: res.name,
                    graphDescription: res.comments
                }
                this.showType = res.showtype
                this.getstyleid(res.showtype)
                this.selectDimensionInfo = res.showtype === 1 && res.dimentions.length > 0 ? res.dimentions[0].dimensionid : ''
                if (res.showtype === 3) {
                    if (res.dimentions.length > 0) {
                        res.dimentions.forEach(item => {
                            let itenIfo = {
                                name: item.name,
                                id: item.dimensionid,
                                ischeck: false
                            }
                            this.selectDimensionListInfo.push(itenIfo)
                            this.dimensionList.push(itenIfo)
                        })
                    }
                    if (res.cyclce > 0) {
                        this.selectDimensionListInfo.push(createChart.timeItem)
                        this.dimensionList.push(createChart.timeItem)
                    }
                }
                this.chooseColor = res.color > 0 ? res.color : 1
            })
        },
        dayTimeChange() {
            // 粒度变化
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        selectBox(item) {
            // 筛选条件
            this.selectList.conditionType = item.conditionType
            this.selectList.allList = item.allList
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        getstyleid(id) {
            this.showType = id
            let _this = this
            switch (id) {
            case 0:
                this.isShowMore = false
                this.isShowSing = false
                this.isShowColor = false
                this.isShowCycle = true
                this.maxNumber = 5
                this.dayTime = this.dayTime === 0 ? 1 : this.dayTime
                setTimeout(function () {
                    _this.drawUserActiveChartBar()
                }, 800)
                break
            case 1:
                this.isShowMore = false
                this.isShowSing = true
                this.isShowColor = false
                this.maxNumber = 1
                this.isShowCycle = false
                setTimeout(function () {
                    _this.drawRowBarCharts()
                }, 800)
                break
            case 2:
                this.isShowMore = false
                this.isShowSing = false
                this.isShowColor = false
                this.maxNumber = 5
                this.isShowCycle = true
                this.dayTime = this.dayTime === 0 ? 1 : this.dayTime
                _this.drawUserActiveChartBar()
                break
            case 3:
                this.isShowMore = true
                this.isShowSing = false
                this.isShowColor = false
                this.isShowCycle = this.dayTime > 0
                this.maxNumber = 5
                setTimeout(function () {
                    _this.dateAll()
                }, 800)
                break
            case 4:
                this.isShowMore = false
                this.isShowSing = false
                this.isShowColor = true
                this.isShowCycle = false
                this.maxNumber = 1
                setTimeout(function () {
                    _this.drawNumberLineChart(_this.chooseColor)
                }, 800)
                break
            }
        },
        getDateInfo(info) {
            // 时间控件的选项
            this.startTime = info.startTime
            this.endTime = info.endTime
            this.comEndTime = info.comEndTime
            this.comStartTime = info.comStartTime
            this.cyclceTime = info.circleTime
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        selectUser(person) {
            // 获取目标用户
            this.groupId = person.id
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        getTargetListInfo(info) {
            // 选择的复合指标的列表
            this.selectTargetLis = info
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        getDimensionListInfo(info) {
            // 选择的维度的值
            this.dimensionList = info
            // 维度中如果有时间的维度  显示粒度，如果没有，不显示
            this.isShowCycle = JSON.stringify(info).indexOf('时间') !== -1
            this.dayTime = this.isShowCycle ? 1 : 0
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        changeDimension() {
            // 选择维度
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        drawUserActiveChartBar(t) {
            //   线图
            this.lineRes = {
                id: 'activeChartBar1',
                chart: null
            }
            // this.lineRes.chart = this.$echarts.init(document.getElementById(this.lineRes.id))
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        drawRowBarCharts() {
            this.line2Res = {
                id: 'activeChartBar2',
                chart: null
            }
            // this.line2Res.chart = this.$echarts.init(document.getElementById(this.line2Res.id))
            // createChart.chart2Option(res)
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        drawNumberLineChart(color) {
            // 用户留存概况
            this.line5Res = {
                id: 'activeChartBar5',
                color: this.chartColors[color].rgbaValue,
                colorValue: this.chartColors[color].value,
                chart: null
            }
            // this.line5Res.chart = this.$echarts.init(document.getElementById(this.line5Res.id))
            // 获取数据
            this.$nextTick(() => {
                this.dateAll()
            })
        },
        changeColor() {
            // 数值图 变化颜色
            let itemStyle = {
                normal: {
                    color: this.chartColors[this.chooseColor].value
                }
            }
            let areaStyle = {
                normal: {
                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: this.chartColors[this.chooseColor].rgbaValue
                    }, {
                        offset: 1,
                        color: '#ffffff'
                    }])
                }
            }
            this.line5Res.option.series[0].itemStyle = itemStyle
            this.line5Res.option.series[0].areaStyle = areaStyle
            this.line5Res.chart.setOption(this.line5Res.option)
        },
        saveEvent(back) {
            // 保存创建修改的事件分析
            // 数据的检验
            if (this.selectTargetLis.length <= 0) {
                this.$message.warning('请选择指标')
                return
            }
            if (this.groupId === '') {
                this.$message.warning('请选择目标用户')
                return
            }
            if (this.isShowSing) {
                // 横向柱状图 有单指标和单维度
                if (this.selectDimensionInfo === '') {
                    this.$message.warning('请选择维度')
                    return
                }
            }
            if (this.isShowMore) {
                if (this.dimensionList.length <= 0) {
                    this.$message.warning('请选择维度')
                    return
                }
            }
            if (JSON.stringify(this.selectList.allList).indexOf('""') !== -1 && this.selectList.allList.length > 0) {
                this.$message.warning('过滤条件请填全')
                return
            }
            // 选择指标格式化成接口所需格式
            // orderNum 排序字段 未做（根据排序字段来排数据的顺序）
            let targetList = []
            if (this.selectTargetLis && this.selectTargetLis.length > 0) {
                for (let i = 0; i < this.selectTargetLis.length; i++) {
                    let item = {
                        selectId: this.selectTargetLis[i].id,
                        selectName: this.selectTargetLis[i].name,
                        innerType: this.selectTargetLis[i].innerType,
                        orderNum: i
                    }
                    targetList.push(item)
                }
            }
            //    线图和 纵向柱状图 只有指标 粒度存在传粒度值不存在传0值
            let params = {
                appId: this.appId,
                showType: this.showType,
                name: back.name,
                comments: back.discreption,
                indexs: JSON.stringify(targetList),
                cyclce: this.isShowCycle ? this.dayTime : 0,
                conditionType: this.selectList.conditionType === 'AND' ? 0 : 1,
                cyclceTime: this.cyclceTime,
                startTime: this.startTime,
                endTime: this.endTime,
                fields: JSON.stringify(this.selectList.allList),
                groupId: this.groupId,
                color: 0,
                showNum: 10,
                dimensionIds: '',
                comparedStartTime: this.comStartTime,
                comparedEndTime: this.comEndTime
            }
            let dimensionIds = ''
            if (this.isShowSing) {
                // 横向柱状图 有单指标和单维度
                dimensionIds = this.selectDimensionInfo
                params.dimensionIds = dimensionIds
            }
            if (this.isShowMore) {
                // 表格 多指标和多维度
                let dimList = []
                for (let i = 0; i < this.dimensionList.length; i++) {
                    if (this.dimensionList.name !== '时间') {
                        // 时间的文档
                        dimList.push(this.dimensionList[i].id)
                    }
                }
                dimensionIds = dimList.join(',')
                params.dimensionIds = dimensionIds
            }
            if (this.isShowColor) {
                // 数值图 单指标和颜色
                params.color = this.chooseColor
            }
            if (this.id) {
                params.id = this.id
                // 存在为修改
                Api.graphUpdateEventMap(params).then(res => {
                    this.$alerts({
                        type: 'success',
                        content: '修改事件分析成功'
                    })
                    this.$router.push({path: `/graph/charts`})
                })
            } else {
            //    不存在，为创建
                Api.graphCreateEventMap(params).then(res => {
                    this.$alerts({
                        type: 'success',
                        content: '新建事件分析成功'
                    })
                    this.$router.push({path: `/graph/charts`})
                })
            }
        },
        dateAll() {
            if (JSON.stringify(this.selectList.allList).indexOf('""') !== -1 && this.selectList.allList.length > 0) {
                // this.$message.warning('过滤条件请填全')
                return
            }
            if (this.groupId === '') {
                return
            }
            if (this.isShowSing) {
                // 横向柱状图 有单指标和单维度
                if (this.selectDimensionInfo === '') {
                    // this.$message.warning('请选择维度')
                    return
                }
            }
            if (this.isShowMore) {
                this.tableHead = []
                this.tableData3 = []
                // 表格 多指标和多维度 如果维度中有选择时间，粒度可选择，如果没有，删除粒度的值
                // delete params['cycle']  表格的接口是单独的，未做
                let dimensionList = []
                if (this.dimensionList.length > 0) {
                    for (let i = 0; i < this.dimensionList.length; i++) {
                        dimensionList.push(parseInt(this.dimensionList[i].id))
                    }
                } else {
                    return
                }
                if (this.selectTargetLis && this.selectTargetLis.length > 0) {
                    let itemList = []
                    this.selectTargetLis.forEach(s => {
                        let iscomplex = s.isComplex === 0 ? (s.isPage === 1 ? 1 : 0) : parseInt(s.isComplex) + 1
                        itemList.push({
                            selectID: s.id,
                            elementType: iscomplex,
                            platform: 0,
                            queryType: s.innerType
                        })
                    })
                    let params = {
                        appId: this.appId,
                        id: this.id,
                        showType: this.showType,
                        indexs: JSON.stringify(itemList),
                        cycle: this.isShowCycle ? this.dayTime : 4,
                        conditionType: this.selectList.conditionType === 'AND' ? 0 : 1,
                        startTime: this.startTime,
                        endTime: this.endTime,
                        fields: JSON.stringify(this.selectList.allList),
                        groupId: this.groupId,
                        dimensionIds: dimensionList
                    }
                    this.tableLoading = true
                    let chart = this.$echarts.init(document.getElementById('table3'))
                    chart.showLoading({
                        text: '正在加载',
                        color: '#409EFF'
                    })
                    Api.graphGerEventTableMapIndex(params).then(res => {
                        chart.hideLoading()
                        chart = null
                        this.tableLoading = false
                        // 表格
                        if (res.length <= 0) {
                            return
                        }
                        // 表格的头部信息只取一次
                        let t = Object.keys(res[0][0])
                        // 如果有周的粒度，返回两个值，删除其中一个
                        let index = t.indexOf('WEEK_END')
                        if (index > -1) {
                            t.splice(index, 1)
                        }
                        if (this.tableHead.length <= 0) {
                            for (let j = 0; j < t.length - 1; j++) {
                                this.tableHead.push({
                                    name: this.dimensionList[j].name,
                                    prop: t[j]
                                })
                            }
                        }
                        res.forEach((tl, i) => {
                            this.tableHead.push({
                                name: this.selectTargetLis[i].name,
                                prop: this.selectTargetLis[i].id
                            })
                            // 第一次指标的记录维度的信息  后面的指标参数直接嵌入
                            if (this.tableData3.length > 0) {
                                this.tableData3.forEach((item, k) => {
                                    item[this.selectTargetLis[i].id] = tl[k].COUNTNUM
                                })
                            } else {
                                tl.forEach(item => {
                                    item[this.selectTargetLis[i].id] = item.COUNTNUM
                                    // 如果有时间的
                                    if (item.WEEK_BEGIN) {
                                        item.WEEK_BEGIN = item.WEEK_BEGIN.replace(/-/g, '/').substring(5, 10) + '-' + item.WEEK_END.replace(/-/g, '/').substring(5, 10)
                                    }
                                })
                                this.tableData3 = tl
                            }
                        })
                    })
                }
            } else {
                this.dataCell()
            }
        },
        dataCell() {
            // 数据接口
            // 指标
            this.lineRes.option = createChart.chart1Optine
            this.lineRes.option.series = []
            if (this.lineRes.chart) {
                this.lineRes.chart.clear()
            }
            this.line5Res.option = createChart.chart5Option
            this.line5Res.option.series = []
            if (this.line5Res.chart) {
                this.line5Res.chart.clear()
            }
            this.line2Res.option = createChart.chart2Option
            // this.line2Res.option.series = []
            if (this.line2Res.chart) {
                this.line2Res.chart.clear()
            }
            let legendName = []
            this.tableHead = []
            this.tableData3 = []
            if (this.selectTargetLis && this.selectTargetLis.length > 0) {
                if (this.showType === 0) {
                    this.lineRes.chart = this.$echarts.init(document.getElementById(this.lineRes.id))
                    this.lineRes.chart.showLoading({
                        text: '正在加载',
                        color: '#409EFF'
                    })
                } else if (this.showType === 1) {
                    this.line2Res.chart = this.$echarts.init(document.getElementById(this.line2Res.id))
                    this.line2Res.chart.showLoading({
                        text: '正在加载',
                        color: '#409EFF'
                    })
                } else if (this.showType === 2) {
                    this.lineRes.chart = this.$echarts.init(document.getElementById(this.lineRes.id))
                    this.lineRes.chart.showLoading({
                        text: '正在加载',
                        color: '#409EFF'
                    })
                } else if (this.showType === 4) {
                    this.line5Res.chart = this.$echarts.init(document.getElementById(this.line5Res.id))
                    this.line5Res.chart.showLoading({
                        text: '正在加载',
                        color: '#409EFF'
                    })
                }
                /* this.showType === 0 && (this.lineRes.chart = this.$echarts.init(document.getElementById(this.lineRes.id)))
                this.showType === 1 && (this.line2Res.chart = this.$echarts.init(document.getElementById(this.line2Res.id)))
                this.showType === 2 && (this.lineRes.chart = this.$echarts.init(document.getElementById(this.lineRes.id)))
                this.showType === 4 && (this.line5Res.chart = this.$echarts.init(document.getElementById(this.line5Res.id))) */
                for (let i = 0; i < this.selectTargetLis.length; i++) {
                    let name = this.selectTargetLis[i].name
                    let iscomplex = this.selectTargetLis[i].isComplex === 0 ? (this.selectTargetLis[i].isPage === 1 ? 1 : 0) : parseInt(this.selectTargetLis[i].isComplex) + 1
                    let item = {
                        selectID: this.selectTargetLis[i].id,
                        elementType: iscomplex,
                        platform: 0,
                        queryType: this.selectTargetLis[i].innerType
                    }
                    let params = {
                        appId: this.appId,
                        id: this.id,
                        showType: this.showType,
                        indexs: JSON.stringify(item),
                        cycle: this.isShowCycle ? this.dayTime : 4,
                        conditionType: this.selectList.conditionType === 'AND' ? 0 : 1,
                        startTime: this.startTime,
                        endTime: this.endTime,
                        groupId: this.groupId,
                        fields: JSON.stringify(this.selectList.allList)
                    }
                    //    线图和 纵向柱状图 只有指标
                    let dimensionList = []
                    if (this.isShowSing) {
                        // 横向柱状图 有单指标和单维度
                        let k = parseInt(this.selectDimensionInfo)
                        dimensionList.push(k)
                        params.dimensionIds = dimensionList
                    }
                    if (this.isShowColor) {
                        // 数值图 单指标和颜色
                        delete params['cycle']
                        params.comparedStartTime = this.comStartTime
                        params.comparedEndTime = this.comEndTime
                    }
                    this.nodata = false
                    Api.graphGetEventMapIndex(params).then(res => {
                        if (params.showType === 0 || params.showType === 2) {
                            this.lineRes.chart.hideLoading()
                            // 线图和 纵向柱状图
                            let chartTime = []
                            legendName.push(name)
                            let targetData = {
                                name: name,
                                type: params.showType === 0 ? 'line' : 'bar',
                                itemStyle: {
                                    normal: {
                                        color: createChart.lineColors[i]
                                    }
                                },
                                data: []
                            }
                            res.forEach(item => {
                                if (params.cycle === 1) {
                                    // 粒度为天
                                    let t = item.DAY_ID.replace(/-/g, '/')
                                    let week = weekDate.getWeekName(t)
                                    let time = t.substring(5, 10) + ' ' + week
                                    chartTime.push(time)
                                } else if (params.cycle === 2) {
                                    // 粒度为周
                                    let wtime = item.WEEK_BEGIN.replace(/-/g, '/').substring(5, 10) + '~' + item.WEEK_END.replace(/-/g, '/').substring(5, 10)
                                    chartTime.push(wtime)
                                } else if (params.cycle === 3) {
                                    // 粒度为月
                                    let mtime = item.MONTH_ID.substring(5, 7) + '月️'
                                    chartTime.push(mtime)
                                }
                                targetData.data.push(item.COUNTNUM)
                            })
                            this.lineRes.option.xAxis.data = chartTime
                            this.lineRes.option.legend.data = legendName
                            this.lineRes.option.series.push(targetData)
                            this.lineRes.chart.setOption(this.lineRes.option)
                        } else if (params.showType === 1) {
                            this.line2Res.chart.hideLoading()
                            // 横向柱状图
                            let datList = []
                            let totalDat = 0
                            let chart2Time = []
                            let resArr = res
                            if (Array.isArray(resArr)) {
                                resArr = res.splice(0, 10)
                            }
                            resArr.sort((a, b) => {
                                return a.COUNTNUM - b.COUNTNUM
                            })
                            resArr.forEach(item => {
                                datList.push(item.COUNTNUM)
                                totalDat = totalDat + parseInt(item.COUNTNUM)
                                chart2Time.push(item[Object.keys(item)[0]] || 'N/A')
                                createChart.chart2Option.xAxis.axisLabel.show = true
                            })
                            let label = {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    formatter (data) {
                                        return `${data.data} (${parseFloat(((data.data / totalDat) * 100).toFixed(2))}%)`
                                    },
                                    textStyle: {
                                        fontSize: '12',
                                        fontFamily: 'MicrosoftYaHei',
                                        color: '#5A6D82'
                                    }
                                }
                            }
                            this.line2Res.option.yAxis.data = chart2Time
                            // console.log(chart2Time)
                            this.line2Res.option.series[0].label = label
                            // console.log(JSON.stringify(datList))
                            this.line2Res.option.series[0].data = datList
                            this.line2Res.chart.setOption(this.line2Res.option)
                        } else if (params.showType === 4) {
                            this.line5Res.chart.hideLoading()
                            // 数值图
                            this.compareNum = res.difference
                            this.comparePre = res.ratio === '--' ? '' : res.ratio
                            let sersie = {
                                name: name,
                                type: 'line',
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: this.line5Res.colorValue
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: this.line5Res.color
                                        }, {
                                            offset: 1,
                                            color: '#ffffff'
                                        }])
                                    }
                                },
                                data: []
                            }
                            let chart5Time = []
                            res.queryDataList.forEach(item => {
                                sersie.data.push(item.countNum)
                                chart5Time.push(item.groupField || 'N/A')
                            })
                            this.line5Res.option.xAxis.data = chart5Time
                            this.line5Res.option.series.push(sersie)
                            this.line5Res.chart.setOption(this.line5Res.option)
                        }
                    })
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import "../../layouts/css/createSingle/eventChannel.scss";
    .dataCompare{
        margin-top: 58px;
        text-align: center;
        .inline-block{
            display: inline-block;
            .compareNum{
                color: #74BB5C;
                font-size: 14px;
            }
            .downCopareNum{
                color: #F66056;
                font-size: 14px;
            }
            .compareTxt{
                font-size: 12px;
                color: rgba(72,89,111,0.7);;
            }
            img{
                width: 17px;
                height: 22px;
            }
        }
        .toNum{
            font-size: 40px;
            color: #5A6D82;
            font-family: sfuidisplay-thin;
        }
    }

    .table-loading {
        width: 100%;
        height: 350px;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
