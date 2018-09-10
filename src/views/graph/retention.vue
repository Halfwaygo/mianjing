<template>
    <div class="cre-retention-section">
        <dynamic-items
            :page-size="10"
            :total="totalListLength"
            :page-no="1"
            @pagination="onPagination">
            <table-list v-show="!isGridShow" :table-data="lists" :is-loading="isLoading">
                <el-table-column
                    width="40">
                </el-table-column>
                <el-table-column
                    label="类型">
                    <template slot-scope="scope">
                        <span>留存分析</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="createUser"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    :render-header="sortTimeHeader"
                    prop="updatetime"
                    label="最后更新时间">
                </el-table-column>
                <el-table-column
                    width="300"
                    align="center"
                    prop="name"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" class="iconI" icon="el-icon-plus " @click="showCreateBoard(scope.row)"></el-button>
                        <el-button type="text" size="small" class="iconI" icon="el-icon-edit-outline" @click="editMode(scope.row.id)" ></el-button>
                        <el-button type="text" size="small" class="iconI" icon="el-icon-delete" @click="deleteChart(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </table-list>

            <div v-show="$parent.isGridShow" class="show-ech">

                <el-row :gutter="24">
                    <el-col v-for="item in lists" :span="12" :key="item.id">
                        <div class="ech-block">
                            <div class="left-tro">
                                <div class="title">
                                    <span >{{ item.name }}</span>
                                </div>
                                <div class="time">{{ formatterDate(item) }}<span>{{ formatterCycleType(item.cyclce) }}</span></div>
                                <div class="user-name">
                                    <div class="start-up"><span>起始行为</span><span class="tro">{{ item.behavior1Name|| '任意行为' }}</span> </div>
                                    <div class="stay-dep"><span>留存行为</span><span class="tro">{{ item.behavior2Name|| '任意行为' }}</span> </div>
                                    <div class="user"><span>目标用户</span><span class="tro">{{ item.groupName }}</span> </div>
                                </div>
                            </div>
                            <div :id="`rid${item.id}`" class="show-ech-r" @click="detailMode(item.id)"></div>
                            <image-presenter :type="item.loadingResultType"></image-presenter>
                            <div class="bott-con">
                                <el-row>
                                    <el-col :span="12">
                                        <div class="left-con">{{ formatterModifyDate(item) }}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="right-con">
                                            <div class="icon-add-gray" @click="showCreateBoard"></div>
                                            <div class="icon-edit-img" @click="editMode(item.id)"></div>
                                            <div class="icon-delete-gray" @click="deleteChart(item.id)"></div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>

                        </div>
                    </el-col>
                </el-row>
            </div>
        </dynamic-items>
        <dialog-add-dash-board :create-dash-board-dialog-visible="createBoardDialog" @closeDialog="closeBoardDialog" @addDashBoard="addDashBoard"></dialog-add-dash-board>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapState, mapActions } from 'vuex'
import DynamicItems from '../../components/common/DynamicItems'
import TableList from '../../components/common/TableList'
import DialogAddDashBoard from '../../components/common/DialogAddDashboard'
import ImagePresenter from '../../components/ImagePresenter'
import createChart from '../../constants/chartOption/eventOption'
import PlatformMixin from '../../mixins/platform'

