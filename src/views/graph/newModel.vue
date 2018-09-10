<template>
    <div class="add-model-section">
        <cre-funels v-if="$route.query.type === 'graphFunnels'"></cre-funels>
        <graph-charts v-if="$route.query.type === 'graphCharts'"></graph-charts>
        <cre-retention v-if="$route.query.type === 'graphRetention'"></cre-retention>
        <!--创建渠道分析-->
        <create-channel v-if="$route.query.type === 'graphChannel'"></create-channel>
        <cre-cluster-view v-if="$route.query.type === 'graphCluster'"></cre-cluster-view>
    </div>
</template>

<script>
import CreFunels from '../../components/graph/CreFunels.vue'
import CreRetention from '../../components/graph/CreRetention'
import GraphCharts from '../../components/graph/CreateEvent'
import CreClusterView from '../../components/graph/CreClusterView'
import CreateChannel from '../../components/graph/CreateChannel'

export default {
    name: 'CreateNewModel',
    components: {
        CreFunels,
        CreRetention,
        GraphCharts,
        CreClusterView,
        CreateChannel
    },
    mounted() {
        // console.log(this.$route)
    },
    methods: {
        cancelCreate() {
            this.$router.history.go(-1)
        }
    }
}
</script>

<style lang="scss">
    .el-popper .popper__arrow, .el-popper .popper__arrow::after{
        display: none;
    }
    .btn-el{
        .el-input__suffix{
            color: #409EFF;
        }
        .el-input__inner{
            background: #F9FAFB;
            color: #409EFF;
        }
        .el-select__caret.el-input__icon.el-icon-arrow-up{
            color: #409EFF;
        }
    }
</style>
