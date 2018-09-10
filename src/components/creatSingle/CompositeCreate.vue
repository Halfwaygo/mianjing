<template>
    <div>
        <el-dialog
            :visible.sync="dialogVisible"
            :title="editId ? '编辑复合指标' : '新建复合指标'"
            custom-class="blueHead"
            top="0"
            width="1100px">
            <div class="createBox">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <div class="boxBorder">
                            <div class="boxHead">
                                <el-row :gutter="5">
                                    <el-col :span="10">
                                        <el-input
                                            v-model="insertValue"
                                            size="mini"
                                            class="insert-search"
                                            placeholder="指标名称或创建者">
                                            <i slot="suffix" size="mini" class="el-input__icon el-icon-search" @click="filterDataAction"></i>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-select v-model="selectOsTypeValue" placeholder="请选择" size="mini" class="selected" @change="selectTypeValueChange">
                                            <el-option
                                                v-for="item in osType"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-select v-model="selectPageValue" placeholder="请选择" size="mini" class="selected" @change="selectPageValueChange">
                                            <el-option
                                                v-for="item in pageList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="compositeTable">
                                <div class="tableHead">
                                    <el-row>
                                        <el-col :span="8" :offset="2">指标名称<i :class="[sortworld === 'name' ? 'icon-sort-asc' : 'icon-sort-desc']" class="icon-sort " @click="sortInfo('name')"></i></el-col>
                                        <el-col :span="7">创建者<i :class="[sortworld === 'userName' ? 'icon-sort-asc' : 'icon-sort-desc']" class="icon-sort" @click="sortInfo('userName')"></i></el-col>
                                        <el-col :span="7">创建时间<i :class="[sortworld === 'createTime' ? 'icon-sort-asc' : 'icon-sort-desc']" class="icon-sort" @click="sortInfo('createTime')"></i></el-col>
                                    </el-row>
                                </div>
                                <div class="tableBody">
                                    <draggable v-model="filterData" :options="dragFromOptions" :move="onMove" :clone="cloneElement" element="div" class="list-group" >
                                        <transition-group :name="'flip-list'" type="transition" >
                                            <div v-for="(item, index) in filterData" v-show="item.enable === 1" :key="index" class="tableList">
                                                <el-row >
                                                    <el-col :span="2"><i :class="[item.isPage === 1 ? 'icon-page' : 'icon-element']"></i></el-col>
                                                    <el-col v-if="item.isComplex === 0" :span="8">{{ item.name }} ({{ item.type === 1 ? 'android' : (item.type === 2 ? 'ios' : (item.type === 3 ? 'web' : '' )) }})</el-col>
                                                    <el-col v-else :span="8">{{ item.name }}</el-col>
                                                    <el-col :span="7">{{ item.userName || 'N/A' }}</el-col>
                                                    <el-col :span="7">{{ item.createTime.split(' ')[0] }}</el-col>
                                                </el-row>
                                            </div>
                                        </transition-group>
                                    </draggable>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="14">
                        <div class="boxBorder">
                            <div class="boxHead">
                                <el-row>
                                    <el-col :span="13">
                                        指标名称
                                        <span class="inputBox">
                                            <el-input v-model="eventName" placeholder="请输入内容" maxlength="20" size="mini"></el-input>
                                        </span>
                                    </el-col>
                                    <el-col :span="4">
                                        <div class="text-right powerBox">
                                            权重
                                            <el-switch
                                                v-model="weightIndex"
                                                active-color="#13ce66"
                                                class="powerInput"
                                                inactive-color="#ff4949">
                                            </el-switch>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="compositeTable">
                                <div class="drapBox">
                                    <draggable v-model="dragList" :options="dragToOptions" :move="onMove" element="div" class="list-group">
                                        <transition-group :name="'no'" tag="ul">
                                            <li v-for="(item, index) in dragList" :key="index">
                                                <div v-if="item.enable === 1" class="dragList">
                                                    <span class="inputSpan">
                                                        <i :class="[item.isPage === 1 ? 'icon-page' : 'icon-element']"></i>
                                                        {{ item.name }} {{ item.type === 1 ? '(android)' : (item.type === 2 ? '(ios)' : (item.type === 3 ? '(web)' : '' )) }}
                                                    </span>
                                                    <span v-if="item.selectList && item.selectList.length > 0" class="selectedSpan">
                                                        <el-select v-model="item.indexType" placeholder="请选择" size="mini" class="selected">
                                                            <el-option
                                                                v-for="item in item.selectList"
                                                                :key="item.value"
                                                                :label="item.label"
                                                                :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </span>
                                                    <span v-show="weightIndex" class="addSpan">x</span>
                                                    <input v-show="weightIndex" v-model="item.weight" class="numberSpan" @blur="dragListInputBlur(item.weight, index)">
                                                    <span class="delSpan" @click="deldrap(item, index)"><i class="el-icon-delete"></i></span>
                                                </div>
                                                <div v-else class="dragList">
                                                    <span class="inputMaxSpan">该指标已于{{ item.updateTime }}被删除</span>
                                                    <span class="delSpan" @click="deldrap(item, index)"><i class="el-icon-delete"></i></span>
                                                </div>
                                                <div v-if="dragList.length > 1 && index === 0" class="addLineFrist"></div>
                                                <div v-if="index > 0" class="addLine">
                                                    <div class="line"></div>
                                                    <div class="rowLine"></div>
                                                    <span class="addLineSelectSpan">
                                                        <el-select v-model="item.symbolType" placeholder="" size="mini" class="selected miniSelected">
                                                            <el-option
                                                                v-for="item in typeAdd"
                                                                :key="item.value"
                                                                :label="item.label"
                                                                :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </span>
                                                </div>
                                            </li>
                                        </transition-group>
                                    </draggable>
                                    <div v-show="dragList.length <= 0" class="noDataText">拖拽多个指标至此，可做加减法运算</div>
                                </div>
                                <div class="addBox">
                                    <el-select v-model="symbolType" placeholder="" size="mini" class="selected miniSelected">
                                        <el-option
                                            v-for="item in typeDivide"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="drapBox">
                                    <draggable v-model="dragListD" :options="dragToOptionsD" :move="onMove" element="div" class="list-group">
                                        <transition-group :name="'no'" tag="ul">
                                            <li v-for="(item, index) in dragListD" :key="index">
                                                <div v-if="item.enable === 1" class="dragList">
                                                    <span class="inputSpan">
                                                        <i :class="[item.isPage === 1 ? 'icon-page' : 'icon-element']"></i>
                                                        {{ item.name }} {{ item.type === 1 ? '(android)' : (item.type === 2 ? '(ios)' : (item.type === 3 ? '(web)' : '' )) }}
                                                    </span>
                                                    <span v-if="item.selectList && item.selectList.length > 0" class="selectedSpan">
                                                        <el-select v-model="item.indexType" placeholder="请选择" size="mini" class="selected">
                                                            <el-option
                                                                v-for="item in item.selectList"
                                                                :key="item.value"
                                                                :label="item.label"
                                                                :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </span>
                                                    <span v-show="weightIndex" class="addSpan">x</span>
                                                    <input v-show="weightIndex" v-model="item.weight" class="numberSpan" @blur="dragListDInputBlur(item.weight, index)">
                                                    <span class="delSpan" @click="deldrapD(item, index)"><i class="el-icon-delete"></i></span>
                                                </div>
                                                <div v-else class="dragList">
                                                    <span class="inputMaxSpan">该指标已于{{ item.updateTime }}被删除</span>
                                                    <span class="delSpan" @click="deldrapD(item, index)"><i class="el-icon-delete"></i></span>
                                                </div>
                                                <div v-if="dragListD.length > 1 && index === 0" class="addLineFrist"></div>
                                                <div v-if="index > 0" class="addLine">
                                                    <div class="line"></div>
                                                    <div class="rowLine"></div>
                                                    <span class="addLineSelectSpan">
                                                        <el-select v-model="item.symbolType" placeholder="" size="mini" class="selected miniSelected">
                                                            <el-option
                                                                v-for="item in typeAdd"
                                                                :key="item.value"
                                                                :label="item.label"
                                                                :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </span>
                                                </div>
                                            </li>
                                        </transition-group>
                                    </draggable>
                                    <div v-show="dragListD.length <= 0" class="noDataText">拖拽多个指标至此，可做加减法运算</div>
                                </div>

                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSaveComposite">取 消</el-button>
                <el-button type="primary" @click="saveComposite">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {mapActions, mapState} from 'vuex'
