<!-- 本地进行筛选、排序表格 -->
<template>
    <div>
        
        <div class='table-wrapper' ref = "tableWrap">
            <el-table :class="{'table-empty': sourceList.length == 0 }" :data="sourceList" @sort-change="handleSortChange" style='width:100%;' ref='table'>

                <el-table-column label="banner图片" >
                    <template scope="scope"><!-- scope.$index.bannerPic -->
                        <img :src="scope.row.bannerPicIp +''+scope.row.bannerPic" style="width: 50px;height: 50px;margin-top: 6px;"/>
                    </template>
                </el-table-column>
                <el-table-column label="对应课程" sortable prop="courseName">
                </el-table-column>
                <el-table-column label="创建人" sortable prop="adminName">
                </el-table-column>
                <el-table-column label="最后编辑时间" sortable prop="createTime">
                </el-table-column>
                
                <el-table-column
                  label="操作"
                  min-width='115'>
                  <template scope="scope">
                    <!-- <el-button @click.native.prevent="seeRow(scope.$index, sourceList)" type="handle edit" size="small" title="查看" ></el-button> -->
                    <!-- <span  @click="seeRow(scope.$index, sourceList)">查看</span> -->
                    <el-button @click.native.prevent="seeRow(scope.$index, sourceList)" type="handle check" size="small" title="查看" ></el-button>
                    <el-button @click.native.prevent="editRow(scope.$index, sourceList)" type="handle edit" size="small" title="编辑" ></el-button>
                    <el-button @click="del(scope.$index, sourceList)" type="handle delete" size="small" title="删除"></el-button>
                    <!-- <el-button @click="moveup(scope.$index)" type="handle upwardArrow" size="small" :disabled="scope.$index == 0" style="width:10px;"></el-button>
                    <el-button @click="movedown(scope.$index)" type="handle downArrow" size="small" :disabled="scope.$index == tableData.length - 1"  style="width:10px;"></el-button> -->
                    </template>
                </el-table-column>  


            </el-table>

            <!-- <div class="pagination-section">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageNo"
                               :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="totalCount">
                </el-pagination>
            </div> -->

            <edit-banner-model v-model="editBannerModelVisible" :rowData="rowData"></edit-banner-model>
            <add-banner-detail-model v-model="isAddDetailModalVisible"  :rowData="rowData"></add-banner-detail-model>
        </div>
    </div>
</template>


