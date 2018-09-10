import * as C from "../constants/actions";
import Api, {createAction} from "../utils/api";
//console.log('-----',C.SEARCHBINDBANNER, Api.searchBindBanner,'--------')
export default {
    
    
    //getReteAnalysis: createAction(C.GET_RETE_ANALYSIS, Api.getReteAnalysis),
    listBanner: createAction(C.LISTBANNER, Api.listBanner),
    deleteBanner: createAction(C.DELETEBANNER, Api.deleteBanner),
    searchBindBanner: createAction(C.SEARCHBINDBANNER, Api.searchBindBanner),
    courseBindBanner: createAction(C.COURSEBINDBANNER, Api.courseBindBanner),
    upload: createAction(C.UPLOAD, Api.upload),
    updateBindBanner: createAction(C.UPDATEBINDBANNER, Api.updateBindBanner),
    

   
    
}


