import * as C from "../constants/actions";
import {} from "../constants/const";


const state = {
   
    //totalMenu: [],
    totalMenu: [
         /*{
            route: "/dataOverview",
            name: "数据概览"
        },
       {
            route: "/operationAnalysis/appGeneral",
            name: "运营分析"
        },
        {
            name: '圈选',
            route: '/circleSelect'
        }*/
    ]

};

const mutations = {

    [C.GET_CONTROL_MENU](state, {payload}) {
        state.totalMenu = payload.totalMenu;
        
        //console.log("mutation 这里成功啦！")
        //console.log(payload.totalMenu);
    },

};

export default{
    state,
    mutations
}
