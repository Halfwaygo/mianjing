<template>
  <!-- 新建试卷库 -->
	<div class="question-bank">
		<div class="clearfix">
			<div class="fl">
				<!-- <el-button type="primary" @click="addTitle(1)" :disabled="disabledObj.radioAbled">单选题</el-button>
				<el-button type="primary" @click="addTitle(2)" :disabled="disabledObj.checkAbled">多选题</el-button> -->
        <span class="question-fo">题型:</span>
        <div class="big-btn" @click="changeType">
           <div class="singgle-dx">单选题</div>
           <div class="max-dx">多选题</div>
           <div class="se-dx" :style="changeQuestionType === true ? '' : 'right: 0'">{{ changeQuestionType === true ? '单选题' : '多选题' }}</div>
        </div>
      </div>
		</div>
		<div class="question-area" v-if="examPaperRequest.questionRequest.length>0">
		  <title-item :isquestion="true" :idx="key" :source="item" v-for="(item,key) in examPaperRequest.questionRequest" :key="key" @delete="handleDel"></title-item>
			<div class="align-center mt20">
				<el-button class="CreatePaperBtn" type="primary" round @click="saveQustion" :disabled="saveingQue">保存</el-button>
				<el-button class="CreatePaperBtn cancel-btn" type="primary" round @click="cancelCreate">取消</el-button>
			</div>
  		</div>
		<div class="sumary-area">

		</div>

	</div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import TitleItem from './titleItem'
  import Api from "../../utils/api"

  export default {
    name:"newExam",
    data () {
      return {
        changeQuestionType: true,
        addQuestionParam: {
          "questionTypeId": "",
          "questionDesc": "",
          "questionScore": 0,
          "questionPointId": "",
          "questionPointName": "",
          "difficultyLevel": 0,
          "questionAnswer": "",
          "authorAccount": "",
          "examQuestionOptionInfoReqList": [{
              "optionDesc": "",
              "optionSort": 0,
              "optionInRight": 0
            }]
        },
        examPaperRequest:{
          paperId:"",//试卷id
          paperName:"",// 试卷名称
          source:Number(this.$route.query.source), // 0 新建 1 试卷库  2 excel导入
          totalScore:100, //试卷总分
          totalQuestion:10, // 问题总数
          typeId:"", //试卷类型
          changeStatus:1, // 0未修改 1已修改
          questionRequest:[], // 题目列表
          questionNumRequestList:[] //汇总题型列表
        },
        type:this.$route.query.type, // 0 新建 1查看详情 2 导入详情
        //默认添加的题目配置
        titleDefault:{
          typeId:"",//题目类型 1单选 2 多选
          pointId:"",//知识点id
          pointName:"",//知识点名称
          questionSort:"", //题目序号
          questionDesc:"",//题目描述
          questionDifficultyLevel:1,//难易度等级 1,2,3
          questionAnswer:"",//题目答案
          questionScore:"",//题目分数
          questionSource:"",//题目来源
          questionId:"", //试卷库试卷id
          questionOptionRequestList:[ // 选项列表
            {
              optionDesc:"",// 选项描述
              optionSort:"1",//选项序号
              optionInRight:0 //是否是正确选项 0 不在 1在
            }, {
              optionDesc:"",// 选项描述
              optionSort:"2",//选项序号
              optionInRight:0 //是否是正确选项  0 不在 1在
            }
          ]
        },
        summary:[],
        //以下是非业务部分
        disabledObj: {
          radioAbled: true,
          checkAbled: false
        },
        showChooseDialog:false,
        showCheckBtn:false,
        hideEditPaperName:false,
        saveingQue: false,
        rules2: {
          paperName: [
            { min: 1, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    watch:{
      'examPaperRequest.questionRequest':{
        handler (newVal,oldVal) {
            let single = newVal.filter(item => item.typeId == 1)
            let multiple = newVal.filter(item => item.typeId == 2)
        	let singleCore = 0
        	let multiCore = 0
        	single.forEach(item => singleCore += item.questionScore*1)
        	multiple.forEach(item => multiCore += item.questionScore *1)
        	let arr = this.examPaperRequest.questionNumRequestList= [{
        		typeId:0,number:single.length,
        		score:singleCore
        	},{
        		typeId:1,number:multiple.length,
        		score:multiCore
        	}]
          this.examPaperRequest.totalScore = arr[0].score + arr[1].score //试卷总分
          this.examPaperRequest.totalQuestion = arr[0]['number'] + arr[1]['number'] //试卷总题目数

        	this.summary = [
	      		{"type":"题数","single":arr[0]['number'],"multiple":arr[1]['number']},
	      		{"type":"分值","single":arr[0].score,"multiple":arr[1].score},
	      		{"type":"总分","single":"","multiple":arr[0].score+arr[1].score},
	      	]
        },
        deep:true
      }
    },
    computed:{
      title () {
        return this.type == '0'?"新建空白试卷":this.type == '1'?"编辑试卷":"导入试卷详情"
      },
      ...mapState({
    		"paperTypeList":({exam}) => exam.paperTypeList,
    		"questionTypeList":({exam}) => exam.questionTypeList,
    		"examInfo":({exam}) => exam.examInfo
      })
    },
    components:{
      TitleItem
    },
    created () {

      let self = this
      // self.getCreateBlankPaperInfo({pointId:0})
      if(self.$route.query.questionId){
         Api.getQuestionInfo({
          questionId: self.$route.query.questionId
         }).then(res => {
             // 判断默认单选多选
            res.data.questionTypeId == 1 ? self.changeQuestionType = true : self.changeQuestionType = false;
           // 赋值给组件的字段
           let fild1 = ['questionId', 'typeId', 'pointId', 'pointName', 'questionDesc', 'questionDifficultyLevel', 'questionAnswer', 'questionScore', 'questionAuthor', 'adminName', 'typeName', 'questionPointInfoList']
            //  接口字段
           let fild2 = ['questionId', 'questionTypeId', 'questionPointId', 'questionPointName', 'questionDesc', 'difficultyLevel', 'questionAnswer', 'questionScore', 'authorAccount', 'authorAdmin', 'questionTypeName', 'questionPointInfoList']
           let questionRequestObj = {}
           fild2.forEach((item, index) => {
              questionRequestObj[fild1[index]] = res.data[item]
          })
           let questionOptionRequestList = []
           res.data.questionOptionInfoList.forEach(item => {

             let obj = {
               id: item.optionId,
               questionId: item.sQuestionId,
               optionDesc: item.optionDesc,
               optionSort: item.optionSort,
               optionInRight: item.optionInRight
             }
             questionOptionRequestList.push(obj)
           })
           questionRequestObj.questionOptionRequestList = questionOptionRequestList
           this.examPaperRequest.questionRequest.push(questionRequestObj)
          //  this.examPaperRequest.questionRequest.push(res.data)
         })
        // self.hideEditPaperName = true
      	// self.getExamDetailInfo({examId:self.$route.query.id}).then(res => {
      	//   let ObjStr = JSON.stringify(res.data.examTempResp.arrangePaperResp).replace(/questionNumList/g,"questionNumRequestList").replace(/questionList/g,"questionRequest").replace(/optionList/g,"questionOptionRequestList")
      	//   self.examPaperRequest = {...JSON.parse(ObjStr)}
        //   self.examPaperRequest.source = 0 //编辑进来的强制按照新增来走
      	// })
      } else {
        this.addTitle(1)
      }
      if(this.type === '2'){
        let importInfo = window.localStorage.getItem("importInfo")
      	this.examPaperRequest = {...JSON.parse(importInfo)}
      }
    },
    methods:{
      // 改变提醒
      changeType() {
        this.changeQuestionType = !this.changeQuestionType
        if(this.changeQuestionType) {
          this.addTitle(1)
        } else {
          this.addTitle(2)
        }
      },
      cancelCreate() {
        this.$router.go(-1)
      },
      editPaperName () {
        this.hideEditPaperName = false
      },
      EditPaperName () {
        if( this.type !== '0'){
          this.hideEditPaperName = true
        }
      },
      chooseFromSet () {
      	this.showChooseDialog = true
      },
      addTitle(type) { // type 0单选 1多选
      if(!this.$route.query.questionId) {
        let _default = JSON.parse(JSON.stringify(this.titleDefault))
        _default.canEidt = true //是否是新建 true 所有选项默认编辑状态  false 默认纯展示状态
        _default.typeId = type
        _default.questionAuthor = sessionStorage.getItem('adminAccount')
      	_default.questionSort = this.examPaperRequest.questionRequest.length + 1
        _default.questionSource = 0
        let questionOptionRequestList;
        // if(this.$route.query.questionId) {
        //   questionOptionRequestList = this.examPaperRequest.questionRequest[0].questionOptionRequestList;
        //   console.log(JSON.stringify(questionOptionRequestList));

        // }
        this.examPaperRequest.questionRequest = []
        this.examPaperRequest.questionRequest[0] = _default
        // if(this.$route.query.questionId) {
        //   this.examPaperRequest.questionRequest[0].questionOptionRequestList = questionOptionRequestList

        // }
        } else {
          let newQuestionRequest = this.examPaperRequest.questionRequest[0]
           console.log(JSON.stringify(newQuestionRequest));
          newQuestionRequest.typeId = type

          this.$set(this.examPaperRequest.questionRequest, 0, newQuestionRequest)


        }
      },
      handleDel(idx) {
        this.examPaperRequest.questionRequest.splice(idx,1)
      },
      testParam() {
        if(this.testTitle()){
          return false
        }
        return true
      },
      testTitle () {
        // 试卷题目
        let testTitleName = this.examPaperRequest.questionRequest.filter(item => item.questionDesc === "").length
        // 试卷分数
        let testTitleCore = this.examPaperRequest.questionRequest.filter(item => item.questionScore === "").length
        // 试卷答案
        let testOption = this.examPaperRequest.questionRequest.map(item => {
        return item.questionOptionRequestList.filter(subItem => subItem.optionDesc === "")
        }).filter(item => item.length>0).length
        // 试卷所属知识点
        let testKnow = this.examPaperRequest.questionRequest.filter(item => item.pointName === "").length
        // 是否选择了试题正确答案
        let questionAnswer = this.examPaperRequest.questionRequest.filter(item => item.questionAnswer === "0").length
        console.log(JSON.stringify(this.examPaperRequest.questionRequest));

        debugger
        let isFalseArr = [testTitleName>0, testTitleCore>0, testOption>0, questionAnswer>0]
        let warningArr = ['请将所有题的题目填写完整', '请将所有题的分值填写完整', '请将所有题的答案选项填写完整', '请将所有题的正确答案填写完整']
        isFalseArr.forEach((item, index) => {
           if(item === true) {
             this.$message.warning({
               message:  warningArr[index]
             })
           }
        })
        return testTitleName > 0  || testTitleCore>0 || testOption>0 || /*testKnow > 0 ||*/ questionAnswer>0
      },
      saveQustion () {
        if(this.testParam()){
          let singgle = this.examPaperRequest.questionRequest[0]
          // 新增接口时需要的字段
          let fild1 = ['questionTypeId', 'questionDesc', 'questionScore', 'questionPointId', 'questionPointName', 'difficultyLevel', 'questionAnswer', 'authorAccount', 'examQuestionOptionInfoReqList']
          // 组件传过来得字段
          let fild2 = ['typeId', 'questionDesc', 'questionScore', 'pointId', 'pointName', 'questionDifficultyLevel', 'questionAnswer', 'questionAuthor', 'questionOptionRequestList']
          fild2.forEach((item, index) => {
              this.addQuestionParam[fild1[index]] = singgle[item]
          })
			if(this.examPaperRequest.questionRequest[0].questionOptionRequestList.length <= 1){
                this.$message.warning({
                    message: '至少添加两条选项'
                });
			    return
			}
          if(this.$route.query.questionId){
              this.addQuestionParam.questionId = this.$route.query.questionId
              this.saveingQue = true
              Api.updateQuestion(this.addQuestionParam).then(res => {
                if(res.code === 0) {
                  this.$message.success({
                    message: '修改试题成功'
                  })
                  this.$router.go(-1)
                }
              }).catch(() => {
                 this.saveingQue = false
              })
          } else {
            this.saveingQue = true
            this.addQuestion(this.addQuestionParam).then(res => {
                if(res.code === 0) {
                  this.$message.success({
                    message: '添加试题成功'
                  })
                  this.$router.go(-1)
                }
             }).catch(() => {
                 this.saveingQue = false
              })
          }

        }
      },
      handleCheckedTitle (str) {
        let checkedQuestion = JSON.parse(str)
        checkedQuestion.forEach((item,index) => {
          checkedQuestion[index].questionAuthor = sessionStorage.getItem('adminAccount')
          checkedQuestion[index].pointId = checkedQuestion[index].questionPointId
        })

        this.showChooseDialog = false
        this.examPaperRequest.questionRequest = this.examPaperRequest.questionRequest.concat(checkedQuestion)
      },
      ...mapActions(["addQuestion", "getCreateBlankPaperInfo","getExamDetailInfo"])
    }
  }
</script>

<style lang="less">
  .el-button {
  	width:auto;
    padding:0 10px;
  }

  .question-bank {
    .el-dialog--small {
      width: 30% !important;
    }
    .el-button--handle.delete {
      display: none;
    }
    .clearfix {
     margin-bottom: 10px;
      .question-fo {
        float: left;
        margin-top: 6px;
        margin-right: 10px;
      }
      .big-btn {
        position: relative;
        display: inline-block;
        width: 147px;
        border-radius: 32px;
        height: 32px;
        background-color: #fff;
        cursor: pointer;
        .singgle-dx {
          color: #666;
          float: left;
          margin-top: 6px;
          margin-left: 16px;
        }
        .max-dx {
          float: right;
          color: #666;
          margin-top: 6px;
          margin-right: 16px;
        }
        .se-dx {
          position: absolute;
          text-align: center;
          line-height: 33px;
          color: #fff;
          width: 80px;
          height: 32px;
          border-radius: 32px;
          background-color: #489EFB;
        }
      }
    }
    .CreatePaperBtn {
      width:160px;
      height:32px;
      text-align: center;
      line-height: 32px;
      border-radius: 100px;
      background:#489efb;
    }
    .sumary-area {
      margin-top: 20px
    }
    .cancel-btn {
      background-color: #fff;
      color:#9B9B9B;
      border: 1px solid #E6E7ED;
    }
    .el-card {
      height: auto;
    }
    padding: 0 20px;
    padding-top: 80px;
  }
</style>
