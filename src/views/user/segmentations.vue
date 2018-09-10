<template>
    <div class="segmentations-section">
        <div class="segHeadBox">
            <div class="search-btn">
                <el-input v-model="searchModel" placeholder="搜索分群名称或创建人" size="small" class="input-with-select">
                    <el-button slot="append" type="primary" icon="icon-search" @click="searchFilter"></el-button>
                </el-input>
            </div>
            <router-link :to="creatUrl" class="createNew">
                <el-button type="primary" icon="el-icon-plus" size="mini">创建分群</el-button>
            </router-link>
        </div>
        <div class="tableBox">
            <dynamic-items
                :page-size="pageSize"
                :total="allCount"
                :page-no="pageNo"
                @sizeChange="onPageSizeChange"
                @pagination="onPagination">
                <table-list
                    :table-data="chartsData" :is-loading="isLoading">
                    <el-table-column
                        width="40">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="分群名称">
                    </el-table-column>
                    <el-table-column
                        prop="userNum"
                        label="分群人数">
                    </el-table-column>
                    <el-table-column
                        prop="calculateTime"
                        label="最近计算时间">
                    </el-table-column>
                    <el-table-column
                        prop="createUser"
                        label="创建人">
                    </el-table-column>
                    <el-table-column
                        prop="updateTime"
                        label="最后更新时间">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="300"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="iconI" icon="el-icon-edit-outline" @click="editData(scope.row.id)" ></el-button>
                            <el-button type="text" size="small" class="iconI" icon="el-icon-delete" @click="deledata(scope.row.id)"></el-button>
                        </template>
                    </el-table-column>
                </table-list>
            </dynamic-items>
        </div>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapState } from 'vuex'
import WaterMark from '../../mixins/watermark'
import TableList from '../../components/common/TableList'
import DynamicItems from '../../components/common/DynamicItems'
export default {
    name: 'Segmentations',
    components: {
        DynamicItems,
        TableList
    },
    mixins: [WaterMark],
    data() {
        return {
            pageSize: 10,
            allCount: 10,
            pageNo: 1,
            searchModel: '',
            chartsData: [],
            isLoading: true,
            creatUrl: '/creatSegmentations',
            allChartData: [],
            searchChartData: []
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    beforeMount() {
        this.waterMk()
    },
    mounted() {
        this.getLIstInfo()
    },
    methods: {
        getLIstInfo() {
            Api.getUserGroupList({ appId: this.appId }).then(res => {
                console.log(res)
                this.isLoading = false
                this.allChartData = res.datas
                this.allCount = res.datas.length
                this.searchFilter()
            })
        },
        searchFilter() {
            this.pageNo = 1
            let filterList = this.allChartData
            let filterData = this.searchModel === '' ? filterList : filterList.filter(item => item.name.indexOf(this.searchModel) >= 0 || item.createUser.indexOf(this.searchModel) >= 0)
            this.searchChartData = filterData
            this.allCount = filterData.length
            this.pageInit()
        },
        onPageSizeChange(num) {
            console.log(num)
        },
        onPagination(num) {
            // 分页
            this.pageNo = num
            this.pageInit()
        },
        pageInit() {
            this.chartsData = this.searchChartData.slice((parseInt(this.pageNo) - 1) * this.pageSize, parseInt(this.pageNo) * this.pageSize)
        },
        editData(id) {
            this.$router.push({path: `/creatSegmentations`, query: {id: id}})
        },
        deledata(id) {
            this.$confirm('是否删除用户分群。删除后不可恢复，是否确定删除？', '删除看板', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.deleteUserGroupInfo({id}).then(res => {
                    console.log(res)
                    this.$alerts({
                        type: 'success',
                        content: res.msg
                    })
                    this.getLIstInfo()
                })
            }).catch(() => {
            })
        }
    }
}
</script>

<style lang="scss">
    @import "../../layouts/css/index";
    $inputBorder: #3392FF;
    .segHeadBox{
        text-align: right;
        padding: 30px 25px 0;
        .search-btn{
            width: 210px;
            display: inline-block;
        }
        .createNew{
            margin-left: 18px;
        }
    }
    .tableBox{
        padding: 0 25px;
    }
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
</style>
