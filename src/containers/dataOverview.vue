<template>
	<div class="data-overview">
		<page-header style="position:fixed;width:100%;"/>
	    <div class="container container1" style="margin-top:50px;min-width: 1300px">
            <div class="latest-test">
                <div class="h-add">
                    <h2 class="last-test-title">最近考试<span @click="examDeatil">更多</span></h2>
                    <el-button class="add-test" type="primary" size="small" @click="createExam">创建考试</el-button>
                </div>
                <el-row :gutter="20" style="clear: both;">
                    <div  v-for="(item, index) in examArrangeRespList" :key="index">
                        <el-col :span="12">
                            <div  class="test-content">
                                <div class="test-content-left">
                                    <h5 style=" float: left">{{item.examName}}

                                    </h5>
                                    <el-button type="primary" class="test-content-left-btn"
                                               v-if="new Date(item.examStart).getTime() > new Date().getTime()">未开始
                                    </el-button>
                                    <el-button type="primary" class="test-content-left-btn"
                                               v-if="new Date(item.examEnd).getTime() < new Date().getTime()">已结束
                                    </el-button>
                                    <p class="examTime">
                                        考试时间：<span>{{item.examStart}}—{{item.examEnd}}</span>
                                    </p>
                                    <p class="examPerson">参加人数：{{item.examCurPersonNum}}/{{item.examPrePersonNum}}</p>
                                </div>
                                <div class="test-content-right">
                                    <el-button type="handle edit" size="small" :title="isDeleteDisable(item.examStart, item.serviceTime) ? '考试开始前1个小时就不能编辑了哦':'编辑'"
                                            @click="examEdit(item.id)" :disabled="isDeleteDisable(item.examStart, item.serviceTime)"></el-button>
                                    <el-button type="handle count" size="small" title="统计" :disabled="isCountDisable(item.examStart, item.serviceTime)"
                                            @click="examDeatilTotalAll(item.id, item.examName)"></el-button>
                                    <el-button type="handle delete" size="small"
                                               :title="isDeleteDisable(item.examStart, item.serviceTime) ? '考试开始前1个小时就不能删除了哦':'删除'"
                                               :disabled="isDeleteDisable(item.examStart, item.serviceTime)"
                                            @click="examDel(item.id)"></el-button>
                                </div>
                            </div>
                        </el-col>
                    </div>
                </el-row>
            </div>

            <div>
                <div class="h-add">
                    <h2 class="last-course-title">最近课程<span @click="courseLibrary">更多</span></h2>
                    <el-button class="add-test" type="primary" size="small" @click="addCourse">添加课程</el-button>
                </div>
                <el-row :gutter="20">
                    <div  v-for="(courseItem, index) in examCourseRespList" :key="index">
                        <el-col :span="12">
                            <div class="test-content">
                                <div class="test-content-left">
                                    <h5>{{courseItem.courseName}}
                                        <!-- <el-button type="primary" class="test-content-left-btn">未开始</el-button> -->
                                    </h5>
                                    <p class="examTime">
                                        课程类型：<span>{{courseTypeArr[parseInt(courseItem.courseType)-1]}}</span>
                                    </p>
                                    <p class="examPerson">学习人数：{{courseItem.courseParticipantCount}}</p>
                                </div>
                                <div class="test-content-right">
                                    <el-button type="handle edit" size="small" title="编辑"
                                            @click="overviewEditCourse(courseItem.courseId)"></el-button>
                                    <el-button type="handle count" size="small" title="统计"
                                            @click="courseLibraryStatic(courseItem.courseId)"></el-button>
                                    <!-- @click="courseLibrary" -->
                                    <el-button type="handle delete" size="small" title="删除"
                                            @click="courseDel(courseItem.courseId)"></el-button>
                                </div>
                            </div>
                        </el-col>
                    </div>
                </el-row>
            </div>
	    </div>
	</div>

