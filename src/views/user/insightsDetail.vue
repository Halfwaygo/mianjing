<template>
    <div class="insights-section">
        <div class="back-btn">
            <router-link :to="'/insights'">
                <el-button>返回用户细查列表</el-button>
            </router-link>
        </div>
        <div class="event-type clearfix">
            <el-row :gutter="24">
                <el-col :span="17">
                    <el-button-group class="topBtnGroup">
                        <el-button v-for="(item, i) in lists" :key="i" :type="item.isPrimary" size="mini" @click="clickEventType(item)">{{ item.title }}</el-button>
                    </el-button-group>
                    <date-picker :get-cyclce="defaultTime" class="date" @getDateValue="getDateInfo"></date-picker>
                </el-col>
            </el-row>
        </div>
        <div class="insights-detail">
            <el-row :gutter="30">
                <el-col :span="17" class="insights-detail-el-col">
                    <div class="detail-card">
                        <el-table
                            :data="tableData"
                            :row-key="getRowKeys"
                            :expand-row-keys="expands"
                            :show-header="false"
                            @row-click="toggleRowExpansion">
                            <el-table-column
                                width="30">
                                <template slot-scope="scope">
                                    <i class="icon-time"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="beginDate"
                                width="85">
                            </el-table-column>
                            <el-table-column
                                prop="beginTime">
                            </el-table-column>
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <div class="visit-btn" style="margin-bottom:20px;">访问开始</div>
                                    <div v-for="(item, index) in props.row.detail" :key="index" class="detail-item">
                                        <div class="item-icon"><i :class="[item.isPage === 1 ? 'icon-page' : 'icon-element']"></i></div>
                                        <div class="item-type">{{ item.isPage === 1 ? '页面浏览' : '点击' }}</div>
                                        <div class="item-name">{{ item.isPage === 1 ? '页面' : '按钮' }}:{{ item.name }}</div>
                                        <div class="item-time">{{ item.time }}</div>
                                    </div>
                                    <div class="visit-btn">访问结束</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="7" class="insights-detail-el-col">
                    <el-row style="margin-bottom:24px;">
                        <el-col :span="22">
                            <div class="detail-card user-info">
                                <div class="clearfix">
                                    <div class="user-info-avatar"><img src="../../layouts/images/default-avatar.png"></div>
                                    <div class="user-info-city">
                                        <div>地区：中国，北京</div>
                                        <div>ID： 00000000-0000-0000-0000</div>
                                    </div>
                                </div>
                                <div class="user-info-item">近30天访问次数：15</div>
                                <div class="user-info-item">最近来访时间： 2018-05-28</div>
                                <div class="user-info-item">上次访问设备：Apple</div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <div class="detail-card event-detail">
                                <div class="event-detail-title">事件详情</div>
                                <div class="event-detail-item">地区：中国，北京</div>
                                <div class="event-detail-item">事件时间： 2018-03-30 09：30：30</div>
                                <div class="event-detail-item">设备品牌：OPPO</div>
                                <div class="event-detail-item">屏幕分辨率：1080*1920</div>
                                <div class="event-detail-item">操作系统：Android7.0</div>
                                <div class="event-detail-item">操作系统版本：223.104.212.126</div>
                                <div class="event-detail-item">IP：223.104.212.126</div>
                                <div class="event-detail-item">APP版本：V2.0.0</div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import WaterMark from '../../mixins/watermark'
