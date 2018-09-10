<template>
    <div v-show="isShowSelect" :isShowSelect="isShowSelect " class="selectTypeBox" >
        <el-row :gutter="8">
            <el-col :span="6">
                <el-radio-group v-model="conditionType" size="mini" @change="changeAndOr">
                    <el-radio-button label="AND"></el-radio-button>
                    <el-radio-button label="OR"></el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col v-show="isFrist" :span="5" >
                <el-select v-model="fristV.fieldId" clearable placeholder="操作系统" size="mini" @change="changeFieldData(fristV, 't')">
                    <el-option
                        v-for="item in dimensionOption"
                        v-show="!item.notShow"
                        :key="item.dimensionid"
                        :label="item.name"
                        :value="item.dimensionid">
                    </el-option>
                </el-select>
            </el-col>
            <el-col v-show="isFrist" :span="4">
                <el-select v-model="fristV.type" clearable placeholder="等于" size="mini">
                    <el-option
                        v-for="item in conditionsText"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col v-show="isFrist" :span="8">
                <el-select v-model="fristV.value" clearable placeholder="Android" size="mini">
                    <el-option
                        v-for="item in fristV.options"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col v-show="isFrist" :span="1">
                <div class="delBtn">
                    <i class="el-icon-delete" @click="notShowFrist()"></i>
                </div>
            </el-col>
        </el-row>
        <div class="selectDiv">
            <el-row v-for="(info, index) in selectList" :key="info.id" :gutter="8" >
                <el-col :span="6" class="centerDiv">
                    <el-button size="mini">{{ conditionType }}</el-button>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="info.fieldId" clearable placeholder="操作系统" size="mini" @change="changeFieldData(info)">
                        <el-option
                            v-for="item in dimensionOption"
                            v-show="!item.notShow"
                            :key="item.dimensionid"
                            :label="item.name"
                            :value="item.dimensionid">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="info.type" clearable placeholder="等于" size="mini">
                        <el-option
                            v-for="item in conditionsText"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <el-select v-model="info.value" clearable placeholder="Android" size="mini">
                        <el-option
                            v-for="item in info.options"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="1">
                    <div class="delBtn">
                        <i class="el-icon-delete" @click="deleteSelect(info, index)"></i>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-show="selectList.length < 4" class="addBtn" >
            <el-button type="danger" size="mini" icon="el-icon-plus" @click="addSelectType()"></el-button>
        </div>
        <div v-show="showErr" class="errText" >请填写完字段信息</div>
        <div class="sureBtn">
            <el-button size="mini" type="text" class="delSelect" @click="isShow()">取消</el-button>
            <el-button type="text" size="mini" @click="sureSelect()">确定</el-button>
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
        isShowSelect: {
            type: Boolean,
            default: false
        },
        selectedListInfo: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            dimensionOption: [],
            fristV: {
                fieldId: '',
                type: '',
                value: '',
                options: []
            },
            conditionType: 'AND',
            selectList: [],
            isFrist: false,
            conditionsText: D.ConditionsText,
            showErr: false
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    watch: {
        isShowSelect(value, oldVale) {
            this.isShowSelect = value
        }
    },
    mounted() {
        this.getDimension()
        this.conditionType = this.selectedListInfo && this.selectedListInfo.conditionType ? this.selectedListInfo.conditionType : this.conditionType
        let infoList = this.selectedListInfo && this.selectedListInfo.allList ? this.selectedListInfo.allList : []
        if (infoList && infoList.length > 0) {
            this.fristV = {
                fieldId: infoList[0].fieldId,
                type: infoList[0].type,
                value: infoList[0].value
            }
            this.isFrist = true
            if (infoList.length > 1) {
                for (let i = 1; i < infoList.length; i++) {
                    this.selectList.push(infoList[i])
                }
            }
        }
        document.addEventListener('click', this.hideOtherClick)
    },
    beforeDestroy() {
        document.removeEventListener('click', this.hideOtherClick)
    },
    methods: {
        hideOtherClick(e) {
            let isClickBtn = e.toElement.className.match('icon-choose') || e.toElement.className.match('btn-icon')
            // 不是该区域，并且在可视的情况,并且不是点击按钮（class= btn-icon）隐藏
            if (!this.$el.contains(e.target) && this.isShowSelect && !isClickBtn) {
                this.isShow()
            }
        },
        getDimension() {
            Api.dimensionGetInfo({
                appId: this.appId
            }).then(res => {
                console.log(res)
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
                console.log(this.selectList)
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
        changeFieldData(fieldInfo, t) {
            // 选择维度
            // and是不同维度 or是相同维度
            this.initAndData()
            // 获取维度的值
            fieldInfo.options = []
            fieldInfo.value = ''
            this.getDimensionList(fieldInfo)
        },
        deleteSelect(info, index) {
            this.selectList.splice(index, 1)
            this.initAndData()
        },
        isShow() {
            this.$emit('notshow')
        },
        notShowFrist() {
            if (this.selectList.length > 0) {
                this.selectList.splice((this.selectList.length - 1), 1)
            } else {
                this.isFrist = false
            }
            this.initAndData()
        },
        sureSelect() {
            let allList = []
            // 数据的检测是否为空
            if (!(this.fristV.fieldId && this.fristV.type && this.fristV.value)) {
                this.showErr = true
                return
            }
            allList.push({
                fieldId: this.fristV.fieldId,
                type: this.fristV.type,
                value: this.fristV.value
            })
            let errNum = false
            this.selectList.forEach((res) => {
                if (!(res.fieldId && res.type && res.value)) {
                    this.showErr = true
                    errNum = true
                    return
                }
                let item = {
                    fieldId: res.fieldId,
                    type: res.type,
                    value: res.value
                }
                allList.push(item)
            })
            if (errNum) {
                return
            }
            this.showErr = false
            let allObjct = {
                conditionType: this.conditionType,
                allList: allList
            }
            this.$emit('selects', allObjct)
            this.$emit('notshow')
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
                    console.log(this.selectList)
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
    .selectTypeBox{
        position: absolute;
        z-index: 3;
        top: 42px;
        right: 0;
        width: 520px;
        min-height: 165px;
        border-radius: 2px;
        background: #ffffff;
        padding: 0 24px 20px 20px;
        border: 1px solid #E5E5E5;
        box-shadow: 0 0 4px rgba(0,0,0,0.1);
        .el-row{
            margin-top: 20px;
        }
        .addBtn{
            margin-top: 20px;
        }
        .sureBtn{
            margin-top: 15px;
            text-align: right;
        }
        .centerDiv{
            text-align: center;
        }
        .delSelect{
            color: #65768B;
            margin-right: 40px;
        }
        .delBtn{
            color: #65768A;
            font-size: 18px;
        }
        .el-select{
            .el-input {
                width: auto;
            }
        }
        .errText{
            color: #F35974;
            font-size: 12px;
            text-align: center;
        }
    }

</style>
