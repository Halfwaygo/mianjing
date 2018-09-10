import * as C from "../constants/actions";
import Api, {createAction} from "../utils/api";

export default {
    
    questionTypeList: createAction(C.QUESTIONTYPELIST, Api.questionTypeList),
    questionPointList: createAction(C.QUESTIONPOINTLIST, Api.questionPointList),
    questionPointList2: createAction(C.QUESTIONPOINTLIST2, Api.questionPointList2),
    questionPointList3: createAction(C.QUESTIONPOINTLIST3, Api.questionPointList3),


    questionDifficultyList: createAction(C.QUESTIONDIFFICULTYLIST, Api.questionDifficultyList),
    questionPageList: createAction(C.QUESTIONPAGELIST, Api.questionPageList),
    deleteQuestion: createAction(C.DELETEQUESTION, Api.deleteQuestion),
    addQuestion: createAction(C.ADDQUESTION, Api.addQuestion),
    getQuestionInfo: createAction(C.GETQUESTIONINFO, Api.getQuestionInfo),
    isQuestionEditStatus: createAction(C.ISQUESTIONEDITSTATUS, Api.isQuestionEditStatus),
    //deleteQuestion: createAction(C.DELETEQUESTION, Api.deleteQuestion),

    
    
}




