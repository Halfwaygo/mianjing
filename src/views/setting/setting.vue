<template>
    <div class="setting-section">
        <el-row class="el-row-btn">
            <el-col :span="12">
                <el-radio-group v-model="radioBtn" size="mini" class="topBtnSwitch">
                    <el-radio-button v-if="false" label="config">防刷配置管理</el-radio-button>
                    <!--<el-radio-button label="channel">渠道管理</el-radio-button> 暂时去掉banner-->
                </el-radio-group>
            </el-col>
            <el-col v-show="radioBtn!== 'config'" :span="12" class="grid-content-right">
                <el-dropdown @command="handleCommand">
                    <el-button type="primary" class="el-icon-plus">添加渠道</el-button>
                    <el-dropdown-menu slot="dropdown" class="popper-channel-type" style="width: 112px;text-align: center">
                        <el-dropdown-item command="channelCreate">创建渠道</el-dropdown-item>
                        <el-dropdown-item command="channelExcelImport">批量导入</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            <el-col v-show="radioBtn=== 'config'" :span="12" class="grid-content-right">
                <el-button type="primary" @click="saveSetting">保存</el-button>
            </el-col>
        </el-row>
        <config-manager v-show="radioBtn=== 'config'"></config-manager>
        <channel-manager v-show="radioBtn!== 'config'"></channel-manager>
        <dialog-container :di="createChannelSet" @closeDialog="closeDiaModal" @saveDialog="saveDialog"><!--创建渠道dialog-->
            <div slot="container" class="create-channel">
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
        <dialog-container :di="excelImportSet" @closeDialog="closeExcelImportDialog"><!--创建渠道dialog-->
            <div slot="container" class="create-channel second-step">
                <div v-show="isShowErrorMsg" class="error-tips">
                    <div class="upload-error">上传失败！</div>
                    <div class="upload-error-message">{{ errorMsg }}</div>
                </div>
                <div v-show="isShowUploadMsg" class="first-step upload-modal">
                    <el-upload
                        :headers="uploadHeaders"
                        :before-upload="beforeUpload"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="1"
                        :file-list="fileList"
                        :action="uploadUrl"
                        name="userUploadFile"
                        class="upload-demo"
                        multiple>
                        <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                        <div class="export-modal channel-m-btn"><i class="el-icon-upload2"></i>导入渠道模板</div>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                    <!-- <div class="export-modal channel-m-btn" @click="importExcel"><i class="el-icon-upload2"></i>导入渠道模板</div> -->
                    <div class="download-modal channel-m-btn" @click="downLoadExcel">下载渠道模板</div>
                    <div class="is-update-success">
                        <!-- <span>xx.xls</span>
                        <span class="edit-btn">
                            <i v-if="false" class="el-icon-download"></i>
                            <i class="el-icon-delete"></i>
                        </span> -->
                        <el-button>取消</el-button>
                        <el-button type="primary">确定</el-button>
                    </div>
                </div>
                <div v-show="isShowRecoverMsg" class="recover-info third-step">
                    <div class="top-title">以下渠道号已存在！</div>
                    <div class="is-recover">确认录入后会覆盖原渠道信息，是否覆盖？</div>
                    <ul class="channel-recover-list">
                        <li>qudao---id</li>
                    </ul>
                </div>
            </div>
            <div v-show="isShowFooter" slot="showfooter"></div>
        </dialog-container>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Api from '../../utils/api'
import WaterMark from '../../mixins/watermark'
import ConfigManager from '../../components/setting/ConfigManager.vue'
import ChannelManager from '../../components/setting/ChannelManager.vue'
import DialogContainer from '../../components/common/DialogWrapper.vue'
import * as C from '../../constants/api'

