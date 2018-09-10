import {SHOW_PAGE_LOADING, HIDE_PAGE_LOADING, LOGIN, LOGINS,  ISLOGIN,LOGINNEW,LOGINOUT,BANNER,SET_APP_TYPE,SET_APP_TYPES, SET_CALIBERID,SET_APP_VERSION,SET_APP_KEY, SET_DATE, SET_APPID} from "../constants/actions";
import * as C from "../constants/api";
import utils from  '../utils/misc';

const state = {
    pageLoading: false,
    //isLogin: false,
    AppType: 2,
    AppTypes:2,
    AppKey: 1,
    AppVersion: 2,
    appid: 12,
    date: [new Date(utils.oneWeekAgo()), new Date()],
};
const mutations = {

    [SHOW_PAGE_LOADING](state){
        state.pageLoading = true;
    },

    [HIDE_PAGE_LOADING](state){
        state.pageLoading = false;
    },

    [LOGIN](state, {payload}){
        //state.isLogin = true;
    },
    //新增加的
    [LOGINS](state, {payload}){
        //state.isLogin = true;
    },
    //09
    [LOGINNEW](state, {payload}){
       // state.isLogin = true;
    },
    [LOGINOUT](state, {payload}){
       // state.isLogin = true;
    },
    [BANNER](state, {payload}){
       // state.isLogin = true;
    },

    //10月新增
    [ISLOGIN](state, {payload}){
       // state.isLogin = true;
    },
    [SET_APP_TYPE](state, {payload}){
        //console.log(payload.num)
        state.AppType = payload.num;
    },
    [SET_APP_TYPES](state, {payload}){
        //console.log(payload.num)
        state.AppTypes = payload.num;
    },

    [SET_APPID](state, {payload}){
        state.appid = payload.num;
    },

    [SET_CALIBERID](state, {payload}){
        state.caliberId = payload.num;
    },
    [SET_APP_VERSION](state, {payload}){
        //console.log(payload.num)
        state.AppVersion = payload.num;
    },
    [SET_APP_KEY](state, {payload}){
        //console.log(payload.num)
        state.AppKey = payload.num;
    },

    [SET_DATE](state, {payload}){
        state.date = payload.date;
    },

};

export default{
    state,
    mutations
}
