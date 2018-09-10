<template>
    <div class="target-user">
        <div class="type-generate chart-type-operate">
            <el-popover
                ref="popoverEvent"
                v-model="isChoosed"
                placement="bottom"
                title=""
                width="358"
                trigger="click"
                popper-class="singleChoose"
                content="">
                <div class="targetPopover">
                    <div class="input-suffix">
                        <el-input
                            v-model="insertValue"
                            size="small"
                            class="insert-search"
                            placeholder="单图名称或创建人">
                            <i slot="suffix" size="mini" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <div class="search-end">
                        <div class="targetChooseBox" >
                            <ul>
                                <li v-for="info in searchArr" :key="info.id">
                                    <input v-model="singleChoosValue" :disabled="disable" type="radio" name="target" class="checkLi" @change="changeTargetType(info)"/>
                                    <div :class="{'checked': singleChoosValue === info.name}" class="targetInfoList" >
                                        <span class="iconBox"><i class="el-icon-check"></i></span>
                                        <span>{{ info.name }}</span>
                                        <!-- <span v-if="info.describe.length > 0" class="describeText" style="float: right">
                                            <el-tooltip class="item" placement="right" effect="dark">
                                                <div slot="content">{{ info.describe }}</div>

                                            </el-tooltip>
                                        </span> -->
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-popover>
            <div class="header">{{ name }}</div>
            <div class="event-icon">
                <div class="inputIconBox">
                    <span class="iconBox">
                        <i class="icon-tree"></i>
                    </span>
                    <div class="inputBox">
                        <el-input
                            v-popover:popoverEvent
                            v-model="singleChoosValue"
                            :disabled="true"
                            placeholder="请选择目标用户"
                            size="small"
                            suffix-icon="el-icon-arrow-down">
                        </el-input>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '../utils/api.js'
import { mapActions, mapState } from 'vuex'

export default {
    name: 'TargetCreate',
    props: {
        defaultInfo: {
            type: Object
        },
        name: {
            type: String,
            default: '1.选择渠道来源'
        },
        eventType: {
            type: String,
            default: ''
        },
        defaultSingleChoosValue: {
            type: String,
            default: ''
        },
        disable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isChoosed: false,
            isShow: false,
            options: [{
                value: 0,
                label: '全部类型'
            }, {
                value: 1,
                label: '预定义指标'
            }, {
                value: 2,
                label: '圈选指标'
            }, {
                value: 7,
                label: '复合指标'
            }],
            insertValue: '',
            selectValue: 0,
            targetTypeChooseList: {},
            searchArr: [],
            singleChoosValue: '',
            targetTypeList: []
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId,
            channelQueryGroupList: ({graph}) => graph.channelQueryGroupList
        })
    },
    watch: {
        insertValue(newVal, oldVal) {
            this.searchArr = []
            this.targetTypeList.forEach((item, index) => {
                if (item.name.indexOf(newVal) !== -1) {
                    this.searchArr.push(item)
                }
            })
        },
        defaultSingleChoosValue(newVal, oldVal) {
            this.singleChoosValue = newVal
        },
        disable(vale, old) {
            this.disable = vale
        }
    },
    mounted() {
        this.targetTypeList = this.searchArr = [{
            name: '全部用户',
            id: 0
        }]
        // if (this.eventType === 'funnel') {
        //     this.getFunnelUser()
        // } else if (this.eventType === 'event') {
        //     this.getEventUser()
        // } else if (this.eventType === 'retention') {
        //     this.getRetentionUser()
        // } else if (this.eventType === 'cluster') {
        //     this.getClusterUser()
        // } else if (this.eventType === 'channel') {
        //     this.getChannelUser()
        // }
        // 初始化数据
        this.targetTypeChooseList = this.defaultInfo || {}
        this.singleChoosValue = this.targetTypeChooseList.name ? this.targetTypeChooseList.name : ''
    },
    methods: {
        getChannelUser() {
            // 获取渠道分许的user
            this.graphGetChannelQueryGroupListAction({appid: this.appId, id: ''}).then(() => {
                this.targetTypeList = this.channelQueryGroupList.result.group2
                this.searchArr = this.channelQueryGroupList.result.group2
            })
        },
        getFunnelUser() {
            // 获取漏斗分析
            Api.graphGetFunnelQueryGroups({
                appId: this.appId,
                id: ''
            }).then((res) => {
                this.targetTypeList = res.group2
                this.searchArr = res.group2
            })
        },
        getEventUser() {
            // 获取事件分析的目标用户
            Api.graphQueryGroupEventMap({
                appId: this.appId,
                id: ''
            }).then((res) => {
                // 将预定义分群和自定义分群合并在同一个数组中
                this.targetTypeList = res.group2.concat(res.group1)
                this.searchArr = res.group2.concat(res.group1)
            })
        },
        getRetentionUser() {
            // 获取留存分析的目标用户
            Api.graphGetRetainQueryGroups({
                appId: this.appId,
                id: ''
            }).then((res) => {
                this.targetTypeList = res.group2
                this.searchArr = res.group2
            })
        },
        getClusterUser() {
            // 获取分群分析的目标用户
            Api.graphGetGroupQueryGroups({
                appId: this.appId,
                id: ''
            }).then((res) => {
                // 将预定义分群和自定义分群合并在同一个数组中
                this.targetTypeList = res.group2.concat(res.group1)
                this.searchArr = res.group2.concat(res.group1)
            })
        },
        changeTargetType(item) {
            this.isChoosed = false
            this.targetTypeChooseList = item
            this.singleChoosValue = item.name
            this.$emit('selectUser', this.targetTypeChooseList)
        },
        ...mapActions(['graphGetChannelQueryGroupListAction'])
    }
}
</script>

<style lang="scss">
    @import "../layouts/css/createSingle/create";
    .target-user {
        .inputIconBox{
            position: relative;
            .iconBox{
                display: inline-block;
                font-size: 18px;
                position: absolute;
                top: 5px;
                left: 24px;
                color: #6D7684;
            }
            .inputBox{
                .el-input__inner {
                  background-color: #fff;
                  cursor: pointer;
                  color: #5a6d82;
                }
                width: 358px;
                margin-left: 53px;
            }
        }
        .el-popper[x-placement^=bottom].singleChoose{
            margin-top: 0;
            border-radius: 0;
        }
        .icon-tree{
            display: inline-block;
            width: 20px;
            height: 18px;
            background: url("~/layouts/images/icon/icon-users.png") no-repeat center;
            background-size: contain;
        }
    }
</style>