/*
*  dialog显示问题
*  第一步上传是为只有下载 导入模板
*  导入有错误的提示错误信息，底部的确认取消按钮不显示
*  导入成功 显示确认取消按钮
*  如果有重复的给出提示，没有重复的则显示出来导入的excel文件信息（可删除）
* */
export default {
    name: 'Setting',
    components: {
        ConfigManager,
        ChannelManager,
        DialogContainer
    },
    mixins: [WaterMark],
    data() {
        return {
            addChannelType: '创建渠道',
            uploadHeaders: {
                appId: ''
            },
            radioBtn: 'channel',
            lists: [
                {type: '单次使用时长（小时）', activities: 123, users: 32},
                {type: '单日启动次数（次）', activities: 123, users: 32},
                {type: 'IP访问上限（次）', activities: 123, users: 32},
                {type: '总计', activities: 1233, users: 332}
            ],
            fileList: [],
            errorMsg: '渠道号或域名不能为空', // 上传excel错误的提示信息
            isShowUploadMsg: true, // 显示第一步上传的信息
            isShowErrorMsg: false, // 显示上传后的错误信息展示
            isShowRecoverMsg: false, // 是否显示上传成功但是有重复的渠道号信息
            isShowFooter: false, // 是否显示底部菜单
            excelImportSet: {
                Visible: false,
                Title: '批量导入',
                Width: '440px'
            },
            createChannelSet: {
                Visible: false,
                Title: '创建渠道',
                Width: '440px'
            },
            channelRuleForm: {
                channelName: '',
                channelId: ''
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
            }
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId
        }),
        uploadUrl() {
            return C.IMPORT_EXCEL_SETTING
        },
        downLoadUrl() {
            return C.DOWN_LOAD_URL
        }
    },
    beforeMount() {
        this.waterMk()
    },
    mounted() {
        this.uploadHeaders.appId = this.appId
    },
    methods: {
        ...mapActions(['getSettingList']),
        beforeUpload() {
        },
        handleRemove() {

        },
        beforeRemove() {

        },
        downLoadExcel() {
            window.location.href = this.downLoadUrl
        },
        handleCommand(command) {
            // this.$message('click on item ' + command)
            if (command === 'channelCreate') {
                this.addNewChannel()
            } else {
                this.channelExcelImport()
            }
        },
        channelExcelImport() {
            this.excelImportSet.Visible = true
        },
        closeExcelImportDialog() {
            this.excelImportSet.Visible = false
        },
        saveDialog() {
            //  保存时做数据校验，  但是取消不做检验
            this.$refs.channelRuleForm.validate((valid) => {
                if (valid) {
                    Api.addSetting({
                        appId: this.appId,
                        channelInfo: JSON.stringify([{
                            channelName: this.channelRuleForm.channelName,
                            channelNum: this.channelRuleForm.channelId
                        }])
                    }).then(res => {
                        this.getSettingList({
                            appId: this.appId,
                            pageNo: 1,
                            name: '',
                            pageSize: 10,
                            order: 1
                        })
                        this.$message.success('新增成功')
                        this.createChannelSet.Visible = false
                    })
                } else {
                    return false
                }
            })
        },
        addNewChannel() {
            this.createChannelSet.Visible = true
        },
        closeDiaModal() {
            this.createChannelSet.Visible = false
            this.$refs.channelRuleForm.resetFields()
        },
        saveSetting() {
            alert('保存成功')
        }
    }
}
</script>

<style lang="scss">
$bg-black: #000;
$color-white: #FFF;
.el-dropdown-menu__item{
    height: 24px;
    line-height: 24px;
    background-color: #fff;
    color: #5A6D82;
}
.el-dropdown-menu__item:not(.is-disabled):hover{
    background-color: #3392FF;
    color: #fff;
}
.setting-section{
    padding: 30px 25px;
    background-color: #FFFFFF;
    .topBtnSwitch{
        .is-active{
            .el-radio-button__inner{
                background-color: #409EFF;
                color: #ffffff;
            }
        }
        .el-radio-button__inner{
            background-color: #F9FAFB;
            color: #20A0FF;
        }
    }
    .el-row-btn{
        .grid-content-right{
            text-align: right;
            .popper-channel-type{
                width: 112px;
                text-align: center;
            }
        }
    }
    .el-row-config-list{
        margin: 20px 0;
        .select{
            width: 60px;
        }
    }
    .create-channel{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .upload-modal{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        .error-tips{
            margin-top: 15px;
            .upload-error{
                text-align: center;
                color: #F66254;
                font-size: 16px;
            }
            .upload-error-message{
                margin-top: 5px;
                font-size: 14px;
                color: #333333;
            }
        }
        .recover-info{
            text-align: center;
            .top-title{
                margin-top: 14px;
                font-size: 16px;
                color: #333333;
            }
            .is-recover{
                margin-top: 4px;
                font-size: 14px;
                color: #333333;
            }
            .channel-recover-list{
                padding: 10px 0 14px;
                li{
                    font-size: 12px;
                    color: #333333;
                }
            }
        }
        .channel-input{
            margin: 10px 0;
        }
        .channel-m-btn{
            width: 136px;
            font-size: 14px;
            text-align: center;
            border-radius: 2px;
        }
        .download-modal{
            margin: 12px 0;
            color: #3DAF42;
            cursor: pointer;
        }
        .export-modal{
            cursor: pointer;
            margin-top: 15px;
            color: #3392FF;
            border:1px solid #3392FF;
        }
        .is-update-success{
            width: 100%;
            height: 45px;
            line-height: 45px;
            margin: 0 0 18px;
            background-color: rgba(194,211,224,.1);
            font-size: 12px;
            overflow: hidden;
            text-indent: 10px;
            text-align: right;
            .edit-btn{
                float: right;
                margin-right: 10px;
                .el-icon-download{
                    margin-right: 10px;
                }
            }
        }
    }
}
.popper-circle-tips{
    background-color: $bg-black;
    opacity: .7;
    color: $color-white;
    font-size: 14px;
    .el-popover__title{
        color: $color-white;
        font-size: 14px;
    }
    .popper__arrow::after{
        border-right-color: $bg-black !important;
        opacity: .7;
    }
}
</style>
