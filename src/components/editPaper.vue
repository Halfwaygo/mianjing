<template>
  <div class="migu-content newExam">
     <!-- <h1 class="migu-content-title" style='font-family: "Microsoft YaHei";font-weight:200;'>{{ title }}</h1>  -->
    <el-form :inline="true" size="small" :rules="rules2">
      <el-form-item label="试卷名称：" style="margin-right:50px;">
        <span v-if="hideEditPaperName">
          <i class="el-icon-edit color-blue line-35" @click="editPaperName"></i>
          {{examPaperRequest.paperName}}
        </span>
        <el-input v-else class="w290" v-model="examPaperRequest.paperName" placeholder="请在这里输入试卷名称，不得超过20个字" @blur="EditPaperName"></el-input>
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
    </el-form>

    <div class="clearfix">
      <div class="fl" v-if="showCheckBtn" @mouseout.native="showCheckBtn=false">
        <el-button type="primary" @click="addTitle(1)">单选题</el-button>
        <el-button type="primary" @click="addTitle(2)">多选题</el-button>
      </div>
      <el-button v-else size="small" type="primary" class="fl" @mouseover.native="showCheckBtn=true">添加题目</el-button>
        <span class="fr chooseExam" @click="chooseFromSet">从试卷库选择</span>
    </div>

    <div class="question-area" v-if="examPaperRequest.questionRequest.length>0">
      <title-item :idx="key" :source="item" v-for="(item,key) in examPaperRequest.questionRequest" @delete="handleDel"></title-item>
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

      <el-dialog :visible.sync="showChooseDialog" v-if="showChooseDialog" width="90%" title="从试题库中选择题目">
        <choose-title @checked="handleCheckedTitle"></choose-title>
      </el-dialog>

  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import ChooseTitle from './chooseTitle'
  import TitleItem from './titleItem'

  export default {
    name:"newPaper",
    data () {
      return {
        examPaperRequest:{
          //paperId:"",//试卷id
          paperName:"",// 试卷名称
          paperAuthor:window.sessionStorage.getItem("adminAccount"),
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
          questionAuthor:window.sessionStorage.getItem("adminName"),//题目创建人
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
      let self = this

      self.getCreateBlankPaperInfo({pointId:0})
      if(self.$route.query.id){
        self.hideEditPaperName = true
        self.getExamDetailInfo({examId:self.$route.query.id}).then(res => {
          console.log(res.data.examTempResp.arrangePaperResp,'00000000')
          let ObjStr = JSON.stringify(res.data.examTempResp.arrangePaperResp).replace(/questionNumList/g,"questionNumRequestList").replace(/questionList/g,"questionRequest").replace(/optionList/g,"questionOptionRequestList")
          self.examPaperRequest = {...JSON.parse(ObjStr)}
          self.examPaperRequest.source = 0 //编辑进来的强制按照新增来走
        })
      }
      if(this.type === '2'){
        let importInfo = window.localStorage.getItem("importInfo")
        this.examPaperRequest = {...JSON.parse(importInfo)}
      }
    },
    methods:{
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
      addTitle (type) { // type 0单选 1多选
        let _default = JSON.parse(JSON.stringify(this.titleDefault))
        _default.canEidt = true //是否是新建 true 所有选项默认编辑状态  false 默认纯展示状态
        _default.typeId = type
        _default.questionSort = this.examPaperRequest.questionRequest.length + 1
        _default.questionSource = 0
        this.examPaperRequest.questionRequest.push(_default)
      },
      handleDel (idx) {
        this.examPaperRequest.questionRequest.splice(idx,1)
      },
      testParam () {
        let self = this
        if(self.examPaperRequest.paperName === "" || this.testTitle()){
          self.$alert('还有内容未填写(名称或试题内容)', '', {
            confirmButtonText: '知道啦'
          })
          return false
        }
        return true
      },
      testTitle () {
        let testTitleName = this.examPaperRequest.questionRequest.filter(item => item.questionDesc === "").length
        let testTitleCore = this.examPaperRequest.questionRequest.filter(item => item.questionScore === "").length
        let testOption = this.examPaperRequest.questionRequest.map(item => {
          return item.questionOptionRequestList.filter(subItem => subItem.optionDesc === "")
        }).filter(item => item.length>0).length
        return testTitleName >0  || testTitleCore>0 || testOption>0
      },
      generatePaper () {
        //0614 新增加的
        //console.log(this.examPaperRequest.paperName.length,'---------')
        if(this.examPaperRequest.paperName.length > 20){
          this.$message.warning("试卷名称超过20个字符啦！");return;
        }
        this.addPaperInFo(this.examPaperRequest).then(res => {
            if(res.code === 0){
              this.$message.success("发布成功")
              //window.localStorage.removeItem("paperInfo")
              this.$router.push('paperLibrary');
            }
          })

        if(this.testParam()){
          // window.localStorage.setItem("paperInfo",JSON.stringify(this.examPaperRequest))
          // if(this.$route.query.id){
          // this.$router.push({path:'/exam/basicInfo',query:{paperName:this.examPaperRequest.paperName,id:this.$route.query.id}})
          // }else{
          // this.$router.push({path:'/exam/basicInfo',query:{paperName:this.examPaperRequest.paperName}})
          // }
        }
      },
      handleCheckedTitle (str) {
        this.showChooseDialog = false
        this.examPaperRequest.questionRequest = this.examPaperRequest.questionRequest.concat(JSON.parse(str))
      },
      ...mapActions(["getCreateBlankPaperInfo","getExamDetailInfo","addPaperInFo"])
    }
  }
</script>

<style scoped lang="less">
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
</style>
