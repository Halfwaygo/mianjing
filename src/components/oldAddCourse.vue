<template>
    <div class="content add-course"   :visible.sync="selectVisible"  style="margin-top:75px !important;">

        <el-form ref="addForm" :model="addForm" label-width="100px" class="addCourse-main">

            <div v-if="step == 1" style="min-height: 950px">
                <el-form-item label="课程名称: " required>
                    <el-input v-model.trim="addForm.courseName" placeholder="请输入课程名称" :maxlength="20" class="addCourseName"></el-input>
                </el-form-item>
                <el-form-item label="课程类型: " required >
                    <el-select  v-model="addCourseType" placeholder="请选择" @change="addCourseTypeSel" class="addCourseType1">
                        <el-option
                                v-for="(value, key, index) in addCourseTypes" :value="key" :key="index" :label="value">{{value}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分类: " required>
                    <el-select  v-model="courseType1" placeholder="请选择" @change="courseType1Change"  class="course-select">
                        <el-option
                                v-for="(item, index) in firstCategoryData"
                                :label="item.categoryName"
                                :value="item.categoryId"
                                :key="index"
                        >
                        </el-option>
                    </el-select>
                   <span @click="showCategory(1)" class="el-icon-plus" style="margin-right:10px"></span>
                    <template>
                        <el-select v-model="courseType2" placeholder="请选择" @change="courseType2Change" class="course-select"  :disabled="isShowSel">
                            <el-option
                                    v-for="(item, index) in secondCategoryData"
                                    :label="item.categoryName"
                                    :value="item.categoryId"
                                    :key="index">
                            </el-option>
                        </el-select>
                        <span v-if="courseType1 !== ''" @click="showCategory(2)" class="el-icon-plus"></span>
                    </template>

                </el-form-item>
                <el-form-item label="课程介绍: " required>
                    <el-input v-model.trim="addForm.courseDetail" type="textarea" placeholder="请输入课程描述（不大于300字）"
                              :maxlength="300" style="width:479px;height:95px!important;"></el-input>
                </el-form-item>

                <el-form-item label="课程标签：" required>
                    <el-input v-model.trim="addForm.label" placeholder="请输入标签(多个标签用逗号分隔)" class="addCourseLabel"></el-input>
                </el-form-item>

                <div style="display:block;">
                    <el-form-item label="课程封面: " required>
                        <ul class="addCourseCover">
                            <li @click="tt1(1)"><el-radio v-model="addForm.courseDisplayMode" :label="1">默认封面</el-radio></li>
                            <li @click="tt2(2)"><el-radio v-model="addForm.courseDisplayMode" :label="0">自定义封面</el-radio></li>
                        </ul>
                    </el-form-item>
                    <div class="addCourseCoverContent">
                        <div v-show="tt.t1">
                            <ul>
                                <li v-for="(item,index) in imageCover" :key="index" class="addCourseCoverContentImg" style="float:left;display:inline-block;">
                                    <img :src="item.fileIP + item.photoList[index].photoUrl" />
                                    <el-radio v-model="addForm.img" :label="index" @click.native="getPhotoUrl(item.photoList[index])" class="addCourseCoverRadio"></el-radio> <!--  :label="index" -->
                                </li>
                            </ul>
                        </div>
                        <div v-show="tt.t2">
                            <el-upload :headers="uploadHeadersFm"
                                       ref="upload"
                                       :action="uploadImgUrl"
                                       :before-upload="beforeUploadCover"
                                       :on-success="uploadCoverSuccess"
                                       :on-remove="removeUploadCover"
                                       :on-error="uploadFmImgError"
                                       :on-progress="uploadFmProgress"
                                       :file-list="imgList"
                                       listType="picture">
                                <el-button size="small" type="primary" :disabled="imgList.length > 0 || uploadPregressFm">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传图片文件</div>
                            </el-upload>
                        </div>
                    </div>
                </div>
                <div style="clear:both" class = "fileDiv">
                    <div style=""  id="uploadDoc">
                        <el-form-item label="上传课件: " required style="display:inline-block;float:left;">
                            <el-upload :headers="uploadHeaders"
                                ref="upload"
                                :action="uploadImgUrl"
                                :before-upload="beforeUploadCourseFile"
                                :on-success="uploadFileSuccess"
                                :on-remove="removeUploadCourseFile"
                                :on-error="uploadImgError"
                                :file-list="courseFileList"
                                multiple
                                :on-progress="uploadProgress"
                                listType="text"
                                style="width:150px;">
                                <el-button size="small" type="primary"

                                     id="uploadFile">选择课件
                                </el-button>
                            </el-upload>
                        </el-form-item>
                        <div  id="file_upload_tip"  @mouseover="showTips" @mouseout="hideTips"></div>
                        <div  id="file_upload_tip_content" v-if="isShowTips" >
                            <p>1.文档支持PDF格式,建议将文档转为PDF格式上传,单个文档不要超过20MB</p>
                            <p>2.视频支持MP4格式,单个视频不要超过2G,建议清晰度为720p</p>
                        </div>
                    </div>
                </div>

                <div class="isDrag" v-if="kindValue === '1' && addCourseType === '2'">
                    <el-form-item label="是否可快进:">
                        <el-radio-group v-model="addForm.isDrag" style="marign-top:20px;">
                            <el-radio label="否" @click.native="aa"></el-radio>
                            <el-radio label="是" @click.native="bb"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <el-form-item label="上传文档: " required style="display:inline-block;float:left;">
                    <el-upload :headers="uploadHeaders"
                               ref="upload"
                               :action="uploadImgUrl"
                               :before-upload="beforeUploadCourseFile"
                               :on-success="uploadCourseFileSuccess"
                               :on-remove="removeUploadCourseFile"
                               :on-error="uploadImgError"
                               :file-list="courseFileList"
                               multiple
                               :on-progress="uploadProgress"
                               listType="text"
                               style="width:150px;">
                        <el-button size="small" type="primary"

                                   id="uploadFile">选择文档
                        </el-button>
                        <!--:disabled="isUploading"-->
                    </el-upload>
                </el-form-item>
            </div>

        </el-form>

        <el-dialog
          :title="addCategoryTitle"
          :visible.sync="isShowAddCategory"
          >
	  		 <add-category  :typeId="addCategoryTypeId" @goAddCategory="toAddCategory"></add-category>
	    </el-dialog>
        <div class="middle" style="text-align:center;diaplay:blcok;margin-top:5px; clear: both">
            <el-button type="primary" @click="submit" id="submit">保存</el-button>
            <el-button @click="cancelAddCourse" class="cancel-add">取消</el-button>
        </div>
    </div>
</template>

<script>
    import utils from "../utils/misc"
    import {mapActions, mapState} from "vuex"
    import * as C from "../constants/api"
    import Api from "../utils/api";
    import {eventBus,num} from '../eventBus'
    import * as INFO from "../utils/uploadFileInfo";
    import addCategory from "./addCategory"
    export default{
        name: "addCourse",
        components: {
          addCategory
        },
        data(){
            return {
                uploadHeaders: {
                    __DEBUG__DEV__: 1 ,
                    courseType: 0,
                    //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, X-File-Name, X-File-Size, X-File-Type'
                },
                kindValue: sessionStorage.getItem( 'kind'),
                uploadHeadersFm: {
                   __DEBUG__DEV__: 1 ,
                    courseType: 0,
                },
                serverIp: '',
                isShowAddCategory: false,
                isUploading: false,
                isShowSel:true,
                isFirstAddLoadData: true, // 是否刚刚进页面
                addForm: {
                    courseName: '',
                    courseType: '',
                    firstCategory:'',
                    secCategory:'',
                    secondLevelCatecoryId: '',
                    thirdLevelCatecoryId: '',
                    courseDetail: '',
                    courseCoverPicTitle: '',
                    courseCoverPicUrl: '',
                    courseFileTitle: '',
                    courseFileUrl: '',
                    label: '',
                    fileSize: '',
                    courseTestpaperId: '',
                    courseTestStatus: 0,
                    courseDisplayMode: 1,
                    chapterRequests: [],
                    topicRequests: [],
                    img:'',
                    isDrag:'否',
                },
                uploadPregressFm: false,
                oldAddCourseType: '',
                addCategoryTitle: '添加一级所属分类',
                addCategoryTypeId: '1',
                title: '添加课程描述',
                step: 1,
                imgList: [],
                courseFileList: [],
                isUploadImgComplete: true,
                isUploadFileComplete: true,
                secondCategoryList: [],
                thirdCategoryList: [],
                isAddForm: false,
                courseDetail:'',
                label: '',
                addCourseType:'',
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
                courseCoverPicTitle: '',
                courseCoverPicUrl:'',
                courseDisplayMode:'',
                bannerSrc:'',
                img:'',
                courseId:'',
                courseFileTitle:'',
                courseFileUrl:'',
                isShowTips:false,
                categoryCodes:'',
                firstCategoryData: [],
                secondCategoryData: [],
                operationAdmin:sessionStorage.getItem('adminName'),
                courseFiles:[]

            }
        },

        beforeMount() {
            this.getCourseType();
            this.refreshCotegory();
            Api.getCourseDefaultPhoto('').then(res => {
                this.serverIp = res.data.fileIP
                this.fileIP = res.data.fileIP
                res.data.photoList.forEach((item, index) => {
                    this.imageCover.push(res.data);
                })
            });
        },
        mounted(){
        },
        computed:{   //courseType:1
            uploadImgUrl(){
                return C.UPLOAD
            },
            FirstCategoryParam(){
                return {
                    kind: this.kind,
                };
            },
            NextCategoryParam(){
                return {
                    categoryCode:this.secondLevelCatecoryId,
                    //categoryCode: this.categoryCode,
                };
            },
            thiCategoryParam(){
                return {
                    categoryCode:this.categoryCodes,
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
                    //categoryCode:'00000000',
                    courseAdmin:this.courseAdmin,
                    kind:this.kind,
                };
            },

            addCourseParam() {
                console.log(22222222222);

                return {
                    courseName:this.courseName,
                    courseType:this.addCourseType,
                    secondLevelCatecoryId:this.secondLevelCatecoryId,
                    thirdLevelCatecoryId:this.thirdLevelCatecoryId,
                    courseDetail:this.courseDetail,
                    courseCoverPicTitle:this.courseCoverPicTitle,
                    courseCoverPicUrl:this.fileIP,
                    courseFileTitle:this.courseFileTitle,  //新求出来的
                    courseFileUrl:this.courseFileUrl,           //新求出来的
                    fileSize:this.fileSize,
                    label:this.label,
                    courseDuration:this.courseDuration,
                    courseAdmin:this.adminName,
                    isDrag:this.isDrag,
                    operationAdmin : sessionStorage.getItem('adminAccount')
                };
            },
            getCourseByCourseIdParams(){
                return {
                    courseId:this.courseId,
                };
            },

            ...mapState({
                data:({course}) => course.data,
                addCourseTypes: ({course}) => course.addCourseTypes,
                courseDisplayModes :({course}) => course.courseDisplayModes,
                //courseCoverPicTitles :({course}) => course.courseCoverPicTitles,
                courseTestStatuss :({course}) => course.courseTestStatuss,

                fileSizes :({course}) => course.fileSizes,
                courseDurations :({course}) => course.courseDurations,
            }),
        },
        watch: {
          addCourseType(newVal, oldVal) {
             this.oldAddCourseType = oldVal
          },
          'addForm.label': {
              handler(newVal, oldVal) {
                  console.log(newVal);

              }
          }
        },
        methods:{
            closeCategory() {
              this.$children[1].$children[0].clearText()
            },
            refreshCotegory() {
              this.getFirstCategory(this.FirstCategoryParam).then(res=>{
                    let courseId = this.$route.query.courseId
                    this.secCategoryParam = res.data[0].categoryCode;
                    this.getNextCategory({categoryCode:this.secCategoryParam}).then(res=>{
                        this.firstCategoryData = res.data;
                        if(courseId) {
                        this.getDetailInfo(courseId)
                        }
                    });
               });
            },
            toAddCategory(value, type) {
              let categoryParentCode = ''
              if (type === '1') {
                categoryParentCode = this.secCategoryParam
              } else {
                  this.firstCategoryData.forEach(item => {
                      if(item.categoryId === this.courseType1) {
                        categoryParentCode = item.categoryCode
                      }
                  })
              }
              Api.addCategory({
                    "categoryParentCode": categoryParentCode,
                    "categoryName": value,
                    "categoryDesc": value,
                    "categoryPicPath": "/MGYX/NFS/XXX.JPG",
                    "operationAdmin":"yinhong"
               }).then(() => {
                    if(type === '1') {
                      this.refreshCotegory()
                    } else {
                        this.getNextCategory({categoryCode:categoryParentCode}).then(res=>{
                            this.secondCategoryData = res.data;
                        });
                    }
                    this.isShowAddCategory = false
               })
            },
            // 新增类型窗口
            showCategory(type) {
              if(type === 1) {
                  this.addCategoryTitle = '添加一级所属分类'
                  this.addCategoryTypeId = '1'
              } else {
                  this.addCategoryTitle = '添加二级所属分类'
                  this.addCategoryTypeId = '2'
              }
              this.isShowAddCategory = true
              this.closeCategory()
            },
            // 编辑时获取课程详细信息
            getDetailInfo(courseId) {
               this.isFirstAddLoadData = true
                this.getCourseByCourseId({courseId}).then(resp => {
                   let courseDetail = resp.data
                   // 课程类型
                   this.uploadHeaders.courseType = courseDetail.courseType
                   // 课程名称
                   this.addForm.courseName = courseDetail.courseName
                   // 课程类型
                   // 所属分类第一类
                   this.courseType1 = courseDetail.secondLevelCatecoryId
                   // 所属分类第二类
                  this.courseType2 = courseDetail.thirdLevelCatecoryId
                  this.thirdLevelCatecoryId = courseDetail.thirdLevelCatecoryId
                //    this.courseType2 = courseDetail.thirdLevelCatecoryName
                  // 课程类型
                   this.courseType = String(courseDetail.courseType);
                   this.addCourseType = String(courseDetail.courseType);
                   this.oldAddCourseType = String(courseDetail.courseType);
                   // 课程介绍
                   this.addForm.courseDetail = courseDetail.courseDesc
                   // 课程标签
                   this.addForm.label = courseDetail.label
                   // 默认课程封面
                   let defaultUrl = courseDetail.courseCoverPic.replace(this.serverIp, '');
                   this.imageCover[0].photoList.forEach((item, index) => {
                       if(item.photoUrl === defaultUrl) {
                         this.addForm.img = index
                       }
                   })
                   // 课程封面
                   this.addForm.courseDisplayMode = courseDetail.isDefaultPhoto
                   // 自定义课程封面名称
                   this.courseFileTitle = courseDetail.courseFilePathTitle
                   // 自定义课程封面路径
                   this.fileIP = courseDetail.courseCoverPic
                   // 课程文件存放路径
                   this.courseFileUrl = courseDetail.courseFilePath
                   this.courseCoverPicTitle = courseDetail.courseCoverPicTitle
                   if(courseDetail.isDefaultPhoto === 0) {
                     this.tt2()
                     this.imgList.push({
                        name: courseDetail.courseCoverPicTitle,
                        url: courseDetail.courseIP + courseDetail.courseCoverPic
                     })
                   }
                   if(courseDetail.isDefaultPhoto === 1) {
                     this.tt1()
                   }
                   // 上传课件编辑
                   this.courseFileList .push({
                        name: courseDetail.courseFilePathTitle,
                        url: courseDetail.courseIP + courseDetail.courseFilePath
                    })
                    console.log(this.courseFileList)
                    // 是否可快进
                    this.addForm.isDrag = courseDetail.isDrag === 0 ? '否' : '是'

                })
            },
            // 上传封面
            uploadFmProgress() {
              this.uploadPregressFm = true
            },
            // 上传文件
            uploadProgress() {
               this.isUploading = true
            },
            showTips(){
                this.isShowTips = true;
            },
            hideTips(){
                this.isShowTips = false;
            },
            addCourseTypeSel() {
                this.uploadHeaders.courseType = this.addCourseType
                if(this.courseFileUrl === '' || this.isFirstAddLoadData === true) {
                    return
                }
                 this.$msgbox({
                        title: '消息',
                        message: `此操作将清空已上传的文件，是否继续？`,
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: (action, instance, done) => {
                            if (action == 'confirm') {
                                this.isUploading = false
                                this.courseFileTitle = this.courseFileUrl = ''
                                this.courseFileList = []
                                done()
                            } else {
                                this.addCourseType = this.oldAddCourseType
                                done()
                            }
                        }
                 })
                // this.$confirm('此操作将会清空课件信息, 是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     var that=this;
                //     this.courseType = that.addCourseType
                //     this.uploadHeaders.courseType = this.courseType
                //     this.isUploading = false
                //     this.courseFileTitle = this.courseFileUrl = ''
                //     this.courseFileList = []
                // }).catch(() => {
                //     this.addCourseType = oldval
                // })


            },

            getPhotoUrl(url){
                this.courseCoverPicTitle = url.photoName;
                this.fileIP = url.photoUrl;
            },
            update(){
                this.$emit('on-change', false)
            },
            courseTypeChange(){
                console.log("选择课程类型");
            },
            getThirdCategoryList(){
                //console.log("hi");
            },


            initBanner(index) {
                this.imgList = [];
                this.bannerDesc = index.bannerDesc;
                //this.lxUrl = index.bannerContentUrl;
                const obj = { name:'' ,url:index.bannerPicIp + '' +index.bannerPic }
                this.imgList[0] = obj
                this.dialogFormVisible = true
                this.bannerSrc = index.bannerPic;
                this.changeBannerId = index.bannerId;
            },

            beforeUploadCover(file) {
                if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
                    this.$message.error('只能上传png,jpg的图片格式');
                    return false;
                }
            },
            beforeUploadCourseFile(file) {
                console.log(this.addCourseType);
                let size = file.size / 1024 /1024;
                debugger
                if(String(this.addCourseType) === '5' && size > 20) {
                   this.$message({
                        type: 'info',
                        //    message: "上传文件错误，仅支持'.png'、'jpg'、'bmp'、'gif'和'raw'类型图片"
                        message: "上传的PDF文件不能超过20M"
                    })
                    return false
                }

                if(String(this.addCourseType) === '2' && size > 2024) {
                   this.$message({
                        type: 'info',
                        //    message: "上传文件错误，仅支持'.png'、'jpg'、'bmp'、'gif'和'raw'类型图片"
                        message: "上传的单个视频不能超过2G"
                    })
                    return false
                }

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
            /*图片上传*/
            uploadCoverSuccess(res) {
                this.uploadPregressFm = false
                //this.bannerSrc = `${ res.data.fileUrl }`;
                this.fileIP = res.data.fileIP + res.data.fileUrl;
                this.courseCoverPicTitle = res.data.fileTitle;
                this.imgList = [{name: res.data.fileTitle, url: this.fileIP}];

            },
            /*课件上传成功时*/
            uploadFileSuccess(res,file){
                let fileParam = {
                    fileName:res.data.fileTitle,
                    filePath:res.data.fileUrl,
                    fileCoverPath:this.fileIP,
                    fileType:this.addCourseType,
                    fileUrl : res.data.fileUrl,    //删除判断唯一值
                    fileDesc:"",
                    fileLevel:0,
                    displayMode:1,
                    fileSize:file.size,
                    isDrag:0,
                    fileSort:""
                }
                this.courseFiles.push(fileParam)
                console.log(this.courseFiles)
/*                this.courseFileUrl = res.data.fileUrl;
                this.courseFileTitle = res.data.fileTitle;*/
            },
            /*文档上传成功时*/
            uploadCourseFileSuccess(res,file){
                let fileParam = {
                    fileName:res.data.fileTitle,
                    filePath:res.data.fileUrl,
                    fileCoverPath:this.fileIP,
                    fileType:this.addCourseType,
                    fileUrl : res.data.fileUrl,     //删除判断唯一值
                    fileDesc:"",
                    fileLevel:1,
                    displayMode:1,
                    fileSize:file.size,
                    isDrag:0,
                    fileSort:""
                }
                this.courseFiles.push(fileParam)
                console.log(this.courseFiles)
/*
                this.courseFileUrl = res.data.fileUrl;
                this.courseFileTitle = res.data.fileTitle;
       */
            },
            removeUploadCover(file,fileList) {
                console.log(file)
                console.log(fileList)
                this.uploadPregressFm = false
                this.fileIP = '';
                this.courseCoverPicTitle = '';
                this.imgList = [];
            },
            removeUploadCourseFile(file,fileList) {
                console.log(file)
                this.isUploading = false;
                for(var i = 0 ; i < this.courseFiles.length; i++){
                    if(file.response.data.fileUrl === this.courseFiles[i].fileUrl){
                        this.courseFiles.splice(i,1)
                    }
                }
                console.log(this.courseFiles)
            },
            uploadImgError() {
                this.isUploading = false;
                this.$message({
                    type: 'info',
                    message: '上传失败，请重新上传'
                })
            },
            uploadFmImgError() {
                this.uploadPregressFm = false
                this.isUploading = false
                this.$message({
                    type: 'info',
                    message: '上传失败，请重新上传'
                })
            },

            submit(){
                let vm = this;
                this.courseDisplayMode =  this.courseDisplayModes;
                this.courseTestStatus= this.courseTestStatuss;
                this.fileSize =  this.fileSizes;
                this.courseDuration= this.courseDurations;
                this.courseName = this.addForm.courseName;   //课程名称
                this.courseDetail = this.addForm.courseDetail;   //课程介绍
                this.label = this.addForm.label;   //课程介绍
                let courseId = this.$route.query.courseId
                if(!this.validateEmpty()) {
                    return false
                }
                if(this.label.split(',').length > 2) {
                  this.$message.warning('标签个数不能大于2')
                  return false
                }
                if(!courseId) {
                    this.addCourse(this.addCourseParam).then(res => {
                        if (res.code === 0) {
                            vm.$router.back();
                        }
                    }).catch(res => {
                    });
                } else {
                    this.addCourseParam.courseId = courseId
                    this.updateCourse(this.addCourseParam).then(res => {
                        if (res.code === 0) {
                            this.$message.success({
                                message: '修改成功',
                                showClose: true
                            })
                            this.$router.back();
                        }
                    }).catch(res => {
                    });
                }
            },
            validateEmpty() {
                console.log(this.courseCoverPicTitle)
                console.log(this.courseFileUrl)
              let isTrue = true;
              if(this.addForm.courseName === '') {
                  this.$message.warning('课程名称不能为空')
                  isTrue = false
              }else if(this.addCourseType === '') {
                  this.$message.warning('课程类型不能为空')
                  isTrue = false
              } else if(this.courseType1 === '' || this.courseType2 === '') {
                  this.$message.warning('所属分类不能为空')
                  isTrue = false
              } else if(this.addForm.courseDetail === '') {
                  this.$message.warning('课程介绍不能为空')
                  isTrue = false
              } else if(this.addForm.label === '') {
                  this.$message.warning('课程标签不能为空')
                  isTrue = false
              } else if(this.courseCoverPicTitle === '') {
                  this.$message.warning('课程封面不能为空')
                  isTrue = false
              } else if(this.courseFileUrl === '') {
                  this.$message.warning('课件不能为空')
                  isTrue = false
              }
              return isTrue
            },
            cancelAddCourse() {
              this.$router.go(-1)
            },
            close(){

            },
            //一级课程分类
            courseType1Change(currentValue){
                debugger
                if (currentValue === null) {
                    return;
                }
                this.isShowSel= false;

                let obj = this.firstCategoryData.find((item) => {
                    return item.categoryId === currentValue;
                });

                if (obj) {
                    this.secondLevelCatecoryId = obj.categoryId;
                    this.categoryCodes = obj.categoryCode;
                    // this.courseType2 = ''
                    this.getNextCategory(this.thiCategoryParam).then(res => {
                        this.secondCategoryData = res.data;
                        debugger
                        if(res.data.length === 0) {
                            this.courseType2 = ''
                        }
                        if(!this.isFirstAddLoadData) {
                          this.courseType2= res.data[0].categoryId
                        } else {
                            this.isFirstAddLoadData = false
                        }
                    });
                }
            },
            courseType2Change(currentValue){

                if (currentValue === null) {
                    return;
                }
                let obj = this.secondCategoryData.find((item) => {
                    return item.categoryId === currentValue;
                });

                if (obj) {
                    this.thirdLevelCatecoryId = obj.categoryId;
                    this.categoryCodes = obj.categoryCode;
                }
            },
            //封面的东西
            tt1() {
                var me = this;
                me.tt.tab1 = true;
                me.tt.tab2 = false;
                me.tt.t1 = true;
                me.tt.t2 = false;
            },
            tt2 () {
                var me = this;
                me.tt.tab1 = false;
                me.tt.tab2 = true;
                me.tt.t1 = false;
                me.tt.t2 = true;
            },
            aa(){
                this.isDrag = 0
            },
            bb(){
                this.isDrag = 1
            },


            ...mapActions(["getChapterByCourseId","showPageLoading", "hidePageLoading", "getCourseType","getFirstCategory","getNextCategory","addCourse","getCourseDefaultPhoto","getCourseByCourseId","updateCourse","getCourse"]),

        },
    }

</script>
<style lang='less'>
    .fileDiv{
        height: 200px;
    }
    .add-course {
        #uploadDoc{
            .is-required{
                float: none;
            }
            height: auto;
        }
        .el-icon-plus {
          cursor: pointer;
          color: #1989fa;
        }
    }

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
        min-height: 950px;
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
            line-height: 36px;
            li{
                float:left;
                display:inline-block;
            }
            li:nth-child(1){
                margin-right:30px;
            }
        }
        .addCourseCoverContent{
            /*height:135px;*/
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
    #uploadFile ,#uploadCourseFile {
        width:160px;
        height:36px;
        background:#ffffff;
        border:1px solid #e6e7ed;
        color:#666666;
        display:inline-block;
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
    .isDrag{
        display:block;
        .el-radio-group{
            margin-top:10px;
        }
    }
    #submit {
        width:160px;
        height:32px;
        border-radius: 100px;
    }

   .content .addCourseCoverContent .el-upload-list{
       min-height: 30px;
       height: 100% !important;
   }

</style>
