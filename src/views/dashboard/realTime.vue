<template>
    <div class="dashboard-realtime">
        <div class="top-menu">
            <div class="menu-button">
                <el-radio-group v-model="choicesType" size="small" class="topBtnGroup">
                    <el-radio-button label="全部"></el-radio-button>
                    <el-radio-button label="IOS"></el-radio-button>
                    <el-radio-button label="Android"></el-radio-button>
                </el-radio-group>
            </div>
            <div :class="{'fix-button-width': selectDelNum === 0}" class="fix-button">
                <!-- 昨日 -->
                <el-checkbox :indeterminate="isIndeterminate" v-model="allCheckRadio" @change="handleCheckAllChange">全选</el-checkbox>
                <div v-show="selectDelNum !== 0" class="fix-num">已选中{{ selectDelNum }}个单图</div>
                <el-button v-show="selectDelNum !== 0" type="primary" size="mini" style="width:100px;margin-left:18px" @click="delCancel">取消</el-button>
                <el-button v-show="selectDelNum !== 0" type="primary" size="mini" style="width:100px;margin-left:18px" @click="delConfirm">删除</el-button>
            </div>
        </div>
        <div class="day-time">
            <span>{{ systime }}</span>
        </div>
        <!-- 添加单图弹窗 -->
        <dialog-container :is-disabled="editInput === ''" :di="isDShow" top="0" class="dialog-cantainer add-ech-dia" @saveDialog="saveDialog" @closeDialog="closeDialog">
            <div slot="container">
                <div class="add-content">
                    <div class="add-step">
                        <div class="w-yuan">
                            <div class="z-yuan">
                                <div class="n-yuan"></div>
                            </div>
                        </div>
                        <div :class="{'is-step-yellow': addValue}" class="fir-z"></div>
                        <div class="w-yuan">
                            <div class="z-yuan">
                                <div class="n-yuan"></div>
                            </div>
                        </div>
                        <div :class="{'is-step-yellow': editInput && editInput != ''}" class="sec-z"></div>
                    </div>
                    <div class="add-fixed">
                        <div class="sel-finger">
                            <span class="sel-finger-title">选择指标</span>
                            <span class="sel-finger-tro">除了全站数据,您也可以查看圈选过的页面或元素</span>
                        </div>
                        <el-select v-if="productTypeIndexApp" v-model="addPlatFormValue" placeholder="请选择" size="mini" class="add-sel-platform">
                            <el-option
                                v-for="(item,index) in platFormOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="addValue" placeholder="请选择指标" class="add-sel-sel">
                            <el-input v-model="searchIndexValue" placeholder="搜索指标名称或创建人" class="search-input" @input="debounceInput">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                            <el-option
                                v-for="(item,index) in addOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-if="!isComplex" v-model="optionPageType" placeholder="请选择" class="add-sel-sel-type">
                            <el-option
                                v-for="(item,index) in pageType"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <div class="sel-color">
                            选择图表颜色
                        </div>
                        <div class="sel-ech">

                            <div id="selEch" class="sel-show-ech">
                            </div>
                        </div>
                        <div class="sel-block">
                            <div v-for="(item, index) in properSelectEch" :key="index" style="display:inline-block">
                                <span v-show="item.checked" aria-checked="mixed" class="el-checkbox__input is-checked" @click="changeSelColor(index, item.checked)">
                                    <span :class="`color${index+1}`" class="el-checkbox__inner"></span>
                                    <input type="checkbox" class="el-checkbox__original" value="">
                                </span>
                                <span v-show="!item.checked" :class="`color${index+1}`" class="el-checkbox__inner" @click="changeSelColor(index, item.checked)"></span>
                            </div>
                        </div>
                        <div class="edit-title-tro">编辑图表标题</div>
                        <el-input v-model="editInput" :disabled="iseditinput" class="edit-title-input" placeholder="编辑图表标题" maxlength="20"></el-input>
                    </div>
                </div>
            </div>
        </dialog-container>

        <!-- 看板 -->
        <div class="see-bord">
            <div class="see-bord-h" style="box-shadow: 0 0 0 #000;">
                <el-row :gutter="26">
                    <el-col :span="8" >
                        <div style="position:relative;height: 100%">
                            <div class="bord-block addImg" style="background-color: #F3F4F8;box-shadow: 0 0 0px #3392FF;">
                                <div class="img-h">
                                    <img src="../../layouts/images/icon/icon-cricle-add.png" @click="addEch()">
                                </div>
                                <div class="title">添加单图</div>
                                <div class="tro">
                                    <span class="tro-w">将单图添加到看板,方便实时监测和管理数据</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col v-for="(item, index) in lineOptions" :span="8" :key="index" :class="{'bord-block-padding-bord': index !== 2 && (index == 1 || (index-1) % 3 ===0)}">
                        <div :style="{'background':item.bgcolor}" :class="{'is-bord-checked':item.delChecked, 'hover-boder-showdow':item.mark == 1}" class="bord-block addUser">
                            <div class="show-prove">
                                <!-- <el-tooltip class="item" effect="dark" content="访问过应用的独立用户数(去重，访问过一次即视为活跃)" placement="right-start">
                                    <div class="show-prove-title">
                                        <div class="tro">{{ item.label }}</div>
                                    </div>
                                </el-tooltip> -->
                                <div class="show-prove-title">
                                    <div class="tro">{{ item.label }}</div>
                                </div>
                                <chart-loading-failed v-if="item.failedLoading" top="70"></chart-loading-failed>
                                <chart-no-data v-if="item.noData" top="70"></chart-no-data>
                                <div v-show="typeof(item.counts) !== 'undefined' && item.counts !== -1" class="com-prove-num">
                                    <div class="get-num">{{ item.counts }}</div>
                                    <div v-if="item.rate!=='--'" :class="item.isup ? 'prove-xia' : 'prove-sha'">
                                    </div>
                                </div>
                                <div v-show="item.rate!=='--' && typeof(item.counts) !== 'undefined' && item.counts !== -1" class="com-prove-day">
                                    <span class="circle">相比7天前</span>
                                    <span :class="{'is-prove-up':item.isup}" class="prove-up">
                                        {{ item.rate }}
                                    </span>
                                </div>
                            </div>

                            <cre-checked-box v-show="item.mark == 1" :class="{'is-del-checked':item.delChecked}" :is-checked="item.delChecked" :dex="index" class="cre-checked-box" @checkIndex="checkIndex"></cre-checked-box>
                            <div :id="item.id" class="show-echarts-r"></div>

                        </div>
                    </el-col>

                </el-row>
            </div>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import echarts from 'echarts'
