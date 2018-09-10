<template>
	<div class="statistic-style">
		<!-- <h1 class="migu-content-title">考试名称：</h1> -->
		<div class="exam-title">考试名称：{{ this.$route.query.examName }}</div>
		<div class="migu-content-body">
			<el-tabs type="card" v-model="tabIndex">
			    <el-tab-pane label="总体统计" name="overall">
			    	<div class="el-tab-wrap">
			    		<div class="btn-set">
								<div class="static-top-block bg1">应参加人数: {{statisticInfo.preNum}}</div>
								<div class="static-top-block bg2">已考人数：{{statisticInfo.currNum}}/{{statisticInfo.preNum}}</div>
								<div class="static-top-block bg3">已通过人数：{{statisticInfo.passNum}}/{{statisticInfo.preNum}}</div>
								<div class="static-top-block bg4">通过率：{{(parseFloat(statisticInfo.passRate)*100).toFixed(1)}}%</div>
								<div class="static-top-block bg5">平均开始时长：{{statisticInfo.avgTime}}</div>
				    	</div>
				    	<div class="title-show-area">
				    		<div class="title-list clearfix" v-for="(item,key) in statisticInfo.qustionList" :key="key">
				    			<div class="title-detail">
				    				<!-- <div class="title-detail-title">{{item.sort}}.{{item.desc}}({{wordList[item.rightAnswer-1]}})。</div> -->
				    				<div class="title-detail-title">{{item.sort}}.{{item.desc}} ({{filterAnswer(item.rightAnswer)}})。</div>
				    				<ul>
											<li v-for="(subItem,subKey) in item.hisOptionRespList" :key="subKey" class="h-question">
												 {{wordList[subKey]}}
												 <el-checkbox disabled v-if="item.rightAnswer.indexOf(subItem.sort) > -1" checked class="checked-style"></el-checkbox>
												 <el-checkbox disabled v-else class="checked-style"></el-checkbox>
												 <span>{{subItem.optionDesc}}</span>
											</li>
										</ul>
				    			</div>
				    			<div class="title-detail-result">
				    				<div class="title-detail-title">正确率：{{(parseFloat(item.rightRate)*100).toFixed(1)}}%</div>
				    				<ul>
				    					<li class="h-question" v-for="(subItem,subKey) in item.hisOptionRespList" :key="subKey">
				    						<el-progress :percentage="subItem.choseNumber" :stroke-width="12" :show-text="false"></el-progress>
				    						{{subItem.choseNumber}}人
				    					</li>
				    				</ul>
				    			</div>
				    		</div>
				    	</div>
			    	</div>
			    </el-tab-pane>
			    <el-tab-pane label="人员详情" name="personnel">
			    	<div class="el-tab-wrap">
			    		<div class="btn-set">
				    		<!-- <el-button type="primary">应参加人数：{{statisticInfo.preNum}}</el-button>
				    		<el-button class="btn-light-blue">已考人数：{{statisticInfo.currNum}}/{{statisticInfo.preNum}}</el-button>
				    		<el-button type="warning">已通过人数：{{statisticInfo.passNum}}/{{statisticInfo.preNum}}</el-button>
				    		<el-button type="danger">通过率：{{statisticInfo.passRate}}</el-button>
				    		<el-button class="btn-purple">平均开始时长：{{statisticInfo.avgTime}}</el-button> -->
				    	  <div class="static-top-block bg1">应参加人数: {{statisticInfo.preNum}}</div>
								<div class="static-top-block bg2">已考人数：{{statisticInfo.currNum}}/{{statisticInfo.preNum}}</div>
								<div class="static-top-block bg3">已通过人数：{{statisticInfo.passNum}}/{{statisticInfo.preNum}}</div>
								<div class="static-top-block bg4">通过率：{{(parseFloat(statisticInfo.passRate)*100).toFixed(1)}}%</div>
								<div class="static-top-block bg5">平均开始时长：{{statisticInfo.avgTime}}</div>
							</div>
				    	<div class="title-show-area">
				    		<el-table  @filter-change="handleFilterChange" :data="personInfo" style="width: 100%" @sort-change="sortChange">
							    <el-table-column prop="name" label="姓名"></el-table-column>
							    <el-table-column prop="nickname" label="花名"></el-table-column>
							    <!-- <el-table-column prop="depart" label="部门" :filters="departList" :filter-method="filterDepart"></el-table-column> -->
									<el-table-column prop="depart" label="部门"></el-table-column>
							    <!-- <el-table-column label="是否通过" :filters="passArr" prop="isPass"  :filter-method="filterPass" :formatter="formatter"></el-table-column> -->
							    <el-table-column label="是否通过" column-key="status" :filters="passArr" :filter-multiple="false" prop="isPass" :formatter="formatter"></el-table-column>

									<el-table-column prop="score" label="分数" sortable="custom"></el-table-column>
							    <el-table-column prop="sort" label="名次" sortable="custom"></el-table-column>
							    <el-table-column prop="useTime" label="考试用时" sortable="custom">
							    </el-table-column>
							</el-table>
							<div class="pagination-wrap" v-if="personInfo.length>0">
								<el-pagination @current-change="handleCurrentChange" :current-page="param.currentPage" :page-count="pages"
								layout="prev, pager, next, jumper">
					    		</el-pagination>
							</div>
				    	</div>
			    	</div>
			    </el-tab-pane>
			</el-tabs>
		</div>

	</div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import * as C from '../../constants/api'
  export default {
    name:"statistic",
    data () {
      return {
        tabIndex:"overall",
        examId:this.$route.query.id,
        passArr:[{'text':"是",value:1},{'text':"否",value:0}],
        param:{
          examId:this.$route.query.id,
          pageSize:10,
          currentPage:1,
          isPass:"",
          depart:"",
          sort:-1,
					sortType:2,
					operationAdmin: sessionStorage.getItem('adminAccount')
        },
        rightAnswer:1,
        wordList:["A","B","C","D","E","F","G","H","I","J","K","L","F","N"],
      }
    },
    beforeMount() {
     // console.log(this,'-------------')
    },
    computed: {
      titleTotalNum () {
        this.statisticInfo.qustionList.map(item => {
          let num = 0
          item.hisOptionRespList.forEach(subItem => {
            num += subItem.choseNumber
          })
          return num
        })
      },
      departList () {
        return this.personInfo.map((item,index) => {
          return {
            "text":item.depart,
            "value":item.depart
          }
        })
      },
      ...mapState({
        'statisticInfo':({exam}) => exam.statisticInfo,
        'pages':({exam}) => exam.pages,
        'personInfo':({exam}) => exam.personInfo
      })
    },
    created () {
			const loading = this.$loading({
				lock: true,
				text: '正在加载数据',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
      this.getExamTotalCountInfo({examId:this.examId}).then(() => {
        loading.close();
			})
      this.getExamPersonScoreCountInfo(this.param)
    },
    methods:{
			filterAnswer(answer) {
				let changeAnswer = answer.split(',').map(item => this.wordList[parseInt(item - 1)]);
				return changeAnswer.toLocaleString()
			},
    	percentage (item,arr) {
    		let count = 0
    		arr.map(item => {
    		  return count += item
    		})
    		return item/count*100
    	},
    	handleCurrentChange (val) {
    		this.param.currentPage = val

    	},
    	formatter (row,column) {
    		return row.isPass ? "是":"否"
    	},
    	filterDepart (value,row) {
    	  this.param.depart = value
    	  this.getExamPersonScoreCountInfo(this.param)
			},
			handleFilterChange(value) {
				console.log(JSON.stringify(value));
				if(value.status.length === 0) {
					this.param.isPass = ''
				} else {
          this.param.isPass = value.status[0]
				}
				this.getExamPersonScoreCountInfo(this.param)
			},
    	sortChange (column) {
    		this.param.sort = column.order === "ascending"?1:-1
    		this.param.sortType = column.prop === "score"?0:column.prop === "sort"?1:2
    		this.getExamPersonScoreCountInfo(this.param)
    	},
    	...mapActions(["getExamTotalCountInfo","getExamPersonScoreCountInfo"])
    }
  }
</script>

<style scoped lang="less">

  .statistic-style {
	  .clearfix ul li span{
		  display: inline-block;
		  width: 85%;
		  word-wrap: break-word;
		  vertical-align: top;
		  margin-left: 10px;
		  margin-bottom: 10px;
	  }
		padding-left: 20px;
		margin-top: 70px;
		.el-tabs__header {
			    border-bottom: 1px solid #DCDFE6;
		}
		.btn-set {
			padding-left: 20px;
			height: 36px;
			.el-tabs__header {
			  margin: 0px 0 20px;
			}
			.static-top-block {
				display: inline-block;
				margin-right: 20px;
				width: 140px;
				text-align: center;
				color: #fff;
				border-radius:3px;
				height: 36px;
				line-height: 38px;
			}
			.bg1 {
        background-color: #489EFB;
			}
			.bg2 {
        background-color: #48CACB;
			}
			.bg3 {
        background-color: #F6CC58;
			}
			.bg4 {
        background-color: #FF9587;
			}
			.bg5 {
        background-color: #D99DF6;
			}
		}
    .exam-title {
			color: #333;
			margin-bottom: 15px;
			font-size: 16px;
		}
		.migu-content-body {
			background-color: #fff;
		}
		.title-show-area {
			.title-list {
				padding-top: 18px;
			}
			.title-detail-title {
				color: #333333;
				margin-bottom: 20px;
				font-size: 14px;
				width: 100%;
				word-wrap: break-word;

			}
			// 答案横距
			.h-question {
				margin-bottom: 14px;
				.checked-style {
					margin-left: 3px;
					margin-right: 2px;
				}
			}
		}
		.title-detail-result {
			margin-left: 40px;
			.title-detail-result-title {
				color: #666;
			}
		}
	}
  .el-tab-wrap {
    padding-left:20px;
    .btn-set {
      margin-bottom:20px;
      .el-button {
				padding:0 10px;
				width:auto;
				margin-right:20px;
			}
    }
  }
</style>
