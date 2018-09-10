<template>
    <div class="chart-no-data">
        <div class="chart-no-data-img"><img src="../layouts/images/no-data.png"></div>
        <div class="chart-no-data-title">暂无数据</div>
    </div>
</template>

<script>
export default {
    name: 'ChartNoData'
}
</script>

<style lang="scss">
.chart-no-data {
    position: absolute;
    top: 0;
    text-align: center;
    width: 100%;
    height: 281px;
    color: #C0C4CC;
    font-size: 14px;
    .chart-no-data-img {
        margin-top: 110px;
        img {
            width: 109px;
            height: 84px;
        }
    }
    .chart-no-data-title {
        margin-top: 20px;
    }
}
</style>
