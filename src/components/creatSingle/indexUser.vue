<template>
    <div class="filterTypeBox isuser">
        <div class="filterBody">
            <div class="userTitle">指标</div>
            <el-row :gutter="5">
                <el-col :span="5">
                    <div class="center">
                        <el-radio-group v-model="conditionType" size="mini" class="miniSize" @change="changeAndOr" >
                            <el-radio-button label="AND"></el-radio-button>
                            <el-radio-button label="OR"></el-radio-button>
                        </el-radio-group>
                    </div>
                </el-col>
                <el-col v-show="isFrist" :span="4">
                    <el-select v-model="fristV.id" clearable placeholder="指标" size="mini" @change="changeFieldData(fristV, 't')">
                        <el-option
                            v-for="item in indexOption"
                            v-show="!item.notShow"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col v-show="isFrist" :span="3">
                    <el-select v-model="fristV.indexType" :disabled="fristV.disable" clearable placeholder="浏览量" size="mini" @change="changeData">
                        <el-option
                            v-for="item in fristV.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col v-show="isFrist" :span="3">
                    <el-select v-model="fristV.type" clearable placeholder="等于" size="mini" @change="changeData">
                        <el-option
                            v-for="item in conditionsText"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col v-show="isFrist" :span="6">
                    <el-input v-model="fristV.value" size="mini" @change="changeNum(fristV)"></el-input>
                </el-col>
                <el-col v-show="isFrist" :span="1">
                    <div class="delBtn">
                        <i class="icon-delete-gray delIcon" @click="notShowFrist()"></i>
                    </div>
                </el-col>
            </el-row>
            <div class="selectDiv">
                <el-row v-for="(info, index) in selectList" :key="info.id" :gutter="5">
                    <el-col :span="5">
                        <div class="centerDiv">
                            <el-button size="mini">{{ conditionType }}</el-button>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="info.id" clearable placeholder="指标" size="mini" @change="changeFieldData(info)">
                            <el-option
                                v-for="item in indexOption"
                                v-show="!item.notShow"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-select v-model="info.indexType" :disabled="info.disable" clearable placeholder="浏览量" size="mini" @change="changeData">
                            <el-option
                                v-for="item in info.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-select v-model="info.type" clearable placeholder="等于" size="mini" @change="changeData">
                            <el-option
                                v-for="item in conditionsText"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col v-show="isFrist" :span="6">
                        <el-input v-model="info.value" size="mini" @change="changeNum(info)"></el-input>
                    </el-col>
                    <el-col :span="1">
                        <div class="delBtn">
                            <i class="icon-delete-gray delIcon" @click="deleteSelect(info, index)"></i>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-show="selectList.length < 4" class="addBtn">
                <el-row :gutter="5">
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
import * as Select from '../../constants/composite'

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
        }
    },
    data() {
        return {
            options: [],
            indexOption: [],
            dimensionList: [],
            fristV: {
                id: '',
                type: '',
                value: 0,
                indexType: '',
                disable: false,
                options: []
            },
            conditionType: 'AND', // and是不同维度 or是相同维度
            selectList: [],
            isFrist: false,
            conditionsText: D.TargetConditionsText,
            orOptionList: []
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
    },
    methods: {
        initSelectData() {
            this.conditionType = this.selectedListInfo && this.selectedListInfo.conditionType ? this.selectedListInfo.conditionType : this.conditionType
            let infoList = this.selectedListInfo && this.selectedListInfo.allList ? this.selectedListInfo.allList : []
            if (infoList && infoList.length > 0) {
                this.fristV = {
                    id: infoList[0].id,
                    type: infoList[0].type,
                    value: infoList[0].value,
                    indexType: infoList[0].indexType,
                    options: []
                }
                this.getDimensionList(this.fristV)
                this.isFrist = true
                this.selectList = []
                if (infoList.length > 1) {
                    for (let i = 1; i < infoList.length; i++) {
                        this.selectList.push({
                            id: infoList[i].id,
                            type: infoList[i].type,
                            value: infoList[i].value,
                            indexType: infoList[i].indexType,
                            options: []
                        })
                    }
                    this.$nextTick(() => {
                        this.selectList.forEach(res => {
                            this.getDimensionList(res)
                        })
                    }, 800)
                }
                this.initAndData()
            }
        },
        getDimension() {
            Api.getUserIndexList({appId: this.appId}).then(res => {
                // 没有预定义指标
                let dList = []
                let options = []
                res.data1.forEach(d => {
                    if (d.isPage === 1) {
                        // 页面
                        options = Select.pageSelectList
                    } else {
                        // 元素
                        options = Select.elementSelectList
                    }
                    d.options = options
                    dList.push(d)
                })
                res.data3.forEach(d => {
                    d.options = []
                    dList.push(d)
                })
                this.indexOption = dList
                this.initSelectData()
            })
        },
        getDimensionList(fieldInfo) {
            let id = fieldInfo.id
            this.indexOption.forEach(d => {
                if (d.id === id) {
                    fieldInfo.indexType = fieldInfo.indexType > 0 ? fieldInfo.indexType : (d.options.length > 0 ? 1 : '')
                    fieldInfo.disable = fieldInfo.indexType === ''
                    fieldInfo.options = d.options
                }
            })
        },
        addSelectType() {
            if (this.isFrist) {
                this.selectList.push({
                    id: '',
                    type: '',
                    value: 0,
                    indexType: '',
                    options: [],
                    disable: false
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
            }
            this.initAndData()
            this.sureSelect()
        },
        sureSelect() {
            let allList = []
            if (this.isFrist) {
                allList.push({
                    id: this.fristV.id,
                    type: this.fristV.type,
                    value: this.fristV.value,
                    indexType: this.fristV.indexType === '' ? 0 : this.fristV.indexType
                })
                this.selectList.forEach((res) => {
                    // 格式化输出的数据
                    let item = {
                        id: res.id,
                        type: res.type,
                        value: res.value,
                        indexType: res.indexType === '' ? 0 : res.indexType
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
        changeNum(fieldInfo) {
            fieldInfo.value = fieldInfo.value.replace(/\D/g, '')
            this.sureSelect()
        },
        changeFieldData(fieldInfo, t) {
            // 选择维度
            // and是不同维度 or是相同维度
            this.initAndData()
            // 获取维度的值
            fieldInfo.options = []
            this.getDimensionList(fieldInfo)
        },
        changeData() {
            // 选择等于和值
            this.sureSelect()
        },
        changeAndOr() {
            this.selectList = []
            this.indexOption.forEach(res => {
                res.notShow = false
            })
        },
        initAndData() {
            // 如果是and就要隐藏列表的
            if (this.conditionType === 'AND') {
                // 如果是and就要隐藏列表的
                for (let i = 0; i < this.indexOption.length; i++) {
                    this.indexOption[i].notShow = false
                    if (this.indexOption[i].id === this.fristV.id) {
                        this.indexOption[i].notShow = true
                    } else {
                        for (let j = 0; j < this.selectList.length; j++) {
                            if (this.selectList[j].id === this.indexOption[i].id) {
                                this.indexOption[i].notShow = true
                            }
                        }
                    }
                }
            } else {
                // 如果是or就只能选择一个
                for (let i = 0; i < this.indexOption.length; i++) {
                    this.indexOption[i].notShow = this.selectList.length > 0
                    if (this.indexOption[i].id === this.fristV.id) {
                        this.indexOption[i].notShow = false
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
