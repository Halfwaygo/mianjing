<template>
    <div class="setting">
        <div class="type-generate chart-type-switcher">
            <div class="header">{{ name }}</div>
            <div class="container-icon">
                <span v-for="(item, k) in styleList" :key="k" :class="{'active': item.typeId === getId}">
                    <i :class="item.iconClass" @click="chooseStyle(item)"></i>
                </span>
            </div>
            <div class="footer">{{ describe }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StyleCreate',
    props: {
        name: {
            type: String,
            default: '1.选择图标样式'
        },
        chooseId: {
            type: Number,
            default: 1
        },
        disable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            getId: 0,
            styleList: [{
                name: '线图',
                typeId: 0,
                iconClass: 'icon-chart1',
                describe: '线图，支持多指标'
            }, {
                name: '横向柱状图',
                typeId: 1,
                iconClass: 'icon-chart2',
                describe: '横向柱状图，支持单指标、单维度'
            }, {
                name: '纵向柱状图',
                typeId: 2,
                iconClass: 'icon-chart3',
                describe: '纵向柱状图，支持多指标'
            }, {
                name: '表格',
                typeId: 3,
                iconClass: 'icon-chart4',
                describe: '表格，支持多指标，多维度'
            }, {
                name: '数值图',
                typeId: 4,
                iconClass: 'icon-chart5',
                describe: '数值图，支持单指标'
            }],
            describe: ''
        }
    },
    watch: {
        chooseId(value, oldvalue) {
            this.getId = value
            this.describe = this.styleList[value].describe
        },
        disable(value, olde) {
            this.disable = value
        }
    },
    mounted() {
        for (let i = 0; i < this.styleList.length; i++) {
            if (this.styleList[i].typeId === this.chooseId) {
                this.describe = this.styleList[i].describe
            }
        }
        this.getId = this.chooseId
    },
    methods: {
        chooseStyle(item) {
            if (this.disable) {
                // 不能编辑
                return
            }
            this.describe = item.describe
            this.getId = item.typeId
            this.$emit('getstyleid', this.getId)
        }
    }
}
</script>

<style lang="scss">
@import "../../layouts/css/createSingle/create";
    .container-icon{
        span{
            display: inline-block;
            cursor: pointer;
        }

    }
.icon-chart1{
    background: url("../../layouts/images/icon/chart-1-gray.png") no-repeat center;
    background-size: 80%;
}
.icon-chart2{
    background: url("../../layouts/images/icon/chart-2-gray.png") no-repeat center;
    background-size: 80%;
}
.icon-chart3{
    background: url("../../layouts/images/icon/chart-3-gray.png") no-repeat center;
    background-size: 80%;
}
.icon-chart4{
    background: url("../../layouts/images/icon/chart-4-gray.png") no-repeat center;
    background-size: 80%;
}
.icon-chart5{
    background: url("../../layouts/images/icon/chart-5-gray.png") no-repeat center;
    background-size: 80%;
}
    .active{
        .icon-chart1{
            background: url("../../layouts/images/icon/chart-1.png") no-repeat center;
            background-size: 80%;
        }
        .icon-chart2{
            background: url("../../layouts/images/icon/chart-2.png") no-repeat center;
            background-size: 80%;
        }
        .icon-chart3{
            background: url("../../layouts/images/icon/chart-3.png") no-repeat center;
            background-size: 80%;
        }
        .icon-chart4{
            background: url("../../layouts/images/icon/chart-4.png") no-repeat center;
            background-size: 80%;
        }
        .icon-chart5{
            background: url("../../layouts/images/icon/chart-5.png") no-repeat center;
            background-size: 80%;
        }
    }

</style>
