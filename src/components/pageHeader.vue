<template>
    <div class="page-header">
        <el-menu class="page-header-top" :default-active="activeIndex" theme="dark"  mode="horizontal" v-bind:router="true" @select="selectMenu" unique-opened  @open="ajustNavSide">
            <el-menu-item index="1" >
                前端
            </el-menu-item>
            <el-menu-item index="2" >
                java
            </el-menu-item>
        </el-menu>
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';

    export default{
        name: 'pageHeader',
        data() {
          return {
              activeIndex: 1
          }
        },
        components: {
        },

        computed:{
            ...mapState({
            }),
        },

        beforeMount(){
        },

        mounted(){
        },

        methods: {
            selectMenu() {

            },
            ajustNavSide() {

            }
        },
    }
</script>

<style lang="less">
  .page-header {
      .page-header-top {
          margin: 0 auto;
      }
  }
</style>