import * as Select from '../../constants/composite'
export default {
    name: 'CompositeIndexCreate',
    components: { draggable },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        editId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            weightIndex: false,
            dialogVisible: false,
            selectOsTypeValue: '0',
            selectPageValue: '2',
            insertValue: '',
            symbolType: 1,
            pageList: [{
                value: '2',
                label: '全部类型'
            }, {
                value: '1',
                label: '页面'
            }, {
                value: '0',
                label: '元素'
            }],
            osType: [{
                value: '0',
                label: '全部平台'
            }, {
                value: '1',
                label: 'Android'
            }, {
                value: '2',
                label: 'iOS'
            }, {
                value: '3',
                label: 'web'
            }],
            dragList: [],
            dragListD: [],
            typeAdd: [
                {
                    value: 1,
                    label: '+'
                }, {
                    value: 2,
                    label: '-'
                }
            ],
            typeDivide: [
                {
                    value: 1,
                    label: 'X'
                }, {
                    value: 2,
                    label: '/'
                }
            ],
            eventName: '',
            filterValue: '',
            sortworld: ''
        }
    },
    computed: {
        ...mapState({
            compositeList: ({dimevent}) => dimevent.compositeIndexList,
            // 获取app ID
            appId: ({root}) => root.appId
        }),
        filterData: {
            get(e) {
                let filter = []
                if (this.filterValue === '') {
                    filter = this.compositeList.result
                } else {
                    filter = this.compositeList.result.filter(item => {
                        if (item.name.indexOf(this.filterValue) >= 0 || item.userName.indexOf(this.filterValue) >= 0) {
                            return item
                        }
                    })
                }
                console.log(this.compositeList)
                return filter
            },
            set(newObject) {
                return newObject
            }
        },
        dragFromOptions () {
            return {
                animation: 0,
                group: {
                    name: 'composite',
                    pull: 'clone',
                    put: false
                },
                disabled: false,
                sort: true,
                ghostClass: 'ghost'
            }
        },
        dragToOptions () {
            return {
                animation: 0,
                group: {
                    name: 'composite',
                    pull: false,
                    put: !(this.dragList && this.dragList.length > 4)
                },
                disabled: false,
                ghostClass: 'ghost'
            }
        },
        dragToOptionsD () {
            return {
                animation: 0,
                group: {
                    name: 'composite',
                    pull: false,
                    put: !(this.dragListD && this.dragListD.length > 4)
                },
                disabled: false,
                ghostClass: 'ghost'
            }
        }
    },
    watch: {
        isShow(value, oldValue) {
            this.dialogVisible = value
        },
        dialogVisible(value, oldValue) {
            if (!value) {
                this.$emit('noneshow', value)
            }
        },
        editId(value, olde) {
            // 条件重置
            this.dragList = []
            this.dragListD = []
            this.weightIndex = false
            this.eventName = ''
            if (value) {
                this.getCompositeInfo()
            }
        }
    },
    mounted() {
        this.compositeGetIndexListAction({appId: this.appId, type: 0, isPage: 2})
    },
    methods: {
        dragListInputBlur(weight, index) {
            let weightValue = parseInt(weight) > 0 ? parseInt(weight) : 1
            this.dragList[index]['weight'] = weightValue
        },
        dragListDInputBlur(weight, index) {
            let weightValue = parseInt(weight) > 0 ? parseInt(weight) : 1
            this.dragListD[index]['weight'] = weightValue
        },
        getCompositeInfo() {
            // 查询复合条件
            this.compositeQueryMultiIndexListAction({id: this.editId}).then(res => {
                this.eventName = res.name
                this.symbolType = res.symbolType
                this.weightIndex = res.weight === 1
                res.firstData.forEach(item => {
                    let selectList = []
                    if (item.isComplex === 0) {
                        if (item.isPage === 1) {
                            // 页面
                            selectList = Select.pageSelectList
                        } else {
                            // 元素
                            selectList = Select.elementSelectList
                        }
                    }
                    let firstItem = {
                        name: item.selectName,
                        selectId: item.selectId,
                        indexType: item.indexType,
                        selectList: selectList,
                        symbolType: item.symbolType,
                        weight: item.weight,
                        isPage: item.isPage,
                        enable: item.enable,
                        updateTime: item.updateTime
                    }
                    this.dragList.push(firstItem)
                })
                res.secondData.forEach(item => {
                    let selectList = []
                    if (item.isComplex === 0) {
                        if (item.isPage === 1) {
                            // 页面
                            selectList = Select.pageSelectList
                        } else {
                            // 元素
                            selectList = Select.elementSelectList
                        }
                    }
                    let secondItem = {
                        name: item.selectName,
                        selectId: item.selectId,
                        indexType: item.indexType,
                        selectList: selectList,
                        symbolType: item.symbolType,
                        weight: item.weight,
                        isPage: item.isPage,
                        enable: item.enable,
                        updateTime: item.updateTime
                    }
                    this.dragListD.push(secondItem)
                })
            })
        },
        sortInfo(t) {
            // 数据的排序 默认是倒序的样式
            if (t === this.sortworld) {
                // 如果排序字段和参数相同，则为该字段正序排列，并且排序字段为空
                // 降序
                this.filterData.sort((a, b) => {
                    // localeCompare() 方法提供的比较字符串的方法，考虑了默认的本地排序规则
                    return b[t].localeCompare(a[t])
                })
                this.sortworld = ''
            } else {
                // 升序
                this.filterData.sort((a, b) => {
                    return a[t].localeCompare(b[t])
                })
                this.sortworld = t
            }
        },
        filterDataAction () {
            // 搜索过滤数据
            this.filterValue = this.insertValue
        },
        selectPageValueChange (page) { // 选择Page改变是触发事件
            this.compositeGetIndexListAction({appId: this.appId, type: this.selectOsTypeValue, isPage: page})
        },
        selectTypeValueChange(type) {
            this.compositeGetIndexListAction({appId: this.appId, type: type, isPage: this.selectPageValue})
        },
        onMove ({relatedContext, draggedContext}) {
            // const relatedElement = relatedContext.element
            // const draggedElement = draggedContext.element
            // return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        },
        cloneElement(el) {
            // 解联动 deep clone 在拖动的一方
            let selectList = []
            let indexType = 0
            if (el.isComplex === 0) {
                indexType = el.isPage === 1 ? 1 : 2
                if (el.isPage === 1) {
                    // 页面
                    selectList = Select.pageSelectList
                } else {
                    // 元素
                    selectList = Select.elementSelectList
                }
            }

            let item = {
                name: el.name,
                selectId: el.id,
                indexType: indexType,
                type: el.type,
                selectList: selectList,
                symbolType: 1,
                weight: 1,
                isPage: el.isPage,
                enable: el.enable,
                updateTime: el.updateTime
            }
            return item
        },
        deldrap(item, index) {
            // 删除拖入被除数的item
            this.dragList.splice(index, 1)
        },
        deldrapD(item, index) {
            // 删除除数的
            this.dragListD.splice(index, 1)
        },
        cancelSaveComposite() {
            this.dialogVisible = false
        },
        saveComposite() {
            // 保存创建的和修改的指标
            if (this.eventName === '') {
                this.$message.warning('指标名称未填写')
                return
            }
            if (this.dragList.length <= 0 && this.dragListD <= 0) {
                this.$message.warning('运算指标不能未空')
                return
            }
            let firstData = []
            let secondData = []
            this.dragList.forEach((item, i) => {
                firstData.push({
                    symbolType: i === 0 ? '' : item.symbolType,
                    selectId: item.selectId,
                    indexType: item.indexType,
                    weight: this.weightIndex ? item.weight : 1,
                    isPage: item.isPage
                })
            })
            this.dragListD.forEach((item, i) => {
                secondData.push({
                    symbolType: i === 0 ? '' : item.symbolType,
                    selectId: item.selectId,
                    indexType: item.indexType,
                    weight: this.weightIndex ? item.weight : 1,
                    isPage: item.isPage
                })
            })
            let params = {
                appId: this.appId,
                eventName: this.eventName,
                symbolType: this.symbolType,
                firstData: JSON.stringify(firstData),
                secondData: JSON.stringify(secondData),
                weight: this.weightIndex ? 1 : 0
            }
            // console.log(params)
            if (this.editId) {
                // id 存在是编辑
                params.id = this.editId
                this.compositeUpdateMultiIndexListAction(params).then(res => {
                    // console.log(res)
                    this.$alerts({
                        type: 'success',
                        content: res.msg
                    })
                    this.$emit('addSuccess')
                    // 数据清空处理
                    this.dragList = []
                    this.dragListD = []
                    this.eventName = ''
                    this.weightIndex = false
                    this.dialogVisible = false
                })
            } else {
                // id 不存在是新建
                this.compositeCreateMultiIndexListAction(params).then(res => {
                    // console.log(res)
                    this.$alerts({
                        type: 'success',
                        content: res.msg
                    })
                    this.$emit('addSuccess')
                    this.dragList = []
                    this.dragListD = []
                    this.eventName = ''
                    this.weightIndex = false
                    this.dialogVisible = false
                })
            }
        },
        setTitleName() {
            return this.editId ? '编辑复合指标' : '新建复合指标'
        },
        ...mapActions(['compositeGetIndexListAction', 'compositeCreateMultiIndexListAction', 'compositeQueryMultiIndexListAction', 'compositeUpdateMultiIndexListAction'])
    }
}
</script>

