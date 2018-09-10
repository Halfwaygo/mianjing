<template>
    <div :class="{'inline-block':inline}" class="search-input" >
        <el-input :placeholder="placeholder" v-model.trim="keyword" prefix-icon="el-icon-search" @keypress.enter.native="doSearch(keyword)" />
    </div>
</template>

<script>
export default {
    name: 'SearchInput',
    props: {
        value: String,
        inline: {
            type: Boolean,
            default: false
        },

        placeholder: String,
        search: Function
    },

    data() {
        return {
            keyword: ''
        }
    },

    watch: {
        value(newVal) {
            this.keyword = newVal
        },

        keyword(newVal) {
            this.$emit('input', newVal)
        }
    },

    beforeMount() {
        this.keyword = this.value
    },

    methods: {
        doSearch(value) {
            this.$emit('search', value)
        }
    }
}
</script>

<style lang='scss'>
    .search-input {
        width: 260px;
        .el-input__inner {
            height: 30px;
        }
        .el-input__icon {
            line-height: 30px;
        }
    }
</style>
