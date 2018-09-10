<template>
    <div class="selectRelatedCourseModel" style="z-index:9; width:1000px">
        <el-dialog :visible.sync="selectVisible" @open="openBox" title="选择关联课程" @close='close'  style="margin-top: 20px;z-index:9;">

            <div class="content" >
                <div >
                    <div class="course-options">
                        <label for="">课程类型：</label>
                        <ul class="courseTyle1 tab clearfix" ref='tab'>
                            <li  @click="clickTabItem(index)" v-for="(value,key,index) in getCourseType1"
                                :class="{active: currentTabItemIndex == index}" :key="index">{{value}}</li>
                        </ul>

                    </div>
                    <div class="course-options">
                        <label for="">课程分类：</label>

                        <el-select  v-model="courseType1" placeholder="请选择" @change="courseType1Change"  class="course-select">

                                <el-option
                                v-for="(item, index) in getFirSel"
                                :key="index"
                                :label="item.categoryName"
                                :value="item.categoryCode"
                                >
                                </el-option>
                            </el-select>

                            <el-select ref="selectdisa" v-show="courseType1 !==''" v-model="courseType2" @change="courseType2Change" placeholder="请选择" class="course-select" :disabled="isShow">
                                <el-option
                                v-for="(item, index) in getNextCategoryData"
                                :key="index"
                                :label="item.categoryName"
                                :value="item.categoryCode">
                                </el-option>
                            </el-select>
                    </div>
                    <div class="course-options">
                        <label for="">创建人：</label>
                        <el-select v-model="courseTypePerson" placeholder="请选择" class="course-select"
                                @change="courseTypePersonChange">
                            <el-option
                                    v-for="(item, index) in courseadminList"
                                    :label="item.adminName"
                                    :value="item.adminAccount"
                                    :key="index">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-table :data="SelectRelatedTableData"
                                @sort-change="handleSortChange"
                                style='width:100%;'
                                ref='multipleTable'>
                            <el-table-column label="选择" width="70">
                                <template scope="scope">
                                    <el-radio v-model="radioValue" :label="scope.row.courseId">{{ '' }}</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column label="课程名称" prop="courseName" sortable>
                            </el-table-column>
                            <el-table-column label="课程类型" prop="courseType">
                            </el-table-column>
                            <el-table-column label="课程分类" prop="categoryName" sortable>
                            </el-table-column>
                            <el-table-column label="创建人" prop="adminName" sortable>
                            </el-table-column>
                            <el-table-column label="最后编辑时间" prop="updateTime" sortable>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-wrap">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page.sync="pageNo"
                                :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                                :total="totalCount">
                            </el-pagination>
                        </div>

                    <div style="margin-top: 20px">
                        <!-- <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
                        <el-button @click="toggleSelection()">取消选择</el-button> -->
                    </div>
                    </div>
                    <div slot="footer" class="dialog-footer" style="text-align:center;">
                        <el-button type="primary" @click="submit" class="submit">确定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import * as C from '../constants/api';
    import * as CONST from "../constants/const";
    import utils from  '../utils/misc';
    import pageHeader from '../components/pageHeader';
    import OverviewTable from  '../components/OverviewTable';
    import Api from "../utils/api"


    export default {
        name: 'courseLibrary',

        filters: {
        },

        components: {
            pageHeader,OverviewTable
        },
        /*props:[
            "visible",
            "checkedIndex"
        ],*/
        props:{
            visible:{
                type:Boolean,
                default:false
            },
            checkedIndex:{
                type:String,
                default: ''
            },
            checkedIndexName:{
                type:String,
                default: ''
            }
        },
        data(){
            return {
                courseObj:{},
                radioValue: this.checkedIndex,
                courseType1:'',
                courseType2:'',
                selectVisible:false,

                input: '',
                isShow:true,
                courseType:1,
                courseTypePerson:'',

                kind : parseInt(sessionStorage.getItem('kind')) ,
                SelectRelatedTableData:[],
                multipleSelection: [],
                currentTabItemIndex: 0,
                adminName : sessionStorage.getItem('adminName') ,
                // sortPropName:1,
                // sortType:1,
                sortPropName:'',
                sortType:'',
                courseTypeTab:1,
                bannerSrc: '',
                uploadHeaders: {
                  // __DEBUG__DEV__: 1
                },
                categoryCodes:'',
                isShowS:true,
                currentPage:1,
                courseAdmin:'',
                secCategoryCode:'',
                thiCategoryCode:'',
                secCategoryParam:'',
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            }
        },

        watch: {
            visible(val){
                this.selectVisible = val;
            },
            currentData: function(val){;
                this.currentTabItemIndex = val+1;
            },
            checkedIndex(newVal,old) {
              this.radioValue = newVal
            },
            radioValue(val){
                console.log(val)
                this.courseObj = {
                    id: this.radioValue,
                    courseName:this.checkedIndexName
                };
                this.SelectRelatedTableData.forEach(item => {
                    if(item.courseId === this.radioValue) {
                        this.courseObj.courseName = item.courseName
                    }
                });
            },
        },
        beforeMount() {
            this.getCourseType();
            this.getCourse(this.getCourseParams);
            this.courseTypeTab = 0;
            this.getFirstCategory(this.FirstCategoryParam)
            .then(res=>{
                this.secCategoryParam = res.data[0].categoryCode
                this.getNextCategory({categoryCode:this.secCategoryParam});
            });
            // Api.getCourse(this.getCourseParams).then(res => {
            //         let courseList = res.data.course.courseList;
            //         this.SelectRelatedTableData = courseList.map((item)=> {
            //             item['radio'] = '0';
            //             return item;
            //         });
            //     }).catch(res => {
            // });
            this.refreshPage();
        },

        mounted() {

        },

        computed:{
            total() {
                return this.source.length||0;
            },
            getCourseParams() {
                return {
                    currentPage:this.currentPage,
                    blurName:'',
                    sort:this.sortType,
                    sortType:this.sortPropName,
                    courseType:this.courseTypeTab,
                    categoryCode:this.categoryCode,
                    courseAdmin:this.courseAdmin,
                    kind:this.kind,
                    pageSize: this.pageSize
                };
            },

            FirstCategoryParam(){
                return {
                    kind: this.kind,
                };
            },
            thiCategoryParam(){
                return {
                    categoryCode:this.thiCategoryCode
                };
            },

            ...mapState({

                caliberId: ({root}) => root.caliberId,
                getCourseType1: ({course}) => course.getCourseType1,
                getFirstCategoryData: ({course}) => course.getFirstCategoryData,
                getNextCategoryData: ({course}) => course.getNextCategoryData,
                source:({course}) => course.list,
                courseadminList: ({course}) => course.courseadminList,
                getFirSel: ({course}) => course.getFirSel,


                categoryCode: ({course}) => course.categoryCode,
            }),
        },
        methods: {
            refreshPage(){
                this.getCourse({
                    currentPage: this.pageNo,
                    pageSize: this.pageSize,
                    blurName: this.input,
                    sort: this.sortType,
                    sortType: this.sortPropName,
                    courseType: this.courseTypeTab,
                    categoryCode: this.categoryCodes,
                    courseAdmin: this.courseAdmin,
                    kind: this.kind,
                }).then(resp => {
                    this.totalCount = resp.data.course.totalNum;
                    let courseList = resp.data.course.courseList;
                    this.SelectRelatedTableData = courseList.map((item) => {
                        item['radio'] = '0';
                        return item;
                    });
                })
            },

            handleSizeChange(nSize){
                this.pageSize = nSize;
                this.refreshPage();
                //this.getCourse(this.getCourseParams);
            },
            handleCurrentChange(nPage){
                this.pageNo = nPage;
                this.refreshPage();
                //this.getCourse(this.getCourseParams);
            },
            courseTypePersonChange(v){
                this.courseAdmin = v
                //console.log(v,'想找一下 创建人的参数')
                this.getCourse(this.getCourseParams);
                this.refreshPage();
            },
            //勾选表格
            selectRow(selection, row){
                this.bannerContentUrl = selection[0].courseId   //取出来 要的参数
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {

                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            addCourse(){
                this.$router.push('/operationAnalysis/addcourse');
            },
            //一级课程分类
            courseType1Change(v){
                this.isShow= false
                this.thiCategoryCode = v;  //第一个select取出来的code
                this.categoryCodes = v;
                if(this.thiCategoryCode){
                     this.getNextCategory(this.thiCategoryParam).then((res) => {
                        this.courseType2 = ''

                    });
                }
                this.refreshPage();
            },
            courseType2Change(v){
                this.categoryCodes = v;
                if(this.categoryCodes) {
                  this.refreshPage();
                }
               // this.getCourse(this.getCourseParams)

            },
            submit(){
                this.bannerContentUrl = this.bannerContentUrl;
                this.$emit('child-say',this.courseObj);
                this.close();
            },

            openBox(){
                this.radioValue = this.checkedIndex
                if(this.radioValue === ""){
                    this.pageNo = 1;
                    this.refreshPage();
                }
            },
            close(){
                this.$emit('update:visible', false)
                this.courseType1 = ""
                this.courseType2 = ""
                this.currentTabItemIndex = 0;
                this.courseTypePerson = ""
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            clickTabItem(i) {
                this.currentTabItemIndex = i
                this.$emit('changeTab', i)
                var that = this;
                that.courseTypeTab = i;
                this.refreshPage();
            },
            handleSortChange(col) {
                this.sortPropName = col.prop;
                if(this.sortPropName === 'courseName'){
                    this.sortPropName = 0
                    this.refreshPage();
                    //this.getCourse(this.getCourseParams);
                    //console.log(this.sortPropName)
                }else if(this.sortPropName === 'categoryName'){
                    this.sortPropName = 1
                    this.refreshPage();
                    //this.getCourse(this.getCourseParams);
                    //console.log(this.sortPropName)
                }else if(this.sortPropName === 'adminName'){
                    this.sortPropName = 2
                    this.refreshPage();
                    //this.getCourse(this.getCourseParams);
                    //console.log(this.sortPropName)
                }else if(this.sortPropName === 'updateTime'){
                    this.sortPropName = 3
                    this.refreshPage();
                    //this.getCourse(this.getCourseParams);
                    //console.log(this.sortPropName)
                }

                //asc升序
                //desc降序
                this.sortType = col.order;
                if(this.sortType === 'ascending'){
                    this.sortType = 1
                    this.refreshPage();
                }else if(this.sortType === 'descending'){
                    this.sortType = '-1'
                    this.refreshPage();
                }
                this.refreshPage();
            },
            getCurrentRow(courseId) {
                // console.log(this.SelectRelatedTableData);
                // console.log(`index = ${index}, row= `, typeof row.radio);
                // for (let i = 0; i < this.SelectRelatedTableData.length; i++) {
                //     if (i === index) {
                //         this.SelectRelatedTableData[i].radio = "1";
                //         continue;
                //     }

                //     this.SelectRelatedTableData[i].radio = "0";

                // }
            },
            ...mapActions(["showPageLoading", "hidePageLoading",  "getOverviewData", "getCourseType","getCourse","getFirstCategory","getNextCategory",]),
        },
    };
</script>

<style lang='less'>
    .tab {
        display:inline-block;
        li {
            float: left;
            cursor: pointer;
            text-align:center;
            display:inline-block;
            margin-right:5px;
            width:80px;
            height:36px;
            border:1px solid #e6e7ed;
            text-align: center;
            line-height: 36px;
            font-size: 14px;
            color:#666666;
        }
        .active {
            background:#489efb;
            color:#ffffff;
        }
    }
    .selectRelatedCourseModel{
        .el-dialog--small{
            width: 70% !important;
        }
        .el-dialog__header {
          margin: -18px 30px;
        }
        .content {
          padding-top: 0px;
        }
        .submit{
            width:160px;
            height:32px;
            border-radius: 100px;
        }
        .el-dialog__body{
            padding:0;
        }
        .course-options{
            label{
                width:80px;
                display:inline-block;
                text-align: right;
            }
        }
        .courseTyle1{
            position:relative;
            top:10px;
            left: 84px !important;
        }

    }




</style>

