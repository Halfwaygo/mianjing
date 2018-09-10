<template>
    <div :class="{'isuser': isUser}" class="filterTypeBox">
        <div v-show="!isUser" class="filterHead">{{ name }}</div>
        <div class="filterBody">
            <div v-show="isUser" class="userTitle">维度</div>
            <el-row :gutter="5">
                <el-col v-show="!isUser" :span="boxNum[0]" class="number">1</el-col>
                <el-col :span="boxNum[1]">
                    <div class="center">
                        <el-radio-group v-model="conditionType" :disabled="disable" size="mini" class="miniSize" @change="changeAndOr" >
                            <el-radio-button label="AND"></el-radio-button>
                            <el-radio-button label="OR"></el-radio-button>
                        </el-radio-group>
                    </div>
                </el-col>
                <el-col v-show="isFrist" :span="boxNum[2]">
                    <el-select v-model="fristV.fieldId" :disabled="disable" clearable placeholder="操作系统" size="mini" @change="changeFieldData(fristV, 't')">
                        <el-option
                            v-for="(item, index) in dimensionOption"
                            v-show="!item.notShow"
                            :key="index"
                            :label="item.name"
                            :value="item.dimensionid">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col v-show="isFrist" :span="boxNum[3]">
                    <el-select v-model="fristV.type" :disabled="disable" clearable placeholder="等于" size="mini" @change="changeData">
                        <el-option
                            v-for="(item, index) in conditionsText"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col v-show="isFrist" :span="boxNum[4]">
                    <el-select v-model="fristV.value" :disabled="disable" clearable placeholder="Android" size="mini" @change="changeData">
                        <el-option
                            v-for="(item, index) in fristV.options"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col v-show="isFrist && !disable" :span="boxNum[5]">
                    <div class="delBtn">
                        <i class="icon-delete-gray delIcon" @click="notShowFrist()"></i>
                    </div>
                </el-col>
            </el-row>
            <div class="selectDiv">
                <el-row v-for="(info, index) in selectList" :key="index" :gutter="5">
                    <el-col v-show="!isUser" :span="boxNum[0]" class="number">{{ index + 2 }}</el-col>
                    <el-col :span="boxNum[1]">
                        <div class="centerDiv">
                            <el-button size="mini">{{ conditionType }}</el-button>
                        </div>
                    </el-col>
                    <el-col :span="boxNum[2]">
                        <el-select v-model="info.fieldId" :disabled="disable" clearable placeholder="操作系统" size="mini" @change="changeFieldData(info)">
                            <el-option
                                v-for="(item, index) in dimensionOption"
                                v-show="!item.notShow"
                                :key="index"
                                :label="item.name"
                                :value="item.dimensionid">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="boxNum[3]">
                        <el-select v-model="info.type" :disabled="disable" clearable placeholder="等于" size="mini" @change="changeData">
                            <el-option
                                v-for="(item, index) in conditionsText"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="boxNum[4]">
                        <el-select v-model="info.value" :disabled="disable" clearable placeholder="Android" size="mini" @change="changeData">
                            <el-option
                                v-for="(item, index) in info.options"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="boxNum[5]">
                        <div v-show="!disable" class="delBtn">
                            <i class="icon-delete-gray delIcon" @click="deleteSelect(info, index)"></i>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-show="selectList.length < 4 && !disable" class="addBtn">
                <el-row :gutter="5">
                    <el-col v-show="!isUser" :span="1">&nbsp;</el-col>
                    <el-col :span="6">
                        <div class="centerDiv">
                            <el-button size="mini" @click="addSelectType()"><i class="icon-add"></i></el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapState } from 'vuex'
import * as D from '../../constants/dashboard'

