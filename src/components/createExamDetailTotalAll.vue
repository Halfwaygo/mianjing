<template>
    <div style="margin-top:70px;" class="createExamDeatilTotalAll">
        <h5>考试名称：常用的网页加载进度条</h5>
        <div class="createExamDeatilTotalAllMain">
            <ul class="totalTab">
                <li class="active">总体统计</li>
                <li>人员详情</li>
            </ul>
            <div class="totalTabMain">
                <ul class="totalTabMainUl">
                    <li>应参加人数：111</li>
                    <li>已考人数：111</li>
                    <li>已通过人数：111</li>
                    <li>通过率：111</li>
                    <li>平均开始时长：111</li>
                </ul>

                <div class='examDeatilQ'>
                    <div class="examDeatilQuestion">
                        <div class="examDeatilQuestionTitle">1.【单选题】以下说法正确的是（A）  <span>正确率：80%</span></div>
                        <div class="examDeatilQuestionOption"><el-radio class="radio" v-model="examDeatilQuestionOption1" label="1">这是正确答案</el-radio>  进度条 10人</div>
                        <div class="examDeatilQuestionOption"><el-radio class="radio" v-model="examDeatilQuestionOption2" label="1">这是错误答案</el-radio>  进度条 5人</div>
                        <div class="examDeatilQuestionOption"><el-radio class="radio" v-model="examDeatilQuestionOption3" label="1">这是错误答案</el-radio>  进度条 5人</div>
                        
                    </div>
                    <div class="examDeatilQuestion">
                        <div class="examDeatilQuestionTitle">2.【单选题】以下说法正确的是（A）  <span>正确率：80%</span></div>
                        <div class="examDeatilQuestionOption"><el-radio class="radio" v-model="examDeatilQuestionOption1" label="1">这是正确答案</el-radio>  进度条 10人</div>
                        <div class="examDeatilQuestionOption"><el-radio class="radio" v-model="examDeatilQuestionOption2" label="1">这是错误答案</el-radio>  进度条 5人</div>
                        <div class="examDeatilQuestionOption"><el-radio class="radio" v-model="examDeatilQuestionOption3" label="1">这是错误答案</el-radio>  进度条 5人</div>
                        
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
                examDeatilQuestionOption1:'',
                examDeatilQuestionOption2:'',
                examDeatilQuestionOption3:'',

            }
        },

        watch: {
           
        },

        beforeMount() {

        },
        created () {

        },

        mounted() {
         
            

        },

        computed:{ 
            ...mapState({
                AppTypes: ({root}) => root.AppTypes,
               // AppKey: ({root}) => root.AppKey,
                AppVersion: ({root}) => root.AppVersion,
                appid: ({root}) => root.appid,
                appIdArr: ({course}) => course.allApps, //
                //source:({dataOverview}) => dataOverview.list,
                webUrl:({circleSelect}) => circleSelect.webUrl,

            }),
        },
        
        methods: {
            
            
            //getUdcc   生成二维码的接口     , "setAppKey"
            ...mapActions(["showPageLoading", "hidePageLoading",  "getApps"]),

        },
    };
</script>


<style lang='less'>
   .createExamDeatil{
    background:#ffffff;
    margin:16px;
        h5{
            color:#333333;
            font-size: 16px;
            margin:0px auto;
            width:100px;
            height:22px;
            padding-top:60px;
        }
        .createMethod{
            p{
                display:inline-block;
                float:left;
                width:200px;
                height:256px;
                
            }
        }
   }
</style>



    

