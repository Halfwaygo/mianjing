<template>
    <el-dialog
        v-bind="$attrs"
        :close-on-press-escape="false"
        :close-on-click-modal="closeOnClickModal"
        :visible.sync="dialogVisible"
        :title="title"
        class="modal"
        @close="onClose">
        <slot>暂无数据</slot>
        <span v-if="footerVisible" slot="footer" class="dialog-footer">
            <slot name="footer">
                <el-button @click="dialogVisible=false">{{ cancelText }}</el-button>
                <el-button type="primary" @click="onSave">{{ okText }}</el-button>
            </slot>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: 'Modal',
    props: {
        value: {
            type: Boolean,
            default: false
        },

        title: {
            type: String,
            default: ''
        },

        footerVisible: {
            type: Boolean,
            default: true
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        okText: {
            type: String,
            default: '确定'
        },

        closeOnClickModal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialogVisible: false
        }
    },

    watch: {
        value(newVal) {
            this.dialogVisible = newVal
        },
        dialogVisible(newVal) {
            if (!newVal) {
                this.$emit('input', false)
                this.$emit('close')
            }
        }
    },

    methods: {
        onClose() {
            this.$emit('close')
        },

        onSave() {
            this.$emit('save')
        }
    }
}
</script>

<style lang="scss">
.modal {
    .el-dialog__body{
        padding-top: 0;
    }
}
</style>
