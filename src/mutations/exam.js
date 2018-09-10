
import * as C from "../constants/actions";
import utils from "../utils/misc";
import {CODE_SUCCESS} from "../constants/api";


const state = {
	pages:0,
    pagess:0,
	examList:[], //考试列表
	statisticInfo:{}, //统计信息
	personInfo:[], //考试人员信息
	paperTypeList:[], // 试卷类型
	//questionPointList:[], // 题目知识点
	questionTypeList:[], // 题型
	difficultList:[],//题目难易程度
	questionByPageResp:[], // 从试题库选题
	photoList:[], //封面图片
	fileIP:"", // 图片所在服务器地址
	GroupList:[], // 族群列表
	personList:[], // 人员信息
	personListByDepart:[], // 人员信息
	departmentList:[], // 公司部门信息
	examInfo:{}, //考试详情 编辑的时候用
	titleDetail:[],
    aa:[],
};

const mutations = {
    [C.GETEXAMINFOBYEXAMCONDITION](state, {payload}) {//获取所有考试信息
        if(payload.code != CODE_SUCCESS){return;}
        state.pages = payload.data.pageCount
        state.examList = payload.data.examInfo
    },[C.GETEXAMDETAILINFO](state, {payload}) {// 获取选择的试卷详情
    	if(payload.code != CODE_SUCCESS){return;}
    	state.examInfo = payload.data
    	state.paperTypeList = payload.data.paperTypeList
    },[C.DELETEEXAM](state, {payload}) {//删除考试
    	
    },[C.VALIDATECHANGEEXAMINFO](state, {payload}) {//校验本次考试是否能进行编辑

    },[C.GETEXAMTOTALCOUNTINFO](state, {payload}) {//获取某一考试的总体统计信息
        if(payload.code != CODE_SUCCESS){return;}
        state.statisticInfo = payload.data
        state.aa = payload.data.qustionList
    },
    [C.GETEXAMPERSONSCORECOUNTINFO](state, {payload}) {//考试人员得分信息统计
        if(payload.code != CODE_SUCCESS){return;}
        state.pages = payload.data.pageCount
        state.personInfo = payload.data.personInfo
    },
    [C.GETCREATEBLANKPAPERINFO](state, {payload}) {// 创建空白试卷所需信息
        if(payload.code != CODE_SUCCESS){return;}
        state.paperTypeList = payload.data.paperTypeList
        state.questionTypeList = payload.data.questionTypeList
        state.difficultList = payload.data.difficultList
    },
    [C.ADDQUESTIONPOINT](state, {payload}) {//添加试题知识点
        if(payload.code != CODE_SUCCESS){return;}
        //state.questionPointList = state.questionPointList.concat(payload.data)
    },
    [C.CREATEEXAM](state, {payload}) {// 创建考试信息
        if(payload.code != CODE_SUCCESS){return;}
    },
    [C.GETQUESTIONBYPAGE](state, {payload}) {// 从试题库中获取题目信息
        if(payload.code != CODE_SUCCESS){return;}
        state.questionByPageResp = payload.data.questionByPageResp
        //state.pages = Math.ceil(payload.data/10)
        state.pagess = payload.data.totalNum
    },
    [C.GETEXAMDEFAULTPHOTO](state, {payload}) {// 获取默认考试封面图片
        if(payload.code != CODE_SUCCESS){return;}
        state.photoList = payload.data.photoList
        state.fileIP =  payload.data.fileIP
    },
    [C.GETALLGROUPINFO](state, {payload}) {// 获取族群列表
        if(payload.code != CODE_SUCCESS){return;}
        state.GroupList = payload.data
    },
    [C.GETPERSONINFOBYGROUPID](state, {payload}) {// 通过族群id获取指定族群人员信息
        if(payload.code != CODE_SUCCESS){return;}
        state.personList = payload.data
    },
    [C.GETPERSONBYBLURNAME](state, {payload}) {// 根据考试id，人名模糊查找获取某公司某部门下人员名单
        // if(payload.code != CODE_SUCCESS){return;}
        // state.personList = payload.data
        if(payload.code != CODE_SUCCESS){return;}

        state.personList = payload.data;

    },
    [C.GETALLDEPARTMENT](state, {payload}) {// 获取公司、部门分布信息接口
        if(payload.code != CODE_SUCCESS){return;}
        state.departmentList = payload.data
    },
    [C.GETISCHECKEXAMPERSON](state, {payload}) {// 7.9根据考试id获取某公司某部门下人员名单接口
        if(payload.code != CODE_SUCCESS) {
            return;
        }

        let data = payload.data;
        if (data.length <= 0) {
            state.personList = [];
            return;
        }

        let personListByDepart = [];

        for (let i = 0; i < data.length; i++) {
            let personDepartmentList = data[i].personDepartmentList;

            for (let j = 0; j < personDepartmentList.length; j++) {
                let examCoursePersonList = personDepartmentList[j].examCoursePersonList;

                for (let k = 0; k < examCoursePersonList.length; k++) {
                    personListByDepart.push({
                        personName: examCoursePersonList[k].personName,
                        account: examCoursePersonList[k].account,
                        nickname: examCoursePersonList[k].nickname
                    })
                }
            }
        }

        state.personList = personListByDepart;
    },
    [C.GROUPISEXISTBYGROUPNAME](state, {payload}) {// 通过族群名称判断族群是否存在
    },
    [C.ADDGROUP](state, {payload}) {// 新增/编辑族群
    },
    [C.DOWNLOADPAPERTEMPLATE](state, {payload}) {// 下载考试试卷EXCEL模板接口
    },
    [C.GETQUSTIONSDETAILFROMBANK](state, {payload}) {// 从题库获取选择题目的详细信息接口
    	if(payload.code != CODE_SUCCESS){return;}
        state.titleDetail = payload.data
    },
    [C.GETPOINTLIST](state, {payload}) {// 信息接口知识点
        if(payload.code != CODE_SUCCESS){return;}
        //state.questionPointList = payload.data
    },
    [C.EMPTY_PERSON_LIST](state) {
        state.personList = [];
    }
   
};

export default{
    state,
    mutations
}
