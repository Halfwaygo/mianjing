<template>
    <div class="add-retention-section">
        <top-menu :editbasedata="editTitle" :name="titlename" :is-detail="this.$route.query.mode === 'detail'" @saveCreGraph="saveCreGraph"></top-menu>
        <div class="bottom-model">
            <div class="left-content">
                <cre-sel-behav :name="'1. 选择起始行为'" :behavior="editStartBehave" @getBehavValue="getFirstBehavValue"></cre-sel-behav>
                <cre-sel-behav :name="'2. 选择留存行为'" :selmaintype="'retation'" :behavior="editSecondBehave" style="margin-top: 15px;" @getBehavValue="getSecondBehavValue"></cre-sel-behav>
                <target-user :default-single-choos-value="defaultTargetUser" :name="'3. 目标用户'" :event-type="'retention'" @selectUser = "getUserValue"></target-user>
                <!-- <filter-creat :name="'4. 过滤条件'" @selects="selectBox"></filter-creat> -->
                <filter-creat :name="'4. 过滤条件'" :selected-list-info="selectList" @selects="selectBox"></filter-creat>
            </div>

            <div class="right-show-char">
                <div class="top-menu">
                    <div class="top-date">
                        <date-picker :get-cyclce="editTime" @getDateValue="getDateInfo"></date-picker>
                    </div>
                    <div class="circle-sel">
                        <el-select v-model="cycleValue" placeholder="请选择" popper-class="cre-retation" @change="resetCycleValue">
                            <el-option
                                v-for="item in cycleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div id="dt1" class="show-char">
                </div>

                <div class="cre-detali-chart">
                    <detali-chart :table-data="tableData" :cycle="changeCycleValue"></detali-chart>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapState } from 'vuex'

