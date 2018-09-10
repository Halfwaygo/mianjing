<!--二级菜单-->
<template>
    <ul class="tab clearfix" ref="tab">
        <li  @click.native="header_002(event,'1')" @click="clickTabItem(index,item,$event)" v-for="(item, index) in data"  
            :class="{active: currentTabItemIndex == index}">{{item}}</li>
    </ul>
</template>

<script>
    import utils from  '../utils/misc';
    export default{
        name: 'Tab',
        props: {
            tabCard:0,  //切换样式
            data: Array,
            currentData: {
              type: Number,
              default: 0
            },
        },
        data(){
            return {
                currentTabItemIndex: 0,
            }
        },
        created() {
           this.currentTabItemIndex = this.tabCard  || 0 || this.currentData;
           // alert(`this.tabCard = ${this.tabCard}`)
           //this.currentTabItemIndex = this.currentData || 0;
        },

        watch: {
            // currentData: function(val){
            //     this.currentTabItemIndex = val;
            // }
        },
        methods: {
            clickTabItem(i,item,event) {
               // alert("success!!!")
                // alert(`before currentTabItemIndex = ${this.currentTabItemIndex}`)
                this.currentTabItemIndex = i;
                 /*this.$emit('changeTab', i);*/
               this.$nextTick(() =>{
                    this.$emit('changeTab', i);
                    // alert(`i = ${i}`)
                    // alert(`item = ${item}`)
                    // alert(`after currentTabItemIndex = ${this.currentTabItemIndex}`)
                    //alert(event.target)    //console.dir
                    
                });
                 /*this.$forceUpdate(() =>{
                    this.$emit('changeTab', i);
                })*/
            },
            header_002(event,type){
                //alert("success！！！");
                if(type == "1"){
                    _amberTrack("testEventId-002",[{
                        EK:"header_002",
                        EV:"migu-Test002"
                    }]);
                }
                // event.preventDefault();
                // event.stopImmediatePropagation();
                // event.stopPropagation();
            },

		}
    }

</script>

<style lang="less">
    @import "../layouts/css/themes/default.less";
    .tab {
        display:inline-block;
        li { 
            float: left; 
            cursor: pointer;
            text-align:center;
        }
        .active { 
            color: red; 
            border-bottom: 2px solid @primary-color;
        }
    }




</style>