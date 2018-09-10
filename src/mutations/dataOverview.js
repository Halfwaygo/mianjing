
import * as C from "../constants/actions";
import * as CONST from "../constants/const";
import utils from "../utils/misc";
import {CODE_SUCCESS} from "../constants/api";


const state = {

    examArrangeRespList: [

    ],
    examCourseRespList:[],
    list:[
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

};

const mutations = {

    [C.GETHOMEPAGE](state, {payload}) {//数据就是从这里取出来的
        if(payload.code != CODE_SUCCESS){return;}
        //console.log(payload.data.examArrangeRespList);

        state.examArrangeRespList = payload.data.examArrangeRespList;
        state.examCourseRespList = payload.data.examCourseRespList;

        state.list = payload.list;



    },



};

export default{
    state,
    mutations
}
