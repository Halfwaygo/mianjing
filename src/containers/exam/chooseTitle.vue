<template>
  <div class="migu-content chooseTitle">
      <div class="dialog-head" style="position: absolute;top: 58px;left: 205px;">
         <el-input placeholder="请输入关键字" v-model="param.blurName" size="small"></el-input>
         <el-button style="width: 80px" type="primary" size="small" @click="searchTitle"><span class="el-icon-search"></span>搜索</el-button>
      </div>
      <el-form label-width="105px" class="titleChoose">
      <el-form-item label="题型：" class="mb0">
        <el-radio-group class="aa" style="margin-top: -3px" v-model="param.questionTypeId" size="small">
            <el-radio-button  label="0">不限</el-radio-button>
            <el-radio-button  label="1">单选题</el-radio-button>
            <el-radio-button  label="2">多选题</el-radio-button>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="所属知识点：" class="mb0">
        <knowledge :isShowAll="true" @konwledgePointId="konwledgePointId"></knowledge>
      </el-form-item>
      <el-form-item label="难易程度：" class="mb0">
        <el-radio-group style="line-height: 32px" v-model="param.difficultyLevel">
          <el-radio  label="0">不限</el-radio>
          <el-radio label="1">易</el-radio>
          <el-radio label="2">中</el-radio>
          <el-radio label="3">难</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="创建人：" class="mb0">
        <el-select v-model="param.adminAccount" placeholder="请选择" class="author" @change="courseTypePersonChange">
            <el-option v-for="(item, index) in courseadminList"
              :label="item.adminName" :value="item.adminAccount"
              :key="index">
            </el-option>
        </el-select>
      </el-form-item>
      </el-form>
      <el-table :data="questionByPageResp" style="width: 100%" :row-key="getRowKeys" v-loading="isLoading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
          <el-table-column label="题型" prop="questionTypeName"></el-table-column>
          <el-table-column label="题目" width="400" prop="questionDesc"></el-table-column>
          <el-table-column label="知识点" prop="questionPointName"></el-table-column>
          <el-table-column label="分值" prop="questionScore"></el-table-column>
          <el-table-column label="难易程度" prop="difficultyLevelName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="viewDetail(scope.row.questionId)" type="handle check" size="small" title="查看" ></el-button>
            </template>
          </el-table-column>
      </el-table>
      <div class="pagination-wrap clearfix" v-if="questionByPageResp.length>0">
        <el-pagination @current-change="handleCurrentChange" :current-page="param.currentPage"  :total="pagess" layout=" prev, pager, next, jumper" class="fr">
        </el-pagination>
        <div class="fl line-35">已选中：单选题：<span class="color-blue">{{singleTotal}}</span>，多选题：<span class="color-blue">{{multipleTotal}}</span></div>
      </div>

      <div slot="footer" class="dialog-footer align-center">
	    <el-button type="primary" @click="handleChecked" style="width:160px;height:32px;border-radius:100px;">确 定</el-button>
	  </div>

    <el-dialog class="detailBox" title="题目详情" :visible.sync="showDetail" v-if="showDetail" width="40%" id="showDetail">
      <el-form label-width="150px">
          <el-form-item class="mb0" label="所属知识点：">
            <span style="position:relative;top:22px;">{{titleDetail.questionPointName}}</span>
          </el-form-item>
          <el-form-item class="mb0" label="难易程度：">
            <span style="position:relative;top:22px;">{{titleDetail.difficultyLevelName}}</span>
          </el-form-item>
          <!-- 题目标题 -->
          <!-- <el-form-item class="mb0" :label="'【'+titleDetail.questionTypeName+'】'">
            <span style="position:relative;top:16px;">{{titleDetail.questionDesc}}({{titleDetail.questionAnswer}})</span>
          </el-form-item> -->
          <div style="padding-left: 88px;">
            <span>{{ titleDetail.questionTypeName }}: </span>
            <span class = "titleDetailSpan">{{titleDetail.questionDesc}}({{titleDetail.questionAnswer}})</span>
          </div>
          <!-- 选项 -->
          <el-form-item>
          <div v-for="(option, index) in titleDetail.questionOptionInfoList" :key="index" class="mb10">
              <el-radio v-if="titleDetail.questionTypeId === '1'" v-model="option.optionInRight" disabled :label="1">{{ option.optionDesc }}</el-radio>
              <template v-else>
                <el-checkbox disabled v-if="titleDetail.questionAnswer.indexOf(String(option.optionSort))>-1" checked>{{ option.optionDesc }}</el-checkbox>
                <el-checkbox v-else disabled>{{ option.optionDesc }}</el-checkbox>
              </template>
          </div>
          </el-form-item>
      </el-form>
	</el-dialog>

  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import Knowledge from '../../components/Knowledge'
  export default {
    name:'chooseTitle',
    data () {
      return {
          // 获取row的key值
          getRowKeys(row) {
              return row.questionId;
          },
        isLoading: true, // 表格加载中
        param:{
          currentPage:1,
          pageSize:10,
          difficultyLevel:"0",
          adminAccount:'',   // questionAuthor
          questionTypeId:"0",   //题型id
          questionPointId:"",   //知识点id
          blurName:"",
          sortField:0,
          sortType:'-1'
        },
        checkedList:[],
        titleDetail:{
          questionPointName:"",
          difficultyLevelName:"",
          questionTypeName:"",
          questionDesc:"",
          questionAnswer:"",
          questionOptionInfoList:[]
        },
        showDetail:false,
        courseTypePerson:'',
      }
    },
    computed:{
      singleTotal() {
        return this.checkedList.filter(item => item.questionTypeName ==="单选题").length
      },
      multipleTotal() {
        return this.checkedList.filter(item => item.questionTypeName ==="多选题").length
      },
      ...mapState({
        questionByPageResp:({exam}) => exam.questionByPageResp,
        pagess:({exam}) => exam.pagess,
        courseadminList: ({course}) => course.courseadminList,
      })
    },
    components:{Knowledge},
    created () {
      let self = this
        this.refreshPage();
    },
     beforeMount() {
        this.getCourse({"currentPage":1,"pageSize":3,"blurName":"","sort":"","sortType":"","courseType":1,"categoryCode":"","courseAdmin":"","kind":1
        }).then(res=>{
            console.log(res);
        })
    },
    watch: {
      // 监听题型
      'param.questionTypeId': {
  　　　　handler(newValue, oldValue){
  　　　　 this.param.currentPage = 1
          this.refreshPage();
  　　　　}
　　   },
     // 监听难易程度
      'param.difficultyLevel': {
  　　　　handler(newValue, oldValue){
  　　　　 this.param.currentPage = 1
          this.refreshPage()
  　　　　}
　　   },
     // 监听创建人
       'param.adminAccount': {
  　　　　handler(newValue, oldValue){
  　　　　　　console.log(newValue)
          this.param.currentPage = 1
          this.refreshPage();
  　　　　}
　　   }
    },
    methods:{
      refreshPage(){
          this.getQuestionByPage(this.param).then( res => {
              this.isLoading = false
          })
      },
      // 传递所属知识点
      konwledgePointId(v) {
        this.param.questionPointId = v
        this.param.currentPage = 1
        this.refreshPage();
      },
      handleSelectionChange (selection) {
        this.checkedList = selection
          console.log(this.checkedList)
      },
      viewDetail (id) {
        let self = this
        self.getQustionsDetailFromBank({questionIds:id}).then(res => {
          if(res.code === 0){
          	self.showDetail = true
          	self.titleDetail = {...res.data[0]}
          }
        })
      },
      handleCurrentChange (val) {
          this.param.currentPage= val
          this.refreshPage();
      },
      searchTitle () {
          this.param.currentPage = 1
          this.refreshPage();
      },
      handleChecked () {
        let self = this
        if(self.checkedList.length === 0){self.$message.warning("请选择题目信息");return}
        self.getQustionsDetailFromBank({questionIds:self.checkedList.map(item => item.questionId).join(",")}).then(res => {
          if(res.code === 0){
          	let str = JSON.stringify(res.data).replace(/questionTypeId/g,"typeId").replace(/questionPointName/g,"pointName").replace(/difficultyLevel/g,"questionDifficultyLevel").replace(/questionOptionInfoList/g,"questionOptionRequestList");
            self.$emit('checked',str)
          }
        })
      },
      //增加的
      courseTypePersonChange(v){
        this.courseAdmin = v
        console.log(v ,'创建人')
    },
      ...mapActions(["getQuestionByPage","getQustionsDetailFromBank", "getCourse"])
    }
  }
