
// export const HOST_BASE = `${location.protocol}//${location.host}`
export const HOST_BASE = window.config.context === '/api' ? `${location.protocol}//${location.hostname}:8080` : ''
// const getApi = url => `${window.config.context}/${url}`
const getApi = url => `${HOST_BASE}${window.config.context}/amber/${url}`

// 针对本地调试用
const getLocApi = url => `${HOST_BASE}/loc/amber/${url}`

export const CODE_STATUS_OK = 200
export const CODE_SESSION_TIME_OUT = 4000

// 获取登录验证码
export const CODE_IMG = getApi('codeImgSSO.api')
// 获取api路径
export const BASE_PATH = getApi('')
// 用户登入
export const USER_LOGIN = getApi('login.api')
export const USER_LOGIN_LOG = getApi('logout.api')

export const PAGE_CATEGORY_QUERY = getApi('page/page-category')

/** ***********实时************* */
// 看板图标列表
export const REALTIME_CHART_LIST = getApi('board/realTime/chartList.api')
// 实时-获取指标--------(已通)
export const REALTIME_INDEX_LIST = getApi('board/realTime/indexList.api')
// 实时-添加单图--------(已通)
export const REALTIME_ADD_CHART = getApi('board/realTime/addChart.api')
// 实时-删除单图--------(展示单图未通无法测试)
export const REALTIME_DEL_CHART = getApi('board/realTime/deleteChart.api')
// 实时-非预置数据
export const REALTIME_SHOW_NOTYZ_CHART = getApi('board/realTime/chartIndexShow.api')
// 实时-预置数据
export const REALTIME_SHOW_YESYZ_CHART = getApi('board/realTime/showIndex.api')

/** ***********概览************* */

// 累计
export const SUMMARY_DRAND_TOTAL = getApi('board/overview/getAccumulatedUserNum.api')
// 四个方格数据（活跃用户、新增用户、人均启动次数、人均使用时长）
export const SUMMARY_FOUR_ICS = getApi('board/overview/getHeadFourCellData.api')
// 活跃用户数
export const SUMMARY_LIVE_USER = getApi('board/overview/getActiveUserNum.api')
// 新增用户数
export const SUMMARY_ADD_USER = getApi('board/overview/getIncreasedUserNum.api')
// 启动次数
export const SUMMARY_STARTUP_NUM = getApi('board/overview/getOpenNum.api')
// 人均启动次数
export const SUMMARY_PERSON_STARTUP_NUM = getApi('board/overview/getOpenNumPerUser.api')
// 人均使用时长
export const SUMMARY_PERSON_USE_TIME = getApi('board/overview/getUsingTimePerUser.api')
// 次均使用时长
export const SUMMARY_ONCE_USE_TIME = getApi('board/overview/getUsingTimeEveyTime.api')
// 账号用户占比
export const SUMMARY_ACCOUNT_RATIO = getApi('board/overview/getAccountRatio.api')
// 用户登录方式
export const SUMMARY_LOGIN_WAY = getApi('board/overview/getLoginChannelDiagram.api')
// APP TOP5版本分布
export const SUMMARY_APP_TOP = getApi('board/overview/getTop5AppVersion.api')

// 静态数据--------(未通)
export const SUMMARY_INDEX_ICS = getApi('board/index.api')
// summary-时段统计--------(未通)
export const SUMMARY_HOUR_ICS = getApi('board/hour.api')
// 修改看板名称 （自定义看板的名称修改，产品未设计次功能）
export const SUMMARY_DASHBOAR_NAME_CHANGED = getApi('board/modifyBoardName.api')
/** ***********单图************* */
//  获取圈选指标和自定义事件--------(单图列表未通则无法测试)
export const FUNNEL_INDEX_LIST = getApi('funnel/indexList.api')
// 漏斗单图列表--------(未通)
export const FUNNEL_SINGLE_LIST = getApi('funnel/singleMapList.api')
// 创建漏斗分析--------(正在测试)
export const CREATE_FUNEL_SINGGLE_MAP = getApi('funnel/addSingleMap.api')

