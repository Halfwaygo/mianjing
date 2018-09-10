<template>
    <div class="add-course">
        <div class="title">
            <div class="title-flag">
                {{title}}
            </div>
        </div>

        <el-form ref="addForm" :model="addForm" label-width="100px">
            <div v-if="step == 1">
                <el-form-item label="课程名称: " required>
                    <el-input v-model="addForm.courseName" placeholder="请输入课程名称(不大于100个字符)" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="课程类型: " required>
                    <el-select v-model="addForm.courseType" placeholder="选择课程类型" @change="courseTypeChange">
                        <el-option v-for="(value,key,index) in courseTypeList[0]" :label="value" :value="key" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分类: " required>
                    <el-select v-model="addForm.secondLevelCatecoryId" placeholder="选择课程分类" @change="getThirdCategoryList" class="mr20">
                        <el-option v-for="(one,index) in secondCategoryList" :label="one.categoryName" :value="one.categoryId"
                                   :key="index" ></el-option>
                    </el-select>
                    <el-select v-model="addForm.thirdLevelCatecoryId" placeholder="选择课程分类" :disabled="!addForm.secondLevelCatecoryId" >
                        <el-option v-for="(one, index) in thirdCategoryList" :label="one.categoryName" :value="one.categoryId"
                                   :key="index" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程描述: " required>
                    <el-input v-model="addForm.courseDetail" type="textarea" placeholder="请输入课程描述（不大于300字）"
                              :maxlength="300"></el-input>
                </el-form-item>

                
                <el-form-item label="课程封面: " required>
                    <button class="upload-btn">
                        <input class="hide-dom" type="file" accept="image/*" placeholder=" "
                               @change="uploadImgChange($event)">上传图片</input>
                    </button>
                    <div class="upload-tip">只能上传jpg图片，且不超过500kb</div>
                    <div class="upload-file-show">
                        <div class="img-block">
                            <img :src="uploadImg" style="width: 100px; height: 100px">
                        </div>
                        <span>{{uploadImgName}}</span>
                        <span class="word-btn" @click="deleteImg">删除</span>
                        <a class="word-btn" target="_blank" :href="uploadImg" download>下载</a>
                    </div>
                </el-form-item>
                <el-form-item label="上传课件: " required>
                    <button class="upload-btn">
                        <input class="hide-dom" type="file" accept=".pdf" placeholder=" "
                               @change="uploadFileChange($event)">上传课件</input>
                    </button>
                    <div class="upload-tip">只能上传PDF文件，且不超过10M</div>
                    <div class="upload-file-show">
                        <div class="img-block">
                            <img :src="uploadPDF" style="width: 100px; height: 100px">
                        </div>
                        <span>{{uploadPDFName}}</span>
                        <span class="word-btn" @click="deleteFile">删除</span>
                        <a class="word-btn" target="_blank" :href="uploadPDF" download>下载</a>
                    </div>
                </el-form-item>
                
                <el-form-item label="显示方式: " required>
                    <el-radio v-model="addForm.courseDisplayMode" :label="1" >横屏显示</el-radio>
                    <el-radio v-model="addForm.courseDisplayMode" :label="0" >竖屏显示</el-radio>
                </el-form-item>

                <el-form-item label="课程标签：" required>
                    <el-input v-model="addForm.label" placeholder="请输入标签(多个标签用逗号分隔)"></el-input>
                </el-form-item>

                <el-form-item label="课程封面: " required>
                    <el-upload :headers="uploadHeaders" :action="uploadImgUrl" :before-upload="beforeUploadImg" :on-success="uploadImgSuccess" :on-remove="removeUploadImg"
                               :on-error="uploadImgError" :file-list="imgList"  :disabled="!addForm.courseType">
                        <el-button size="small" type="primary" :disabled="!isUploadImgComplete || imgList.length > 0 || !addForm.courseType" >点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg,png图片</div>
                    </el-upload>
                </el-form-item>

                <el-form-item label="上传课件: " required>
                    <el-upload :headers="uploadHeaders" :action="uploadFileUrl" :before-upload="beforeUploadFile" :on-success="uploadFileSuccess" :on-remove="removeUploadFile"
                               :file-list="fileList"  :disabled="!addForm.courseType">
                        <el-button size="small" type="primary" :disabled="!isUploadFileComplete || fileList.length > 0 || !addForm.courseType" >点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">{{showUploadInfo}}</div>
                    </el-upload>
                </el-form-item>

            </div>

        <div class="middle">

            <el-button type="primary" @click="submit">提交</el-button>
        </div>
        </el-form>
    </div>
