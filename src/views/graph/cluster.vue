<template>
    <div class="cluster-section-group">
        <dynamic-items
            :page-size="pageSize"
            :total="totalNum"
            :page-no="pageNo"
            @sizeChange="onPageSizeChange"
            @pagination="onPagination">
            <table-list v-show="!$parent.isGridShow" :is-loading="isLoading" :table-data="clusterLists">
                <el-table-column
                    width="40">
                </el-table-column>
                <el-table-column
                    label="类型">
                    <template slot-scope="scope">
                        <span>分群分析</span>
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
                    prop="updateTime"
                    label="最后更新时间">
                </el-table-column>
                <el-table-column
                    width="300"
                    align="center"
                    prop="name"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" class="iconI" icon="el-icon-plus " @click="showCreateBoard"></el-button>
                        <el-button type="text" size="small" class="iconI" icon="el-icon-edit-outline" @click="editDa(scope.row.id)" ></el-button>
                        <el-button type="text" size="small" class="iconI" icon="el-icon-delete" @click="deleteChart(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </table-list>
            <el-row>
                <div v-for="(cluster, index) in clusterLists" v-show="$parent.isGridShow" :key="cluster.id" :class="(index+1)%2 ? 'item-left': 'item-right'"
                     class="cluster-group-item">
                    <div class="cluster-item-list">
                        <el-container direction="vertical">
                            <div class="icon-header title-header">
                                <span class="header-title-text">{{ cluster.name }}</span>
                                <div class="header-title-date">2018/03/04-2018/04/12</div>
                                <div class="header-selection">
                                    <span class="hd-dimension">维度</span>
                                    <span class="hd-selection-dimension">设备品牌</span>
                                    <span class="hd-user-group">目标用户</span>
                                    <span class="hd-selection-user-group">用户分群名称</span>
                                </div>
                            </div>
                            <div :id="cluster.id" class="icon-main charts-main" @click="detail(index)"></div>
                            <image-presenter :type="cluster.loadingResultType"></image-presenter>
                            <div class="icon-footer icon-edit">
                                <div class="modify-info">{{ cluster.createUser }}修改于{{ cluster.updateTime || cluster.createTime }}</div>
                                <div class="edit-btn">
                                    <i class="icon-add-gray" @click="showCreateBoard"></i>
                                    <i class="icon-edit-img" @click="editDa(cluster.id)"></i>
                                    <i class="icon-delete-gray" @click="deleteChart(cluster.id)"></i>
                                </div>
                            </div>
                        </el-container>
                    </div>
                </div>
            </el-row>
        </dynamic-items>
        <dialog-add-dash-board :create-dash-board-dialog-visible="createBoardDialog" @closeDialog="closeBoardDialog"></dialog-add-dash-board>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import * as C from '../../constants/graphhCluster'
import DialogAddDashBoard from '../../components/common/DialogAddDashboard'
import DynamicItems from '../../components/common/DynamicItems'
import ImagePresenter from '../../components/ImagePresenter'
import TableList from '../../components/common/TableList'
import platformMixin from '../../mixins/platform'
import {mapActions, mapState} from 'vuex' //eslint-disable-line

