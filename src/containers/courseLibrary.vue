<template>
    <div class="courseLibrsry">
        <div>
            <div class='course-ware' style="margin-top:70px;">
                <el-button  class="create-test" type="primary" size="small" @click="addCourse">添加课程</el-button>
                <div style="">
                    <el-input class="course-ware-input" v-model.trim="input" placeholder="请输入内容" icon="search" style="width:290px;"></el-input>
                    <el-button style="float:right;width:80px;height:32px;" type="primary" size="small" @click="blurNameClick">搜索</el-button>
                </div>
            </div>
            <div class="content">
                <div>
                    <div class="course-options">
                        <label for="">课程类型：</label>
                        <ul class="courseTyle1 tab clearfix" ref='tab'>
                            <li @click="clickTabItem(index)"
                                v-for="(value,key,index) in getCourseType1"
                                :key="index"
                                :class="{active: currentTabItemIndex == index}">{{value}}</li>
                        </ul>
                    </div>
                    <div class="course-options">
                        <label for="">课程分类：</label>
                        <el-select v-model="courseType1" placeholder="请选择" @change="courseType1Change"
                                  style="width:150px">
                            <el-option
                                    v-for="(item, index) in getFirSel"
                                    :label="item.categoryName"
                                    :value="item.categoryCode"
                                    :key="index"
                                    >
                            </el-option>
                        </el-select>

                        <el-select v-show="courseType1 !== ''" v-model="courseType2" @change="courseType2Change"
                        placeholder="请选择"  :disabled="isShow"
                        class="sel-second">
                            <el-option
                                    v-for="(item, index) in getNextCategoryData"
                                    :label="item.categoryName"
                                    :value="item.categoryCode"
                                    :key="index">

                            </el-option>
                        </el-select>
                    </div>
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
                        <el-table :data="tableData"
                                  @sort-change="handleSortChange"
                                  style='width:100%;'
                                  ref='table'
                                  class="libraryTable"
                                  v-loading="loading">
                            <el-table-column label="课程名称" sortable prop="courseName" >
                            </el-table-column>
                            <el-table-column label="课程类型" prop="courseType"><!--  -->
                            </el-table-column>
                            <el-table-column label="课程分类" sortable="custom" prop="categoryName"><!--  -->
                            </el-table-column>
                            <el-table-column label="学习人数" prop="participantCount"><!--  -->
                            </el-table-column>
                            <el-table-column label="创建人" sortable  prop="adminName">
                            </el-table-column>
                            <el-table-column label="最后编辑时间" sortable="custom" prop="updateTime">
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    min-width='115'>
                                <template scope="scope">
                                    <el-button @click.native.prevent="editCourse(scope.$index,tableData)"
                                               type="handle edit"
                                               size="small"
                                               title="编辑">
                                    </el-button>
                                    <el-button @click.native.prevent="countRow(scope.$index,tableData)"
                                               type="handle count" size="small" title="统计"></el-button>

                                    <el-button @click="delCurrentCourse(scope.$index, tableData)"
                                               type="handle delete"
                                               size="small" title="删除">
                                    </el-button>
                                    <!-- <i @click="bindWhitePerson(scope.$index, tableData)" class="el-icon-setting" style="font-size:24px;color:#489EFB;postion:relative;top:-5px;"></i> -->
                                    <i  @click="bindWhitePerson(scope.$index, tableData)"  class="fixed-permission"></i>
                                    <!--v-show = "kind !== 2"-->
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
                </div>
            </div>
        </div>

    <el-dialog
        :visible.sync="showAttendee"
        v-show="showAttendee"
        center
        custom-class="attend-dialog"
        ref="fixdia">
		<attendee  :isShowAttendee="showAttendee" @addPerson="addPerson"  :get-query-person="getPerson" ref="fixatt"></attendee>
    </el-dialog>

    </div>
</template>

