<template>
    <div class="content" :visible.sync="selectVisible" style="margin-top:75px !important;">
        <el-form ref="addForm" :model="addForm" label-width="100px" class="addCourse-main">
            <div v-if="step == 1">
                <el-form-item label="课程名称: " required>
                    <el-input v-model="courseName" placeholder="请输入课程名称" :maxlength="30"
                              class="addCourseName"></el-input>
                </el-form-item>
                <el-form-item label="课程类型: " required>
                    <el-select v-model="addCourseType" placeholder="请选择" @change="addCourseTypeSel"
                               class="addCourseType1">
                        <el-option
                                v-for="(value, key, index) in addCourseTypes" :value="key" :key="index" :label="value">{{value}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分类: " required>
                    <el-select v-model="courseType1" placeholder="请选择" @change="courseType1Change"
                               class="course-select">
                        <el-option
                                v-for="item in firstCategoryData"
                                :label="item.categoryName"
                                :value="item.categoryId"
                                :key="item.categoryCode"
                        >
                        </el-option>
                    </el-select>

                    <template>
                        <el-select v-model="courseType2" placeholder="请选择" @change="courseType2Change"
                                   class="course-select" :disabled="isShowSel">
                            <el-option
                                    v-for="item in secondCategoryData"
                                    :label="item.categoryName"
                                    :value="item.categoryId"
                                    :key="item.categoryCode">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="课程介绍: " required>
                    <el-input v-model="courseDetail" type="textarea" placeholder="请输入课程描述（不大于300字）"
                              :maxlength="300" style="width:479px;height:95px!important;"></el-input>
                </el-form-item>

                <el-form-item label="课程标签：" required>
                    <el-input v-model="label" placeholder="请输入标签(多个标签用逗号分隔)" class="addCourseLabel"></el-input>
                </el-form-item>
                <div style="display:block;min-height: 200px;">
                    <el-form-item label="课程封面: " required>
                        <ul class="addCourseCover">
                            <li @click="tt1(1)"><el-radio v-model="isDefaultPhoto" label="1">默认封面</el-radio></li>
                            <li @click="tt2(2)"><el-radio v-model="isDefaultPhoto" label="0">自定义封面</el-radio></li>
                        </ul>
                    </el-form-item>
                    <div class="addCourseCoverContent">
                        <div v-show="tt.t1">
                            <ul>
                                <li v-for="(item,index) in imageCover" :key="index" class="addCourseCoverContentImg" style="float:left;display:inline-block;">
                                    <img :src="item.fileIP + item.photoList[index].photoUrl" />
                                    <el-radio v-model="img" :label="item.photoList[index].photoUrl"
                                              @click.native="getPhotoUrl(item.photoList[index])"
                                              class="addCourseCoverRadio">&nbsp
                                    </el-radio>
                                </li>
                            </ul>
                        </div>
                        <div v-show="tt.t2" :disabled="isAddForm">
                            <el-upload :headers="uploadHeaders"
                                       :disabled="isAddForm"
                                       ref="upload"
                                       :action="uploadImgUrl"
                                       :before-upload="beforeUploadCover"
                                       :on-success="uploadCoverSuccess"
                                       :on-remove="removeUploadCover"
                                       :on-error="uploadImgError"
                                       :file-list="imgList"
                                       listType="picture">
                                <el-button size="small" type="primary" :disabled="imgList.length > 0">
                                    点击上传
                                </el-button>
                                <div slot="tip" class="el-upload__tip">只能上传图片文件</div>
                            </el-upload>
                        </div>
                    </div>
                </div>
                <div style="clear:both">
                    <div style=""  id="uploadDoc">
                        <el-form-item label="上传课件: " required style="display:inline-block;float:left;">
                            <el-upload :headers="uploadHeaders"
                                     :disabled="courseFileList.length>0"
                                    ref="upload"
                                    :action="uploadImgUrl"
                                    :before-upload="beforeUploadCourseFile"
                                    :on-success="uploadCourseFileSuccess"
                                    :on-remove="removeUploadCourseFile"
                                    :on-error="uploadImgError"
                                    :file-list="courseFileList"
                                    listType="text"
                                    style="width:150px;">
                                <el-button size="small" type="primary" :disabled="courseFileTitle.length > 0" id="uploadFile">
                                    选择文件
                                </el-button>
                            </el-upload>
                        </el-form-item>
                        <div  id="file_upload_tip"  @mouseover="showTips" @mouseout="hideTips"></div>
                        <div  id="file_upload_tip_content" v-if="isShowTips" >
                            <p>1.文档支持pdf格式；单个文档不要超过20MB</p>
                            <p>2.视频支持MP4格式；单个视频不要超过500MB</p>
                        </div>
                    </div>
                    <div class="isDrag" >
                        <el-form-item label="是否可快进:">
                            <el-radio-group v-model="isDrag" style="marign-top:20px;">
                                <el-radio label="0" @click.native="a">否</el-radio>
                                <el-radio label="1" @click.native="bb">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="middle" style="text-align:center;diaplay:blcok;">
                <el-button type="primary" @click="submit" id="submit">保存</el-button>
                <el-button @click="cancelAddCourse" class="cancel-add">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import utils from "../utils/misc"
    import {mapActions, mapState} from "vuex"
    import * as C from "../constants/api"
    import Api from "../utils/api";
    import {eventBus,num} from '../eventBus'
    import * as INFO from "../utils/uploadFileInfo";
    export default{
        name: "editCourse",
        data(){
            return {
                uploadHeaders: {
                    __DEBUG__DEV__: 1 ,
                    courseType:0,
                },
                isShowSel:true,
                title: '添加课程描述',
                step: 1,
                imgList: [],
                courseFileList: [],
                isUploadImgComplete: true,
                isUploadFileComplete: true,
                secondCategoryList: [],
                thirdCategoryList: [],

                curCourseType: '',
                isAddForm: false,

                addCourseType:'',
                courseType:'',

                courseType1:'',
                courseType2:'',
                //addCourseTypes:'',
                kind : sessionStorage.getItem('kind') ,
                tt: { t1: true, t2: false, tab1: true, tab2: false },
                imageCover:[],
                courseName:'',
                secondLevelCatecoryId:'',
                thirdLevelCatecoryId:'',
                selectVisible:false,
                //disabled:true,
                fileIP:'',

                courseCoverPicTitle:'',
                courseCoverPicUrl:'',

                courseDisplayMode:'',
                bannerSrc:'',
                img:'',
                courseId:'',

                courseFileTitle:'',
                courseFileUrl:'',

                isShow:false,
                courseDetail:'',
                label:'',
                secondLevelCatecoryName:'',
                secCategoryParam:"",
                thicategoryCode:'',
                aa:'',
                isShowTips:false,
                categoryCodes:'',
                isDrag: "0",
                firstCategoryData: [],
                secondCategoryData: [],
                isDefaultPhoto: "1"
            }
        },
        beforeMount() {
            this.courseId = this.$route.query.courseId;
            this.getCourseType();
            this.getCourseDefaultPhoto();
            Api.getCourseDefaultPhoto('').then(res => {
                this.fileIP = res.data.fileIP;  //课程封面存放路径
                res.data.photoList.forEach((item, index) => {
                    this.imageCover.push(res.data);
                });
                //更新的接口
                this.getCourseByCourseId({courseId: this.courseId}).then(res => {
                    this.courseName = res.data.courseName;
                    this.addCourseType = String(res.data.courseType);

                    //分类ID
                    this.secondLevelCatecoryId = res.data.secondLevelCatecoryId;
                    this.thirdLevelCatecoryId = res.data.thirdLevelCatecoryId;

                    this.courseDetail = res.data.courseDetail;

                    this.label = res.data.label;

                    //封面
                    this.courseCoverPicTitle = res.data.courseCoverPicTitle;
                    this.courseCoverPicUrl = res.data.courseCoverPic;

                    this.isDefaultPhoto = String(res.data.isDefaultPhoto);
                    //如果是默认封面，需要设置选中的默认值

                    if (this.isDefaultPhoto === '1') {
                        this.img = this.courseCoverPicUrl.replace(this.fileIP, '');
                    } else {
                        this.imgList = [{
                            name: res.data.courseCoverPicTitle,
                            url: res.data.courseCoverPic
                        }];
                        this.tt2();
                    }

                    //课件
                    this.courseFileTitle = res.data.courseFilePathTitle;
                    this.courseFileUrl = res.data.courseFilePath;

                    if (this.courseFileTitle && this.courseFileUrl) {
                        this.courseFileList = [{name: this.courseFileTitle, url: `${this.fileIP}${this.courseFileUrl}`}];
                    }

                    this.isDrag = String(res.data.isDrag);

                    this.getFirstCategory(this.FirstCategoryParam).then(res => {
                        this.secCategoryParam = res.data[0].categoryCode;
                        this.getNextCategory({categoryCode: this.secCategoryParam}).then(rsp => {
                            this.firstCategoryData = rsp.data;
                            //回显第一级分类
                            this.courseType1 = this.secondLevelCatecoryId;

                            this.courseType1Change(this.secondLevelCatecoryId);

                        });
                    });
                });
            });

        },
        created(){

            console.log("this.$route.params", this.$route.params);
            console.log(this.courseId);

        },
        computed:{   //courseType:1
            addForm(){
                return Object.assign({},this.rowData);
            },
            uploadImgUrl(){
                return C.UPLOAD
            },
            FirstCategoryParam(){
                return {
                    kind: this.kind,
                };
            },
            thiCategoryParam(){
                return {
                    categoryCode:this.categoryCodes,
                };
            },
            NextCategoryParam(){
                return {
                    categoryCode:this.secondLevelCatecoryId,
                    //categoryCode: this.categoryCode,
                };
            },
            getCourseParams() {
                return {
                    pageSize: 5,
                    currentPage:1,
                    blurName:this.input,
                    sort:this.sortType,
                    sortType:this.sortPropName,
                    courseType:this.courseTypeTab,
                    categoryCode:this.categoryCodes,
                    courseAdmin:this.courseAdmin,
                    kind:this.kind,
                };
            },

            updateParam() {
                return {
                    courseId: this.courseId,
                    courseName: this.courseName,
                    courseType: this.courseType,
                    secondLevelCatecoryId: this.secondLevelCatecoryId,
                    thirdLevelCatecoryId: this.thirdLevelCatecoryId,
                    courseDisplayMode: this.courseDisplayMode,
                    courseDetail: this.courseDetail,
                    //课程封面
                    courseCoverPicTitle: this.courseCoverPicTitle,
                    courseCoverPicUrl: this.courseCoverPicUrl,
                    //课件
                    courseFileTitle: this.courseFileTitle,  //新求出来的
                    courseFileUrl: this.courseFileUrl,           //新求出来的
                    courseTestStatus: this.courseTestStatus,
                    fileSize: this.fileSize,
                    label: this.label,
                    courseDuration: this.courseDuration,
                    isDrag: parseInt(this.isDrag),
                    // 用户账号
                    operationAdmin: sessionStorage.getItem('adminAccount')
                };
            },
            getCourseByCourseIdParams(){
                return {
                    courseId:this.courseId,
                };
            },

            ...mapState({
                caliberId: ({root}) => root.caliberId,
                data:({course}) => course.data,
                getFirstCategoryData:({course}) => course.getFirstCategoryData,
                getSecCategoryData:({course}) => course.getSecCategoryData,

                getNextCategoryData: ({course}) => course.getNextCategoryData,

                addCourseTypes: ({course}) => course.addCourseTypes,
                courseDisplayModes :({course}) => course.courseDisplayModes,
                courseCoverPicTitles :({course}) => course.courseCoverPicTitles,
                courseTestStatuss :({course}) => course.courseTestStatuss,

                fileSizes :({course}) => course.fileSizes,
                // labels :({course}) => course.labels,
                courseDurations :({course}) => course.courseDurations,
                getFirSel: ({course}) => course.getFirSel,
            }),
        },
        watch: {
            getFirSel: function(newVal, oldVal) {
                console.log(newVal);
            }
        },

        methods:{
             cancelAddCourse() {
              this.$router.go(-1)
            },
            showTips(){
                this.isShowTips = true
            },
            hideTips(){
                this.isShowTips = false
            },
            addCourseTypeSel(v){
                var that=this;

                this.courseType = that.addCourseType;
            },

            getPhotoUrl(url){
                this.courseCoverPicTitle = url.photoName;
                this.courseCoverPicUrl = url.photoUrl;
            },
            courseTypeChange(){
                console.log("选择课程类型");
            },
            getThirdCategoryList(){
                console.log("hi");
            },

            initBanner(index) {
                this.imgList = [];
                this.bannerDesc = index.bannerDesc;
                const obj = { name:'' ,url:index.bannerPicIp + '' +index.bannerPic };
                this.imgList[0] = obj;
                this.dialogFormVisible = true;
                this.bannerSrc = index.bannerPic;
                this.changeBannerId = index.bannerId;
            },

            beforeUploadCover(file) {

                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    this.$message.error('图片格式错误');
                    return false;
                }
            },
            beforeUploadCourseFile(file) {
                if(!this.addCourseType) {
                   this.$message.warning('请先选择上传课程的类型')
                   return false
                }
                let isTypeOk = false;
                let fileTypeList = []
                let fileNames = ['音频','视频','DOC','PPT','PDF']
                if(this.addCourseType == "1"){                    // 音频mp3
                    fileTypeList = INFO.audioFileTypeList
                }else if(this.addCourseType == "2"){              // 视频mp4
                    fileTypeList = INFO.videoFileTypeList
                }else if(this.addCourseType == "3"){              // doc,docx
                    fileTypeList = INFO.docFileTypeList
                }else if(this.addCourseType == "4"){              // ppt,pptx
                    fileTypeList = INFO.pptFileTypeList
                }else if(this.addCourseType == "5"){              //pdf
                    fileTypeList = INFO.pdfFileTypeList
                }
                 fileTypeList.forEach( item => {
                    if( item == file.type){
                        isTypeOk = true;
                    }
                })
                if(!isTypeOk) {
                    this.$message.warning(`只能上传${fileNames[parseInt(this.addCourseType)-1]}的格式文件`)
                }
                return isTypeOk
            },
            uploadCoverSuccess(res) {

                this.courseCoverPicUrl = res.data.fileUrl;
                this.courseCoverPicTitle = res.data.fileTitle;
                this.imgList = [{name:res.data.fileTitle, url: `${res.data.fileIP}${res.data.fileUrl}`}];
            },
            uploadCourseFileSuccess(res){
                this.courseFileUrl = res.data.fileUrl;
                this.courseFileTitle = res.data.fileTitle;
            },
            removeUploadCover() {
                this.courseCoverPicUrl = '';
                this.courseCoverPicTitle = '';
                this.imgList = [];
            },
            uploadImgError() {
                this.$message({
                    type: 'info',
                    message: '上传失败，请重新上传'
                })
            },
            removeUploadCourseFile() {
                this.courseFileUrl = '';
                this.courseFileTitle = '';
            },

            submit(){
                this.courseDisplayMode =  this.courseDisplayModes;
                this.courseTestStatus= this.courseTestStatuss;
                this.fileSize =  this.fileSizes;
                this.courseDuration= this.courseDurations;

                this.updateCourse(this.updateParam).then(res => {
                    if (res.code === 0) {
                        this.$message.success({
                             message: '修改成功',
                             showClose: true
                        })
                        this.$router.back();
                    }
                }).catch(res => {
                    // console.log(JSON.stringify(res))
                });

            },
            close(){

            },
            //一级课程分类
            courseType1Change(currentValue) {
                if (currentValue === null) {
                    return;
                }
                this.courseType2 = ''
                this.secondCategoryData = []
                this.isShowSel = false;
                let obj = this.firstCategoryData.find((item) => {
                    return item.categoryId === currentValue;
                });
                if (obj) {
                    this.secondLevelCatecoryId = obj.categoryId;
                    this.categoryCodes = obj.categoryCode;
                    this.getNextCategory(this.thiCategoryParam).then(res => {
                        this.secondCategoryData = res.data;
                        //回显第二级分类
                        this.courseType2 = res.data[0].categoryId
                    });
                }
            },
            courseType2Change(currentValue){
                if (currentValue === null) {
                    return;
                }
                let obj = this.getNextCategoryData.find((item) => {
                    return item.categoryId === currentValue;
                });

                if (obj) {
                    this.thirdLevelCatecoryId = obj.categoryId;
                    this.categoryCodes = obj.categoryCode;
                }
            },
            //封面的东西
            tt1: function () {
                var me = this;
                me.tt.tab1 = true;
                me.tt.tab2 = false;
                me.tt.t1 = true;
                me.tt.t2 = false;
            },
            tt2: function () {
                var me = this;
                me.tt.tab1 = false;
                me.tt.tab2 = true;
                me.tt.t1 = false;
                me.tt.t2 = true;
            },
            a(){
                this.isDrag = "0";
            },
            bb(){
                this.isDrag = "1";
            },

            ...mapActions(["showPageLoading", "hidePageLoading", "getCourseType","getFirstCategory","getNextCategory","addCourse","getCourseDefaultPhoto","getCourseByCourseId","updateCourse","getCourse"]),

        },
    }

