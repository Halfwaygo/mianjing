import * as C from "../constants/actions";
import Api, {createAction} from "../utils/api";

export default {
    
    getOverviewData: createAction(C.GET_OVERVIEW_DATA, Api.getOverviewData),

    getHomePage: createAction(C.GETHOMEPAGE, Api.getHomePage),

    
}




