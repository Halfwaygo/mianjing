<template>
    <div class="examLibrary" style=" "  >
        <div v-show="editExamVisible">
        <div class='course-ware' style="margin-top:65px;">
            <el-button class="export" type="primary" size="small" @click="examLibraryImport">导入</el-button>
            <el-button class="create-test" type="primary" size="small" @click="createExam">新建试题</el-button>
        	<div style="">
        		<el-input class="course-ware-input" v-model="input" placeholder="请输入搜索的题目" icon="search" style="width:290px;"></el-input>
	        	<el-button style="float:right;width:80px;height:33px;" type="primary" size="small"  @click="blurNameClick"><span class="el-icon-search"></span>搜索</el-button>
	        </div>
        </div>
        <div class="content">
        	<div >
            <el-form ref="form" :model="form" label-width="80px" class="exam-form">
        		<div class="course-options" style="display:inline-block;">
        			<label for="">题型：</label>
                    <ul  class="courseTyle1 tab clearfix">
                        <li @click="clickTabItem(index)" v-for="(item,index) in questionType"
                        :class="{active: currentTabItemIndex == index}" :key="index">{{item.questionTypeName}}</li>
                    </ul>
        		</div>
                <el-form-item  label="所属知识点：" class="mb0">
                    <knowledge :showAdd="false" :isShowAll = "true" @konwledgePointId="konwledgePointId"></knowledge>
                </el-form-item>
        		<!--<div class="course-options">
        			<label for="">所属知识点：</label>
        			<el-select v-model="examPoint1"  @change="examPointChange" placeholder="请选择" class="course-select" popper-class='exam-know'>
                        <el-option
                          v-for="(item, index) in getPoint"
                          :label="item.pointName"
                          :value="item.pointId"
                          :key="index">
                        </el-option>
                    </el-select>
        			<el-select v-show="getPoint2.length !== 0" v-model="examPoint2"  @change="examPointChange2" placeholder="请选择" class="course-select">
                        <el-option
                          v-for="(item, index) in getPoint2"
                          :label="item.pointName"
                          :value="item.pointId"
                          :key="index">
                        </el-option>
                    </el-select>
                    <el-select v-show="getPoint3.length !== 0" v-model="examPoint3"   @change="examPointChange3" placeholder="请选择" class="course-select">
                        <el-option
                          v-for="(item, index) in getPoint3"
                          :label="item.pointName"
                          :value="item.pointId"
                          :key="index">
                        </el-option>
                    </el-select>
        		</div>-->
                <el-form-item  label="难易程度：">
                <el-radio-group v-model="form.difficuty" class="difficult">
                  <el-radio v-for="(item, index) in questionDifficulty" :key="index" :label="item.difficultyName" @click.native="getQuestionDifficulty(item.difficultyLevel)"></el-radio>
                </el-radio-group>
              </el-form-item>
        		<div class="course-options">
        			<label for="">创建人：</label>
        			<el-select v-model="courseTypePerson" placeholder="请选择" class="course-select" @change="courseTypePersonChange">
                        <el-option
                          v-for="(item, index) in courseadminList"
                          :key="index"
                          :label="item.adminName"
                          :value="item.adminAccount">
                        </el-option>
                    </el-select>

        		</div>
        		<div>

                    <el-table :data="tableExamLibraryData" @sort-change="handleSortChange" v-loading="isLoading" style='width:100%;' ref='table'>
                        <el-table-column label="题型"   prop="questionTypeName" >
                        </el-table-column>
                        <el-table-column label="题目" prop="questionDesc">
                        </el-table-column>
                        <el-table-column label="知识点" prop="questionPointName">
                        </el-table-column>
                        <el-table-column label="分值" sortable prop="questionScore">
                        </el-table-column>
                        <el-table-column label="难易度" sortable prop="difficultyLevelName">
                        </el-table-column>
                        <el-table-column label="创建人" sortable prop="questionAuthor">
                        </el-table-column>
                        <el-table-column label="更新时间" sortable="custom" prop="updateTime">
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          min-width='115'>
                          <template scope="scope">
                            <el-button @click.native.prevent="checkInfo(scope.$index,tableExamLibraryData)" type="handle check" size="small" title="查看" ></el-button>
                            <el-button @click.native.prevent="editExam(scope.$index,tableExamLibraryData)" :visibles="editExamVisible"  type="handle edit" size="small" title="编辑" ></el-button>
                            <el-button @click="deleteExamLibrary(scope.$index,tableExamLibraryData)" type="handle delete" size="small" title="删除"></el-button>
                          </template>
                        </el-table-column>
                </el-table>
        		</div>
                <div class="pagination-wrap">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pageNo"
                           :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="totalCount">
                    </el-pagination>
                </div>


            </el-form>
        	</div>
        </div>
        </div>
        <!-- 查看试题详情 -->
         <exam-library-detail v-model="isExamDetailModalVisible" :rowData="rowData"></exam-library-detail>

        <edit-exam  v-if="!editExamVisible" :rowData="rowData"></edit-exam>
    </div>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
    import Knowledge from '../components/Knowledge';
	import * as C from '../constants/api';
	import * as CONST from "../constants/const";
    import Api from "../utils/api"
	import utils from  '../utils/misc';
	import pageHeader from '../components/pageHeader';
	import Tab from  '../components/Tab';
    import {eventBus,num} from '../eventBus'

    import examLibraryDetail from '../components/examLibraryDetail';
    import editExam from '../components/editExam';


	export default {
		name: 'examLibrary',

		filters: {
		},

		components: {
		    pageHeader, Tab ,editExam,examLibraryDetail,Knowledge
		},

		data(){
			return {
				examPoint1:'请选择',
                examPoint2:'请选择',
                examPoint3:'请选择',
				courseType2:1,
                questionId:null,
                isLoading: true, // 表格加载中
				courseTypePerson:1,
				COURSE_TYPE: CONST.COURSE_TYPE,
				COURSE_TYPE2: CONST.COURSE_TYPE2,
				COURSE_TYPE_PERSON: CONST.COURSE_TYPE_PERSON,
                pageNo:1,
                pageSize:10,
                pagesize:10,
                totalCount: 0,
                form: {
                    difficuty:'不限',
                    img:'',
                },
                input: '',
                currentTabItemIndex: '',
                difficultyLevel:'',
                tableExamLibraryData:[],
                sortType:"-1",
                sortPropName:3,
                courseTypeTab:'',
                adminAccount : sessionStorage.getItem('adminAccount') ,
                isExamDetailModalVisible:false,
                rowData: {
                },
                editExamVisible:true,
                questionPointId:'',
                courseTypePerson:'',
                courseAdmin:'',
                questionPointId2:'',
                questionPointId3:'',


            }
		},

		watch: {
			 currentData: function(val){
                console.log(val);
                this.currentTabItemIndex = val;
            },
		},

		beforeMount() {
            // 获取创建人
            this.getCourse({"currentPage":1,"pageSize":3,"blurName":"","sort":"","sortType":"","courseType":1,"categoryCode":"","courseAdmin":"","kind":1
            })
			this.questionTypeList();
            this.questionPointList(this.questionPointParams);
            this.questionDifficultyList();
            Api.getQuestionByPage(this.questionPageParam)
                .then(res => {
                  this.isLoading = false
                  this.totalCount = res.data.totalNum;
                  this.tableExamLibraryData = res.data.questionByPageResp;
                }).catch(res => {
                 // console.log(JSON.stringify(res))
            })
            // this.refreshPage();

        },

        mounted() {
            //产品对比后的按钮位置
            //this.justifyToolboxLeft();

        },
        created(){

            // console.log(this.$router.params.show);
            // this.visibles = this.show
            // console.log(this.a);

            var that = this;

            eventBus.$on('change',(val)=>{
                //console.log('-------')
                //console.log(this.editCourseVisible)
            that.editExamVisible =true
            //that.addCourseVisible =true

            //console.log(this.editCourseVisible)
           });
        },

		computed:{
			total() {
                return this.source.length||0;
            },

			questionPointParams() {
                return {
                    pointId:0,
                };
            },
            questionPointParams2() {
                return {
                    pointId:this.questionPointId,
                };
            },
            questionPointParams3() {
                return {
                    pointId:this.questionPointId2,
                };
            },
            questionPageParam() {
                return {
                    currentPage: this.pageNo,
                    pageSize: this.pageSize,
                    blurName:this.input,
                    difficultyLevel:this.difficultyLevel,
                    adminAccount:this.courseAdmin,
                    questionTypeId:this.courseTypeTab+"",
                    questionPointId:this.questionPointId,    //此处需要注意一下
                    sortField:this.sortPropName,
                    sortType:this.sortType,
                };
            },
            //校验的参数
            idExistParams(){
                return {
                    questionId: this.questionId,
                    operationAdmin:this.adminAccount,
                };
            },
            //删除的参数
             deleteParams() {
                return {
                    questionId: this.questionId,
                    operationAdmin:this.adminAccount,
                };
            },

            ...mapState({
            	questionType: ({test}) => test.questionType,
                questionDifficulty: ({test}) => test.questionDifficulty,
                getPoint: ({test}) => test.getPoint,
                getPoint2: ({test}) => test.getPoint2,
                getPoint3: ({test}) => test.getPoint3,
                //source:({test}) => test.questionPage,
            	source:({dataOverview}) => dataOverview.list,
                courseadminList: ({course}) => course.courseadminList,
            }),
        },

		methods: {

            // 传递所属知识点
            konwledgePointId(v) {
                this.questionPointId = v
                // this.getQuestionByPage(this.questionPageParam)
                this.refreshPage();
            },
            refreshPage(){
                 this.isLoading = true
                 this.tableExamLibraryData = []
                 this.getQuestionByPage(this.questionPageParam).then( resp => {
                    this.isLoading = false
                    this.totalCount = resp.data.totalNum;
                    this.tableExamLibraryData = resp.data.questionByPageResp;
                })
            },

            handleSizeChange(nSize){
                this.pageSize = nSize;
                this.refreshPage();
            },
            handleCurrentChange(nPage){
                this.pageNo = nPage;
                this.refreshPage();
            },


			//新增下载表格
			createExam(){

				this.$router.push({name:'newExamLibrary',query:{type:1}});

			},
            clickTabItem(i) {
                this.currentTabItemIndex = i;   //题型
                this.$emit('changeTab', i);
                this.courseTypeTab = i;
                this.refreshPage();

            },
            examPointChange(v){

                this.questionPointId = v;
                this.questionPointList2(this.questionPointParams2);
                this.refreshPage();
            },
            examPointChange2(v){
                this.questionPointId = v;
                this.refreshPage();
                this.questionPointList3(this.questionPointParams2);
                //this.examPoint3 = "";
            },
             examPointChange3(v){
                this.questionPointId2 = v;
                this.questionPointList3(this.questionPointParams);
                this.refreshPage();
             },
            getQuestionDifficulty(i){
                this.difficultyLevel = parseInt(i);
                this.refreshPage();
                console.log(this.questionPageParam,'--------难易度所有的参数')  //难易程度 求出来了
            },
            courseTypePersonChange(v){
                this.courseAdmin = v
                this.refreshPage();
            },
            blurNameClick(){
                //alert('hi');
                var that = this;
                var blurName = this.input;
                this.refreshPage();

            },
            handleSortChange(col) {

                this.sortPropName = col.prop;
                if (this.sortPropName === 'questionScore') {
                    this.sortPropName = 0;
                } else if (this.sortPropName === 'difficultyLevelName') {
                    this.sortPropName = 1;
                } else if (this.sortPropName === 'questionAuthor') {
                    this.sortPropName = 2;
                } else if (this.sortPropName === 'updateTime') {
                    this.sortPropName = 3;
                }
                this.sortType = col.order;
                if (this.sortType === 'ascending') {
                    this.sortType = 1;
                } else if (this.sortType === 'descending') {
                    this.sortType = '-1';
                }

                this.refreshPage();
            },
            checkInfo(index,rows){
                 this.rowData = Object.assign({},rows[index]);
                 this.isExamDetailModalVisible = true;
            },
            editExam(index,rows){
                this.questionId = rows[index].questionId;
                this.$router.push({path:'newExamLibrary',query:{type:1,questionId:this.questionId}})
            },
            deleteExamLibrary(index,rows){
                //console.log(rows[index].questionId,'-----------------')
                //this.courseId = rows[index].courseId;
                this.questionId = rows[index].questionId;
                //console.log(this.deleteParams,'---------')
                this.$confirm('确定删除此试题吗？', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.deleteQuestion(this.deleteParams).then((res) => {
                        if(res.code == C.CODE_SUCCESS ){
                            rows.splice(index, 1);
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                           this.refreshPage();
                           // this.questionPageList(this.questionPageParam);
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
            examLibraryImport(){
                this.$router.push({path:'importQuestion'});
            },


			changeTabTimebucket(i) {
				this.timebucketTab = this.CATEGORY[i];
				this.getAppGeneralTimebucketData(this.timebucketParams);
			},

			logout(){
				window.location.href=`${window.location.pathname}#/login`
            },

			...mapActions(["getQuestionByPage","showPageLoading", "hidePageLoading",  "getOverviewData","questionTypeList", "questionPointList","questionPointList2","questionPointList3","questionDifficultyList","questionPageList","isQuestionEditStatus","deleteQuestion","getCourse"]),
		},
	};
</script>

<style lang='less'>
    .exam-know {
      .el-select-dropdown__list {
            max-height: 340px;
        }
    }
    .examLibrary{
        // button{
        //     width:24px;
        //     height:24px;
        // }
        // .content{
        //     margin-top: 0px !important;
        // }
        // .mb0{
        //     margin-bottom: 20px;
        // }

    }
    .courseTyle1>li{
        width:80px;
        height:36px;
        display:inline-block;

    }
    .course-options{
        position: relative;
        width: 100%;
        label{
            width:100px;
            display:inline-block;
            text-align: right;
        }
        .courseTyle1{
            position: absolute;
            top:-10px;
            left:104px;
        }
    }
    .examLibrary{
        .content .course-options:first-child{
            margin-bottom: 25px;
        }
        .el-form-item .el-form-item__label{
            width: 100px !important;
            text-align: right;
            padding-right: 0px;
        }
        .el-form-item  .el-form-item__content{
            margin-left: 107px !important;
        }
    }

</style>

