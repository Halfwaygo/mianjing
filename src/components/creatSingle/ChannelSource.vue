<template>
    <div class="setting">
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
                            :placeholder="`搜索${ placeString }`"
                            size="small"
                            class="insert-search">
                            <i slot="suffix" size="mini" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <div class="search-end">
                        <div class="targetChooseBox" >
                            <ul>
                                <li v-for="(item, index) in channelList" :key="index">
                                    <input v-model="singleChoosValue" type="radio" size="mini" name="target" class="checkLi" @change="changeTargetType(item, index)"/>
                                    <div :class="{'checked': item.isCheck}" class="targetInfoList" >
                                        <span class="iconBox"><i class="el-icon-check"></i></span>
                                        <span>{{ item.name }}</span>
                                        <span v-if="item.describe" class="describeText" style="float: right">
                                            <el-tooltip class="item" placement="right" effect="dark">
                                                <div slot="content">{{ item.describe }}</div>
                                                <i class="el-icon-question"></i>
                                            </el-tooltip>
                                        </span>
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
                        <i :class="iconClass"></i>
                    </span>
                    <div class="inputBox">
                        <el-input
                            v-popover:popoverEvent
                            v-model="singleChoosValue"
                            :placeholder="`请选择${ placeString }`"
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
import {mapActions, mapState} from 'vuex'
export default {
    name: 'ChannelSource',
    props: {
        channelSourceList: {
            type: Array,
            default: () => {
                return []
            }
        },
        sourceType: {
            type: String,
            default: 'channels'
        },
        name: {
            type: String,
            default: '1.选择渠道来源'
        },
        placeString: {
            type: String,
            default: '渠道来源'
        },
        iconClass: {
            type: String,
            default: 'icon-tree'
        },
        defaultdata: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShow: false,
            isChoosed: false,
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
            channelList: [],
            singleChoosValue: '',
            defaultSelected: '',
            historyDefaultSelected: []
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId,
            channelListItem: ({graph}) => graph.channelList
        }),
        editChannelId () {
            return this.$route.query.editid
        }
    },
    watch: {
        insertValue(newVal, oldVal) {
            let filter = []
            // 筛选条件置空
            if (newVal !== '') {
                this.channelListItem.result.filter(item => {
                    if (item.name.indexOf(newVal) >= 0) {
                        filter.push(item)
                    }
                })
            } else {
                filter = this.channelListItem.result
            }
            if (this.defaultSelected !== '') {
                this.channelListItem.result[this.defaultSelected]['isCheck'] = 0
            }
            this.channelList = filter
        },
        defaultdata(vale, old) {
            if (this.sourceType === 'clusters') {
                // 维度里面没有ID参数 和ischeck字段的选中结果
                this.channelList.forEach(res => {
                    if (vale === res.id) {
                        this.singleChoosValue = res.name
                        res.isCheck = true
                    }
                })
            }
        }
    },
    mounted() {
        // 初始化数据
        this.$nextTick(() => {
            // channelListItem
            let source = {
                channels: 'graphGetChannelListAction',
                clusters: 'dimensionGetInfoAction'
            }
            //  渠道号列表  editchannelid存在state里 在编辑和查看的时候用到
            this[source[this.sourceType]]({appid: this.appId, id: this.editChannelId}).then(() => {
                let result = this.channelListItem.result
                this.channelList = result
                this.historyDefaultSelected = result
                // 检测初始化的数据选中
                this.defaultCheckd()
            })
            // this.channelList = this.channelSourceList
        })
    },
    methods: {
        defaultCheckd() {
            this.channelList.map((item, i) => {
                if (item.isCheck) {
                    this.defaultSelected = i
                    this.singleChoosValue = item.name
                    this.$emit('singleinfo', item)
                }
            })
        },
        changeTargetType(item, i) {
            this.isChoosed = false
            this.channelList.forEach((item, k) => {
                item.isCheck = 0
                if (i === k) {
                    item.isCheck = 1
                    this.defaultSelected = i
                    this.singleChoosValue = item.name
                    this.$emit('singleinfo', item)
                }
            })
        },
        ...mapActions(['graphGetChannelListAction', 'dimensionGetInfoAction'])
    }
}
</script>

<style lang="scss">
    @import "../../layouts/css/createSingle/create";
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
        background: url("/layouts/images/icon/icon-tree.png") no-repeat center;
        background-size: contain;
    }
    .icon-network{
        display: inline-block;
        width: 20px;
        height: 18px;
        background: url("/layouts/images/icon/icon-network.png") no-repeat center;
        background-size: contain;
    }
</style>
