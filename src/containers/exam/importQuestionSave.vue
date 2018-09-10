<template>
	<div class="import-question-save">
    <div class="top-fix">
      <div class="title-info">导入试题详情</div>
      <el-button class="complet" type="primary" round @click="generatePaper()">完成</el-button>
    </div>


		<div class="question-area" v-if="examPaperRequest.questionRequest.length>0">
			<title-item :dataLength="examPaperRequest.questionRequest.length" :idx="key" :source="item" v-for="(item,key) in examPaperRequest.questionRequest" :key="key" @delete="handleDel" @setAddTitle="addTitle" @setMoveQues="moveQuestion"></title-item>
		</div>

		<div class="sumary-area">
		    <div class="align-center mt20">
			</div>
		</div>

	    <el-dialog :visible.sync="showChooseDialog" v-if="showChooseDialog" width="90%" title="从试题库中选择题目">
	  		<choose-title @checked="handleCheckedTitle"></choose-title>
	    </el-dialog>

	</div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import ChooseTitle from './chooseTitle'
  import TitleItem from './titleItem'
  import Api from "../../utils/api";

  export default {
    name:"newExam",
    data () {
      return {
        questionsParamList: [
        //   {
        // "questionTypeId":"0",
        // "questionDesc":"员工培训有利于改善企业的工作质量，其中工作质量不包括",
        // "questionScore":5,
        // "questionPointId":"8e6e3f82-00e9-44f2-834f-4c5943cb5501",
        // "questionPointName":"综合/人力资源/质量管理",
        // "difficultyLevel":2,
        // "questionAnswer":"1",
        // "authorAccount": sessionStorage.getItem('adminAccount'),
        // "examQuestionOptionInfoReqList":[
        //   {
        //     "optionDesc":"员工质量",
        //     "optionSort":1,
        //     "optionInRight":1
        //   },
        //   {
        //     "optionDesc":"过程质量",
        //     "optionSort":2,
        //     "optionInRight":0
        //   }
        //   ]
        // }
        ],
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
            },{
              optionDesc:"",// 选项描述
              optionSort:"2",//选项序号
              optionInRight:0 //是否是正确选项  0 不在 1在
            }
          ]
        },
        summary:[],
        //以下是非业务部分
        showChooseDialog:false,
        showCheckBtn:false,
        hideEditPaperName:false,
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
      ChooseTitle,TitleItem
    },
    created () {
      let questionList = JSON.parse(window.localStorage.getItem("importQuestionInfo"))
      this.examPaperRequest.questionRequest = questionList

    },
    methods:{
      // 移动试题
      moveQuestion(type, idx) {
        // 1是下移，2是上移
        if(type === 1){
          let nowData = this.examPaperRequest.questionRequest[idx]
          this.examPaperRequest.questionRequest.splice(idx, 1, this.examPaperRequest.questionRequest[idx+1])
          this.examPaperRequest.questionRequest.splice(idx + 1, 1, nowData)
        } else {
          let nowData = this.examPaperRequest.questionRequest[idx]
          this.examPaperRequest.questionRequest.splice(idx, 1, this.examPaperRequest.questionRequest[idx-1])
          this.examPaperRequest.questionRequest.splice(idx - 1, 1, nowData)
        }
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
      addTitle (type, index) { // type 0单选 1多选
        let _default = JSON.parse(JSON.stringify(this.titleDefault))
        _default.canEidt = true //是否是新建 true 所有选项默认编辑状态  false 默认纯展示状态
        _default.typeId = type
        _default.questionAuthor = sessionStorage.getItem('adminAccount')
      	_default.questionSort = this.examPaperRequest.questionRequest.length + 1
        _default.questionSource = 0
        _default.questionPointInfoList = [{
          "pointId":"",
          "pointName":"",
          "parentId":"",
          "pointLevel":0}]
        // this.examPaperRequest.questionRequest.push(_default)
        this.examPaperRequest.questionRequest.splice(index, 0, _default)
      },
      handleDel (idx) {
        this.examPaperRequest.questionRequest.splice(idx,1)
      },
      testTitle() {
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
        let questionAnswer = this.examPaperRequest.questionRequest.filter(item => item.questionAnswer === "").length
        let isFalseArr = [testTitleName>0, testTitleCore>0, testOption>0, /*testKnow > 0,*/ questionAnswer>0]
        let warningArr = ['请将所有题的题目填写完整', '请将所有题的分值填写完整', '请将所有题的答案选项填写完整', /*'请将所有题的所属知识点填写完整',*/ '请将所有题的正确答案填写完整']
        isFalseArr.forEach((item, index) => {
           if(item === true) {
             this.$message.warning({
               message:  warningArr[index]
             })
           }
        })
        return testTitleName > 0  || testTitleCore>0 || testOption>0 || /*testKnow > 0 ||*/ questionAnswer>0
      },
      generatePaper () {
        if(this.testTitle() === false){
          // 组件传过来得字段
          let field1 = ['typeId','questionDesc', 'questionScore', 'pointId', 'pointName', 'questionDifficultyLevel', 'questionAnswer', 'questionOptionRequestList']
          // 新增时传给接口的字段
          let field2 = ['questionTypeId', 'questionDesc', 'questionScore', 'questionPointId', 'questionPointName', 'difficultyLevel', 'questionAnswer', 'examQuestionOptionInfoReqList']
          this.examPaperRequest.questionRequest.forEach((res, index) => {
            let questionsParamObj = {}
            field1.forEach((item, dex) => {
              questionsParamObj[field2[dex]] = res[item]
            })
            questionsParamObj.authorAccount = sessionStorage.getItem('adminAccount')
            this.questionsParamList.push(questionsParamObj)
          })
          Api.addQuestionList(this.questionsParamList).then((res) => {
            this.$message.success({
              message: '导入试题成功'
            })
            this.$router.push('examLibrary')
          })
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
      ...mapActions(["getCreateBlankPaperInfo","getExamDetailInfo"])
    }
  }
</script>

<style lang="less">
.import-question-save {
  padding-left: 30px;
   .el-button {
  	width:auto;
    padding:0 10px;
  }
  .CreatePaperBtn{
    width:160px;
    height:32px;
    text-align: center;
    line-height: 32px;
    border-radius: 100px;
    background:#489efb;
  }
  .top-fix {
    line-height: 85px;
    margin-top: 56px;
    height: 65px;
    .title-info {
      float: left;
      font-size:16px;
      font-family:MicrosoftYaHei;
      color: #333;
      font-weight: bold;
    }
    .complet {
      border-radius: 34px;
      width: 160px;
      margin-top: 25px;
      float: right;
    }
  }
}

</style>
