<template>
	<div class="exam-list">
		<el-form :inline="true" size="small">
		  <el-form-item>
		    <el-input class="w290" v-model="param.blurName" placeholder="输入关键字"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="getExam(2,-1)"><span class="el-icon-search"></span>搜索</el-button>
		  </el-form-item>
		  <el-form-item class="fr">
		  	<router-link to="createMethod">
		  		<el-button type="primary" style="width:102px;height:32px;text-align:center;line-height:32px;border-radius:50px;">创建考试</el-button>
		  	</router-link>
		  </el-form-item>
      <div class='mb20'>
          <arrow-btn :btnPram="{'name': '名称', 'id': 0, 'clear': clearName}" class="arrow-btn" @setArrowBtnParam="setArrowBtnParam"></arrow-btn>
          <arrow-btn :btnPram="{'name': '考试时间', 'id': 1, 'clear': clearName}" class="arrow-btn" @setArrowBtnParam="setArrowBtnParam"></arrow-btn>
          <arrow-btn :btnPram="{'name': '编辑时间', 'id': 2, 'clear': clearName}" class="arrow-btn" @setArrowBtnParam="setArrowBtnParam"></arrow-btn>
      </div>
    </el-form >
		<el-row class="clearfix" style="clear:both" :gutter="20">
		  <el-col :span="12" v-for="(item, index) in examList" :key="index"  :class="{'fl': index % 2 === 0,'fr':index % 2 === 1}">
		  	<el-card class="mb20" style="border:none;box-shadow:none;">
			  <div class="exam-card">
			    <h5  v-if="isDeleteDisable(item.examStart ,item.serviceTime)" class=" mb10" style="font-size:14px;color:#333333;float: left">{{item.examName}}
				</h5>
                <h5  v-else @click="testEdit(item.examId)" :disabled="isDeleteDisable(item.examStart ,item.serviceTime)" class=" mb10" style="font-size:14px;color:#333333;cursor: pointer; float: left">{{item.examName}}
				</h5>
				  <el-button type="primary" class="test-content-left-btn"
							 v-if="new Date(item.examStart).getTime() > new Date().getTime()">未开始
				  </el-button>
				  <el-button type="primary" class="test-content-left-btn"
							 v-if="new Date(item.examEnd).getTime() < new Date().getTime()">已结束
				  </el-button>
			    <div class="exam-card-body clearfix" style="color:#666666;">
			    	<div class="fr">
              			<el-button class="operateBtn"
                                   type="handle edit"
                                   size="small"
                                   :title="isDeleteDisable(item.examStart, item.serviceTime) ? '考试开始前1个小时就不能编辑了哦':'编辑'"
                                   @click="testEdit(item.examId)"
                                   :disabled="isDeleteDisable(item.examStart ,item.serviceTime)">
                        </el-button>
			    		<router-link :to="'statistic?id='+item.examId+'&examName='+item.examName">
                			<el-button class="operateBtn"
                                       type="handle count"
                                       size="small" title="统计"
									   :disabled="isCountDisable(item.examStart ,item.serviceTime)">
                            </el-button>
			    		</router-link>
              			<el-button class="operateBtn"
                                   type="handle delete"
                                   size="small"
                                   :title="isDeleteDisable(item.examStart, item.serviceTime) ? '考试开始前1个小时就不能删除了哦':'删除'"
                                   @click="delExam(item.examId)"
                                   :disabled="isDeleteDisable(item.examStart ,item.serviceTime)">
                        </el-button>
			    	</div>
			    	<div class="fl">
			    		<template v-if="item.examStatus === 0">
                            <p style="display:inline-block;">考试时间：{{filterTime (item.examStart,item.examEnd)}}</p> <p  style="display:none;" class="isStart">未开始</p><!-- colorDanger -->
							<lable v-if="new Date(item.examStart).getTime() < new Date().getTime()">
								<p >通过率：<span class="mr20">{{(item.passRate*100).toFixed(1)}}% </span>平均分：<span>{{item.avgScore}}</span></p>
							</lable>
			    		</template>
			    		<template v-else>
			    			<p>考试时间：{{ filterTime (item.examStart,item.examEnd)}}</p>
			    			<p>通过率：<span class="mr20">{{(item.passRate*100).toFixed(1)}}% </span>平均分：<span>{{item.avgScore}}</span></p>
			    		</template>
			    	</div>
			    </div>
			  </div>
			</el-card>
		  </el-col>
		</el-row>
		<div class="pagination-wrap" v-if="examList.length>0">
			<el-pagination @current-change="handleCurrentChange" :current-page="param.currentPage" :page-count="pages" layout=" prev, pager, next, jumper">
    		</el-pagination>
		</div>
	</div>
