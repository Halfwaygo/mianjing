import 'es6-promise'
import Axios from 'axios'
import * as C from '../constants/api'
import { Message } from 'element-ui'
import queryString from 'query-string'
const METHODS = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
}

const JSONHeaders = {'Content-Type': 'application/json;charset=UTF-8'}

// 设置10秒时容易超时，20s还不返回说明该接口问题较大
Axios.defaults.timeout = __DEV__ ? 5000 : 10000
Axios.interceptors.request.use(config => {
    return config
})

Axios.interceptors.response.use(
    response => {
        let { data: resp } = response
        return new Promise((resolve, reject) => {
            const { code } = resp
            if (parseInt(code) === C.CODE_STATUS_OK) {
                resolve(resp.data || resp.data === 0 ? resp.data : resp)
            } else if (code === `${C.CODE_SESSION_TIME_OUT}`) {
                window.location.href = '#/login'
                window.location.reload()
            } else {
                // reject(resp)
                resp.message && Message.warning({ message: resp.message, showClose: true })
            }
        })
    },
    error => {
        const { response } = error
        let errorMsg = ''
        if (!response) {
            errorMsg = '网络错误，请检测网络是否正常!'
        } else {
            const { data } = response
            errorMsg =
                data && data.msg ? data.msg : '服务器发生异常，请联系管理员'
            // setTimeout(() => {
            //     Router.replace('/login')
            // }, 300)
            console.warn('error', error)
        }
        const messagesInstances = document.querySelectorAll('.el-message')
        messagesInstances.length === 0 && Message.warning({ message: errorMsg, showClose: true })
        return Promise.reject(error)
    }
)

const request = (url, params = {}, headers = {}, method = METHODS.GET) => {
    let options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...headers
        },
        method: method
    }

    if (method === METHODS.POST || method === METHODS.PUT) {
        if (headers['Content-Type'] === JSONHeaders['Content-Type']) {
            options.data = params
        } else {
            options.data = queryString.stringify(params)
        }
    } else if (method === METHODS.GET || method === METHODS.DELETE) {
        options.params = params
    }

    return Axios({ url, ...options })
}

const post = (url, params, headers) => request(url, params, headers, METHODS.POST)

export const createAction = (type, payloadCreator, metaCreator) => {
    const identity = (...args) => args[0]
    const isFunc = fn => typeof fn === 'function'
    const isPromise = obj => typeof obj === 'object' && isFunc(obj.then)
    const finalPayloadCreator = isFunc(payloadCreator)
        ? payloadCreator
        : identity

    return ({ commit, dispatch }, ...args) => {
        const payload = finalPayloadCreator(...args)
        const action = { type, payload }
        if (isFunc(metaCreator)) {
            action.meta = metaCreator(...args)
        }

        if (isPromise(payload)) {
            return payload
                .then(result => {
                    commit(type, Object.assign(action, { payload: result }))
                    return result
                })
                .catch(error => {
                    dispatch('hidePageLoading')
                    console.error(`请求 ${type}异常，请求结果为: ${JSON.stringify(error)}`)
                    return Promise.reject(error)
                })
        }
        return commit(type, Object.assign(action, { payload }))
    }
}

