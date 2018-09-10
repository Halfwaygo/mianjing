import * as C from "../constants/actions";
import * as CONST from "../constants/const";
import utils from "../utils/misc";
import {CODE_SUCCESS} from "../constants/api";


const state = {
    list: [
      {
            "YestIncUser": 17258,
            "YestStartUp": 1301020,
            "name": "咪咕阅读",
            "type": "ios",
            "YestUser": 115369,
            "CountUser": 344289,
            "url": "/app-generals/14.html"
        },
        {
            "YestIncUser": 12361,
            "YestStartUp": 248532,
            "name": "咪咕音乐",
            "type": "ios",
            "YestUser": 48391,
            "CountUser": 223230,
            "url": "/app-generals/4.html"
        },
    ],
    paperClassify:{},

};

const mutations = {

    [C.PAPERCLASSIFYLIST](state, {payload}) {//数据就是从这里取出来的
        if(payload.code != CODE_SUCCESS){return;}
        state.paperClassify = payload.data;
         // 添加一个'全部'的对象
        state.paperClassify.unshift({
            paperTypeName: '全部',
            paperTypeId: ''
        })
    },

    [C.GETPAPERBYPAGE](state, {payload}) {//数据就是从这里取出来的
        if(payload.code != CODE_SUCCESS){return;}
       //console.log(payload,'我是试卷库 的列表');
        //state.data = payload.data;
       // console.log(state.list);

    },
    [C.DELETEPAPERBYID](state, {payload}) {
        if(payload.code != CODE_SUCCESS){return;}
       //console.log(payload,'我是试卷库 的列表');
        //state.data = payload.data;
       // console.log(state.list);

    },
    [C.ADDPAPERINFO](state, {payload}) {
        if(payload.code != CODE_SUCCESS){return;}

    },
    [C.UPDATEPAPERINFO](state, {payload}) {
        if(payload.code != CODE_SUCCESS){return;}


    },



};

export default{
    state,
    mutations
}
