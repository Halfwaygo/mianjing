import * as C from '../constants/api'
import Api, {createAction} from '../utils/api'

export default {
    // 圈选列表
    getMCircleListAction: createAction(C.M_EVENT_GET_CIRCLE_LIST, Api.getMCircleList, params => params),
    // 删除圈选
    getMCircleDelIndexAction: createAction(C.M_EVENT_DEL_CIRCLE_INDEX, Api.getMCircleDelIndex, params => params),
    // x修改编辑
    getMCircleUpdateIndexAction: createAction(C.M_EVENT_UPDATE_CIRCLE_INDEX, Api.getMCircleUpdateIndex, params => params),
    // 圈选趋势明细
    getMCircleGetIndexAction: createAction(C.M_EVENT_GET_CIRCLE_INDEX, Api.getMCircleGetIndex, params => params),
    // 保存编辑 接口缺失
    //  m埋点事件列表展示
    trendEventGetListAction: createAction(C.TRENDEVENT_GET_EVENTS_LIST, Api.trendEventGetList, params => params),
    // 新增埋点事件
    trendEventCreateTrendAction: createAction(C.TREND_EVENT_CREATE_EVENTS, Api.trendEventCreateTrend, params => params),
    // 修改埋点事件信息
    trendEventUpdateTrendAction: createAction(C.TREND_EVENT_UPDATE_EVENTS_NAME, Api.trendEventUpdateTrend, params => params),
    // 删除埋点信息
    trendEventDelTrendAction: createAction(C.TREND_EVENT_DEL_EVENTS, Api.trendEventDelTrend, params => params),
    // 复合指标列表展示
    compositeGetMultiIndexListAction: createAction(C.COMPOSITE_GET_MULTI_INDEX_LIST, Api.compositeGetMultiIndexList, params => params),
    // 删除复合指标
    compositeDelMultiIndexListAction: createAction(C.COMPOSITE_DEL_MULTI_INDEX_LIST, Api.compositeDelMultiIndexList, params => params),
    // 指标详情名字
    compositeQueryMultiIndexListAction: createAction(C.COMPOSITE_QUERY_MULTI_INDEX_LIST, Api.compositeQueryMultiIndexList, params => params),
    // 创建复合指标的指标列表
    compositeGetIndexListAction: createAction(C.COMPOSITE_GET_INDEX_LIST, Api.compositeGetIndexList, params => params),
    // 创建复合指标
    compositeCreateMultiIndexListAction: createAction(C.COMPOSITE_CREATE_MULTI_INDEX_LIST, Api.compositeCreateMultiIndexList, params => params),
    // 编辑复合指标
    compositeUpdateMultiIndexListAction: createAction(C.COMPOSITE_UPDATE_MULTI_INDEX_LIST, Api.compositeUpdateMultiIndexList, params => params)
}
