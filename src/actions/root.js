import * as AC from '../constants/actions'
import * as C from '../constants/api'
import Api, { createAction } from '../utils/api'

export default {
    showPageLoading: createAction(AC.SHOW_PAGE_LOADING),

    hidePageLoading: createAction(AC.HIDE_PAGE_LOADING),

    changeCurrentUser: createAction(AC.CHANGE_CURRENT_USER, user => Promise.resolve(user)),

    // 获取web圈选默认页面url
    getWebUrl: createAction(C.GET_WEB_URL, Api.getWebUrl),

    migrateAppList: createAction(AC.APP_LIST_MIGRATION, apps => Promise.resolve(apps)),

    // 从本地缓存里面获取app列表
    loadMigratedAppList: createAction(AC.MIGRATED_APP_LIST_LOADED),

    changeAppId: createAction(AC.APP_ID_CHANGED, params => Promise.resolve(params))
}