export default {
    // 登录接口
    login: params => post(C.USER_LOGIN, params),
    //  退出登录
    loginOut: params => post(C.USER_LOGIN_LOG, params),
    queryPageCategory: params => request(C.PAGE_CATEGORY_QUERY, params),
    // 看板图标列表
    realtimeChartList: params => post(C.REALTIME_CHART_LIST, params),
    // 实时指标列表
    realtimeIndexList: params => post(C.REALTIME_INDEX_LIST, params),
    // 实时添加单图
    realtimeAddChart: params => post(C.REALTIME_ADD_CHART, params),
    // 实时删除单图
    realtimeDelChart: params => post(C.REALTIME_DEL_CHART, params),
    // 实时展示非预置单图
    realtimeNotyzShowChart: params => post(C.REALTIME_SHOW_NOTYZ_CHART, params),
    // 实时四个预置图
    realtimeYesyzShowChart: params => post(C.REALTIME_SHOW_YESYZ_CHART, params),
    // 概览-累计用户
    summaryGrandTotal: params => request(C.SUMMARY_DRAND_TOTAL, params),
    // 概览-四个方格数据（活跃用户、新增用户、人均启动次数、人均使用时长）
    summaryFourIsc: params => request(C.SUMMARY_FOUR_ICS, params),
    // 概览-活跃用户数
    summaryLiveUser: params => request(C.SUMMARY_LIVE_USER, params),
    // 概览-新增用户数
    summaryAddUser: params => request(C.SUMMARY_ADD_USER, params),
    // 概览-启动次数
    summaryStartUp: params => request(C.SUMMARY_STARTUP_NUM, params),
    // 概览-人均启动次数
    summaryPersonStartUp: params => request(C.SUMMARY_PERSON_STARTUP_NUM, params),
    // 概览-人均使用时长
    summaryPersonUseTime: params => request(C.SUMMARY_PERSON_USE_TIME, params),
    // 概览-次均使用时长
    summaryOnceUseTime: params => request(C.SUMMARY_ONCE_USE_TIME, params),
    // 概览-账号用户占比
    summaryAccRadio: params => request(C.SUMMARY_ACCOUNT_RATIO, params),
    // 概览-用户登录方式
    summaryLoginWay: params => request(C.SUMMARY_LOGIN_WAY, params),
    // APP TOP5版本分布
    summaryAppTop: params => request(C.SUMMARY_APP_TOP, params),

    // 概览-包括顶部和饼图和App
    summaryIndex: params => post(C.SUMMARY_INDEX_ICS, params),
    // 概览-时段数据
    summaryHour: params => post(C.SUMMARY_HOUR_ICS, params),
    // 概览-修改
    changeSummaryBoardName: params => post(C.SUMMARY_DASHBOAR_NAME_CHANGED, params),

    // 单图-圈选
    funnelIndexList: params => post(C.FUNNEL_INDEX_LIST, params),
    //  漏斗单图列表
    funnelSinggleMapList: params => post(C.FUNNEL_SINGLE_LIST, params),
    //  新建漏斗单图列表
    createSinggleMap: params => post(C.CREATE_FUNEL_SINGGLE_MAP, params),

    // 获取单个看板
    getSingelBoard: params => post(C.GET_SINGLE_BOARD, params),
    // 新建看板
    addDashboard: params => post(C.ADD_DASHBOARD, params),
    // 删除看板
    delDashboard: params => post(C.DEL_DASHBOARD, params),
    // 单图列表
    getSingleMapList: params => post(C.GET_GINGLE_MAP_LIST, params),
    // 1.1 获取首页展示所有看板
    getAllBoard: params => post(C.GET_ALL_BOARD, params),
    // 添加看板的单图
    addSingleMap: params => post(C.ADD_SINGLE_MAP, params),
    // 删除看板单图
    delSingleMap: params => post(C.DEL_SINGLE_MAP, params),
    // 获取所有看板（包括搜索）
    getAllBoardSearch: params => post(C.GET_ALL_BOARD_SEARCH, params),
    //  《单图模块》
    // 单图模块-事件分析接口
    graphGetEventMapList: params => post(C.GRAPH_GET_EVENT_MAP_LIST, params),
    // 获取事件单图指标
    graphGetEventMapIndex: params => post(C.GRAPH_GET_EVENT_MAP_INDEX, params),
    // 获取事件分析表格数据
    graphGerEventTableMapIndex: params => post(C.GRAPH_GET_EVENT_TABLE_MAP_INDEX, params),
    // 事件分析接口-创建事件单图
    graphCreateEventMap: params => post(C.GRAPH_CREATE_EVENT_MAP, params),
    // 事件分析接口-获取圈选指标、预定义指标及复合指标
    graphGetEventAllIndexList: params => post(C.GRAPH_GET_EVENT_ALL_INDEX_LIST, params),
    // 事件分析接口-修改事件单图
    graphUpdateEventMap: params => post(C.GRAPH_UPDATE_EVENT_MAP, params),
    //  事件分析接口-删除事件单图
    graphDelEventMap: params => post(C.GRAPH_DEL_EVENT_MAP, params),
    //  事件分析接口-查询事件单图
    graphQueryEventMap: params => post(C.GRAPH_QUERY_EVENT_MAP, params),
    //  事件分析接口-分群选择
    graphQueryGroupEventMap: params => post(C.GRAPH_QUERY_GROUP_EVENT_MAP, params),

    // 漏斗分析
    // 漏斗分析接口
    // 获取圈选指标和自定义事件 funnel/indexList.api
    graphGetFunnelIndexList: params => post(C.GRAPH_GET_FUNNEL_INDEX_LIST, params),
    // 漏斗单图列表/funnel/singleMapList.api
    graphGetFunnelMapList: params => post(C.GRAPH_GET_FUNNEL_MAP_LIST, params),
    // 创建漏斗单图funnel /addSingleMap.api
    graphCreateFunnelMap: params => post(C.GRAPH_CREATE_FUNNEL_MAP, params),
    // 修改漏斗单图 funnel /updateSingleMap.api
    graphUpdateFunnelMap: params => post(C.GRAPH_UPDATE_FUNNEL_MAP, params),
    // 查询漏斗单图 funnel /querySingleMap.api
    graphQueryFunnelMap: params => post(C.GRAPH_QUERY_FUNNEL_MAP, params),
    // 删除漏斗单图unnel /deleteSingleMap.api
    graphDelFunnelMap: params => post(C.GRAPH_DEL_FUNNEL_MAP, params),
    // 获取漏斗单图指标/funnel/singleMapIndex.api
    graphGetFunnelMapIndex: params => post(C.GRAPH_GET_FUNNEL_MAP_INDEX, params),
    // 分群选择funnel /queryGroup.api
    graphGetFunnelQueryGroups: params => post(C.GRAPH_GET_FUNNEL_QUERY_GROUPS, params),

    // 留存分析接口
    // 获取圈选指标和自定义事件 /retain/indexList.api
    graphGetRetainIndexList: params => post(C.GRAPH_GET_RETAIN_INDEX_LIST, params),
    // 留存单图列表 retain/singleMapList.api
    graphGetRetainMapList: params => post(C.GRAPH_GET_RETAIN_MAP_LIST, params),
    // 创建留存单图 retain/addSingleMap.api
    graphCreateRetainMap: params => post(C.GRAPH_CREATE_RETAIN_MAP, params),
    // 修改留存单图 retain/updateSingleMap.api
    graphUpdateRetainMap: params => post(C.GRAPH_UPDATE_RETAIN_MAP, params),
    // 查询留存单图 retain/querySingleMap.api
    graphQueryRetainMap: params => post(C.GRAPH_QUERY_RETAIN_MAP, params),
    // 删除留存单图 retain/deleteSingleMap.api
    graphDelRetainMap: params => post(C.GRAPH_DEL_RETAIN_MAP, params),
    // 获取留存单图指标 retain/singleMapIndex.api
    graphGetRetainMapIndex: params => post(C.GRAPH_GET_RETAIN_MAP_INDEX, params),
    // 分群选择 retain/queryGroup.api
    graphGetRetainQueryGroups: params => post(C.GRAPH_GET_RETAIN_QUERY_GROUPS, params),

    // 渠道分析接口 获取渠道号
    graphGetChannelList: params => post(C.GRAPH_GET_CHANNEL_LIST, params),
    // 渠道分析 分群选择
    graphGetChannelQueryGroupList: params => post(C.GRAPH_GET_CHANNEL_QUERY_GROUP_LIST, params),
    // 渠道单图列表
    graphGetChannelMapList: params => post(C.GRAPH_GET_CHANNEL_MAP_LIST, params),
    // 创建渠道单图
    graphCreateChannelMap: params => post(C.GRAPH_CREATE_CHANNEL_MAP, params),
    // 修改渠道单图
    graphUpdateChannelMap: params => post(C.GRAPH_UPDATE_CHANNEL_MAP, params),
    // 查询渠道单图
    graphQueryChannelMap: params => post(C.GRAPH_QUERY_CHANNEL_MAP, params),
    // 删除渠道单图
    graphDelChannelMap: params => post(C.GRAPH_DEL_CHANNEL_MAP, params),
    // 获取渠道单图指标
    graphGetChannelMapIndex: params => post(C.GRAPH_GET_CHANNEL_MAP_INDEX, params),
    // 分群分析
    //  分群分析 分群选择group/queryGroup.api
    graphGetGroupQueryGroups: params => post(C.GRAPH_GET_GROUP_QUERY_GROUPS, params),
    // 分群单图列表 group/singleMapList.api
    graphGetGroupMap: params => post(C.GRAPH_GET_GROUP_MAP, params),
    // 创建分群单图group/addSingleMap.api
    graphCreateGroupMap: params => post(C.GRAPH_CREATE_GROUP_MAP, params),
    // 修改分群单图 group/updateSingleMap.api
    graphUpdateGroupMap: params => post(C.GRAPH_UPDATE_GROUP_MAP, params),
    // 查询分群单图 group/querySingleMap.api
    graphQueryGroupMap: params => post(C.GRAPH_QUERY_GROUP_MAP, params),
    // 删除分群单图 group/deleteSingleMap.api
    graphDelGroupMap: params => post(C.GRAPH_DEL_GROUP_MAP, params),
    // 获取分群单图指标 group/singleMapIndex.api
    graphGetGroupMapIndex: params => post(C.GRAPH_GET_GROUP_MAP_INDEX, params),
    // 圈选 接口
    // qrcode生成
    getCircleQrCode: params => post(C.CIRCLE_GET_QRCODE, params),
    // 事件管理接口
    // 事件管理-圈选事件  圈选事件展示
    getMCircleList: params => post(C.M_EVENT_GET_CIRCLE_LIST, params),
    // 事件管理-圈选事件  圈选事件指标删除
    getMCircleDelIndex: params => post(C.M_EVENT_DEL_CIRCLE_INDEX, params),
    // 事件管理-圈选事件  圈选事件指标修改
    getMCircleUpdateIndex: params => post(C.M_EVENT_UPDATE_CIRCLE_INDEX, params),
    // 事件管理-圈选事件  查询指标明细
    getMCircleDetailIndex: params => post(C.M_EVENT_GET_CIRCLE_DETAIL, params),
    // 事件管理-圈选事件  圈选指标趋势
    getMCircleGetIndex: params => post(C.M_EVENT_GET_CIRCLE_INDEX, params),

    // 事件管理-埋点事件
    // 埋点事件展示
    trendEventGetList: params => post(C.TRENDEVENT_GET_EVENTS_LIST, params),
    // 新建埋点事件
    trendEventCreateTrend: params => post(C.TREND_EVENT_CREATE_EVENTS, params),
    // 埋点事件名称修改
    trendEventUpdateTrend: params => post(C.TREND_EVENT_UPDATE_EVENTS_NAME, params),
    // 埋点事件删除
    trendEventDelTrend: params => post(C.TREND_EVENT_DEL_EVENTS, params),
    // 埋点事件id是否存在
    trendEventIsExistEvent: params => post(C.TREND_EVENT_IS_EXIST_EVENT, params),
    // 指标展示
    trendEventGetIndex: params => post(C.TREND_EVENT_GET_INDEX, params),

    // 事件管理-复合指标
    // 复合指标展示 composite/multiIndexList.api
    compositeGetMultiIndexList: params => post(C.COMPOSITE_GET_MULTI_INDEX_LIST, params),
    // 获取圈选指标和预定义指标 composite/IndexList.api
    compositeGetIndexList: params => post(C.COMPOSITE_GET_INDEX_LIST, params),
    // 创建复合指标 composite/addMultipleIndex.api
    compositeCreateMultiIndexList: params => post(C.COMPOSITE_CREATE_MULTI_INDEX_LIST, params),
    // 复合指标删除 composite/deleteMultipleIndex.api
    compositeDelMultiIndexList: params => post(C.COMPOSITE_DEL_MULTI_INDEX_LIST, params),
    // 查询指标明细 composite/indexDetail.api
    compositeQueryMultiIndexList: params => post(C.COMPOSITE_QUERY_MULTI_INDEX_LIST, params),
    // 修改复合指标  后续改
    compositeUpdateMultiIndexList: params => post(C.COMPOSITE_UPDATE_MULTI_INDEX_LIST, params),
    // =======================获取维度信息
    dimensionGetInfo: params => post(C.DIMENSION_GET_INFO, params),
    // 维度对于值选项
    dimensionGetValueList: params => post(C.DIMENSION_GET_VALUE_LIST, params),
    // 复合指标  趋势数据
    compositeTrend: params => post(C.COMPOSITE_TREND, params),
    /* ******************用户分群************************/
    // 获取用户分群列表
    getUserGroupList: params => post(C.GET_USER_GROUP_LIST, params),
    // 创建用户分群
    addUserGroupInfo: params => post(C.ADD_USER_GROUP_INFO, params),
    // 修改用户分群
    updateUserGroupInfo: params => post(C.UPDATE_USER_GROUP_INFO, params),
    // 查询用户分群
    queryUserGroupInfo: params => post(C.QUERY_USER_GROUP_INFO, params),
    // 删除用户分群
    deleteUserGroupInfo: params => post(C.DELETE_USER_GROUP, params),
    // 获取圈选指标、预定义指标及复合指标
    getUserIndexList: params => post(C.GET_USER_INDEX_LIST, params),
    // 获取用户细查列表
    getGroupDetailList: params => post(C.GET_GROUP_DETAIL_LIST, params),
    //  获取用户细查具体信息
    getGroupDetailQuery: params => post(C.GET_GROUP_DETAIL_QUERY, params),
    // 获取用户细查具体事件信息
    getGroupDetailEventInfo: params => post(C.GET_GROUP_DETAIL_EVENT_INFO, params),
    // 数据接口测试
    headerCellData: params => post(C.HEAD_CELL_DATA, params, JSONHeaders),
    // 渠道接口
    // 数据接口 事件分析
    eventCellData: params => post(C.EVENT_CELL_DATA, params, JSONHeaders),
    // 留存分析详情数据接口
    getActiveUserRetention: params => post(C.GET_ACTIVE_USER_RETENTION, params, JSONHeaders),

    // 获取圈选Web 默认URL
    getWebUrl: params => request(C.GET_WEB_URL, params),

    // 渠道管理列表展示
    getSettingList: params => post(C.GET_SETTING_LIST, params),
    // 创建渠道副本
    addSetting: params => post(C.ADD_SETTING, params),
    // 删除渠道副本
    deleteSetting: params => post(C.DELETE_SETTING, params),
    // 修改渠道副本
    modifySetting: params => post(C.MODIFY_SETTING, params),
    // 导入渠道副本
    importExcelSetting: params => post(C.IMPORT_EXCEL_SETTING, params)
}
