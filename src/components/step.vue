<template>
  <div class="step-h">
    <el-row>
      <el-col :span="12">
        <div class="step-t first-step">
          <div class="circle circle-first">1</div>
          <div class="intro">第一步</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div v-if="stepNum === 1" class="step-t second-step" style="background-color: #DADCDF">
          <div class="circle circle-second">2</div>
          <div class="intro">第二步</div>
        </div>
        <div v-else class="step-t second-step-se">
          <div class="circle circle-second-se">2</div>
          <div class="intro">第二步</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'step',
  props:{
    stepNum: {
      type:Number,
      default: 1
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="less">
  .step-h {
    // height: 108px;
    // padding-top: 54px;
    .step-t {
      position: relative;
      height: 14px;
    }
    .first-step {
      border-top-left-radius: 14px;
      border-bottom-left-radius: 14px;
      background-color: #489EFB;
    }
    .second-step, .second-step-se  {
      border-top-right-radius: 14px;
      border-bottom-right-radius: 14px;
    }
    .second-step-se {
      background-color: #489EFB;
    }
    .intro {
      position: absolute;
      left: 49.3%;
      top: 26px;
      color: #999999;
    }
    .circle {
      text-align: center;
      width: 32px;
      position: absolute;
      height: 32px;
      line-height: 32px;
      left: 50%;
      border-radius: 32px;
      color: #fff;
      top: -9px;
    }
    .circle-first, .circle-second-se {
      background-color: #489EFB;
    }
    .circle-second {
      background-color: #DADCDF;
    }
  }
</style>

