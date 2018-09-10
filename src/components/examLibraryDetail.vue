<!--添加事件、编辑事件-->
<template>
    <el-dialog class="addBannerDetailStyle" title="题目详情" custom-class="dialog-custom" :modal-append-to-body="false"
                 :visible.sync="isDlgVisible" @close='close'><!-- v-model="isShown" -->
               <div class="addBannerDetailRow">所属知识点：{{this.questionPointName}}</div>
               <div class="addBannerDetailRow">难易程度：{{this.difficultyLevelName}}</div>
              <div><span class="titleDetailSpan">[{{this.questionTypeName}}] {{this.questionDesc}}({{this.questionAnswer}})</span></div>

                <!-- <el-radio-group v-if="!isCheckBox" v-model="optionRadioId">
                  <el-radio :disabled="true" v-for="(item, index) in questionOptionInfoList"  :key="index" :label="item.optionId" style="text-align:left;display:block;line-height:32px;margin-left:0;">
                     <span>{{ indexZm[index] }}</span>
                     <span>{{item.optionDesc}}</span>
                  </el-radio>
                </el-radio-group> -->

                <el-checkbox-group v-model="optionCheckBoxId">
                    <el-checkbox :disabled="true" v-for="(item, index) in questionOptionInfoList"  :key="index" :label="item.optionId" style="text-align:left;display:block;line-height:32px;margin-left:0;">
                        <span>{{ indexZm[index] }}</span>
                        <span>{{item.optionDesc}}</span>
                    </el-checkbox>
                </el-checkbox-group>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="close()" class="submit">
            确定</el-button>
            <!-- <div @click="aa">adssssssssssssssssss</div>   -->
        </div>
    </el-dialog>
</template>


<script>

    import {mapActions, mapState} from 'vuex';
    import MessageMixins from '../mixins/message.js';
    import Api from "../utils/api"
    //import CommonMixins from '../mixins/common.js';

    export default{
        name: 'examLibraryDetail',

        mixins: [MessageMixins],

        props: {
            title:"title",
            value: Boolean,
            handle: String,
            rowData: {
                type: Object,
                default: () => {
                    return {
                        questionId:'',
                        questionPointName:'',
                        difficultyLevelName:'',
                        optionDesc:rowData.questionId,
                    }
                }
            },

            input: Function,
        },

        data() {
            return {
                isDlgVisible: false,
                isCheckBox:false,
                abc:'计数事件',
                questionId:'',
                questionPointName:'',
                difficultyLevelName:'',
                questionTypeName:'',
                questionDesc:'',
                questionAnswer:'',
                optionDesc:'',
                questionOptionInfoList:[],
                optionAnswer:2,
                optionInRight:1,
                optionRadioId:"",
                optionCheckBoxId:[],
                indexZm: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
            }
        },

        watch: {
            value(newVal) {
                this.isDlgVisible = newVal;
                //console.log(this.isDlgVisible);  //true false
            },
            isDlgVisible(newVal) {
                if (!newVal) {
                    this.$emit("input", false);
                    this.$emit("close");
                }
            },
            rowData(newVal) {
              this.questionId = newVal.questionId
              this.getDetailInfo()
            }
        },
        beforeMount() {
        },
        computed:{
          ...mapState({
            appid: ({root}) => root.appid,
          }),
        },

        methods: {
            getDetailInfo() {
                 Api.getQuestionInfo({
                    questionId: this.questionId
                 }).then(res => {
                        this.questionPointName = res.data.questionPointName === '' ? '未归类' : res.data.questionPointName
                        this.difficultyLevelName = res.data.difficultyLevelName
                        this.questionTypeName = res.data.questionTypeName
                        this.questionDesc = res.data.questionDesc
                        // 默认选中答案
                        let answerArr = res.data.questionAnswer.split(',')
                        // let answerNum = parseInt(res.data.questionAnswer)
                        // debugger
                        // if(answerArr.length !== 1) {
                          answerArr.forEach(item => {
                            let optionId = res.data.questionOptionInfoList[item-1].optionId
                            this.optionCheckBoxId.push(optionId)
                          })
                        // } else if(answerArr.length === 1) {
                        //     this.optionRadioId = res.data.questionOptionInfoList[answerNum-1].optionId

                        //     console.log(this.optionRadioId);

                        // }

                        if(res.data.questionTypeId == 2){
                            this.isCheckBox = true
                        }

                        this.questionAnswer = res.data.questionAnswer
                        if(res.data.questionAnswer == 1){
                            this.questionAnswer = "A"
                        }else if(res.data.questionAnswer == 2){
                            this.questionAnswer = "B"
                        }else if(res.data.questionAnswer == 3){
                            this.questionAnswer = "C"
                        }else if(res.data.questionAnswer == 4){
                            this.questionAnswer = "D"
                        }else{
                            if(typeof res.data.questionAnswer === "string"){
                                this.questionAnswer = this.questionAnswer.replace("1","A").replace("2","B").replace("3","C").replace("4","D").replace("5","E").replace("6","F");
                            }
                        }
                        this.questionOptionInfoList = res.data.questionOptionInfoList
                        this.optionAnswer = res.data.questionOptionInfoList
                    }).catch(res => {
                    // console.log(JSON.stringify(res))
                })
            },
            close() {
                //this.$refs['addForm'].resetFields(); //清空弹窗的内容
                this.$emit('input', false);
                return false;
            },

            submitForm(formName) {

              //this.$refs['addForm'].resetFields(); //清空弹窗的内容
                this.$emit('input', false);
                return false;
            },



            ...mapActions(["showPageLoading", "hidePageLoading","getQuestionInfo",]),
        }
    }
</script>

<style lang='less'>
    .dialog-custom.el-dialog--small {
        /* width: 600px; */
        .el-dialog__body{
            padding: 0 30px 0 30px;
            .el-input{
                width: 100px;
            }
        }
    }
    .addBannerDetailStyle{
        .titleDetailSpan{
            display:inline-block;
            width:100%;
            word-wrap:break-word;

        }
        .el-checkbox__label,  .el-radio__label{
            display:inline-block;
            width: 380px;
            vertical-align: text-top;
            margin-left: 5px;
            word-wrap:break-word !important;
            line-height: 20px;
            white-space: initial !important;
        }
        .el-dialog--small {
           width: 42% !important;
        }
        .el-dialog__header{
            border-bottom:1px solid #e6e6e6;
            margin-bottom:30px;
            padding:0;
            .el-dialog__title{
                color:#666666;
            }
        }
        .el-form-item{
            margin-bottom:20px;
        }
        .el-dialog__body{
            .el-form-item__error{
                margin-left:80px;
                margin-top:-2px;
            }
            .el-form-item__label{
                width:80px;
                display:inline-block;
                font-size: 14px;
                color:#6d7684;
                text-align: right;
                padding-right:15px;
            }
            .el-form-item__label::before{
                content:''!important;
            }
            .el-input{
                width:273px!important;
                height:33px;

            }
            .el-input__inner{
                border:none;
            }
            .el-radio-group{
                margin-top:9px;
            }
        }
        .dialog-footer{
            .cancelSub{
                width:98px;
                margin-left:-9px;
            }
            .submit{
                width:160px;
                height:32px;
                /*margin-left:15px;*/
            }

        }
        .el-dialog__footer{
            text-align: center;
        }
        .addBannerDetailRow{
            margin-bottom:20px;
        }
    }
</style>


