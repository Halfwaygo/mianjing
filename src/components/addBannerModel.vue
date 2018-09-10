<!--添加事件、编辑事件-->
<template>
    <div class="add-banner-model">
        <el-dialog  @close="restBannerValue" id="addEventStyles" :title="addtitle" custom-class="dialog-custom" :modal-append-to-body="false"
                    :visible.sync="isDlgVisible" class="addEventStyle">
              <el-form label-width="85px">
                <div v-if="isAddSeeDel==='3'"  class="addBannerDetailRow"><label>描述:</label><span class = "titleDetailSpan">{{addBannerParam.bannerDesc}}</span></div>
                <el-form-item v-else  label="描述: " prop="eventName">
                    <el-input   :maxlength = "200" v-model.trim="addBannerParam.bannerDesc"></el-input>
                </el-form-item>

                <el-form-item label="关联课程: ">
                    <div class="course-name" v-show="courseName != ''">{{ courseName }}</div>
                    <el-button v-if="isAddSeeDel!=='3'"  size="small" class="border-button" @click="selectRelatedCourses">+选择关联课程</el-button>
                </el-form-item>
                <el-form-item label="上传图片: " required>
                    <el-upload :headers="uploadHeaders" :disabled="isAddForm || isAddSeeDel === '3'" ref="upload" :action="uploadImgUrl" :before-upload="beforeUploadImg"
                                :on-success="uploadImgSuccess" :on-remove="removeUploadImg" limit = "1"
                                :on-error="uploadImgError" :on-progress = "imgDisable" :file-list="imgList" listType="picture"  class="addBannerUpload">
                                <el-button v-if="isAddSeeDel !== '3'"  class="border-button" size="small" type="gray" :disabled="imgList.length > 0 || imgDisableFlag" >
                                +选择图片
                                </el-button>
                        <div slot="tip" v-if="isAddSeeDel !== '3'" class="el-upload__tip" style="">只能上传图片文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-show="addtitle !== '查看banner'" @click="submitForm()" class="submit" style="width:160px;">保存</el-button>
                <el-button type="primary" v-show="addtitle === '查看banner'" @click="closeBanner()" class="submit" style="width:160px;">关闭</el-button>
            </div>

        </el-dialog>
        <select-related-course-model :checkedIndexName = "courseName"  :checkedIndex="checkedId" :visible.sync="selectRelatedCourseModelVisible" v-on:child-say="listenToMyBoy"></select-related-course-model>

    </div>

</template>


