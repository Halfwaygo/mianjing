<template>
    <div class="add-model-section">
        <div class="top-title">
            <div class="left-title">{{ name }}</div>
            <div class="right-con">
                <el-button size="medium" type="primary" class="cancel-btn" @click="cancel">取消</el-button>
                <el-button v-show="!isDetail" size="medium" type="primary" class="save-btn" @click="saveGraph">保存</el-button>
            </div>
        </div>
        <dialog-container :di="saveInfo" @saveDialog="saveDialog" @closeDialog="saveInfo.Visible=false">
            <div slot="container" class="graph-description">
                <span>单图名称</span>
                <el-input v-model="graphName" placeholder="请输入内容单图名称" class="input-name" size="mini" maxlength="30"></el-input>
                <span>单图描述</span>
                <el-input v-model="graphDescription" :rows="4" type="textarea" class="input-desc" placeholder="请输入内容单图描述" size="mini" maxlength="150"></el-input>
            </div>
        </dialog-container>
    </div>
</template>
<script>
import DialogContainer from '../common/DialogWrapper.vue'
export default {
    name: 'AddModel',
    components: {
        DialogContainer
    },
    props: {
        editbasedata: {
            type: Object,
            default: null
        },
        name: {
            type: String,
            default: '过滤条件'
        },
        isDetail: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            saveInfo: {
                Visible: false,
                Width: '640px',
                Title: '保存单图'
            },
            graphName: '',
            graphDescription: ''
        }
    },
    watch: {
        editbasedata: {
            handler(newVal, oldVal) {
                this.graphName = newVal.graphName
                this.graphDescription = newVal.graphDescription
            },
            deep: true
        }
    },
    mounted() {
        // alert(JSON.stringify(this.editbasedata))
        try {
            this.graphName = this.editbasedata.graphName
            this.graphDescription = this.editbasedata.graphDescription
        } catch (c) {}
    },
    methods: {
        cancel() {
            this.$router.go(-1)
        },
        saveGraph() {
            this.saveInfo.Visible = true
        },
        saveDialog() {
            if (this.graphName === '') {
                this.$message.error({
                    message: '单图名称不能为空'
                })
                return
            }
            this.saveInfo.Visible = false
            this.$emit('saveCreGraph', {'name': this.graphName, 'discreption': this.graphDescription})
        }
    }
}
</script>

<style lang="scss">
.add-model-section {
    // overflow: auto;
    .top-title {
        .left-title {
          float: left;
          color: #5a6d82;
          font-size: 14px;
        }
        .right-con {
            @mixin pubmixin() {
                display: inline-block;
                text-align: center;
                border-radius: 2px;
                width: 100px;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
            }
            .cancel-btn {
              width: 100px;
            }
            .save-btn {
              width: 100px;
              margin-left: 8px;
            }
            float: right;
        }
        height: 32px;
        line-height: 32px;
    }
    .graph-description{
        padding: 15px 0;
        font-size: 14px;
        .input-name{
            margin: 14px 0 18px;
        }
        .input-desc{
            margin: 14px 0 40px;
        }
    }
}
</style>