/** ***********看板************* */
// 1.1 获取首页展示所有看板（已通，只有自定义看板数据）
export const GET_ALL_BOARD = getApi('board/IndexAll.api')
/** ***********自定义看板*************** */
// 获取单个看板（已通，有数据）
export const GET_SINGLE_BOARD = getApi('board/single.api')
// 新建看板（已通，有数据）
export const ADD_DASHBOARD = getApi('board/addDashboard.api')
// 删除看板（已通，有数据）
export const DEL_DASHBOARD = getApi('board/deleteDashboard.api')
// 单图列表（已通，无数据）
export const GET_GINGLE_MAP_LIST = getApi('board/singleMapList.api')
// 添加看板的单图（已通，有数据）
export const ADD_SINGLE_MAP = getApi('board/addsingleMaps.api')
// 删除看板单图 （已通，有数据）
export const DEL_SINGLE_MAP = getApi('board/deleteSingleMap.api')
// 获取所有看板 （未调 和1.1获取首页展示所有看板 有何区别？）
export const GET_ALL_BOARD_SEARCH = getApi('board/all.api')
//  《单图模块》
// 单图模块-事件分析接口 (已通，有数据)
export const GRAPH_GET_EVENT_MAP_LIST = getApi('eventSingleMap/singleMapList.api')
// 事件分析接口-获取事件单图指标
export const GRAPH_GET_EVENT_MAP_INDEX = getApi('eventSingleMap/singleMapIndex.api')
// 事件分析接口-事件分析表格查询
export const GRAPH_GET_EVENT_TABLE_MAP_INDEX = getApi('eventSingleMap/singleMapIndexTable.api')
// 事件分析接口-创建事件单图
export const GRAPH_CREATE_EVENT_MAP = getApi('eventSingleMap/addSingleMapIndex.api')
// 事件分析接口-获取圈选指标、预定义指标及复合指标 （已通，有数据）
export const GRAPH_GET_EVENT_ALL_INDEX_LIST = getApi('eventSingleMap/indexList.api')
// 事件分析接口-修改事件单图
export const GRAPH_UPDATE_EVENT_MAP = getApi('eventSingleMap/updateSingleMapIndex.api')
// 事件分析接口 删除事件单图
export const GRAPH_DEL_EVENT_MAP = getApi('eventSingleMap/deleteSingleMapIndex.api')
// 事件分析接口查询事件单图
export const GRAPH_QUERY_EVENT_MAP = getApi('eventSingleMap/querySingleMapIndex.api')
// 事件分析接口 分群选择
export const GRAPH_QUERY_GROUP_EVENT_MAP = getApi('eventSingleMap/queryGroup.api')

// 漏斗分析接口
// 获取圈选指标和自定义事件 funnel/indexList.api
export const GRAPH_GET_FUNNEL_INDEX_LIST = getApi('funnel/indexList.api')
// 漏斗单图列表/funnel/singleMapList.api
export const GRAPH_GET_FUNNEL_MAP_LIST = getApi('funnel/singleMapList.api')
// 创建漏斗单图funnel /addSingleMap.api
export const GRAPH_CREATE_FUNNEL_MAP = getApi('funnel/addSingleMap.api')
// 修改漏斗单图 funnel /updateSingleMap.api
export const GRAPH_UPDATE_FUNNEL_MAP = getApi('funnel/updateSingleMap.api')
// 查询漏斗单图 funnel /querySingleMap.api
export const GRAPH_QUERY_FUNNEL_MAP = getApi('funnel/querySingleMap.api')
// 删除漏斗单图unnel /deleteSingleMap.api
export const GRAPH_DEL_FUNNEL_MAP = getApi('funnel/deleteSingleMap.api')
// 获取漏斗单图指标/funnel/singleMapIndex.api
export const GRAPH_GET_FUNNEL_MAP_INDEX = getApi('funnel/singleMapIndex.api')
// 分群选择funnel /queryGroup.api
export const GRAPH_GET_FUNNEL_QUERY_GROUPS = getApi('funnel/queryGroup.api')

