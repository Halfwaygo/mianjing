<template>
    <div class="insights-section">
        <div class="backBtn">
            <router-link :to="'/segmentations'">
                <el-button>返回分群列表</el-button>
            </router-link>
        </div>
        <div class="createItemBox">
            <el-row>
                <el-col :span="2">
                    <div class="title">分群名称:</div>
                </el-col>
                <el-col :span="22">
                    <div class="boxWidth">
                        <el-input v-model="name" maxlength="25" size="medium" placeholder="不超过25个字"></el-input>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="createItemBox">
            <el-row>
                <el-col :span="2">
                    <div class="title">时间选择：</div>
                </el-col>
                <el-col :span="22">
                    <date-picker :get-cyclce="defaultTime" @getDateValue="getDateInfo"></date-picker>
                </el-col>
            </el-row>
        </div>
        <div class="createItemBox">
            <el-row>
                <el-col :span="2">&nbsp;</el-col>
                <el-col :span="22">
                    <div class="">
                        <filter-creat :is-user="true" :selected-list-info="dimensionInfo" @selects="selectBox"></filter-creat>
                        <div class="and"><span>AND</span></div>
                        <index-user :selected-list-info="indexInfo" @selects="selectIndexBox"></index-user>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="createItemBox">
            <el-row class="btn-group">
                <el-col :span="2">&nbsp;</el-col>
                <el-col :span="22">
                    <el-button>取消</el-button>
                    <el-button type="primary" @click="saveSeg">保存</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import Api from '../../utils/api.js'
import { mapState } from 'vuex'
import WaterMark from '../../mixins/watermark'
import DatePicker from '../../components/datePicker.vue'
import FilterCreat from '../../components/creatSingle/FilterCreat'
import IndexUser from '../../components/creatSingle/indexUser'
import weekDate from '../../utils/changeDate'
export default {
    name: 'creatSeg',
    components: {
        DatePicker,
        FilterCreat,
        IndexUser
    },
    mixins: [WaterMark],
    data () {
        return {
            defaultTime: '',
            name: '',
            cyclceTime: 0,
            startTime: '',
            endTime: '',
            dimensionInfo: {
                conditionType: '',
                allList: []
            },
            indexInfo: {
                conditionType: '',
                allList: []
            },
            id: this.$route.query.id || ''
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    beforeMount() {
        this.waterMk()
    },
    mounted () {
        if (this.id) {
            Api.queryUserGroupInfo({ id: this.id }).then(res => {
                this.name = res.name
                this.startTime = res.startTime.substring(0, 10).replace(/-/g, '')
                this.endTime = res.endTime.substring(0, 10).replace(/-/g, '')
                this.cyclceTime = res.cyclceTime
                this.defaultTime = res.cyclceTime > 0 ? (res.cyclceTime === 1 ? '昨天' : `过去${res.cyclceTime}天`) : res.startTime.substring(0, 10).replace(/-/g, '/') + '-' + res.endTime.substring(0, 10).replace(/-/g, '/')
                let allItem = []
                res.dimensions.forEach(item => {
                    let list = {
                        fieldId: item.fieldId,
                        value: item.value,
                        type: item.type
                    }
                    allItem.push(list)
                })
                this.dimensionInfo = {
                    conditionType: parseInt(res.dimensionType) === 1 ? 'OR' : 'AND',
                    allList: allItem
                }
                this.indexInfo = {
                    conditionType: parseInt(res.indexType) === 1 ? 'OR' : 'AND',
                    allList: res.indexs
                }
            })
        } else {
            // 新建的时候默认是昨天
            let t = weekDate.getYesterday()
            this.startTime = this.startTime ? this.startTime : t[1]
            this.endTime = this.endTime ? this.endTime : t[1]
            this.cyclceTime = 1
        }
    },
    methods: {
        getDateInfo(t) {
            // 时间
            this.cyclceTime = t.circleTime
            this.startTime = t.startTime
            this.endTime = t.endTime
        },
        selectBox(t) {
            // 维度
            this.dimensionInfo = t
        },
        selectIndexBox(t) {
            // 指标
            this.indexInfo = t
        },
        saveSeg() {
            if (this.name === '') {
                this.$message.warning('请填写名称')
                return
            }
            if (this.dimensionInfo.allList.length <= 0 || JSON.stringify(this.dimensionInfo.allList).indexOf('""') !== -1) {
                this.$message.warning('维度条件请填全')
                return
            }
            if (this.indexInfo.allList.length <= 0 || JSON.stringify(this.indexInfo.allList).indexOf('""') !== -1) {
                this.$message.warning('指标条件请填全')
                return
            }
            let param = {
                appId: this.appId,
                name: this.name,
                cyclceTime: this.cyclceTime,
                startTime: this.startTime,
                endTime: this.endTime,
                dimensionType: this.dimensionInfo.conditionType === 'AND' ? 0 : 1,
                dimensions: JSON.stringify(this.dimensionInfo.allList),
                indexType: this.indexInfo.conditionType === 'AND' ? 0 : 1,
                indexs: JSON.stringify(this.indexInfo.allList)
            }
            if (this.id) {
                // id 存在为修改
                param.id = this.id
                Api.updateUserGroupInfo(param).then(res => {
                    this.$alerts({
                        type: 'success',
                        content: res.msg
                    })
                    this.$router.push({path: `/segmentations`})
                })
            } else {
                // 创建用户分群
                Api.addUserGroupInfo(param).then(res => {
                    this.$alerts({
                        type: 'success',
                        content: res.msg
                    })
                    this.$router.push({path: `/segmentations`})
                })
            }
        }
    }
}
</script>

<style lang="scss">
    .insights-section{
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #FFFFFF;
        overflow: auto;
    }
    .boxWidth{
        width: 480px;
    }
    .backBtn{
        padding: 30px 25px;
        .el-button{
            color: #3392FF;
            border: 1px solid #3392FF;
        }
    }
    .createItemBox{
        margin-bottom: 20px;
        .title{
            line-height: 36px;
            text-align: right;
            padding-right: 20px;
            font-size: 16px;
            color: #5A6D82;
        }
        .el-col-2{
            width: 112px;
        }
        .and{
            height: 57px;
            line-height: 57px;
            font-size: 16px;
            color: #5A6D82;
            text-align: center;
            width: 804px;
            position: relative;
            span{
                background: #ffffff;
                position: relative;
                z-index: 2;
            }
            &:after{
                content: '';
                height: 57px;
                border-left: 1px solid rgba(194,211,224,0.7);
                position: absolute;
                display: block;
                top: 0;
                left: 50%;

            }
        }
        .footer{
            padding: 0 25px 30px;
            text-align: right;
        }
        .btn-group {
            margin-top: 29px;
            .el-button {
                margin-right: 30px;
                width: 100px;
            }
        }
    }
</style>
