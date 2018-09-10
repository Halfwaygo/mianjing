<template>
    <div class="cre-funels-section">
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
                        <div>漏斗分析</div>
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

            <div v-show="isGridShow" class="show-ech" >
                <el-row :gutter="24">
                    <el-col v-for="ech in echArr" :span="12" :key="ech.id">
                        <div class="ech-block">
                            <el-row>
                                <el-col :span="12">
                                    <div class="left-tro">
                                        <div class="title">
                                            <span >{{ ech.title }}</span>
                                        </div>
                                        <!-- <div class="time">{{ ech.starttime }}-{{ ech.endtime }}</div> -->
                                        <div class="time">{{ ech.starttime == ech.endtime ? ech.starttime : ech.starttime +'-'+ ech.endtime }}</div>
                                        <div class="user-name">目标用户:{{ ech.groupName }}</div>
                                    </div>
                                </el-col>
                                <el-col :span="11">

                                    <el-row class="right-tro">
                                        <el-col :span="8">
                                            <div class="num">{{ ech.in || 0 }}</div>
                                            <div class="num-tro">第一步人数</div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="num">{{ ech.out || 0 }}</div>
                                            <div class="num-tro">最后一步人数</div>
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="num">{{ typeof(ech.rate) === 'number' ? ((ech.rate*100).toFixed(1) + '%') : '0%' }}</div>
                                            <div class="num-tro">转化率</div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <div :id="ech.id" class="show-ech-r" @click="detailMode(ech.id)"></div>
                            <image-presenter :type="ech.loadingResultType"></image-presenter>
                            <div class="bott-con">
                                <el-row>
                                    <el-col :span="12">
                                        <div class="left-con">
                                            {{ ech.createUser }}修改于 {{ ech.updatetime }}
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="right-con">
                                            <div class="icon-add-gray" @click="showCreateBoard(ech.id)"></div>
                                            <div class="icon-edit-img" @click="editMode(ech.id)"></div>
                                            <div class="icon-delete-gray" @click="deleteChart(ech.id)"></div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>

                </el-row>
            <!-- <div v-for="(ech, index) in echArr" :key="index" class="ech-block" >

            </div> -->
            </div>
        </dynamic-items>
        <dialog-add-dash-board :create-dash-board-dialog-visible="createBoardDialog" @closeDialog="closeBoardDialog" @addDashBoard="addDashBoard"></dialog-add-dash-board>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapActions, mapState } from 'vuex'
import TableList from '../../components/common/TableList'
import DynamicItems from '../../components/common/DynamicItems'
import DialogAddDashBoard from '../../components/common/DialogAddDashboard'
import ImagePresenter from '../../components/ImagePresenter'
import createChart from '../../constants/chartOption/eventOption'
import platformMixin from '../../mixins/platform'

