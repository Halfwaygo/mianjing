import * as C from '../constants/api'
import Api, {createAction} from '../utils/api'

export default {
    // 用户登录
    login: createAction(C.USER_LOGIN, Api.login),
    // 查询APP展现管理下的分类列表
    queryPageCategory: createAction(C.PAGE_CATEGORY_QUERY, Api.queryPageCategory)

}
