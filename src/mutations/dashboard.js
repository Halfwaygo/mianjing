import * as C from '../constants/api'

const state = {
    // 页面列表
    pageList: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        result: []
    },
    pageCategories: [{}, {}]
}

const mutations = {
    [C.USER_LOGIN](state, { payload }) {
        console.log(payload)
    },
    [C.PAGE_CATEGORY_QUERY](state, { payload }) {
        consle.log('3456787654')
        state.pageCategories = payload
    }
}

export default {
    state,
    mutations
}
