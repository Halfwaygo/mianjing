<template>
    <div class="add-funels-section">
        <loading-indicator :showing="pageLoading"></loading-indicator>
        <top-menu :editbasedata="editTitle" :name="titlename" :is-detail="this.$route.query.mode === 'detail'" @saveCreGraph="saveCreGraph"></top-menu>
        <div class="bottom-model">
            <div :style="confirmSelStepOption.length === 0 ? 'background-color:#f5f5f5' : ''" class="left-content">
                <div id="leftProhibited"></div>
                <div class="sel-step">
                    <div id="funels" class="title" >
                        1.选择漏斗步骤
                    </div>
                    <div class="sel-step-body">
                        <div class="sel-input" @click="showSelectStep">
                            + 选择漏斗步骤
                        </div>
                        <!-- 弹出层 -->
                        <div v-show="isShowLd" class="dialog">
                            <div class="left-dialog">
                                <div class="search-h">
                                    <el-input
                                        v-model="serchInput"
                                        placeholder="请输入内容"
                                        prefix-icon="el-icon-search"
                                    >
                                    </el-input>
                                </div>

                                <div class="dia-menu">
                                    <el-select v-model="platSelValue" placeholder="请选择" class="plat-option">
                                        <el-option
                                            v-for="item in platOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="typeSelValue" placeholder="请选择" class="type-option">
                                        <el-option
                                            v-for="item in typeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>

                                <div :class="'not-show'?drraggleArr.length != 10:''" class="xz-person">
                                    <div v-for="(item,index) in xzOptions" :class="{'is-checked': filterChected(item.id,item.innerType)}" :key="index" class="xz-h" @click="changeXz(item.id, index, item.innerType)" >
                                        <img v-show="filterChected(item.id, item.innerType)" src="../../layouts/images/icon/icon-check.png" >
                                        <span class="zb-title">
                                            {{ filterName(item.name, item.isPage,item.innerType, item.isComplex, item.type) }}
                                            <span class="platform-class">{{ filterType(item.type) }}</span>
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div class="right-dialog">
                                <div class="right-dialog-top">
                                    <div class="right-dialog-top-left">漏斗步骤 <span>{{ drraggleArr.length }}/10</span></div>
                                    <div class="right-dialog-top-right">转化率: <span>{{ (changeRate*100).toFixed(1) + '%' }}</span></div>
                                </div>
                                <draggable v-model="drraggleArr" class="right-dialog-center">
                                    <transition-group>
                                        <div v-for="(item,index) in drraggleArr" :key="index" class="h-ddraggle">
                                            <span class="index">{{ index + 1 }}</span>
                                            <span class="h-draggle-content">
                                                {{ filterName(item.name, item.isPage,item.innerType, item.isComplex) }}
                                                <span class="platform-class">{{ filterType(item.type) }}</span>
                                            </span>
                                            <i class="el-icon-close" @click="changeRightclick(item.id, item.innerType)"></i>
                                        </div>
                                    </transition-group>
                                </draggable>
                                <div class="right-dialog-bottom">
                                    <div class="contro">
                                        <div class="cancel" @click="isShowLd = false">取消</div>
                                        <div class="confirm" @click="confirmStep">确定</div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <draggable v-model="confirmSelStepOption">
                            <transition-group>
                                <div v-for="(item,index) in confirmSelStepOption" :key="index" class="step-brow">

                                    <div class="brow-main">
                                        <span class="step-num">
                                            {{ index + 1 }}
                                        </span>
                                        <div v-show="item.enable === 1" class="uv-dk">
                                            {{ filterName(item.name, item.isPage,item.innerType, item.isComplex) }}
                                            <span class="platform-class">{{ filterType(item.type) }}</span>
                                        </div>
                                        <div v-show="item.enable === 0" class="uv-del">
                                            该指标已于{{ item.updateTime }}删除
                                        </div>
                                        <i class="el-icon-close" @click="delSelectStep(item)"></i>
                                    </div>
                                    <!-- <div v-for="(f, index) in item.filter" v-show="item.filter.length !== 0" :key="index" class="click-dk">
                                        <div>
                                            {{ f.name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ f.condition }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ f.value }}
                                        </div>

                                    </div> -->
                                </div>

                            </transition-group>
                        </draggable>
                    </div>
                </div>

                <div v-show="confirmSelStepOption.length !== 0">
                    <target-user :default-single-choos-value="defaultTargetUser" :event-type="'funnel'" :name="'2. 目标用户'" @selectUser = "selectUser"></target-user>

                    <div class="filter-con">
                        <filter-creat-step :name="'3. 过滤条件'" :selected-list-info="selectList" @selects="selectBoxMain"></filter-creat-step>
                    </div>
                </div>
            </div>

            <div :style="confirmSelStepOption.length === 0 ? 'background-color:#f5f5f5' : ''" class="right-show-char">
                <!-- 没有数据的时候 -->
                <!-- <div v-show="confirmSelStepOption.length === 0" class="not-data">
                    <span>
                        <div class="no-data-stone-png"></div>
                        <div class="tro">一个石头都没有</div>
                    </span>
                </div> -->
                <no-data-stone v-show="confirmSelStepOption.length === 0"></no-data-stone>

                <div v-show="confirmSelStepOption.length !== 0" class="top-menu">
                    <div class="top-date">
                        <date-picker :get-cyclce="editTime" @getDateValue="getDateInfo"></date-picker>
                    </div>
                    <div class="top-tro">转化周期</div>
                    <div class="circle-sel">
                        <el-select v-model="cycleValue" placeholder="请选择" size="small">
                            <el-option
                                v-for="item in cycleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div v-show="showDataCharts && confirmSelStepOption.length !== 0" class="show-zh">
                    <div class="show-title">
                        <div class="show-title-num">{{ (dataStepsTotal.rate*100).toFixed(1) + '%' }}</div>
                        <div class="show-f-title">总转化率</div>
                    </div>
                    <div class="show-content">
                        <div v-for="(item, index) in dataStepsArr" :key="index" class="show-data-zu">
                            <div class="show-zu-block">
                                <div v-show="index !== 0" class="show-zu-block-bottom">
                                    <div class="left">
                                        <div class="dashed">

                                        </div>
                                    </div>
                                    <!-- <div class="dashed"></div> -->
                                    <div class="right">
                                        <div class="y-y">
                                            <div class="left-y"></div>
                                            <div class="right-y"></div>
                                        </div>
                                        <div class="num">
                                            {{ (item.rate*100).toFixed(1) + '%' }}
                                        </div>
                                        <div class="dashed">

                                        </div>
                                    </div>
                                </div>

                                <div class="show-zu-block-top">
                                    <div class="left-title">
                                        <div class="left-title-tro">
                                            {{ item.name }}
                                            <span class="platform-class">{{ item.platform }}</span>
                                            &nbsp;&nbsp;</div>
                                        <div class="bottom-num">
                                            {{ item.out }}&nbsp;&nbsp;
                                        </div>
                                    </div>
                                    <div class="right-bar">
                                        <div :style="filterPerCentAge(item.rate)" class="right-bar-block"></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>