export default {
    name: 'SelectType',
    props: {
        name: {
            type: String,
            default: '过滤条件'
        },
        selectedListInfo: {
            type: Object,
            default: null
        },
        disable: {
            type: Boolean,
            default: false
        },
        isUser: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            options: [],
            dimensionOption: [],
            dimensionList: [],
            fristV: {
                fieldId: '',
                type: '',
                value: '',
                options: []
            },
            conditionType: 'AND', // and是不同维度 or是相同维度
            selectList: [],
            isFrist: false,
            conditionsText: D.ConditionsText,
            orOptionList: [],
            boxNum: this.isUser ? [1, 5, 4, 3, 9, 1] : [1, 6, 5, 4, 6, 1]
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    watch: {
        selectedListInfo(newVal, oldVal) {
            this.initSelectData()
        }
    },
    mounted() {
        this.getDimension()
        // 如果有筛选条件的传入 做数据的格式化
        this.initSelectData()
    },
    methods: {
        initSelectData() {
            this.conditionType = this.selectedListInfo && this.selectedListInfo.conditionType ? this.selectedListInfo.conditionType : this.conditionType
            let infoList = this.selectedListInfo && this.selectedListInfo.allList ? this.selectedListInfo.allList : []
            if (infoList && infoList.length > 0) {
                this.fristV = {
                    fieldId: infoList[0].fieldId,
                    type: infoList[0].type,
                    value: infoList[0].value,
                    options: []
                }
                this.getDimensionList(this.fristV)
                this.isFrist = true
                this.selectList = []
                if (infoList.length > 1) {
                    for (let i = 1; i < infoList.length; i++) {
                        this.selectList.push({
                            fieldId: infoList[i].fieldId,
                            type: infoList[i].type,
                            value: infoList[i].value,
                            options: []
                        })
                    }
                    this.$nextTick(() => {
                        this.selectList.forEach(res => {
                            if (this.conditionType === 'OR' && this.orOptionList.length > 0) {
                                // or 是单维度，避免多次请求同一个数据而造成后台无接口值返回的，造成前端无数据的现象
                                res.options = this.orOptionList
                            } else {
                                this.getDimensionList(res)
                            }
                        })
                    })
                }
                this.initAndData()
            }
        },
        getDimension() {
            Api.dimensionGetInfo({
                appId: this.appId
            }).then(res => {
                this.dimensionOption = res.datas
            })
        },
        getDimensionList(fieldInfo) {
            console.log(fieldInfo)
            let fieldId = fieldInfo.fieldId
            Api.dimensionGetValueList({
                appId: this.appId,
                fieldId: fieldId
            }).then(res => {
                console.log(res)
                this.$nextTick(() => {
                    fieldInfo.options = res.datas
                })
                this.orOptionList = this.conditionType === 'OR' ? res.datas : []
            })
        },
        addSelectType() {
            if (this.isFrist) {
                this.selectList.push({
                    fieldId: '',
                    type: '',
                    value: '',
                    options: []
                })
            } else {
                this.isFrist = true
            }
            if (this.selectList.length > 0) {
                this.initAndData()
            }
        },
        deleteSelect(info, index) {
            this.selectList.splice(index, 1)
            this.initAndData()
            this.sureSelect()
        },
        notShowFrist() {
            if (this.selectList.length > 0) {
                this.selectList.splice((this.selectList.length - 1), 1)
            } else {
                this.isFrist = false
                this.fristV = {
                    fieldId: '',
                    type: '',
                    value: '',
                    options: []
                }
            }
            this.initAndData()
            this.sureSelect()
        },
        sureSelect() {
            let allList = []
            if (this.isFrist) {
                allList.push({
                    fieldId: this.fristV.fieldId,
                    type: this.fristV.type,
                    value: this.fristV.value
                })
                this.selectList.forEach((res) => {
                    // 格式化输出的数据
                    let item = {
                        fieldId: res.fieldId,
                        type: res.type,
                        value: res.value
                    }
                    allList.push(item)
                })
            }
            let allObjct = {
                conditionType: this.conditionType,
                allList: allList
            }
            this.$emit('selects', allObjct)
        },
        changeFieldData(fieldInfo, t) {
            // 选择维度
            // and是不同维度 or是相同维度
            this.initAndData()
            // 获取维度的值
            fieldInfo.options = []
            fieldInfo.value = ''
            this.getDimensionList(fieldInfo)
        },
        changeData() {
            // 选择等于和值
            this.sureSelect()
        },
        changeAndOr() {
            this.selectList = []
            this.dimensionOption.forEach(res => {
                res.notShow = false
            })
        },
        initAndData() {
            // 如果是and就要隐藏列表的
            if (this.conditionType === 'AND') {
                // 如果是and就要隐藏列表的
                for (let i = 0; i < this.dimensionOption.length; i++) {
                    this.dimensionOption[i].notShow = false
                    if (this.dimensionOption[i].dimensionid === this.fristV.fieldId) {
                        this.dimensionOption[i].notShow = true
                    } else {
                        for (let j = 0; j < this.selectList.length; j++) {
                            if (this.selectList[j].fieldId === this.dimensionOption[i].dimensionid) {
                                this.dimensionOption[i].notShow = true
                            }
                        }
                    }
                }
                console.log(this.dimensionOption)
            } else {
                // 如果是or就只能选择一个
                for (let i = 0; i < this.dimensionOption.length; i++) {
                    this.dimensionOption[i].notShow = this.selectList.length > 0
                    if (this.dimensionOption[i].dimensionid === this.fristV.fieldId) {
                        this.dimensionOption[i].notShow = false
                    }
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .filterTypeBox {
        width: 460px;
        min-height: 200px;
        background: #F9FAFC;
        border: 1px solid #E5E5E5;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        margin-top: 15px;
        .filterHead{
            font-size: 14px;
            color: #5A6D82;
            background-color: #F7FAFF;
            padding: 7px 10px;
            border-bottom: 1px solid #C2D3E0;
        }
        .filterBody{
            margin-left: 5px;
            padding-bottom: 25px;
            color: #65768B;
            .el-input__inner{
                color: #5A6D82;
            }
        }
        .number{
            text-align: right;
            line-height: 28px;
        }
        .el-row {
            margin-top: 20px;
        }
        .addBtn {
            margin-top: 20px;
            .el-button{
                border: 1px solid #3392FF;
                color: #3392FF;
                padding: 5px 16px;
                .icon-add{
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    background: url("../../layouts/images/icon/icon-add-blue.png") no-repeat center;
                    background-size: contain;
                }
            }
        }
        .centerDiv ,.center{
            text-align: center;
            position: relative;
        }
        .centerDiv:after{
            content: '';
            height: 20px;
            width: 1px;
            border-left: 1px dashed #E3EAF0;
            position: absolute;
            top: -20px;
            left: 50%;
            margin-left: 3px;
        }
        .delSelect {
            color: #65768B;
        }
        .delBtn {
            color: #65768A;
            font-size: 16px;
            position: relative;
            top: 3px;
            margin-left: 2px;
            .delIcon{
                width: 16px;
                height: 16px;
            }
        }
        .el-radio-button--mini .el-radio-button__inner{
            padding: 6px 8px;
        }
    }
    .isuser.filterTypeBox{
        width: 804px;
        padding-right: 170px;
        margin-top: 0;
        .userTitle{
            padding: 20px 22px 0;
            font-size: 16px;
            color: #5A6D82;
        }
        .el-select{
            display: block;
        }
    }
    .checkCard{
        float: left;
        display: none;
    }
    .selected .checkCard{
        display: inline-block;
    }
    .nameCard{
        float: right;
        font-size: 13px
    }
    .selectDiv{
        color: #65768B;
    }
</style>