import DatePicker from '../../components/datePicker.vue'
import DetaliChart from '~/components/dashboard/DetaliChart'
import FilterCreat from '../creatSingle/FilterCreat.vue'
import TopMenu from '../creatSingle/CreTopMenu.vue'
import CreSelBehav from '../creatSingle/CreSelBehav.vue'
import D from '../../utils/changeDate'
import TargetUser from '../TargetUser.vue'
export default {
    name: 'CreRetention',
    components: {
        TopMenu,
        DatePicker,
        DetaliChart,
        TargetUser,
        FilterCreat,
        CreSelBehav
    },
    data() {
        return {
            titlename: this.$route.query.mode === 'edit' ? '编辑留存分析' : this.$route.query.mode === 'detail' ? '查看留存分析' : '新建留存分析',
            selectList: {},
            changeCycleValue: 1,
            cycleValue: 1,
            editTitle: {
                graphName: '',
                graphDescription: ''
            },
            editStartBehave: '', // 编辑时第一步
            editSecondBehave: '', // 编辑时第二步
            defaultTargetUser: '', // 默认得目标用户
            editTime: '', // 编辑时的时间
            saveForm: {
                name: '',
                comments: '',
                firstId: '1#1', // 第一步指标
                secondId: '1#1', // 第二步指标
                cyclce: '1', // 统计周期
                conditionType: -1, // 条件
                cyclceTime: 7, // 时间周期  区分快捷和时间段的时间选择
                startTime: '',
                endTime: '',
                fields: [],
                groupId: '0'
            },
            cycleOptions: [{
                label: '天',
                value: 1,
                disabled: false
            },
            {
                label: '周',
                value: 2,
                disabled: true
            },
            {
                label: '月',
                value: 3,
                disabled: true
            }],
            echArr: [{
                title: '单图1',
                id: 'dt1',
                daysArr: ['03/13', '03/14', '03/15', '03/16', '03/17'],
                dataArr: [100, 100, 200, 500, 200]
            }],
            tableData: [],
            weekly: '日一二三四五六'
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    mounted() {
        if (this.$route.query.graphid !== undefined) {
            // 编辑时根据id来查询
            this.queryRetentionMap()
        } else {
            // 添加时saveForm参数时间默认7天
            let t = D.getWeekDate()
            // console.log(t)
            this.saveForm.startTime = t[0].replace(/\//g, '')
            this.saveForm.endTime = t[1].replace(/\//g, '')
            // this.editStartBehave = '1#1'
            // this.editSecondBehave = '1#1'
            this.defaultTargetUser = '全部'
            this.editTime = '过去7天'
            this.resetChartsItem()
        }
    },
    methods: {
        // 保存单图
        saveCreGraph(v) {
            this.saveForm.name = v.name
            this.saveForm.comments = v.discreption
            const ok = this.isEmptyParam()
            if (ok) {
                if (this.$route.query.graphid !== undefined) {
                    this.saveForm.id = this.$route.query.graphid
                    this.editGraph()
                } else {
                    // 条件为空重新赋值
                    if (JSON.stringify(this.saveForm.fields) === '[]') {
                        this.saveForm.fields = '[]'
                    }
                    this.saveGraph()
                }
            }
        },
        isEmptyParam() {
            const nonEmptyParamArr = [{
                name: 'name',
                initVal: '',
                msg: '单图名称不能为空'
            }, {
                name: 'firstId',
                initVal: '',
                msg: '请选择起始行为'
            }, {
                name: 'secondId',
                initVal: '',
                msg: '请选择留存行为'
            }, {
                name: 'groupId',
                initVal: '',
                msg: '请选择目标用户'
            }]
            for (let i = 0; i < nonEmptyParamArr.length; i++) {
                let item = nonEmptyParamArr[i]
              if (this.saveForm[item.name] === item.initVal) { // eslint-disable-line
                    this.$message.error({
                        message: item.msg,
                        showClose: true
                    })
                    return false
                }
            }
            return true
        },
        // 确认新增单图
        saveGraph() {
            this.saveForm.appId = this.appId
            this.saveForm.cyclce = this.cycleValue
            Api.graphCreateRetainMap(
                this.saveForm
            ).then((res) => {
                this.$message.success({
                    message: '新建成功',
                    showClose: true
                })
                this.$router.push({path: `/graph/retention`})
            })
        },
        // 确认修改单图
        editGraph() {
            Api.graphUpdateRetainMap(
                this.saveForm
            ).then((res) => {
                this.$message.success({
                    message: '修改成功',
                    showClose: true
                })
                this.$router.push({path: `/graph/retention`})
            })
        },
        // 编辑时根据id来查询
        queryRetentionMap() {
            Api.graphQueryRetainMap({
                id: this.$route.query.graphid
            }).then((res) => {
                /* 编辑时传参到组件 */
                // 单图名称
                this.editTitle.graphName = res.name
                // 单图描述
                this.editTitle.graphDescription = res.comments
                // 起始行为
                this.editStartBehave = res.behavior1
                // 留存行为
                this.editSecondBehave = res.behavior2
                // 目标用户
                this.defaultTargetUser = res.groupName
                // 时间
                this.editTime = `${res.starttime.split(' ')[0].replace(/-/g, '/')}-${res.endtime.split(' ')[0].replace(/-/g, '/')}`
                // 周期
                this.cycleValue = res.cyclce
                // 过滤条件
                this.selectList.conditionType = res.conditionType === 0 ? 'AND' : 'OR'
                if (res.cyclcetime) {
                    this.editTime = `过去${res.cyclcetime}天`
                }
                let selectListArr = []
                res.fields.forEach(res => {
                    let obj = {}
                    obj.fieldId = res.fieldId
                    obj.type = res.type
                    obj.value = res.value
                    selectListArr.push(obj)
                })
                const selectListObj = {
                    'conditionType': res.conditionType === 0 ? 'AND' : 'OR',
                    'allList': selectListArr
                }
                this.selectList = selectListObj

                /* 编辑时初始化传参 */
                // 名称
                this.saveForm.name = res.name
                // 描述
                this.saveForm.comments = res.comments
                // 起始行为ID
                this.saveForm.firstId = res.behavior1
                // 留存行为ID
                this.saveForm.secondId = res.behavior2
                // 时间周期
                this.saveForm.cyclce = res.cyclce
                // 条件判断是and还是or
                this.saveForm.conditionType = res.conditiontype
                // 开始和结束时间
                this.saveForm.startTime = res.starttime.split(' ')[0].replace(/-/g, '')
                this.saveForm.endTime = res.endtime.split(' ')[0].replace(/-/g, '')
                // 计算时间，粒度的 天 周月 是否可选
                let countD = (new Date(res.endtime.replace(/-/g, '/')) - new Date(res.starttime.replace(/-/g, '/'))) / 8.64e7 + 1
                this.cycleValue = res.cyclce
                if (countD >= 14 && countD <= 31) { // 天 周 ，默认天
                    console.log(56665)
                    this.cycleOptions[0]['disabled'] = false
                    this.cycleOptions[1]['disabled'] = false
                    this.cycleOptions[2]['disabled'] = true
                } else if (countD > 31 && countD <= 62) { // 周 默认周
                    this.cycleOptions[0]['disabled'] = true
                    this.cycleOptions[1]['disabled'] = false
                    this.cycleOptions[2]['disabled'] = true
                } else if (countD > 62 && countD <= 90) { //  周  。月 默认周
                    this.cycleOptions[0]['disabled'] = true
                    this.cycleOptions[1]['disabled'] = false
                    this.cycleOptions[2]['disabled'] = false
                } else if (countD > 90) { //  月  默认显示月
                    this.cycleOptions[0]['disabled'] = true
                    this.cycleOptions[1]['disabled'] = true
                    this.cycleOptions[2]['disabled'] = false
                }
                // 过滤条件
                let fieldsLS = []
                res.fields.forEach(item => {
                    let fildObj = {}
                    fildObj.fieldId = item.fieldId
                    fildObj.value = item.value
                    fildObj.type = item.type
                    fieldsLS.push(fildObj)
                })
                this.saveForm.fields = JSON.stringify(fieldsLS)
                // 目标用户ID
                this.saveForm.groupId = res.groupId
                // return this.saveForm
                this.resetChartsItem(this.saveForm) // 编辑的时候重置echarts图
            })
        },
        //  重新设置数据echarts图
        resetChartsItem(resParams = this.saveForm) {
            let startId = resParams.firstId
            if (startId.split('#')[1] === '1') {
                startId = startId.split('#')[0].split('-')[0]
            } else {
                startId = startId.split('#')[0]
            }
            let endId = resParams.secondId
            if (endId.split('#')[1] === '1') {
                endId = endId.split('#')[0].split('-')[0]
            } else {
                endId = endId.split('#')[0]
            }
            let params = {
                startTime: resParams.startTime,
                endTime: resParams.endTime,
                cycle: this.cycleValue,
                cyclceTime: resParams.cyclceTime,
                appId: this.appId,
                groupId: this.saveForm.groupId,
                firstId: startId,
                secondId: endId,
                fields: resParams.fields
            }
            // Api.getActiveUserRetention(params).then(res => {
            Api.graphGetRetainMapIndex(params).then(res => {
                let daysList = []
                let dataList = []
                let info = res.map((item, index) => {
                    let days = ''
                    if (params.cycle === 1) {
                        days = item[1]['startDay'].replace(/-/g, '/').substring(5, 10) + ` 周` + this.weekly[new Date(item[1]['startDay'].replace(/-/g, '/')).getDay()]
                    } else if ((params.cycle === 2 || params.cycle === 3) && item[0]) {
                        days = item[1]['startFirstDay'].replace(/-/g, '/').substring(5, 10) + `~` + item[1]['startEndDay'].replace(/-/g, '/').substring(5, 10)
                    }
                    let countNumber = item[0]['countNum']
                    item.shift(0, 1)
                    let param = {
                        allUser: index === 0 ? '全部访问用户' : days,
                        userNum: countNumber,
                        dataNum: item
                    }
                    return param
                })
                this.tableData = info
                this.changeCycleValue = this.cycleValue // 表格的cyclevalue更换
                res[0].filter((item, k) => {
                    // 分力度，日 周 月三种
                    let days = ''
                    if (params.cycle === 1) {
                        days = k === 0 ? '当日' : k === 1 ? '次日' : `${k}日后`
                    } else if (params.cycle === 2) {
                        days = k === 0 ? '当周' : k === 1 ? '次周' : `${k}周后`
                    } else {
                        days = k === 0 ? '当月' : k === 1 ? '次月' : `${k}月后`
                    }
                    daysList.push(days)
                    dataList.push(parseFloat(item.ratio) / 100)
                })
                this.creEchLdEch('dt1', daysList, dataList)
            })
        },
        // 获取目标用户组件传过来的参数
        getUserValue(v) {
            this.saveForm.groupId = v.id
        },
        // 获取条件组件传过来的参数
        selectBox(item) {
            this.saveForm.conditionType = item.conditionType === 'AND' ? 0 : 1
            let fieldsArr = []
            item.allList.forEach(res => {
                let obj = res
                obj.fieldName = ''
                fieldsArr.push(obj)
            })
            this.saveForm.fields = JSON.stringify(fieldsArr)
            this.resetChartsItem()
        },
        //  获取时间组件传过来得参数
        getDateInfo(vv) {
            this.saveForm.cyclceTime = 0
            if (vv.circleTime) { //  如果为0 则是时间段，否则是 快捷选择
                this.saveForm.cyclceTime = vv.circleTime
            }
            this.saveForm.startTime = vv['startTime']
            this.saveForm.endTime = vv['endTime']
            /*
            *  根据时间来判断 周期的显示
            *  按照天最多30天数据可查
            *  按照周 最多90天数据可查
            *  按照月对多180天数据可查
            * */
            let countDay = Math.abs(vv.countDay)
            //  默认初始化的是1   只能选择天
            this.cycleValue = 1
            this.cycleOptions[0]['disabled'] = false
            this.cycleOptions[1]['disabled'] = true
            this.cycleOptions[2]['disabled'] = true
            if (countDay >= 14 && countDay <= 31) { // 天 周 ，默认天
                this.cycleValue = 1
                this.cycleOptions[0]['disabled'] = false
                this.cycleOptions[1]['disabled'] = false
                this.cycleOptions[2]['disabled'] = true
            } else if (countDay > 31 && countDay <= 62) { // 周 默认周
                this.cycleValue = 2
                this.cycleOptions[0]['disabled'] = true
                this.cycleOptions[1]['disabled'] = false
                this.cycleOptions[2]['disabled'] = true
            } else if (countDay > 62 && countDay <= 90) { //  周  。月 默认周
                this.cycleValue = 2
                this.cycleOptions[0]['disabled'] = true
                this.cycleOptions[1]['disabled'] = false
                this.cycleOptions[2]['disabled'] = false
            } else if (countDay > 90) { //  月  默认显示月
                this.cycleValue = 3
                this.cycleOptions[0]['disabled'] = true
                this.cycleOptions[1]['disabled'] = true
                this.cycleOptions[2]['disabled'] = false
            }
            if (countDay < 180) {
                this.resetChartsItem()
            } else {
                this.$message.error({
                    message: '日期超过上限',
                    showClose: true
                })
            }
        },
        resetCycleValue(res) {
            // 1 2 3
            this.saveForm.cycle = res
            this.resetChartsItem()
        },
        // 获取起始行为
        getFirstBehavValue(v) {
            this.saveForm.firstId = `${v.id}#${v.innerType}`
            this.resetChartsItem()
        },
        // 获取留存行为
        getSecondBehavValue(v) {
            this.saveForm.secondId = `${v.id}#${v.innerType}`
            this.resetChartsItem()
        },
        creEchLdEch(id, daysArr, dataArr) {
            const chart = this.$echarts.init(document.getElementById(id))
            chart.setOption({
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
                    formatter (res) {
                        let items = res[0]
                        let percents = parseFloat((items.value * 100).toFixed(2))
                        return `${items.name}<br/>${items.seriesName}: ${percents}%`
                    }
                },
                legend: {
                    data: ['留存率'],
                    show: false
                },
                grid: {
                    top: 10,
                    bottom: 34
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: daysArr,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontFamily: 'MicrosoftYaHei',
                            color: 'rgba(109,118,132,1)'
                        }
                    },
                    splitLine: {
                        //  改变轴线颜色
                        show: false,
                        lineStyle: {
                            // 使用深浅的间隔色
                            type: 'dotted'
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
                    min: 0,
                    max: 1,
                    interval: 0.2,
                    axisLine: {
                        show: false
                    },
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
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dotted'
                        }
                    }
                },
                series: [{
                    name: '留存率',
                    type: 'line',
                    smooth: true,
                    data: dataArr
                }]
            })
            window.onresize = function() {
                chart.resize()
            }
        }
    }
}
</script>

<style lang="scss">
.cre-retation{
    .el-select-dropdown__item.is-disabled.hover {
        background-color: #FFF;
        color: #c0c4cc;
    }
}
// 下拉选去掉勾
.cre-retation .selected::before {
  display: none
}
.el-scrollbar__wrap {
  margin-bottom: -7px !important;
}
.add-retention-section {
    .bottom-model {
      .left-content {
        border-right: 25px solid #f5f5f5;
      }
      .right-show-char {
        .top-menu {
           .top-date {
             .el-button {
               color: #3392FF;
             }
             position: relative;
             float: left;
           }
           .circle-sel {
              .el-input {
                .el-input__inner, .el-select__caret {
                    color: #3392FF;
                }
                width: 89px;
              }
              input {
                height: 32px;
                line-height: 32px;
              }
             position: relative;
             float: left;
             top: 0;
             left: 10px;
           }
           position: relative;
           padding-left: 30px;
           min-width: 220px;
        }
        .show-char {
            height: 325px;
            margin-top: 74px;
        }
        .cre-detali-chart {
            .tableBox {
              margin: 0 !important;
            }
            left: 0;
            position: absolute;
            padding-top: 25px;
            position: absolute;
            background-color: #f5f5f5;
            margin-bottom: 24px;
            right: 0px;
        }
        flex: 65;
        padding-top: 21px;
        position: relative;
        background-color: #fff;
      }
      margin-top: 30px;
      padding-bottom: 10px;
      display: flex;
   }
}
</style>
