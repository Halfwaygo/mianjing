<template>
	<div class="migu-content newExam">
		 <!-- <h1 class="migu-content-title" style='font-family: "Microsoft YaHei";font-weight:200;'>{{ title }}</h1>  -->
 		<cre-step class="new-exam-step"></cre-step>
    <div class="blank-paper">{{ pageTitle }}</div>
    <el-form :inline="true" size="small" :rules="rules2">
		  <el-form-item label="试卷名称：" class="exam-name">
		  	<span v-if="hideEditPaperName">
		  	  <i class="el-icon-edit color-blue line-35" @click="editPaperName"></i>
		  	  {{examPaperRequest.paperName}}
		  	</span>
		    <!-- <el-input v-else class="w290" id="focusinput" v-model="examPaperRequest.paperName" placeholder="请在这里输入试卷名称，不得超过20个字" @blur="EditPaperName"></el-input> -->
		    <input v-else class="w290 examinput" ref="input" v-model.trim="examPaperRequest.paperName" placeholder="请在这里输入试卷名称，不得超过20个字" @blur="EditPaperName" maxlength="20"/>
      </el-form-item>
		  <el-form-item label="试卷分类：">
		    <el-select class="w290" v-model="examPaperRequest.typeId">
          <!-- <el-option value="-1" label="未归类"></el-option> -->
			    <el-option v-for="item in paperTypeList" :key="item.paperTypeId"
			      :label="item.paperTypeName" :value="item.paperTypeId">
			    </el-option>
			  </el-select>
			<span v-if="false" class="el-icon-edit color-blue" @click="handleAdd('examType')"></span>
		  </el-form-item>
      <i @click="addPaperClass" class="el-icon-plus" style="color: #409eff;margin-left: -9px;margin-top: 11px;cursor: pointer;"></i>
		</el-form>


    <div v-show="examPaperRequest.questionRequest.length === 0" class="add-title-question">
      <el-row>
        <el-col :span="6">
             <div class="page-title">
              <div class="add-question">
                <div class="add-info-question">
                  <img src="../../layouts/images/knowEdit.png">
                  <span class="title">添加题目</span>
                </div>
                <el-row class="sel-question">
                  <el-button type="" class="checked-sty" @click="addTitle(1, 0)">
                    <i class="el-icon-plus" style="color: #409eff;margin-right: 5px;"></i>
                    <span class="radio-wz">单选题</span>
                  </el-button>
                  <el-button type="" class="checked-sty" @click="addTitle(2, 0)">
                    <i class="el-icon-plus" style="color: #409eff;"></i>
                    <span class="checked-wz">多选题</span>
                  </el-button>
                </el-row>
              </div>
            </div>
        </el-col>

        <el-col :span="18">
           <div class="clearfix">
             <span class="fr chooseExam" @click="chooseFromSet">
                <img src="../../layouts/images/ic_paper.png">
                <span style="display:inline-block;margin-left: -9px;position:relative">从试题库选择</span>
             </span>
           </div>
        </el-col>
      </el-row>
    </div>

		<div v-show="examPaperRequest.questionRequest.length !== 0" class="clearfix" style="right: 20px;position: absolute;">
		  <span class="fr chooseExam" @click="chooseFromSet">
        <img src="../../layouts/images/ic_paper.png">
        <span style="display:inline-block;margin-left: -9px;position:relative">从试题库选择</span>
      </span>
		</div>

		<div class="question-area" v-if="examPaperRequest.questionRequest.length>0">

			<title-item :dataLength="examPaperRequest.questionRequest.length" :idx="key" :source="item" v-for="(item,key) in examPaperRequest.questionRequest" :key="key" @delete="handleDel" @setAddTitle="addTitle" @setMoveQues="moveQuestion"></title-item>
		</div>

		<div class="sumary-area">
			<h3 class="migu-content-title">试题详情</h3>
			<el-table size="small" :data="summary" style="width: 100%">
		      <el-table-column prop="type" label="题型"> </el-table-column>
		      <el-table-column prop="single" label="单选"> </el-table-column>
		      <el-table-column prop="multiple" label="多选"> </el-table-column>
		    </el-table>
		  <div class="align-center mt20">
				<el-button class="CreatePaperBtn" type="primary" round @click="generatePaper">生成试卷</el-button>
			</div>
		</div>

	    <el-dialog :visible.sync="showChooseDialog" v-if="showChooseDialog" width="90%" title="从试题库中选择题目" class="choose-title">
	  		<choose-title @checked="handleCheckedTitle"></choose-title>
	    </el-dialog>

      <el-dialog
          title="添加试卷分类"
          :before-close="cancelExamDiaClose"
          :visible.sync="isShowAddPaperClass"
          class="add-cate-title">
	       <el-input v-model="addExamCoteName" :maxlength="20" placeholder="请添加试卷分类"/>
        <span slot="footer" class="dialog-footer">
            <el-button class="cancel-s" @click="cancelExamDiaClose">取 消</el-button>
            <el-button class="confirm-s" type="primary" @click="conEditExamName">确 定</el-button>
        </span>
      </el-dialog>

	</div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import ChooseTitle from './chooseTitle'
  import TitleItem from './titleItem'
  import creStep from '../../components/step'
