<template>
  <div class="add-course">
    <el-form :model="courseForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="课程名称：" prop="courseName">
            <el-input v-model="courseForm.courseName" placeholder="请输入课程名称" style="width: 400px"></el-input>
        </el-form-item>

        <el-form-item label="课程类型：" prop="courseType">
            <el-select v-model="courseForm.courseType" placeholder="请选择课程类型" style="width:160px">
                <el-option
                        v-for="(value, key, index) in addCourseTypes" :value="key" :key="index" :label="value">{{value}}
                </el-option>
              <!-- <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option> -->
            </el-select>
        </el-form-item>

        <el-form-item label="所属分类：">
            <div style="width:600px">
                <el-col :span="8" >
                <el-form-item prop="firstCotegory" >
                    <el-select v-model="courseForm.firstCotegory" @change="changeFirstCategory" placeholder="一级课程分类" style="width:160px">
                        <el-option
                                    v-for="(item, index) in firstCategoryData"
                                    :label="item.categoryName"
                                    :value="item.categoryId"
                                    :key="index"
                            >
                            </el-option>
                    </el-select>
                    <span @click="showCategory(1)" class="el-icon-plus" style="margin-right:10px"></span>
                </el-form-item>

                </el-col>

                <el-col :span="16">
                <el-form-item prop="secondCotegory">
                    <el-select v-model="courseForm.secondCotegory" placeholder="二级课程分类" style="width:160px">
                        <el-option
                                v-for="(item, index) in secondCategoryData"
                                :label="item.categoryName"
                                :value="item.categoryId"
                                :key="index">
                        </el-option>
                    </el-select>
                    <span v-if="courseForm.firstCotegory !== ''" @click="showCategory(2)" class="el-icon-plus"></span>
                </el-form-item>
                </el-col>
            </div>
        </el-form-item>

        <el-form-item label="课程介绍：" prop="introduction">
            <el-input type="textarea" v-model="courseForm.introduction" placeholder="请填写课程介绍" style="width: 479px"></el-input>
        </el-form-item>

        <el-form-item label="课程标签：" prop="label">
            <el-input v-model="courseForm.label" placeholder="请填写课程标签" style="width: 382px"></el-input>
        </el-form-item>

        <el-form-item label="课程封面：" required>
             <el-radio-group v-model="defOrCusCover">
               <el-radio label="1">默认封面</el-radio>

               <el-radio label="0">自定义封面</el-radio>
             </el-radio-group>
        </el-form-item>
        <!-- 选择默认图片 -->
        <div v-show="defOrCusCover === '1'" class="default-cover">
            <div v-for="(item,index) in defaultImageCover" :key="index" class="singgle-cover">
                <img :src="defaultImageIp + item.photoUrl" />
                <div class="select-default-cover">
                   <el-radio v-model="coverImgUrl" @click.native="coverImgTitle = item.photoName" :label="item.photoUrl">{{''}}</el-radio>
                </div>
            </div>
        </div>
        <!-- 选择自定义图片 -->
        <div v-show="defOrCusCover === '0'" class="cust-cover">
            <el-upload
                :headers="uploadHeadersFm"
                :action="uploadFileUrl"
                :class="{'disabledUpload': uploadDisabled || uploadPregressCourse}"
                :on-progress="uploadCoverProgress"
                :before-upload="beforeUploadCover"
                :on-success="uploadCoverSuccess"
                :on-error="uploadCoverImgError"
                :file-list="coverImgList"
                list-type="picture-card"
                :on-remove="removeUploadCover">
                <i class="el-icon-plus"></i>
            </el-upload>
        </div>
        <!-- 课程内容 -->
        <el-form-item label="课程内容：">
            <el-upload
                :headers="uploadHeadersFm"
                :action="uploadFileUrl"
                :before-upload="beforeUploadCourse"
                :on-success="uploadCourseSuccess"
                :on-progress="uploadCourseProgress"
                :on-error="uploadCourseError"
                :file-list="primaryCourseList"
                :on-remove="removeUploadCourse"
                :show-file-list="false"
                >
                <el-button type="primary" size="mini" :disabled="!courseForm.courseType || uploadingCourse">上传课件</el-button>
            </el-upload>
        </el-form-item>

        <div class="corse-list">
          <div v-for="(item, index) in primaryCourseList" :key="item.url" class="corse-list-single">
            <div class="title">{{ item.fileName }}</div>
            <div class="fix">
                <i  class="el-icon-edit kdj" @click="toEditCourseName(index)"></i>
                <i class="el-icon-delete kdj" @click="deleteCourse(index)"></i>
                <img v-show="index === primaryCourseList.length-1" src="../layouts/images/1bottomdisable.png">
                <img class="kdj" v-show="index !== primaryCourseList.length-1" src="../layouts/images/1bottom.png" @click="moveCourse(1, index)">
                <img class="kdj" v-show="index !== 0" src="../layouts/images/1top.png" @click="moveCourse(2, index)">
                <img v-show="index === 0" src="../layouts/images/1topdisable.png">
            </div>
            <div class="is-fast-hor">
                <div v-if="courseForm.courseType === '5'">
                    是否竖屏
                    <!-- {{ item.displayMode }}
                    {{ item.fileCoverPath }} -->
                    <el-switch
                      v-model="item.displayMode"
                      on-text="是"
                      off-text="否"
                      :on-value="0"
                      :off-value="1"
                      :active-value="0"
                      :inactive-value="1"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                </div>
                 <div v-if="courseForm.courseType === '2'">
                    <span>是否快进</span>
                    <!-- <span v-if="courseForm.courseType==='5'">是否横屏</span> -->
                    <el-switch
                      v-model="item.isDrag"
                      on-text="是"
                      off-text="否"
                      :on-value="1"
                      :off-value="0"
                      :active-value="1"
                      :inactive-value="0"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                </div>
            </div>
          </div>
        </div>

         <div v-show="this.coursePercentage !== 0 && this.coursePercentage !== 100" class="percentage-show">
          <el-progress :percentage="coursePercentage" :show-text="false"></el-progress>
          <span>正在导入...{{coursePercentage}}%</span>
        </div>

         <!-- 文档内容 -->
        <el-form-item label="文档内容：">
            <el-upload
                :headers="uploadHeadersFm"
                :action="uploadFileUrl"
                :before-upload="beforeUploadDoc"
                :on-success="uploadDocSuccess"
                :on-progress="uploadDocProgress"
                :on-error="uploadDocError"
                :file-list="primaryDocList"
                :on-remove="removeUploadDoc"
                :show-file-list="false">
                <el-button type="primary" size="mini" :disabled="uploadingDoc">上传文档</el-button>
            </el-upload>
        </el-form-item>

        <div class="corse-list">
          <div v-for="(item, index) in primaryDocList" :key="item.url" class="corse-list-single">
            <div class="title">{{ item.fileName }}</div>
            <div class="fix">
                <i  class="el-icon-edit kdj" @click="toEditDocName(index)"></i>
                <i class="el-icon-delete kdj" @click="deleteDoc(index)"></i>
                <img v-show="index === primaryDocList.length-1" src="../layouts/images/1bottomdisable.png">
                <img class="kdj" v-show="index !== primaryDocList.length-1" src="../layouts/images/1bottom.png" @click="moveDoc(1, index)">
                <img class="kdj" v-show="index !== 0" src="../layouts/images/1top.png" @click="moveDoc(2, index)">
                <img v-show="index === 0" src="../layouts/images/1topdisable.png">
            </div>
            <div class="is-fast-hor">
                <div>
                    是否竖屏
                    <el-switch
                      v-model="item.displayMode"
                      on-text="是"
                      off-text="否"
                      :on-value="0"
                      :off-value="1"
                      :active-value="0"
                      :inactive-value="1"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                </div>
            </div>
          </div>
        </div>

         <div v-show="this.docPercentage !== 0 && this.docPercentage !== 100" class="percentage-show">
          <el-progress :percentage="docPercentage" :show-text="false"></el-progress>
          <span>正在导入...{{docPercentage}}%</span>
        </div>


         <el-form-item>
            <div class="bottom-fixed">
              <el-button type="primary" @click="createCourse('ruleForm')" id="submit">保存</el-button>
              <el-button @click="cancelAddCourse" class="cancel-add">取消</el-button>
            </div>
        </el-form-item>

    </el-form>

   <el-dialog
        title="修改课件名称"
        :visible.sync="editCoursediaVis"
        width="30%"
        :before-close="cancelCourseDiaClose">
        <el-input v-model.trim="editCourseName" :maxlength="20"/>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelCourseDiaClose" class="cancel-btn">取 消</el-button>
            <el-button type="primary" @click="conEditCourseName" class="confirm-btn">确 定</el-button>
        </span>
    </el-dialog>

     <el-dialog
        title="修改文档名称"
        :visible.sync="editDocdiaVis"
        width="30%"
        :before-close="editDocDiaClose">
        <el-input v-model.trim="editDocName" :maxlength="20"/>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDocDiaClose" class="cancel-btn">取 消</el-button>
            <el-button type="primary" @click="conEditDocName" class="confirm-btn">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 添加分类 -->
    <el-dialog
        :title="addCategoryTitle"
        :visible.sync="isShowAddCategory"
        @close="cancelAddCotegory"
        class="add-cote-dialog"
        >
        <el-input v-model="addCategoryVal" :placeholder="'请'+addCategoryTitle" :maxlength="20"/>
            <!-- <add-category  :typeId="addCategoryTypeId" @goAddCategory="toAddCategory"></add-category> -->
        <div class="fix">
            <el-button type="primary" @click="confirmAddCotegory" class="confirm">确定</el-button>
            <el-button class="cancel" @click="cancelAddCotegory">取消</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import Api from "../utils/api"
