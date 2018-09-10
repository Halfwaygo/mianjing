<template>
  <div class="title-item-style">

			 <div class="page-title" v-if="urlRoute !== '/operationAnalysis/newExamLibrary'">
        <div class="add-question">
          <div class="add-info-question">
            <img src="../../layouts/images/knowEdit.png">
            <span class="title">添加题目</span>
          </div>
          <el-row class="sel-question">
            <el-button type="" class="checked-sty" @click="addTitle(1)">
              <i class="el-icon-plus" style="color: #409eff;margin-right: 5px;"></i>
              <span class="radio-wz">单选题</span>
            </el-button>
            <el-button type="" class="checked-sty" @click="addTitle(2)">
              <i class="el-icon-plus" style="color: #409eff;"></i>
              <span class="checked-wz">多选题</span>
            </el-button>
          </el-row>
        </div>
			</div>

		<el-card class="question-list">
		<h3 class="question-list-title">Q{{ idx+1 }}</h3>
		<div class="fix-question">
						<!-- <el-button @click="editTitle"
						    v-if="!canEidt"
								type="handle edit"
								size="small"
								title="编辑">
						</el-button> -->
						<img title="编辑" v-if="!canEidt" @click="editTitle" src="../../layouts/images/edit.png" class="img-class" style="width: 22px;">
						<img title="保存" v-if="canEidt" @click="canEidt = !canEidt" src="../../layouts/images/save-blue.png" class="img-class">
			    <span>
						<!-- <el-button @click="deleteTitle"
												type="handle delete"
												size="small"
												title="删除">
						</el-button> -->
						<img  v-if="idx !== 0" disabled="true" title="删除"  @click="deleteTitle" src="../../layouts/images/del.png" class="img-class">
					</span>
					<!-- <span>
						<img title="下移" @click="moveQue(1, idx)" src="../../layouts/images/1bottom.png" alt="下移" style="margin-left: 5px;cursor: pointer;">
					</span>
					<span>
						<img title="上移" @click="moveQue(2, idx)" src="../../layouts/images/1top.png" alt="上移" style="margin-left: 5px;cursor: pointer;">
					</span> -->
			</div>

		<template v-if="canEidt">
			<!-- 编辑状态 -->
			<el-row>
				<el-col :span="2" v-if="titleItem.typeId === 1 || titleItem.typeId === '1'" class="align-right mr10">单选题：</el-col>
				<el-col :span="2" v-if="titleItem.typeId === 2 || titleItem.typeId === '2'" class="align-right mr10">多选题：</el-col>
				<el-col :span="5">
					<el-input v-model.trim="titleItem.questionDesc" :maxlength="255" placeholder="请输入题目"></el-input>
				</el-col>
				<el-col :span="2" class="align-right">分值：</el-col>
				<el-col :span="5"> <el-input v-model="titleItem.questionScore"  type="number" @blur="testScore"></el-input></el-col>
			</el-row>
			<el-row v-for="(item,key) in titleItem.questionOptionRequestList" :key="key">
				<el-col :span="2" class="align-right mr10">{{wordList[key]}}</el-col>
				<el-col :span="5"><el-input v-model="item.optionDesc" :placeholder="'选项'+(key+1)"></el-input></el-col>
				<el-col :span="5" class="clearfix">
						<span class="titleItemError fl ml10 fs32 " @click="removeOpt(key)">×</span>
						<el-radio v-if="titleItem.typeId ==1 " v-model="answerSingle" :label="item.optionSort" class="ml35">设为答案</el-radio>
						<template v-else>
							<el-checkbox v-if="answerList.indexOf(String(item.optionSort))>-1" @change='handleChange' checked :label="item.optionSort" class="ml35">设为答案</el-checkbox>
							<el-checkbox v-else @change='handleChange' :label="item.optionSort" class="ml35">设为答案</el-checkbox>
						</template>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="2" class="mr10">&nbsp;</el-col>
				<el-col :span="5">
					<!-- <el-button size="small" type="info" @click="addOpt">添加选项</el-button> -->
				  <div @click="addOpt" class="add-select">
						<i class="el-icon-plus"></i>
						添加选项
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="2" class="align-right">所属知识点：</el-col>
				<el-col :span="20">
					<knowledge :showAdd="true" @surePoint="surePoint" :getlevels="getLevels"></knowledge>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="2" class="align-right mr10">难易程度：</el-col>
				<el-col :span="12">
					<el-radio-group v-model="titleItem.questionDifficultyLevel">
						<el-radio :label="1">易</el-radio>
						<el-radio :label="2">中</el-radio>
						<el-radio :label="3">难</el-radio>
				</el-radio-group>
				</el-col>
			</el-row>
		</template>
		<!-- 导入的题库 -->
		<template v-else>
			<el-row class="que-bank">
				  <!-- 编辑或删除 -->

					<el-col :span="1" class="fl">
						<span  @click="editTitle"></span><br/>
						<span @click="deleteTitle"></span>
					</el-col>
					<el-col :span="20" class="fl">
						<el-row>
							<el-col :span="22">
								{{titleItem.typeId == 1?"【单选题】":"【多选题】"}}

								<span>{{titleItem.questionDesc}}</span>
							</el-col>
							<el-col :span="2" style="text-align: right">分值：{{titleItem.questionScore}}</el-col>
						</el-row>
						<el-row v-for="(item,key) in titleItem.questionOptionRequestList" :key="key">
							<el-col :span="10" class="clearfix">
								<!-- 单选 -->
								<div v-if="titleItem.typeId ==1 ">
									<el-radio  style="position: absolute;" v-model="answerSingle" :label="item.optionSort" disabled class="ml35">
										{{ wordList[key] }}
									</el-radio>
									<div class="sel-question2">{{item.optionDesc}}</div>
								</div>
								<!-- 多选 -->
								<template v-else>
									<el-checkbox  v-show="answerList.indexOf(String(item.optionSort)) !== -1" @change='handleChange' disabled checked :label="''" class="ml35">{{ '' }}</el-checkbox>
									<el-checkbox v-show="answerList.indexOf(String(item.optionSort)) === -1" @change='handleChange' :label="''" class="ml35" disabled>{{ '' }}</el-checkbox>
									<span>{{wordList[key]}}.</span>
									<span>{{item.optionDesc}}</span>
								</template>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</template>
		</el-card>
	</div>
