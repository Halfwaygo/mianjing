<template>
    <div style="margin-top:50px;">
        <div >
            <div class='course-ware' style="margin-top:70px;">
                <el-button class="create-test" type="primary" size="small" @click="createExamDetail">创建考试</el-button>
                <div style="">
                    <el-input class="course-ware-input" v-model="input" placeholder="请输入内容" icon="search" style="width:290px;"></el-input>
                    <el-button style="float:right;width:80px;height:32px;" type="primary" size="small" @click="blurNameClick">搜索</el-button>
                </div>
            </div> 
        </div>

        <div class="" style="top:50px;overflow:hidden;">
            <div class="latest-test">
                <div class="test-content"  ><!-- v-for="item in examArrangeRespList" -->
                    <div class="test-content-left">
                        <h5>初级前端开发测试<el-button type="primary" class="test-content-left-btn">未开始</el-button></h5>
                        <p class="examTime">
                            考试时间：<span>2018-05-20 8：00 -- 2018-05-20 8：00</span>
                        </p>
                        <p class="examPerson">通过率：99</p>
                        <p class="examPerson">平均分：99</p>
                    </div>
                    <div class="test-content-right">
                        <el-button  type="handle edit" size="small" title="编辑" ></el-button>
                        <el-button  type="handle count" size="small" title="统计" ></el-button>
                        <el-button  type="handle delete" size="small" title="删除"></el-button>
                    </div>    
                </div>
            </div>
            <div class="latest-test" >
                <div class="test-content"  ><!-- v-for="item in examArrangeRespList" -->
                    <div class="test-content-left">
                        <h5>初级前端开发测试<el-button type="primary" class="test-content-left-btn">未开始</el-button></h5>
                        <p class="examTime">
                            考试时间：<span>2018-05-20 8：00 -- 2018-05-20 8：00</span>
                        </p>
                        <p class="examPerson">通过率：99</p>
                        <p class="examPerson">平均分：99</p>
                    </div>
                    <div class="test-content-right">
                        <el-button  type="handle edit" size="small" title="编辑" ></el-button>
                        <el-button  type="handle count" size="small" title="统计" ></el-button>
                        <el-button  type="handle delete" size="small" title="删除"></el-button>
                    </div>    
                </div>
                
            </div>
            <div class="latest-test" >
                <div class="test-content"  ><!-- v-for="item in examArrangeRespList" -->
                    <div class="test-content-left">
                        <h5>初级前端开发测试<el-button type="primary" class="test-content-left-btn">未开始</el-button></h5>
                        <p class="examTime">
                            考试时间：<span>2018-05-20 8：00 -- 2018-05-20 8：00</span>
                        </p>
                        <p class="examPerson">通过率：99</p>
                        <p class="examPerson">平均分：99</p>
                    </div>
                    <div class="test-content-right">
                        <el-button  type="handle edit" size="small" title="编辑" ></el-button>
                        <el-button  type="handle count" size="small" title="统计" ></el-button>
                        <el-button  type="handle delete" size="small" title="删除"></el-button>
                    </div>    
                </div>
                
            </div>
            <div class="latest-test" >
                <div class="test-content"  ><!-- v-for="item in examArrangeRespList" -->
                    <div class="test-content-left">
                        <h5>初级前端开发测试<el-button type="primary" class="test-content-left-btn">未开始</el-button></h5>
                        <p class="examTime">
                            考试时间：<span>2018-05-20 8：00 -- 2018-05-20 8：00</span>
                        </p>
                        <p class="examPerson">通过率：99</p>
                        <p class="examPerson">平均分：99</p>
                    </div>
                    <div class="test-content-right">
                        <el-button  type="handle edit" size="small" title="编辑" ></el-button>
                        <el-button  type="handle count" size="small" title="统计" ></el-button>
                        <el-button  type="handle delete" size="small" title="删除"></el-button>
                    </div>    
                </div>
                
            </div>


            
           
        </div>
        
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

    import addEvent from  '../mixins/addEvent';
    import className from  '../mixins/className';

    import hex_md5 from '../utils/md5';



    export default {
        name: 'examDetails',

        mixins: [addEvent,className],

        components: {
            pageHeader,  Tab,
        },

        data(){
            return {
                input:'',

            }
        },

        watch: {
           
        },

        beforeMount() {
            this.getExamInfoExamCondition(this.getExamInfoExamConditionParam)
        },
        created () {

        },

        mounted() {
         
            

        },

        computed:{ 
            getExamInfoExamConditionParam(){
                return {
                    blurName:this.input,
                    
                    pageSize: 4,
                    sort: 1,
                    sortType: 1,
                    currentPage: 1
                };
            },

            ...mapState({
                webUrl:({circleSelect}) => circleSelect.webUrl,

            }),
        },
        
        methods: {
            createExamDetail(){
                console.log("跳转到创建考试页面");
                this.$router.push('/operationAnalysis/createExamDetail');
            },
            blurNameClick(){
                //alert('hi');
                var that = this;
                var blurName = this.input;//這是局部變量 沒法到別的地方賦值
                console.log(blurName,'blurName的值');
               // this.getCourse(that.getCourseParams);
                console.log(that.getExamInfoExamConditionParam,'--------------') //這裡面 是要傳參的地方 

            },
           
            
            //getUdcc   生成二维码的接口     , "setAppKey"
            ...mapActions(["showPageLoading", "hidePageLoading",  "getExamInfoExamCondition"]),

        },
    };
</script>


<style lang='less'>
   
</style>



    