</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as C from '../constants/api';
	import Api from "../utils/api"
	import * as CONST from "../constants/const";
	import utils from  '../utils/misc';
	import pageHeader from '../components/pageHeader';
	import SystemMixin from '../mixins/system';

	export default {
		name: 'dataOverview',
        mixins:[SystemMixin],
		components: {
		    pageHeader
		},

		data(){
			return {
				kind : parseInt(sessionStorage.getItem('kind')) ,
				adminAccount : sessionStorage.getItem('adminAccount') ,
				examStart:'',
                courseId:'',
                courseTypeArr: ['音频', '视频', 'DOC', 'PPT', 'PDF']
            }
		},

		watch: {

		},

		beforeMount() {
			this.getHomePage(this.homePageParam);
        },
        created () {

        },
        mounted() {
        	//this.examStart = item.examStart;
        	//console.log(this.examStart,'打印一下初始时间')


        },

		computed:{

			homePageParam() {
                // sessionStorage.getItem('kind') !== null ? this.kind = parseInt(this.kind) : this.kind = ''
                return {
                    kind:this.kind,
                };
            },
            ...mapState({
                examArrangeRespList: ({dataOverview}) => dataOverview.examArrangeRespList,
                examCourseRespList: ({dataOverview}) => dataOverview.examCourseRespList,


            }),
        },

		methods: {
            filterTime(time1,time2) {
              let reg = new RegExp('-', 'g')
              let newStr1 = time1.replace(reg, '/')
              let newStr2 = time2.replace(reg, '/')

              if(newStr1.substring(0,10) === newStr2.substring(0,10)){
                  return newStr1.substring(newStr1.length-3, -1) + ' — '+ newStr2.substring(11,22);
              }else{
                  return newStr1.substring(newStr1.length-3, -1) + ' — ' + newStr2.substring(newStr2.length-3, -1)
              }
            },
            subStringTime(time){
                time.substring(0,9);
                return time;
            },
            //判断一下是否显示
			examDeatil(){
				console.log("考试详情")
				this.$router.push('exam/list');

			},
			courseLibrary(){
				console.log('课程的 更多！！')
				this.$router.push('/operationAnalysis/CourseLibrary');
			},

			createExam(){
				this.$router.push('/exam/createMethod');
			},
			addCourse(){
				//console.log("添加课程！！！");
				this.$router.push('/operationAnalysis/addCourse');
			},
            editCourse(){
                //console.log("添加课程！！！");
                this.$router.push('/operationAnalysis/editCourse');
            },
			examDeatilTotalAll(i, name){
				this.$router.push(`/exam/statistic?id=${i}&examName=${name}`);
			},
			examEdit(index){
				console.log(index,'考试里面的编辑')
				this.$router.push({path:'/exam/newExam',query:{id:index,type:1}});

				//this.$router.push({path:'/exam/new',params:{id:index,type:1}});
				//this.$router.push({name:'courseStatistics',params:{courseId:this.courseId}});
			},
			examDel(index){
				console.log(index,'考试里面的删除')
				this.$confirm('确定删除此考试吗？', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    Api.deleteExam({examId:index,type:1,account:sessionStorage.getItem('adminAccount')}).then((res) => {
                        if(res.code == 0 ){
                            //rows.splice(index, 1);
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getHomePage(this.homePageParam);
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
			overviewEditCourse(courseId){
                // 编辑课程
				this.$router.push({name:'addcourse',query:{courseId}});
			},
			courseLibraryStatic(i){
				this.courseId = i;
                this.$router.push({name:'courseStatistics',query:{courseId:this.courseId}});
			},
			courseDel(index) {
                //console.log(index,'我是删除的参数');
                this.$confirm('确定删除此门课程吗？相关学习记录也会一并删除哦', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    //this.courseId = rows[index].courseId;
                    Api.deleteCourse({courseId:index,adminAccount:this.adminAccount}).then((res) => {
                        if(res.code == 0 ){
                            //rows.splice(index, 1);
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getHomePage(this.homePageParam);
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
			...mapActions(["showPageLoading", "hidePageLoading",'getHomePage']),

		},
	};
</script>


<style lang='less'>
  .data-overview {
      .test-content-left-btn{
          float: left !important;
          font-weight: bold;
      }
      .examTime{
          width: 300px;
          clear: both;
          float: left;
      }
      .h-add {
        margin-bottom: 22px;
        height: 32px;
        margin-top: 5px;
      }
  }
</style>

