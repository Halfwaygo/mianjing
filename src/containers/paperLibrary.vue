<template>
    <div class="paperLibrary" style=" ">
        <!-- <div class="crumb">hello 我是试卷库 (此处要用面包屑)</div> -->
        <div class='course-ware' style="margin-top:65px;">
            <el-button class="export" type="primary" size="small" @click="paperLibraryImport">导入</el-button>

            <router-link :to="{name:'newPaper',query:{type:'1',source:'0'}} ">
                <el-button class="create-test" type="primary" size="small">新建空白试卷</el-button>
            </router-link>

            <div style="">
                <el-input class="course-ware-input" v-model.trim="input" placeholder="请输入试卷名称" icon="search" style="width:290px;"></el-input>
                <el-button style="float:right;width:80px;height:33px;" type="primary" size="small"  @click="blurNameClick"><span class="el-icon-search"></span>搜索</el-button>
            </div>
        </div>
        <div class="content">
            <div>
                <el-form ref="form" :model="form" label-width="80px" class="exam-form">
                    <div class="course-options paper-options">
                        <label for="">试卷分类：</label>
                        <el-select v-model="form.paperClass" placeholder="全部" @change="paperTypeChange" class="addCourseType1">
                            <el-option
                                v-for="(item, index) in paperClassify"
                                :key="index"
                                :label="item.paperTypeName"
                                :value="item.paperTypeId" ></el-option>
                        </el-select>
                    </div>
                    <div class="course-options  paper-options">
                        <label for="">创建人：</label>
                        <el-select v-model="courseTypePerson" placeholder="全部" class="course-select" @change="courseTypePersonChange">
                            <el-option
                            v-for="(item, index) in courseadminList"
                            :key="index"
                            :label="item.adminName"
                            :value="item.adminAccount">
                            </el-option>
                        </el-select>

                    </div>
                    <div>
                        <el-table :data="tablePaperLibraryData" @sort-change="handleSortChange" style='width:100%;' ref='table'>
                            <el-table-column label="试卷名称" sortable prop="paperName" >
                            </el-table-column>
                            <el-table-column label="试卷分类" sortable prop="typeName"><!--  -->
                            </el-table-column>
                            <el-table-column label="创建人" sortable prop="authorAdmin">
                            </el-table-column>
                            <el-table-column label="更新时间" sortable  prop="updateTime">
                            </el-table-column>
                            <el-table-column
                            label="操作"
                            min-width='115'>
                            <template scope="scope">
                                <el-button @click.native.prevent="editPaper(scope.$index,tablePaperLibraryData)"   type="handle edit" size="small" title="编辑" ></el-button>
                                <el-button @click="deletePaperibrary(scope.$index,tablePaperLibraryData)" type="handle delete" size="small" title="删除"></el-button>
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
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import * as C from '../constants/api';
    import * as CONST from "../constants/const";
    import Api from "../utils/api"
    import utils from  '../utils/misc';
    import pageHeader from '../components/pageHeader';
    import Tab from  '../components/Tab';
    import paperLibraryTable from  '../components/paperLibraryTable';

    import RotateCard from '../components/RotateCard';

    export default {
        name: 'paperLibrary',

        filters: {
        },

        components: {
            pageHeader, Tab, RotateCard,paperLibraryTable
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

               // pageNo:1,
                pageSize:5,

                form: {
                    difficuty:'',
                    paperClass:'',
                },
                paperTypeId:'',
                courseTypePerson:'',
                tablePaperLibraryData:[],
                sortType:'',
                sortPropName:'',
                paperId:'',
                adminAccount : sessionStorage.getItem('adminAccount') ,
                questionId:null,
                pageNo:1,
                pageSize:10,
                pagesize:10,
                totalCount: 0,
            }
        },

        watch: {

        },

        beforeMount() {
            this.paperClassifyList();
            this.getCourse({"currentPage":1,"pageSize":3,"blurName":"","sort":"","sortType":"","courseType":1,"categoryCode":"","courseAdmin":"","kind":1
            })
            Api.getPaperPage(this.getPaperPageParam)
                .then(res => {
                  this.tablePaperLibraryData = res.data.paperByPageResp;
                  this.totalCount = res.data.totalNum;
                  this.tablePaperLibraryData = res.data.paperByPageResp;
                }).catch(res => {
            })
            // this.refreshPage();

        },

        mounted() {
            //产品对比后的按钮位置
            //this.justifyToolboxLeft();
            console.log(JSON.stringify(this.courseadminList))
        },

        computed:{
            total() {
                return this.source.length||0;
            },
            getPaperPageParam() {
                return {
                    currentPage: this.pageNo,
                    pageSize: this.pageSize,
                    blurName:this.input,
                    paperTypeId:this.paperTypeId,
                    authorAccount:this.courseAdmin,
                    sortField:this.sortPropName,
                    sortType:this.sortType
                };
            },
            deleteParams(){
                return {
                    paperId:this.paperId,
                    operationAdmin:this.adminAccount,
                };
            },

            ...mapState({

                paperClassify: ({paper}) => paper.paperClassify,

                courseadminList: ({course}) => course.courseadminList,
            }),
        },

        methods: {
            refreshPage(){
                this.getPaperPage({
                    currentPage: this.pageNo,
                    pageSize: this.pageSize,
                    blurName:this.input,
                    paperTypeId:this.paperTypeId,
                    authorAccount:this.courseAdmin,
                    sortField:this.sortPropName,
                    sortType:this.sortType
                }).then( resp => {
                    this.totalCount = resp.data.totalNum;
                    this.tablePaperLibraryData = resp.data.paperByPageResp;

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


            //新增下载表格
            // createExam(){
            //     console.log("创建考试");
            //     //this.$router.push('/operationAnalysis/addcourse');
            // },
            paperTypeChange(v){
               this.paperTypeId = v
               this.refreshPage();
            },
            courseTypePersonChange(v){
                this.courseAdmin = v
                this.refreshPage();
            },
            blurNameClick(){
                //alert('hi');
                var that = this;
                var blurName = this.input;//這是局部變量 沒法到別的地方賦值
                this.refreshPage();
               //console.log(blurName,'blurName的值');
               // console.log(that.getCourseParams,'--------------') //這裡面 是要傳參的地方

            },
            handleSortChange(col) {
                this.sortPropName = col.prop;
                if (this.sortPropName == 'paperName') {
                    this.sortPropName = 0
                } else if (this.sortPropName == 'typeName') {
                    this.sortPropName = 1

                } else if (this.sortPropName == 'authorAdmin') {
                    this.sortPropName = 2

                } else if (this.sortPropName == 'updateTime') {
                    this.sortPropName = 3
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
            deletePaperibrary(index,rows){
                //alert("hi")
                //console.log(rows[index],'-----------------')
                //this.courseId = rows[index].courseId;
                this.paperId = rows[index].paperId;
                console.log(this.deleteParams,'---------')
                this.$confirm('确定删除此试卷吗？', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    this.deletePaperById(this.deleteParams).then((res) => {
                        if(res.code == C.CODE_SUCCESS ){
                            rows.splice(index, 1);
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                           // this.getPaperPage(this.getPaperPageParam)
                            this.refreshPage();
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
            editPaper(index,rows){
                this.paperId = rows[index].paperId;
                console.log(this.paperId,'看一下id')
                this.$router.push({path:'/exam/newPaper',query:{type:1,id:this.paperId}})
            },

            changeTabTimebucket(i) {
                this.timebucketTab = this.CATEGORY[i];
                this.getAppGeneralTimebucketData(this.timebucketParams);
            },
            paperLibraryImport(){
                this.$router.push({path:'importExam?type=paper'});
            },
            ...mapActions(["showPageLoading", "hidePageLoading",  "paperClassifyList", "getPaperPage","deletePaperById","getCourse"]),
        },
    };
</script>

<style lang='less'>
    .paper-options{
        float:left;
        margin-right:100px;
    }
    .paperLibrary{
        .addCourseType1{
            width:160px;
        }
        button{
            width:24px;
            height:24px;
        }
    }
    .course-ware{
        .export {
            margin-right:15px;
        }
    }
    .paperLibrary{
        .content{
            margin: 0 0 20px 20px !important;
        }
    }



</style>

