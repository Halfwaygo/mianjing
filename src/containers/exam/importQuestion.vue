<template>
  <div class="migu-content">
    <el-card class="box-card file-upload">
        <el-row class="mb50 pt50 align-center" style="margin-bottom:98px;">
        <el-col :span="5" :offset="10">
          <template v-if="state === 'progress'">
            <p class="align-left"><span class="el-icon-view"></span>{{ fileName }}</p>
            <el-progress :percentage="percentage" :show-text="false"></el-progress>
            <span>正在导入...{{percentage}}%</span>
          </template>
          <template v-else-if="state === 'ok'">
            <div class="success-bar mb10">
              <div class="fl"><span class="importSuccess"></span>{{ fileName }}</div>
              <div class="fr"><span class="importError" @click="removeFile"></span></div>
            </div>
            <el-button type="primary" class="plr20 chooseDoc" @click="importTitle">导入</el-button>
          </template>
          <el-upload v-else :action="importUrl" accept="application/vnd.ms-excel" name="bankFile"  :headers="uploadHeaders" :on-progress="handleProgress" :before-upload="beforeUpload" :on-success="uploadSuccess"  :file-list="fileList">
            <template v-if="state === 'init'">
              <el-button type="primary" class="plr20 chooseDoc">选取文件</el-button>
              <div slot="tip" class="chooseDocTitle">导入本地文件，仅支持Excel</div>
            </template>
            <template v-else-if="state === 'fail'">
              <div class="clearfix">
                <div class="fl"><span class="el-icon-view color-blue"></span>{{ fileName }}</div>
                <div class="fr">上传失败...</div>
              </div>
              <el-progress :percentage="percentage" :show-text="false" status="exception"></el-progress>
              <el-button type="primary" class="plr20">重新上传</el-button>
            </template>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="4">
            <div class="step-wrap">
              <div class="bg-icon bg-download"></div>
              <h3>1、下载模板</h3>
              <p class="align-left">模板中包含如下信息：试题名称、单选题、多选题等信息</p>
              <span plain class="plr20 downbg" @click="download">下载</span>
            </div>
        </el-col>
        <el-col :span="4" :offset="2">
            <div class="step-wrap">
              <div class="bg-icon bg-table"></div>
              <h3>2、整理表格</h3>
              <p class="align-left">根据下载好的模板依次录入考试名称、单选题目、多选题等信息</p>
            </div>
        </el-col>
        <el-col :span="4" :offset="2">
            <div class="step-wrap">
              <div class="bg-icon bg-import"></div>
              <h3>3、上传导入</h3>
              <p class="align-left">导入后，试题将存入试题库</p>
            </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import * as C from "../../constants/api"
  export default {
    name:"importExam",
    data () {
      return {
        name:"bankFile",
        importHeaders:{enctype:'multipart/form-data'},
        fileList:[],
        type:"xls,xlsx",
        state:"init", // init -> progress ——> fail / ok   4种状态   初始化为init
        fileName:"",
        percentage:0,
        uploadHeaders: {
            __DEBUG__DEV__: 1

        },
      }
    },
    computed:{
      importUrl () {
        return C.UPLOADPQUESTIONBANK
      }
    },
    methods:{
      download () {
        this.downloadPaperTemplate({}).then(res => {
          if(res.code === 0){
            window.open(res.data.fileUrl)
          }
        })
      },
      removeFile () {
        this.state = 'init'
      },
      importTitle () {
      	this.$router.push('/exam/new?type=2&source=2')
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      beforeUpload (file) {
        this.fileList = []
        let fileType = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase();
        if(this.type.indexOf(fileType)<0){
          this.$message.error("文件格式有误");return;
        }
        this.state = "progress" //一旦满足上传文件的要求，则进入进度条状态
        this.fileName = file.name
      },
      handleProgress (event, file, fileList) {
        this.percentage = Math.floor(event.percent)
      },
      uploadSuccess (response, file, fileList) {
        if(response.code === 0){ //上传成功，进入成功状态ok
          this.state = 'ok'
          let str = JSON.stringify(response.data).replace(/questionNumList/g,"questionNumRequestList").replace(/questionList/g,"questionRequest").replace(/optionList/g,"questionOptionRequestList");
          window.localStorage.setItem("importQuestionInfo",str)
          this.$router.push('importQuestionSave')
        }else { //上传失败，进入失败状态
          this.state = 'fail'
          this.$message.error(response.message)
        }
      },
      ...mapActions(["downloadPaperTemplate"])
    }
  }
</script>

<style scoped lang="less">
 .step-wrap {
   padding-bottom:100px;
   text-align:center;
   .bg-icon {
     display:inline-block;
     width:90px;
     height:80px;
   }

   h3{
    font-size: 16px;
    line-height:35px;
    color:#333333!important;
   }
   p{
    margin-bottom:20px;
   }
 }
 .success-bar{
   height:25px;
   width:100%;
   background-color:#F5F7FA;
   border-radius:3px;
   padding:0 5px;
   line-height:25px;
 }
 .chooseDoc{
  width:160px;
  height:32px;
  text-align: center;
  line-height: 32px;
  border-radius: 100px;
 }
 .chooseDocTitle{
    font-size: 14px;
    color:#999999;
 }
 .step-wrap{
  h3{
    color:#000000;
    font-size: 16px;
  }
  p{
    color:#999999;
    font-size: 14px;
    line-height: 26px;
  }
 }
 .migu-content .downbg{
    line-height: 32px;
 }


</style>
