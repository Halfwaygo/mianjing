<template>
    <div class="create-view-cluster">
        <create-garph-menus :editbasedata="userNameObj" :name="titleName" :is-detail="isDetail" @saveCreGraph="saveCreGraph"></create-garph-menus>
        <el-container class="create-container">
            <el-aside class="create-left-condition" width="460px">
                <target-user :name="`1.目标用户`" :event-type="'cluster'" :default-single-choos-value="groupName" @selectUser="selectUser"></target-user>
                <ChannelSource :defaultdata="dimensionIds" :place-string="'维度'" :name="'2.统计维度'" :icon-class="'icon-network'" :source-type="`clusters`" @singleinfo="choseInfo"></ChannelSource>
            </el-aside>
            <el-main class="create-right-condition">
                <div class="charts-item">
                    <div class="title-btn">
                        <date-picker :get-cyclce="defaultTime" class="date" @getDateValue="getDateValue"></date-picker>
                        <el-button :class="{'active' : chartType === 2}" class="switch-pie" @click="siwtchShow(2)">
                            <i class="icon-chart-bar"></i>
                        </el-button>
                        <el-button :class="{'active' : chartType === 1}" class="switch-pie" @click="siwtchShow(1)">
                            <i class="icon-chart-pie"></i>
                        </el-button>
                    </div>
                    <div id="chartsBar" class="echarts-bar"></div>
                </div>
                <div class="table-item-list">
                    <span class="table-title-text">设备品牌明细</span>
                    <table-list :table-data="lists" style="margin-top: 20px">
                        <el-table-column width="30"></el-table-column>
                        <el-table-column
                            :render-header="sortHeader"
                            prop="date"
                            label="设备品牌">
                        </el-table-column>
                        <el-table-column
                            :render-header="sortHeader"
                            prop="name"
                            label="所有用户">
                        </el-table-column>
                        <el-table-column
                            :render-header="sortHeader"
                            width="80"
                            prop="address"
                            label="占比">
                        </el-table-column>
                    </table-list>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapState } from 'vuex'