import Api from '../../utils/api';
import addCategory from "../../components/addCategory"

  export default {
    name:"newExam",
    data () {
      return {
        pageTitle: '新建空白试卷',
        addExamCoteName: '', // 添加的试卷分类
        addRadio: '',
        isShowAddPaperClass: false, // 是否显示试卷分类
        examPaperRequest:{
          paperId:"",//试卷id
          paperName:"",// 试卷名称
          source:Number(this.$route.query.source), // 0 新建 1 试卷库  2 excel导入
          totalScore:100, //试卷总分
          totalQuestion:10, // 问题总数
          typeId:"", //试卷类型
          changeStatus:1, // 0未修改 1已修改
          questionRequest:[], // 题目列表
          questionNumRequestList:[], //汇总题型列表
        },
        type: this.$route.query.type, // 0 新建 1查看详情 2 导入详情
        //默认添加的题目配置
        titleDefault:{
          typeId:"",//题目类型 1单选 2 多选
          pointId:0,//知识点id
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
          console.log(JSON.stringify(newVal));


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
      ChooseTitle,
      TitleItem,
      creStep,
      addCategory
    },
    created () {

      // 页面名字
      if(this.$route.query.isImport === '1') {
        this.pageTitle = '导入试卷详情'
      } else if(this.$route.query.id) {
        this.pageTitle = '编辑试卷'
      } else {
        this.addTitle(1,0)
      }
      let self = this
      self.getCreateBlankPaperInfo({pointId:0})
      if(self.$route.query.id) {
        self.hideEditPaperName = true
      	self.getExamDetailInfo({examId:self.$route.query.id}).then(res => {
      	  let ObjStr = JSON.stringify(res.data.examTempResp.arrangePaperResp).replace(/questionNumList/g,"questionNumRequestList").replace(/questionList/g,"questionRequest").replace(/optionList/g,"questionOptionRequestList")
          self.examPaperRequest = {...JSON.parse(ObjStr)}
          self.examPaperRequest.source = 0 //编辑进来的强制按照新增来走
      	})
      }
      if(self.$route.query.isImport) {
        let importData = JSON.parse(window.localStorage.getItem("importExamInfo"))
        self.examPaperRequest = importData
      }
      if(this.type === '2'){
        let importInfo = window.localStorage.getItem("importInfo")
      	this.examPaperRequest = {...JSON.parse(importInfo)}
      }
    },
    methods:{
      cancelExamDiaClose() {
        this.addExamCoteName = ''
        this.isShowAddPaperClass = false
      },
      conEditExamName() {
        Api.addPaperClass({
          paperTypeName: this.addExamCoteName
        }).then(res => {
           this.getCreateBlankPaperInfo({pointId:0})
        })
        this.addExamCoteName = ''
        this.isShowAddPaperClass = false
      },
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
      // 添加试卷分类
      addPaperClass() {
        this.isShowAddPaperClass = true
      },
      toAddPaperClass(v) {
        Api.addPaperClass({
          paperTypeName: v
        }).then(res => {
           this.getCreateBlankPaperInfo({pointId:0})
        })
        this.isShowAddPaperClass = false
      },
      editPaperName () {
        this.hideEditPaperName = false
        setTimeout(() => {
          this.$refs['input'].focus()
        }, 300)
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
        this.examPaperRequest.questionRequest.push(_default)
        // this.examPaperRequest.questionRequest.splice(index, 0, _default)
      },
      handleDel (idx) {
        this.examPaperRequest.questionRequest.splice(idx,1)
      },
      testParam () {
        if(this.examPaperRequest.questionRequest.length === 0) {
          this.$message.warning("还没有添加试题内容");
          return false;
        }
        if(this.examPaperRequest.paperName.length > 20){
          this.$message.warning("试卷名称不得超过20个字符！");
          return false;
        }
        if(this.examPaperRequest.paperName === "") {
          this.$message.warning({
            message: '试卷名称未填写'
          })
          return false
        }
        if(this.examPaperRequest.typeId === ""){
          this.$message.warning({
            message: '试卷分类不能为空'
          })
          return false
        }
        if(this.testTitle()){
          // this.$message.warning({
          //   message: '试题内容没有填写完整'
          // })
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
        //
        let questionAnswer = this.examPaperRequest.questionRequest.filter(item => item.questionAnswer === "0").length
        console.log(JSON.stringify(this.examPaperRequest.questionRequest));

        let isFalseArr = [testTitleName>0, testTitleCore>0, testOption>0, questionAnswer>0]
        let warningArr = ['请将所有题的题目填写完整', '请将所有题的分值填写完整', '请将所有题的答案选项填写完整', '请将所有题的正确答案填写完整']
        isFalseArr.forEach((item, index) => {
           if(item === true) {
             this.$message.warning({
               message:  warningArr[index]
             })
           }
        })

        let selectQuestionLength = false
        this.examPaperRequest.questionRequest.forEach((item, index) => {
          if(item.questionOptionRequestList.length < 2) {
             this.$message.warning(`第${index+1}题试题选项不能少于2个`)
             selectQuestionLength = true
          }
        })
        return testTitleName > 0  || testTitleCore>0 || testOption>0 || /*testKnow > 0 || */questionAnswer>0 || selectQuestionLength
      },
      generatePaper () {
        console.log(JSON.stringify(this.examPaperRequest))

        this.examPaperRequest.questionRequest.forEach((item, index) => {
          this.examPaperRequest.questionRequest[index].questionAuthor = sessionStorage.getItem('adminAccount')
        })
        if(this.testParam()){
          window.localStorage.setItem("paperInfo",JSON.stringify(this.examPaperRequest))
          if(this.$route.query.id){
          this.$router.push({path:'/exam/basicInfo',query:{paperName:this.examPaperRequest.paperName,id:this.$route.query.id}})
          }else{
          this.$router.push({path:'/exam/basicInfo',query:{paperName:this.examPaperRequest.paperName}})
          }
        }
      },
      handleCheckedTitle (str) {
        console.log(JSON.stringify(this.examPaperRequest.questionRequest));

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

<style  lang="less">
  .newExam {
      .el-dialog--small {
        width: 30% !important;
      }
    .choose-title {
      .el-dialog--small {
        width: 65% !important;
      }
    }
  }
  .v-modal{
    z-index:2!important;
  }
  .el-button {
  	width:auto;
    padding:0 10px;
  }
  .migu-content {
    .new-exam-step {
      margin-top: 46px;
      margin-bottom: 55px;
    }
    .CreatePaperBtn{
      width:160px;
      height:32px;
      text-align: center;
      line-height: 32px;
      border-radius: 100px;
      background:#489efb;
    }
    .sumary-area {
      margin-bottom: 20px;
    }
    .blank-paper {
      font-weight: bold;
      margin-top: 18px;
      margin-bottom: 22px;
      font-size: 16px;
      color: #333;
    }
    .exam-name {
      margin-right: 48px;
      .el-form-item__label {
         padding: 11px 10px 11px 0;
      }
    }

    .examinput {
      border: 1px solid #bfcbd9;
      height: 34px;
      line-height: 34px;
      width: 290px;
    }
    .cancel-s {
      width: 120px;
      border: 1px solid #dcdfe6 !important;
    }
    .confirm-s {
       width: 120px;
    }

    .add-title-question {
      .page-title {
        clear: both;
        margin-bottom: 9px;
        .add-question {
          width: 120px;
          &:hover {
            width: 200px;
            .sel-question {
              display: inline-block;
              width: 250px;
            }
            .add-info-question {
              display: none;
               width: 250px;
            }

          }
          .add-info-question {
            background-color: #fff;
            width: 120px;
            // display: inline-block;
          }
          .sel-question {
              display: none;
          }
        }
      }
    }
  }

</style>
