<template>
  <div class="upload-head-img">
    <el-upload :action="action" :headers="importHeader" name="file" :show-file-list="false" :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload" :on-progress="handleProgress" class="upload-btn">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <template v-else>
        <i class="el-icon-upload btn-icon" v-show="!isUplaoadSucc"></i>
        <div class="el-upload__text" v-show="!isUplaoadSucc">选择你要上传的图片</div>
        <div v-show="isUplaoadSucc">
          <img :src="uploadSrc">
        </div>
      </template>
    </el-upload>
    <div v-show="percentage!==0 && percentage!==100">
      <el-progress  :percentage="percentage" :show-text="false" status="success"></el-progress>
    </div>
  </div>
</template>

<script>
  import * as C from "../constants/api";
  export default {
    name:"uploadImg",
    data(){
      return{
        importHeader:{
          __DEBUG__DEV__: 1,
          courseType:0,
        },
        isUplaoadSucc: false,
        uploadSrc: '',
        percentage: 0
      }
    },
    props:{
      type:{
        type:String,
        default:"image/jpeg,image/png,image/jpg"
      },
      size:{
        type:Number,
        default:2
      },
      imageUrl:{
        type:String,
        default:""
      }
    },
    computed:{
      action (){
        //return C.SAVEEXAMDEFAULTPHOTO
        return C.UPLOAD
      }
    },
    methods:{
      beforeAvatarUpload (file) {
        this.percentage = 0;
        const isType = this.type.indexOf(file.type) > -1;
        const isLimit = file.size <= this.size * 1024 * 1024;

        if (!isType) {
          this.$message.error('图片格式有误!');
          return false;
        }
        if (!isLimit) {
          this.$message.error('图像大小超限');
          return false;
        }
        return isType && isLimit;
      },
      handleAvatarSuccess (res, file) {
        if(res.code == 0){
          this.isUplaoadSucc = true
          this.uploadSrc = `${res.data.fileIP}${res.data.fileUrl}`
          this.$emit("successUpload", {fileUrl: res.data.fileUrl,uploadSrc:this.uploadSrc});
          this.$message.success(res.message);
        }else {
          this.$message.error(res.message)
        }
      },
      handleProgress (event, file, fileList) {
        this.percentage = Math.floor(event.percent)
      },
    }
  }
</script>

<style lang="less">
  .upload-btn {
    width:350px;
    height:190px;
    display:inline-block;
    background-color:#F6F6F6;
    text-align:center;
    img {
      display:block;
      width:100%;
      height:100%;
    }
    .btn-icon{
      font-size:50px;
      display:inline-block;
      margin-top:50px;
      margin-bottom:10px;
    }
  }

  .upload-head-img {
    .el-progress-bar__inner {
      background-color: #20a0ff !important;
    }
  }
</style>
