<!--添加事件、编辑事件-->
<template>
    <el-dialog class="selectEditEventStyle deleteStyle" title="删除事件" custom-class="dialog-custom" :modal-append-to-body="false"
               v-model="isShown"  :visible.sync="isDlgVisible" @close='close'>
        <el-form :model="form" :rules="formRules" ref="addForm">
            <div class="deleteStyleHead"><span></span>是否确认删除该指标，若删除，使用改指标的2个分析图将会同时被删除，确定删除吗？
            </div>
            <div  class="deleteStyleContent">
                <div class="deleteStyleContent1" v-for="(item, dex) in deleteData" :key="dex">
                    <span>{{item.name}}</span>
                    <ul v-for="(subitem, index) in item.indexName" :key="index">
                        <li><span></span>{{subitem}}</li>
                    </ul>
                </div>
            </div>

        </el-form>
        <!-- <el-form :model="form" :rules="formRules" ref="addForm">
            <el-form-item label="事件名称" prop="eventName">
                <el-input v-model="form.eventName"></el-input>
            </el-form-item>
            </el-form>
         -->
        <div slot="footer" class="dialog-footer">
            <el-button type="gray" @click="close()" class="cancelSub">取消</el-button>
            <el-button type="primary" @click="submitForm('addForm')" class="submit">提交</el-button>
        </div>
    </el-dialog>
</template>


<script>

    import {mapActions, mapState} from 'vuex';
    import MessageMixins from '../mixins/message.js';
    //import CommonMixins from '../mixins/common.js';

    export default{
        name: 'HandleDefinedEventDialog',

        mixins: [MessageMixins],

        props: {
            title:"title",
            value: Boolean,
            handle: String,
            rowData: {
                type: Object,
                default: () => {
                    return {
                        ID:''
                    }
                }
            },
            input: Function,
        },

        data() {

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
                    //ID:1
                };
            },


            // getListParams() {
            //     return {
            //         suffix: this.appid + '.json',
            //     };
            // },
            ...mapState({
                appid: ({root}) => root.appid,
                deleteData:({circleSelect}) => circleSelect.deleteData
            }),
        },

        methods: {
            close() {
               // this.$refs['addForm'].resetFields(); //清空弹窗的内容
                this.$emit('input', false);
                return false;
            },

            submitForm(formName) {
                //console.log(form,'-------------------122行')
                var vm = this;
                this.$refs[formName].validate((valid) => {
                     this.addEvent(this.params).then((res) => {
                                vm.callbackMsg('添加成功','添加失败',res,formName)
                            });

                    // if (valid) {
                    //     if( this.handle == 'add'){
                    //         //this.title = "添加";
                    //         this.addEvent(this.params).then((res) => {
                    //             vm.callbackMsg('添加成功','添加失败',res,formName)
                    //         });
                    //     }else if( this.handle == 'edit'){
                    //        // this.title = "编辑";
                    //         this.updateEvent(this.params).then((res) => {
                    //             vm.callbackMsg('更新成功','更新失败',res,formName);

                    //         });
                    //     }

                    //     this.$emit('input', false);

                    // } else {
                    //     return false;
                    // }
                });
            },

            callbackMsg(successMsg,errorMsg,res,formName){
                if(res.code == 200){
                    //this.$refs[formName].resetFields(); //清空弹窗的内容
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

            ...mapActions(["getListEvents", "addEvent", "updateEvent", "eventIsExist"]),
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
    .addEventStyle{
        .el-dialog--small {
            width:428px!important;
            height:334px!important;
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

</style>


