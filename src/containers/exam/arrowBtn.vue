<template>
  <div class="arrow-btn">
    <el-button class="my-btn">
          {{ btnPram.name }}
          <i class="el-icon-caret-top" :class="isTop ? 'top-menu' : ''" @click="clickBtn('top')"></i>
          <i class="el-icon-caret-bottom" :class="isButton ? 'bottom-menu' : ''" @click="clickBtn('bottom')"></i>
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    btnPram: {
      type: Object,
    }
  },
  data() {
    return {
      isTop: false,
      isButton: false,
    }
  },
  watch: {
    btnPram(newVal, oldVal) {
        if(newVal.clear !== this.btnPram.name) {
          this.isTop = this.isButton = false
        }
    }
    // 'clickBtnParam': {
    //   handler(newVal, oldVal) {
    //     debugger
    //     if(newVal !== this.clickBtnParam.name) {
    //       this.isTop = this.isButton = false
    //     }
    //   }
    // }
  },
  mounted() {

  },
  methods: {
    clickBtn(val) {
      if(val === 'top') {
        this.isTop = true
        this.isButton = false
        this.$emit("setArrowBtnParam", this.btnPram.id, 1, this.btnPram.name)
      } else {
        this.isTop = false
        this.isButton = true
        this.$emit("setArrowBtnParam", this.btnPram.id, -1, this.btnPram.name)
      }
    }
  }
}
</script>

<style lang="less">
  .arrow-btn {
    .my-btn {
      width: 130px;
      height: 36px;
      background-color: #fff !important;
      text-align: left;
      font-size: 14px;
      margin-right: 10px;
      .top-menu, .bottom-menu {
        color: #489EFB !important;
      }
      .el-icon-caret-top, .el-icon-caret-bottom {
        &:hover {
          color: #489EFB;
        }
        position: absolute;
        right: 11px;
        color: #C0C4CC;
        font-size: 12px;
        -webkit-transform: scale(0.8);
      }
       .el-icon-caret-top {
          top: 8px;
       }
       .el-icon-caret-bottom {
          bottom: 4px;
       }
    }
  }
</style>