import DatePicker from '../../components/datePicker.vue'
export default {
    name: 'insightsDetail',
    components: {
        DatePicker
    },
    mixins: [WaterMark],
    data () {
        return {
            eventType: 0,
            defaultTime: '',
            cyclceTime: 0,
            startTime: '',
            endTime: '',
            tableData: [
                {
                    id: 0,
                    beginDate: '2018-7-31',
                    beginTime: '08:00:00',
                    detail: [
                        {
                            isPage: 1,
                            name: '咪咕音乐首页',
                            time: '08:00:03'
                        },
                        {
                            isPage: 0,
                            name: '快捷播放',
                            time: '08:00:05'
                        },
                        {
                            isPage: 1,
                            name: '演唱会',
                            time: '08:00:07'
                        }
                    ]
                },
                {
                    id: 1,
                    beginDate: '2018-7-30',
                    beginTime: '08:00:00',
                    detail: [
                        {
                            isPage: 1,
                            name: '咪咕音乐首页',
                            time: '08:00:03'
                        },
                        {
                            isPage: 0,
                            name: '快捷播放',
                            time: '08:00:05'
                        },
                        {
                            isPage: 1,
                            name: '演唱会',
                            time: '08:00:07'
                        }
                    ]
                },
                {
                    id: 2,
                    beginDate: '2018-7-29',
                    beginTime: '08:00:00',
                    detail: [
                        {
                            isPage: 1,
                            name: '咪咕音乐首页',
                            time: '08:00:03'
                        },
                        {
                            isPage: 0,
                            name: '快捷播放',
                            time: '08:00:05'
                        },
                        {
                            isPage: 1,
                            name: '演唱会',
                            time: '08:00:07'
                        }
                    ]
                },
                {
                    id: 3,
                    beginDate: '2018-7-28',
                    beginTime: '08:00:00',
                    detail: [
                        {
                            isPage: 1,
                            name: '咪咕音乐首页',
                            time: '08:00:03'
                        },
                        {
                            isPage: 0,
                            name: '快捷播放',
                            time: '08:00:05'
                        },
                        {
                            isPage: 1,
                            name: '演唱会',
                            time: '08:00:07'
                        }
                    ]
                },
                {
                    id: 5,
                    beginDate: '2018-7-28',
                    beginTime: '08:00:00',
                    detail: [
                        {
                            isPage: 1,
                            name: '咪咕音乐首页',
                            time: '08:00:03'
                        },
                        {
                            isPage: 0,
                            name: '快捷播放',
                            time: '08:00:05'
                        },
                        {
                            isPage: 1,
                            name: '演唱会',
                            time: '08:00:07'
                        }
                    ]
                }
            ],
            // 获取row的key值
            getRowKeys(row) {
                return row.id
            },
            expands: [0]
        }
    },
    computed: {
        lists(v) {
            let listitem = [{title: '全部事件', type: 0, isPrimary: 'primary'},
                {title: '页面浏览', type: 1, isPrimary: ''},
                {title: '元素点击', type: 2, isPrimary: ''}]
            listitem.forEach(item => {
                if (item.type === this.eventType) {
                    item.isPrimary = 'primary'
                } else {
                    item.isPrimary = ''
                }
            })
            return listitem
        }
    },
    beforeMount() {
        this.waterMk()
    },
    methods: {
        clickEventType (item) {
            this.eventType = item.type
        },
        getDateInfo (t) {
            // 时间
            this.cyclceTime = t.circleTime
            this.startTime = t.startTime
            this.endTime = t.endTime
        },
        toggleRowExpansion (row) {
            if (this.expands.indexOf(row.id) > -1) {
                this.expands = []
            } else {
                this.expands = []
                this.expands.push(row.id)
            }
        }
    }
}

</script>

<style lang="scss">

.insights-section {
    color: #5A6D82;
    .back-btn{
        padding: 30px 25px;
        .el-button{
            color: #3392FF;
            border: 1px solid #3392FF;
        }
    }
    .event-type {
        padding-left: 25px;
        margin-bottom: 18px;
        .date {
            float: right;
        }
    }
    .insights-detail {
        padding-left: 25px;
        .detail-card {
            background-color: #F9FAFC;
            border: 1px solid #E5E5E5;
        }
        .el-table__row {
            background-color: #F9FAFC;
        }
        .el-table__expanded-cell  {
            background-color: #F9FAFC;
        }
        .icon-time {
            display: inline-block;
            width: 18px;
            height: 18px;
            background: url("~/layouts/images/icon/icon-time.png") no-repeat center;
            background-size: contain;
            vertical-align: middle;
            margin-top: -5px;
        }
        .visit-btn {
            width: 70px;
            height: 26px;
            line-height: 26px;
            color: white;
            text-align: center;
            background-color: rgba(51, 146, 255, 0.5);
            font-size: 12px;
        }
        .detail-item {
            margin-bottom: 20px;
            .icon-page {
                margin-top: -3px;
                display: inline-block;
                width: 21px;
                height: 17px;
                background: url("~/layouts/images/icon/icon-scan.png") no-repeat center;
                background-size: contain;
                vertical-align: middle;
            }
            .icon-element {
                margin-top: -3px;
                display: inline-block;
                width: 18px;
                height: 22px;
                background: url("~/layouts/images/icon/icon-click.png") no-repeat center;
                background-size: contain;
                vertical-align: middle;
            }
            .item-icon {
                width: 25px;
                margin-right: 20px;
                display: inline-block;
            }
            .item-type {
                width: 60px;
                margin-right: 60px;
                display: inline-block;
            }
            .item-name {
                display: inline-block;
            }
            .item-time {
                display: inline-block;
                float: right;
            }
        }
    }
    .user-info {
        padding: 17px 0 21px 28px;
        .user-info-avatar {
            float: left;
            img {
                width: 54px;
                height: 54px;
            }
        }
        .user-info-city {
            float: left;
            margin-left: 15px;
            div {
                margin-top: 6px;
            }
        }
        .user-info-item {
            margin-top: 12px;
        }
    }
    .event-detail {
        padding: 25px 0 50px 28px;
        .event-detail-title {
            font-size: 16px;
            margin-bottom: 18px;
        }
        .event-detail-item {
            margin-top: 12px;
        }
    }
}

.insights-detail-el-col {
    margin-bottom: 16px;
}

</style>
