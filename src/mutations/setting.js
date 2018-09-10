import * as C from '../constants/api'
const state = {
    settingTableList: [],
    settingTableCount: 0
}

const mutations = {
    [C.GET_SETTING_LIST] (state, { payload }) {
        state.settingTableList = payload.datas
        state.settingTableCount = payload.count
    }
}

export default {
    state,
    mutations
}
