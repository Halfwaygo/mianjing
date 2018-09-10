import * as C from '../constants/api'
const state = {
    // 渠道分析单图渠道号
    channelList: {
        result: []
    }, // 渠道分析分群选择
    channelQueryGroupList: {
        result: {}
    },
    // 渠道单图的列表数据
    channelMapList: {
        result: [],
        pageNo: 1,
        totalCount: 0
    },
    channelMapDetailList: {},
    channelMapIndex: {},
    channelAnalyzeList: {},
    retentionList: {}
}

const mutations = {
    [C.GRAPH_GET_CHANNEL_MAP_LIST] (state, { payload }) {
        state.channelMapList = {
            result: payload.datas || [],
            pageNo: payload.pageNo,
            totalCount: payload.count
        }
    }, // 渠道id 查询单图信息
    [C.GRAPH_QUERY_CHANNEL_MAP](state, { payload }) {
        state.channelMapDetailList = payload
    },
    [C.GRAPH_GET_CHANNEL_MAP_INDEX](state, { payload }) {
        state.channelMapIndexData = payload
    },
    [C.GRAPH_DEL_CHANNEL_MAP](state, {payload}) {},
    [C.GRAPH_GET_CHANNEL_LIST](state, { payload }) {
        state.channelList = {
            result: payload.datas || []
        }
    },
    [C.GRAPH_GET_CHANNEL_QUERY_GROUP_LIST](state, { payload }) {
        state.channelQueryGroupList.result = {
            group1: payload.group1 || [],
            group2: payload.group2 || []
        }
    },
    // 渠道新增
    [C.GRAPH_CREATE_CHANNEL_MAP] (state, { payload }) {},
    [C.GRAPH_CREATE_CHANNEL_MAP] (state, { payload }) {},
    // 渠道更新
    // 维度信息
    [C.DIMENSION_GET_INFO] (state, {payload}) {
        state.channelList = {
            result: payload.datas.map(item => {
                return {
                    name: item.name,
                    isCheck: 0,
                    id: item.dimensionid
                }
            }) || []
        }
    },
    [C.GET_ACTIVE_USER_RETENTION] (state, {payload}) {},
    [C.GRAPH_QUERY_RETAIN_MAP] (state, {payload}) {
        //  留存分析单图的详情
        state.retentionList = {
            result: payload
        }
    }
}

export default {
    state,
    mutations
}
