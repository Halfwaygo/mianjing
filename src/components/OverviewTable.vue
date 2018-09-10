<!-- 本地进行筛选、排序表格 -->
<template>
    <div>
        
        <div class='table-wrapper' ref = "tableWrap">
            <el-table :class="{'table-empty': sourceList.length == 0 }" :data="sourceList" @sort-change="handleSortChange" style='width:100%;' ref='table'>

                <el-table-column label="课程名称" sortable  prop="courseName" >
                  
                </el-table-column>
                <el-table-column label="课程类型" sortable prop="courseType"><!--  -->
                </el-table-column>
                <el-table-column label="课程分类" sortable prop="courseType"><!--  -->
                </el-table-column>
                <el-table-column label="学习人数" sortable prop="courseParticipantCount"><!--  -->
                </el-table-column>
                <el-table-column label="创建人" prop="adminName">
                </el-table-column>
                <el-table-column label="最后编辑时间" sortable prop="updateTime">
                </el-table-column>
               
                <el-table-column
                  label="操作"
                  min-width='115'>
                  <template scope="scope">
                    <el-button @click.native.prevent="editCourse(scope.$index, sourceList)" type="handle edit" size="small" title="编辑" ></el-button>
                    <el-button @click.native.prevent="countRow(scope.$index, sourceList)" type="handle count" size="small" title="统计" ></el-button>
                    <el-button @click="deleteBanner(scope.$index, sourceList)" type="handle delete" size="small" title="删除"></el-button>
                  </template>
                </el-table-column>  


            </el-table>

            <!-- <div class="pagination-section">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageNo"
                               :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="totalCount">
                </el-pagination>
            </div>
 -->
            


        </div>
    </div>
</template>


<script>
    import {mapActions, mapState} from 'vuex';
    import utils from '../utils/misc';
    import _ from 'lodash';
    //import addWaterMark from '../mixins/addWaterMark';

    export default {
        name: 'DynamicTable',

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
                pageNo: 1,
                totalCount: 0,
                

            }
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
            // pageNo: {
            //     type: Number,
            //     default: 1
            // },

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
            this.deleteCourse(this.deleteParams);
            //this.getCourse(this.getCourseParams);
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
            //表格的绘制
            getCourseParams() {
                return {
                    pageSize: 4,
                    currentPage:1, 
                    blurName:'',  
                    sort:1, 
                    sortType:1,
                    courseType:1, 
                    categoryCode:'00000000', 
                    courseAdmin:'yinhong', 
                    kind:1,
                };
            },


            //删除的参数
             deleteParams() {
                return {
                    courseId: this.courseId,
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
            handleCurrentChange(nPage){
                //this.pageNo = nPage;
                this.refreshPage();
            },


            //新增加的
            /*sortFn(a,b){
                return parseInt(a.YestIncUser)-parseInt(b.YestIncUser)>0
                return parseInt(a.YestUser)-parseInt(b.YestUser)>0
                return parseInt(a.YestStartUp)-parseInt(b.YestStartUp)>0
                return parseInt(a.CountUser)-parseInt(b.CountUser)>0
            },*/
            

            
            handleSortChange(col) {
                //console.log(col);
                this.sortPropName = col.prop;
                console.log(this.sortPropName,'--------------')
                if(this.sortPropName == 'courseName'){
                    this.sortPropName = 0
                    //console.log(this.sortPropName)
                }else if(this.sortPropName == 'courseType'){
                    this.sortPropName = 1
                    //console.log(this.sortPropName)
                }else if(this.sortPropName == 'adminName'){
                    this.sortPropName = 2
                    //console.log(this.sortPropName)
                }else if(this.sortPropName == 'updateTime'){
                    this.sortPropName = 3
                    //console.log(this.sortPropName)
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

            //05-07
            deleteBanner(index, rows) {
                //alert("hi 我是删除")
                //console.log(rows[index].courseId,'-----------------')
                //this.courseId = rows[index].courseId;
                //console.log(this.courseId,'我是删除的参数');
                this.$confirm('确定删除此门课程吗？相關學習記錄也會一併刪除哦', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.courseId = rows[index].courseId;
                    this.deleteCourse(this.deleteParams).then((res) => {
                        if(res.code == 0 ){
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
           
              countRow(){
                console.log("hello 我是课程统计") //isCourseStatistics
                this.$router.push('/operationAnalysis/courseStatistics');
              },
              editCourse(index, rows){
                this.$router.push('/operationAnalysis/editCourse');
              },




            ...mapActions(["setAppId","deleteCourse","getCourse"]),
        },
    }




</script>

<style lang='less'>

.el-pagination .el-select .el-input input {
    line-height:28px!important;
}

</style>