</template>

<script>
    import utils from "../utils/misc"
    import {mapActions, mapState} from "vuex"
    import * as C from "../constants/api"
    import * as INFO from "../constants/uploadFileInfo"
    export default{
        name: "addCourse",
        data(){
            return {
                uploadHeaders: {
                //   __DEBUG__DEV__: 1
                },
                addForm: {
                    courseName: '',
                    courseType: '',
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
                //    courseTopicId: '',
                    courseTestStatus: 0,
                    courseDisplayMode: 1,
                    chapterRequests: [],
                    topicRequests: [],
                },
                title: '添加课程描述',
                step: 1,
                imgList: [],
                fileList: [],
                isUploadImgComplete: true,
                isUploadFileComplete: true,
                imgName: '',
                fileName: '',
                check: '',
                levelList: [1, 2],
                isMustTest: 1,
                testsShow: [],
                topicsShow: [],
                courseTopicId: [],
                loading: false,
                oneChapter: {
                    chapterLevel: 1,
                    chapterTitle: '',
                    chapterPageNumber: '',
                },
                chapterList: [
                    {
                        chapterLevel: 1,
                        chapterTitle: '',
                        chapterPageNumber: ''
                    }
                ],
                secondCategoryList: [],
                thirdCategoryList: [],
                uploadImgInfo: INFO.showImgInfo,
                uploadFileInfo: INFO.showFileInfo,
                defaultPageImgUrl: "",
                defaultPDFImgUrl: "../layouts/images/pdf.png",
                defaultDOCImgUrl: "../layouts/images/word.png",
                defaultPPTImgUrl: "../layouts/images/ppt.png",
                defaultVideoImgUrl: "../layouts/images/video.png",
                defaultAudioImgUrl: "../layouts/images/audio.png",
                curCourseType: '',
            }
        },
        computed: {
            ...mapState({
                courseTypeList: ({courseMaintenance}) => courseMaintenance.courseTypeList,
            //    secondCategoryList: ({courseSorts}) => courseSorts.secondCategoryList,
            //    thirdCategoryList: ({courseSorts}) => courseSorts.thirdCategoryList,
                tests: ({courseMaintenance}) => courseMaintenance.tests,
                topics: ({courseMaintenance}) => courseMaintenance.topics,

            }),
            uploadImgUrl(){
                return C.UPLOAD_FILE
            },

            uploadFileUrl(){
                return C.UPLOAD_FILE
            },

            showUploadInfo(){
                return "只能上传" + this.uploadFileInfo[this.addForm.courseType].fileTypeList + "文件"
            }
        },

        mounted(){
            this.getCourseType();
            this.getNextCategory({"categoryCode": "a"}).then(resp => {
                this.secondCategoryList = resp;
            });
            window.localStorage.setItem('flag', '添加课程')
        },
        beforeDestroy(){
            window.localStorage.setItem('flag', 0)
        },
        methods: {
            ...mapActions(["getCourseType", "getNextCategory", "addCourse", "getTestPapers", "getTopicByName"]),
            /*
            uploadImgChange(event){
                if (event.target.files.length == 0) {
                    return;
                }
                const file = event.target.files[0];
                const fileName = event.target.value;
                this.uploadImgName = fileName.substr(fileName.lastIndexOf("\\") + 1)
                let fileType = fileName.substr(fileName.lastIndexOf("."));
                //    const allowed = [".png", ".jpg", ".bmp", "gif", "raw"];
                const allowed = [".jpg"];
                let flag = false;
                allowed.forEach(one => {
                    if (one === fileType) {
                        flag = true;
                    }
                })
                if (!flag) {
                    this.$message({
                        type: 'info',
                        //    message: "上传文件错误，仅支持'.png'、'jpg'、'bmp'、'gif'和'raw'类型图片"
                        message: "上传文件错误，仅支持'jpg'类型图片"
                    })
                    return
                }
                let size = file.size / 1024;
                if (size > 500) {
                    this.$message({
                        type: 'info',
                        //    message: "上传文件错误，仅支持'.png'、'jpg'、'bmp'、'gif'和'raw'类型图片"
                        message: "上传文件大小不能超过500kb"
                    })
                    return
                }

                this.storeImgFile = file;
                let URL = window.URL || window.webkitURL;
                let imgURL = URL.createObjectURL(file);
                this.uploadImg = imgURL;
            },

            uploadFileChange(event){
                if (event.target.files.length == 0) {
                    return;
                }
                const file = event.target.files[0];
                const fileName = event.target.value;
                this.uploadPDFName = fileName.substr(fileName.lastIndexOf("\\") + 1)
                let fileType = fileName.substr(fileName.lastIndexOf("."));
                const allowed = [".pdf"];
                let flag = false;
                allowed.forEach(one => {
                    if (one === fileType) {
                        flag = true;
                    }
                })
                if (!flag) {
                    this.$message({
                        type: 'info',
                        //    message: "上传文件错误，仅支持'.png'、'jpg'、'bmp'、'gif'和'raw'类型图片"
                        message: "上传文件错误，仅支持'pdf'类型图片"
                    })
                    return
                }
                let size = file.size / 1024;
                if (size > 10 * 1024) {
                    this.$message({
                        type: 'info',
                        //    message: "上传文件错误，仅支持'.png'、'jpg'、'bmp'、'gif'和'raw'类型图片"
                        message: "上传文件大小不能超过10Mb"
                    })
                    return
                }

                this.storePDFFile = file;
                let URL = window.URL || window.webkitURL;
                let pdfURL = URL.createObjectURL(file);
                this.uploadPDF = pdfURL;
            },

            deleteImg(){
                this.storeImgFile = '';
                this.uploadImg = this.defaultImg;
                this.uploadImgName = this.defaultImgName;
            },

            deleteFile(){
                this.storePDFFile = '';
                this.uploadPDF = this.defaultPDF;
                this.uploadPDFName = this.defaultPDFName;
            },
            */

            getThirdCategoryList(secondCategoryId){
                this.addForm.thirdLevelCatecoryId = '';
                let secondCategoryCode = '';
                this.secondCategoryList.forEach( one => {
                    if(one.categoryId == secondCategoryId){
                        secondCategoryCode = one.categoryCode;
                    }
                })
                this.getNextCategory({"categoryCode": secondCategoryCode}).then(resp => {
                    this.thirdCategoryList = resp;
                    if(resp.length > 0){
                        this.addForm.thirdLevelCatecoryId = this.thirdCategoryList[0].categoryId
                    }
                });
            },

            beforeUploadImg(file){
                // 上传图片格式和大小验证
                if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
                    this.$message.error('图片格式错误')
                    return false
                }
                let imgSize = this.uploadImgInfo.imgSize
                this.isUploadImgComplete = false;
                return true
            },

            uploadImgSuccess(resp){
                this.isUploadImgComplete = true;
                const {data:{fileTitle, fileUrl, fileIP}} = resp
                this.imgName = fileTitle;
                this.$forceUpdate();
                this.imgList.push({name: this.imgName, url: fileIP + fileUrl})
                this.addForm.courseCoverPicUrl = fileUrl;
                this.addForm.courseCoverPicTitle = fileTitle;
            },

            removeUploadImg(){
                this.imgList = []
                this.isUploadImgComplete = true;
                this.addForm.courseCoverPicUrl = '';
                this.addForm.courseCoverPicTitle = '';
            },

            uploadImgError(){
                this.isUploadImgComplete = true;
                this.$message({
                    type: 'info',
                    message: '上传失败，请重新上传'
                })
                this.addForm.courseCoverPicUrl = '';
                this.addForm.courseCoverPicTitle = '';
            },

            courseTypeChange(nval){
                if(this.fileList.length > 0){
                    this.$msgbox({
                        title: '消息',
                        message: `此操作将清空已上传的文件，是否继续？`,
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: (action, instance, done) => {
                            if (action == 'confirm') {
                                setTimeout(() => {
                                    done()
                                }, 300)
                                this.removeUploadImg();
                                this.removeUploadFile();
                            } else {
                                this.addForm.courseType = this.curCourseType
                                this.$message({
                                    type: 'info',
                                    message: '已取消'
                                })
                                done()
                            }
                        }
                    })
                }
            },

            beforeUploadFile(file){
                let isTypeOk = false;
                let fileTypeList = [];   // 根据选择的课程类型，选取相应的文件类型列表
                if(this.addForm.courseType == "1"){                    // 音频mp3
                    fileTypeList = INFO.audioFileTypeList
                }else if(this.addForm.courseType == "2"){              // 视频mp4
                    fileTypeList = INFO.videoFileTypeList
                }else if(this.addForm.courseType == "3"){              // doc,docx
                    fileTypeList = INFO.docFileTypeList
                }else if(this.addForm.courseType == "4"){              // ppt,pptx
                    fileTypeList = INFO.pptFileTypeList
                }else if(this.addForm.courseType == "5"){              //pdf
                    fileTypeList = INFO.pdfFileTypeList
                }
                fileTypeList.forEach( one => {
                    if( one == file.type){
                        isTypeOk = true;
                    }
                })
                if(!isTypeOk){
                    this.$message.error('只能上传 ' + this.uploadFileInfo[this.addForm.courseType].fileTypeList + ' 格式的文件')
                    return isTypeOk
                }
                let fileSize = this.uploadFileInfo[this.addForm.courseType].fileSize
                let thisFileSize = (file.size / 1024 / 1024).toFixed(1);
                const isSizeOk = thisFileSize <= parseInt(fileSize)
                // if(!isSizeOk){
                //     this.$message.error('只能上传小于 ' + fileSize + ' Mb的文件')
                //     return isSizeOk
                // }
                this.addForm.fileSize = thisFileSize;
                this.isUploadFileComplete = false;
                return isTypeOk;
            },

            uploadFileSuccess(resp){
                this.isUploadFileComplete = true;
                const {data: {fileUrl, fileTitle}} = resp
                this.fileName = fileTitle;
                this.$forceUpdate();
                let fileDefalutImg = '';
                if(this.addForm.courseType == "1"){
                    fileDefalutImg = this.defaultAudioImgUrl
                }else if(this.addForm.courseType == "2"){
                    fileDefalutImg = this.defaultVideoImgUrl
                }else if(this.addForm.courseType == "3"){
                    fileDefalutImg = this.defaultDOCImgUrl
                }else if(this.addForm.courseType == "4"){
                    fileDefalutImg = this.defaultPPTImgUrl
                }else if(this.addForm.courseType == "5"){
                    fileDefalutImg = this.defaultPDFImgUrl
                }
                this.fileList.push({name: fileTitle, url: fileDefalutImg})
                this.curCourseType = this.addForm.courseType;
                this.addForm.courseFileUrl = fileUrl;
                this.addForm.courseFileTitle = fileTitle;
            },

            removeUploadFile(){
                this.fileList = []
                this.isUploadFileComplete = true;
                this.addForm.courseFileUrl = '';
                this.addForm.courseFileTitle = '';
            },

            uploadFileError(){
                this.isUploadFileComplete = true;
                this.$message({
                    type: 'info',
                    message: '上传失败，请重新上传'
                })
                this.addForm.courseFileUrl = '';
                this.addForm.courseFileTitle = '';
            },
            /*
            handlePreviewImg(){
                this.$message({
                    type: 'info',
                    message: 'handlePreviewImg'
                })
            },
            handleRemoveImg(){
                this.$message({
                    type: 'info',
                    message: 'handleRemoveImg'
                })
            },
            */

            stepTo(newStep){
                if(newStep == this.step){
                    return
                }
                if(this.step == 1){
                    let res = this.checkStepOne();
                    if(!res){
                        return
                    }
                }else if (this.step == 2) {
                    let res = this.checkStepTwo();
                    if(!res){
                        return
                    }
                }
                this.step = newStep;
                if (this.step == 1) {
                    this.title = '添加课程描述'
                } else if (this.step == 2) {
                    this.title = '添加课程章节目录'
                } else if (this.step == 3) {
                    this.title = '关联课程周边'
                }
            },

            checkStepOne(){
                // 如果有内容为空，则报警告提示，不允许跳转页面
                let data = this.addForm;
                if(!data.courseName || !data.courseType || !data.secondLevelCatecoryId || !data.courseDetail || !data.label){
                    this.$message({
                        type: 'warning',
                        message: '请完成所有必填项目!'
                    })
                    return false
                }

                if(this.imgList.length == 0){
                    this.$message({
                        type: 'warning',
                        message: '请上传课程封面!'
                    })
                    return false
                }
                if(this.fileList.length == 0){
                    this.$message({
                        type: 'warning',
                        message: '请上传课件!'
                    })
                    return false
                }
                return true
            },

            checkStepTwo(){
                // 最后一列表允许为空，判断最后一列表是否全为空，全为空则章节列表长度减一
                let length = this.chapterList.length;
                let last = this.chapterList[length - 1];
                if(!last.chapterTitle && !last.chapterPageNumber){
                    length = length - 1;
                }
                if(length == 0){
                    this.$message({
                        type: 'info',
                        message: '请至少输入一条章节信息'
                    })
                    return false
                }
                // 循环章节列表，列表中有为空的的字段则报警告提示，不允许跳转页面
                let index = 0;
                while(index < length){
                    if(!this.chapterList[index].chapterTitle || !this.chapterList[index].chapterPageNumber){
                        this.$message({
                            type: 'warning',
                            message: '请完成所有目录或页码信息!'
                        })
                        return false
                    }
                    ++index;
                }
                // 循环章节列表，列表中页面字段大小不是按从小到大排列报错误提示，不允许跳转页面
                index = 0;
                if (length > 1) {
                    while (index < length - 1 ) {
                        let firstPage = this.chapterList[index].chapterPageNumber;
                        let secondPage = this.chapterList[index + 1].chapterPageNumber;
                        if (parseInt(firstPage) > parseInt(secondPage)) {
                            this.$message({
                                type: 'error',
                                message: "章节或页码输入有误！"
                            })
                            return false
                        }
                        ++index;
                    }
                }
                return true;
            },

            addFirstLevel(){
                let firstLevel = utils.cloneDeep(this.oneChapter);
                this.chapterList.push(firstLevel);
            },

            addSecondLevel(){
                let secondLevel = utils.cloneDeep(this.oneChapter);
                secondLevel.chapterLevel = 2;
                this.chapterList.push(secondLevel);
            },

            insertLevel(){
                if (!this.check) {
                    return
                }
                let firstLevel = utils.cloneDeep(this.oneChapter);
                firstLevel.chapterLevel = 2;
                this.chapterList.splice(this.check, 0, firstLevel)
                this.check = this.check + 1;
            },

            deleteLevel(){
                if (!this.check) {
                    return
                }
                this.chapterList.splice(this.check - 1, 1)
                this.check = this.check - 1;
            },

            querySearchTopicAsync(){
                this.$message({
                    type: 'info',
                    message: 'querySearchTopicAsync'
                })
            },
            querySearchTestAsync(){
                this.$message({
                    type: 'info',
                    message: 'querySearchTestAsync'
                })
                this.getTopicByName({"topicName": this.addForm.courseTopicId}).then(resp => {
                    this.topicsShow = this.topics;
                }).catch( () => {
                    this.topicsShow = []
                })
            },

            handleSelectTopic(data){
                if(data !== ''){
                    this.loading = true;
                    this.getTopicByName({"topicName": data}).then(resp => {
                        this.topicsShow = this.topics;
                        this.loading = false;
                    }).catch( () => {
                        this.topicsShow = []
                    })
                }else{
                    this.topicsShow = []
                }
            },

            handleSelectTest(data){
                if(data !== ''){
                    this.loading = true;
                    this.getTestPapers({"pageSize": 10, "currentPage": 1, "name": data}).then( resp => {
                        this.testsShow = this.tests;
                        this.loading = false;
                    }).catch( () => {
                        this.testsShow = []
                        this.loading = false;
                    })
                }else{
                    this.testsShow = []
                }
            },
            redirectTest(){
                this.$message({
                    type: 'info',
                    message: 'redirectTest'
                })
            },
            redirectTopic(){
                this.$message({
                    type: 'info',
                    message: 'redirectTopic'
                })
            },
            testListChange(flag){
                if(!flag){
                    this.testsShow = []
                }
            },
            topicListChange(flag){
                if(!flag){
                    this.topicsShow = []
                }
            },

            submit(){
                if(!this.addForm.courseName || !this.addForm.courseType || !this.addForm.secondLevelCatecoryId || !this.addForm.courseDetail || !this.addForm.label){
                    this.$message({
                        type: 'warning',
                        message: '请完成所有必填项目!'
                    })
                    return false
                }

                if(this.imgList.length == 0){
                    this.$message({
                        type: 'warning',
                        message: '请上传课程封面!'
                    })
                    return false
                }
                if(this.fileList.length == 0){
                    this.$message({
                        type: 'warning',
                        message: '请上传课件!'
                    })
                    return false
                }

                this.courseTopicId.forEach( one => {
                    this.addForm.topicRequests.push({"topicId": one})
                })

                // this.addForm.courseCoverPicTitle = this.imgList[0].name
                // this.addForm.courseCoverPicUrl = this.imgList[0].url
                // this.addForm.courseFileTitle = this.fileList[0].name
                // this.addForm.courseFileUrl = this.fileList[0].url
            //    this.addForm.chapterRequests = this.chapterList;

                this.addCourse(this.addForm).then( resp => {
                    this.$message({
                        type: 'info',
                        message: '添加成功'
                    })
                    let THIS = this;
                    window.setTimeout(function(){
                        THIS.$router.push('/coursemaintenance');
                    }, 2000)
                });
            }
        }
    }
