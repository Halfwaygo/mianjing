<!--添加事件、编辑事件-->
<template>
    <el-dialog class="addBannerDetailStyle" title="查看banner详情" custom-class="dialog-custom" :modal-append-to-body="false"
                 :visible.sync="isDlgVisible" @close='close'><!-- v-model="isShown" -->

               <div class="addBannerDetailRow"><label for="">描述：</label>{{rowData.bannerDesc}}</div>
               <div class="addBannerDetailRow"><label for="">课程关联：</label>{{rowData.courseName}}</div>
               <div class="addBannerDetailRow"><label for="">banner图片：</label><img :src="rowData.bannerPicIp +''+rowData.bannerPic" style="width: 200px;height: 120px;margin-top: 6px;"/></div>


        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="close()" class="submit">
            确定</el-button>
        </div>
    </el-dialog>
</template>


<script>

    import {mapActions, mapState} from 'vuex';
    import MessageMixins from '../mixins/message.js';
    //import CommonMixins from '../mixins/common.js';

    export default{
        name: 'addBannerDetailModel',

        mixins: [MessageMixins],

        props: {
            title:"title",
            value: Boolean,
            handle: String,
            rowData: {
                type: Object,
                default: () => {
                    return {
                        bannerDesc: '',
                        eventName: '',
                        eventType: '',//计数事件
                        courseName:'',
                        bannerDesc:'',
                    }
                }
            },
            input: Function,
        },

        data() {
            // var validateEventId = (rule, value, callback) => {
            //     if (value === '') {
            //       callback(new Error('请输入事件ID'));

            //     } else {
            //         if( this.handle == 'add'){
            //             this.eventIsExist(this.idExistParams()).then((res) => {
            //                 if(res.code != 200 ) return;
            //                 if(res.exist == 0){
            //                     callback();
            //                 }else{
            //                     callback(new Error('事件ID已存在'));
            //                 }
            //             });
            //         }else if( this.handle == 'edit'){
            //             callback();
            //         }
            //     }
            // };

            return {
               // title:"",
                isDlgVisible: false,
                abc:'计数事件',
                /*form:{
                    eventId: "",   //返显eventId
                    eventType: '计算事件',
                },*/

                // formRules: {
                //     eventId: [
                //         { required: true, message: '请输入事件ID', trigger: 'blur' },
                //         { validator: validateEventId, trigger: 'blur' }
                //     ],
                //     eventName: [
                //         { required: true, message: '请输入事件名称', trigger: 'blur' },
                //         { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                //     ],
                //     eventType: [
                //         { required: true, message: '请选择事件类型', trigger: 'blur' },
                //         { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                //     ],
                // }
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
            // isShown(){
            //     return this.value;
            // },

            form(){
                return Object.assign({},this.rowData);
            },

            params() {
                return {
                    suffix: this.appid + '.json',
                    ...this.form,
                };
            },


            getListParams() {
                return {
                    suffix: this.appid + '.json',
                };
            },
            ...mapState({
                appid: ({root}) => root.appid,
            }),
        },

        methods: {
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



            ...mapActions([]),
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
        /*width:520px;
        height:413px;*/
        .el-dialog--small {
            padding: 10px 20px;
            width:520px!important;
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
    .addBannerDetailStyle{
        label{
            width:100px;
            /*border:1px solid red;*/
            display:inline-block;
            text-align: right;
        }
        .submit{
            width:160px;
            height:32px;
            text-align:center;
            line-height: 32px;
            border-radius: 100px;
        }
    }

</style>


