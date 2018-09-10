<template>
    <el-table
        v-loading="isLoading"
        ref="table"
        :data="tableData"
        v-bind="$attrs"
        stripestyle="width: 100%"
        empty-text="暂无记录"
        class="table-list"
        header-row-class-name="header-table"
        @row-click="rowEventClick"
        v-on="$listeners">
        <slot></slot>
    </el-table>
</template>
<script>
export default {
    name: 'TableList',
    inheritAttrs: false,
    props: {
        tableData: {
            required: false,
            type: Array
        },
        isLoading: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return ({
        })
    },
    computed: {
    },
    watch: {
    },
    methods: {
        rowEventClick(row, event, column) {
            this.$emit('rowClick', row, event, column)
        }
    }
}
</script>
<style lang="scss">
$fontTableColor: #6D7684;
.table-list{
    margin: 25px 0;
    border-radius: 3px;
    background: #f5f5f5;
    min-height: 220px;
    &:before {
        background-color: #f5f5f5
    }
    .header-table{
        border-radius: 3px;
        th{
            font-weight: 400;
            font-size: 14px;
            color: $fontTableColor;
            height: 54px;
            background-color: #F7FAFF;
            i.sort-desc{
                background: url("../../layouts/images/icon/icon-down-blue.png") no-repeat;
                background-size: contain;
                height: 12px;
                width: 9px;
                display: inline-block;
                margin-left: 5px;
                cursor: pointer;
            }
            i.sort-asc{
                background: url("../../layouts/images/icon/icon-down-blue.png") no-repeat;
                transform: rotateZ(180deg);
                background-size: contain;
                height: 12px;
                width: 9px;
                display: inline-block;
                margin-left: 5px;
                cursor: pointer;
            }
        }
    }
    .el-table__body-wrapper{
        td{
            padding: 6px 0;
            height: 48px;
            line-height: 48px;
            .cell{
                font-weight: 400;
                font-size: 12px;
                color: $fontTableColor;
            }
        }
    }
}

.pagination-box{
    float: right;
    margin: 30px 0;
    display: inherit;
}
.iconI{
    width: 50px;
    color: #3392FF;
    font-size: 18px;
}
    th.center .cell{
        text-align: center;
    }
.el-button+.el-button{
    margin-left: 0;
}
</style>
