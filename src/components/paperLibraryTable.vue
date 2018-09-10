<!-- 本地进行筛选、排序表格 -->
<template>
    <div>
        
        <div class='table-wrapper' ref = "tableWrap">
            <el-table :class="{'table-empty': sourceList.length == 0 }" :data="sourceList" @sort-change="handleSortChange" style='width:100%;' ref='table'>

                <el-table-column label="试卷名称"  prop="type" >
                  
                </el-table-column>
                <el-table-column label="试卷分类" prop="name">
                </el-table-column>
                <el-table-column label="创建人" prop="YestIncUser">
                </el-table-column>
                <el-table-column label="更新时间" prop="CountUser">
                </el-table-column>
               
                <el-table-column
                  label="操作"
                  min-width='115'>
                  <template scope="scope">
                    <el-button @click.native.prevent="editPaper(scope.$index, sourceList)" type="handle edit" size="small" title="编辑" ></el-button>
                    <el-button @click="deleteBanner(scope.$index, tableData)" type="handle delete" size="small" title="删除"></el-button>
                  </template>
                </el-table-column>  


            </el-table>

            <div class="pagination-section">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageNo"
                               :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="totalCount">
                </el-pagination>
            </div>

            

        </div>
    </div>
</template>


<script>
    import {mapActions, mapState} from 'vuex';
    import utils from '../utils/misc';
    import _ from 'lodash';
    //import editExamModel from '../components/editExamModel';
    //import addWaterMark from '../mixins/addWaterMark';

    export default {
        name: 'examLibraryTable',

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
                rowData: {
                },
                //editExamModel:false,
            }
        },
        // components: {
        //     editExamModel
        // },

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
            
        },

        mounted() {
            if( this.sourceList.length !== 0  ){
                //this.addTableMark(this.$refs.tableWrap);
            }
        },

        watch: {
            pageNo(val) {
                this.pageCurNum = val;
            },
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
                this.pageNo = nPage;
                this.refreshPage();
            },
            //编辑
            editPaper(index, rows){
                //alert("hi 我是编辑试卷的弹框")
                this.$router.push('/operationAnalysis/editPaper');
                
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
                this.$msgbox({
                  title: '消息',
                  message: `确定删除此门课程吗？`,
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




            ...mapActions(["setAppId"]),
        },
    }




</script>

<style lang='less'>

.el-pagination .el-select .el-input input {
    line-height:28px!important;
}

</style>
