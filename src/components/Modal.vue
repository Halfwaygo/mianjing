<template>
    <el-dialog v-model="isShown" class='bi-dialog' top='60px' @close='close'>
        <div class='header'>
            <slot name='header'></slot>
        </div>
        <div class='body'>
            <slot></slot>
        </div>

    </el-dialog>
</template>

<script>
    export default{
        name: 'Dialog',

        data(){
            return {
                isShown: false
            }
        },

        methods:{
            close(){
                this.$emit('onClosed');
            }
        },

        watch:{
            visible(val){
                this.isShown = val;
            }
        },

        props:{
            visible: Boolean,
            onClosed: Function
        }
    }
</script>


<style lang="less">
    .bi-dialog {


        .el-dialog__header {
            border-bottom: none;
        }

        .el-dialog__body{
            padding-bottom:0;
            padding-top:0;
        }

        .header{
            height: 90px;
            text-align: center;
            font-size: 20px;
            font-size:24px;
        }

        .body{
            min-height: 275px;
            margin: 10px -20px 0 -20px;;
            padding: 30px 40px;
            background-color: #F4F8FC;
            border-top:1px solid #e0e7f0;

            .tip{
                p{
                    position: relative;
                    padding-left:10px;
                    color:#95a1b2;
                    &::before{
                        content: '';
                        width: 4px;
                        height: 4px;
                        top: 7px;
                        left: 0px;
                        border-radius: 2px;
                        background: #95a1b2;
                        position: absolute;
                    }
                }
            }
        }
    }

</style>


