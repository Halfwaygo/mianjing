<template>
        <div class="banner" style="overflow-y:scroll;">
            <div>
            <div>
                <el-button v-if="bannerTableData.length === 6" class="add-banner" :disabled="true" type="primary" size="small">添加banner</el-button>
                <el-button v-else class="add-banner" @click="addBanner" type="primary" size="small">添加banner</el-button>
            </div>
                <el-table :data="bannerTableData" @sort-change="handleSortChange" style='width:98%;margin:0 20px;' ref='table' >
                    <el-table-column label="banner图片"  prop="scope.$index.bannerPic" >
                        <template scope="scope"><!-- scope.$index.bannerPic -->
                            <img :src="scope.row.bannerPicIp +''+scope.row.bannerPic" style="width: 120px;height: 80px;margin-top: 6px;"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="对应课程" prop="courseName">
                    </el-table-column>
                    <el-table-column label="创建人" prop="adminName">
                    </el-table-column>
                    <el-table-column label="最后编辑时间" prop="bannerCreateTime">
                    </el-table-column>

                    <el-table-column
                      label="操作"
                      min-width='115'>
                      <template  scope="scope">
                          <el-button @click.native.prevent="seeRow(scope.$index,bannerTableData)" type="handle check" size="small" title="查看" ></el-button>
                          <el-button @click.native.prevent="editRow(scope.$index,bannerTableData)" type="handle edit" size="small" title="编辑" ></el-button>
                          <el-button @click="delBanner(scope.$index,bannerTableData)" type="handle delete" size="small" title="删除"></el-button>
                          <img v-if = "scope.row == bannerTableData[0]" class = "disable-Img"  src="../layouts/images/1topdisable.png" height="26" width="17" title="上移"/>
                          <img v-else @click = "orderBanner(scope.$index,bannerTableData,1)" src="../layouts/images/1top.png" height="26" width="17" title="上移"/>
                          <!--<img v-else class = "disable-Img"  src="../layouts/images/1topdisable.png" height="26" width="17" title="上移"/>-->
                          <img v-if = "scope.row == bannerTableData[bannerTableData.length - 1]" class = "disable-Img"  src="../layouts/images/1bottomdisable.png" height="26" width="17" title="下移"/>
                          <img v-else @click = "orderBanner(scope.$index,bannerTableData,2)" src="../layouts/images/1bottom.png" height="26" width="17" title="下移"/>
                      </template>
                    </el-table-column>
                </el-table>

            </div>
            <add-banner-model @reFreshBanner="refreshPage" v-model="isAddModalVisible" :isAddSeeDel="isAddSeeDel"  :rowData="rowData" :addtitle="bannerTitle"></add-banner-model>

           <!--<div class="pagination-wrap">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="pageNo"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
                </el-pagination>
            </div>-->
        </div>