</template>

<script>
    import {mapActions, mapState} from "vuex"
    import * as C from '../../constants/api'
    import SystemMixin from '../../mixins/system'
    import arrowBtn from './arrowBtn'

    export default {
        name: "examList",
        mixins: [SystemMixin],
        components: {
            arrowBtn
        },
        data() {
            return {
                clearName:'',
                param: {
                    pageSize: 10,
                    currentPage: 1,
                    blurName: "",
                    sort: -1,
                    sortType: 2
                }
            }
        },
        computed: {
            ...mapState({
                'examList': ({exam}) => exam.examList,
                'pages': ({exam}) => exam.pages
            })
        },
        created() {
            this.getExamInfoExamCondition(this.param)
        },
        methods: {
            filterTime(time1,time2) {
                if(time1.substring(0,10) === time2.substring(0,10)){
                    return time1 + ' — '+ time2.substring(11,25);
                }else{
                    return time1 + ' — ' + time2
                }
            },
            setArrowBtnParam(val1, val2, name) {
              this.clearName = name
              this.getExam(val1, val2)
            },
            getExam(sortType, sort) {
                this.param.currentPage = 1
                this.param.sortType = sortType
                this.param.sort = sort
                this.getExamInfoExamCondition(this.param)
            },
            testEdit(id) {
                let self = this
                this.$router.push({path: '/exam/newExam', query: {type: 1, id: id}})
            },
            delExam(id) {
                this.$confirm('确定删除此考试吗？', '提示', {
                        confirmButtonText: '确定',
                        confirmButtonClass: 'confirm',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {
                    let self = this
                    this.deleteExam({type: 1, examId: id, account:sessionStorage.getItem('adminAccount')}).then(res => {
                        if (res.code === 0) {
                             this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.getExamInfoExamCondition(self.param)
                        }
                    })
                })
            },
            handleCurrentChange(val) {
                this.param.currentPage = val
                this.getExamInfoExamCondition(this.param)
            },
            ...mapActions(["getExamInfoExamCondition", "deleteExam", "validateChangeExamInfo"])
        }
    }
</script>

<style lang="less">
.el-col-11{
  width:49%;
}
.exam-list{
	.test-content-left-btn{
		color: #666666 !important;
		border-radius: 24px;
		height: 24px;
		background: #ededed !important;
		text-align: center !important;
		line-height: 24px !important;
		border: none;
		margin-left: 10px;
		font-size: 12px !important;
		float: left;
		font-weight: bold;
	}
	.test-content-left-btn:hover{
		color: #666666;
		background: #ededed;
	}
  margin-top: 73px;
  padding-left: 20px;
  padding-right: 20px;
	.fl{
		clear: both;
	}
	.fl p {
		font-size: 12px;
	}
  .arrow-btn {
      float: left;
      margin-bottom: 27px;
  }
  .el-card{
    border:none!important;
  }
  .createExam{
    width:102px!important;
    height:32px!important;
    border-radius: 50px!important;
    margin-right: 15px;
    display:inline-block;
  }
  .my-btn {
        position: relative;
        .arr-top {
            position: absolute;
            right: 0;
            top: 0;
        }
        .arr-bottom{
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }

    #buttonC {
    border:1px solid #e6e7ed;
    color:#333333;
    }
    .operateBtn{
    margin-right:12px;
    }
}

</style>
