<template>
    <div class="tableBox">
        <div class="flex-table-left">
            <table cellpadding="0" cellspacing="0" >
                <thead>
                    <tr>
                        <th class="bigw" width="137px"> </th>
                        <th class="smalw" width="104px">用户量</th>
                        <th v-for="(item , index) in tableDataMore" :key="index" width="106px">{{ formatterHeader(index) }}</th>
                        <th class="none"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tr in tableDataFr" :key="tr.allUser">
                        <td class="bigw" width="137">
                            <div class="boldText" @click="showAll()">{{ tr.allUser }} <i :class="{ 'el-icon-arrow-down':isShowAll , 'el-icon-arrow-right':!isShowAll}"></i></div>
                        </td>
                        <td class="smalw" width="104">
                            <el-tooltip :content="formatterTotalCount(tr)" class="item" effect="dark" placement="top">
                                <div>{{ tr.userNum }}</div>
                            </el-tooltip>
                        </td>
                        <td v-for="(num, index) in tr.dataNum" :key="index" :class="{'noborder' : num.ratio===''}" width="106">
                            <el-tooltip class="item" effect="dark" content="Top Center3 提示文字" placement="top">
                                <div :class="num.colorBox" class="fillBox" >
                                    <div class="pre">{{ num.ratio }}</div>
                                    <div class="num">{{ num.countNum }}</div>
                                </div>
                            </el-tooltip>
                        </td>
                        <td class="none"></td>
                    </tr>
                    <tr v-for="(tr, index) in tableDataMore" v-show="isShowAll" :key="index">
                        <td class="bigw" width="137">
                            <div>{{ tr.allUser }}</div>
                        </td>
                        <td class="smalw" width="104">
                            <el-tooltip :content="formatterUserCount(tr)" class="item" effect="dark" placement="top">
                                <div>{{ tr.userNum }}</div>
                            </el-tooltip>
                        </td>
                        <td v-for="(num, index) in tr.dataNum" :key="index" :class="{'noborder' : num.ratio===''}" width="106">
                            <el-tooltip class="item" effect="dark" content="Top Center 1提示文字" placement="top">
                                <div :class="num.colorBox" class="fillBox" >
                                    <div class="pre">{{ num.ratio }}</div>
                                    <div class="num">{{ num.countNum }}</div>
                                </div>
                            </el-tooltip>
                        </td>
                        <td class="none"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="flex-table">
            <table cellpadding="0" cellspacing="0" >
                <thead>
                    <tr>
                        <th class="bigw" width="137px"> </th>
                        <th class="smalw" width="104px">用户量</th>
                        <th v-for="(item , index) in tableDataMore" :key="index" width="106px">{{ formatterHeader(index) }}</th>
                        <th class="none"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tr in tableDataFr" :key="tr.allUser">
                        <td class="bigw" width="137">
                            <div @click="showAll()">{{ tr.allUser }} <i :class="{ 'el-icon-arrow-down':isShowAll , 'el-icon-arrow-right':!isShowAll}"></i></div>
                        </td>
                        <td class="smalw" width="104">
                            <el-tooltip class="item" effect="dark" content="Top Center 提示9文字" placement="top">
                                <div>{{ tr.userNum }}</div>
                            </el-tooltip>
                        </td>
                        <td v-for="(num, index) in tr.dataNum" :key="index" :class="{'noborder' : num.ratio===''}" width="106">
                            <el-tooltip v-show="num.ratio" :content="formatterPercentCount(index, num)" class="item" effect="dark" placement="top">
                                <div :class="num.colorBox" class="fillBox" >
                                    <div class="pre">{{ num.ratio }}</div>
                                    <div class="num">{{ num.countNum }}</div>
                                </div>
                            </el-tooltip>
                        </td>
                        <td class="none"></td>
                    </tr>
                    <tr v-for="(tr, index) in tableDataMore" v-show="isShowAll" :key="index">
                        <td class="bigw" width="137">
                            <div>{{ tr.allUser }}</div>
                        </td>
                        <td class="smalw" width="104">
                            <el-tooltip class="item" effect="dark" content="Top Cen1ter 提示文字" placement="top">
                                <div>{{ tr.userNum }}</div>
                            </el-tooltip>
                        </td>
                        <td v-for="(num, index) in tr.dataNum" :key="index" :class="{'noborder' : num.ratio===''}" width="106">
                            <el-tooltip v-show="num.ratio" :content="formatterPerUnitCount(index, tr.dataNum[0], num)" class="item" effect="dark" placement="top">
                                <div :class="num.colorBox" class="fillBox" >
                                    <div class="pre">{{ num.ratio }}</div>
                                    <div class="num">{{ num.countNum }}</div>
                                </div>
                            </el-tooltip>
                        </td>
                        <td class="none"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DetailChart',
    props: {
        tableData: {
            type: Array
        },
        cycle: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            isShowAll: true,
            tableDataFr: [],
            tableDataMore: []
        }
    },
    watch: {
        tableData() {
            this.initData()
        }
    },
    beforeMount() {
    },
    mounted() {
    },
    methods: {
        initData() {
            for (let i = 0; i < this.tableData.length; i++) {
                let res = this.tableData[i]
                if (i === 0) {
                    this.tableDataFr = []
                    this.tableDataFr.push(this.tableData[i])
                }
                for (let j = 0; j < res.dataNum.length; j++) {
                    let num = res.dataNum[j]
                    let numInt = parseInt(num.ratio.substring(0, num.ratio.length - 1))
                    num.colorBox = numInt >= 80 ? 'col1' : (numInt >= 60 ? 'col2' : (numInt >= 40 ? 'col3' : (numInt >= 20 ? 'col4' : (numInt >= 0 ? 'col5' : ''))))
                }
            }
            this.tableDataMore = this.tableData.slice(1, (this.tableData.length))
        },
        showAll() {
            this.isShowAll = !this.isShowAll
        },
        formatterHeader(index) {
            let str = ''
            if (this.cycle === 1) {
                str = index === 0 ? '当日' : index === 1 ? '次日' : `${index}日后`
            } else if (this.cycle === 2) {
                str = index === 0 ? '当周' : index === 1 ? '次周' : `${index}周后`
            } else {
                str = index === 0 ? '当月' : index === 1 ? '次月' : `${index}月后`
            }
            return str
        },
        formatterTotalCount(res) {
            let startDate = ''
            let endDate = ''
            let str = ''
            if (this.cycle === 1) { // 日，
                startDate = res.dataNum[0]['startDay']
                endDate = res.dataNum[0]['endDay']
            } else if (this.cycle === 2) {
                startDate = res.dataNum[0]['startFirstDay']
                endDate = res.dataNum[0]['retentionEndDay']
            } else {
                startDate = res.dataNum[0]['startFirstDay']
                endDate = res.dataNum[0]['retentionEndDay']
            }
            str = `${startDate.split('-')[1]}月/${startDate.split('-')[2]}日~${endDate.split('-')[1]}月/${endDate.split('-')[2]}日，每日的用户量算术相加，没有去重`
            return str
        },
        formatterPercentCount(index, res) {
            let startDays = ''
            let endDays = ''
            let diffDate = ''
            let tipsDate = ''
            let lastDate = ''
            let str = ''
            if (this.cycle === 1) {
                startDays = res.startDay.replace(/-/g, '/')
                endDays = res.endDay.replace(/-/g, '/')
                diffDate = (new Date(endDays) - new Date(startDays)) / 8.64e7
                tipsDate = index === 0 ? '当日' : index === 1 ? '次日' : `${index} 日后`
                lastDate = new Date(startDays)
                lastDate.setDate(new Date(endDays).getDate() - index)
                // str = `${startDays.split('/')[1]}月/${startDays.split('/')[2]}日~${lastDate.getMonth() + 1}月/${lastDate.getDate()}日，${diffDate - index} 天内 ${res.otherNum} 个满足起始行为的用户，有 ${res.countNum} 个在 ${tipsDate}完成了留存行为，留存率为 ${res.ratio}。`
            } else if (this.cycle === 2) {
                startDays = res.startFirstDay.replace(/-/g, '/')
                endDays = res.retentionEndDay.replace(/-/g, '/')
                tipsDate = index === 0 ? '当周' : index === 1 ? '次周' : `${index} 周后`
                lastDate = new Date(endDays)
                // lastDate.setDate(new Date(endDays).getDate() - index * 7)
                diffDate = (new Date(lastDate) - new Date(startDays)) / 8.64e7
                // str = `12月/18日~6月/20日，185 天内 ${res.otherNum} 个满足起始行为的用户，有 ${res.countNum} 个在 ${tipsDate}完成了留存行为，留存率为 ${res.ratio}。`
            } else {
                startDays = res.startFirstDay.replace(/-/g, '/')
                endDays = res.retentionEndDay.replace(/-/g, '/')
                tipsDate = index === 0 ? '当月' : index === 1 ? '次月' : `${index} 月后`
                lastDate = new Date(endDays)
                // lastDate.setDate(new Date(endDays).getDate() - index * 30)
                diffDate = (new Date(lastDate) - new Date(startDays)) / 8.64e7
            }
            str = `${startDays.split('/')[1]}月/${startDays.split('/')[2]}日~${lastDate.getMonth() + 1}月/${lastDate.getDate()}日，${diffDate - index} 天内 ${res.otherNum} 个满足起始行为的用户，有 ${res.countNum} 个在 ${tipsDate}完成了留存行为，留存率为 ${res.ratio}。`
            return str
        },
        formatterUserCount(res) {
            return `${res.allUser}的用户去重,合计${res.userNum}人`
        },
        formatterPerUnitCount(index, arr, res) {
            let startDays = ''
            let endDays = ''
            let weekly = '日一二三四五六'
            let diffDate = ''
            let tipsDate = ''
            let startRetentionDays = ''
            let endRetentionDays = ''
            let diffRetentionDate = ''
            let str = ''
            if (this.cycle === 1) {
                startDays = res.startDay.replace(/-/g, '/')
                endDays = res.endDay.replace(/-/g, '/')
                diffDate = (new Date(endDays) - new Date(startDays)) / 8.64e7
                tipsDate = diffDate === 0 ? '当日' : diffDate === 1 ? '次日' : `${diffDate} 日后`
                str = `${startDays.split('/')[1]}月/${startDays.split('/')[2]}日 周${weekly[new Date(startDays).getDay()]}，${arr.countNum}个满足起始行为的用户，有 ${res.countNum} 个在 ${tipsDate}(${endDays.split('/')[1]}月/${endDays.split('/')[2]}日 周${weekly[new Date(endDays).getDay()]}), 完成了留存行为，留存率为 ${res.ratio}。`
            } else if (this.cycle === 2) {
                startDays = res.startFirstDay.replace(/-/g, '/')
                endDays = res.startEndDay.replace(/-/g, '/')
                startRetentionDays = res.retentionFirstDay.replace(/-/g, '/')
                endRetentionDays = res.retentionEndDay.replace(/-/g, '/')
                diffDate = (new Date(endDays) - new Date(startDays)) / 8.64e7
                // diffRetentionDate = (new Date(endRetentionDays) - new Date(startRetentionDays)) / 8.64e7
                tipsDate = index === 0 ? '当周' : index === 1 ? '次周' : `${index} 周后`
                str = `${startDays.split('/')[1]}月/${startDays.split('/')[2]}日~${endDays.split('/')[1]}月/${endDays.split('/')[2]}日 周一~周日，7天内 ${res.otherNum}个满足起始行为的用户，有 ${res.countNum} 个在 ${tipsDate}(${startRetentionDays.split('/')[1]}月/${startRetentionDays.split('/')[2]}日~${endRetentionDays.split('/')[1]}月/${endRetentionDays.split('/')[2]}日，周一~周日，7天), 完成了留存行为，留存率为 ${res.ratio}。`
            } else {
                // 1月/1日~1月/31日，31天内 1269个满足起始行为的用户，有 915 个在 2 月后(3月/1日~3月/31日，31天), 完成了留存行为，留存率为 72.1%。
                startDays = res.startFirstDay.replace(/-/g, '/')
                endDays = res.startEndDay.replace(/-/g, '/')
                startRetentionDays = res.retentionFirstDay.replace(/-/g, '/')
                endRetentionDays = res.retentionEndDay.replace(/-/g, '/')
                diffDate = (new Date(endDays) - new Date(startDays)) / 8.64e7
                diffRetentionDate = (new Date(endRetentionDays) - new Date(startRetentionDays)) / 8.64e7
                tipsDate = index === 0 ? '当月' : index === 1 ? '次月' : `${index} 月后`
                str = `${startDays.split('/')[1]}月/${startDays.split('/')[2]}日~${endDays.split('/')[1]}月/${endDays.split('/')[2]}日，${diffDate}天内 ${res.otherNum}个满足起始行为的用户，
                有 ${res.countNum} 个在 ${tipsDate}(${startRetentionDays.split('/')[1]}月/${startRetentionDays.split('/')[2]}日~${endRetentionDays.split('/')[1]}月/${endRetentionDays.split('/')[2]}日，${diffRetentionDate}天), 完成了留存行为，留存率为 ${res.ratio}。`
            }
            return str
        }
    }
}
</script>

