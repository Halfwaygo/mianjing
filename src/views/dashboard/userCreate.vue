<template>
    <div class="dashboard-create-modal">
        <div class="create-info">
            <div class="modal-name">{{ boardInfo.name || '' }}</div>
            <div class="creater-date">
                <span class="c-title">创建：</span>
                <span class="c-user-name">{{ boardInfo.createUser || '' }}</span>
                <span class="c-last-modify"><i class="el-icon-time"></i>最后更新时间：</span>
                <span class="c-last-modify-time">{{ boardInfo.updateTime || '' }}</span>
            </div>
            <el-row class="edit-btn">
                <el-col :span="12">
                    <el-button class="el-icon-delete" size="mini" @click="delCheckedBorad"></el-button>
                    <el-checkbox v-model="checkedAll" @change="chooseAll">全选</el-checkbox>
                </el-col>
                <el-col :span="12" class="filter-right">
                    <date-picker :get-cyclce="getCyclce" class="date-picker-line" @getDateValue="getDateValue"></date-picker>
                    <el-button v-if="false" class="btn-icon" size="mini" icon="icon-choose" @click="fliterSet"></el-button>
                </el-col>
                <select-type :is-show-select="isShowSelect" @notshow="fliterSet" @selects="selectList"></select-type>
            </el-row>
        </div>
        <div class="user-create-lists">
            <div class="add-dashboard" @click="addNewModal">
                <div class="add-btn-icon">
                    <img src="../../layouts/images/icon/icon-cricle-add.png">
                    <div class="title">添加单图</div>
                    <div class="title-btm">将单图添加到看板，方便实时监测和管理数据</div>
                </div>
            </div>
            <div v-for="(k, i) in lists" :key="i" :class="{'show-bord-checked': k.delChecked}" class="list-icon">
                <!-- <i :class="k.cls" @click="deleteBtn(k,i)"></i> -->
                <cre-checked-box :is-checked="k.delChecked" :dex="i" :class="{'is-del-checked': k.delChecked}" class="cre-checked-box" @checkIndex="checkIndex"></cre-checked-box>
                <el-container direction="vertical" class="charts-content">
                    <div v-if="k.enable === 1">
                        <div class="icon-header title-header" @click="detail(k.id)">
                            <span class="header-title-text">{{ k.name }}</span><br>
                            <span class="header-title-date">{{ k.date }}</span><br>
                        </div>
                        <div :id="`mainId${k.id}`" class="icon-main charts-main" @click="detail(k)">
                            <div v-if="k.showtype === 3" class="tableChart">
                                <el-table
                                    :data="k.tableData3"
                                    height="350"
                                    border
                                    style="width: 100%">
                                    <el-table-column v-for="(hItem, i) in k.tableHead" :key="i" :prop="hItem.prop " :label="hItem.name">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <div class="icon-footer icon-edit">
                            <div class="modify-info">{{ k.createUser }}修改于{{ k.updatetime }}</div>
                            <div class="edit-btn" @click="eduit(k)">
                                <i class="icon-edit-img"></i>
                            </div>
                        </div>
                    </div>
                    <div v-else class="delBox">
                        该单图已被删除
                    </div>
                </el-container>
            </div>
        </div>
        <dialog-container :di="dialogInfo" @closeDialog="clearDialog" @saveDialog="addChartListInfo">
            <div slot="container" class="dialog-container">
                <el-button-group class="topBtnGroup big">
                    <el-button v-for="(btnlist, i) in dialogBtnList" :key="i" :type="btnlist.isPrimary" size="mini" @click="selectedBtn(i)">{{ btnlist.btn }}</el-button>
                </el-button-group>
                <div class="search">
                    <el-input v-model="searchModel" placeholder="搜索单图名称或创建人" size="mini" class="input-with-select" @input="debounceInput">
                        <el-button slot="append" type="primary" icon="icon-search" size="mini" class="search-icon"></el-button>
                    </el-input>
                </div>
                <el-row class="graph-content">
                    <el-col :span="9">
                        <div class="grid-content graph-items">
                            <el-checkbox-group v-model="checkList" @change="checkListChartChange">
                                <div v-for="(item, i) in items" v-show="item.isCheck !== 1" :key="i" class="items">
                                    <el-checkbox v-model="item.isCheck" :label="item" :disabled="item.isCheck === 1">
                                        <div class="item">
                                            <div class="label_category">{{ item.name }}</div>
                                            <div class="label_user">{{ item.createUser }}</div>
                                            <div class="label_date">修改于{{ item.updatetime.substring(0,10) }}</div>
                                        </div>
                                    </el-checkbox>
                                </div>
                            </el-checkbox-group>
                        </div>
                    </el-col>
                    <el-col :span="15">
                        <div class="grid-content graph-charts">
                            <span class="charts-num" v-text="`已选中${checkList.length}个单图`"></span>
                            <div v-show="checkList.length>0" class="charts-img">
                                <dialog-chart :default-value="checkItem"></dialog-chart>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </dialog-container>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapState, mapActions } from 'vuex'
