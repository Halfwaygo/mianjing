import * as C from "../constants/actions";
import Api, {createAction} from "../utils/api";
//console.log('-----',C.DELETECOURSE, Api.deleteCourse,'--------')
export default {

    getApps: createAction(C.GET_APPS, Api.getApps),

    getCourseType: createAction(C.GETCOURSETYPE, Api.getCourseType),
    getFirstCategory: createAction(C.GETFIRSTCATEGORY, Api.getFirstCategory),
    getNextCategory: createAction(C.GETNEXTCATEGORY, Api.getNextCategory),
    getCourse: createAction(C.GETCOURSE, Api.getCourse),
    addCourse: createAction(C.ADDCOURSE, Api.addCourse),
    getCourseCount: createAction(C.GETCOURSECOUNT, Api.getCourseCount),
    updateCourse: createAction(C.UPDATECOURSE, Api.updateCourse),
    deleteCourse: createAction(C.DELETECOURSE, Api.deleteCourse),
    getCourseDefaultPhoto: createAction(C.GETCOURSEDEFAULTPHOTO, Api.getCourseDefaultPhoto),
    getCourseByCourseId: createAction(C.GETCOURSEBYCOURSEID, Api.getCourseByCourseId),
    validateCourse: createAction(C.VALIDATECOURSE, Api.validateCourse),






}


