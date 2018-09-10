<template>
	<div class="pic-set">
    	<div class="pic-list" :class="{'active':img.photoUrl === checkedUrl}" v-for="(img,index) in picList" :key="index" :style="selfStyle">
    		<div v-if="img.photoUrl" style="wdith:200px;height:108px;" @click="handleChecked(img.photoUrl)">
          <img  :src="fileIP+img.photoUrl"  style="height:73px;"/>
          <el-radio v-model="imgSrcQq" :label="img.photoUrl" class="addCourseCoverRadio">
            {{ '' }}
          </el-radio>
    		</div>
        <!-- 默认图片 -->
        <div v-else class="defaultPicture" @click="handleNoPic">
          <img v-show="checkedUrl!==''" :src="checkedUrl" alt="上传图片"/>
          <img v-show="checkedUrl===''" src="../../layouts/images/upload1.png" alt="上传图片"/>
    		</div>
    	</div>
    </div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  export default {
    name:"picSet",
    data(){
      return{
          imgSrcQq:'',
      }
    },
    props:{
      selfStyle:{
        type:Object,
        default:() => ({
          width:"162px",
          height:"108px",
          overflow:'hidden',
        })
      },
      source:{
        type:Array,
        default:() => ([])
      },
      // 自定义封面
      checkedUrl: {
        String,
        default: '../../layouts/images/upload1.png'
      },
      // 默认封面
      checkedDefaultUrl: {
        String,
        default: ''
      }
    },
    computed:{
      picList () {
        return this.source.length > 0 ? this.source: this.photoList
      },
      ...mapState({
        photoList:({exam}) => exam.photoList,
        fileIP:({exam}) => exam.fileIP
      })
    },
    watch: {
        imgSrcQq(newVal) {
        console.log(newVal)
      },
      checkedDefaultUrl(newVal) {
        this.imgSrcQq = newVal
      }
    },
    created () {
      this.getExamDefaultPhoto()
    },
    mounted() {
      this.imgSrcQq = this.checkedDefaultUrl
    },
    methods:{
      handleChecked (url) {
        this.$emit("check",url)
      },
      handleNoPic () {
      	this.$emit('noPic')
      },
      ...mapActions(["getExamDefaultPhoto"]),
      getPhotoUrl(){

      },
    }
  }
</script>

<style scoped lang="less">
.addCourseCoverRadio{
  margin-left:45%;
}


</style>
