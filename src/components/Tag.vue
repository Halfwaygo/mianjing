<template>
    <el-tag :type="type" :size="size">{{ text }}</el-tag>
</template>

<script>
export default {
    name: 'Tag',
    props: {
        value: [String, Boolean],
        size: {
            type: String,
            default: 'medium'
        },
        okText: {
            type: String,
            default: '上线'
        },
        cancelText: {
            type: String,
            default: '下线'
        },
        okValue: {
            type: String,
            default: '1'
        },
        cancelValue: {
            type: String,
            default: '0'
        }
    },

    computed: {
        mapping() {
            return {
                [this.okValue]: {type: 'success', text: this.okText},
                [this.cancelValue]: {type: 'warning', text: this.cancelText}
            }
        },

        type() {
            const mapping = this.mapping
            return mapping[this.value] ? mapping[this.value].type : ''
        },

        text() {
            const mapping = this.mapping
            return mapping[this.value] ? mapping[this.value].text : ''
        }
    }
}
</script>
