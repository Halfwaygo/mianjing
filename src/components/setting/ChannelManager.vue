<template>
    <div class="setting-channel">
        <dynamic-items
            :total="settingTableCount"
            :page-no="eventSettingList.pageNo"
            @sizeChange="onPageSizeChange"
            @pagination="onPagination">
            <table-list :table-data="settingTableList" :is-loading="false">
                <el-table-column
                    prop="name"
                    label="渠道名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="创建人">
                </el-table-column>
                <el-table-column
                    :render-header="sortTimeHeader"
                    prop="updateTime"
                    label="最后更新时间">
                </el-table-column>
                <el-table-column
                    label="操作"
                    header-align="center"
                    align="center"
                    width="180">
                    <template slot-scope="scope">
                        <i class="el-icon-edit-outline edit-icon" @click="editRow(scope.row)"></i>
                        <i class="el-icon-delete edit-icon" @click="deleteRow(scope.row)"></i>
                    </template>
                </el-table-column>
            </table-list>
        </dynamic-items>
        <!--编辑渠道-->
        <dialog-container :di="channelModal" @closeDialog="closeDiaModal" @saveDialog="saveDialog">
            <div slot="container" class="dialog-modal">
                <el-form ref="channelRuleForm" :model="channelRuleForm" :rules="channelRules" label-width="80px" class="channel-rules-form">
                    <el-form-item label="渠道名称" prop="channelName" class="formInputBox">
                        <el-input v-model="channelRuleForm.channelName" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道号" prop="channelId" class="formInputBox">
                        <el-input v-model="channelRuleForm.channelId" size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </dialog-container>
    </div>
</template>

<script>
import Api from '../../utils/api'
import { mapActions, mapState } from 'vuex'
import DynamicItems from '../../components/common/DynamicItems.vue'
import TableList from '../../components/common/TableList.vue'
import DialogContainer from '../common/DialogWrapper.vue'

export default {
    name: 'ChannelManager',
    components: {
        TableList,
        DialogContainer,
        DynamicItems
    },
    data() {
        return {
            fileList: [],
            eventSettingList: {
                totalCount: 0,
                pageNo: 1
            },
            settingListParam: {
                pageNo: 1,
                name: '',
                pageSize: 10,
                order: 1
            },
            channelRuleForm: {
                channelName: '',
                channelId: '',
                channelIdBefore: ''
            },
            channelRules: {
                channelName: [
                    { required: true, message: '渠道名称不能为空', trigger: 'blur' },
                    { min: 1, max: 20, message: '渠道名称长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                channelId: [
                    { required: true, message: '渠道号不能为空', trigger: 'blur' },
                    { min: 1, max: 20, message: '渠道号长度在 1 到 20 个字符', trigger: 'blur' }
                ]
            },
            lists: [
                // {
                //     name: '单次使用时长（小时）',
                //     channelNum: 123,
                //     userName: 32,
                //     updateTime: '20180504'
                // }
            ],
            channelModal: {
                Visible: false,
                Title: '编辑渠道',
                Width: '440px'
            },
            sortable: 'sort-desc'
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId,
            settingTableList: ({setting}) => setting.settingTableList,
            settingTableCount: ({setting}) => setting.settingTableCount
        })
    },
    created() {
        this.refreshData()
    },
    methods: {
        ...mapActions(['getSettingList']),
        refreshData() {
            this.getSettingList({
                appId: this.appId,
                pageNo: this.settingListParam.pageNo,
                name: this.settingListParam.name,
                pageSize: this.settingListParam.pageSize,
                order: this.settingListParam.order
            })
        },
        onPageSizeChange(v) {
            console.log(v)
        },
        onPagination(v) {
            this.settingListParam.pageNo = v
            this.refreshData()
            console.log(v)
        },
        beforeRemove() {

        },
        handleRemove() {

        },
        sortTimeHeader(h, { column, $index }) {
            return h('span', [column.label, h('i', {class: this.sortable, on: {click: this.changeSort}})])
        },
        changeSort() {
            this.sortable = this.sortable === 'sort-desc' ? 'sort-asc' : 'sort-desc'
            this.settingListParam.order = this.settingListParam.order === 1 ? 0 : 1
            this.refreshData()
        },
        editRow(scop) {
            this.channelRuleForm.channelName = scop.name
            this.channelRuleForm.channelId = scop.channelNum
            this.channelRuleForm.channelIdBefore = scop.channelNum
            this.channelModal.Visible = true
        },
        deleteRow(scop) {
            this.$confirm(`删除后不可恢复，是否确定删除？`, '删除渠道', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                Api.deleteSetting({
                    appId: this.appId,
                    channelNum: scop.channelNum
                }).then(res => {
                    this.$message.success('删除成功')
                    this.refreshData()
                })
            }).catch(() => {
            })
        },
        saveDialog() {
            //  保存时做数据校验，  但是取消不做检验
            this.$refs.channelRuleForm.validate((valid) => {
                if (valid) {
                    Api.modifySetting({
                        appId: this.appId,
                        channelName: this.channelRuleForm.channelName,
                        channelNum: this.channelRuleForm.channelId,
                        channelNumBefore: this.channelRuleForm.channelIdBefore
                    }).then(res => {
                        this.refreshData()
                        this.channelModal.Visible = false
                        this.$message.success('修改成功')
                    })
                } else {
                    return false
                }
            })
        },
        closeDiaModal(par) {
            console.log(par)
            this.channelModal.Visible = false
        }
    }
}
</script>

<style lang="scss">
.setting-channel{
    background-color: #FFFFFF;
    .dialog-modal{
        margin: 15px 0;
        .channel-rules-form{
            .formInputBox{
                .el-select--medium{
                    width: 100%;
                }
            }
            .el-form-item{
                margin-bottom: 22px;
            }
            .el-form-item.formInputBox.is-success{
                .el-textarea__inner, .el-input__inner{
                    border-color:#dcdfe6;
                }
                .el-input__inner:focus, .el-textarea__inner:focus{
                    border-color: #2773c2;
                }
                .el-form-item__content{
                    color: #000;
                    .el-input{
                        .el-input__inner:focus, .el-textarea__inner:focus{
                            border-color: #2773c2;
                        }
                    }
                }
            }
            .is-success{
                input[type='text'].el-input__inner:focus{
                    color: #000;
                    border-color: #2773c2;
                }
            }
        }
        .channel-span{
        }
        .channel-input{
            margin: 10px 0;
        }
    }
    .edit-icon{
        margin: 0 25px 0;
        color: #3392FF;
        font-size: 18px;
        cursor: pointer;
    }
}
</style>
