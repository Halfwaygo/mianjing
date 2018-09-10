import * as C from '../constants/api'
import Api, {createAction} from '../utils/api'

export default {
    // 维度信息获取
    dimensionGetInfoAction: createAction(C.DIMENSION_GET_INFO, Api.dimensionGetInfo, params => params),
    // 渠道单图的渠道号
    graphGetChannelListAction: createAction(C.GRAPH_GET_CHANNEL_LIST, Api.graphGetChannelList, params => params),
    // 渠道单图的分群选择
    graphGetChannelQueryGroupListAction: createAction(C.GRAPH_GET_CHANNEL_QUERY_GROUP_LIST, Api.graphGetChannelQueryGroupList, params => params),
    // 渠道的列表
    graphGetChannelMapListAction: createAction(C.GRAPH_GET_CHANNEL_MAP_LIST, Api.graphGetChannelMapList, params => params),
    // 根据渠道列表接口获取的单图id获取渠道单图
    graphQueryChannelMapAction: createAction(C.GRAPH_QUERY_CHANNEL_MAP, Api.graphQueryChannelMap, params => params),
    //  根据渠道单图的条件，查询数据接口
    graphGetChannelMapIndexAction: createAction(C.GRAPH_GET_CHANNEL_MAP_INDEX, Api.graphGetChannelMapIndex, params => params),
    // 删除渠道单图
    graphDelChannelMapAction: createAction(C.GRAPH_DEL_CHANNEL_MAP, Api.graphDelChannelMap, params => params),
    // 创建渠道单图
    graphCreateChannelMapAction: createAction(C.GRAPH_CREATE_CHANNEL_MAP, Api.graphCreateChannelMap, params => params),
    // 修改渠道单图
    graphUpdateChannelMapAction: createAction(C.GRAPH_UPDATE_CHANNEL_MAP, Api.graphUpdateChannelMap, params => params),
    // 留存分析详情单图
    graphQueryRetainMapAction: createAction(C.GRAPH_QUERY_RETAIN_MAP, Api.graphQueryRetainMap, params => params),
    // 留存分析数据详情接口
    getActiveUserRetentionAction: createAction(C.GET_ACTIVE_USER_RETENTION, Api.getActiveUserRetention, params => params)

}
