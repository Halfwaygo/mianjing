import * as AC from '../constants/actions'
import * as C from '../constants/api'
const state = {
    pageLoading: false,
    currentUser: '',
    appId: sessionStorage.getItem('appId') || '',
    webUrl: {
        isCircle: 'false',
        url: ''
    },
    platform: '0',
    // 应用列表
    appList: []
}
const mutations = {

    [AC.SHOW_PAGE_LOADING](state) {
        state.pageLoading = true
    },

    [AC.HIDE_PAGE_LOADING](state) {
        state.pageLoading = false
    },

    [AC.CHANGE_CURRENT_USER](state, {payload}) {
        state.currentUser = payload
    },

    [C.GET_WEB_URL](state, {payload}) {
        state.webUrl = payload.data
    },

    [AC.APP_LIST_MIGRATION](state, {payload}) {
        state.appList = payload
        sessionStorage.setItem('migratedApps', JSON.stringify(payload))
        const defaultApp = payload[0]
        state.appId = `${defaultApp.appId}`
        state.platform = `${defaultApp.webMark}`
    },

    [AC.MIGRATED_APP_LIST_LOADED](state) {
        const json = sessionStorage.getItem('migratedApps') || '[]'
        const appId = sessionStorage.getItem('appId') || (json[0] && `${json[0].appId}`)
        const appList = JSON.parse(json)
        const filterApp = appList.filter(item => `${item.appId}` === appId)[0]
        state.appList = appList
        if (filterApp) {
            state.platform = `${filterApp.webMark}`
            state.appId = appId
        }
    },

    [AC.APP_ID_CHANGED](state, {payload}) {
        const {appId, webMark} = payload
        sessionStorage.setItem('appId', appId)
        state.platform = `${webMark}`
        state.appId = `${appId}`
    }
}

export default{
    state,
    mutations
}
