<template>
    <div>
  	  <el-form class="pl50">
  		<el-form-item v-for="(item,key,index) in newOption" :key="index">
  		    <el-input v-model.trim="item.label" maxlength="255" placeholder="知识点" class="el-input-inline"></el-input>
  		    <span v-if="newOption.length>1" class="el-icon-close color-danger" @click="removeOpt(key)"></span>
  		    <span v-if="key===(newOption.length-1)" class="el-icon-plus color-blue" @click="addNewOption"></span>
  		</el-form-item>
  	  </el-form>
  	  <div slot="footer" class="dialog-footer align-center">
  	    <el-button :disabled="relOpt ===''" type="primary" @click="handleOk" style="width: 100px">确 定</el-button>
  	  </div>
    </div>
</template>

<script>
  export default {
    name:"addOption",
    data () {
      return {
        newOption:[{label:""}]
      }
    },
    computed:{
      relOpt () {
    	  return this.newOption.map(item => item.label).filter(item => item !== "").join(",")
      }
    },
    methods:{
      addNewOption () {
        this.newOption.push({label:""})
      },
      removeOpt (key) {
        this.newOption.splice(key,1)
      },
      handleOk () {
        this.$emit('ok',this.relOpt)
      }
    }
  }
</script>

<style scoped lang="less">
  .el-input-inline {
    width:85%;
    display:inline-block;
  }
  .pl50 {
    margin-bottom: 18px;
  }
</style>
