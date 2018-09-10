import * as C from '../constants/api'
import M from '../utils/misc'
const state = {
    // 圈选列表展示
    circlePageList: {
        result: [],
        pageNo: 1,
        totalCount: 0,
        isLoading: true
    },
    circleIndexMap: {
        result: []
    },
    // 埋点事件
    trackPageList: {
        result: [],
        pageNo: 1,
        totalCount: 0,
        isLoading: true
    },
    compositePageList: {
        result: [],
        pageNo: 1,
        totalCount: 0,
        isLoading: true
    }, // 复合指标的详情
    compositeItemDetail: {},
    // 指标列表
    compositeIndexList: {
        result: []
    }
}

const mutations = {
    [C.M_EVENT_GET_CIRCLE_LIST](state, { payload }) {
        state.circlePageList = {
            result: payload.datas.sort(M.resetSort('updateTime')).reverse() || [],
            pageNo: payload.pageNo,
            totalCount: payload.count || 0,
            isLoading: false
        }
    },
    [C.M_EVENT_DEL_CIRCLE_INDEX](state, { meta }) {
        const removeId = meta.id
        state.circlePageList.result = state.circlePageList.result.filter(item => {
            return item.id !== removeId
        })
    },
    [C.M_EVENT_UPDATE_CIRCLE_INDEX](state, {meta}) {
        const {id, name} = meta
        state.circlePageList.result.filter(list => list.id === id).forEach(item => {
            item.name = name
        })
    },
    [C.M_EVENT_GET_CIRCLE_INDEX](state, { payload }) {
        state.circleIndexMap.result = payload.data
    },
    [C.TRENDEVENT_GET_EVENTS_LIST](state, { payload }) {
        state.trackPageList = {
            result: payload.datas.sort(M.resetSort('updateTime')).reverse() || [],
            pageNo: payload.pageNo,
            totalCount: payload.count || 0,
            isLoading: false
        }
    },
    [C.TREND_EVENT_CREATE_EVENTS](state) {},
    [C.TREND_EVENT_UPDATE_EVENTS_NAME](state, {meta}) {
        // g更新数据
        const {id, eventId, eventName, comments} = meta
        state.trackPageList.result.filter(list => list.id === id).forEach(item => {
            item.eventId = eventId
            item.eventName = eventName
            item.comments = comments
        })
    },
    [C.TREND_EVENT_DEL_EVENTS](state, {meta}) {
        const removeId = meta.id
        state.trackPageList.result = state.trackPageList.result.filter(item => {
            return item.id !== removeId
        })
    },
    // 复合指标的列表展示
    [C.COMPOSITE_GET_MULTI_INDEX_LIST](state, {payload}) {
        state.compositePageList = {
            result: payload.datas.sort(M.resetSort('updateTime')).reverse() || [],
            pageNo: payload.pageNo,
            totalCount: payload.count || 0,
            isLoading: false
        }
    }, // 删除复合指标
    [C.COMPOSITE_DEL_MULTI_INDEX_LIST](state, {meta}) {
        const removeId = meta.id
        state.compositePageList.result = state.compositePageList.result.filter(item => {
            return item.id !== removeId
        })
    }, // 复合指标的明细
    [C.COMPOSITE_QUERY_MULTI_INDEX_LIST] (state, {payload}) {
        state.compositeItemDetail = payload
    },
    [C.COMPOSITE_GET_INDEX_LIST] (state, {payload}) {
        state.compositeIndexList.result = payload.datas || []
    },
    [C.COMPOSITE_CREATE_MULTI_INDEX_LIST] (state, {payload}) {},
    [C.COMPOSITE_UPDATE_MULTI_INDEX_LIST] (state, {payload}) {}
}

export default {
    state,
    mutations
}