// 留存分析接口
// 获取圈选指标和自定义事件 /retain/indexList.api
export const GRAPH_GET_RETAIN_INDEX_LIST = getApi('retain/indexList.api')
// 留存单图列表 retain/singleMapList.api
export const GRAPH_GET_RETAIN_MAP_LIST = getApi('retain/singleMapList.api')
// 创建留存单图 retain/addSingleMap.api
export const GRAPH_CREATE_RETAIN_MAP = getApi('retain/addSingleMap.api')
// 修改留存单图 retain/updateSingleMap.api
export const GRAPH_UPDATE_RETAIN_MAP = getApi('retain/updateSingleMap.api')
// 查询留存单图 retain/querySingleMap.api
export const GRAPH_QUERY_RETAIN_MAP = getApi('retain/querySingleMap.api')
// 删除留存单图 retain/deleteSingleMap.api
export const GRAPH_DEL_RETAIN_MAP = getApi('retain/deleteSingleMap.api')
// 获取留存单图指标 retain/singleMapIndex.api
export const GRAPH_GET_RETAIN_MAP_INDEX = getApi('retain/singleMapIndex.api')
// 分群选择 retain/queryGroup.api
export const GRAPH_GET_RETAIN_QUERY_GROUPS = getApi('retain/queryGroup.api')

// 渠道分析接口 获取渠道号
export const GRAPH_GET_CHANNEL_LIST = getApi('channel/channelList.api')
// 分群分析
export const GRAPH_GET_CHANNEL_QUERY_GROUP_LIST = getApi('channel/queryGroup.api')
// 渠道单图列表
export const GRAPH_GET_CHANNEL_MAP_LIST = getApi('channel/singleMapList.api')
// 创建渠道单图
export const GRAPH_CREATE_CHANNEL_MAP = getApi('channel/addSingleMap.api')
// 修改渠道单图
export const GRAPH_UPDATE_CHANNEL_MAP = getApi('channel/updateSingleMap.api')
// 查询渠道单图
export const GRAPH_QUERY_CHANNEL_MAP = getApi('channel/querySingleMap.api')
// 删除渠道单图
export const GRAPH_DEL_CHANNEL_MAP = getApi('channel/deleteSingleMap.api')
// 获取渠道单图指标
export const GRAPH_GET_CHANNEL_MAP_INDEX = getApi('channel/singleMapIndex.api')
// 分群分析
// 分群选择group/queryGroup.api
export const GRAPH_GET_GROUP_QUERY_GROUPS = getApi('group/queryGroup.api')
// 分群单图列表 group/singleMapList.api
export const GRAPH_GET_GROUP_MAP = getApi('group/singleMapList.api')
// 创建分群单图group/addSingleMap.api
export const GRAPH_CREATE_GROUP_MAP = getApi('group/addSingleMap.api')
// 修改分群单图 group/updateSingleMap.api
export const GRAPH_UPDATE_GROUP_MAP = getApi('group/updateSingleMap.api')
// 查询分群单图 group/querySingleMap.api
export const GRAPH_QUERY_GROUP_MAP = getApi('group/querySingleMap.api')
// 删除分群单图 group/deleteSingleMap.api
export const GRAPH_DEL_GROUP_MAP = getApi('group/deleteSingleMap.api')
// 获取分群单图指标 group/singleMapIndex.api
export const GRAPH_GET_GROUP_MAP_INDEX = getApi('group/singleMapIndex.api')
//

// 圈选 接口
// qrcode生成
export const CIRCLE_GET_QRCODE = getApi('select/QrCodeImg.api')
// 获取web圈选默认的WebUrl
export const GET_WEB_URL = getApi('select/webCheck.api')

// 事件管理接口
// 事件管理-圈选事件  圈选事件展示
export const M_EVENT_GET_CIRCLE_LIST = getApi('select/selectList.api')
// 事件管理-圈选事件  圈选事件指标删除
export const M_EVENT_DEL_CIRCLE_INDEX = getApi('select/deleteSelec.api')
// 事件管理-圈选事件  圈选事件指标修改
export const M_EVENT_UPDATE_CIRCLE_INDEX = getApi('select/updateSelect.api')
// 事件管理-圈选事件  查询指标明细
export const M_EVENT_GET_CIRCLE_DETAIL = getApi('select/indexDetail.api')
// 事件管理-圈选事件  圈选指标趋势
export const M_EVENT_GET_CIRCLE_INDEX = getApi('select/selectIndex.api')