</template>

<script>
   import {mapActions, mapState} from "vuex"
   import Knowledge from '../../components/Knowledge'
  export default {
    name:"titleItem",
    props:{
      source:{
        type:Object,
        default:() => ({})
      },
      idx:{
        type:Number,
        default:0
      }
    },

    data () {
      return {
				urlRoute: this.$route.path,
        titleItem: this.source,
        answerSingle:'', //单选项答案
        answerList: [], //多选答案
        canEidt:this.source.hasOwnProperty('canEidt'),
        wordList:["A","B","C","D","E","F","G","H","I","J","K",'L',"F","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
        checkedPoint:this.source.questionPointInfoList || [],
        //0614 新增的
        questionScore:'',
				onlyInt:/^[0-9]+$/,
				// 编辑时传参
				getLevels: {
					level_one: '',
					level_two: '',
					level_three: '',
				}
      }
    },
		components:{Knowledge},
		watch: {
    	answerSingle(newValue, old){
			// 将正确的答案写入数组
        this.titleItem.questionOptionRequestList.forEach(res => {
        		res.optionInRight = res.optionSort === newValue ? 1 : 0
		  	})
		 	  this.titleItem.questionAnswer = newValue
		 },
		 source: {
       handler(newVal, oldVal) {
				console.log(JSON.stringify(newVal));
				// console.log(JSON.stringify(oldVal));

				// 正确答案复制
				this.titleItem = JSON.parse(JSON.stringify(newVal));
				this.answerSingle =  newVal.questionAnswer*1
				if(newVal.typeId === '2') {
					this.answerList = newVal.questionAnswer.split(",")
					console.log(JSON.stringify(this.answerList));
				}
        if(newVal.questionPointInfoList === undefined) {
          return
				}
				newVal.questionPointInfoList.forEach((res, index) => {
					if(index === 0) {
            debugger
						this.getLevels.level_one = res.pointId
					} else if(index === 1) {
						this.getLevels.level_two = res.pointId
					} else {
						this.getLevels.level_three = res.pointId
					}
				})
			 },
			 deep: true
		 },
  	},
		mounted() {
			// 将正确答案赋值
			// this.titleItem = JSON.parse(JSON.stringify(this.source))
			this.answerSingle =  this.source.questionAnswer*1
			if(this.source.typeId === '2') {
				this.answerList = this.source.questionAnswer.split(",")
			  console.log(JSON.stringify(this.answerList));
			}

			if(JSON.stringify(this.source) !== '{}' && this.source.questionOptionRequestList[0].optionDesc !== ''){
				this.source.questionPointInfoList.forEach((res, index) => {
					if(index === 0) {
						this.getLevels.level_one = res.pointId
					} else if(index === 1) {
						this.getLevels.level_two = res.pointId
					} else {
						this.getLevels.level_three = res.pointId
					}
				})
			}
		},
    methods:{
				moveQue(type, idx) {
          this.$emit("setMoveQues", type, idx)
				},
			  addTitle(type) {
          this.$emit('setAddTitle',type, this.idx+1)
				},
				surePoint (item) {
					this.titleItem.pointId = item.pointId
					this.titleItem.pointName = item.pointName
				},
				removeOpt (key) {
					this.titleItem.questionOptionRequestList.splice(key,1)
				},
				addOpt () {
					let len = this.titleItem.questionOptionRequestList.length;
					if(len === this.wordList.length) {
							return
					}
					this.titleItem.questionOptionRequestList.push({
						optionDesc:"",
						optionSort:len+1,
						optionInRight:0
					})
				},
				deleteTitle () {
					this.$emit('delete',this.idx)
				},
				editTitle () {
					this.titleItem = this.source
          // debugger
					this.canEidt = true
				},
				testScore () {
					if(!this.onlyInt.test(this.titleItem.questionScore) || this.titleItem.questionScore === '0'){
						this.$message.warning("只能输入正整数");
            this.titleItem.questionScore = "";
					}
					if(this.titleItem.questionScore.length > 3){
							this.$message.warning("分值超过最大值");
							this.titleItem.questionScore = "";
					}
				},
				handleChange (eve) {
					let self = this
					if(eve.target.checked){
						self.answerList.push(eve.target.value)
					}else{
						self.answerList.splice(self.answerList.indexOf(eve.target.value),1)
					}
					this.titleItem.questionAnswer = this.answerList.join(',')
				}
			}
  }
</script>

<style scoped lang="less">
.title-item-style {
	.sel-question {
		width: 400px;
		word-wrap: break-word;
		display:inline-block;
		color:#bbb
	}
	.sel-question2 {
		width: 400px;
		word-wrap: break-word;
		display:inline-block;
		margin-left: 45px;
		color:#bbb
	}
	.page-title {
		clear: both;
		margin-bottom: 9px;
		.add-question {
			width: 120px;
			&:hover {
				width: 200px;
				.sel-question {
					display: inline-block;
				}
				.add-info-question {
					display: none;
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

	.add-select {
		cursor: pointer;
		width: 265px;
		height: 32px;
		color: #999999;
		background-color: #E6E7ED;
	  .el-icon-plus {
			margin-left: 15px;
		}
	}
	.fix-question {
		margin-top: 7px;
		width: 20px;
		z-index: 1;
    position: absolute;
    .el-button--handle.edit, .el-button--handle.delete {
			width: 28px;
			height: 28px;
			cursor: pointer;
		}
    .img-class {
			cursor: pointer;
			width:21px;
		}
	}
  .question-list {
    margin-bottom:20px;
  	.migu-content{
  		padding-top:0
  	}
    .el-row {
	    margin-bottom: 10px;
	    line-height: 32px;
	  }
  }
  .titleItemError{
    /*width:12px;
    height:12px;*/
    display:inline-block;
    color:#bbbbbb;
    position:relative;
    top:2px;
    cursor:pointer;
    font-size:20px;
	}
	.que-bank {
    .ml35 {
			margin-left: 0px;
		}
	}
}
</style>
