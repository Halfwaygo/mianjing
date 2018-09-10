<template>
    <el-dialog :visible.sync="compoundVisible" title="创建复合指标" >
        <div slot="footer" class="dialog-footer">
            <el-button @click="compoundVisible = false">取 消</el-button>
            <el-button type="primary">确认添加</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'NewCompoundDialog',
    components: {},
    data () {
        return {
            compoundVisible: false
        }
    }
}
</script>

<style scoped>

</style>
