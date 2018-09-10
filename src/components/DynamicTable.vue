<template>
    <div ref="table" class="table-wrapper">
        <el-table :data="data" v-bind="$attrs" stripestyle="width: 100%" empty-text="暂无记录" v-on="$listeners">
            <slot></slot>
        </el-table>
        <div v-if="isPaginationVisible" class="pagination-box" >
            <el-pagination ref="pagination" :layout="layout" :total="total" :current-page="pageNo" :page-size="pageSize" @size-change="handleSizeChange" @current-change="onPagination">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
    name: 'DynamicTable',
    inheritAttrs: false,
    props: {
        data: {
            required: true,
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
            default: true
        },
        draggable: {
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
            return 'total, prev, pager, next, jumper'
        }
    },

    mounted() {
        if (this.draggable) {
            const table = this.$refs.table.querySelector('.el-table__body-wrapper tbody')
            const vm = this
            Sortable.create(table, {
                onEnd({ newIndex, oldIndex }) {
                    newIndex !== oldIndex && vm.$emit('drag', { newIndex, oldIndex })
                }
            })
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
    .pagination-box {
        margin-top: 10px;
        text-align: right;
    }
</style>