</script>

<style lang='less'>
    .el-textarea textarea{
        height:95px!important;
    }
    .el-form-item__label{
        color:#333333!important;
    }
    .el-form-item.is-required .el-form-item__label:before{
        content:''!important;
    }

    .addCourse-main {
        .cancel-add {
            width: 160px;
            height: 32px;
            line-height: 32px;
            border-radius: 32px;
            color: #9B9B9B !important;
            background: #fff;
            border:1px solid rgba(230,231,237,1) !important;
        }
        .el-select{
            width:160px;
        }
        .addCourseType1{
            width:160px;
            height:36px;
        }
        .addCourseCover{
            display:inline-block;
            li{
                float:left;
                display:inline-block;
            }
            li:nth-child(1){
                margin-right:30px;
            }
        }
        .addCourseCoverContent {
            // height:255px;
            margin-left: 100px;
            .addCourseUpload{
                width:162px;
                height:108px;
                background:#e6e7e8;
                color:#999999;
                font-size: 14px;
            }
        }
        .addCourseCoverContentImg{
            width:133px;
            height:122px;
            border:1px solid #1989fa;
            margin-right:20px;
            padding:13px;
            img{
                width:100px;
                height:80px;

            }
            .addCourseCoverRadio{
                margin-left:40px;
            }
        }

    }
    #uploadFile{
        width:160px;
        height:36px;
        background:#ffffff url(../layouts/images/upload.png) no-repeat 30px center;
        background-size:14px 14px;
        border:1px solid #e6e7ed;
        color:#666666;
        display:inline-block;
    }
    #file_upload_tip{
        display:inline-block;
        width:24px;
        height:24px;
        margin-left:20px;
        float:left;
        background:url(../layouts/images/question-circle.png) no-repeat center;
        background-size:100% 100%;
        margin-top:7px;
    }
    #file_upload_tip_content{
        width:284px;
        height:126px;
        border:1px solid #e6e7ed;
        background:#ffffff;
        border-radius:4px;
        font-size: 14px;
        line-height: 22px;
        color:#666666;
        display:inline-block;
        padding:10px;
        float:left;
        position: relative;
        top:-145px;
        left:-35px;
        /* box-shadow: 2px 4px 1px #000000;*/

    }
    .isDrag{
        display:block;
        .el-radio-group{
            margin-top:10px;
        }
    }
    .el-upload-list{
        width:357px;
        height:30px;
    }
    #submit{
        width:160px;
        height:32px;
        border-radius: 100px;
    }

</style>
