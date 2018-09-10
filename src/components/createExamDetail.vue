<template>
    <div style="margin-top:70px;" class="createExamDeatil">
            <h5>选择创建方式</h5>
            <!-- <div class="createMethod">
                <p>新建空白试卷</p>
                <p>从试题库选择</p>
                <p>导入</p>
            </div> -->
        
        
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



    

