<template>
	<div class="migu-content">
    <cre-step class="method-cre-step"></cre-step>
		<el-card class="box-card">
      <!-- 步骤条 -->
		  <h2 class="panel-title">选择创建方式</h2>
		  <div class="method-set">
        <!-- 新建空白试卷 -->
			  <router-link :to="{path:'/exam/newExam',query:{type:'0',source:'0'}} ">
			  	<div class="method create-empty-exam" style="width:250px;margin:0;"></div>
		  	</router-link>
        <!-- 导入 -->
		  	<router-link to="/exam/importExam?type=exam">
			  	<div class="method lead-in"></div>
		  	</router-link>
		  </div>
		</el-card>
	</div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import * as C from '../../constants/api'
  import creStep from '../../components/step'
  export default {
    data() {
      return {
      }
    },
    components: {
      creStep
    }
  }
</script>

<style scoped lang="less">
  .method-cre-step {
    margin-top: 45px;
    margin-bottom: 55px;
  }
  .box-card {
    padding-top: 40px;
    padding-bottom: 100px;
    text-align: center;
    margin-top: 32px;
    .panel-title {
      margin-bottom:50px;
      margin-top: 5px;
    }
    .method-set {
       text-align:center;
       .method {
         width:200px;
         height:260px;
         border-radius: 5px;
         padding-top:200px;
         display:inline-block;
         margin-left:100px;
         &:nth-of-child(0){
           margin-left:0;
         }
         span {
           color:#fff;
         }
       }
    }
  }
</style>