import { setTimeout } from 'timers'
import debounce from 'lodash.debounce'
import DialogContainer from '../../components/common/DialogWrapper'
import CreCheckedBox from '../../components/dashboard/checkedBox'
import ChartLoadingFailed from '../../components/ChartLoadingFailed.vue'
import ChartNoData from '../../components/ChartNoData.vue'
import Api from '../../utils/api.js'

export default {
    name: 'RealTimeDashboard',
    components: {
        DialogContainer,
        CreCheckedBox,
        ChartLoadingFailed,
        ChartNoData
    },
    data() {
        return {
            // 默认全部平台类型
            choicesType: '全部',
            // 系统时间
            systime: '',
            // 是否是选中部分
            isIndeterminate: false,
            // 是否全选
            allCheckRadio: false,
            // 自适应
            resizeChart: [],
            // 默认选中全部平台
            active: 'all', // 导航
            // 删除得单图id
            delChartString: '',
            // 图表标题是否是编辑状态
            iseditinput: true,
            // 添加实时图标
            dialogFormVisible: false,
            choseType: 0,
            // 添加窗口的信息
            isDShow: {
                Visible: false,
                Title: '指标详情',
                Width: '640px'
            },
            addValue: '',
            // 图表标题名称
            editInput: '',
            // 图表添加时颜色
            addcolor: 0,
            addId: '',
            addType: -1,
            addIsPage: -1,
            isComplex: 1, // 加单图的时候下拉列表判断是  0 圈选  1 预定义指标   1不显示，0显示
            selectDelNum: 0,
            checkedColor: [],
            properSelectEch: [],
            colors: ['#3392FF', '#7262BA', '#D587E3', '#F35974', '#F5D41D'],
            lineOptions: [],
            optionPageType: 1, // 根据页面或元素获取的值
            pageType: [],
            productTypeIndexApp: true, // 当前切换产品的类型  web  或者app  后面写到mapState的状态里
            searchIndexValue: '', // 搜索指标的指标名称
            addPlatFormValue: '0',
            platFormOptions: [{value: '0', name: '全部平台'}, {value: '1', name: 'Android'}, {value: '2', name: 'iOS'}], // app产品平台的选择  默认全部平台
            addOptions: [],
            // 默认预置数量
            yzNum: 0
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    watch: {
        // 监听添加时选中的指标
        addValue(newVal, oldVal) {
            // 根据id查询选中type
            try {
                this.addOptions.forEach(item => {
                    if (item.id === newVal) {
                        this.addType = item.type
                        this.addIsPage = item.isPage
                        this.isComplex = item.isComplex // 圈选赋值，如果0 圈选要显示出类型
                        this.pageType = !item.isPage ? [{name: '点击量', id: 2}, {name: '触发用户数', id: 3}] : [{name: '浏览量', id: 1}, {name: '浏览用户数', id: 4}] // 1页面 0 元素
                        this.optionPageType = item.isPage ? 1 : 2
                    }
                })
            } catch (e) {}
            // 选中的id
            this.addId = newVal
            // 将第三步赋值
            let obj = {}
            if (newVal !== '') {
                obj = this.addOptions.find((item) => {
                    return item.id === newVal
                })
                this.editInput = obj.name + '实时'
                this.iseditinput = false
            } else {
                this.editInput = ''
                this.iseditinput = true
            }
        },
        // 选中checked时监听
        lineOptions: {
            handler(newVal, oldVal) {
                let num = 0
                newVal.forEach(res => {
                    if (res.delChecked === true) {
                        num++
                    }
                })
                this.selectDelNum = num
                if (num === this.lineOptions.length - this.yzNum && num !== 0) {
                    this.allCheckRadio = true
                }
                num === (this.lineOptions.length - this.yzNum) && num !== 0 ? this.allCheckRadio = true : this.allCheckRadio = false
                num > 0 && num !== (this.lineOptions.length - this.yzNum) ? this.isIndeterminate = true : this.isIndeterminate = false
            },
            deep: true
        },
        choicesType(newVal, oldVal) {
            this.choseType = newVal === '全部' ? 0 : newVal === 'IOS' ? 2 : 1
            // 重新请求数据
            this.initPageData()
        }

    },
    beforeMount() {
        this.debounceInput = debounce(this.debounceInput.bind(this), 500)
    },
    mounted() {
        // 获取指标数据
        this.getIndexList()
        // 获取当前系统时间
        this.getSysTime()
        // 五分钟刷新一次数据
        this.fiveMinutesUpdate()
        // 初始化数据
        this.initPageData()
        window.onresize = () => {
            this.resizeChart.forEach(item => {
                item.resize()
            })
        }
    },
    methods: {
        debounceInput() {
            console.log(this.searchIndexValue)
            // 搜索指标调用的debounce值
        },
        cleanData(res, chart, bgcolor, color, index) {
            let beforeYYDD = '' // 7天前的时间
            let nowYYDD = '' // 当天时间
            let nowDataArr = [] // 当天数据
            let beforeDataArr = [] // 7天前数据
            let axisTimeArr = [] // 横轴坐标
            if (res.contrastDatas !== null) {
                res.contrastDatas.forEach(item => {
                    beforeDataArr.push(item.amount)
                })
            }
            // 将非预置的时间进行转化
            if (index >= this.yzNum) {
                beforeYYDD = res.contrastDatas[0].time.substring(4, 6) + '/' + res.contrastDatas[0].time.substring(6, 8)
                nowYYDD = res.currentDatas[0].time.substring(4, 6) + '/' + res.currentDatas[0].time.substring(6, 8)
                res.currentDatas.forEach(item => {
                    nowDataArr.push(item.amount)
                    let { time } = item
                    axisTimeArr.push(`${time.substring(8, 10)}:${time.substring(10, 12)}`)
                })
            }
            // 将预置的时间进行转化
            if (index < this.yzNum) {
                let t = new Date(parseInt(res.contrastDatas[0].time))
                beforeYYDD = `${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                let t2 = new Date(parseInt(res.currentDatas[0].time))
                nowYYDD = `${(t2.getMonth() + 1) < 10 ? ('0' + (t2.getMonth() + 1)) : t2.getMonth()}/${t2.getDate() < 10 ? ('0' + t2.getDate()) : t2.getDate()}`
                res.currentDatas.forEach(item => {
                    nowDataArr.push(item.amount)
                    let t3 = new Date(parseInt(item.time))
                    axisTimeArr.push(`${(t3.getHours()) < 10 ? ('0' + (t3.getHours())) : t3.getHours()}:${t3.getMinutes() < 10 ? ('0' + t3.getMinutes()) : t3.getMinutes()}`)
                })
            }
            const creLinePram = {beforeYYDD, nowYYDD, nowDataArr, beforeDataArr, axisTimeArr, chart, bgcolor, color}
            this.creEchLine(creLinePram)
            // 赋值数据上升比和上升数
            let obj = this.lineOptions[index]
            obj.rate = res.rate
            if (res.rate === '--') {
                obj.rate = '--'
            } else if (index < this.yzNum) {
                res.rate >= 0 ? obj.isup = false : obj.isup = true
                obj.rate = (res.rate * 100).toFixed(1) + '%'
            } else {
                parseFloat(res.rate) >= 0 ? obj.isup = false : obj.isup = true
                obj.rate = parseFloat(res.rate) > 0 ? `+${res.rate}` : `${res.rate}`
            }
            obj.counts = res.counts
            obj.bgcolor = bgcolor
            this.$set(this.lineOptions, index, obj)
        },
        handleCheckAllChange(newVal) {
            if (newVal === true) {
                this.lineOptions.forEach((res, index) => {
                    if (res.mark !== 0) {
                        res.delChecked = true
                        this.delChartString === '' ? this.delChartString = res.id : this.delChartString = `${this.delChartString},${res.id}`
                    }
                })
            } else {
                this.lineOptions.forEach((res, index) => {
                    if (res.mark !== 0) {
                        res.delChecked = false
                        this.delChartString = ''
                    }
                })
            }
        },
        initPageData() {
            this.lineOptions = []
            this.getRealtimeChartList()
        },
        fiveMinutesUpdate() {
            let updateTime = 300
            setInterval(() => {
                updateTime--
                if (updateTime < 0) {
                    this.initPageData()
                    updateTime = 300
                }
            }, 1000)
        },
        getRealtimeChartList() {
            Api.realtimeChartList({
                appId: this.appId,
                type: this.choseType
            }).then(res => {
                this.lineOptions = []
                res.datas.forEach((item, index) => {
                    if (item.mark === 0) {
                        // 预置数据的数量
                        this.yzNum += 1
                    }
                    // 生成初始数组
                    this.lineOptions[index] = {
                        id: item.id,
                        label: item.name,
                        mark: item.mark,
                        delChecked: false
                    }
                    // 设置背景间隔色
                    let bgcolor = ''
                    if (index === 0 || (index - 2) % 2 === 0) {
                        bgcolor = '#fff'
                    } else if (index === 1 || (index - 2) % 2 === 1) {
                        bgcolor = '#FAFBFC'
                    }
                    this.$nextTick(() => {
                        // 生成echarts图表
                        if (item.enable !== 0) {
                            let chart = echarts.init(document.getElementById(item.id))
                            chart.showLoading({
                                text: '正在加载',
                                color: '#409EFF'
                            })
                            let color = this.colors[item.color]

                            this.getShowDetailData(chart, item, bgcolor, color, index)
                        } else {
                            this.$set(this.lineOptions, index, this.lineOptions[index])
                            document.getElementById(item.id).innerHTML = `该指标已于${item.updateTime.split(' ')[0]}被删除`
                        }
                    })
                })
            })
        },
        getShowDetailData(chart, singleParam, bgcolor, color, index) {
            if (singleParam.mark === 0) {
                Api.realtimeYesyzShowChart({
                    appId: this.appId,
                    chartId: singleParam.selectId,
                    type: singleParam.type
                }).then(res => {
                    if (res.currentDatas.length === 0) {
                        // 隐藏正在加载
                        chart.hideLoading()
                        this.lineOptions[index].counts = -1
                        // 设置背景色
                        this.lineOptions[index].bgcolor = bgcolor
                        return
                    }
                    this.$set(this.lineOptions[index], 'failedLoading', false)
                    // 格式化数据
                    this.cleanData(res, chart, bgcolor, color, index)
                }).catch(res => {
                    chart.hideLoading()
                    this.$set(this.lineOptions[index], 'failedLoading', true)
                })
            } else {
                Api.realtimeNotyzShowChart({
                    appId: this.appId,
                    // type: this.choseType,
                    chartId: singleParam.selectId, // 图表selectId
                    type: singleParam.type, // 平台
                    isPage: singleParam.isPage, // 页面或者元素
                    indexType: singleParam.indexType, // 浏览量还是点击量
                    isComplex: singleParam.mark
                }).then(res => {
                    if (res.contrastDatas.length === 0) {
                        this.lineOptions[index].counts = -1
                        chart.hideLoading()
                        return
                    }
                    this.cleanData(res, chart, bgcolor, color, index)
                    this.lineOptions[index].failedLoading = false
                }).catch(res => {
                    chart.hideLoading()
                    this.lineOptions[index].failedLoading = true
                })
            }
        },
        getIndexList() {
            Api.realtimeIndexList({
                appId: this.appId,
                type: this.choseType
            }).then(res => {
                this.addOptions = res.datas
            })
        },
        addChart() {
            Api.realtimeAddChart({
                appId: this.appId,
                name: this.editInput,
                id: this.addId,
                color: this.addcolor,
                type: this.addType,
                isPage: this.addIsPage,
                isComplex: this.isComplex,
                indexType: this.optionPageType
            }).then(res => {
                this.isComplex = 1
                this.isDShow.Visible = false
                this.initPageData()
            }).catch(res => {
                this.$message.error({
                    message: res.data.msg
                })
            })
        },
        closeDialog() {
            this.isDShow.Visible = false
            this.isComplex = 1
        },
        saveDialog() {
            // 非空校验
            if (this.addId === '') {
                this.$message.error({
                    message: '请选择指标'
                })
                return
            } else if (this.editInput === '') {
                this.$message.error({
                    message: '请填写图表标题'
                })
                return
            }
            this.addChart()
        },
        // 点击checked触发事件
        checkIndex(v) {
            let dex = v.dex
            let id = this.lineOptions[dex].id
            if (this.delChartString.indexOf(id) !== -1) {
                let arr = this.delChartString.split(',')
                arr.forEach((item, index) => {
                    if (item === id) {
                        arr.splice(index, 1)
                    }
                })
                this.delChartString = arr.toString()
            } else {
                this.delChartString === '' ? this.delChartString = id : this.delChartString = `${this.delChartString},${id}`
            }
            this.lineOptions[dex].delChecked = v.isChecked
        },
        // 显示系统时间
        getSysTime() {
            window.setInterval(() => {
                let t = new Date()
                let time = `${t.getFullYear()}/${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()} ${t.getHours() >= 12 ? '下午' : '上午'} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds() < 10 ? ('0' + t.getSeconds()) : t.getSeconds()}`
                this.systime = time
            }, 1000)
        },
        // 取消全选
        delCancel() {
            this.selectDelNum = 0
            this.lineOptions.forEach((res, index) => {
                res.delChecked = false
            })
        },
        // 确认删除
        delConfirm() {
            this.$confirm('是否确定删除？', '选中单图', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.realtimeDelChart({
                    appId: this.appId,
                    id: this.delChartString
                }).then((res) => {
                    this.initPageData()
                    this.$alerts({
                        type: 'success',
                        content: '删除单图成功'
                    })
                })
            })
        },
        changeTab(value) {
            this.active = value
        },
        initProper() {
            this.properSelectEch = []
            // let colors = ['#3392FF', '#7262BA', '#D587E3', '#F35974', '#F5D41D']
            this.colors.forEach((color, index) => {
                let obj = {}
                obj.color = color
                if (index === 0) {
                    obj.checked = true
                } else {
                    obj.checked = false
                }
                this.properSelectEch.push(obj)
            })
            this.resetValue()
            this.getIndexList()
        },
        addEch() {
            this.initProper()
            this.isDShow.Visible = true
            var newthis = this
            setTimeout(function() {
                newthis.creSelEch('selEch', newthis.colors[0])
            }, 100)
        },
        resetValue() {
            this.addValue = '' // 指标名称
            this.addId = '' // 指标id
            this.addType = -1 // 指标类型 ios or android
            this.addIsPage = -1 // 元素或页面
            this.isComplex = 1 // 圈选或预定义指标
            this.addIndexType = -1 // 浏览量等
            this.editInput = '' // 单图名称
        },
        creEchLine(creLinePram) {
            const chart = creLinePram.chart
            this.resizeChart.push(chart)
            chart.setOption({
                backgroundColor: creLinePram.bgcolor,
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
                    data: [{
                        name: creLinePram.beforeYYDD
                    },
                    {
                        name: creLinePram.nowYYDD
                    }],
                    barBorderRadius: [0, 20, 20, 0],
                    bottom: '2.7%',
                    icon: 'rect',
                    itemWidth: 30,
                    itemHeight: 6
                },
                color: [creLinePram.color, '#D5E1EA'],
                grid: {
                    top: '25.5%',
                    left: '7.1%',
                    right: '8.3%',
                    bottom: '11%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: creLinePram.axisTimeArr,
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
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(109,118,132,1)'
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
                series: [
                    {
                        name: creLinePram.nowYYDD,
                        type: 'line',
                        data: creLinePram.nowDataArr
                    },
                    {
                        name: creLinePram.beforeYYDD,
                        type: 'line',
                        data: creLinePram.beforeDataArr
                    }
                ]
            })
            chart.hideLoading()
        },
        creSelEch(id, colorType) {
            const chart = echarts.init(document.getElementById(id))
            chart.showLoading()
            chart.setOption({
                title: {
                    text: '',
                    top: '5.5%',
                    left: '3.65%',
                    textStyle: {
                        fontFamily: 'MicrosoftYaHei',
                        color: 'rgba(90,109,130,1)',
                        fontSize: '12',
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    type: 'category'
                },
                legend: {
                    data: [{
                        name: '上一周期'
                    },
                    {
                        name: '03/25'
                    }],
                    textStyle: {
                        fontSize: 8
                    },
                    bottom: '1.7%',
                    icon: 'rect',
                    itemWidth: 30,
                    itemHeight: 6
                },
                color: [colorType, '#D5E1EA'],
                grid: {
                    top: '15',
                    left: '7.1%',
                    right: '7.3%',
                    bottom: '14%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['0:00', '06:00', '12:00'],
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(109,118,132,1)'
                        }
                    },
                    splitLine: {
                        show: false,
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
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(109,118,132,1)'
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
                series: [
                    {
                        name: '上一周期',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101]
                    },
                    {
                        name: '03/25',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191]
                    }
                ]
            })
            chart.hideLoading()
        },
        changeSelColor(index, isClick) {
            // 全部取消选中
            this.properSelectEch.forEach(item => {
                item.checked = false
            })
            // 再判断是否选中
            this.addcolor = index // 添加时,color的参数
            let obj = {
                color: this.properSelectEch[index].color,
                checked: !isClick
            }
            this.$set(this.properSelectEch, index, obj)
            this.creSelEch('selEch', obj.color)
        }
    }
}
</script>

<style lang="scss">

.dashboard-realtime {
    //  单个图标布局
    .show-prove {
        .show-prove-title {
            .tro {
                text-align: left;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 14px;
            }
            .time {
                font-size: 12px;
            }
            float: left;
            margin-left: 20px;
            color: #5A6D82;
        }
        .ech-content {
            position: absolute;
            text-align: center;
            width: 100%;
            height: 281px;
            color: #C0C4CC;
            font-size: 14px;
            .ech-content-img {
                margin-top: 80px;
                img {
                    width: 113px;
                    height: 84px;
                }
            }
            .ech-content-title {
                margin-top: 20px;
            }
        }
        .com-prove-num {
            .show-prove-title {
                .tro {
                    font-size: 14px;
                }
                float: left;
                text-align: left;
                margin-left: 20px;
                color: #5A6D82;
            }
            .get-num {
                display: inline-block;
                font-size: 30px;
                font-family: sfuidisplay-thin;
            }
            .prove-sha {
              width: 17px;
              height: 22px;
              display: inline-block;
              background-image: url('../../layouts/images/icon/icon-up-green.png') ; background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
            }
            .prove-xia {
                width: 17px;
                height: 22px;
                display: inline-block;
                background-image: url('../../layouts/images/icon/icon-down-red.png') ; background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
            }
            height: 23px;
            line-height: 23px;
            color:rgb(67, 75, 85)
        }
        .com-prove-day {
            .prove-up {
                font-size: 14px;
                color: #74BB5C;
                margin-left: 5px;
            }
            .is-prove-up {
                color: #F66254 !important;
            }
            .circle {
                opacity: 0.7;
                font-size: 12px;
            }
            font-size:12px;
            font-family:MicrosoftYaHei;
            color:rgba(90,109,130,1);
        }
        position: absolute;
        text-align: right;
        padding-right: 2.8%;
        top: 11px;
        width: 100%;
        height: 50px;
        z-index: 11;
    }

    .top-menu {
         @mixin pub-button() {
         cursor: pointer;
         font-size: 14px;
         height: 32px;
         line-height: 32px;
         text-align: center;
        //  background:rgba(249,250,251,1);
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
        .fix-button-width {
            width: 60px !important;
        }
        .fix-button {
            .fix-num {
              flex: 4
            }
            .fix-button-block {
              flex: 3
            }
            .cancel {
                margin-right: 10px;
                color: #5A6D82;
                background-color: #fff;
            }
            .confirm {
                color: #fff;
                background-color: #3392FF;
            }
           @include pub-button;
           float: right;
           display: flex;
           width: 393px;
           color: #3392FF;
           background-color: #f5f5f5;
           border-radius: 2px;
        }
        height: 32px;
    }
    .day-time {
      clear: both;
      opacity: 0.7;
      height: 20px;
      margin-top: 19px;
      color: #5A6D82;
    }
    .add-ech-dia {
        .el-dialog {
          width: 640px;
          height: 500px;
        }
        .el-dialog__header {
          .el-dialog__title {
              font-size: 16px;
              color: #5A6D82;
          }
          .el-dialog__headerbtn {
              top:0
          }
          height: 46px;
          line-height: 46px;
          padding: 0px 0px 0px 19px;
          background-color: #f7faff;
          border-radius: 4px;
        }

        .add-content {
            .add-step {
                @mixin bck-color() {
                  background-color: #EAEFF3;
                }
                .w-yuan {
                    .z-yuan {
                      .n-yuan {
                        width: 8px;
                        height: 8px;
                        border-radius: 4.0px;
                        background-color: #F8715B;
                      }
                      text-align: center;
                      padding: 4.0px 0px 0px 4.0px;
                      width: 16px;
                      height: 16px;
                      line-height: 16px;
                      border-radius: 8px;
                      background-color: #fff;
                    }
                    text-align: center;
                    width: 19px;
                    height: 19px;
                    padding: 1.5px 0px 0px 1.5px;
                    line-height: 19px;
                    border-radius: 9.5px;
                    @include bck-color;
                }
                .fir-z, .sec-z {
                    margin: 0 auto;
                    width: 4px;
                    @include bck-color;
                }
                .is-step-yellow {
                  background-color: #FBD215;
                }
                .fir-z {
                    height: 71px;
                }
                .sec-z {
                    height: 247px;
                }
                float: left;
                width: 19px;
                height: 347px;
            }
            .add-fixed {
                .sel-finger {
                    .sel-finger-title {
                      font-size: 14px;
                    }
                    .sel-finger-tro {
                      margin-left: 18px;
                      font-size: 12px;
                    }
                    height: 20px;
                }
                .add-sel-platform{
                    margin-top: 12px;
                    margin-right: 5px;
                    width: 95px;
                    font-size: 12px;
                    input {
                        height: 32px;
                        line-height: 32px;
                    }
                }
                .add-sel-sel {
                    margin-top: 12px;
                    width: 330px;
                    font-size: 12px;
                    input {
                      height: 32px;
                      line-height: 32px;
                    }
                }
                .add-sel-sel-type{
                    margin-top: 12px;
                    margin-left: 5px;
                    width: 125px;
                    font-size: 12px;
                    input {
                        height: 32px;
                        line-height: 32px;
                    }
                }
                .sel-color {
                    height: 20px;
                    margin-top: 20px;
                    font-size: 14px;
                }
                .sel-ech {
                    .show-prove {
                        .com-prove-num {
                            .get-num {
                                display: inline-block;
                                font-family: sfuidisplay-thin;
                                font-size: 18px;
                            }
                            .prove-sha {
                              width: 10px;
                              height: 13px;
                              display: inline-block;
                              background-image: url('../../layouts/images/icon/icon-up-green.png') ; background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
                            }
                            .prove-xia {
                                width: 14px;
                                height: 18px;
                                display: inline-block;
                                background-image: url('../../layouts/images/icon/icon-down-red.png') ; background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
                            }
                          font-size: 14px;
                        }
                        top: 22px;
                    }

                    // .show-prove {
                    //     .com-prove-num {
                    //         .prove-down {
                    //             width: 19px;
                    //             height: 11px;
                    //         }
                    //         font-size:20px;
                    //         font-family:SystemFont-Thin;
                    //         color:rgba(90,109,130,1)
                    //     }
                    //     .com-prove-day {
                    //         margin-left: 5px;
                    //         font-size:12px;
                    //         font-family:MicrosoftYaHei;
                    //         color:rgba(90,109,130,1);
                    //     }
                    //     position: absolute;
                    //     text-align: center;
                    //     z-index: 1;
                    //     right: 2.8%;
                    //     top: 6px;
                    //     width: 100px;
                    //     height: 50px;
                    // }
                    .sel-show-ech {
                        width: 390px;
                        height: 220px;
                    }
                    position: relative;
                    margin-top: 10px;
                    border: 1px solid #E3EAF0;
                    width: 390px;
                    height: 220px;
                }
                .sel-block {
                    @mixin mar-lef() {
                        margin-left: 17px;
                    }
                    .color1 {
                        @include mar-lef;
                        background-color: #3392FF;
                        border-color: #3392FF;
                    }
                    .color2 {
                        @include mar-lef;
                        background-color: #7262BA;
                        border-color: #7262BA;
                    }
                    .color3 {
                        @include mar-lef;
                        background-color: #D587E3;
                        border-color: #D587E3;
                    }
                    .color4 {
                        @include mar-lef;
                        background-color: #F35974;
                        border-color: #F35974;
                    }
                    .color5 {
                        @include mar-lef;
                        background-color: #F5D41D;
                        border-color: #F5D41D;
                    }
                    .el-checkbox__input {
                      line-height: 0;
                      vertical-align: initial;
                    }
                   text-align: center;
                   margin-top: 10px;
                   height: 16px;
                   width: 390px;
                }
                .edit-title-tro {
                    height: 20px;
                    font-size: 14px;
                    margin-top: 20px;
                }
                .edit-title-input {
                    width: 480px;
                    height: 36px;
                    margin-top: 10px;
                    margin-bottom: 20px;
                }
                margin-left: 26px;
                height: 370px;
            }
            height: 394px;
        }
        border-radius: 4px;
    }
    .see-bord {
        .see-bord-h {
           .is-bord-checked {
               box-shadow: 0 0 2px #3392FF;
           }
           .bord-block-padding-bord {
               padding-right: 27px !important;
           }
           .hover-boder-showdow {
                  &:hover {
                 box-shadow: 0 0 2px #3392FF;
               }
           }
           .bord-block {
            //    &:hover {
            //      box-shadow: 0 0 2px #3392FF;
            //    }
               &:hover .cre-checked-box {
                 display: block;
               }
               .cre-checked-box {
                 display: none;
               }
               .is-del-checked {
                 display: block;
               }
              .show-echarts-r {
                 position: absolute;
                 width: 100%;
                 height: 100%;
                 line-height: 281px;
                 color: #f66254;
              }
              position: relative;
              text-align: center;
            //   margin-right: 26px;
              margin-top: 25px;
              margin-bottom: 2px;
            //   width: 380px;
              height: 281px;
            //   float: left;
            }

            .addImg {
              .img-h {
                text-align: center;
                height: 46px;
                padding-top: 93px;
                img {
                  cursor: pointer;
                  height: 46px;
                }
              }
              .title {
                text-align: center;
                height: 16px;
                line-height: 16px;
                margin-top: 53px;
                font-size: 16px;
              }
              .tro {
                  .tro-w {
                    display: inline-block;
                    opacity: 0.5;
                    width: 133px;
                  }
                  text-align: center;
                  margin-top: 9px;
                  font-size: 12px;
              }
               width: 100%;
               color: #5A6D82
            }
           overflow: hidden;
           padding-left: 4px;
        }
        background-color: #fff;
        padding: 0px 15px 20px 25px;
        margin-top: 12px;
    }
    min-width: 900px;
}
.el-select-dropdown{
    .search-input{
        padding: 12px;
        height: 32px;
        line-height: 32px;
        position: relative;
        .el-input-group__append{
            position: absolute;
            right: 17px;
            top: 15px;
            background: none;
            border: none;
            outline: none;
            .el-button{
                .el-icon-search{
                    //background: url("../../layouts/images/icon/icon-search-gray.png") no-repeat;
                    //background-size: cover;
                }
                .el-icon-search::before{
                }
            }
        }
    }
}
</style>
