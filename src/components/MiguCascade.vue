<template>
	<div>
		<el-form :inline="true">
		  <el-form-item :label="item" v-for="(item,key) in label" style="margin:0px;">
		    <el-select v-model="checked[key]" :placeholder="placeholder[key]" style="width:80%">
			    <el-option v-for="(option,idx) in stage['level'+(key+1)]" :key="idx"
			      :label="option[labelProp]" :value="option[labelProp]">
			    </el-option>
			</el-select>
			<span v-if="showAdd" id="knowEdit" @click="addOption(key+1)"></span>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
  export default {
    name:"miguCascade",
    props:{
      source:{
        type:Array,
        default:() => ([])
      },
	  label:{
	    type:Array,
	    default:() => (["一级","二级","三级"])
	  },
	  placeholder:{
	    type:Array,
	    default:() => (["请选择","请选择","请选择"])
	  },
	  labelProp:{
	    type:String,
	    default:"label"
	  },
	  valueProp:{
	    type:String,
	    default:"value"
	  },
	  levelProp:{
	    type:String,
	    default:"level"
	  },
	  paretIdProp:{
	    type:String,
	    default:"parentId"
	  },
	  showAdd:{
	    type:Boolean,
	    default:false
	  },
	  defaultChecked:{
	    type:Array,
	    default:() => (["","",""])
	  }
    },
    data () {
    	return {
    	  checked:this.defaultChecked
    	}
    },
    computed:{
    	stage () {
    	  let self = this
    	  return {
    	    level1:self.source.filter(item => item[self.levelProp] === 1),
    	    level2:self.source.filter(item => item[self.levelProp] === 2 && item[self.paretIdProp] === self.checked[0]),
    	    level3:self.source.filter(item => item[self.levelProp] === 3 && item[self.paretIdProp] === self.checked[1])
    	  }
    	}
    },
    methods:{
      addOption (key) {
      	this.$emit('add',key,this.checked)
      }
    }
  }
</script>

<style scoped lang="less">
  .el-select {
    width:90%
  }
  #knowEdit{
  	// color:#ffffff;
    width:16px;
  	height:16px;
  	background: url(../layouts/images/knowEdit.png) no-repeat right center;
  	background-size:100% 100%;
  	display:inline-block;
  	// margin-top:5px;
  	position:relative;
  	top:6px;
  }
</style>