<!--添加事件、编辑事件-->
<template>
     <div>
    <el-dialog class="addEventStyle" id="addEventStyle" title="编辑banner" custom-class="dialog-custom" :modal-append-to-body="false"
                 :visible.sync="isDlgVisible" @close='close'
><!-- v-model="isShown" -->
        <el-form :model="form" :rules="formRules" ref="addForm">
            <el-form-item label="描述: " prop="bannerDesc">
                <el-input v-model="form.bannerDesc"></el-input>
            </el-form-item>
            <el-form-item label="关联课程: ">
                <div style="display:inline-block;">{{rowData.courseName}}</div>
                <el-button size="small" style="background:#ffffff;border:1px soild #e6e7ed;width:186px;height:36px;" @click="selectRelatedCourses"  >+关联课程</el-button>

            </el-form-item>
            <el-form-item label="Banner图片: " required>
                <img :src="rowData.bannerPicIp +''+rowData.bannerPic" style="width: 100px;height: 60px;margin-top: 6px;display:inline-block;"/>
                <el-upload :headers="uploadHeaders" :disabled="isAddForm" ref="upload" :action="uploadImgUrl" :before-upload="beforeUploadImg"
                            :on-success="uploadImgSuccess" :on-remove="removeUploadImg"
                            :on-error="uploadImgError" :file-list="imgList" listType="picture" class="editBannerUpload">
                            <el-button size="small" type="gray" :disabled="imgList.length > 0">
                        +选择图片
                    </el-button>
                    <div slot="tip" class="el-upload__tip">只能上传图片文件</div>
                </el-upload>

            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <!-- <el-button type="gray" @click="close()" class="cancelSub">取消</el-button> -->
            <el-button type="primary" @click="submitForm('addForm')" class="submit">保存</el-button>
        </div>

    </el-dialog>
   <select-related-course-model :visible.sync="selectRelatedCourseModelVisible" v-on:child-say="listenToMyBoy"></select-related-course-model>
        <!-- :visible.sync="feedback" -->
    </div>

</template>


<script>
    import Api from "../utils/api"
    import * as C from "../constants/api";
    import {mapActions, mapState} from 'vuex';
    import MessageMixins from '../mixins/message.js';
    //import CommonMixins from '../mixins/common.js';
    import selectRelatedCourseModel from  '../components/selectRelatedCourseModel';

    export default{
        name: 'addBannerModel',

        mixins: [MessageMixins],
        components: {
            selectRelatedCourseModel,
        },

        props: {

            title:"title",
            value: Boolean,
            handle: String,
            rowData: {
                type: Object,
                default: () => {
                    return {
                        bannerDesc: '',
                        eventType: '',//计数事件
                    }
                }
            },
            input: Function,
        },

        data() {
            var validateEventId = (rule, value, callback) => {
                // if (value === '') {
                //   callback(new Error('请输入事件ID'));

                // } else {
                //     if( this.handle == 'add'){
                //         this.eventIsExist(this.idExistParams()).then((res) => {
                //             if(res.code != 200 ) return;
                //             if(res.exist == 0){
                //                 callback();
                //             }else{
                //                 callback(new Error('事件ID已存在'));
                //             }
                //         });
                //     }else if( this.handle == 'edit'){
                //         callback();
                //     }
                // }
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
                },
                selectRelatedCourseModelVisible:false,
                dialogTrue:false,
                //feedback:'',
                imgList:[],
                uploadHeaders: {
                   __DEBUG__DEV__: 1,
                   courseType:0,
                },
                isAddForm: false,
                bannerDesc:'',
                adminAccount : sessionStorage.getItem('adminAccount') ,
                bannerId:'',
                bannerPic:'',
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
            addForm(){
                return Object.assign({},this.rowData);
            },
            uploadImgUrl(){
                return C.UPLOAD
            },
            // isShown(){
            //     return this.value;
            // },

            form(){
                return Object.assign({},this.rowData);
            },

            updateBindBannersParam() {
                return {
                    bannerDesc:this.form.bannerDesc,
                    bannerContentUrl:this.childWords, //在selectRelateCourseModel里面 已经取出来了
                    bannerId:this.bannerId,
                    bannerPic:this.bannerPic,

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
            listenToMyBoy: function (bannerContentUrl){
                //alert("hi")
              this.childWords = bannerContentUrl
              //console.log(this.childWords)
            },

            submitForm(formName) {
               // alert("hihih")

               this.bannerId = this.rowData.bannerId;
                //console.log(this.bannerId,'查看图片地址')
                this.bannerDesc = this.form.eventName

                this.updateBindBanner(this.updateBindBannersParam)

                var vm = this;
                this.$refs['addForm'].resetFields(); //清空弹窗的内容
                this.$emit('input', false);
                return false;

            },


            selectRelatedCourses(){
               // alert('跳转到关联课程的页面');
                this.selectRelatedCourseModelVisible = true;
                //this.dialogTrue = true;
            },
            beforeUploadImg(file) {
                if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
                    this.$message.error('图片格式错误')
                    return false
                }
              },

            uploadImgSuccess(resp) {
                console.log(resp,'这个是上传的东西')
                this.bannerPic = resp.data.fileUrl
                console.log(this.bannerPic,'这个是上传的东西')
                this.bannerSrc = `${ resp.data.fileUrl }`;
                this.$message({
                    type: 'info',
                    message: '上传成功'
                })
                this.imgList.push({"name": resp.data.fileTitle, "url": `${ resp.data.fileIP }${ resp.data.fileUrl }`})
              },
              removeUploadImg() {
                this.imgList = []
              },
              uploadImgError() {
                this.$message({
                    type: 'info',
                    message: '上传失败，请重新上传'
                })
              },



            ...mapActions(["updateBindBanner",]),
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
    #addEventStyle{
        .el-dialog--small {
            width:600px!important;
            height:410px!important;
        }
    }
    .addEventStyle{
        .el-button--default:not(.confirm){
            border:1px solid #e6e7ed;
        }
        /*.el-dialog--small {
            width:600px!important;
            height:347px!important;
        }*/
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
                width:255px!important;
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
                border-radius: 100px;
            }
            .submit{
                width:160px;
                margin-left:15px;
            }

        }
        .el-dialog__footer{
            text-align: center;
        }

    }
    .v-modal{
        z-index:2!important;
    }
    .editBannerUpload{
        display:inline-block;
        width:300px;
        .el-upload-list{
            width:300px;
        }
    }

</style>