</script>

<style lang="less">
    .add-course {
        box-sizing: border-box;
        min-width: 700px;
        overflow-x: scroll;
        .title {
            padding-left: 20px;
            background-color: #fff;
            margin-bottom: 20px;
            height: 50px;
            line-height: 50px;
            position: relative;

            .title-flag {
                position: absolute;
            }

            .step-wrapper {
                text-align: center;
                margin: auto auto;
                padding-top: 10px;

                > span {
                    display: inline-block;
                    width: 50px;
                    color: #fff;
                    height: 26px;
                    line-height: 26px;
                    background-color: #999;
                    margin-right: 20px;
                    border-radius: 3px;
                }
                .active {
                    background-color: #20a0ff;
                }
            }
        }

        .upload-tip {
            opacity: 0.5;
            margin-top: -5px;
        }

        .upload-btn {
            position: relative;
            width: 80px;
            height: 30px;
            line-height: 30px;
            background-color: #20a0ff;
            color: #fff;
            border-radius: 5px;
            border: none;
            &:hover {
                background-color: #46bafe;
            }
            &:active {
                background-color: #1c8de0;
            }
            .hide-dom {
                position: absolute;
                left: 0;
                background: transparent;
                opacity: 0;
                width: 100%;
                height: 100%;
            }
        }
        .upload-file-show {
            .img-block {
                width: 100px;
                height: 100px;
                display: inline-block;
            }
            .word-btn {
                display: inline-block;
                color: #20a0ff;
                margin-left: 10px;
                cursor: pointer;
            }
            > a {
                text-decoration: none;
            }
        }
        .middle {
            margin-top: 20px;
            text-align: center;
        }
        .secondLevel {
            display: inline-block;
            //    padding-left: 20px;
            margin-left: 20px;
        }
        .table-wrapper {
            max-height: 520px;
            overflow-y: scroll;
            table {
                width: 95%;
                margin-left: 20px;
            }

            td {
                position: relative;
                height: 40px;
                padding: 0 5px;
                margin: 0 5px;
                select, .full-block {
                    display: flex;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        ::-webkit-inner-spin-button {
            display: none
        }
    }
</style>