<script>
    import {mapActions, mapState} from 'vuex';
    import utils from '../utils/misc';
    import _ from 'lodash';
    import editBannerModel from '../components/editBannerModel';
    import addBannerDetailModel from  '../components/addBannerDetailModel';

    //import addWaterMark from '../mixins/addWaterMark';

    export default {
        name: 'bannerTable',

        data() {
            return {
                pageCurNum: 1,
                pageCurSize: 5,
                sortPropName: '',
                sortType:'ascending',
                filtText:'',
                pageCurList:[],
                pageCurTotal:0,
                input: '',
                tableData:[],
                //pageNo: 1,
                totalCount: 0,
                rowData: {
                },
                editBannerModelVisible:false,
                isAddDetailModalVisible:false,
                sortPropName:1,
                sortType:1,
                kind : sessionStorage.getItem('kind') ,

            }
        },
        components: {
            editBannerModel,addBannerDetailModel
        },

       // mixins: [addWaterMark],

        props: {
            tableTitle: {
                type: String,
                default: 'Table',
            },
            source: Array,
            propertyLabels: {
                type:[Object,Array],
                default: ()=> []
            },
            pageNo: {
                type: Number,
                default: 1
            },

            pageSize: {
                type: Number,
                default: 5
            },
            total: {
                type: Number,
                default: 0
            }
        },

        beforeMount() {
            this.searchBindBanner(this.searchBindBannerParam);
        },

        mounted() {
            if( this.sourceList.length !== 0  ){
                //this.addTableMark(this.$refs.tableWrap);
            }
        },

        watch: {
            // pageNo(val) {
            //     this.pageCurNum = val;
            // },
            pageSize(val) {
                this.pageCurSize = val;
            },
            total(val) {
                this.pageCurTotal = val;
            },
        },

        updated(){
            // 解决数据为空时，缺少横向滚动条的bug
            /*if( this.sourceList.length == 0  ){
                const {$el} = this.$refs.table;
                 setTimeout(()=>{
                    const width = $el.querySelector(".el-table__body").style.width;
                    const element = $el.querySelector('.el-table__empty-block');
                    element && (element.style.width = width);
                },100)
            }*/

        },

        computed:{
            sourceList(){

                var list = [].concat(this.source);
                if(list.length === 0){return []};
                //筛选条件
                var filtText = this.filtText+'';

                if(filtText !== ''){
                    list = _.filter(list,function(ele){
                        var exist = false;
                        _.mapValues(ele, function(v) {
                          if(_.includes(v+'', filtText)){exist = true;}
                        });
                        return exist;
                    });

                    if(list.length === 0){
                        this.pageCurTotal = 0;
                        this.pageCurList = [];
                        return [];
                    }
                }else{
                    
                }

                //排序
                if(this.sortPropName){
                    list = _.sortBy(list, this.sortPropName);
                    if(this.sortType==='descending'){
                        list = list.reverse();
                    }
                };
                this.pageCurTotal = list.length;
                this.pageCurList = [].concat(list);

                //在最后一页进行’每页显示**条‘设置报错；
                if(_.chunk(list,this.pageCurSize).length<=this.pageCurNum){
                    this.pageCurNum = _.chunk(list,this.pageCurSize).length;
                }

                return _.chunk(list,this.pageCurSize)[this.pageCurNum-1];
            },
            curPageSize() {
                //每页条数
            },
            // banner的列表
            searchBindBannerParam(){
                return {
                    pageSize:1 ,
                    kind:this.kind,
                    sort:this.sortType,
                    sortType:this.sortPropName,
                    blurName:'',
                };
            },
            //删除的参数
             deleteParams() {
                return {
                    bannerId: this.bannerId,
                };
            },
        },

        methods: {
            
            //新增加的下载表格
            //下载按钮
            onClickTable(index){
                this.$emit('downTable',[index]);
            },
            handleSizeChange(nSize){
                this.pageSize = nSize;
                this.refreshPage();
            },
            // handleCurrentChange(nPage){
            //     this.pageNo = nPage;
            //     this.refreshPage();
            // },
            
            handleSortChange(col) {
                //console.log(col);
                this.sortPropName = col.prop;
                console.log(this.sortPropName,'--------------')
                if(this.sortPropName == 'courseName'){
                    this.sortPropName = 0
                    console.log(this.sortPropName)
                }else if(this.sortPropName == 'adminName'){
                    this.sortPropName = 1
                    console.log(this.sortPropName)
                }else if(this.sortPropName == 'createTime'){
                    this.sortPropName = 2
                    console.log(this.sortPropName)
                }

                //asc升序   
                //desc降序
                this.sortType = col.order;

                //console.log(this.sortType,'您好 我是升序 降序里面的东西');

                if(this.sortType == 'ascending'){
                    this.sortType = 1
                    //console.log(this.sortType)
                }else if(this.sortType == 'descending'){
                    this.sortType = '-1'
                    //console.log(this.sortType)
                }
                this.searchBindBanner(this.searchBindBannerParam);
            },

            handleFiltText(val){
                this.filtText = val+'';
                //this.filtText = this.input+'';
            },

            getProperty(property){
                return typeof(property) === 'object'? property['key'] : property;
            },

            getPropertyLabel(property){
                return typeof(property) === 'object'? property['name'] : property;
            },

            handleGoDetail(index, appid) {
                this.setAppId({num: appid});
                this.$router.push('/operationAnalysis/appGeneral');
            },

            del(index, rows) {
                //alert("hi 我是删除")
                //this.bannerId = rows[index].bannerId;
                //console.log(this.bannerId,'我是删除的参数');
                this.$confirm('确定删除此门课程吗？', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.bannerId = rows[index].bannerId;
                    this.deleteBanner(this.deleteParams).then((res) => {
                        if(res.code == 0 ){   //&& res.msg == 'success'
                            rows.splice(index, 1);
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.listBanner();
                        }else{
                            this.$message({
                                message: '删除失败',
                                type: 'warning'
                            });
                        }
                    });
                }).catch((e) => {
                    //console.log('e', e);
                });
                
            },
              //向上移动
              moveup(index) {
                const beforeBannerId = this.tableData[index - 1].bannerId;
                const afterBannerId =  this.tableData[index].bannerId;
                this.changeOrder(beforeBannerId, afterBannerId);
              },
              //向下移动
              movedown(index) {
                const beforeBannerId = this.tableData[index].bannerId;
                const afterBannerId =  this.tableData[index + 1].bannerId;
                this.changeOrder(beforeBannerId,afterBannerId);
              },
              seeRow(index,rows){
                console.log(index,rows,'====')
                console.log()
                this.rowData = Object.assign({},rows[index]);
                this.isAddDetailModalVisible = true
              },
              //编辑
              editRow(index, rows){
                //alert("hi ")
                //alert("hi 我是编辑的弹框")
                this.rowData = Object.assign({},rows[index]);
                this.editBannerModelVisible = true;
              },

              




            ...mapActions(["setAppId","deleteBanner", "searchBindBanner"]),
        },
    }




</script>

<style lang='less'>

.el-pagination .el-select .el-input input {
    line-height:28px!important;
}

</style>
