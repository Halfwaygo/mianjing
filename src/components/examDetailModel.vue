<!--添加事件、编辑事件-->
<template>
    <el-dialog class="addEventStyle" title="题目详情" custom-class="dialog-custom" :modal-append-to-body="false"
               v-model="isShown"  :visible.sync="isDlgVisible" @close='close'>
        <el-form :model="form" :rules="formRules" ref="addForm" class="editExamModel">
            <el-form-item label="所属知识点:" prop="eventId" style="margin:0">
                <el-input v-model="form.eventId" :disabled="handle == 'edit'"></el-input> 
            </el-form-item>
            
            <el-form-item label="难易程度:" prop="eventType" style="margin:0">
                <el-radio-group v-model="form.eventType">
                  <el-radio label="计数事件"></el-radio>
                  <el-radio label="计算事件"></el-radio>
                </el-radio-group>
            </el-form-item> 

            <el-form-item label="" prop="eventType" class='question' style="height:120px;">
                <div class="question-item">【单选题】以下说法正确的是（）</div>
                <div class="question-option"> <el-radio label=""></el-radio>这是错误答案</div>
                <div class="question-option"> <el-radio label=""></el-radio>这是正确答案</div>
                <div class="question-option"> <el-radio label=""></el-radio>这是错误答案</div>
            </el-form-item> 

        </el-form>
        
    </el-dialog>
</template>


<script>

    import {mapActions, mapState} from 'vuex';
    import MessageMixins from '../mixins/message.js';
    //import CommonMixins from '../mixins/common.js';

    export default{
        name: 'editExamModel',

        mixins: [MessageMixins],

        props: {
            title:"title",
            value: Boolean,
            handle: String,
            rowData: {
                type: Object,
                default: () => {
                    return {
                        eventId: '',
                        eventName: '',
                        eventType: '',//计数事件
                    }
                }
            },
            input: Function,
        },

        data() {
            var validateEventId = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入事件ID'));

                } else {
                    if( this.handle == 'add'){
                        this.eventIsExist(this.idExistParams()).then((res) => {
                            if(res.code != 200 ) return;
                            if(res.exist == 0){
                                callback();
                            }else{
                                callback(new Error('事件ID已存在'));
                            }
                        });
                    }else if( this.handle == 'edit'){
                        callback();
                    }
                }
            };

            return {
               // title:"",
                isDlgVisible: false,
                abc:'计数事件',
                /*form:{
                    eventId: "",   //返显eventId
                    eventType: '计算事件',
                },*/

                formRules: {
                    eventId: [
                        { required: true, message: '请输入事件ID', trigger: 'blur' },
                        { validator: validateEventId, trigger: 'blur' }
                    ],
                    eventName: [
                        { required: true, message: '请输入事件名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    eventType: [
                        { required: true, message: '请选择事件类型', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                }
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
            }
        },
        beforeMount() {
            this.getQuestionInfo(this.examDetailParams);
        },

        computed:{
            isShown(){
                return this.value;
            },

            form(){
                return Object.assign({},this.rowData);
            },

            params() {
                return {
                    suffix: this.appid + '.json',
                    ...this.form,
                };
            },


            examDetailParams() {
                return {
                    questionId:'119dfc43-cf8e-4d8b-a341-ff171e857c78',
                };
            },
            ...mapState({
                appid: ({root}) => root.appid,
            }),
        },

        methods: {
            close() {
                this.$refs['addForm'].resetFields(); //清空弹窗的内容
                this.$emit('input', false);
                return false;
            },

            submitForm(formName) {
                var vm = this;
                this.$refs[formName].validate((valid) => {
                    
                    if (valid) {
                        if( this.handle == 'add'){
                            //this.title = "添加";
                            this.addEvent(this.params).then((res) => {
                                vm.callbackMsg('添加成功','添加失败',res,formName)
                            });
                        }else if( this.handle == 'edit'){
                           // this.title = "编辑";
                            this.updateEvent(this.params).then((res) => {
                                vm.callbackMsg('更新成功','更新失败',res,formName);

                            });
                        }

                        this.$emit('input', false);

                    } else {
                        return false;
                    }
                });
            },

            callbackMsg(successMsg,errorMsg,res,formName){
                if(res.code == 200){
                    this.$refs[formName].resetFields(); //清空弹窗的内容
                    if(res.msg == 'success'){
                        this.$message({
                            message: successMsg,
                            type: 'success'
                        });
                        //更新列表
                        this.getListEvents(this.getListParams);
                    }else{
                        this.$message({
                            message: errorMsg,
                            type: 'warning'
                        });
                    }
                    
                }else{
                    this.$message({
                        message: errorMsg,
                        type: 'warning'
                    });
                }
            },


            idExistParams() {
                var form = this.form;
                return {
                    suffix: this.appid + '.json',
                    eventId: form.eventId,
                }
            },

            //...mapActions(["getListEvents", "addEvent", "updateEvent", "eventIsExist"]),
            ...mapActions(["getQuestionInfo", ]),
        }
    }
</script>

<style lang='less' >
    .dialog-custom.el-dialog--small {
        /* width: 600px; */
        .el-dialog__body{
            padding: 0 30px 0 30px;
            .el-input{
                width: 100px;
            }
        }
    }
    .addEventStyle{
        .el-dialog--small {
            width:428px!important;
            height:334px!important;
        }
        .el-dialog__header{
            border-bottom:1px solid #e6e6e6;
            margin-bottom:18px;
            padding:0;
            .el-dialog__title{
                color:#666666;
            }
        }
        .el-form-item{
           /* margin-bottom:20px;*/
        }
        .el-dialog__body{
            .el-form-item__error{
                margin-left:80px;
                margin-top:-2px;
            } 
            .el-form-item__label{
                width:100px;
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
                /*width:273px!important;*/
                height:33px;
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
                width:98px;
                margin-left:15px;
            }

        }
        
    }
    .el-form-item{
       /* margin:0!important;*/
    }
    .editExamModel{
        input{
            border:none;
        }
        input:hover{
            border:none;
        }
        .question{

            .question-item{
                padding-left:23px;
            }
            .question-option{
                padding-left:90px;
            }
        }
        .el-form-item__content{
            line-height: 24px!important;
        }
        
    }
    
    
    
</style>