// 事件管理-埋点事件
// 埋点事件展示
export const TRENDEVENT_GET_EVENTS_LIST = getApi('event/eventList.api')
// 新建埋点事件
export const TREND_EVENT_CREATE_EVENTS = getApi('event/addEvent.api')
// 埋点事件名称修改
export const TREND_EVENT_UPDATE_EVENTS_NAME = getApi('event/updateEvent.api')
// 埋点事件删除
export const TREND_EVENT_DEL_EVENTS = getApi('event/deleteEvent.api')
// 埋点事件id是否存在
export const TREND_EVENT_IS_EXIST_EVENT = getApi('event/isExistEvent.api')
// 指标展示
export const TREND_EVENT_GET_INDEX = getApi('event/eventTrend.api')

// 事件管理-复合指标
// 复合指标展示 composite/multiIndexList.api
export const COMPOSITE_GET_MULTI_INDEX_LIST = getApi('composite/multiIndexList.api')
// 获取圈选指标和预定义指标 composite/IndexList.api
export const COMPOSITE_GET_INDEX_LIST = getApi('composite/IndexList.api')
// 创建复合指标 composite/addMultipleIndex.api
export const COMPOSITE_CREATE_MULTI_INDEX_LIST = getApi('composite/addMultipleIndex.api')
// 复合指标删除 composite/deleteMultipleIndex.api
export const COMPOSITE_DEL_MULTI_INDEX_LIST = getApi('composite/deleteMultipleIndex.api')
// 查询指标明细 composite/indexDetail.api
export const COMPOSITE_QUERY_MULTI_INDEX_LIST = getApi('composite/indexDetail.api')
// 修改复合指标  后续改
export const COMPOSITE_UPDATE_MULTI_INDEX_LIST = getApi('composite/modifyMultipleIndex.api')
// 复合指标 统计趋势数据
export const COMPOSITE_TREND = getApi('composite/compositeTrend.api')
//  other/dimension.api  获取维度信息
export const DIMENSION_GET_INFO = getApi('other/dimension.api')
// other/dimensionValueList.api 维度对于值选项
export const DIMENSION_GET_VALUE_LIST = getApi('other/dimensionValueList.api')
/* ******************用户分群************************/
// 获取用户分群列表
export const GET_USER_GROUP_LIST = getApi('userGroup/list.api')
// 创建用户分群
export const ADD_USER_GROUP_INFO = getApi('userGroup/addUserGroup.api')
// 修改用户分群
export const UPDATE_USER_GROUP_INFO = getApi('userGroup/updateUserGroup.api')
// 查询用户分群
export const QUERY_USER_GROUP_INFO = getApi('userGroup/queryUserGroup.api')
// 删除用户分群
export const DELETE_USER_GROUP = getApi('userGroup/deleteUserGroup.api')
// 获取圈选指标、预定义指标及复合指标
export const GET_USER_INDEX_LIST = getApi('userGroup/indexList.api')
// 获取用户细查列表
export const GET_GROUP_DETAIL_LIST = getApi('userGroup/userList.api')
//  获取用户细查具体信息
export const GET_GROUP_DETAIL_QUERY = getApi('userGroup/queryUser.api')
// 获取用户细查具体事件信息
export const GET_GROUP_DETAIL_EVENT_INFO = getApi('userGroup/queryUserEvent.api')

// 数据接口测试
export const HEAD_CELL_DATA = getLocApi('overview/getHeadFourCellData')
// 数据接口 事件分析
export const EVENT_CELL_DATA = getLocApi('eventAnalyze/getEventAnalyzeData')
// 留存分析的数据接口
export const GET_ACTIVE_USER_RETENTION = getLocApi('retention/getActiveUserRetention')

// 渠道管理列表展示
export const GET_SETTING_LIST = getApi('setting/settingList.api')
// 创建渠道副本
export const ADD_SETTING = getApi('setting/addSetting.api')
// 删除渠道副本
export const DELETE_SETTING = getApi('setting/deleteSetting.api')
// 修改渠道副本
export const MODIFY_SETTING = getApi('setting/modifySetting.api')
// 导入渠道副本
export const IMPORT_EXCEL_SETTING = getApi('setting/DealWithExcelData.api')
// 下载模板
export const DOWN_LOAD_URL = `${HOST_BASE}/pathImage/UEM内部测试/渠道管理模板.xlsx`
