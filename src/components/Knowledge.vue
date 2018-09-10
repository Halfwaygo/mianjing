<template>
	<div class="cascade">
		<el-row>
		  <el-col :span="8">
		  	<span>一级：</span>
		  	<el-select placeholder="选择知识点" v-model="level.level_one">
			    <el-option v-for="item in source.level_one" :key="item.pointId"
			      :label="item.pointName" :value="item.pointId">
			    </el-option>
			  </el-select>
			  <span v-if="showAdd" class="el-icon-plus color-blue" @click="addOpt(1)"></span>
		  </el-col>
		  <el-col :span="8" > <!--v-show="source.level_two.length !== 0"-->
					<span>二级：</span>
					<el-select placeholder="选择知识点" v-model="level.level_two">
						<el-option v-for="item in source.level_two" :key="item.pointId"
							:label="item.pointName" :value="item.pointId">
						</el-option>
					</el-select>
				<span v-if="showAdd && level.level_one !== '' &&  level.level_one !== '0' && level.level_one !== '-1'" class="el-icon-plus color-blue" @click="addOpt(2)"></span>
			  <!--typeof(level.level_two) !== 'undefined' &&-->
		  </el-col>
		  <el-col :span="8"><!-- v-show="source.level_three.length !==0"-->
		  	<span>三级：</span>
		  	<el-select placeholder="选择知识点" v-model="level.level_three">
			    <el-option v-for="item in source.level_three" :key="item.pointId"
			      :label="item.pointName" :value="item.pointId">
			    </el-option>
			  </el-select>
			  <span v-if="showAdd && level.level_two !== '' && typeof(level.level_two) !== 'undefined'"
				   class="el-icon-plus color-blue"
					 @click="addOpt(3)">
				</span>
		  </el-col>
		</el-row>

		<el-dialog :visible.sync="showAddOpt" v-if="showAddOpt" width="50%" :title="title">
	  		<add-option @ok="okFn"></add-option>
	  </el-dialog>

	</div>
</template>

<script>
  import {mapActions, mapState} from "vuex"
  import AddOption from '../components/AddOption'