export default {
    name: 'Retention',
    components: {
        TableList,
        DynamicItems,
        DialogAddDashBoard,
        ImagePresenter
    },
    mixins: [PlatformMixin],
    data() {
        return {
            weekDay: '日一二三四五六',
            isLoading: true,
            searchName: '',
            isGridShow: this.$parent.isGridShow,
            createBoardDialog: false,
            initChart: [],
            lists: [],
            totalListLength: 0,
            clickAddBoard: {}, //  点击添加到看板的对象
            sortable: 'sort-desc'
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        }),
        GridHistory() {
            return this.$parent.isGridShow
        }
    },
    watch: {
        GridHistory(newVal, oldVal) {
            this.isGridShow = newVal
            if (newVal === true) {
                window.setTimeout(() => {
                    this.initChart.forEach(res => {
                        res.resize()
                    })
                }, 0)
            }
        },
        searchName(newVal, oldVal) {
            this.getSingleMap(1)
        }
    },
    mounted() {
        // this.echArr.forEach(res => {
        // this.creEchLdEch(res.id, res.daysArr, res.dataArr)
        // })
        this.showPageLoading()
        // 获取单图列表
        this.getSingleMap(1)
    },
    methods: {
        getSingleMap(pageNo) {
            // loading初始化
            this.isLoading = true
            Api.graphGetRetainMapList({
                appId: this.appId,
                pageNo,
                name: this.searchName,
                pageSize: 10
            }).then(res => {
                // 关闭loading
                this.hidePageLoading()
                // let retentionItemList = res.datas || []
                this.isLoading = false
                // this.lists = res.datas
                this.totalListLength = res.count
                this.lists = res.datas || []
                this.lists.map((item, index) => {
                    this.graphQueryRetainMapAction({id: item.id}).then(result => { // 单图详情接口
                        result.name = item.name
                        result.createTime = item.createtime
                        result.createUser = item.createUser
                        result.id = item.id
                        result.firstId = item.behavior1
                        result.secondId = item.behavior2
                        result.cycle = item.cyclce
                        result.startTime = result.starttime.split(' ')[0].replace(/-/g, '')
                        result.endTime = result.endtime.split(' ')[0].replace(/-/g, '')
                        result.appId = result.appid
                        result.groupId = result.groupId
                        result.conditionType = item.conditiontype
                        // result.conditiontype = item.conditiontype
                        item = Object.assign(item, result)
                        this.lists[index] = item
                        return result
                    }).then(resultList => {
                        // 接口详情 处理fields
                        resultList.fields = resultList.fields.map(item => {
                            let params = {
                                fieldId: item.fieldId,
                                fieldName: item.fieldName,
                                type: item.type,
                                value: item.value
                            }
                            return params
                        })
                        let startId = resultList.behavior1
                        if (startId.split('#')[1] === '1') {
                            startId = startId.split('#')[0].split('-')[0]
                        } else {
                            startId = startId.split('#')[0]
                        }
                        let endId = resultList.behavior2
                        if (endId.split('#')[1] === '1') {
                            endId = endId.split('#')[0].split('-')[0]
                        } else {
                            endId = endId.split('#')[0]
                        }
                        let mapIndex = {
                            appId: resultList.appid,
                            firstId: startId,
                            secondId: endId,
                            cycle: resultList.cyclce,
                            startTime: resultList.starttime.split(' ')[0].replace(/-/g, ''),
                            endTime: resultList.endtime.split(' ')[0].replace(/-/g, ''),
                            conditionType: resultList.conditiontype,
                            groupId: resultList.groupId, // result.groupId, 目标用户暂时不用，分群分析处理好之后添加，
                            fields: JSON.stringify(resultList.fields)
                        }
                        // this.getActiveUserRetentionAction(resultList).then(detail => { // 本地留存数据接口
                        let charts = this.$echarts.init(document.getElementById(`rid${resultList.id}`))
                        charts.showLoading({
                            text: '正在加载',
                            color: '#409EFF'
                        })
                        Api.graphGetRetainMapIndex(mapIndex).then(detail => { // 配置数据接口
                            let daysList = []
                            let dataList = []
                            detail[0].shift(0, 1)
                            detail[0].filter((item, k) => {
                                let days = ''
                                if (resultList.cyclce === 1) {
                                    days = k === 0 ? '当日' : k === 1 ? '次日' : `${k}日后`
                                } else if (resultList.cyclce === 2) {
                                    days = k === 0 ? '当周' : k === 1 ? '次周' : `${k}周后`
                                } else {
                                    days = k === 0 ? '当月' : k === 1 ? '次月' : `${k}月后`
                                }
                                daysList.push(days)
                                dataList.push(parseFloat(item.ratio) / 100)
                            })
                            this.creEchLdEch(charts, daysList, dataList)
                        }).catch(() => {
                            charts.hideLoading()
                            charts.dispose()
                            this.markLoadingFailed(this.lists[index])
                        })
                    })
                })
            }).catch(() => {
                this.isLoading = false
                this.hidePageLoading()
            })
        },
        // 搜索的单图名称或创建人
        searchFilter(res) {
            this.searchName = res
        },
        addDashBoard(v) {
            let addArr = []
            let addObj = {
                id: this.clickAddBoard.id,
                type: 1,
                name: this.clickAddBoard.name
            }
            addArr.push(addObj)
            Api.addSingleMap({
                appId: this.appId,
                boardId: v,
                data: JSON.stringify(addArr)
            }).then(res => {
                this.$message.success({
                    message: '添加到看板成功',
                    showClose: true
                })
            }).catch(res => {
                this.$message.error({
                    message: '添加到看板失败',
                    showClose: true
                })
            })
        },
        onPagination(v) {
            // console.log(JSON.stringify(v))
            this.getSingleMap(v)
        },
        sortTimeHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable, on: {click: this.changeSort}})])
        },
        changeSort() {
            this.sortable = this.sortable === 'sort-desc' ? 'sort-asc' : 'sort-desc'
            let reverseList = JSON.parse(JSON.stringify(this.lists.reverse()))
            this.lists = reverseList
        },
        editMode(id) {
            // this.$router.push({path: `/graph/new?mode=edit&type=graphRetention`})
            if (typeof (id) === 'string') {
                this.$router.push({path: `/graph/new?mode=edit&type=graphRetention&graphid=${id}`})
            } else {
                this.$router.push({path: `/graph/new?mode=edit&type=graphRetention&graphid=7d3d9d44472d4ed2b9a7098aa79de60a`})
            }
        },
        deleteChart(id) {
            this.$confirm('此操作会导致该单图从看板中移除。删除后不可恢复，是否确定删除？', '删除单图', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.graphDelRetainMap({
                    id
                }).then((res) => {
                    this.lists = []
                    this.getSingleMap(1)
                })
            }).catch(() => {
            })
        },
        detailMode(id) {
            this.$router.push({path: `/graph/new?mode=detail&type=graphRetention&graphid=${id}`})
        },
        deleChart(id) {
            this.$confirm('此操作会导致该单图从看板中移除。删除后不可恢复，是否确定删除？', '删除单图', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                let index = 0
                for (let i = 0; i < this.chartsData.length; i++) {
                    if (this.chartsData[i].id === id) {
                        index = i + 1
                        break
                    }
                }
                if (index > 0) {
                    this.chartsData.splice(index - 1, 1)
                }
                this.$nextTick(() => {
                    this.chartsData.forEach(res => {
                        this.defaultCharts(res)
                    })
                })
                this.$alerts({
                    type: 'success',
                    content: '删除看板成功'
                })
            }).catch(() => {
                this.$alerts({
                    type: 'fail',
                    content: '取消删除看板'
                })
            })
        },
        showCreateBoard(item) {
            this.clickAddBoard = item
            this.createBoardDialog = true
        },
        closeBoardDialog() {
            this.createBoardDialog = false
        },
        creEchLdEch(chart, daylist, datalist) {
            // const chart = this.$echarts.init(document.getElementById(`rid${id}`))
            this.initChart.push(chart)
            chart.options = createChart.retentionChartOption
            chart.options.xAxis.data = daylist
            chart.options.series[0].data = datalist
            chart.setOption(chart.options)
            chart.hideLoading()
            window.onresize = function() {
                chart.resize()
            }
        },
        formatterDate(item) {
            let start = item.starttime.split(' ')[0].replace(/-/g, '/')
            let end = item.endtime.split(' ')[0].replace(/-/g, '/')
            return `${start}-${end}`
        },
        formatterCycleType(index) {
            let params = {1: '日留存', 2: '周留存', 3: '月留存'}
            return params[index]
        },
        formatterModifyDate(item) {
            return `${item.createUser}修改于${item.updatetime.substring(0, 10)}`
        },

        ...mapActions(['graphQueryRetainMapAction', 'getActiveUserRetentionAction', 'showPageLoading', 'hidePageLoading'])
    }

}
</script>