<style scoped lang="scss">
    .tableBox{
        position: relative;
        margin: 0 47px;
        font-size: 12px;
        color: #6D7684;
        .flex-table-left{
            position: absolute;
            left: 0;
            width: 241px;
            overflow: hidden;
            z-index: 1;
            background-color: #ffffff;
            table thead, tbody tr {
                display:table;
                width:100%;
                table-layout:fixed;
            }

            table thead {
                width: 100%;
            }
        }
        .flex-table{
            overflow-x: auto;
            overflow-y: hidden;
            position: relative;
            background-color: #ffffff;
        }
        table{
            table-layout:fixed;
            thead{
                tr{
                   th{
                       border-top: 1px solid #DDDDDD;
                   }
                }
            }
            tr{
                th{
                    width: 106px;
                    border-right: 1px solid  #DDDDDD;
                    border-bottom: 1px solid #DDDDDD;
                    text-align: center;
                    height: 43px;
                }
                td{
                    width: 106px;
                    border-right: 1px solid #DDDDDD ;
                    border-bottom: 1px solid #DDDDDD;
                    text-align: center;
                    height: 43px;
                }
                td:first-child, th:first-child{
                    border-left: 1px solid #DDDDDD;
                }
                th.bigw, td.bigw{
                    width: 137px;
                    max-width: 137px;
                }
                th.smalw, td.smalw{
                    width: 104px;
                    max-width: 104px;
                }
                td.noborder, th.noborder{
                    border-right: 0;
                    border-bottom: 0;
                }
                td.none, th.none{
                    width: auto;
                    border-right: 0;
                    border-bottom: 0;
                    border-top: 0
                }
            }
            tbody {
                display:block;
                overflow-y:hidden;
                width:100%;
            }
        }
        table thead, tbody tr {
            display:table;
            table-layout:fixed;
            width: 100%;
        }
        .fillBox{
            height: 43px;
            font-size: 12px;
            color: #6D7684;
            .pre{
                color: #ffffff;
                font-size: 16px;
            }
            .num{
                color: #f0f0f0;
                font-size: 12px;
            }
        }
        .fillBox.col1{
            background-color: rgba(21,128,255,1);
        }
        .fillBox.col2{
            background-color: rgba(21, 128 , 255, 0.8);
        }
        .fillBox.col3{
            background: rgba(21, 128 , 255, 0.6);
        }
        .fillBox.col4{
            background: rgba(21, 128 , 255, 0.4);
        }
        .fillBox.col5{
            background: rgba(21, 128 , 255, 0.25);
        }
        .boldText{
            font-weight: bold;
        }
    }
</style>
