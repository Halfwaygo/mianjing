<!-- 本地进行筛选、排序表格 -->
<template>
    <div>
        
        <div class='table-wrapper' ref = "tableWrap">
            <el-table :class="{'table-empty': sourceList.length == 0 }" :data="sourceList" @sort-change="handleSortChange" style='width:100%;' ref='table'>

                <el-table-column label="题型"  prop="questionTypeName" >
                </el-table-column>
                <el-table-column label="题目" prop="questionPointName">
                </el-table-column>
                <el-table-column label="知识点" prop="YestUser">
                </el-table-column>
                <el-table-column label="分值" prop="questionScore">
                </el-table-column>
                <el-table-column label="难易" prop="difficultyLevelName">
                </el-table-column>
                <el-table-column label="创建人" prop="questionAuthor">
                </el-table-column>
                <el-table-column label="最后编辑时间" prop="updateTime">
                </el-table-column>

        <!-- <el-table-column label="题型"  prop="type" >
                  
                </el-table-column>
                <el-table-column label="题目" prop="name">
                </el-table-column>
                <el-table-column label="知识点" prop="YestUser">
                </el-table-column>
                <el-table-column label="分值" prop="YestStartUp">
                </el-table-column>
                <el-table-column label="难易" prop="YestIncUser">
                </el-table-column>
                <el-table-column label="创建人" prop="url">
                </el-table-column>
                <el-table-column label="最后编辑时间" prop="CountUser">
                </el-table-column> -->
               
                <el-table-column
                  label="操作"
                  min-width='115'>
                  <template scope="scope">
                    <el-button @click.native.prevent="checkQuestion(scope.$index, sourceList)" type="handle check" size="small" title="查看" ></el-button>
                    <el-button @click.native.prevent="editQuestion(scope.$index, sourceList)" type="handle edit" size="small" title="编辑" ></el-button>
                    <el-button @click="delQuestion(scope.$index, sourceList)" type="handle delete" size="small" title="删除"></el-button>
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

            <exam-detail-model v-model="examDetailModel" :rowData="rowData"></exam-detail-model>

        </div>
    </div>
</template>


<script>
    import {mapActions, mapState} from 'vuex';
    import utils from '../utils/misc';
    import _ from 'lodash';
    import examDetailModel from '../components/examDetailModel';
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
                examDetailModel:false,
            }
        },
        components: {
            examDetailModel
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
            delQuestionParams(){
                return {
                    questionId: this.questionId,
                };
            }
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
            delQuestion(index, rows) {
                //alert('hi')
                //this.questionId = rows[index].questionId;
                //console.log(rows[index])
                this.$confirm('确定删除吗？', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.questionId = rows[index].questionId;
                    this.deleteQuestion(this.delQuestionParams).then((res) => {
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
            //编辑
            //editQuestion
            editQuestion(index, rows){
                //alert("hi 我是编辑的弹框")
                console.log("试题库 编辑试题");
                this.$router.push('/operationAnalysis/createExam');
            },
            checkQuestion(index, rows){
                console.log("试题库 试题详情的弹框");
                this.examDetailModel = true;
            },



            ...mapActions(["setAppId","deleteQuestion",]),
        },
    }




</script>

<style lang='less'>

.el-pagination .el-select .el-input input {
    line-height:28px!important;
}

</style>
