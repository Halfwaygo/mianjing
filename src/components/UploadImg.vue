<template>
	<div class="upload-wrap">
		  <div class="upload-box">
		  	<upload @successUpload="handleOk"></upload>
		  	<slot name="tip"></slot>
		  </div>
		 <div slot="footer" class="align-center">
		    <el-button type="primary" @click="saveImg" :diabled="imageUrl===''" round >保存</el-button>
      </div>
    </div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import Upload from './Upload'
  export default {
    name:"uploadImg",
    props:{
   		imageUrl:{
   		  type:String,
   		  default:""
   		}
    },
    data() {
      return {
        UploadImgUrl: '',
        newUrl: ''
      }
    },
    components:{
      Upload
    },
    methods:{
      handleOk (url) {
        this.UploadImgUrl = url.uploadSrc
        this.newUrl = url
      },
      saveImg() {
        this.$emit('hideUpload', this.newUrl)
      }
    }
  }
</script>

<style scoped lang="less">
  .upload-box {
    width:350px;
    margin:0 auto;
    background-color:#fff;
  }
</style>
