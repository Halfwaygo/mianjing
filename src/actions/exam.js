import * as C from "../constants/actions";
import Api, {createAction} from "../utils/api";
export default {
    getExamInfoExamCondition: createAction(C.GETEXAMINFOBYEXAMCONDITION, Api.getExamInfoByExamCondition),
    getExamDetailInfo: createAction(C.GETEXAMDETAILINFO, Api.getExamDetailInfo),
    deleteExam: createAction(C.DELETEEXAM, Api.deleteExam),
    validateChangeExamInfo: createAction(C.VALIDATECHANGEEXAMINFO, Api.validateChangeExamInfo),
    getExamTotalCountInfo: createAction(C.GETEXAMTOTALCOUNTINFO, Api.getExamTotalCountInfo),
    getExamPersonScoreCountInfo: createAction(C.GETEXAMPERSONSCORECOUNTINFO, Api.getExamPersonScoreCountInfo),
    getCreateBlankPaperInfo: createAction(C.GETCREATEBLANKPAPERINFO, Api.getCreateBlankPaperInfo),
    addQuestionPoint: createAction(C.ADDQUESTIONPOINT, Api.addQuestionPoint),
    createExam: createAction(C.CREATEEXAM, Api.createExam),
    getQuestionByPage: createAction(C.GETQUESTIONBYPAGE, Api.getQuestionByPage),
    getExamDefaultPhoto: createAction(C.GETEXAMDEFAULTPHOTO, Api.getExamDefaultPhoto),
    getAllGroupInfo: createAction(C.GETALLGROUPINFO, Api.getAllGroupInfo),
    getPersonInfoByGroupId: createAction(C.GETPERSONINFOBYGROUPID, Api.getPersonInfoByGroupId),
    getPersonByBlurName: createAction(C.GETPERSONBYBLURNAME, Api.getPersonByBlurName),
    getAllDepartment: createAction(C.GETALLDEPARTMENT, Api.getAllDepartment),
    getIsCheckExamPerson: createAction(C.GETISCHECKEXAMPERSON, Api.getIsCheckExamPerson),
    groupIsExistByGroupName: createAction(C.GROUPISEXISTBYGROUPNAME, Api.groupIsExistByGroupName),
    addGroup: createAction(C.ADDGROUP, Api.addGroup),
    downloadPaperTemplate: createAction(C.DOWNLOADPAPERTEMPLATE, Api.downloadPaperTemplate),
    getQustionsDetailFromBank: createAction(C.GETQUSTIONSDETAILFROMBANK, Api.getQustionsDetailFromBank),
    getPointList: createAction(C.GETPOINTLIST, Api.getPointList),

   
    
}


