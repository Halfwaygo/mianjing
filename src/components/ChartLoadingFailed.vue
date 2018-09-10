<template>
    <div class="chart-loading-failed">
        <div :style="topStyle" class="chart-loading-failed-img"><img src="../layouts/images/loading-failed.png"></div>
        <div class="chart-loading-failed-title">加载失败</div>
    </div>
</template>

<script>
export default {
    name: 'ChartLoadingFailed',
    props: {
        top: {
            type: Number,
            default: 110
        }
    },
    data() {
        return {
            topStyle: {
                'margin-top': this.top + 'px'
            }
        }
    }
}
</script>

<style lang="scss">
.chart-loading-failed {
    position: absolute;
    top: 0;
    text-align: center;
    width: 100%;
    height: 281px;
    color: #C0C4CC;
    font-size: 14px;
    .chart-loading-failed-img {
        margin-top: 110px;
        img {
            width: 118px;
            height: 83px;
        }
    }
    .chart-loading-failed-title {
        margin-top: 20px;
    }
}
</style>