</template>

<script>
import { mapState } from 'vuex'
import Api from '../../utils/api.js'
import draggable from 'vuedraggable'
import TargetUser from '../TargetUser.vue'
import TopMenu from '../../components/creatSingle/CreTopMenu.vue'
import FilterCreatStep from '../creatSingle/FilterCreat.vue' // eslint-disable-line
import DatePicker from '../../components/datePicker.vue'
import LoadingIndicator from '../../components/LoadingIndicator' // loading加载
import NoDataStone from '../../components/NoData' // 无数据

export default {
    name: 'AddModel',
    components: {
        TargetUser,
        FilterCreatStep,
        DatePicker,
        draggable,
        TopMenu,
        LoadingIndicator,
        NoDataStone
    },
    data() {
        return {
            titlename: this.$route.query.mode === 'edit' ? '编辑漏斗分析' : this.$route.query.mode === 'detail' ? '查看漏斗分析' : '新建漏斗分析',
            pageLoading: true,
            showDataCharts: false, // 数据加载完毕显示图表
            editTitle: {
                graphName: '',
                graphDescription: ''
            }, // 单图的名称和描述
            editTime: '', // 修改时时间传值
            defaultTargetUser: '', // 默认得目标用户
            cycleValue: '1', // 转化周期
            serchInput: '', // 搜索值
            isShowLd: false, // 是否显示漏斗
            ptName: '全部平台', // 平台名称
            typeName: '全部类型', // 类型名称
            checkedArr: [], // 被选中id的集合
            clickStep: 0, // 选中的第几步来过滤
            propFilterItem: [], // 过滤的条件
            platSelValue: '100', // 平台
            typeSelValue: '100', // 类型
            seleTime: [], // 选择查询得时间
            selectList: {}, // 过条件传值
            initOptions: [], // 漏斗步骤初始化
            xzOptions: [], // 筛选后的漏斗步骤列表
            confirmSelStepOption: [], // 已确定步骤对象
            drraggleArr: [], // 已选择还未确定步骤对象
            cycleOptions: [{
                label: 1,
                value: 1
            },
            {
                label: 7,
                value: 7

            },
            {
                label: 30,
                value: 30
            }], // 转化周期1到90天
            changeRate: 0,
            platOptions: [{ // 平台的类型
                value: '100',
                label: '全部平台'
            }, {
                value: '1',
                label: 'Android'
            }, {
                value: '2',
                label: 'Ios'
            }, {
                value: '3',
                label: 'web'
            }, {
                value: '4',
                label: '自定义'
            }],
            typeOptions: [{
                value: '100',
                label: '全部类型'
            }, {
                value: '{"isPage": 0,"innerType": 1}',
                label: '元素浏览'
            }, {
                value: '{"isPage": 0,"innerType": 2}',
                label: '元素点击'
            }, {
                'value': '{"isPage": 1,"innerType": 1}',
                'label': '页面浏览'
            }],
            saveForm: { // 保存和编辑时的漏斗参数
                appId: '',
                name: '',
                comments: '',
                indexs: [],
                cyclce: 1,
                conditionType: 0,
                startTime: '',
                endTime: '',
                cyclceTime: 1,
                fields: '[]',
                groupId: 0
            },
            chartsArr: [{
                name: '元素浏览 | 首页1',
                num: '50%'
            },
            {
                name: '元素浏览 | 首页2',
                num: '90%'
            }],
            // dataStepObj: {
            //     stepsData: [],
            //     totalData: {}
            // },
            dataStepsArr: [],
            dataStepsTotal: {}
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    watch: {
        // 选择步骤筛选平台
        platSelValue(newVal, oldVal) {
            this.conditionData()
        },
        // 选择步骤筛选类型
        typeSelValue(newVal, oldVal) {
            this.conditionData()
        },
        // 搜索步骤
        serchInput(newVal, oldVal) {
            this.conditionData()
        },
        // 监听confirmSelStepOption，获取最新顺序
        confirmSelStepOption(newVal, oldVal) {
            this.defaultTargetUser = '全部用户'
            this.stepOrder()
        },
        cycleValue(newval, oldVal) {
            this.saveForm.cyclce = newval
            this.getGraphGetFunnelMapIndex()
        },
        drraggleArr() {
            this.getChangeRte()
        }
    },
    mounted() {
        // this.getGraphGetFunnelMapIndex()

        this.getFunnelStep()
        // this.setCycleValue()
        if (this.$route.query.graphid !== undefined) {
            this.queryFunnelMap()
        }
    },
    methods: {
        // 在选择漏斗的时候显示转化率
        getChangeRte() {
            let zds = ['startTime', 'endTime', 'cyclce', 'cyclceTime', 'conditionType', 'groupId', 'groupName', 'fields', 'indexs']
            let param = {
                appId: this.appId,
                type: 2,
                name: 'mr'
            }
            zds.forEach(zd => {
                param[zd] = this.saveForm[zd]
            })
            let indexsArr = []
            this.drraggleArr.forEach((item, index) => {
                let obj = {}
                obj.selectId = item.id
                // obj.selectName = item.name
                obj.innerType = item.innerType
                obj.orderNum = index + 1
                indexsArr.push(obj)
            })
            param.indexs = JSON.stringify(indexsArr)
            // 步骤为空返回
            if (param.indexs === '[]') {
                this.changeRate = 0
                return
            }
            Api.graphGetFunnelMapIndex(param).then(res => {
                this.changeRate = res.totalData.rate
            })
        },
        // 获取相关条件过滤后的数据
        getGraphGetFunnelMapIndex() {
            let zds = ['startTime', 'endTime', 'cyclce', 'cyclceTime', 'conditionType', 'groupId', 'groupName', 'fields', 'indexs']
            let param = {
                appId: this.appId,
                type: 2,
                name: 'mr'
            }
            zds.forEach(zd => {
                param[zd] = this.saveForm[zd]
            })
            if (param.indexs === '[]') {
                return
            }
            Api.graphGetFunnelMapIndex(param).then(res => {
                // 步骤置为空
                this.dataStepsArr = []
                // 初始化
                this.showDataCharts = true
                // 总数据
                this.dataStepsTotal = res.totalData
                // 步骤数据
                const { stepsData } = res
                let im = 0
                for (var name in stepsData) {
                    let inData = stepsData[name].in
                    let {out, rate, platform} = stepsData[name]
                    let obj = {inData, out, rate, name, platform}
                    this.dataStepsArr.push(obj)
                    this.$set(this.dataStepsArr, im, obj)
                    im++
                }
            })
        },
        filterName(name, isPage, innerType, isComplex, type) {
            if (isPage === 0 && isComplex !== 4) {
                if (innerType === 1) {
                    return `元素浏览 | ${name}`
                } else if (innerType === 2) {
                    return `元素点击 | ${name}`
                }
            } else if (isPage === 1 && isComplex !== 4) {
                return `页面浏览 | ${name}`
            }
            return name
        },
        filterType(type) {
            return type === 1 ? 'android' : type === 2 ? 'ios' : 'all'
        },
        // 筛选后的数据
        conditionData() {
            this.xzOptions = []
            const platSelValue = this.platSelValue
            const typeSelValue = JSON.parse(this.typeSelValue)
            this.initOptions.forEach((item, index) => {
                if (item.name.indexOf(this.serchInput) !== -1) {
                    if (parseInt(platSelValue) === parseInt(item.type) || this.platSelValue === '100') {
                        if ((parseInt(typeSelValue.isPage) === parseInt(item.isPage) && parseInt(typeSelValue.innerType) === parseInt(item.innerType)) || this.typeSelValue === '100') {
                            this.xzOptions.push(item)
                        }
                    }
                }
            })
        },
        // 步骤顺序排序
        stepOrder() {
            let indexsArr = []
            this.confirmSelStepOption.forEach((item, index) => {
                let obj = {}
                obj.selectId = item.id
                // obj.selectName = item.name
                obj.innerType = item.innerType
                obj.orderNum = index + 1
                indexsArr.push(obj)
            })
            this.saveForm.indexs = JSON.stringify(indexsArr)
            // 获取数据
            this.getGraphGetFunnelMapIndex()
        },
        // 生成转化周期
        setCycleValue() {
            for (let i = 1; i <= 90; i++) {
                let obj = {
                    label: i,
                    value: i
                }
                this.cycleOptions.push(obj)
            }
        },
        // 根据id查询具体指标
        queryFunnelMap() {
            Api.graphQueryFunnelMap({
                id: this.$route.query.graphid
            }).then((res) => {
                /* 将获取的值传给组件 */
                // 单图名称
                this.editTitle.graphName = res.name
                // 单图描述
                this.editTitle.graphDescription = res.comments
                // 时间传值给组件
                let { cyclcetime } = res
                if (cyclcetime > 0) {
                    this.editTime = cyclcetime === 1 ? '昨日' : `过去${cyclcetime}天`
                } else {
                    this.editTime = `${res.starttime.split(' ')[0].replace(/-/g, '/')}-${res.endtime.split(' ')[0].replace(/-/g, '/')}`
                }
                // 漏斗步骤
                res.indexs.forEach(item => {
                    if (item.enable === 0) {
                        document.getElementById('leftProhibited').style.display = 'block'
                    }
                    this.confirmSelStepOption.push({
                        'name': item.name,
                        'id': item.id,
                        'isPage': item.isPage,
                        'innerType': item.innerType,
                        'isComplex': item.isComplex,
                        'enable': item.enable,
                        'updateTime': item.updateTime,
                        'type': item.type
                    })
                })
                // 目标用户
                // this.defaultTargetUser = res.groupName
                this.defaultTargetUser = '全部用户'
                // 时间周期
                this.cycleValue = res.cyclce
                // 过滤条件
                this.selectList.conditionType = res.conditionType === 0 ? 'AND' : 'OR'
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

                /* 将参数传给saveForm */
                // 目标用户
                this.saveForm.groupId = res.groupId
                // 时间周期
                this.saveForm.cyclce = this.cycleValue
                this.saveForm.cyclceTime = res.cyclcetime
                // 开始和结束时间
                this.saveForm.startTime = res.starttime.split(' ')[0].replace(/-/g, '')
                this.saveForm.endTime = res.endtime.split(' ')[0].replace(/-/g, '')
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
                this.saveForm.conditionType = res.conditionType === 'AND' ? '0' : '1'
                // 漏斗步骤
                this.stepOrder()
                // 查询数据
            })
        },
        // 查询总共步骤数
        getFunnelStep() {
            Api.graphGetFunnelIndexList({
                appId: this.appId,
                id: '',
                isPage: 0,
                type: 0
            }).then((res) => {
                this.pageLoading = false // 关闭loading
                // 拼接任意行为
                let ryBavaor = [{
                    name: '任意行为',
                    innerType: 12,
                    id: '1',
                    isPage: 0,
                    enable: 1,
                    isComplex: 4
                }]
                this.xzOptions = this.initOptions = JSON.parse(JSON.stringify(ryBavaor.concat(res.data1)))
            })
        },
        // 新增单图
        saveCreGraph(v) {
            // 保存值
            this.saveForm.appId = this.appId
            // 单图名称
            this.saveForm.name = v.name
            // 单图描述
            this.saveForm.comments = v.discreption
            // 判断是否为空
            const ok = this.isEmptyParam()
            if (ok) {
                if (this.$route.query.graphid !== undefined) {
                    // 单图id
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
                name: 'indexs',
                initVal: 0,
                msg: '请选择漏斗步骤'
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
            Api.createSinggleMap(
                this.saveForm
            ).then((res) => {
                this.$message.success({
                    message: '新建成功',
                    showClose: true
                })
                this.$router.go(-1)
            })
        },
        // 确认修改单图
        editGraph() {
            Api.graphUpdateFunnelMap(
                this.saveForm
            ).then((res) => {
                this.$message.success({
                    message: '修改成功',
                    showClose: true
                })
                this.$router.go(-1)
            })
        },
        // 显示漏斗步骤窗口
        showSelectStep() {
            // 漏斗展示
            this.isShowLd = !this.isShowLd
            // 情况选中的id
            this.checkedArr = []
            this.drraggleArr = JSON.parse(JSON.stringify(this.confirmSelStepOption))
            this.confirmSelStepOption.forEach((item, index) => {
                this.checkedArr.push({
                    'id': item.id,
                    'innerType': item.innerType
                })
            })
        },
        // 确定选中的步数
        confirmStep() {
            this.isShowLd = false
            this.confirmSelStepOption = JSON.parse(JSON.stringify(this.drraggleArr))
            let indexsArr = []
            this.confirmSelStepOption.forEach((item, index) => {
                let indexs = {}
                indexs.selectId = item.id
                indexs.selectName = item.name
                indexs.orderNum = index + 1
                indexsArr.push(indexs)
            })
            this.saveForm.indexs = JSON.stringify(indexsArr)
        },
        // 过滤条件值
        selectBoxMain(item) {
            this.saveForm.conditionType = item.conditionType === 'AND' ? 0 : 1
            let fieldsArr = []
            item.allList.forEach(res => {
                let obj = res
                fieldsArr.push(obj)
            })
            this.saveForm.fields = JSON.stringify(fieldsArr)
            if (item.allList.length === 0) {
                this.getGraphGetFunnelMapIndex()
                return
            }
            if (item.allList[0].value !== '') {
                this.getGraphGetFunnelMapIndex()
            }
        },
        // 选择的目标用户
        selectUser(v) {
            this.getGraphGetFunnelMapIndex()
            this.saveForm.groupId = v.id
        },
        // 选中的时间
        getDateInfo(vv) {
            // console.log(vv)
            // this.seleTime = vv
            if (vv.circleTime > 0) {
                this.saveForm.cyclceTime = vv.circleTime
                this.saveForm.startTime = ''
                this.saveForm.endTime = ''
            } else {
                this.saveForm.cyclceTime = 0
                this.saveForm.startTime = vv.startTime
                this.saveForm.endTime = vv.endTime
            }
            this.getGraphGetFunnelMapIndex()
        },
        // 选择步骤触发事件
        changeXz(id, index, innerType) {
            let indexNum = -1
            // 判断是否已经选中
            this.checkedArr.forEach((item, index) => {
                if (item.id === id && item.innerType === innerType) {
                    indexNum = index
                }
            })
            let obj = {
                'name': this.xzOptions[index].name,
                'id': this.xzOptions[index].id,
                'isPage': this.xzOptions[index].isPage,
                'innerType': this.xzOptions[index].innerType,
                'isComplex': this.xzOptions[index].isComplex,
                'enable': this.xzOptions[index].enable,
                'updateTime': this.xzOptions[index].updateTime,
                'type': this.xzOptions[index].type
            }
            let indexD = -1
            this.drraggleArr.forEach((element, index) => {
                if (element.id === obj.id) {
                    indexD = index
                }
            })
            if (indexNum === -1) {
                if (this.drraggleArr.length === 10) {
                    return
                }
                this.checkedArr.push({
                    'id': id,
                    'innerType': innerType
                })
                this.drraggleArr.push(obj)
            } else {
                this.checkedArr.splice(indexNum, 1)
                this.drraggleArr.splice(indexD, 1)
            }
        },
        changeRightclick(id, innerType) {
            let indexN = -1
            this.drraggleArr.forEach((res, index) => {
                if (res.id === id && res.innerType === innerType) {
                    indexN = index
                }
            })
            this.drraggleArr.splice(indexN, 1)
            // 删除选中的id数组
            // let indexc = this.checkedArr.indexOf(id)
            // this.checkedArr.splice(indexc, 1)
            let indexc = -1
            // 判断是否已经选中
            this.checkedArr.forEach((item, index) => {
                if (item.id === id && item.innerType === innerType) {
                    indexc = index
                }
            })
            this.checkedArr.splice(indexc, 1)
            // 删除得时候刷新
            this.getGraphGetFunnelMapIndex()
        },
        // 删除步骤
        delSelectStep(item) {
            this.checkedArr = []
            let indexD = -1
            this.confirmSelStepOption.forEach((element, index) => {
                if (element.id === item.id) {
                    indexD = index
                }
            })
            this.confirmSelStepOption.splice(indexD, 1)
        },
        filterChected(id, innerType) {
            let isChecked = false
            this.checkedArr.forEach(item => {
                if (item.id === id && item.innerType === innerType) {
                    isChecked = true
                }
            })
            return isChecked
        },
        // 图表百分比
        filterPerCentAge(num) {
            num = num * 100
            return `width:${num}%`
        }
    }
}
</script>

<style lang="scss">
  // 解决下来选下面阴影问题
  .el-scrollbar__wrap {
    margin-bottom: -7px !important;
   }
  .cre-funels-proper  {
       .filterHead {
           display: none;
       }
       .filterTypeBox {
         border: 0 !important;
         box-shadow: 0 0 0px red !important;
       }

        .contro {
            @mixin pubmixin() {
                display: inline-block;
                cursor: pointer;
                text-align: center;
                width: 100px;
                height: 32px;
                line-height: 32px;
                font-size: 14px;

            }
            .cancel {
                @include pubmixin;
                background-color: #fff;
                color: #5A6D82;
                border: 1px solid #E6E7ED;
            }
            .confirm {
                @include pubmixin;
                background-color: #3392FF;
                color: #fff;
            }
            float: right;
            width: 210px;
        }

       background: #F9FAFC;
   }
   .hide-funels-proper {
       display: none
   }
  .add-funels-section {
    .platform-class {
        opacity: 0.5;
    }
    .bottom-model {
      margin-top: 30px;
      padding-bottom: 10px;
      display: flex;
      .left-content {
        height: 478px;
        border-right: 25px solid #f5f5f5;
        position: relative;
        #leftProhibited {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 100;
            display: none
        }
        .sel-step {
           .title {
               height: 36px;
               line-height: 36px;
               padding-left: 15px;
               border-bottom: 1px solid #C2D3E0;
               color: #5A6D82;
           }
           .sel-step-body {
             @mixin pub-input() {
               cursor: pointer;
               text-align: center;
               color: #6D7684;
               background:rgba(255,255,255,1);
               border-radius: 2px;
               margin-left: 33px;
               width: 378px;
               min-height: 32px;
               line-height: 32px;
               border: 1px solid #C2D3E0;
             }
             @mixin pub-step-num {
                display: inline-block;
                background-color: #74BB5C;
                color: #fff;
                text-align: center;
                height: 16px;
                line-height: 16px;
                width: 16px;
                border-radius: 50%;
             }
             .sel-input {
               @include pub-input;
             }
             //  弹出层
             .dialog {
                 .left-dialog {
                     .search-h {
                         .el-input__icon {
                           line-height: 32px;
                         }
                         .el-input__prefix {
                           left: 308px !important;
                         }
                         .el-input {
                             width: 337px;
                             margin-left: 20px;
                         }
                         .el-input__inner {
                           height: 32px;
                           line-height: 32px;
                         }
                         .el-submenu {
                             width: 114px;
                         }
                         input {
                             height: 32px;
                         }
                         margin-top: 15px;
                         height: 32px;
                     }
                     .dia-menu {
                         .el-input__inner {
                           color: #3392FF;
                           height: 32px;
                           line-height: 32px;
                         }
                         .plat-option {
                           display: inline-block;
                           width: 226px;
                           .el-input {
                             font-size: 12px;
                           }
                         }
                         .type-option {
                           display: inline-block;
                           width: 100px;
                           margin-left: 7px;
                           .el-input {
                             font-size: 12px;
                           }
                         }
                       padding-left: 20px;
                       margin-top: 10px;
                       height: 42px;
                     }
                     .xz-person {
                        .xz-h{
                          img {
                            position: absolute;
                            width: 12px;
                            height: 8px;
                            top: 10px;
                            left: 22px;
                          }
                          .zb-title {
                                width: 314px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                display: inline-block;
                          }
                          position: relative;
                          font-size: 12px;
                          padding-left: 38px;
                          height: 30px;
                          line-height: 30px;
                        }
                        .xz-h:hover{
                          background-color: #f5f7fa;
                        }
                        .is-checked{
                          cursor: pointer;
                          background-color: #3392FF !important;
                          color: #fff;
                        }
                        .is-checked:after{
                          position: absolute;
                          right: 10px;
                          font-family: element-icons;
                          content: "\E611";
                          font-size: 12px;
                          font-weight: 700;
                          -webkit-font-smoothing: antialiased;
                          color: #409eff;
                        }
                        position: relative;
                        height: 242px;
                        overflow: auto;
                     }
                     width: 358px;
                 }
                 .right-dialog {
                     .right-dialog-top {
                        .right-dialog-top-left {
                          flex: 1;
                        }
                        .right-dialog-top-right {
                          span {
                              color:#F35974;
                          }
                          flex: 1;
                          text-align: right;
                        }
                        display: flex;
                        padding-left: 12px;
                        font-size: 12px;
                        margin-top: 24px;
                        padding-right: 10px;
                     }
                     .right-dialog-center {
                        .h-ddraggle {
                            .h-draggle-content {
                                text-overflow: ellipsis;
                                overflow: hidden;
                                display: inline-block;
                                width: 238px;
                                white-space: nowrap;
                            }
                           .index {
                                float: left;
                                width: 16px;
                                height: 16px;
                                background-color: #74BB5C;
                                font-size: 12px;
                                color: #fff;
                                border-radius: 8px;
                                line-height: 16px;
                                text-align: center;
                                margin-right: 10px;
                            }
                            .el-icon-close {
                                    position: absolute;
                                    display: none;
                                    right: 10px;
                                    top: 8px;
                            }
                            .el-icon-close {
                                cursor: pointer;
                            }
                            position: relative;
                            padding-top: 5px;
                            height: 30px;
                            padding-left: 12px;
                         }
                         .h-ddraggle:hover .index {
                             visibility: hidden;
                         }
                         .h-ddraggle:hover .el-icon-close {
                             display: block;
                         }
                         font-size: 12px;
                         height: 252px;
                         overflow: auto;
                         padding-top: 10px;
                     }
                     .right-dialog-bottom {
                       .contro {
                           @mixin pubmixin() {
                                display: inline-block;
                                cursor: pointer;
                                text-align: center;
                                width: 100px;
                                height: 32px;
                                line-height: 32px;
                                font-size: 14px;

                            }
                           .cancel {
                               @include pubmixin;
                                background-color: #fff;
                                color: #5A6D82;
                                border: 1px solid #E6E7ED;
                           }
                           .confirm {
                                @include pubmixin;
                                background-color: #3392FF;
                                color: #fff;
                           }
                            float: right;
                            width: 210px;
                       }
                       position: absolute;
                       width: 100%;
                       bottom: 10px;
                     }
                     .h-ddraggle:hover {
                       border: 1px solid #E6E7ED;
                       cursor: move;
                     }
                     position: relative;
                     flex: 1;

                 }
                 position: absolute;
                 display: flex;
                 z-index: 3;
                 background-color: #fff;
                 border: 1px solid #E6E7ED;
                 margin-left: 33px;
                 margin-top: 5px;
                 width: 648px;
                 height: 360px;
             }
             .step-brow {
                .brow-main {
                    .step-num {
                        @include pub-step-num;
                    }
                    .uv-dk {
                    display: inline;
                    }
                    .uv-del {
                        display: inline;
                        color: #f66254;
                    }
                    margin-left: 33px;
                    width: 378px;
                    margin-top: 10px;
                    font-size: 12px;
                    height: 32px;
                    line-height: 32px;
                    cursor: move;
                }
                .brow-main:hover {
                    background-color: #fff;
                    border: 1px solid #C2D3E0;
                }
                .jh-btn {
                    span {
                      position: absolute;
                      left: 0px;
                      top: 0px;
                    }
                    position: absolute;
                    z-index: 2;
                    opacity: 0;
                    right: 5px;
                    width: 15px;
                    height: 15px;
                    cursor: pointer;
                    margin-top: 3px;
                }
                img {
                    z-index: 1;
                    position: absolute;
                    right: 10px;
                    width: 15px;
                    margin-top: 3px;
                }
                .el-icon-close {
                    position: absolute;
                    cursor: pointer;
                    display: none;
                    right: 20px;
                    top: 10px;
                }
                position: relative;
             }
             .step-brow:hover .el-icon-close {
               display: block;
             }
             .step-brow:hover .step-num {
               visibility: hidden;
             }
             .click-dk {
                @include pub-input;
                margin-top: 8px;
             }
             padding-top: 14px;
             padding-bottom: 10px;
           }
           background-color: #F9FAFC;
           border: 1px solid #E5E5E5;
           box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
           width: 460px;
        }

        .filter-con {
          height: 200px;
          margin-top: 10px;
        }
      }
      .right-show-char {
        // .not-data {
        //     width: 100%;
        //     height: 100%;
        //     display: table;
        //     text-align: center;
        //     span {
        //         vertical-align: middle;
        //         display: table-cell;
        //         .no-data-stone-png {
        //             margin: 0 auto;
        //              width: 129px;
        //              height: 121px;
        //              background-image: url('../images/icon/stone.png') ; background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
        //         }
        //         .tro {
        //           color: #9A9A9A;
        //           font-size: 16px;
        //         }
        //     }
        // }
        .top-menu {
           .top-date {
             .el-button {
               color: #3392FF;
             }
             display: inline-block;
           }
           .top-tro {
             display: inline-block;
             color: #3392FF;
             margin-left: 20px;
           }
           .circle-sel {
              .el-input {
                .el-input__inner, .el-select__caret {
                    color: #3392FF;
                }
                width: 89px;
              }
             display: inline-block;
             margin-left: 3px;
           }
           height: 35px;
           min-width: 220px;
        }
        .show-zh {
          height: 110px;
          .show-title {
            .show-title-num {
              font-size: 30px;
              color: #F35974;
            }
            .show-f-title {
              font-size: 14px;
              color: #6D7684;
            }
            text-align: center;
          }
          .show-content {
              margin-top: 42px;
            .show-data-zu {
                .show-zu-block {
                .show-zu-block-top {
                    display: flex;
                    min-height: 40px;
                    margin-top: 12px;
                    .left-title {
                        .left-title-tro {
                        color: #6D7684;
                        font-size: 12px;
                        }
                        .bottom-num {
                        font-size: 18px;
                        color: #F5A61D;
                        }
                        flex: 4;
                        text-align: right;
                        margin-right: 4px;
                        min-height: 40px;
                        min-width: 84px;
                    }
                    .right-bar {
                        .right-bar-block {
                            height: 24px;
                            background-color: #74BB5C;
                        }
                        flex: 8;
                        padding-right: 60px;
                        text-align: left;
                        height: 40px;
                        width: 573px;
                    }
                }
                .show-zu-block-bottom {
                    .left {
                        .dashed {
                            height: 20px;
                            border-bottom: 1px dashed #DDDDDD;
                        }
                        flex: 2;
                        padding-left: 20px;
                    }
                    .right {
                        flex: 8;
                        .y-y {
                            @mixin pub-y() {
                                display: inline-block;
                                width: 35px;
                                height: 38px;
                            }
                        .left-y {
                            @include pub-y;
                            background:linear-gradient(10deg, transparent 7px, #EEF3FA 0);
                        }
                        .right-y {
                            @include pub-y;
                            margin-left: -5px;
                            background:linear-gradient(350deg, transparent 7px, #EEF3FA 0);
                        }
                        position: absolute;
                        width: 70px;
                        height: 42px;
                        }
                        .num {
                            position: absolute;
                            font-size:18px;
                            width: 70px;
                            height: 40px;
                            line-height: 40px;
                            text-align: center;
                            color: #6D7684;
                        }
                        .dashed {
                            height: 20px;
                            border-bottom: 1px dashed #DDDDDD;
                        }
                        position: relative;
                        padding-right: 80px;
                    }
                    display: flex;
                    background-color: #fff;
                    height: 38px;
                }
                margin-top: 12px;
              }
            }
          }
        }
        flex: 65;
        padding-top: 21px;
        padding-left: 30px;
        background-color: #fff;
      }
    }
  }
</style>