import {mapActions, mapState} from "vuex"
 import * as INFO from "../utils/uploadFileInfo";
import * as C from "../constants/api"

export default{
    name: 'addCourse',
    data() {
        return {
            uploadHeadersFm: {
              __DEBUG__DEV__: 1 ,
              courseType: 0
            },
            addCourseParam: {}, //添加所用参数
            rules: {
                courseName: [
                    { required: true, message: '请输入课程名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                courseType: [
                    { required: true, message: '请选择课程类型', trigger: 'change' }
                ],
                firstCotegory: [
                    { required: true, message: '请选择一级课程分类', trigger: 'change' }
                ],
                secondCotegory: [
                    { required: true, message: '请选择二级课程分类', trigger: 'change' }
                ],
                introduction: [
                    { required: true, message: '请填写课程介绍', trigger: 'blur' },
                    { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
                ],
                label: [
                    { required: true, message: '请填写课程标签', trigger: 'blur' }
                ]
            },
            courseForm: {
              courseName: '',
              courseType: '',
              firstCotegory: '',
              secondCotegory: '',
              introduction: '',
              label: '',
            },
            defOrCusCover: '1', // 默认还是封面图片
            defaultImageCover: [], //提供选择的默认封面
            defaultImageIp: '',
            coverImgList: [],
            coverImgUrl: '', // 封面路径
            coverImgTitle: '', // 封面名字
            uploadPregressCourse: false, // 图片是否正在上传
            uploadDisabled: false,
            primaryCourseList: [], // 上传的课件
            coursePercentage: 0, // 上传课件进度条
            courseRadio:{}, // 课程中是否横屏
            uploadingCourse: false, // 判断课件是否正在上传，正在上传，则禁止点击按钮
            editCoursediaVis: false,
            editCourseName: '', // 需要修改得课件名字
            editCourseIndex: 0, //修改得课件名字的序列
            primaryDocList: [], // 文档列表
            uploadPregressDoc: false,  // 文档是否正在上传
            docPercentage:0, // 文档上传进度
            editDocdiaVis: false, // 编辑文档时弹窗
            editDocName: '', // 编辑文档的名字
            uploadingDoc: false, // 判断文档是否正在上传，正在上传，则禁止点击按钮
            docRadio: {},  // 文档中是否横屏
            firstCategoryData: [], // 第一级分类数据
            secondCategoryData: [], // 第二级分类数据
            addCategoryTitle: '', // 添加分类的title
            isShowAddCategory: false,
            addCategoryVal: '',
            addCategoryTypeId: '',
            initCotegoryId: ''
        }
    },
    created() {
       // 连接一次上传接口,让后台上传接口与第三方保持连接
       Api.connectUpload()
       // 获取课程类型
       this.getCourseType()
       // 获取一级分类
       this.getFirstCategory({
              kind: sessionStorage.getItem( 'kind')
        }).then(res=>{
            this.initCotegoryId =  res.data[0].categoryCode
            this.getNextCategory({
                categoryCode:  this.initCotegoryId
                }).then(item=>{
                    this.firstCategoryData = item.data;
                    // 分类执行后执行获取详情方法
                    this.getEditCourseInfo()
            });
        })
       // 获取默认照片
       Api.getCourseDefaultPhoto().then(res => {
         this.defaultImageIp = res.data.fileIP
         this.defaultImageCover = res.data.photoList
       });
    },
    watch: {
      defOrCusCover(newVal, oldVal) {
          console.log(newVal)
      },
      'courseRadio':{
         handler(newVal, oldVal) {
             console.log(JSON.stringify(newVal));

         },
         deep: true
      },
      // 课程类型
      'courseForm.courseType': {
         handler(newVal, oldVal) {
             if(oldVal === '') return // 当一级分类是空时，则不用清空操作
             if(this.primaryCourseList.length !== 0) {
                 this.$msgbox({
                    title: '消息',
                    message: `此操作将清空已上传的课程文件，是否继续？`,
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            this.primaryCourseList = []
                            done()
                        } else {
                            this.courseForm.courseType = oldVal
                            done()
                        }
                    }
                })
             }
         },
         deep: true
      }
    },
    methods: {
        ...mapActions(['getCourseByCourseId', 'getCourseType', 'getFirstCategory', 'getNextCategory', 'updateCourse']),
        // 获取编辑时数据详情
        getEditCourseInfo() {
          // 编辑状态获取课程详情
            if(this.$route.query.courseId) {
                let courseId = this.$route.query.courseId
                this.getCourseByCourseId({courseId}).then(res => {
                    let info = res.data
                    this.courseForm.courseName = info.courseName
                    this.courseForm.courseType = String(info.courseType)
                    this.courseForm.firstCotegory = info.secondLevelCatecoryId
                    this.courseForm.secondCotegory = info.thirdLevelCatecoryId
                    this.courseForm.introduction = info.courseDetail
                    this.courseForm.label = info.label
                    this.defOrCusCover = String(info.isDefaultPhoto) // 是否是默认封面
                    if(info.isDefaultPhoto === 1) {
                      // 默认
                      this.coverImgUrl = info.courseCoverPic.split(this.defaultImageIp)[1] // 封面路径
                      this.coverImgTitle =  info.courseCoverPicTitle
                    } else {
                        // 自定义
                        this.coverImgUrl = info.courseCoverPic.split(this.defaultImageIp)[1]
                        this.coverImgList = [{name: info.courseCoverPicTitle, url: info.courseCoverPic}];
                        this.coverImgTitle =  info.courseCoverPicTitle
                        this.uploadPregressCourse = false
                        this.uploadDisabled = true
                    }
                    this.primaryCourseList = info.courseFiles.primaryList
                    this.primaryDocList = info.courseFiles.deputyList
                })
            }
        },
        createCourse(formName) {
            this.$refs[formName].validate((valid) => {
                let isOk = this.testSomeVal()
                if (valid && isOk) {
                    // 课程添加排序字段
                    this.primaryCourseList.forEach((item, index) => {
                      this.primaryCourseList[index].fileSort = index + 1
                    })
                    // 文档添加排序字段
                    this.primaryDocList.forEach((item, index) => {
                      this.primaryDocList[index].fileSort = index + 1
                    })

                    this.addCourseParam = {
                        courseName: this.courseForm.courseName,
                        courseType: this.courseForm.courseType,
                        secondLevelCatecoryId: this.courseForm.firstCotegory, //一级分类的id
                        thirdLevelCatecoryId: this.courseForm.secondCotegory, //二级分类的id
                        courseDetail: this.courseForm.introduction,
                        courseCoverPicTitle: this.coverImgTitle,
                        courseCoverPicUrl: `${this.defaultImageIp}${this.coverImgUrl}`,
                        courseTestStatus: 0, //课程是否必考
                        label: this.courseForm.label,
                        courseAdmin: sessionStorage.getItem('adminAccount'),
                        operationAdmin: sessionStorage.getItem('adminAccount'),
                        //courseDuration: 0, // 课程时长
                        courseFiles: {
                            primaryList: this.primaryCourseList,
                            deputyList: this.primaryDocList
                        }
                    }
                    if(this.$route.query.courseId) {
                      this.addCourseParam.courseId = this.$route.query.courseId
                      this.updateCourse(this.addCourseParam).then(res => {
                         this.$message.success('修改成功')
                         this.$router.go(-1)
                      })
                    } else {
                      Api.addCourse(this.addCourseParam).then(res => {
                        this.$message.success('新增成功')
                        this.$router.go(-1)
                      })
                    }
                } else {
                    return false;
                }
            });
        },
        testSomeVal() {
          let isOk = true
          if(this.courseForm.label.split(',').length > 2) {
            isOk = false
            this.$message.warning('标签个数不能超过2个')
          } else if(this.primaryCourseList.length === 0) {
            isOk = false
            this.$message.warning('课程内容不能为空')
          } else if(this.docPercentage !== 0 && this.docPercentage !== 100) {
            isOk = false
            this.$message.warning('有文档内容正在上传, 不能保存')
          } else if(this.coursePercentage !== 0 && this.coursePercentage !== 100) {
            isOk = false
            this.$message.warning('有课程内容正在上传, 不能保存')
          } else if(this.coverImgUrl === '') {
            isOk = false
            this.$message.warning('课程封面不能为空')
          }
          return isOk
        },
        // 分类
        refreshCotegory() {
          this.getFirstCategory({
              kind: 1
          }).then(res=>{
            this.initCotegoryId =  res.data[0].categoryCode
            this.getNextCategory({
                categoryCode:  this.initCotegoryId
                }).then(item=>{
                  this.firstCategoryData = item.data;
            });
          })
        },
        showCategory(type) {
          if(type === 1) {
                  this.addCategoryTitle = '添加一级所属分类'
                  this.addCategoryTypeId = '1'
              } else {
                  this.addCategoryTitle = '添加二级所属分类'
                  this.addCategoryTypeId = '2'
              }
              this.isShowAddCategory = true
            //   this.closeCategory()
        },
        confirmAddCotegory() {
          let categoryParentCode = ''
            if (this.addCategoryTypeId === '1') {
              categoryParentCode =  this.initCotegoryId
            } else {
                this.firstCategoryData.forEach(item => {
                    if(item.categoryId === this.courseForm.firstCotegory) {
                      categoryParentCode = item.categoryCode
                    }
                })
           }
           Api.addCategory({
                "categoryParentCode": categoryParentCode,
                "categoryName": this.addCategoryVal,
                "categoryDesc": this.addCategoryVal,
                "categoryPicPath": "",
                "operationAdmin":"yinhong"
            }).then(() => {
                if(this.addCategoryTypeId === '1') {
                    this.refreshCotegory()
                } else {
                    this.getNextCategory({categoryCode:categoryParentCode}).then(res=>{
                        this.secondCategoryData = res.data;
                    });
                }
                this.isShowAddCategory = false
            })
        },
        cancelAddCotegory() {
            this.addCategoryVal = ''
            this.isShowAddCategory = false
        },
        // 取消
        cancelAddCourse() {
           this.$router.go(-1)
        },
        // 第一级课程分类改变
        changeFirstCategory(categoryId) {
          // 根据分类id查询code
          let categoryCode = ''
          this.firstCategoryData.forEach(item => {
             if(item.categoryId === categoryId) {
                 categoryCode = item.categoryCode
             }
          });
          this.getNextCategory({
              categoryCode
          }).then(res => {
              this.courseForm.secondCotegory = ''
              if(res.data.length !== 0) {
                this.courseForm.secondCotegory = res.data[0].categoryId //清空二级分类的值
              }
              this.secondCategoryData = res.data
          })
        },
        resetCoverImg() {
          this.coverImgUrl = ''
          this.coverImgList = []
          this.uploadPregressCourse = false
        //   debugger
          this.uploadDisabled = false
        },
        // 上传封面前
        beforeUploadCover(file) {
          this.uploadHeadersFm.courseType = 0
          if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
            this.$message.error('只能上传png,jpg的图片格式');
            return false;
          }
          this.uploadPregressCourse = true
        },
        // 上传封面成功后
        uploadCoverSuccess(file) {
          this.coverImgUrl = `${file.data.fileUrl}`
          this.coverImgList = [{name: file.data.fileTitle, url: `${file.data.fileIP}${file.data.fileUrl}`}];
          this.coverImgTitle =  file.data.fileTitle
          this.uploadPregressCourse = false
          this.uploadDisabled = true
        },
        // 删除图片事件
        removeUploadCover() {
            this.resetCoverImg()
        },
        // 上传错误事件
        uploadCoverImgError() {
          this.resetCoverImg()
        },
        // 上传封面中事件
        uploadCoverProgress(file) {
          this.uploadPregressCourse = true
        },
        // 上传课件之前
        beforeUploadCourse(file) {
                this.coursePercentage = 0 // 上传进度
                // 上传请求头
                if(this.courseForm.courseType === '2') {
                   this.uploadHeadersFm.courseType = 2
                } else if (this.courseForm.courseType === '5') {
                   this.uploadHeadersFm.courseType = 5
                }

                if(this.courseForm.courseType !== '2' && this.courseForm.courseType !== '5') {
                    this.$message.warning('只能选择视频或者PDF课程类型')
                    return false
                }
                let size = file.size / 1024 /1024;
                if(String(this.courseForm.courseType) === '5' && size > 20) {
                   this.$message({
                        type: 'info',
                        message: "上传的PDF文件不能超过20M"
                    })
                    return false
                }

                if(String(this.courseForm.courseType) === '2' && size > 2024) {
                   this.$message({
                        type: 'info',
                        //    message: "上传文件错误，仅支持'.png'、'jpg'、'bmp'、'gif'和'raw'类型图片"
                        message: "上传的单个视频不能超过2G"
                    })
                    return false
                }
                if(!this.courseForm.courseType) {
                   this.$message.warning('请先选择上传课程的类型')
                   return false
                }
                let isTypeOk = false;
                let fileTypeList = []
                let fileNames = ['音频','视频','DOC','PPT','PDF']
                let courseType = this.courseForm.courseType
                if(courseType == "1"){                    // 音频mp3
                    fileTypeList = INFO.audioFileTypeList
                }else if(courseType == "2"){              // 视频mp4
                    fileTypeList = INFO.videoFileTypeList
                }else if(courseType == "3"){              // doc,docx
                    fileTypeList = INFO.docFileTypeList
                }else if(courseType == "4"){              // ppt,pptx
                    fileTypeList = INFO.pptFileTypeList
                }else if(courseType == "5"){              //pdf
                    fileTypeList = INFO.pdfFileTypeList
                }
                 fileTypeList.forEach( item => {
                    if( item == file.type){
                        isTypeOk = true;
                    }
                })
                if(!isTypeOk) {
                    this.$message.warning(`只能上传${fileNames[parseInt(this.courseForm.courseType)-1]}的格式文件`)
                }
                return isTypeOk

        },
        // 上传课件成功之后
        uploadCourseSuccess(res,file) {
          this.uploadingCourse = false
          let size = file.size / 1024 /1024;
          this.primaryCourseList.push({
              fileName: res.data.fileTitle,
              filePath: `${res.data.fileUrl}`,
              fileCoverPath: `${res.data.fileIP}${res.data.fileUrl}`,
              fileType: this.courseForm.courseType,
              fileDesc: res.data.fileTitle,
              fileLevel: 0, // 主文件
              displayMode: 1, // 默认横屏
              fileSize: size,
              isDrag: 0, // 默认不能快进
          })
        },
        uploadCourseProgress(event, file, fileList) {
          this.coursePercentage = Math.floor(event.percent)
          this.uploadingCourse = true
        },
        // 删除课件方法
        removeUploadCourse(file) {
           console.log(file);
        },
        // 上传课件出错
        uploadCourseError() {
          this.uploadingCourse = false
        },
        // 编辑单个课件名字
        toEditCourseName(index) {
          this.editCoursediaVis = true
          this.editCourseName = this.primaryCourseList[index].fileName
          this.editCourseIndex = index
        },
        conEditCourseName() {
          if(this.editCourseName === '') {
              this.$message.warning('课件名称不能为空')
              return false
          }
          this.editCoursediaVis = false
          this.primaryCourseList[this.editCourseIndex].fileName = this.editCourseName
        },
        // 删除单个课件
        deleteCourse(index) {
          if(!this.uploadingCourse) {
            this.primaryCourseList.splice(index, 1)
          } else {
            this.$message.warning('上传中，暂时不能删除')
          }
        },
        // 移动课件
        moveCourse(dex, index) {
          // dex为1是下移，为2是上移
          if(dex === 1) {
              let nowData = this.primaryCourseList[index]
              this.primaryCourseList.splice(index, 1, this.primaryCourseList[index+1])
              this.primaryCourseList.splice(index+1, 1, nowData)
          } else {
              let nowData = this.primaryCourseList[index]
              this.primaryCourseList.splice(index, 1, this.primaryCourseList[index-1])
              this.primaryCourseList.splice(index-1, 1, nowData)
          }
        },
        // 关闭编辑课件时触发事件
        cancelCourseDiaClose() {
            this.editCoursediaVis = false
        },

        // 上传文档之前
        beforeUploadDoc(file) {
          this.uploadHeadersFm.courseType = 5
          let size = file.size / 1024 /1024;

          if(file.type !== 'application/pdf') {
            this.$message.error('只能上传pdf文档格式文件');
            return false;
          }
          if(size > 20) {
            this.$message({
                type: 'info',
                message: "上传的PDF文件不能超过20M"
            })
            return false
          }
          this.docPercentage = 0
        },
        // 上传文档成功之后
        uploadDocSuccess(res, file) {
          this.uploadingDoc = false
          let size = file.size / 1024 /1024;
          this.primaryDocList.push({
              fileName: res.data.fileTitle,
              filePath: `${res.data.fileUrl}`,
              fileCoverPath: `${res.data.fileIP}${res.data.fileUrl}`,
              fileType: 5,
              fileDesc: res.data.fileTitle,
              fileLevel: 1, // 副文件
              displayMode: 1, // 默认横屏
              fileSize: size,
              isDrag: 0, // 默认不能快进
          })
        },
        // 上传文档中
        uploadDocProgress(event, file, fileList) {
          this.docPercentage = Math.floor(event.percent)
          this.uploadingDoc = true
        },
        // 上传文档失败
        uploadDocError() {
          this.uploadingDoc = false
        },
        // 删除文档后
        removeUploadDoc(file) {

        },
        // 修改文档名字
        toEditDocName(index) {
          this.editDocdiaVis = true
          this.editDocName = this.primaryDocList[index].fileName
          this.editDocIndex = index
        },
        // 删除文档
        deleteDoc(index) {
          if(!this.uploadingDoc) {
            this.primaryDocList.splice(index, 1)
          } else {
            this.$message.warning('上传中，暂时不能删除')
          }
        },
        // 关闭文档编辑窗口
        editDocDiaClose() {
          this.editDocdiaVis = false
        },
        // 移动文档
        moveDoc(dex, index) {
          // dex为1是下移，为2是上移
          if(dex === 1) {
              let nowData = this.primaryDocList[index]
              this.primaryDocList.splice(index, 1, this.primaryDocList[index+1])
              this.primaryDocList.splice(index+1, 1, nowData)
          } else {
              let nowData = this.primaryDocList[index]
              this.primaryDocList.splice(index, 1, this.primaryDocList[index-1])
              this.primaryDocList.splice(index-1, 1, nowData)
          }
        },
        // 确定修改文档名字
        conEditDocName() {
           if(this.editDocName === '') {
              this.$message.warning('文档名称不能为空')
              return false
          }
          this.editDocdiaVis = false
          this.primaryDocList[this.editDocIndex].fileName = this.editDocName
        },

    },
    computed:{   //courseType:1
        uploadFileUrl(){
            return C.UPLOAD
        },
        ...mapState({
            addCourseTypes: ({course}) => course.addCourseTypes
        })
    }
}

