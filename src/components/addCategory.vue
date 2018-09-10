<template>
    <div class="add-category">
  	  <el-form class="pl50">
  		<el-form-item v-for="(item,key,index) in newOption" :key="index">
  		    <el-input v-model.trim="item.label" placeholder="单行文本" :maxlength="20" class="el-input-inline"></el-input>
  		    <span v-if="newOption.length>1" class="el-icon-close color-danger" @click="removeOpt(key)"></span>
  		    <!-- <span v-if="key===(newOption.length-1)" class="el-icon-plus color-blue" @click="addNewOption"></span> -->
  		</el-form-item>
  	  </el-form>
  	  <div slot="footer" class="dialog-footer align-center">
  	    <el-button :disabled="relOpt ===''" type="primary" @click="handleOk">确 定</el-button>
  	  </div>
    </div>
</template>

<script>
  export default {
    name:"addOption",
    props: {
      typeId: {
        type: String,
        default: '1'
      }
    },
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
    mounted() {
      console.log(this.typeId);
    },
    methods:{
      addNewOption () {
        this.newOption.push({label:""})
      },
      removeOpt (key) {
        this.newOption.splice(key,1)
      },
      handleOk () {
        this.$emit('goAddCategory',this.relOpt, this.typeId)
      },
      // 清空文本
      clearText() {
        this.newOption = []
        this.$set(this.newOption, 0 , {label:""})
      }
    }
  }
</script>

<style scoped lang="less">
  .add-category {

  }
  .el-input-inline {
    width:50%;
    display:inline-block;
  }
</style>