import CreateGarphMenus from '../creatSingle/CreTopMenu'
import TargetUser from '../TargetUser'
import DatePicker from '../../components/datePicker'
import TableList from '../../components/common/TableList'
import * as C from '../../constants/graphhCluster'
import ChannelSource from '../../components/creatSingle/ChannelSource'
export default {
    name: 'CreateClusterView',
    components: {
        CreateGarphMenus,
        TargetUser,
        TableList,
        DatePicker,
        ChannelSource
    },
    data() {
        return {
            chartLine: null,
            isDetail: this.$route.query.mode && this.$route.query.mode === 'detail',
            titleName: this.$route.query.mode && this.$route.query.mode === 'edit' ? '编辑分群分析' : (this.$route.query.mode && this.$route.query.mode === 'detail' ? '查看分群分析' : '新建分群分析'),
            lists: [ {
                date: '2116-05-04',
                name: '金沙上海市普陀区金沙江路 1517 弄',
                address: '19%'
            }, {
                date: '2016-05-01',
                name: '金上海市普陀区金沙江路 1517 弄沙',
                address: '15%'
            }, {
                date: '2016-05-04',
                name: '金上海市普陀区金沙江路 1517 弄沙',
                address: '10%'
            }, {
                date: '2216-05-01',
                name: '金沙上海市普陀区金沙江路 1517 弄',
                address: '20%'
            }],
            chartType: 1,
            sortUserable: 'sort-desc',
            sortPerable: 'sort-desc',
            sortDeviceable: 'sort-desc',
            sortable: [{}, {sort: 'sort-desc'}, {sort: 'sort-desc'}, {sort: 'sort-desc'}],
            dimensionIds: '',
            groupId: '',
            startTime: '',
            endTime: '',
            id: this.$route.query.editid || '',
            groupName: '',
            defaultTime: '',
            userNameObj: {
                graphName: '',
                graphDescription: ''
            }
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId
        })
    },
    mounted() {
        this.chartLine = this.$echarts.init(document.getElementById('chartsBar'))
        this.chartLine.setOption(C.createClusterList.optionsPie)
        if (this.id) {
            // id存在，为编辑 获取分群分析的信息
            Api.graphQueryGroupMap({id: this.id}).then(res => {
                console.log(res)
                this.groupName = res.groupName
                this.groupId = res.groupId
                this.startTime = res.starttime.substring(0, 10).replace(/-/g, '')
                this.endTime = res.endtime.substring(0, 10).replace(/-/g, '')
                this.defaultTime = res.starttime.substring(0, 10).replace(/-/g, '/') + '-' + res.endtime.substring(0, 10).replace(/-/g, '/')
                this.chartType = res.chartType
                this.siwtchShow(res.chartType)
                this.userNameObj = {
                    graphName: res.name,
                    graphDescription: res.comments
                }
                this.dimensionIds = res.dimensionId
            })
        }
    },
    methods: {
        sortHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable[$index].sort, attrs: {index: $index}, on: {click: this.changeHeaderSort}})])
        },
        changeHeaderSort($events) {
            let currentIndex = $events.target.getAttribute('index')
            this.sortable[currentIndex].sort = this.sortable[currentIndex].sort === 'sort-desc' ? 'sort-asc' : 'sort-desc'
        },
        siwtchShow(type) {
            this.chartLine.clear()
            this.chartType = type
            if (type === 2) {
                this.chartLine.setOption(C.createClusterList.optionsBar)
            } else {
                this.chartLine.setOption(C.createClusterList.optionsPie)
            }
        },
        choseInfo(v) {
            // 选择的维度
            this.dimensionIds = v.id
        },
        selectUser(v) {
            // 选择目标用户
            this.groupId = v.id
            console.log(v)
        },
        getDateValue(v) {
            this.startTime = v[0]
            this.endTime = v[1]
            // 获取时间的
            console.log(v)
        },
        saveCreGraph(v) {
            console.log(v)
            //    保存创建或修改的信息
            let params = {
                appId: this.appId,
                name: v.name,
                chartType: this.chartType,
                comments: v.discreption,
                dimensionIds: this.dimensionIds,
                cyclceTime: 0,
                startTime: this.startTime,
                endTime: this.endTime,
                groupId: this.groupId
            }
            if (this.id) {
                // id 存在为编辑】
                params.id = this.id
                Api.graphUpdateGroupMap(params).then(res => {
                    this.$alerts({
                        type: 'success',
                        content: res.msg
                    })
                    this.$router.push({path: `/graph/cluster`})
                })
            } else {
                // 不存在为新建
                Api.graphCreateGroupMap(params).then(res => {
                    console.log(res)
                    this.$alerts({
                        type: 'success',
                        content: res.msg
                    })
                    this.$router.push({path: `/graph/cluster`})
                })
            }
            console.log(params)
        }
    }
}
</script>

<style scoped lang="scss">
$bg-white: #fff;
$titleColor: #5A6D82;
.create-container{
    min-width: 1000px;
    padding: 16px 0;
    .create-left-condition{
        width: 460px;
        min-height: 100px;
    }
    .create-right-condition{
        padding: 0;
        padding: 14px 25px 14px 20px;
        .charts-item{
            background-color: $bg-white;
            position: relative;
            padding-bottom: 30px;
            .title-btn{
                padding: 20px 20px 0;
                .date{
                    display: inline-block;
                }
                .switch-pie{
                    float: right;
                }
                .switch-pie.el-button{
                     padding: 7px 10px;
                    margin-left: 10px;
                 }
                .icon-chart-bar{
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    background: url("../../layouts/images/icon/icon-chart-bar-gray.png") no-repeat center;
                    background-size: contain;
                }
                .icon-chart-pie{
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    background: url("../../layouts/images/icon/icon-chart-cricle-gray.png") no-repeat center;
                    background-size: contain;
                }
                .active{
                    color: #3392FF;
                    border: 1px solid #3392FF;
                    .icon-chart-bar{
                        background: url("../../layouts/images/icon/icon-chart-bar.png") no-repeat center;
                        background-size: contain;
                    }
                    .icon-chart-pie{
                        background: url("../../layouts/images/icon/icon-chart-cricle.png") no-repeat center;
                        background-size: contain;
                    }
                }
            }
            .echarts-bar{
                height: 320px;
            }
        }
        .table-item-list{
            margin-top: 15px;
            padding: 15px 20px;
            background-color: $bg-white;
            .table-title-text{
                margin-top: 20px;
                color: $titleColor;
                font-size: 14px;
            }
        }
    }
}

</style>