</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import * as C from '../constants/api';
    import * as CONST from "../constants/const";
    import utils from  '../utils/misc';
    import pageHeader from '../components/pageHeader';
    import addBannerModel from  '../components/addBannerModel';
    // import editBannerModel from '../components/editBannerModel';
    import addBannerDetailModel from  '../components/addBannerDetailModel';
    import Api from "../utils/api"
    import addEvent from  '../mixins/addEvent';
    import className from  '../mixins/className';



    export default {
        name: 'banner',

        mixins: [addEvent,className],

        components: {
            pageHeader,
            addBannerModel,
            // editBannerModel,
            addBannerDetailModel
        },

        data(){
            return {
                bannerTitle: '添加banner',
                propertyLabels: [
                    {key: 'bannerPic', name: 'banner图片', },
                    {key: 'courseName', name: '对应课程', sortable: true},
                    {key: 'adminName', name: '创建人' , sortable: true},
                    {key: 'bannerCreateTime', name: '最后编辑时间', sortable: true},
                    {key: 'appid', name: '操作', goDetail:true},
                ],
               pageSize: 10,
                pageNo: 1,
                totalCount: 0,
                rowData:{
                },
                isAddSeeDel:"1",
                isAddModalVisible:false,
                isAddDetailModalVisible:false,
                // editBannerModelVisible:false,
                sortPropName:"",
                sortType:"",
                kind : parseInt(sessionStorage.getItem('kind') ),
                bannerTableData: [],
                bannerId:'',

                total: {
                    type: Number,
                    default: 0
                },


            }
        },

        watch: {

        },

        beforeMount() {

            this.refreshPage();
        },
        created () {

        },

        mounted() {

        },

        computed:{
            totals() {
                return this.source.length||0;
            },
            searchBindBannerParam(){
                return {
                    currentPage: this.pageNo,
                    pageSize: this.pageSize,
                    kind:this.kind,
                    sort:this.sortType,
                    sortType:this.sortPropName,
                    blurName:'',
                };
            },

            courseBindBannerParam(){
                return {
                    bannerPic:this.bannerPic ,
                    bannerDesc:this.bannerDesc,
                    bannerContentUrl:this.bannerContentUrl,
                    bannerAdmin:this.bannerAdmin,
                };
            },
            ...mapState({
                source:({banner}) => banner.list,

            }),
        },

        methods: {
            /*转换时间*/
            fmtDate(inputTime){
                var date = new Date(inputTime);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                var second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '/' + m + '/' + d+' '+h+':'+minute
            },
            refreshPage(){
                Api.searchBindBanner(this.searchBindBannerParam)
                    .then(res => {
                        console.log(res.data.bannerList);
                        res.data.bannerList.forEach(item =>{
                            item.bannerCreateTime = this.fmtDate(item.bannerCreateTime)
                        });
                        this.bannerTableData = res.data.bannerList;
                        this.totalCount = res.data.totalNum;
                    }).catch(res => {
                })
                // this.searchBindBanner(this.searchBindBannerParam).then( resp => {
                //     this.totalCount = resp.data.totalNum;
                //     this.bannerTableData =  resp.data.bannerList
                // })
            },
            handleSizeChange(nSize){
                this.pageSize = nSize;
                this.refreshPage();
            },
            handleCurrentChange(nPage){
                this.pageNo = nPage;
                this.refreshPage();
            },


            addBanner(){
                if(this.bannerTableData.length >= 6) {
                    this.$message.warning({
                        message: 'banner个数不能超过6个'
                    })
                    return
                }
                this.isAddModalVisible = true;
                this.bannerTitle = '添加banner'
                this.rowData = {};
                this.isAddSeeDel = "1"
            },
            handleSortChange(col) {
                this.sortPropName = col.prop;
                if(this.sortPropName == 'courseName'){
                    this.sortPropName = 0
                    this.refreshPage();
                }else if(this.sortPropName == 'adminName'){
                    this.sortPropName = 1
                    this.refreshPage();
                }else if(this.sortPropName == 'bannerCreateTime'){
                    this.sortPropName = 2
                    this.refreshPage();
                }

                //asc升序
                //desc降序
                this.sortType = col.order;
                if(this.sortType == 'ascending'){
                    this.sortType = 1
                    this.refreshPage();
                }else if(this.sortType == 'descending'){
                    this.sortType = '-1'
                    this.refreshPage();
                }
                this.refreshPage();
            },
            //查看
            seeRow(index,rows){
              this.rowData = Object.assign({},rows[index]);
              this.bannerTitle = '查看banner'
              this.isAddModalVisible = true;
              this.isAddSeeDel = "3"
            },
            //编辑
            editRow(index, rows){
              this.rowData = Object.assign({},rows[index]);
              //   this.editBannerModelVisible = true;
              this.bannerTitle = '编辑banner'
              this.isAddModalVisible = true;
              this.isAddSeeDel = "2"
            },
            delBanner(index, rows) {
                this.bannerId = rows[index].bannerId;
                this.$confirm('确定删除此banner吗？', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.deleteBanner({
                      bannerId: this.bannerId,
                      operationAdmin : sessionStorage.getItem('adminAccount')
                    }).then((res) => {
                        if(res.code == 0 ){
                            rows.splice(index, 1);
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.refreshPage();
                        }else{
                            this.$message({
                                message: '删除失败',
                                type: 'warning'
                            });
                        }
                    });
                }).catch((e) => {
                });
            },
            orderBanner(index, rows ,type){
                let parms = {};
                if(type == 1){
                    parms = {
                        "beforeBannerId":rows[index - 1].bannerId,
                        "afterBannerId":rows[index].bannerId,
                        "operationAdmin":rows[index].bannerAdmin
                    };
                }else{
                    parms = {
                        "beforeBannerId":rows[index].bannerId,
                        "afterBannerId":rows[index + 1].bannerId,
                        "operationAdmin":rows[index].bannerAdmin
                    };
                }
                Api.bannerChageOrder(parms).then(res => {
                    if(res.code === 0){
                        this.refreshPage();
                    }
                })
            },
            ...mapActions(["showPageLoading", "hidePageLoading", "courseBindBanner","searchBindBanner","deleteBanner"]), //listBanner
        },
    };
</script>


<style lang='less'>
.banner {
    .el-table .el-table__header-wrapper thead th .cell{
        background:#ffffff;
        border-bottom:1px solid #f5f7fa;
    }
    .addEventStyle .el-dialog__body .el-form-item__label {
        width: 85px;
    }
    img{
        margin: 0 0px 3px 16px;
        cursor: pointer;
    }
    .disable-Img{
        cursor: default;
    }
}

</style>