export default {
    name: 'Cluster',
    components: {
        DialogAddDashBoard,
        DynamicItems,
        TableList,
        ImagePresenter
    },
    mixins: [platformMixin],
    data() {
        return {
            insertValue: '',
            selectValue: '3',
            itemPos: true,
            createBoardDialog: false,
            sortable: 'sort-desc',
            clusterLists: [],
            pageNo: 1,
            searchName: '',
            pageSize: 10,
            totalNum: 0,
            isLoading: true
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId
        }),
        isShowGrid () {
            return this.$parent.isGridShow
        }
    },
    watch: {
        isShowGrid(val) {
            if (val) {
                setTimeout(() => {
                    this.clusterLists.forEach(res => {
                        res.chart.resize()
                    })
                }, 300)
            }
        }
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.clusterLists.forEach(res => {
        //         res.chart = this.$echarts.init(document.getElementById(`mainId${res.id}`))
        //         res.chart.setOption(C.clusterList.optionInfo)
        //     })
        // })
        this.getClusterMapList()
    },
    methods: {
        getClusterMapList() {
            this.isLoading = true // loading初始化
            let params = {
                appId: this.appId,
                pageNo: this.pageNo,
                name: this.searchName,
                pageSize: this.pageSize
            }
            Api.graphGetGroupMap(params).then(res => {
                this.isLoading = false // loading关闭
                this.totalNum = res.count
                this.clusterLists = res.datas
                res.datas.forEach((item, index) => {
                    item.createTime = item.createTime ? item.createTime.substring(0, 10) : ''
                    item.updateTime = item.updateTime ? item.updateTime.substring(0, 10) : ''
                    console.log(C.clusterList.optionInfo)
                    Api.graphQueryGroupMap({id: item.id}).then(data => {
                        const chart = item.chart = this.$echarts.init(document.getElementById(item.id))
                        chart.showLoading({
                            text: '正在加载',
                            color: '#409EFF'
                        })
                        const startTime = data.starttime.substring(0, 10).replace(/-/g, '/')
                        const endTime = data.endtime.substring(0, 10).replace(/-/g, '/')
                        const {
                            id,
                            cycleTime,
                            type,
                            groupId,
                            dimensionId: field,
                            dimensionName: fieldName
                        } = data
                        item.date = `${startTime}-${endTime}`
                        const params = {
                            id,
                            type,
                            groupId,
                            cycleTime,
                            startTime,
                            endTime,
                            field,
                            fieldName
                        }
                        Api.graphGetGroupMapIndex(params).then(chartData => {
                            chart.hideLoading()
                            console.log(chartData)
                        }).catch(() => {
                            chart.hideLoading()
                            chart.dispose()
                            this.markLoadingFailed(this.clusterLists[index])
                        })
                    })
                })
            })
        },
        searchFilter(n) {
            // 搜索名称
            this.searchName = n
            this.getClusterMapList()
        },
        sortTimeHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable, on: {click: this.changeSort}})])
        },
        changeSort() {
            this.sortable = this.sortable === 'sort-desc' ? 'sort-asc' : 'sort-desc'
        },
        deleteChart(id) {
            this.$confirm('此操作会导致该单图从看板中移除。删除后不可恢复，是否确定删除？', '删除单图', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.graphDelGroupMap({id: id}).then(res => {
                    this.$alerts({
                        type: 'success',
                        content: '删除成功'
                    })
                    this.getClusterMapList()
                })
            }).catch(() => {
            })
        },
        showCreateBoard() {
            this.createBoardDialog = true
        },
        closeBoardDialog() {
            this.createBoardDialog = false
        },
        onPageSizeChange() {
            // 翻页
        },
        onPagination(v) {
            this.pageNo = v
            this.getClusterMapList()
        },
        editDa(id) {
            this.$router.push({path: `/graph/new?mode=edit&type=graphCluster&editid=${id}`})
        },
        detail(id) {
            this.$router.push({path: `/graph/new?mode=detail&type=graphChannel&editid=${id}`})
        }
    }
}
</script>

<style lang="scss">
$color-white: #FFF;
$titleColor: #5A6D82;
$titleBgColor:#F0F0F0;
$editBtnColor: #748496;
.cluster-section-group {
    min-width: 1000px;
    width: 100%;
    display: inline-table;
    .cluster-group-item {
        width: 50%;
        display: inline-block;
        float: left;
        margin-top: 25px;
        &.item-left {
            font-size: 14px;
            .cluster-item-list {
                margin-right: 13px;
                height: 466px;
                background-color: $color-white;
            }
        }
        &.item-right {
            .cluster-item-list {
                margin-left: 13px;
                height: 466px;
                background-color: $color-white;
            }
        }
        .cluster-item-list {
            height: 466px;
            border-radius: 3px;
            box-shadow: 1px 0px 4px rgba(0, 0, 0, 0.1);
            position: relative;
            color: $titleColor;
            .icon-header {
                height: 90px;
                padding: 20px;
                .header-title-text {
                    font-size: 14px;
                }
                .header-title-date {
                    font-size: 12px;
                    opacity: 0.7;
                    filter: Alpha(70);
                    margin: 0 0 10px;
                    color: #8b99a7;
                }
                .header-selection {
                    font-size: 12px;
                    opacity: 0.7;
                    filter: Alpha(70);
                    .hd-dimension {
                    }
                    .hd-selection-dimension {
                        border-radius: 2px;
                        background-color: $titleBgColor;
                        padding: 2px 4px;
                    }
                    .hd-user-group {
                        margin-left: 48px;
                    }
                    .hd-selection-user-group {
                        border-radius: 2px;
                        background-color: $titleBgColor;
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
                padding: 0 20px;
                .modify-info {
                    display: inline-block;
                    color: #5A6D82;
                    font-size: 14px;
                }
                .edit-btn {
                    display: inline-block;
                    float: right;
                    position: relative;
                    top: 5px;
                    i {
                        color: $editBtnColor;
                        margin-left: 30px;
                        font-size: 18px;
                    }
                }
            }
            .icon-main {
                padding: 0 20px;
                margin-top: 15px;
                color: #333;
                text-align: center;
                height: 320px;
            }
        }
    }
}
</style>