<style scoped lang="scss">
    .list-group{
        position: relative;
        z-index: 2;
        ul{
            min-height: 113px;
        }
    }
.createBox{
    padding: 0 19px;
    .boxBorder{
        border: 1px solid #E3EAF0;
        .boxHead{
            padding: 19px 10px 10px
        }
        .boxHead{
            .inputBox{
                margin-left: 10px;
                display: inline-block;
                width: 200px;
            }
            .text-right{
                text-align: right;
                .sureBtn{
                    width: 100px;
                }
            }
            .powerBox{
                position: relative;
                top: 4px;
                .powerInput{
                    margin-left: 10px;
                }
            }
        }
        .compositeTable{
            padding-top: 20px;
            .tableHead{
                background-color: #F7F7FA;
                padding: 10px 15px;
                font-size: 14px;
                color: #3392FF;
                .icon-sort-desc{
                    background: url("../../layouts/images/icon/icon-down-blue.png") no-repeat center;
                }
                .icon-sort-asc{
                    background: url("../../layouts/images/icon/icon-up-blue.png") no-repeat center;
                }
                .icon-sort{
                    display: inline-block;
                    background-size: contain;
                    height: 12px;
                    width: 9px;
                    margin-left: 5px;
                    cursor: pointer;
                }
            }
            .tableBody{
                height: 311px;
                overflow-y: auto;
                .tableList{
                    padding: 15px;
                    font-size: 12px;
                    cursor: pointer;
                    .el-col{
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .drapBox{
                background-color: #F7F7FA;
                min-height: 113px;
                margin: 0 20px;
                padding-bottom: 20px;
                position: relative;
                font-size: 12px;
                ul{
                    padding-top: 1px;
                    li{
                        position: relative;
                        margin-top: 20px;
                        .dragList{
                            position: relative;
                            z-index: 3;
                            padding: 0;
                            span{
                                height: 26px;
                                display: inline-block;
                            }
                            .inputSpan{
                                width: 140px;
                                border: 1px solid #C2D3E0;
                                line-height: 26px;
                                padding: 0 10px;
                                margin-left: 60px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                margin-top: -7px;
                                position: relative;
                                top: 8px;
                            }
                            .inputMaxSpan{
                                border: 1px solid #C2D3E0;
                                line-height: 26px;
                                padding: 0 10px;
                                margin-left: 60px;
                                color: #f66254;
                            }
                            .selectedSpan{
                                width: 108px;
                                position: relative;
                                top: -2px;
                                margin-left: 8px;
                            }
                            .addSpan{
                                width: 40px;
                                text-align: center;
                                line-height: 26px;
                            }
                            .numberSpan{
                                width: 64px;
                                border: 1px solid #C2D3E0;
                                background: #ffffff;
                                line-height: 26px;
                                text-align: center;
                            }
                            .delSpan{
                                width: 16px;
                                font-size: 16px;
                                float: right;
                                margin-right: 20px;
                            }
                        }
                        .addLineFrist{
                            border-top: 1px solid;
                            width: 31px;
                            position: absolute;
                            top: 50%;
                            left: 29px;
                        }
                        .addLine{
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            z-index: 1;
                            .line{
                                border-top: 1px solid;
                                width: 31px;
                                position: absolute;
                                top: 50%;
                                left: 29px;
                            }
                            .rowLine{
                                height: 48px;
                                border-left: 1px solid;
                                position: absolute;
                                top: -33px;
                                left: 29px;
                            }
                            .addLineSelectSpan{
                                display: inline-block;
                                width: 40px;
                                position: absolute;
                                top: -22px;
                                left: 10px;
                            }
                        }
                    }
                }
                .noDataText{
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
                    font-size: 16px;
                    color: #5A6D82;
                    text-align: center;
                    padding: 45px 0;
                }
            }
            .addBox{
                margin: 20px 0;
                text-align: center;
            }
        }
    }
}

.icon-page {
    margin-top: -1px;
    display: inline-block;
    width: 21px;
    height: 17px;
    background: url("~/layouts/images/icon/icon-scan.png") no-repeat center;
    background-size: contain;
    vertical-align: middle;
}
.icon-element {
    margin-top: -1px;
    display: inline-block;
    width: 18px;
    height: 22px;
    background: url("~/layouts/images/icon/icon-click.png") no-repeat center;
    background-size: contain;
    vertical-align: middle;
}

</style>
