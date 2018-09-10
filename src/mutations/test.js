
import * as C from "../constants/actions";
import * as CONST from "../constants/const";
import utils from "../utils/misc";
import {CODE_SUCCESS} from "../constants/api";


const state = {

    questionType:[],
    getPoint:[],
    getPoint2:[],
    getPoint3:[],
    questionDifficulty:[],
    questionPage:[],

};

const mutations = {

    [C.QUESTIONTYPELIST](state, {payload}) {
        //console.log(payload.data,'您好 我是试题库里面的 题型列表')
        state.questionType = payload.data
        state.questionType.unshift({questionTypeId:"",questionTypeName:"不限"})
    },
    [C.QUESTIONPOINTLIST](state, {payload}) {
        //console.log(payload.data)
       // console.log(payload,'您好 我是试题库里面的 知识点列表')
       state.getPoint = payload.data
    },
     [C.QUESTIONPOINTLIST2](state, {payload}) {
        console.log(payload.data)
       // console.log(payload,'您好 我是试题库里面的 知识点列表')
       state.getPoint2 = payload.data
       
    },
     [C.QUESTIONPOINTLIST3](state, {payload}) {
        console.log(payload.data)
       // console.log(payload,'您好 我是试题库里面的 知识点列表')
      
       state.getPoint3 = payload.data
       console.log(payload.data)
    },
    [C.QUESTIONDIFFICULTYLIST](state, {payload}) {
       // console.log(payload.data,'您好 我是试题库里面的 难易度列表')
        state.questionDifficulty = payload.data
        state.questionDifficulty.unshift({"difficultyId":"", "difficultyLevel":"", "difficultyName":"不限"});
        console.log(JSON.stringify(state.questionDifficulty))
    },
    [C.QUESTIONPAGELIST](state, {payload}) {
        //console.log(payload,'您好 我是试题库里面的 试题列表分页')
        //state.questionDifficultyList = payload.data
        state.questionPage = payload.questionByPageResps
    },
    [C.DELETEQUESTION](state, {payload}) {
        //console.log(payload,'您好 我是试题库里面的 删除')
       
    },
    [C.ADDQUESTION](state, {payload}) {
        //console.log(payload,'您好 我是试题库里面的 新建试题')
       
    },
    [C.GETQUESTIONINFO](state, {payload}) {
        console.log(payload,'您好 我是试题库里面的 查看试题详情')
       
    },
    [C.ISQUESTIONEDITSTATUS](state, {payload}) {
        console.log(payload,'您好 我是试题库里面的 校验')
       
    },
    
    



};

export default{
    state,
    mutations
}