</script>

<style lang='less'>
  .add-course {
      padding-top:30px;
      border-top: 74px solid #f4f4f4;
      border-left: 21px solid #f4f4f4;
      border-right: 21px solid #f4f4f4;
      background: #fff;
      .el-dialog--small {
        width:30% !important;
      }
      .el-form-item__error {
          margin-top: 0px;
      }
      .el-form-item__content {
          line-height: 36px !important;
      }
      .default-cover {
          padding-left: 100px;
          margin-bottom: 10px;
          .singgle-cover {
              position: relative;
              display: inline-block;
              width: 162px;
              height: 108px;
              margin-right: 20px;
              margin-bottom: 30px;
              .select-default-cover {
                padding-left: 43%;
                // position: absolute;
              }
              img {
                width: 100%;
                height: 100%;
              }

          }
      }
      .cust-cover {
          margin-bottom: 20px;
          padding-left: 100px;
      }
      .disabledUpload .el-upload--picture-card {
        display: none;
      }
      .el-upload--picture-card {
         background-color: #fbfdff;
         i {
          font-size: 18px;
         }
      }
      .bottom-fixed {
         text-align: center;
         margin-bottom: 10px;
         .cancel-add {
            width: 160px;
            height: 32px;
            line-height: 32px;
            border-radius: 32px;
            color: #9B9B9B !important;
            background: #fff;
            border:1px solid rgba(230,231,237,1) !important;
        }
      }
      .percentage-show {
          margin-top: 10px;
          padding-left: 100px;
          width: 300px;
      }
      .corse-list {
          padding-left: 100px;
          .corse-list-single {
              height: 36px;
              font-size: 16px;
              .title {
                //  display: inline-block;
                 float: left;
                 white-space: nowrap;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 width: 142px;
              }
              .fix {
                display: inline-block;
                margin-left: 20px;
                padding-top: 3px;
                float: left;
                i {
                    float: left;
                    margin-right: 12px;
                    font-size: 17px;
                    margin-top: 1px;
                    color: #409eff;
                }
                img {
                   margin-right: 10px;
                }
              }
              .is-fast-hor {
                  display: inline-block;
                  margin-left: 10px;
                  .el-switch__label--left span {
                      line-height: 17px;
                      left: 16px;
                  }
                  .el-switch__label--right span {
                      line-height: 18px;
                      right: 16px;
                  }
              }
              .kdj {
                  cursor: pointer;
              }
          }
      }
      .el-icon-plus {
          color: #46bafe;
      }
      .add-cote-dialog {
          .fix {
            text-align: center;
            margin-top: 20px;
             .confirm {
                width: 120px;
            }
            .cancel {
                width: 120px;
                border: 1px solid #dcdfe6;
            }
          }

      }
      .dialog-footer {
          .cancel-btn {
            border: 1px solid #dcdfe6 !important;
            width: 120px;
          }
          .confirm-btn {
            width: 120px;
          }
      }
  }
</style>
