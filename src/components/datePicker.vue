<template>
    <div class="date-picker" >
        <el-button icon="icon-date" class="btn-day" @click="getDateInfo">{{ selday }}</el-button>
        <div class="date-container">
            <el-date-picker
                v-model="selectedValue"
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                size="small"
                popper-class="amb_popper"
                value-format="yyyy/MM/dd"
                range-separator="-"
                start-placeholder="-"
                end-placeholder="-"
                @focus="datePickerFocus">
            </el-date-picker>
        </div>
    </div>
</template>

<script>
import changeDate from '../utils/changeDate'
/*
*  <date-picker @getDateValue="getDateInfo"></date-picker>使用方法
* */
let _this
export default {
    name: 'DatePicker',
    props: {
        getCyclce: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShow: false,
            selday: '昨日',
            isNotShowDate: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e7
                },
                shortcuts: [{
                    text: '昨日',
                    onClick(picker) {
                        let nowDate = new Date()
                        let t = new Date(nowDate.getTime() - 8.64e7)
                        let start = `${t.getFullYear()}/${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                        let t2 = new Date(nowDate.getTime() - 8.64e7)
                        let end = `${t2.getFullYear()}/${(t2.getMonth() + 1) < 10 ? ('0' + (t2.getMonth() + 1)) : t2.getMonth()}/${t2.getDate() < 10 ? ('0' + t2.getDate()) : t2.getDate()}`
                        _this.resetTitle(this.text)
                        picker.$emit('pick', [start, end, 1])
                    }
                }, {
                    text: '过去7天',
                    onClick(picker) {
                        let nowDate = new Date()
                        let t = new Date(nowDate.getTime() - 8.64e7)
                        let end = `${t.getFullYear()}/${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                        let t2 = new Date(nowDate.getTime() - 8.64e7 * 7)
                        let start = `${t2.getFullYear()}/${(t2.getMonth() + 1) < 10 ? ('0' + (t2.getMonth() + 1)) : t2.getMonth()}/${t2.getDate() < 10 ? ('0' + t2.getDate()) : t2.getDate()}`
                        _this.resetTitle(this.text)
                        picker.$emit('pick', [start, end, 7])
                    }
                }, {
                    text: '过去14天',
                    onClick(picker) {
                        let nowDate = new Date()
                        let t = new Date(nowDate.getTime() - 8.64e7)
                        let end = `${t.getFullYear()}/${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                        let t2 = new Date(nowDate.getTime() - 8.64e7 * 14)
                        let start = `${t2.getFullYear()}/${(t2.getMonth() + 1) < 10 ? ('0' + (t2.getMonth() + 1)) : t2.getMonth()}/${t2.getDate() < 10 ? ('0' + t2.getDate()) : t2.getDate()}`
                        _this.resetTitle(this.text)
                        picker.$emit('pick', [start, end, 14])
                    }
                }, {
                    text: '过去30天',
                    onClick(picker) {
                        let nowDate = new Date()
                        let t = new Date(nowDate.getTime() - 8.64e7)
                        let end = `${t.getFullYear()}/${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                        let t2 = new Date(nowDate.getTime() - 8.64e7 * 30)
                        let start = `${t2.getFullYear()}/${(t2.getMonth() + 1) < 10 ? ('0' + (t2.getMonth() + 1)) : t2.getMonth()}/${t2.getDate() < 10 ? ('0' + t2.getDate()) : t2.getDate()}`
                        _this.resetTitle(this.text)
                        picker.$emit('pick', [start, end, 30])
                    }
                }, {
                    text: '过去90天',
                    onClick(picker) {
                        let nowDate = new Date()
                        let t = new Date(nowDate.getTime() - 8.64e7)
                        let end = `${t.getFullYear()}/${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}/${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
                        let t2 = new Date(nowDate.getTime() - 8.64e7 * 90)
                        let start = `${t2.getFullYear()}/${(t2.getMonth() + 1) < 10 ? ('0' + (t2.getMonth() + 1)) : t2.getMonth()}/${t2.getDate() < 10 ? ('0' + t2.getDate()) : t2.getDate()}`
                        _this.resetTitle(this.text)
                        picker.$emit('pick', [start, end, 90])
                    }
                }]
            },
            selectedValue: ''
        }
    },

    computed: {
    },
    watch: {
        selectedValue(v) {
            let dateInfo = {
                startTime: '',
                endTime: '',
                comStartTime: '',
                comEndTime: '',
                countDay: 0,
                circleTime: 0
            }
            if (typeof (v[2]) === 'number') {
                dateInfo.circleTime = v[2]
            }
            if (!this.isNotShowDate) {
                this.selday = `${v[0]}-${v[1]}`
            }
            // 相差天数
            let dayNum = changeDate.getDayCount(v[0], v[1])
            dateInfo.countDay = Math.abs(dayNum + 1)
            // 开始时间
            dateInfo.startTime = v[0].replace(/\//g, '')
            // 结束时间
            dateInfo.endTime = v[1].replace(/\//g, '')
            // 对比的开始时间
            if (dayNum > 7) {
                let comStartTime = new Date(v[0]).getTime() - 8.64e7 * dayNum
                let changeComStartTime = changeDate.formDateTime(comStartTime)
                dateInfo.comStartTime = changeComStartTime
            } else {
                let comStartTime = new Date(v[0]).getTime() - 8.64e7 * 7
                let changeComStartTime = changeDate.formDateTime(comStartTime)
                dateInfo.comStartTime = changeComStartTime
            }

            // 对比的结束时间
            if (dayNum > 7) {
                let comEndTime = new Date(v[0]).getTime() - 8.64e7
                let changeComEndTime = changeDate.formDateTime(comEndTime)
                dateInfo.comEndTime = changeComEndTime
            } else {
                let comEndTime = new Date(v[1]).getTime() - 8.64e7 * 7
                let changeComEndTime = changeDate.formDateTime(comEndTime)
                dateInfo.comEndTime = changeComEndTime
            }
            console.log(dateInfo)
            this.$emit('getDateValue', dateInfo)
        },
        getCyclce(newVal, oldVal) {
            this.selday = newVal
        }
    },
    beforeMount() {
    },
    mounted() {
        _this = this
    },
    methods: {
        datePickerFocus() {
            this.isNotShowDate = false
        },
        resetTitle(text) {
            this.selday = text
            this.isNotShowDate = true
        },
        getDateInfo(v) {
            if (this.isShow) {
                this.isShow = false
            } else {
                document.getElementsByClassName('el-date-editor').item(0).click()
                this.isShow = true
            }
        }
    }
}
</script>

<style lang="scss">
$side-bar-width: 110px;
$date-body-width: 660px;
.date-picker{
    position: relative;
    .date-container{
        position: absolute;
        left: 40px;
        top: 0;
        width: 30px;
        height: 30px;
        overflow: hidden;
        z-index: -1;
        .draw_popper{
            background-color: #2db7f5;
        }
    }
}
    .icon-date{
        display: inline-block;
        width: 18px;
        height: 16px;
        background: url("../layouts/images/icon/icon-day.png") no-repeat center;
        background-size: contain;
        margin-right: 5px;
        position: relative;
        top: 3px
    }
    body .el-button.btn-day{
        padding: 4px 26px 8px;
        color: #3392FF;
        background: #F9FAFB;
    }
</style>