import { SET_COLOR } from '../constants/const';
  export default {
    name:"knowledge",
    props:{
      showAdd:{
        type:Boolean,
        default:false
			},
			zswatch: {
				type:Boolean,
        default:false
			},
			getlevels: {
				type: Object,
			  default: () => ({
					level_one: "",
          level_two: "",
          level_three: ""
				})
			},
      isShowAll:{
            type:Boolean,
			      default:false
	   	}
    },
    data () {
      return {
        level:{
          level_one: "-1",
          level_two: "",
          level_three: ""
				},
				level_two: "",
				// levelName: {
				//     level_one: '',
				// 		level_two: '',
				// 		level_three: ''
				// },
        source:{
          level_one:[],
          level_two:[],
          level_three:[]
        },
        stage:1,
        addLevel:"",
				showAddOpt:false,
				// pointId: 0
				pointId: 0,
				firstMount: false,
				firstWatch: false,
      }
    },
    components:{AddOption},
    created () {
			this.getPointInfo(0)
			let self = this
			setTimeout(() => {
				self.firstWatch = true
			}, 2000)
		},
		watch: {
			zswatch(newVal, oldVal) {
        this.firstWatch = newVal
			},
			'getlevels': {
        handler(newVal, oldVal){
					// if(this.firstWatch) {
						// console.log();

						let self = this
						self.level.level_one = newVal.level_one
						setTimeout(() => {
							self.level.level_two = newVal.level_two
						},700)
						setTimeout(() => {
							self.level.level_three = newVal.level_three
						},1300)
						this.levelToVal()
					// } else {
					// 	this.firstWatch = true
					// }
				},
				deep: true
			},
			// 'getlevels.level_one': {
			// 		handler(){
			// 				this.pointId = newValue
			// 				this.getPointInfo(1)
			// 		},
			// 		deep: true
			// },
			// 'getlevels.level_two': {
			// 		handler(){
			// 				this.pointId = newValue
			// 				this.getPointInfo(2)
			// 		},
			// 		deep: true
			// },
			// 'getlevels.level_three': {
			// 		handler(){
			// 				this.pointId = newValue
			// 				this.getPointInfo(3)
			// 		},
			// 		deep: true
			// },
			'level.level_one': {
  　　　　handler(newValue, oldValue){

						 this.pointId = newValue
						 this.getPointInfo(1)
	　　　　},
	       deep: true
　　   },
       'level.level_two': {
  　　　　handler(newValue, oldValue){
	　　　　　　console.log(newValue)

						 this.pointId = newValue
						 this.getPointInfo(2)
  　　　　},
	       deep: true
　　   },
       'level.level_three': {
  　　　　handler(newValue, oldValue){

		     this.pointId = newValue
		     this.getPointInfo(3)
	// 　　　　　　console.log(newValue)
	// 					 this.pointId = newValue
	// 					 this.getPointInfo(3)
  　　　　},
	       deep: true
　　   }
		},
		mounted() {
			// this.level = this.getlevels
			this.levelToVal()

		},
    computed:{
      title () {
      	return this.addLevel === 1?"添加一级知识点":this.addLevel === 2?"添加二级知识点":"添加三级知识点"
      }
    },
    methods:{
			levelToVal() {
				let self = this
         if(this.getlevels.level_one !== ''){
				  this.firstMount = true
          this.level.level_one = this.getlevels.level_one
				}
				if(this.getlevels.level_two !== ''){
					this.firstMount = true
					setTimeout(() => {
            self.level.level_two = self.getlevels.level_two
					}, 500)

				}
				if(this.getlevels.level_three !== '') {
					this.firstMount = true
					setTimeout(() => {
            self.level.level_three = self.getlevels.level_three
					}, 1000)
				}
			},
      makeSure () {
				let name = this.getLevelName()

				console.log(name);
	  	  let pointObj = {
        	pointName: name,
        	pointId: this.pointId
				}
				if(pointObj.pointId === '') {
					return
				}
				console.log(pointObj)
				let pointList = []
				let levelsName = ['level_one', 'level_two', 'level_three']
				if(name !== '') {
					name.split('/').forEach((item, index) => {
							let parentId = 0
							if(index > 0) {
								parentId = this.level[levelsName[index-1]]
							}
							pointList.push({
								pointId: this.level[levelsName[index]],
								pointName: item,
								parentId,
								pointLevel: index + 1
							})
					})
					pointObj.questionPointInfoList = pointList
					if(this.firstWatch) {
					  this.$emit('surePoint', pointObj)
					}
					let self = this
					setTimeout(() => {
						self.firstWatch = true
					}, 2000)
				}
	  },
	  getLevelName() {
				let name = ''

				console.log(JSON.stringify(this.level));
				if(this.level.level_one) {
					this.source.level_one.forEach(item => {
						if (item.pointId === this.level.level_one) {
									name = item.pointName
						}
			  	})
					if(this.level.level_two) {
						this.source.level_two.forEach(itemTwo => {
							if (itemTwo.pointId === this.level.level_two) {
								name = name + '/' + itemTwo.pointName
							}
						})
						if (this.level.level_three) {
							this.source.level_three.forEach(itemThree => {
							if (itemThree.pointId === this.level.level_three) {
								name = name + '/' + itemThree.pointName
							}
							})
						}
					}
			}
			console.log(name)
			return name
	  },
      getPointInfo (level) {
				//
        let self = this
				self.stage = level
				if(self.pointId === '' || self.pointId === undefined) {
					return
				}
				// 传递所属知识点到父级查询相关题型
				this.$emit("konwledgePointId", self.pointId)
      	self.getPointList({pointId:self.pointId}).then(res => {
					if(level === 0){// 加载一级
					  // self.source.level_two = []
						self.source.level_one = res.data
						console.log(this.isShowAll)
						if(this.isShowAll){
								self.source.level_one.unshift({
										"parentId":"0",
										"pointId":"0",
										"pointLevel":"1",
										"pointName":"全部"
								})
							this.level.level_one = self.source.level_one[0].pointId
						}
				}else if(level === 1) { //加载二级

					  if(this.firstMount === false) {
					      self.level.level_two = ""
      		    	self.level.level_three = ""
					  }else if(this.getlevels.level_three === '') {
						  this.firstMount = false
					  }
					  self.source.level_two = []
					  self.source.level_three = []
						if(self.pointId !== "0"){
								self.source.level_two = res.data
						}
					}else if(level === 2){ //加载三级

						if(this.firstMount === false) {
							self.level.level_three = ""
						} else {
							this.firstMount = false
						}
						self.source.level_three = []
						 self.source.level_three = res.data
					}
           this.makeSure()
      	})
      },
      addOpt (level) {
      	this.addLevel = level
      	this.showAddOpt = true
      },
      okFn (val) {
        let self = this
        let parentPointId = self.addLevel === 1?0:self.addLevel === 2 ?self.level.level_one:self.level.level_two
      	self.addQuestionPoint({parentPointId:parentPointId,name:val}).then(res => {
	      	if(self.addLevel === 1){// 加载一级
	  		  self.source.level_one = self.source.level_one.concat(res.data)
	  		}else if(self.addLevel === 2) { //加载二级
	  		  self.source.level_two = self.source.level_two.concat(res.data)
	  		}else if(self.addLevel === 3){ //加载三级
	  		  self.source.level_three = self.source.level_three.concat(res.data)
	  		}
	  		self.showAddOpt = false
      	})
      },
   	  ...mapActions(["getPointList","addQuestionPoint"])
    }
  }
</script>

<style lang="less">
  .el-icon-plus {
		cursor: pointer;
	}
</style>