import DialogContainer from '../../components/common/DialogWrapper.vue'
import DatePicker from '../../components/datePicker.vue'
import SelectType from '../../components/dashboard/SelectType'
import DialogChart from '../../components/dashboard/DialogChart.vue'
import CreCheckedBox from '../../components/dashboard/checkedBox'
import createChart from '../../constants/chartOption/eventOption'
import weekDate from '../../utils/changeDate'
import debounce from 'lodash.debounce'
/*
  dialogBtnList: [
                {btn: '事件分析', isPrimary: 'primary'},
                {btn: '漏斗分析', isPrimary: ''},
                {btn: '留存分析', isPrimary: ''},
                {btn: '渠道分析', isPrimary: ''},
                {btn: '分群分析', isPrimary: ''}],
 */
export default {
    name: 'UserCreate',
    components: {
        DialogContainer,
        DatePicker,
        SelectType,
        DialogChart,
        CreCheckedBox
    },
    data() {
        return {
            lists: [],
            checkedAll: false,
            isShowSelect: false,
            dialogInfo: {
                Visible: false,
                Title: '添加单图',
                Width: '1100px'
            },
            dialogBtnList: [
                {btn: '事件分析', isPrimary: 'primary'},
                {btn: '漏斗分析', isPrimary: ''},
                {btn: '留存分析', isPrimary: ''},
                {btn: '渠道分析', isPrimary: ''}],
            activeBtn: 0,
            searchModel: '',
            checkList: [],
            items: [],
            allItems: [],
            boardId: this.$route.query.id,
            boardInfo: {},
            dateObj: {},
            checkItem: {},
            getCyclce: ''
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    watch: {
        $route(to, from) {
            // 监听路由的变化
            this.boardId = to.query.id
            this.getBoardInfoList()
        }
    },
    created() {
    },
    beforeMount() {
        this.debounceInput = debounce(this.debounceInput.bind(this), 300)
    },
    mounted() {
        this.getBoardInfoList()
        this.getCyclce = '自定义'
    },
    methods: {
        debounceInput() {
            this.searchFilter() // 调用子组件的searchFilter方法，传递值
        },
        detail(item) {
            if (item.type === 0) {
                // 事件分析
                this.$router.push({path: `/graph/new?mode=detail&type=graphCharts&id=${item.id}`})
            } else if (item.type === 1) {
                // 漏斗分析
                this.$router.push({path: `/graph/new?mode=detail&type=graphFunnels&graphid=${item.id}`})
            } else if (item.type === 2) {
                // 留存分析
                this.$router.push({path: `/graph/new?mode=detail&type=graphRetention&graphid=${item.id}`})
            } else if (item.type === 3) {
                // 渠道分析
                this.$router.push({path: `/graph/new?mode=detail&type=graphChannel&editid=${item.id}`})
            } else if (item.type === 4) {
                // 分群分析
                this.$router.push({path: `/graph/new?mode=detail&type=graphChannel&editid=${item.id}`})
            }
        },
        eduit(item) {
            if (item.type === 0) {
                // 事件分析
                this.$router.push({path: `/graph/new?mode=edit&type=graphCharts&id=${item.id}`})
            } else if (item.type === 1) {
                // 漏斗分析
                this.$router.push({path: `/graph/new?mode=edit&type=graphFunnels&graphid=${item.id}`})
            } else if (item.type === 2) {
                // 留存分析
                this.$router.push({path: `/graph/new?mode=edit&type=graphRetention&graphid=${item.id}`})
            } else if (item.type === 3) {
                // 渠道分析
                this.$router.push({path: `/graph/new?mode=edit&type=graphChannel&editid=${item.id}`})
            } else if (item.type === 4) {
                // 分群分析
                this.$router.push({path: `/graph/new?mode=edit&type=graphCluster&editid=${item.id}`})
            }
        },
        checkListChartChange() {
            // 显示最后一个选择的E chart图
            // console.log(this.checkList)
            let item = this.checkList[ this.checkList.length - 1 ] || {}
            if (item.id) {
                this.checkItem = { id: item.id, type: item.type, name: item.name }
                // console.log(this.checkItem)
            }
        },
        getDateValue(d) {
            this.dateObj = d
            this.dateObj.cyclce = this.dateObj.countDay <= 30 ? 1 : (this.dateObj.countDay <= 90 ? 2 : 3)
            this.lists.map((item, index) => {
                // console.log(item)
                if (item.enable === 1) {
                    // 未被删除的单图获取配置项和 数据
                    if (item.type === 0) {
                        if (item.dataObj.showtype === 3) {
                            // 表格
                            this.lists[index].tableHead = []
                            this.lists[index].tableData3 = []
                            this.tableChart(item.dataObj, index)
                        } else {
                            this.lists[index].chart.showLoading({
                                text: '正在加载',
                                color: '#409EFF'
                            })
                            this.dataCell(item.dataObj, index)
                        }
                    }
                    item.type === 1 && this.getFunnelsChart(item.dataObj, index)
                    item.type === 2 && this.getRetentionChart(item.dataObj, index)
                    item.type === 3 && this.getChannelChart(item.dataObj, index)
                    item.type === 4 && this.getCluster(item.dataObj, index)
                }
            })
        },
        getBoardInfoList() {
            this.showPageLoading()
            this.lists = []
            // 获取单个看板信息
            Api.getSingelBoard({boardId: this.boardId}).then(res => {
                this.hidePageLoading()
                this.boardInfo = res
                if (res.datas.length > 0) {
                    let listInfo = res.datas
                    for (let i = 0; i < listInfo.length; i++) {
                        let item = {
                            delChecked: false,
                            type: listInfo[i].type,
                            name: listInfo[i].name,
                            id: listInfo[i].id,
                            enable: listInfo[i].enable,
                            chart: null,
                            createUser: '',
                            updatetime: ''
                        }
                        this.lists.push(item)
                    }
                    this.lists.map((item, index) => {
                        if (item.enable === 1) {
                            // 未被删除的单图获取配置项和 数据
                            item.type === 0 && this.getEventData(item, index)
                            item.type === 1 && this.getFunnelsData(item, index)
                            item.type === 2 && this.getRetention(item, index)
                            item.type === 3 && this.getChannelData(item, index)
                            item.type === 4 && this.getCluster(item, index)
                        }
                    })
                }
            })
        },
        getEventData(item, index) {
            // 事件分析
            Api.graphQueryEventMap({appId: this.appId, id: item.id}).then(chart => {
                this.lists[index].date = chart.starttime.substring(0, 10).replace(/-/g, '/') + '-' + chart.endtime.substring(0, 10).replace(/-/g, '/')
                this.lists[index].updatetime = chart.updatetime.substring(0, 10).replace(/-/g, '/')
                this.lists[index].createUser = chart.createUser
                this.lists[index].showtype = chart.showtype
                this.lists[index].dataObj = chart
                if (chart.showtype === 3) {
                    // 表格
                    this.lists[index].tableHead = []
                    this.lists[index].tableData3 = []
                    this.tableChart(chart, index)
                } else {
                    this.lists[index].chart = this.$echarts.init(document.getElementById(`mainId${item.id}`))
                    this.lists[index].chart.showLoading({
                        text: '正在加载',
                        color: '#409EFF'
                    })
                    this.dataCell(chart, index, `mainId${item.id}`)
                }
            })
        },
        getFunnelsData(item, index) {
            // 漏斗分析
            Api.graphQueryFunnelMap({ id: item.id }).then(res => {
                this.lists[index].date = res.starttime.substring(0, 10).replace(/-/g, '/') + '-' + res.endtime.substring(0, 10).replace(/-/g, '/')
                this.lists[index].updatetime = res.updatetime.substring(0, 10).replace(/-/g, '/')
                this.lists[index].createUser = res.createUser
                this.lists[index].dataObj = res
                this.lists[index].chart = this.$echarts.init(document.getElementById(`mainId${item.id}`))
                this.getFunnelsChart(res, index)
            })
        },
        getFunnelsChart(res, index) {
            this.lists[index].date = this.dateObj.endTime && this.dateObj.startTime ? this.dateObj.startTime.substring(0, 4) + '/' + this.dateObj.startTime.substring(4, 6) + '/' + this.dateObj.startTime.substring(6, 8) + '-' + this.dateObj.endTime.substring(0, 4) + '/' + this.dateObj.endTime.substring(4, 6) + '/' + this.dateObj.endTime.substring(6, 8)
                : this.lists[index].date
            this.lists[index].chart.showLoading({
                text: '正在加载',
                color: '#409EFF'
            })
            // 漏斗的数据接口
            let obj = {}
            obj.appId = this.appId
            obj.name = 'mr'
            obj.type = 1
            obj.startTime = this.dateObj.startTime ? this.dateObj.startTime : res.starttime.split(' ')[0].replace(/-/g, '')
            obj.endTime = this.dateObj.endTime ? this.dateObj.endTime : res.endtime.split(' ')[0].replace(/-/g, '')
            obj.cyclceTime = this.dateObj.endTime ? this.dateObj.circleTime : res.cyclcetime
            obj.cyclce = this.dateObj.cyclce ? this.dateObj.cyclce : res.cyclce
            obj.conditionType = res.conditiontype === 'AND' ? '0' : '1'
            obj.groupId = res.groupId
            // obj.fields = JSON.stringify(res.fields)
            let fieldsLS = []
            res.fields.forEach(item => {
                let fildObj = {}
                fildObj.fieldId = item.fieldId
                fildObj.value = item.value
                fildObj.type = item.type
                fieldsLS.push(fildObj)
            })
            obj.fields = JSON.stringify(fieldsLS)
            let newIndexs = []
            res.indexs.forEach((item, index) => {
                newIndexs.push({
                    'selectId': item.id,
                    'innerType': item.innerType,
                    'orderNum': index + 1
                })
            })
            obj.indexs = JSON.stringify(newIndexs)
            Api.graphGetFunnelMapIndex(obj).then(res2 => {
                let daysArr = []
                let rateArr = []
                for (let item in res2.daysData) {
                    let {out, rate} = res2.daysData[item]
                    let t = new Date(parseInt(item))
                    let day = `${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                    daysArr.push(day)
                    rateArr.push({'name': out, 'value': rate.toFixed(3)})
                }
                createChart.funnelsOption.xAxis.data = daysArr
                createChart.funnelsOption.series[0].data = rateArr
                this.lists[index].chart.setOption(createChart.funnelsOption)
                this.lists[index].chart.hideLoading()
            })
        },
        getRetention(item, index) {
            // 留存分析
            this.graphQueryRetainMapAction({id: item.id}).then(chart => {
                this.lists[index].date = chart.starttime.substring(0, 10).replace(/-/g, '/') + '-' + chart.endtime.substring(0, 10).replace(/-/g, '/')
                this.lists[index].updatetime = chart.updatetime.substring(0, 10).replace(/-/g, '/')
                this.lists[index].createUser = chart.createUser
                this.lists[index].dataObj = chart
                this.lists[index].chart = this.$echarts.init(document.getElementById(`mainId${item.id}`))
                this.getRetentionChart(chart, index)
            })
        },
        getRetentionChart(chart, index) {
            this.lists[index].date = this.dateObj.endTime && this.dateObj.startTime ? this.dateObj.startTime.substring(0, 4) + '/' + this.dateObj.startTime.substring(4, 6) + '/' + this.dateObj.startTime.substring(6, 8) + '-' + this.dateObj.endTime.substring(0, 4) + '/' + this.dateObj.endTime.substring(4, 6) + '/' + this.dateObj.endTime.substring(6, 8)
                : this.lists[index].date
            this.lists[index].chart.showLoading({
                text: '正在加载',
                color: '#409EFF'
            })
            // 留存的数据接口
            let fieldsList = chart.fields.map(item => {
                let params = {
                    fieldId: item.fieldId,
                    fieldName: item.fieldName,
                    type: item.type,
                    value: item.value
                }
                return params
            })
            let startId = chart.behavior1
            if (startId.split('#')[1] === '1') {
                startId = startId.split('#')[0].split('-')[0]
            } else {
                startId = startId.split('#')[0]
            }
            let endId = chart.behavior2
            if (endId.split('#')[1] === '1') {
                endId = endId.split('#')[0].split('-')[0]
            } else {
                endId = endId.split('#')[0]
            }
            let mapIndex = {
                appId: chart.appid,
                firstId: startId,
                secondId: endId,
                cycle: this.dateObj.cyclce ? this.dateObj.cyclce : chart.cyclce,
                startTime: this.dateObj.startTime ? this.dateObj.startTime : chart.starttime.split(' ')[0].replace(/-/g, ''),
                endTime: this.dateObj.endTime ? this.dateObj.endTime : chart.endtime.split(' ')[0].replace(/-/g, ''),
                conditionType: chart.conditiontype,
                groupId: chart.groupId, // result.groupId, 目标用户暂时不用，分群分析处理好之后添加，
                fields: JSON.stringify(fieldsList)
            }
            Api.graphGetRetainMapIndex(mapIndex).then(detail => {
                let daysList = []
                let dataList = []
                detail[0].filter((item, k) => {
                    let days = ''
                    if (mapIndex.cyclce === 1) {
                        days = k === 0 ? '当日' : k === 1 ? '次日' : `${k}日后`
                    } else if (mapIndex.cyclce === 2) {
                        days = k === 0 ? '当周' : k === 1 ? '次周' : `${k}周后`
                    } else {
                        days = k === 0 ? '当月' : k === 1 ? '次月' : `${k}月后`
                    }
                    daysList.push(days)
                    dataList.push(parseFloat(item.ratio) / 100)
                })
                this.lists[index].options = createChart.retentionChartOption
                this.lists[index].options.xAxis.data = daysList
                this.lists[index].options.series[0].data = dataList
                this.lists[index].chart.setOption(this.lists[index].options)
                this.lists[index].chart.hideLoading()
            })
        },
        getChannelData(item, index) {
            // 渠道分析
            this.graphQueryChannelMapAction({id: item.id}).then(chart => {
                this.lists[index].date = chart.starttime.substring(0, 10).replace(/-/g, '/') + '-' + chart.endtime.substring(0, 10).replace(/-/g, '/')
                this.lists[index].updatetime = chart.updatetime.substring(0, 10).replace(/-/g, '/')
                this.lists[index].createUser = chart.createUser
                this.lists[index].dataObj = chart
                this.lists[index].chart = this.$echarts.init(document.getElementById(`mainId${item.id}`))
                this.getChannelChart(chart, index)
            })
        },
        getChannelChart(chart, index) {
            this.lists[index].date = this.dateObj.endTime && this.dateObj.startTime ? this.dateObj.startTime.substring(0, 4) + '/' + this.dateObj.startTime.substring(4, 6) + '/' + this.dateObj.startTime.substring(6, 8) + '-' + this.dateObj.endTime.substring(0, 4) + '/' + this.dateObj.endTime.substring(4, 6) + '/' + this.dateObj.endTime.substring(6, 8)
                : this.lists[index].date
            this.lists[index].chart.showLoading({
                text: '正在加载',
                color: '#409EFF'
            })
            let fieldList = []
            chart.fields.forEach(f => {
                fieldList.push({
                    fieldId: f.fieldId,
                    type: f.type,
                    value: f.value
                })
            })
            let params = {
                appid: chart.appid,
                channelid: chart.channelid,
                groupId: chart.groupId,
                conditiontype: chart.conditiontype,
                fields: JSON.stringify(fieldList),
                starttime: this.dateObj.startTime ? this.dateObj.startTime : chart.starttime.split(' ')[0].replace(/-/g, ''),
                endtime: this.dateObj.endTime ? this.dateObj.endTime : chart.endtime.split(' ')[0].replace(/-/g, '')
            }
            this.graphGetChannelMapIndexAction(params).then(result => {
                this.lists[index].options = createChart.channelChartOption
                let dataX = []
                let dataNum = []
                let datalist = chart.chartStatus === 1 ? result.increaseUserList : result.activeUserList
                datalist.filter(item => {
                    let week = weekDate.getWeekName(item.groupField)
                    dataX.push(item.groupField.replace(/-/g, '/').substring(5, 10) + week)
                    dataNum.push(item.countNum)
                })
                let seriesLis = [
                    {
                        name: chart.chartStatus === 1 ? '新增用户' : '活跃用户',
                        type: 'bar',
                        smooth: true,
                        barMaxWidth: 22,
                        itemStyle: {
                            normal: {
                                color: '#74BB5C'
                            }
                        },
                        data: dataNum
                    },
                    {
                        name: chart.chartStatus === 1 ? '新增用户' : '活跃用户',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#F35974'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(237,63,97,0.2)'
                                }, {
                                    offset: 1,
                                    color: '#ffffff'
                                }])
                            }
                        },
                        data: dataNum
                    }]
                let series = chart.chartType === 2 ? seriesLis[1] : seriesLis[0]
                this.lists[index].options.xAxis.data = dataX
                this.lists[index].options.series = series
                this.lists[index].chart.setOption(this.lists[index].options)
                this.lists[index].chart.hideLoading()
            })
        },
        getCluster(item, index) {
            // 分群分析
            console.log('分群' + index)
        },
        tableChart(chartData, n) {
            this.lists[n].date = this.dateObj.endTime && this.dateObj.startTime ? this.dateObj.startTime.substring(0, 4) + '/' + this.dateObj.startTime.substring(4, 6) + '/' + this.dateObj.startTime.substring(6, 8) + '-' + this.dateObj.endTime.substring(0, 4) + '/' + this.dateObj.endTime.substring(4, 6) + '/' + this.dateObj.endTime.substring(6, 8)
                : this.lists[n].date
            this.lists[n].showtype = chartData.showtype
            // 表格
            // 表格 多指标和多维度 如果维度中有选择时间，粒度可选择，如果没有，删除粒度的值
            // delete params['cycle']  表格的接口是单独的
            let dimensionList = []
            chartData.dimentions.forEach(d => {
                dimensionList.push(parseInt(d.dimensionid))
            })
            if (chartData.cyclce > 0) {
                dimensionList.push(createChart.timeItem.id)
                chartData.dimentions.push(createChart.timeItem)
            }
            let fieldsList = []
            chartData.fields.forEach(f => {
                let fitem = {
                    fieldId: f.fieldId,
                    type: f.type,
                    value: f.value
                }
                fieldsList.push(fitem)
            })
            let itemList = []
            chartData.indexs.forEach(s => {
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
                id: chartData.id,
                showType: chartData.showtype,
                indexs: JSON.stringify(itemList),
                cycle: chartData.cyclce ? (this.dateObj.cyclce ? this.dateObj.cyclce : chartData.cyclce) : 4,
                conditionType: chartData.conditiontype,
                cyclceTime: this.dateObj.startTime ? this.dateObj.circleTime : chartData.cyclceTime,
                startTime: this.dateObj.startTime ? this.dateObj.startTime : chartData.starttime.substring(0, 10).replace(/-/g, ''),
                endTime: this.dateObj.endTime ? this.dateObj.endTime : chartData.endtime.substring(0, 10).replace(/-/g, ''),
                fields: JSON.stringify(fieldsList),
                groupId: chartData.groupId,
                dimensionIds: dimensionList
            }
            Api.graphGerEventTableMapIndex(params).then(res => {
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
                if (this.lists[n].tableHead.length <= 0) {
                    for (let j = 0; j < t.length - 1; j++) {
                        this.lists[n].tableHead.push({
                            name: chartData.dimentions[j].name,
                            prop: t[j]
                        })
                    }
                }
                res.forEach((tl, i) => {
                    this.lists[n].tableHead.push({
                        name: chartData.indexs[i].name,
                        prop: chartData.indexs[i].id
                    })
                    // 第一次指标的记录维度的信息  后面的指标参数直接嵌入
                    if (this.lists[n].tableData3.length > 0) {
                        this.lists[n].tableData3.forEach((item, k) => {
                            item[chartData.indexs[i].id] = tl[k].COUNTNUM
                        })
                    } else {
                        tl.forEach(item => {
                            item[chartData.indexs[i].id] = item.COUNTNUM
                            // 如果有时间的
                            if (item.WEEK_BEGIN) {
                                item.WEEK_BEGIN = item.WEEK_BEGIN.replace(/-/g, '/').substring(5, 10) + '-' + item.WEEK_END.replace(/-/g, '/').substring(5, 10)
                            }
                        })
                        this.lists[n].tableData3 = tl
                    }
                })
                // 数据变化 渲染也变化
                this.$nextTick(() => {
                    this.$set(this.lists, n, this.lists[n])
                })
            })
        },
        dataCell(chartData, n, idx) {
            this.lists[n].date = this.dateObj.endTime && this.dateObj.startTime ? this.dateObj.startTime.substring(0, 4) + '/' + this.dateObj.startTime.substring(4, 6) + '/' + this.dateObj.startTime.substring(6, 8) + '-' + this.dateObj.endTime.substring(0, 4) + '/' + this.dateObj.endTime.substring(4, 6) + '/' + this.dateObj.endTime.substring(6, 8)
                : this.lists[n].date
            // console.log(this.lists[n])
            // 数据接口
            // 指标
            // let targetList = []
            if (chartData.showtype === 0 || chartData.showtype === 2) {
                // 线性 或 纵向柱状图
                createChart.chart1Optine.grid.top = 10
                this.lists[n].options = createChart.chart1Optine
                this.lists[n].options.series = []
            } else if (chartData.showtype === 1) {
                // 横向柱状图
                this.lists[n].options = createChart.chart2Option
                createChart.chart2Option.xAxis.axisLabel.show = false
            } else if (chartData.showtype === 4) {
                // 数值图
                this.lists[n].options = createChart.chart5Option
                this.lists[n].options.series = []
            }
            let legendName = []
            let fieldsList = []
            let targetDataList = []
            // 转下筛选条件
            chartData.fields.forEach(f => {
                let fitem = {
                    fieldId: f.fieldId,
                    type: f.type,
                    value: f.value
                }
                fieldsList.push(fitem)
            })
            if (chartData.indexs && chartData.indexs.length > 0) {
                for (let i = 0; i < chartData.indexs.length; i++) {
                    let name = chartData.indexs[i].name
                    // 现在只有预定义指标可测
                    let iscomplex = chartData.indexs[i].isComplex === 0 ? (chartData.indexs[i].isPage === 1 ? 1 : 0) : parseInt(chartData.indexs[i].isComplex) + 1
                    let item = {
                        selectID: chartData.indexs[i].id,
                        elementType: iscomplex,
                        platform: 0,
                        queryType: chartData.indexs[i].innerType
                    }
                    let params = {
                        appId: this.appId,
                        id: chartData.id,
                        showType: chartData.showtype,
                        indexs: JSON.stringify(item),
                        cycle: chartData.cyclce ? (this.dateObj.cyclce ? this.dateObj.cyclce : chartData.cyclce) : 4,
                        cyclceTime: this.dateObj.startTime ? this.dateObj.circleTime : chartData.cyclceTime,
                        conditionType: chartData.conditiontype,
                        startTime: this.dateObj.startTime ? this.dateObj.startTime : chartData.starttime.substring(0, 10).replace(/-/g, ''),
                        endTime: this.dateObj.endTime ? this.dateObj.endTime : chartData.endtime.substring(0, 10).replace(/-/g, ''),
                        groupId: chartData.groupId,
                        fields: JSON.stringify(fieldsList)
                    }
                    //    线图和 纵向柱状图 只有指标
                    if (chartData.showtype === 1) {
                        // 横向柱状图 有单指标和单维度
                        let dimensionList = []
                        chartData.dimentions.forEach(d => {
                            dimensionList.push(parseInt(d.dimensionid))
                        })
                        params.dimensionIds = dimensionList
                    }
                    if (chartData.showtype === 4) {
                        // 数值图 单指标和颜色S
                        delete params['cycle']
                        params.comparedStartTime = this.dateObj.comStartTime ? this.dateObj.comStartTime : chartData.comparedStartTime.substring(0, 10).replace(/-/g, '')
                        params.comparedEndTime = this.dateObj.comEndTime ? this.dateObj.comEndTime : chartData.comparedEndTime.substring(0, 10).replace(/-/g, '')
                    }
                    Api.graphGetEventMapIndex(params).then(res => {
                        if (res.length === 0) {
                            document.getElementById(idx).innerHTML = '暂无数据'
                            return
                        }
                        if (params.showType === 0 || params.showType === 2) {
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
                                barMaxWidth: 20,
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
                            targetDataList.push(targetData)
                            this.lists[n].options.xAxis.data = chartTime
                            this.lists[n].options.legend.data = legendName
                            this.lists[n].options.series = targetDataList
                            this.lists[n].chart.setOption(this.lists[n].options)
                            this.lists[n].chart.hideLoading()
                        } else if (params.showType === 1) {
                            // 横向柱状图
                            let datList = []
                            let totalDat = 0
                            let chart2Time = []
                            res.sort((a, b) => {
                                return a.COUNTNUM - b.COUNTNUM
                            })
                            res.forEach(item => {
                                datList.push(item.COUNTNUM)
                                totalDat = totalDat + parseInt(item.COUNTNUM)
                                chart2Time.push(item[Object.keys(item)[0]])
                            })
                            let label = {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    formatter (data) {
                                        return `${data.data} (${((data.data / totalDat) * 100).toFixed(2)}%)`
                                    },
                                    textStyle: {
                                        fontSize: '12',
                                        fontFamily: 'MicrosoftYaHei',
                                        color: '#5A6D82'
                                    }
                                }
                            }
                            this.lists[n].options.yAxis.data = chart2Time
                            this.lists[n].options.series[0].label = label
                            this.lists[n].options.series[0].data = datList
                            // this.line2Res.option.series.push(ser)
                            this.lists[n].chart.setOption(this.lists[n].options)
                            this.lists[n].chart.hideLoading()
                        } else if (params.showType === 4) {
                            // 数值图
                            chartData.compareNum = res.difference
                            chartData.comparePre = res.ratio
                            let sersie = {
                                name: name,
                                type: 'line',
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: createChart.echartColor[chartData.color].value
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: createChart.echartColor[chartData.color].rgbaValue
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
                                chart5Time.push(item.groupField)
                            })
                            targetDataList.push(sersie)
                            this.lists[n].options.xAxis.data = chart5Time
                            this.lists[n].options.series = targetDataList
                            this.lists[n].chart.setOption(this.lists[n].options)
                            this.lists[n].chart.hideLoading()
                        }
                        this.$nextTick(() => {
                            this.$set(this.lists, n, this.lists[n])
                        })
                    })
                }
            }
        },
        checkIndex(v) {
            const index = v.dex
            this.$nextTick(() => {
                // this.lists = []
                this.lists[index].delChecked = v.isChecked
            })
        },
        addNewModal() {
            this.dialogInfo.Visible = true
            // 获取单图信息（默认第一个事件分析）
            this.getSingleMapList()
        },
        searchFilter() {
            // 根据单图名称和创建人来搜索
            // console.log(this.checkList)
            let filter = []
            if (this.searchModel) {
                filter = this.allItems.filter(item => {
                    if (item.name.indexOf(this.searchModel) >= 0 || item.createUser.indexOf(this.searchModel) >= 0) {
                        return item
                    }
                })
            } else {
                filter = this.allItems
            }
            this.items = filter
        },
        selectedBtn(index) {
            if (this.activeBtn !== index) {
                this.dialogBtnList[this.activeBtn]['isPrimary'] = ''
                this.activeBtn = index
                this.dialogBtnList[index]['isPrimary'] = 'primary'
                // 获取单图信息
                this.getSingleMapList()
            }
        },
        getSingleMapList() {
            this.items = []
            // 获取单图列表
            let params = {
                appId: this.appId,
                boardId: this.boardId,
                type: this.activeBtn
            }
            Api.getSingleMapList(params).then(res => {
                this.allItems = res.datas
                // 如果搜索的字段存在，搜索字段
                if (this.searchModel) {
                    this.searchFilter()
                } else {
                    this.items = res.datas
                }
            })
        },
        fliterSet() {
            this.isShowSelect = !this.isShowSelect
        },
        selectList(list) {
            // console.log(list)
        },
        iconDefault(item, $index) {
            if (this.lists[$index]['cls'] !== 'el-icon-success') {
                this.lists[$index]['cls'] = 'el-radio__inner'
            }
            this.lists[$index]['borStl'] = 'show-boxshow'
        },
        deleteBtn(item, $index) {
            this.lists[$index]['cls'] = this.lists[$index]['cls'] === 'el-icon-success' ? 'el-radio__inner' : 'el-icon-success'
        },
        recycleBtn(item, $index) {
            if (this.lists[$index]['cls'] !== 'el-icon-success') {
                this.lists[$index]['cls'] = 'none'
                this.lists[$index]['borStl'] = 'none'
            }
        },
        chooseAll() {
            // 单图全选功能
            this.lists.forEach(res => {
                res.delChecked = this.checkedAll
            })
        },
        delCheckedBorad() {
            // 删除单图的
            let delIdLIst = []
            let numList = []
            this.lists.forEach((res, i) => {
                if (res.delChecked) {
                    delIdLIst.push(res.id)
                    numList.push(i)
                }
            })
            let delIdLIstString = delIdLIst.join(',')
            this.$confirm(`确定要删除选中的${delIdLIst.length}个单图`, '删除单图', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.delSingleMap({boardId: this.boardId, singleMapId: delIdLIstString}).then(res => {
                    // 删除单图成功
                    this.$alerts({
                        type: 'success',
                        content: '删除单图成功'
                    })
                    // 逆向删除
                    for (let j = numList.length - 1; j >= 0; j--) {
                        this.lists.splice(numList[j], 1)
                    }
                }).catch(() => {
                    this.$alerts({
                        type: 'fail',
                        content: '删除单图失败'
                    })
                })
            }).catch(() => {
            })
        },
        clearDialog() {
            this.checkList = []
            this.searchModel = ''
            this.dialogInfo.Visible = false
        },
        addChartListInfo() {
            let dataList = []
            for (let i = 0; i < this.checkList.length; i++) {
                let item = {
                    type: this.checkList[i].type,
                    id: this.checkList[i].id,
                    name: this.checkList[i].name,
                    enable: this.checkList[i].enable
                }
                dataList.push(item)
            }
            // 创建单图
            let params = {
                appId: this.appId,
                boardId: this.boardId,
                data: JSON.stringify(dataList)
            }
            Api.addSingleMap(params).then(res => {
                // 创建单图成功
                this.$alerts({
                    type: 'success',
                    content: '创建单图成功'
                })
                dataList.forEach(res => {
                    res.delChecked = false
                    this.lists.push(res)
                    let index = this.lists.length - 1
                    // 获取数据
                    res.type === 0 && this.getEventData(res, index)
                    res.type === 1 && this.getFunnelsData(res, index)
                    res.type === 2 && this.getRetention(res, index)
                    res.type === 3 && this.getChannelData(res, index)
                    res.type === 4 && this.getCluster(res, index)
                })
                this.checkList = []
                this.searchModel = ''
                this.dialogInfo.Visible = false
                this.getBoardInfoList()
            })
        },
        ...mapActions(['graphQueryRetainMapAction', 'graphQueryChannelMapAction', 'graphGetChannelMapIndexAction', 'showPageLoading', 'hidePageLoading'])
    }
}
</script>

<style lang="scss">
$inputBorder: #3392FF;
.dashboard-create-modal{
    min-height: 300px;
    background-color: #FFFFFF;
    .create-info{
        padding: 20px;
        .modal-name{
            font-size: 20px;
        }
        .creater-date{
            font-size: 14px;
            color: #5A6D82;
            margin: 15px 0;
            .c-last-modify{
                margin-left: 30px;
            }
            .c-last-modify-time{}
        }
        .edit-btn{
            .el-icon-delete{
                width: 60px;
                margin-right: 20px;
                background-color: #F9FAFB;
            }
            .filter-right{
                text-align: right;
                .date-picker-line{
                    vertical-align: top;
                    display: inline-block;
                }
                .btn-icon{
                    padding: 5px 25px;
                    top: 3px;
                    margin-left: 8px;
                    background-color: #F9FAFB;
                    span{
                        display: inline-block;
                    }
                    .icon-choose{
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        background-image: url("../../layouts/images/icon/icon-choose.png");
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: contain;
                    }
                }
            }
        }
    }
    .user-create-lists{
        .add-dashboard {
            background-color: #F3F4F8;
        }
        .show-boxshow {
          border: none !important;
          box-shadow: 0 0 2px #3392FF;
        }
        .add-dashboard,.list-icon{
            width: 340px;
            height: 340px;
            display: inline-block;
            margin-left: 28px;
            border: 1px dashed rgba(109,118,132, 0.4);
            vertical-align: top;
            margin-bottom: 20px;
            position: relative;
            cursor: pointer;
            .add-btn-icon{
                color: #5A6D82;
                position: absolute;
                top: 50%;
                left: 50%;
                text-align:center;
                transform: translate(-50%, -50%);

                img{
                    width: 46px;
                    height: 46px;
                }
                .title{
                    font-size: 16px;
                    opacity: 0.7;
                    margin: 8px 0;
                }
                .title-btm{
                    font-size: 12px;
                    opacity: 0.5;
                }
            }
        }
        .show-bord-checked {
           box-shadow: 0 0 2px #3392FF;
         }
        .list-icon{
            border: 1px solid rgba(109,118,132, 0.3);
            position: relative;
            &:hover {
                box-shadow: 0 0 2px #3392FF;
            }
            &:hover .cre-checked-box {
                display: block;
            }
            .cre-checked-box {
                display: none;
            }
            .is-del-checked {
                display: block;
            }
            .charts-content{
                position: relative;
                height: 340px;
                .delBox{
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    text-align: center;
                    color: #f66254 ;
                }
                .icon-header {
                    height: 60px;
                    padding: 5px;
                    overflow: hidden;
                    .header-title-text {
                        font-size: 14px;
                        color: #5A6D82;
                    }
                    .header-title-date {
                        color: #ababab;
                    }
                    .header-selection {
                        color: #ababab;
                        font-size: 12px;
                        .hd-dimension {
                        }
                        .hd-selection-dimension {
                            border-radius: 2px;
                            color: #F0F0F0;
                            background-color: #6D7684;
                            padding: 2px 4px;
                        }
                        .hd-user-group {
                        }
                        .hd-selection-user-group {
                            border-radius: 2px;
                            color: #F0F0F0;
                            background-color: #6D7684;
                            padding: 2px 4px;
                        }
                    }
                }
                .icon-edit {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    border-top: 1px solid #E3EAF0;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 5px;
                    .modify-info {
                        display: inline-block;
                        opacity: .8;
                        color: #5A6D82;
                        font-size: 12px;
                    }
                    .edit-btn {
                        display: inline-block;
                        float: right;
                        padding-top: 1px;
                        i {
                            margin-left: 10px;
                            font-size: 16px;
                        }
                    }
                }
                .icon-main {
                    padding: 0 5px;
                    background-color: #fff;
                    color: #333;
                    text-align: center;
                    height: 230px;
                    line-height: 230px;
                    width: 100%;
                    .tableChart{
                        line-height: 0;
                        height: 230px;
                        overflow: hidden;
                    }
                }
            }
        }
    }
    .dialog-container{
        .search{
            display: inline-block;
            width: 200px;
            float: right;
            .input-with-select{
                .el-input__inner,.el-input-group__append{
                    border: 1px solid $inputBorder;
                }
                .el-input-group__append{
                    background-color: $inputBorder;
                    color: #FFFFFF;
                }
                .el-input-group__prepend {
                    background-color: #fff;
                }
                .el-button{
                    padding: 12px 14px;
                }
            }
            .search-icon{
                .icon-search{
                    display: inline-block;
                    width: 15px;
                    height: 14px;
                    background: url("../../layouts/images/icon/icon-search.png") no-repeat center;
                    background-size: contain;
                }
            }
        }
        .graph-content{
            margin-top: 15px;
            border: 1px solid #E3EAF0;
            padding: 5px;
            .graph-items{
                height: 240px;
                overflow-y: scroll;
                border-right: 1px solid rgba(109,118,132,0.3);
                .items{
                    margin-right: 5px;
                    overflow: hidden;
                    .item{
                        display: flex;
                        width: 336px;
                        .label_category{
                            flex: 2;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            display: block;
                        }
                        .label_user{
                            display: flex;
                            flex: 1;
                        }
                        .label_date{
                            display: flex;
                        }
                    }
                }
                .el-checkbox__input.is-checked+.el-checkbox__label{
                    color: #5A6D82;
                }
            }
            .graph-charts{
                height: 240px;
                overflow-y: scroll;
                position: relative;
                .charts-num{
                    margin: 5px;
                }
                .charts-img{
                    height: 400px;
                }
            }
        }
    }
}
</style>