<script>

    import {mapActions, mapState} from 'vuex';
    import * as C from '../constants/api';
    import * as CONST from "../constants/const";
    import utils from  '../utils/misc';
    import pageHeader from '../components/pageHeader';
    import Tab from  '../components/Tab';
    //import OverviewTable from  '../components/OverviewTable';
    import editCourse from  '../components/addCourse';
    import Api from "../utils/api"

    import RotateCard from '../components/RotateCard';
    //console.log(sessionStorage.getItem('kind'),',,,,')
    import {eventBus,num} from '../eventBus'
    // 权限设置
    import Attendee from "./exam/attendee"

    export default {
        name: '',

        filters: {
        },

        components: {
            pageHeader,
            Tab,
            RotateCard,
            editCourse,
            Attendee
        },

        data(){
            return {
                getPerson: [],
                showAttendee:false,
                isShow:true,
                input: '',
                courseType1:'',
                courseType2:'',
                courseTypePerson:'',
                pageNo:1,
                pageSize:10,
                pagesize:10,
                totalCount: 0,
                loading:true,
                kind : parseInt(sessionStorage.getItem('kind')) ,
                adminName : sessionStorage.getItem('adminName') ,
                adminAccount : sessionStorage.getItem('adminAccount') ,
                currentTabItemIndex: '',
                courseTypeTab:'',
                tableData: [],
                input:'',
                sortPropName:'',
                sortType:'',
                categoryCodes:'',
                courseId:'',
                rowData: {
                },
                pageCurNum:1,
                pageCurSize: 5,
                courseDisplayMode:'',
                courseAdmin:'',
                currentPage:1,
                secCategoryCode:'',
                thicategoryCode:'',
                secCategoryParam:'',
                categorys:'',
                getNextCategoryData: []
            }
        },

        watch: {
            currentData: function(val){
                console.log(val);
                this.currentTabItemIndex = val;
            },
        },

        beforeMount() {
            console.log(this.kind)
            this.getCourseType();
            //this.getCourseByCourseId(this.getCourseByCourseIdParam);
            this.getFirstCategory(this.FirstCategoryParam)
                .then(res=>{
                    //console.log(res.data[0].categoryCode,'一级的东西哦')
                    this.secCategoryParam = res.data[0].categoryCode
                    // console.log(this.secCategoryParam,'一级的东西哦')
                    this.getNextCategory({categoryCode:this.secCategoryParam});
                    //this.courseadminList.unshift({"adminAccount":"","adminName":"不限",})
                });
             this.refreshPage();
            // this.getCourse(this.getCourseParams).then(res => {
            //     this.tableData = res.data.course.courseList
            // });
            // Api.getCourse(this.getCourseParams)
            //     .then(res => {
            //         console.log(res.data,'查看一下 table的返回值');
            //         this.tableData = res.data.course.courseList
            //     }).catch(res => {
            //     console.log(JSON.stringify(res))
            // })

        },
        computed:{
            total() {
                return this.source.length||0;
            },
            getCourseParams() {
                return {

                    // pageSize: this.pagesize,
                    // currentPage:this.currentPage,
                    currentPage: this.pageNo,
                    pageSize: this.pageSize,
                    blurName:this.input,
                    sort:this.sortType,
                    sortType:this.sortPropName,
                    courseType:this.courseTypeTab,
                    //categoryCode:this.categoryCodes,
                    categoryCode:this.categorys,//thicategoryCode
                    //categoryCode:'00000000',
                    courseAdmin:this.courseAdmin,
                    kind:this.kind,

                };
            },
            //删除的参数
            deleteParams() {
                return {
                    courseId: this.courseId,
                };
            },

            FirstCategoryParam(){
                return {
                    kind: this.kind,
                };
            },
            // NextCategoryParam(){
            //     return {
            //         categoryCode:this.thicategoryCode,
            //     };
            // },
            thiCategoryParam(){
                return {
                    categoryCode:this.thicategoryCode,
                    //categoryCode: this.categoryCode,
                };
            },
            getCourseByCourseIdParam(){
                return {
                    courseId:this.courseId,
                };
            },

            ...mapState({
                caliberId: ({root}) => root.caliberId,
                getCourseType1: ({course}) => course.getCourseType1,
                getFirstCategoryData: ({course}) => course.getFirstCategoryData,
                // getNextCategoryData: ({course}) => course.getNextCategoryData,
                courseadminList: ({course}) => course.courseadminList,

                source:({course}) => course.list,

                categoryCode: ({course}) => course.categoryCode,
                pages: ({course}) => course.pages,   //后台过来的数据 打印下
                getFirSel: ({course}) => course.getFirSel,
                //console.log(pages,'这块是总页数')
            }),
        },

        methods: {
            addPerson (person, lx) {
                let accounts = person.map(item => item.account).toLocaleString()
                this.showAttendee = false
                // 绑定白名单
                if(lx){
                    Api.bindwWhiteCourseId({
                        courseId: this.courseId,
                        accounts,
                        operationAdmin: sessionStorage.getItem('adminAccount')
                    }).then(() => {
                        this.refreshPage()
                    })
                }
            },
            bindWhitePerson(index, rows) {
               this.courseId = rows[index].courseId;
               this.showAttendee = true
               Api.lookWhitePerson({
                   courseId: this.courseId
               }).then((res) => {
                  this.getPerson = res.data.whiteListUserAccount
               })

            },
            refreshPage(){
                this.loading = true;
                this.getCourse(this.getCourseParams).then( resp => {
                    this.tableData = [];
                    this.totalCount = resp.data.course.totalNum;
                    this.tableData =  resp.data.course.courseList;
                    this.loading = false;
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
            addCourse(){
                this.$router.push('/operationAnalysis/addCourse');
            },
            //一级课程分类
            courseType1Change(v){
                this.isShow= false
                this.thicategoryCode = v;  //第一个select取出来的code
                this.categorys = v;
                if(this.categorys){
                    this.courseType2 = ''
                    this.getNextCategory(this.thiCategoryParam).then((res) => {
                        // this.courseType2 = res.data[0].categoryCode;
                        this.getNextCategoryData = res.data
                    })
                }
                this.refreshPage();
            },
            //二级课程分类
            courseType2Change(v){
                this.categorys = v;
                if(v) {
                  this.refreshPage()
                }
            },

            clickTabItem(i) {
                console.log(i)
                this.currentTabItemIndex = i;
                this.$emit('changeTab', i);
                this.courseTypeTab = i;
                this.refreshPage();
            },
            courseTypePersonChange(v){
                this.courseAdmin = v
                this.refreshPage();
            },
            blurNameClick(){
                var that = this;
                var blurName = this.input;
                this.refreshPage();
            },
            handleSortChange(col) {
                this.sortPropName = col.prop;
                if (this.sortPropName == 'courseName') {
                    this.sortPropName = 0;
                } else if (this.sortPropName == 'categoryName') {
                    this.sortPropName = 1;

                } else if (this.sortPropName == 'adminName') {
                    this.sortPropName = 2;

                } else if (this.sortPropName == 'updateTime') {
                    this.sortPropName = 3;
                }

                //asc升序
                //desc降序
                this.sortType = col.order;

                if (this.sortType == 'ascending') {
                    this.sortType = 1
                } else if (this.sortType == 'descending') {
                    this.sortType = '-1'
                }
                this.refreshPage();
            },
            delCurrentCourse(index, rows) {

                this.courseId = rows[index].courseId;
                this.$confirm('确定删除此门课程吗？相关学习记录也会一并删除哦', '提示', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'confirm',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.courseId = rows[index].courseId;
                    this.deleteCourse({courseId: this.courseId , adminAccount: sessionStorage.getItem('adminAccount')}).then((res) => {
                        if (res.code == 0) {
                            rows.splice(index, 1);
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.refreshPage();
                        } else {
                            this.$message({
                                message: '删除失败',
                                type: 'warning'
                            });
                        }
                    });
                }).catch((e) => {
                });

            },
            countRow(index,rows){
                this.courseId = this.tableData[index].courseId;

                this.$router.push({name:'courseStatistics', query:{courseId:this.courseId}});
            },

            editCourse(index,rows){
                this.courseId = this.tableData[index].courseId;
                this.rowData = Object.assign({},rows[index]);
                this.$router.push({name:'addcourse',query:{courseId: this.courseId}});
            },

            ...mapActions(["getAllDepartment","getAllGroupInfo","showPageLoading", "hidePageLoading",  "getOverviewData", "getCourseType","getCourse","getFirstCategory","getNextCategory","deleteCourse","getCourseByCourseId"]),
        },
        created(){
             this.getAllGroupInfo()
             this.getAllDepartment()
        }
    };
</script>

<style  lang='less' >
    .attend-dialog {
        .el-dialog__header {
            line-height: 0px !important;
        }
    }
    .courseLibrsry{
        .course-select::-webkit-input-placeholder {
            color: #aab2bd;
            // font-size: 20px;

        }


        .el-input__inner{
            color:#999999!important;
        }
        .create-test{
            background:#489efb;
        }

        .content .course-options:first-child {
          margin-bottom: 25px;
        }
        .content {
            .fixed-permission {
                &:hover{
                cursor: pointer;
                background-image: url('../layouts/images/fixed-hover.png') !important;
                background-repeat: no-repeat;
                }
                display: inline-block;
                margin-left: 10px;
                width: 32px;
                height: 32px;
                background-image: url('../layouts/images/fixed.png');
                background-repeat: no-repeat;
            }
        }
        .course-options{
            position: relative;
            .sel-second {
                width:150px;
                input {
                    height: 35px !important;
                }
            }
            label{
                width:80px;
                display:inline-block;
                text-align: right;
            }
            .courseTyle1{
                position: absolute;
                top:-10px;
                left:84px;
            }
        }
    }


</style>