export default {
    name: 'Funels',
    components: {
        TableList,
        DynamicItems,
        DialogAddDashBoard,
        ImagePresenter
    },
    mixins: [platformMixin],
    data() {
        return {
            isLoading: true,
            isGridShow: this.$parent.isGridShow,
            initChart: [],
            createBoardDialog: false,
            lists: [],
            searchName: '',
            sortDate: false,
            totalListLength: 0,
            echArr: [],
            clickAddBoard: {},
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
        },
        sortDate(newVal, oldVal) {
            this.getSingleMap(1)
        }
    },
    mounted() {
        this.loadLdEch()
        // 获取单图列表
        this.getSingleMap(1)
        // 自适应echarts
        window.onresize = () => {
            this.initChart.forEach(item => {
                item.resize()
            })
        }
    },
    methods: {
        // 获取增加的单图
        getSingleMap(pageNo) {
            // loading初始化
            this.showPageLoading()
            this.isLoading = true
            Api.graphGetFunnelMapList({
                appId: this.appId,
                pageNo,
                name: this.searchName,
                pageSize: 10
            }).then(res => {
                this.echArr = []
                // 关闭loading
                this.hidePageLoading()
                this.isLoading = false
                this.lists = res.datas
                this.totalListLength = res.count
                res.datas.forEach((item, index) => {
                    let obj = {}
                    obj.title = item.name
                    obj.updatetime = item.updatetime.split(' ')[0].replace(/-/g, '/')
                    obj.id = item.id
                    obj.createUser = item.createUser
                    obj.groupName = item.groupName
                    this.echArr[index] = obj
                    this.querySingleFunnelMap(index, item.id)
                })
            }).catch(() => {
                this.hidePageLoading()
                this.isLoading = false
            })
        },
        querySingleFunnelMap(index, id) {
            Api.graphQueryFunnelMap({
                id
            }).then((res) => {
                let obj = {}
                let id = res.id
                obj.name = 'mr'
                obj.appId = this.appId
                obj.type = 1
                obj.startTime = res.starttime.split(' ')[0].replace(/-/g, '')
                obj.endTime = res.endtime.split(' ')[0].replace(/-/g, '')
                obj.cyclceTime = res.cyclcetime
                obj.cyclce = res.cyclce
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
                // 设置目标用户
                this.echArr[index].groupName = res.groupName
                // 开始时间
                this.echArr[index].starttime = res.starttime.split(' ')[0].replace(/-/g, '/')
                // 结束时间
                this.echArr[index].endtime = res.endtime.split(' ')[0].replace(/-/g, '/')
                this.$set(this.echArr, index, this.echArr[index])
                this.getSingleMapDetails(id, index, obj)
            })
        },
        getSingleMapDetails(id, dex, param) {
            let chart = this.$echarts.init(document.getElementById(id))
            chart.showLoading({
                text: '正在加载',
                color: '#409EFF'
            })
            Api.graphGetFunnelMapIndex(param).then(res => {
                let daysArr = []
                let rateArr = []
                for (let item in res.daysData) {
                    let {rate, out} = res.daysData[item]
                    let t = new Date(parseInt(item))
                    let day = `${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                    daysArr.push(day)
                    rateArr.push({'name': out, 'value': rate.toFixed(3)})
                }
                ['in', 'out', 'rate'].forEach(item => {
                    this.echArr[dex][item] = res.totalData[item]
                    this.$set(this.echArr[dex], dex, this.echArr[dex])
                })
                this.creEchLdEch(chart, daysArr, rateArr)
            }).catch(() => {
                chart.hideLoading()
                this.markLoadingFailed(this.echArr[dex])
                chart.dispose()
            })
        },
        onPagination(v) {
            this.getSingleMap(v)
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
        deleteChart(id) {
            this.$confirm('此操作会导致该单图从看板中移除。删除后不可恢复，是否确定删除?', '删除单图', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.graphDelFunnelMap({
                    id
                }).then((res) => {
                    this.getSingleMap(1)
                })
            }).catch(() => {
            })
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
            if (typeof (id) === 'string') {
                this.$router.push({path: `/graph/new?mode=edit&type=graphFunnels&graphid=${id}`})
            } else {
                this.$router.push({path: `/graph/new?mode=edit&type=graphFunnels&graphid=7d3d9d44472d4ed2b9a7098aa79de60a`})
            }
        },
        detailMode(id) {
            this.$router.push({path: `/graph/new?mode=detail&type=graphFunnels&graphid=${id}`})
        },
        showCreateBoard(item) {
            this.clickAddBoard = item
            this.createBoardDialog = true
        },
        loadLdEch() {
            // this.echArr.forEach(res => {
            //     this.creEchLdEch(res.id, res.daysArr, res.dataArr)
            // })
        },
        closeBoardDialog() {
            this.createBoardDialog = false
        },
        creEchLdEch(chart, daysArr, dataArr) {
            this.initChart.push(chart)
            createChart.funnelsOption.xAxis.data = daysArr
            createChart.funnelsOption.series[0].data = dataArr
            chart.setOption(createChart.funnelsOption)
            chart.hideLoading()
        },
        ...mapActions(['showPageLoading', 'hidePageLoading'])
    }

}
</script>

<style lang="scss">
.cre-funels-section {
  .show-ech {
      .ech-block {
          .left-tro {
            .title {
                font-size: 14px;
            }
            .item {
                font-size:14px;
            }
            .time {
                opacity: 0.7;
                font-size:12px;
                color: #8b99a7;
            }
            .user-name {
                opacity: 0.7;
                margin-top: 3px;
                font-size:12px;
            }

            padding-left: 20px;
          }
          .right-tro {
              .num {
                font-size: 14px;
              }
              .num-tro {
                font-size: 12px;
              }
              opacity: 0.7;
              text-align: center;
          }
          .show-ech-r {
            position: absolute;
            width: 100%;
            height: 210px;
            margin-top: 40px;
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
          margin-top: 25px;
          box-shadow: 1px 0px 4px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
      }
    min-width: 900px;
  }
}
</style>
