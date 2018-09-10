<template>
	<div style="background:#f4f4f4;">
		<div class="crumb">hello 我是 试题库  (此处要用面包屑)</div>

		<div>
			题型：单选题 ，多选题
		</div>
		<div class="content">
			<el-form ref="form" :model="form" label-width="80px" class="exam-form">
				<div style="height:40px;">
					  <el-form-item label="单选题" class="question">
					    <el-input v-model="form.name" placeholder="请输入题目"></el-input>
					  </el-form-item>
					  <el-form-item label="分值" class="score">
					    <el-input v-model="form.score" placeholder="5"></el-input>
					  </el-form-item>
				  </div>
				  <div class="options" style="">
				    <el-form-item label="A" class="option" style="float:left;diaplay:inline-block;">
				      <el-input v-model="form.option1" placeholder="选项一"></el-input>
				    </el-form-item>
				    <span class="error" style="">×</span>
			    	<el-form-item label="" style="margin-top:20px;">
					    <el-checkbox-group v-model="form.type">
					      <el-checkbox label="设为答案" name="type"></el-checkbox>
					    </el-checkbox-group>
					  </el-form-item>
				  </div>
				  <div class="options" style="">
					    <el-form-item label="B" class="option" style="float:left;diaplay:inline-block;">
					      <el-input v-model="form.option1" placeholder="选项二"></el-input>
					    </el-form-item>
					    <span class="error" style="">×</span>
				    	<el-form-item label="" style="margin-top:20px;">
						    <el-checkbox-group v-model="form.type">
						      <el-checkbox label="设为答案" name="type"></el-checkbox>
						    </el-checkbox-group>
						  </el-form-item>
					</div>
				  
				  
				  <el-form-item label="" class="add-option">
				    <el-input v-model="form.option3" placeholder="+ 添加选项" disabled></el-input>
				  </el-form-item>
				  <div>
					    <label for="">课程分类：</label>
	        			<el-select v-model="courseType" placeholder="请选择" class="Knowledge-points">
	                        <el-option
	                          v-for="item in COURSE_TYPE"
	                          :label="item.label"
	                          :value="item.value">
	                        </el-option>
	                    </el-select>
	        			<el-select v-model="courseType2" placeholder="请选择" class="Knowledge-points">
	                        <el-option
	                          v-for="item in COURSE_TYPE2"
	                          :label="item.label"
	                          :value="item.value">
	                        </el-option>
	                    </el-select>
	                    <el-select v-model="courseType2" placeholder="请选择" class="Knowledge-points">
	                        <el-option
	                          v-for="item in COURSE_TYPE2"
	                          :label="item.label"
	                          :value="item.value">
	                        </el-option>
	                    </el-select>
				  </div>

				  <el-form-item label="难易程度:">
				    <el-radio-group v-model="form.resource" class="difficult">
				      <el-radio label="易"></el-radio>
				      <el-radio label="中"></el-radio>
				      <el-radio label="难"></el-radio>
				    </el-radio-group>
				  </el-form-item>
				  
				  <el-form-item style="width:100%;text-align:center;">
				    <el-button type="primary" @click="onSubmit" class="btn">保存</el-button>
				    <el-button class="reset">取消</el-button>
				  </el-form-item>
				</el-form>
		</div>
	</div>
</template>

<script>
	import {mapActions, mapState} from 'vuex';
	import * as C from '../constants/api';
	import * as CONST from "../constants/const";
	import utils from  '../utils/misc';
	//import pageHeader from '../components/pageHeader';
	import Tab from  '../components/Tab';

	export default {
		name: 'examLibrary',

		

		components: {
		    //pageHeader
		},

		data(){
			return {
				form: {
		          name: '',
		          region: '',
		          date1: '',
		          date2: '',
		          delivery: false,
		          type: [],
		          resource: '',
		          desc: ''
		        },
		        courseType:1,
				courseType2:1,
				COURSE_TYPE: CONST.COURSE_TYPE,
				COURSE_TYPE2: CONST.COURSE_TYPE2,
				
            }
		},

		watch: {
			
		},

		beforeMount() {
			this.addQuestion(this.addQuestionParam);
        },
        created () {
        	
        },
        mounted() {
        	
            
        },

		computed:{

			

			addQuestionParam() {
				return {
					questionTypeId:'1',
					questionDesc:'多选题3()',
					questionScore:'10',
					questionPointId:'1018',
					questionPointName:'后端开发/python/python知识点1',
					difficultyLevel:'3',
					questionAnswer:'1.3',
					authorAccount:'admin2',
					examQuestionOptionInfoReqList:[
						{
							optionDesc:'选项1',
							optionSort:'1',
							optionInRight:'1',
						}
					],

					

				};
			},
           

            ...mapState({
                AppType: ({root}) => root.AppType,
                caliberId: ({root}) => root.caliberId,
                general: ({dataOverview}) => dataOverview.general,
                
            }),
        },
		
		methods: {
			onSubmit(){

			},
     

			


			...mapActions(["showPageLoading", "hidePageLoading","addQuestion",]),
            //"getDownTable",
		},
	};
</script>


<style lang='less' scoped='scoped'>

.el-form-item__label{
	color:#333333!important;
}
.exam-form{
	.el-form-item{
		margin-bottom:16px!important;
	}
}




    
</style>