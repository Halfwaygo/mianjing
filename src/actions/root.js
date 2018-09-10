import {SHOW_PAGE_LOADING, HIDE_PAGE_LOADING, LOGIN, LOGINS,LOGINNEW,LOGINOUT,BANNER,ISLOGIN, SET_APP_TYPE,SET_APP_TYPES, SET_CALIBERID,SET_APP_VERSION,SET_APP_KEY, SET_DATE, SET_APPID, SET_SONCOMID} from "../constants/actions";
import * as C from "../constants/api";
import Api, {createAction} from "../utils/api";

export default {
    
    showPageLoading: createAction(SHOW_PAGE_LOADING),
    
    hidePageLoading: createAction(HIDE_PAGE_LOADING),

    login: createAction(LOGIN, Api.login),
    //新增加的
    logins: createAction(LOGINS, Api.logins),
    //09
    loginnew: createAction(LOGINNEW, Api.loginnew),
    loginOut: createAction(LOGINOUT, Api.loginOut),


    banner: createAction(BANNER, Api.banner),
    //10月新增banner
    isLogin: createAction(ISLOGIN, Api.isLogin),


    setAppType: createAction(SET_APP_TYPE),
    setAppTypes: createAction(SET_APP_TYPES),

    setAppId: createAction(SET_APPID),

    setCaliberId: createAction(SET_CALIBERID),

    setAppVersion: createAction(SET_APP_VERSION),

    setAppKey: createAction(SET_APP_KEY),

    setSonComId:createAction(SET_SONCOMID),

    setDate: createAction(SET_DATE),
}




