<template>
    <div class="table-wrapper cluster-section-groups">
        <slot></slot>
        <div class="pagination-box">
            <el-pagination
                v-if="isPaginationVisible"
                ref="pagination"
                :current-page="pageNo"
                :page-size="pageSize"
                :page-sizes="[10, 20, 30, 40,50]"
                :layout="layout"
                :total="total"
                background
                class="pagination-box-view"
                @size-change="handleSizeChange"
                @current-change="onPagination">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: 'DynamicTable',
    inheritAttrs: false,
    props: {
        data: {
            required: false,
            type: Array
        },

        pageNo: {
            type: Number,
            default: 1
        },

        pageSize: {
            type: Number,
            default: 10
        },
        total: {
            type: Number,
            default: 0
        },
        paginationAutoHidden: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isPaginationVisible() {
            if (!this.paginationAutoHidden) {
                return true
            }
            return this.total > this.pageSize
        },

        layout() {
            // return 'sizes,->, prev, pager, next, jumper'
            return 'prev, pager, next, jumper'
        }
    },
    methods: {
        onPagination(pageNo) {
            this.$emit('pagination', pageNo)
        },

        handleSizeChange(size) {
            this.$emit('sizeChange', size)
        }
    }
}
</script>
<style lang="scss">
.pagination-box{
    float: right;
    margin: 30px 0;
    display: inherit;
    .pagination-box-view{
        .el-pager{
            li.number{
                background-color: #FFFFFF;
            }
        }
        .btn-prev,.btn-next{
            background-color: #FFFFFF;
        }
    }
}
</style>