<style lang="scss">
.cre-retention-section {
  .show-ech {
      .ech-block {
          .left-tro {
            .title {
              font-size: 14px;
              color: #5A6D82;
            }
            .item {
                opacity: 0.7;
                font-size:14px;
            }
            .time {
                span {
                    margin-left: 10px;
                }
                opacity: 0.7;
                font-size:12px;
                color: #8b99a7;
            }
            .user-name {
                .start-up, .stay-dep, .user {
                    .tro {
                        display: inline-block;
                        height: 22px;
                        line-height: 22px;
                        margin: 3px;
                        background-color: #F0F0F0;
                        border-radius: 2px;
                        padding-left: 5px;
                        padding-right: 5px;
                    }
                  margin-right: 24px;
                  display: inline-block;
                }
                opacity: 0.7;
                margin-top: 10px;
                font-size:12px;
            }
            padding-left: 20px;
          }
          .show-ech-r {
            position: absolute;
            width: 100%;
            margin-top: 20px;
            height: 210px;
          }
          .bott-con {
              .left-con {
                opacity: 0.5;
                font-size: 12px;
                padding-left: 20px;
              }
              .right-con {
                div {
                    margin-right: 30px;
                }
                padding-top: 4px;
                text-align: right;
              }
              position: absolute;
              border-top: 1px solid #E3EAF0;
              width: 100%;
              bottom: 0;
              height: 40px;
              line-height: 40px;
          }
          position: relative;
          height: 380px;
          color: #5A6D82;
          background-color: #fff;
          padding-top: 20px;
          margin-bottom: 25px;
          box-shadow: 1px 0px 4px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
      }
    min-width: 900px;
  }
  margin-top: 25px;
}
</style>