<script>
    import Api from "../utils/api"
    import * as C from "../constants/api";
    import {mapActions, mapState} from 'vuex';
    import MessageMixins from '../mixins/message.js';
    import selectRelatedCourseModel from  '../components/selectRelatedCourseModel';

    export default{
        name: 'addBannerModel',
        mixins: [MessageMixins],
        components: {
            selectRelatedCourseModel,
        },
        props: {
            addtitle: {
              type: String,
              default: "添加banner"
            },
            isAddSeeDel:{
              type: String,
              default: "1"
            },
            value: Boolean,
            handle: String,
            rowData: {
                type: Object,
                default: () => {
                    return {
                        eventName: ''
                    }
                }
            },
            input: Function
        },

        data() {
            return {
                isDlgVisible: false,
                isEdit: false,
                abc:'计数事件',
                selectRelatedCourseModelVisible:false,
                dialogTrue:false,
                imgList:[],
                uploadHeaders: {
                   __DEBUG__DEV__: 1,
                   courseType:0,
                },
                isAddForm: false,
                imgDisableFlag:false,
                addBannerParam: {
                  bannerPic: '', // 图片地址
                  bannerDesc: '',  // banner描述
                  bannerContentUrl: '',  //课程id
                  bannerAdmin: sessionStorage.getItem( 'adminAccount')
                },
                adminAccount : sessionStorage.getItem('adminAccount'),
                courseName: '',
                checkedId: ''
            }
        },
        watch: {
            value(newVal) {
                this.isDlgVisible = newVal;
            },
            isAddSeeDel(newVal){
            },
            isDlgVisible(newVal) {
                if (!newVal) {
                    this.$emit("input", false);
                    this.$emit("close");
                }
            },
            rowData(v) {
                if (JSON.stringify(v) !== '{}') {
                    this.isEdit = true
                    this.imgList = []
                    this.addBannerParam.bannerPic = v.bannerPic
                    this.addBannerParam.bannerDesc = v.bannerDesc
                    this.addBannerParam.bannerContentUrl = v.courseId
                    this.addBannerParam.bannerId = v.bannerId
                    this.addBannerParam.operationAdmin = sessionStorage.getItem('adminAccount')
                    this.courseName = v.courseName

                    this.checkedId = this.addBannerParam.bannerContentUrl
                    this.imgList.push({"name": '', "url": `${ v.bannerPicIp }${ v.bannerPic }`})
                } else {
                    this.isEdit = false
                }
            }
        },

        computed:{
            uploadImgUrl(){
                return C.UPLOAD
            },
            isShown(){
                return this.value;
            },

            form(){
                return Object.assign({},this.rowData);
            },
            ...mapState({
                appid: ({root}) => root.appid,
            }),
        },

        methods: {
            closeBanner() {
              this.$emit('input', false);
            },
            imgDisable(){
                this.imgDisableFlag = true;
            },
            // 非空判断
            notEmpty() {
              let emptyInfo = ''
              if(this.addBannerParam.bannerDesc === '') {
                  emptyInfo = 'banner描述不能为空'
              } else if(this.courseName === '') {
                  emptyInfo = '关联的课程不能为空'
              } else if (this.imgList.toString() === '') {
                  emptyInfo = '封面图片不能为空'
              }
              return emptyInfo
            },
            restBannerValue() {
              // 描述
              this.addBannerParam.bannerDesc = ''
              // 图片
              this.imgList = []
              // 课程名称
              this.courseName = ''
              // 关闭清除关联课程id
              this.checkedId = ''
            },
            listenToMyBoy: function (v){
              this.addBannerParam.bannerContentUrl = v.id
              this.courseName = v.courseName
              this.checkedId = v.id
            },

            submitForm() {
                let param = {
                    blurName: "",
                    currentPage: 1,
                    kind: 2,
                    pageSize: 10,
                    sort: "",
                    sortType: ""
                };
                if(!this.isEdit) {
                    this.searchBindBanner(param).then( resp => {
                        if(resp.data.totalNum >= 6){
                            this.$message.error('已经存在6个banner')
                            return false;
                        }
                    });
                }
                let info = this.notEmpty()
                if(info) {
                  this.$message({
                    message: info,
                    showClose: true
                  })
                } else if(!this.isEdit) {
                    this.courseBindBanner({
                      'operationAdmin': this.adminAccount,
                      'bannerRequestList':[this.addBannerParam]
                    }).then(() => {
                        this.$message.success({
                            message: '添加成功'
                        })
                        this.$emit('input', false);
                        this.$emit('reFreshBanner');
                    })
                } else if(this.isEdit) {
                    this.updateBindBanner(this.addBannerParam).then(() => {
                        this.$message.success({
                            message: '修改成功'
                        })
                        this.$emit('input', false);
                        this.$emit('reFreshBanner');
                    })
                }
            },
            selectRelatedCourses(){
                this.selectRelatedCourseModelVisible = true;

                // this.checkedId = this.addBannerParam.bannerContentUrl
                // this.checkedId = this.addBannerParam.bannerContentUrl
            },
            beforeUploadImg(file) {
                if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
                    this.$message.error('图片只支持jpg,png格式')
                    return false
                }
              },

            uploadImgSuccess(resp) {
                this.imgDisableFlag = false;
                this.addBannerParam.bannerPic = resp.data.fileUrl
                this.$message({
                    type: 'info',
                    message: '上传成功'
                })
                this.imgList.push({"name": resp.data.fileTitle, "url": `${ resp.data.fileIP }${ resp.data.fileUrl }`})
              },
              removeUploadImg() {
                this.imgList = []
                this.imgDisableFlag = false;
              },
              uploadImgError() {
                this.$message({
                    type: 'info',
                    message: '上传失败，请重新上传'
                });
                this.imgDisableFlag = false;
              },

            ...mapActions(["courseBindBanner","updateBindBanner","searchBindBanner"]),
        }
    }
</script>

<style lang='less'>
.add-banner-model {
    .addBannerDetailRow{
        margin-left:36px;
    }
    .titleDetailSpan{
        display:inline-block;
        width:70%;
        word-wrap:break-word;
        vertical-align:top;
        margin-bottom: 10px;
        margin-left: 16px;
    }
    .dialog-custom.el-dialog--small {
        .el-dialog__body{
            padding: 0 30px 0 30px;
            .el-input{
                width: 100px;
            }
        }
        .course-name {
            display: inline-block;
            margin-top: 18px;
            height: 12px;
        }
    }
    #addEventStyles{
        top: 20px;
        padding: 10px 14px;
        .el-dialog--small {
            padding: 10px 20px;
            width:600px!important;
            height:456px!important;
        }
    }
    .addEventStyle{
        .border-botton {
            background:#ffffff;
            border:1px soild #e6e7ed;
            color: #666;
            width:186px;
            height:36px;
        }
        .el-button--default:not(.confirm){
            color: #666;
            border:1px solid #e6e7ed;
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
                width:255px!important;
                height:33px;
            }
            .el-radio-group{
                margin-top:9px;
            }
        }
        .dialog-footer{
            .submit{
                width:160px;
                height:32px;
                text-align:center;
                line-height: 32px;
                border-radius: 100px;
            }

        }

    }
    .v-modal{
        z-index:2!important;
    }

    .addBannerUpload{
        display:inline-block;
        .el-button.el-button--gray {
            background-color: #fff;
        }
        .el-upload-list{
            width:300px;
        }
        .el-upload__tip {
            margin-top: 14px;
        }
    }
}
</style>


