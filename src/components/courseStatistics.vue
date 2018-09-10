<template>
    <div class="" style=" ">
        <div class="crumb">hello 我是课程 统计 (此处要用面包屑)</div>

        <div class="content">
        	<!-- <p @click="aa">{{this.$route.params.courseId}}</p>   -->
            <p class="course"><label for="">课程名称：</label>{{this.courseName}}</p>
            <p  class="course"><label for="">学习人数：</label>{{this.participantCount}}</p>
            <p  class="course"><label for="">已完成学习人数：</label>{{this.accomplishCount}}/{{this.participantCount}}</p>
    		<div>
                 <el-table :data="sourceList" @sort-change="handleSortChange" style='width:100%;' ref='table'>

                        <el-table-column label="姓名"  prop="userName" >
                        </el-table-column>
                        <el-table-column label="花名" prop="nickname">
                        </el-table-column>
                        <el-table-column label="部门" prop="department">
                        </el-table-column>
                        <!-- <el-table-column label="部门" :filters="departList" :filter-method="filterDepart" prop="department">
                        </el-table-column> -->
                        <el-table-column
                            label="学习进展"
                            prop="courseProgress"
                            sortable>
                            <template scope="scope">
                               <span>{{((scope.row.courseProgress)*100).toFixed()}}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="学习时长"  sortable prop="duration">
                        </el-table-column>
                        <el-table-column label="最近观看时间" sortable prop="lastViewTime">
                        </el-table-column>

            </el-table>
            <div class="pagination-wrap">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="pageNo"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
                </el-pagination>
            </div>
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
	import courseStatisticTable from  '../components/courseStatisticTable';

	export default {
		name: 'appGeneral',

		filters: {
		},

		components: {
		    pageHeader,courseStatisticTable
		},

		data(){
			return {
				input: '',
				courseType:1,
				courseType2:1,
				courseTypePerson:1,
				COURSE_TYPE: CONST.COURSE_TYPE,
				COURSE_TYPE2: CONST.COURSE_TYPE2,
				COURSE_TYPE_PERSON: CONST.COURSE_TYPE_PERSON,
                pageNo:1,
                pageSize:10,
                pagesize:10,
                totalCount: 0,
                courseId:this.$route.query.courseId,
                sourceList:[],
                sortType:'',
                sortPropName:'',
                courseName:'',
                accomplishCount:'',
                participantCount:'',
                currentPage:1,
                department:""
            }
		},

		watch: {

		},

		beforeMount() {
             Api.getCourseCount(this.getCourseCountParams)
                .then(res => {
                    this.courseName = res.data.pageInfo[0].courseName
                    this.participantCount = res.data.pageInfo[0].participantCount
                    this.accomplishCount = res.data.pageInfo[0].accomplishCount
                    this.sourceList = res.data.pageInfo[0].courseUserList
                    this.totalCount = res.data.totalNum;
                    this.sourceList = res.data.pageInfo[0].courseUserList
                }).catch(resp => {})
            // this.refreshPage()
        },

        mounted() {
            //产品对比后的按钮位置
            //this.justifyToolboxLeft();
        },

		computed:{
            departList () {
               /* return this.personInfo.map((item,index) => {
                    return {
                        "text":item.depart,
                        "value":item.depart
                    }
                })*/
            },
			total() {
                return this.source.length||0;
            },

			getCourseCountParams() {
                return {
                    currentPage: this.pageNo,
                    pageSize: this.pageSize,
                    sort:this.sortType,
                    sortType:this.sortPropName,
                    courseId:this.courseId,
                    department:this.department
                };
            },

            ...mapState({
            	caliberId: ({root}) => root.caliberId,
            	source:({course}) => course.courseCount,
            	general:({course}) => course.general,
            }),
        },

		methods: {
            filterDepart (value,row) {
                this.department = value
                this.refreshPage()
            },
            handleSortChange(col) {
                this.sortPropName = col.prop;
                if(this.sortPropName === 'courseProgress'){
                    this.sortPropName = 0
                    this.refreshPage()
                }else if(this.sortPropName === 'duration'){
                    this.sortPropName = 1
                    this.refreshPage()
                }else if(this.sortPropName === 'lastViewTime'){
                    this.sortPropName = 2
                    this.refreshPage()
                }
                //asc升序
                //desc降序
                this.sortType = col.order;
                if(this.sortType == 'ascending'){
                    this.sortType = 1
                    this.refreshPage()
                }else if(this.sortType == 'descending'){
                    this.sortType = '-1'
                    this.refreshPage()
                }

            },
            refreshPage(){
                this.getCourseCount(this.getCourseCountParams).then( resp => {
                    this.totalCount = resp.data.totalNum;
                    this.sourceList = resp.data.pageInfo[0].courseUserList
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
			...mapActions(["showPageLoading", "hidePageLoading","getCourseCount" ]),
		},
	};
</script>

<style lang='less'>
.content{
    .course{
        margin-bottom:15px;
    }
    margin: 24px 0px 20px 20px !important;
}


</style>

