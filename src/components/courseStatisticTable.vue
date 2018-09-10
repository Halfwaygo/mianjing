<!-- 本地进行筛选、排序表格 -->
<template>
    <div>
        
        <div class='table-wrapper' ref = "tableWrap">
            <el-table :class="{'table-empty': sourceList.length == 0 }" :data="sourceList" @sort-change="handleSortChange" style='width:100%;' ref='table'>

                <el-table-column label="姓名"  prop="userName" >
                  
                </el-table-column>
                <el-table-column label="花名" prop="nickname"><!--  -->
                </el-table-column>
                <el-table-column label="部门" prop="department"><!--  -->
                </el-table-column>
                <el-table-column label="学习进展" prop="courseProgress"><!--  -->
                </el-table-column>
                <el-table-column label="学习时长" prop="duration">
                </el-table-column>
                <el-table-column label="最近观看时间" prop="lastViewTime">
                </el-table-column>
               
                <!-- <el-table-column
                  label="操作"
                  min-width='115'>
                  <template scope="scope">
                    <el-button @click.native.prevent="editRow(scope.$index, sourceList)" type="handle edit" size="small" title="编辑" ></el-button>
                    <el-button @click.native.prevent="countRow(scope.$index, sourceList)" type="handle count" size="small" title="统计" ></el-button>
                    <el-button @click="deleteBanner(scope.$index, tableData)" type="handle delete" size="small" title="删除"></el-button>
                  </template>
                </el-table-column>   -->


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
        name: 'courseStatisticTable',

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
                //asc升序   
                //desc降序
                this.sortType = col.order;
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
                //alert("hi")
                this.$msgbox({
                  title: '消息',
                  message: `确定删除此课程吗？相关学习记录等会也一并删除哦~`,
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  beforeClose: (action, instance, done) => {
                      if (action == 'confirm') {
                          setTimeout(() => {
                              done()
                          }, 300)
                          const delBannerId = rows[index].bannerId;
                          this.doDelete(delBannerId);
                      } else {
                          this.$message({
                              type: 'info',
                              message: '已取消'
                          })
                          done()
                      }
                  }
                })
              },
              countRow(){
                console.log("hello 我是课程统计") //isCourseStatistics
                this.$router.push('/operationAnalysis/courseStatistics');
              },




            ...mapActions(["setAppId"]),
        },
    }




</script>

<style lang='less'>

.el-pagination .el-select .el-input input {
    line-height:28px!important;
}

</style>