</script>

<style lang="less">
  .dialog-head {
    padding-bottom:10px;
    margin-top:-30px;
    .el-input {
      width:200px;
    }
  }
  .titleChoose {
    padding-bottom:10px;
    .author {
      width:160px;
  }
  }
  #showDetail{
    #showDetailTitle{
      line-height: 3!important;
    }
  }
  .chooseTitle{
      border-top:1px solid #EBEEF5;
      padding-top: 20px !important;
      margin-top: 5px;
      .titleDetailSpan{
          display:inline-block;
          width:85%;
          word-wrap:break-word;
          vertical-align:top;
          margin-left:10px;
          margin-bottom: 10px;
      }

      .detailBox .mb10 .el-checkbox__label, .detailBox .mb10 .el-radio__label{
          display:inline-block;
          width: 370px;
          vertical-align: text-top;
          margin-left: 5px;
          word-wrap:break-word !important;
          line-height: 20px;
          white-space: initial !important;
      }
      .detailBox .el-dialog--small{
          width: 55% !important;
      }
  }
  .el-dialog--small{
      width: 993px !important;
  }

  .chooseTitle   .el-radio-button--small  .el-radio-button__inner{
      width: 80px !important;
      height: 36px;
      line-height: 22px;
      border-radius: 3px;
      margin-right: 17px;
      border-left: 1px solid #bfcbd9;
  }
  .chooseTitle .mb0{
      margin-bottom: 8px;
  }
  .chooseTitle  .el-form-item__label{
      line-height: 22px;
  }

</style>
