<template>
	<div class="migu-content">
		<!-- <el-steps space="50%" :active="1" finish-status="success" align-center style="" id="hi">
		  <el-step title="第一步" style="color:red;"></el-step>
		  <el-step title="第二步"></el-step>
		  <el-step title="第二步" style="display:none"></el-step>
		</el-steps> -->
    <cre-step :stepNum='2' class="cre-step"></cre-step>
		<el-card class="box-card">
		  <el-form label-width="150px">
			  <el-form-item label="考试名称：">
			    <span class="color-info">{{param.examName}}</span>
			  </el-form-item>
			  <el-form-item label="考试时间：">
			     <el-date-picker type="datetimerange" v-model="yourtime" range-separator="至"
				    start-placeholder="开始时间" end-placeholder="结束时间">
				  </el-date-picker>
			  </el-form-item>
			  <el-form-item label="参加人员：">
			    <el-button v-if="param.prePersonNum === 0" type="info" @click="queryOrSelPerson(1)"><span class="el-icon-plus"></span> 选择人员</el-button>
			    <el-button v-else type="info" @click="queryOrSelPerson(2)" >查看人员</el-button>
			  </el-form-item>
			  <el-form-item label="考试时长：">
			    <el-input v-model.trim="param.duration" :maxlength="3" class="w200"></el-input>&nbsp;分钟
			  </el-form-item>
			  <el-form-item label="是否支持重考：">
			    <el-radio-group v-model="Reexamination">
			    	<el-radio :label="0">不支持</el-radio>
				    <el-radio :label="1">无限次重考</el-radio>
					<el-radio :label="2">有限次重考</el-radio>
					<el-input :maxlength="4" v-show="Reexamination === 2" v-model="param.examNum"  class="reset_number_input" placeholder="请输入重考次数"></el-input>
				</el-radio-group>
			  </el-form-item>
			  <el-form-item label="考题是否乱序：">
				  <el-radio-group v-model="questions">
					  <el-radio :label="0">不乱序</el-radio>
					  <el-radio :label="1">乱序</el-radio>
				  </el-radio-group>
			  </el-form-item>
			  <el-form-item label="答案是否乱序：">
				  <el-radio-group v-model="answer">
					  <el-radio :label="0">不乱序</el-radio>
					  <el-radio :label="1">乱序</el-radio>
				  </el-radio-group>
			  </el-form-item>
			  <!--<el-form-item label="是否显示考试分数	：">
				  <el-radio-group v-model="answer">
					  <el-radio :label="0">显示</el-radio>
					  <el-radio :label="1">不显示</el-radio>
				  </el-radio-group>
			  </el-form-item>
			  <el-form-item label="是否显示错题	：">
				  <el-radio-group v-model="answer">
					  <el-radio :label="0">显示</el-radio>
					  <el-radio :label="1">不显示</el-radio>
				  </el-radio-group>
			  </el-form-item>
			  <el-form-item label="是否显示正确答案	：">
				  <el-radio-group v-model="answer">
					  <el-radio :label="0">显示</el-radio>
					  <el-radio :label="1">不显示</el-radio>
				  </el-radio-group>
			  </el-form-item>-->
			  <el-form-item label="封面：">
			    <el-radio-group v-model="param.picName" @change="handlePicTypeChange">
				    <el-radio label="默认封面">默认封面</el-radio>
				    <el-radio label="自定义封面">自定义封面</el-radio>
				</el-radio-group>
			  </el-form-item>
        <!-- 自定义封面图片上传 -->
			  <el-form-item label="">
			    <pic-set @check="handleCheck" @noPic="handleNoPic" :source="picList" :checkedUrl="uploadImgUrl" :checkedDefaultUrl="checkedDefaultUrl"></pic-set>
        	 </el-form-item>
			  <el-form-item label="通过分数：">
			    <el-input v-model.trim="param.passmark" class="w200"></el-input>&nbsp;分
			  </el-form-item>
		  </el-form>
		  <div class="align-center">
		    <el-button type="primary" @click="publishPaper" class="submit" :disabled="publishingExam">发布考试</el-button>
		  </div>
		</el-card>

    <el-dialog :visible.sync="showUpload" v-if="showUpload" width="70%"  center>
  		<upload-img @hideUpload="hideUpload">
  			<div slot="tip">仅支持JPG、PNG图片文件、且文件小于2M，建议以675*648像素上传</div>
  		</upload-img>
    </el-dialog>

    <el-dialog
     :visible.sync="showAttendee"
     v-show="showAttendee"
     center
     custom-class="select-person">
		  <attendee @addPerson="handleAddPerson" :isquery="isQueryPerson" :get-query-person="getPerson"></attendee>
    </el-dialog>
	</div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import Api from "../../utils/api"
  import PicSet from "./picSet"
  import Attendee from "./attendee"
  import UploadImg from "../../components/UploadImg"
  import creStep from '../../components/step'
  import Tool from "../../utils/tools"

  export default {
    name:'basicInfo',
    data () {
      return {
        param:{
                examName:"",
                duration:"",
                examStart:"",
                examEnd:"",
                reset:1,
                isDisorder:"",
                examNum:0,
                passmark:"",
                examDesc:"",
                picName:"默认封面",
                picURL:"",
                prePersonNum:0,
                accountList:[],
              //xinzeng
                examAuthor: ''
            },
            uploadImgUrl: '', // 自定义封面
            checkedDefaultUrl: '', // 默认封面
            yourtime:[],
            picList:[],
            showUpload:false,
            showAttendee:false,
            isQueryPerson: false, // 是否是选择人员
            getPerson: [], // 修改时已经获取参加的人员
            questions:0,
            answer:0,
            Reexamination:0,
            publishingExam: false //课程是否正在发布
      }
    },
    components:{
      PicSet,
      UploadImg,
      Attendee,
      creStep
    },
    watch:{
      yourtime (newVal,oldVal) {
        let t = newVal[0]
        let e = newVal[1]
        let s1 = `${t.getHours() < 10 ? ('0' + t.getHours()) : t.getHours()}:${t.getMinutes() < 10 ? ('0' + t.getMinutes()) : t.getMinutes()}:${t.getSeconds() < 10 ? ('0' + t.getSeconds()) : t.getSeconds()}`
        let s2 = `${e.getHours() < 10 ? ('0' + e.getHours()) : e.getHours()}:${e.getMinutes() < 10 ? ('0' + e.getMinutes()) : t.getMinutes()}:${e.getSeconds() < 10 ? ('0' + e.getSeconds()) : e.getSeconds()}`
        let start = `${t.getFullYear()}-${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}-${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()} ${s1}`
        let end = `${e.getFullYear()}-${(e.getMonth() + 1) < 10 ? ('0' + (e.getMonth() + 1)) : e.getMonth()}-${e.getDate() < 10 ? ('0' + e.getDate()) : e.getDate()} ${s2}`
        this.param.examStart = start
        this.param.examEnd = end
      }
    },
    created () {
       // 连接一次上传接口,让后台上传接口与第三方保持连接
       Api.connectUpload()

      let self = this
      self.param.examAuthor = sessionStorage.getItem('adminAccount')
      if(self.$route.query.id){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        self.getExamDetailInfo({examId:self.$route.query.id}).then(res => {
          // 关闭loading
          loading.close();
          let Obj = JSON.parse(JSON.stringify(res.data.examTempResp).replace("examDuration","duration").replace("examIsResit","reset").replace("examPicName","picName").replace("examPicUrl","picURL").replace("examPassScore","passmark").replace("examPrePersonNum","prePersonNum").replace("accountRespList","accountList"));
          delete Obj.arrangePaperResp
          self.param = {...Obj}
          self.param.examName = self.$route.query.paperName
          self.yourtime = [new Date(self.param.examStart),new Date(self.param.examEnd)]

           if(self.param.reset === 0){
                this.Reexamination = 0
			     }
            if(self.param.reset === 1 && self.param.examNum === 0){
                this.Reexamination = 1
            }
            if(self.param.reset === 1 && self.param.examNum > 0){
                this.Reexamination = 2
		      	}

			if(self.param.isDisorder === 0){
                this.questions = 0
                this.answer = 0
			}
			if(self.param.isDisorder === 1){
                this.questions = 1
                this.answer = 0
            }
            if(self.param.isDisorder === 2){
                this.questions = 0
                this.answer = 1
            }
            if(self.param.isDisorder === 3){
                this.questions = 1
                this.answer = 1
            }
          // 赋值自定义封面
          if(res.data.examTempResp.examPicName === '自定义封面') {
            this.uploadImgUrl = `${res.data.examTempResp.picIp}${res.data.examTempResp.examPicUrl}`
          } else {
            this.checkedDefaultUrl = res.data.examTempResp.examPicUrl
			  console.log(res.data.examTempResp.examPicUrl)
          }
          // 获取已经参加的人员
          res.data.examTempResp.accountRespList.forEach((item, index) => {
            this.getPerson.push(item)
          });

        })
      }
      self.param.operationAdmin = sessionStorage.getItem('adminAccount')
      self.param.examName = self.$route.query.paperName

      // 查询参加人员等
      this.getAllGroupInfo()
      this.getAllDepartment()
    },
    methods:{
      // 隐藏弹窗和添加上传图片
      hideUpload(url) {
        this.showUpload = false
        this.uploadImgUrl = url.uploadSrc
        this.param.picURL = url.fileUrl
      },
      queryOrSelPerson(v) {
        if(v === 1) {
           this.isQueryPerson = true
        } else {
          this.isQueryPerson = false
        }
        this.showAttendee = true
      },
      checkInt (value) {
        if(!Tool.isPosInteger(value)){
          this.$message.warning("必须是正整数");return;
        }
        return true
      },
      testParam () {
        if(this.yourtime.length === 0){
          this.$message.warning("请选择考试时间");return;
        }
        if(this.param.prePersonNum<1){
          this.$message.warning("请选择参加人员");return;
        }
        if(!this.checkInt(this.param.duration) || this.param.duration === ""){
          this.$message.warning("请输入考试时长");return;
        }
        /*判断重考次数*/
        if(this.Reexamination === 2 && (!this.checkInt(this.param.examNum) || this.param.examNum === 0)){
              this.$message.warning("请输入重考次数");return;
        }
        if(this.param.picURL === ""){
          this.$message.warning("请选择封面图片");return;
        }
        if(!this.checkInt(this.param.passmark) || this.param.passmark === "") {
          this.$message.warning("请输入通过分数");return;
        }
        let totalScore = JSON.parse(window.localStorage.getItem("paperInfo")).totalScore
        if(this.param.passmark > totalScore) {
          this.$message.warning(`请输入不大于总分${totalScore}分的通过分数`);return;
        }
        return true
      },
      publishPaper () {
        if(this.testParam()){
          const paperInfo = window.localStorage.getItem("paperInfo")
          this.param.examPaperRequest = {...JSON.parse(paperInfo)}
            if(this.questions === 0 && this.answer === 0){
                this.param.isDisorder = 0
            }
            if(this.questions === 1 && this.answer === 0){
                this.param.isDisorder = 1
            }
            if(this.questions === 0 && this.answer === 1){
                this.param.isDisorder = 2
            }
            if(this.questions === 1 && this.answer === 1){
                this.param.isDisorder = 3
            }

            if(this.Reexamination === 0){
                this.param.reset = 0;
                this.param.examNum = 1;
            }
            if(this.Reexamination === 1){
                this.param.reset = 1;
                this.param.examNum = 0;
            }
            if(this.Reexamination === 2){
                this.param.reset = 1;
            }
          this.publishingExam = true
          this.createExam(this.param).then(res => {
            if(res.code === 0){
              this.$message.success("发布成功")
              window.localStorage.removeItem("paperInfo")
              this.$router.push('/exam/list');
            }
          }).catch(() => {
            this.publishingExam = false
          })
        }
      },
      handleAddPerson (man, lx) {
        this.showAttendee = false
        if(lx) {
          this.param.prePersonNum = man.length
          this.param.accountList = man.map(item => ({userAccount:item.account,phone:item.phone}))
        }
      },
      viewPerson () {
      },
      handleCheck (val) {
        this.param.picURL = val
      },
      handleNoPic () {
        this.showUpload = true
      },
      handlePicTypeChange (val) {
  		  this.picList = val === "自定义封面" ?[{}]:[]
      },
      handleSuccess (val) {
        this.param.picURL = val
      },
      ...mapActions(["getExamDetailInfo","createExam", "getAllGroupInfo", "getAllDepartment"])
    }
  }
</script>

<style lang="less">
.migu-content{
	.reset_number_input{
		width: 150px;
		margin-left: 15px;
	}
  .cre-step {
    margin-top: 26px;
    margin-bottom: 44px;
  }
  .submit{
  width:160px;
  height:32px;
  border-radius:100px;
}
.select-person {
   width: 770px;
   .el-dialog__header {
        // padding: 0px;
        line-height: 9px;
    }
    .el-dialog__body {
            padding: 15px 20px !important;
    }
}

.el-step__head.is-text.is-success{
  background-color:#489efb!important;
  border-color:#489efb!important;

}
.el-step__title.is-success{
  color:#489efb!important;
}
}


</style>
