<template>
    <div class="setting-config">
        <div class="title-text">防刷自定义配置</div>
        <div class="title-text-gray">命中以下规则系统将标记为异常用户</div>
        <el-row class="el-row-config-list">
            <el-col :span="5">
                <span>单次使用时长（小时）</span>
                <el-select v-model="useTimes" placeholder="" size="mini" class="select" popper-class="popper-select">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5">
                <span>单日启动次数（次）</span>
                <el-select v-model="touchTimes" placeholder="" size="mini" class="select" popper-class="popper-select">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5">
                <span>IP访问上限（次）</span>
                <el-select v-model="ipTimes" placeholder="" size="mini" class="select" popper-class="popper-select">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <date-picker></date-picker>
        <table-list :table-data="lists" class="table-setting">
            <el-table-column
                prop="type"
                label=""
                width="180">
            </el-table-column>
            <el-table-column
                prop="activities"
                label="异常启动次数"
                width="180">
            </el-table-column>
            <el-table-column
                prop="users"
                label="异常用户数"
                width="180">
            </el-table-column>
        </table-list>
    </div>
</template>

<script>
import DatePicker from '../datePicker.vue'
import TableList from '../common/TableList.vue'
export default {
    name: 'Setting',
    components: {
        DatePicker,
        TableList
    },
    data() {
        return {
            lists: [
                {type: '单次使用时长（小时）', activities: 123, users: 32},
                {type: '单日启动次数（次）', activities: 123, users: 32},
                {type: 'IP访问上限（次）', activities: 123, users: 32},
                {type: '总计', activities: 1233, users: 332}
            ],
            options: [{
                value: '1',
                label: '1'
            }, {
                value: '2',
                label: '2'
            }, {
                value: '3',
                label: '4'
            }, {
                value: '4',
                label: '5'
            }, {
                value: '5',
                label: '6'
            }],
            useTimes: '',
            touchTimes: '',
            ipTimes: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.setting-config{
    background-color: #FFFFFF;
    .el-row-btn{
        .grid-content-right{
            text-align: right;
        }
    }
    .el-row-config-list{
        margin: 20px 0;
        .select{
            width: 60px;
        }
    }
    .title-text{
        margin: 10px 0;
        color: #6D7684;
    }
    .title-text-gray{
        margin: 0 0 10px;
        color: #6D7684;
    }
    .table-setting{
        width: 540px;
    }
}
</style>
