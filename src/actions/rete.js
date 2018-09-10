import * as C from "../constants/actions";
import Api, {createAction} from "../utils/api";
//console.log('-----',C.GET_RETE_ANALYSIS,Api.getReteAnalysis,'--------')
export default {
    
    
    getReteAnalysis: createAction(C.GET_RETE_ANALYSIS, Api.getReteAnalysis),

   
    
}


