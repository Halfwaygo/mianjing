import * as C from "../constants/actions";
import Api, {createAction} from "../utils/api";

export default {
    getControlMenu: createAction(C.GET_CONTROL_MENU, Api.getControlMenu),


    
    /*getApps: createAction(C.GET_APPS, Api.getApps),

    //timebucketAnalysisData   例子
    getAppGeneralExceptionAnalysis: createAction(C.GET_APP_GENERAL_EXCEPTION_ANALYSIS, Api.getAppGeneralExceptionAnalysis),

	getAppGeneralAbnormalExtend: createAction(C.GET_APP_GENERAL_ABNORMAL_EXTEND, Api.getAppGeneralAbnormalExtend),

    getAppGeneralAbnormalActive: createAction(C.GET_APP_GENERAL_ABNORMAL_ACTIVE, Api.getAppGeneralAbnormalActive),

    getAppGeneralAbnormalModel: createAction(C.GET_APP_GENERAL_ABNORMAL_MODEL, Api.getAppGeneralAbnormalModel),*/
       
    
}


