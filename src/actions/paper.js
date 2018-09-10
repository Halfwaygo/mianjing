import * as C from "../constants/actions";
import Api, {createAction} from "../utils/api";
//console.log('-----',C.deletePaperById, Api.DELETEPAPERBYID,'--------')
export default {
    
    
    paperClassifyList: createAction(C.PAPERCLASSIFYLIST, Api.paperClassifyList),
    getPaperPage: createAction(C.GETPAPERBYPAGE, Api.getPaperPage),
    deletePaperById: createAction(C.DELETEPAPERBYID, Api.deletePaperById),
    addPaperInFo: createAction(C.ADDPAPERINFO, Api.addPaperInFo),
    updatePaperInFo: createAction(C.UPDATEPAPERINFO, Api.updatePaperInFo),

    searchBindBanner: createAction(C.SEARCHBINDBANNER, Api.searchBindBanner),
    courseBindBanner: createAction(C.COURSEBINDBANNER, Api.courseBindBanner),

   
    
}


