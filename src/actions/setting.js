import * as C from '../constants/api'
import Api, {createAction} from '../utils/api'

export default {
    // 渠道管理列表
    getSettingList: createAction(C.GET_SETTING_LIST, Api.getSettingList)
}
