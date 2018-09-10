<template>
    <el-dialog
        :visible="di.Visible"
        :close-on-click-modal="false"
        :title="di.Title"
        :width="di.Width"
        top="0"
        class="createDialogWrapper"
        @close="closeDialogVis">
        <slot name="container"></slot>
        <slot name="showfooter">
            <span slot="footer" class="dialog-footer">
                <el-button class="set-width" @click.stop="closeDialogVis" v-text="footerBtn.cancel"></el-button>
                <el-button :disabled="isDisabled" class="set-width" type="primary" @click="createDashBoard" v-text="footerBtn.ok"></el-button>
            </span>
        </slot>
    </el-dialog>
</template>

<script>

export default {
    name: 'DialogWrapper',
    components: {},
    props: {
        di: {
            type: Object,
            default: () => {
                return {
                    Visible: false,
                    Title: '新建',
                    Width: '640px'
                }
            }
        },
        footerBtn: {
            type: Object,
            default: () => {
                return {
                    cancel: '取 消',
                    ok: '确 定'
                }
            }
        },
        // 是否禁止点击确定按钮
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
        createDashBoard() {
            console.log('调用确定接口，成功后关闭窗口')
            this.$emit('saveDialog')
        },
        closeDialogVis() {
            console.log('close前，数据清空处理')
            this.$emit('closeDialog')
        }
    }
}
</script>

<style lang="scss">
.createDialogWrapper{
    .el-dialog{
        border-radius: 4px;
        box-shadow:0px 0px 21px rgba(25,147,208,0.17);
        .el-dialog__header{
            border-radius: 4px;
            background-color: #F7FAFF;
            border-bottom: 1px solid #D3E2FE;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            padding: 0 20px;
            height: 46px;
            line-height: 46px;
            button[type='button'].el-dialog__headerbtn{
                top: 0;
            }
            .el-dialog__title{
                font-size: 16px;
                color: #5A6D82;
            }
        }
        .el-dialog__body{
            padding: 20px 20px 0;
        }
        .addLogBox{
            .infoList{
                margin-top: 10px;
                max-height: 200px;
                overflow-y: scroll;
                ul{
                    padding: 0;
                    margin: 0;
                    list-style: none;
                    li{
                        color: #5A6D82;
                        font-size: 12px;
                        height: 40px;
                        line-height: 40px;
                        text-indent: 10px;
                        i.el-icon-check{
                            display: none;
                            margin-right: 10px;
                            color: #2db7f5;
                            font-size: 18px;
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                    li:hover{
                        background-color: #409EFF;
                        color: #FFFFFF;
                        i.el-icon-check{
                            display: none;
                            color: #2db7f5;
                            font-size: 18px;
                            height: 40px;
                            line-height: 40px
                        }
                    }
                    li.is-active{
                        background-color: #409EFF;
                        color: #FFFFFF;
                        i.el-icon-check{
                            float: right;
                            color: #FFFFFF;
                            display: inline-block;
                            font-size: 18px;
                            height: 36px;
                            line-height: 36px
                        }
                    }
                }
            }
        }
    }
    .dialog-footer {
      .set-width {
          width: 100px;
      }
    }
}
</style>
