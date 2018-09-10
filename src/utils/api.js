import "es6-promise";
import Axios from 'axios'
import {Message} from "element-ui";
import * as C from "../constants/api";
import utils from './misc'

const METHODS = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
};

// 拦截ajax请求的数据发送，给没个请求加上CSRF TOKEN

Axios.interceptors.request.use(config => {
    const hexDigest = utils.md5(config.url);
    config.headers['reqDigest'] = hexDigest;
    return config;
}, error => Promise.reject(error));

Axios.interceptors.response.use(response => {
    let {data: resp} = response;

    return new Promise((resolve, reject) => {
        const {code} = resp;
        if (code == C.CODE_SUCCESS) {
            //resolve(resp.data);
            resolve(resp);
        } else if (code == C.NOT_LOGIN) {
            const context =  __DEV__ ?  '/': `${window.config.context}/static/solution/index.html`;
            window.location.href = `${context}#/login?next=${encodeURIComponent(window.location.href)}`
        } else {
            if(resp.code === 606 && process.env.NODE_ENV !== 'development') {
              window.location.href = `${window.config.context}/static/solution/index.html#/login`
            }
            if(resp.code === 817) {
               window.location.href = `${window.config.context}/static/solution/index.html#/login`
            }
            resp.message && Message.warning({message: resp.message, showClose: true});
            reject(resp);
        }
    });

}, error => {
    const message = error.response ? '服务端报错，请重试！' : '网络无法连接，请检查网络！'
    Message.warning({message: message, showClose: true});
    return Promise.reject(error);
})

const request = (url, params = {}, headers = {}, method = METHODS.GET) => {
    console.log(JSON.stringify(params))
    if(params.hasOwnProperty('kind')) {
        if(isNaN(params.kind)) {
            window.location.href = '#/login'
            return
        }
    }
    let options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            ...headers,
        },
        method: method
    };
    if(process.env.NODE_ENV === 'development') {
        if(__DEV__) {
            // 本地开发模式联调时，设置特殊的请求头方便远程调试，否则后台过滤器会进行refer拦截
            options.headers.__DEBUG__DEV__ = 1;
            // options.withCredentials = true;
        }
    }
    if (method === METHODS.POST || method == METHODS.PUT) {
        options.data = params;
    } else if (method === METHODS.GET || method == METHODS.DELETE) {
        options.params = {...params, _t: Math.random()};
    }

    return Axios({url, ...options});

};

const post = (url, params, headers) => request(url, params, headers, METHODS.POST);

export const createAction = (type, payloadCreator, metaCreator) => {
    const identity = (...args) => args[0];
    const isFunc = (fn) => typeof(fn) === 'function';
    const isPromise = obj => typeof(obj) === 'object' && isFunc(obj.then);
    const finalPayloadCreator = isFunc(payloadCreator) ? payloadCreator : identity;

    return ({commit, dispatch}, ...args) => {
        const payload = finalPayloadCreator(...args);
        const action = {type, payload};

        if (isFunc(metaCreator)) {
            action.meta = metaCreator(...args);
        }

        if (isPromise(payload)) {
            return payload.then(result => {
                commit(type, Object.assign(action, {payload: result}));
                return result;
            }).catch(error => {
                dispatch('hidePageLoading');
                return Promise.reject(error);
            });
        }

        return commit(type, Object.assign(action, {payload}));
    };
};

export default {

    loginnew: params => post(C.LOGINNEW, params),
    loginOut: params => post(C.LOGINOUT, params),


    banner: params => request(C.BANNER, params),
    bannerChageOrder: params => post(C.CHANGEBANNERORDER, params),

    //首页
    getHomePage: params => request(C.GETHOMEPAGE, params),
    // 连接一次上传接口
    connectUpload: params => request(C.CONNECTUPLOAD, params),
    //轮播banner的接口
    listBanner: params => request(C.LISTBANNER, params),
    deleteBanner: params => request(C.DELETEBANNER, params),
    searchBindBanner: params => post(C.SEARCHBINDBANNER, params),
    courseBindBanner: params => post(C.COURSEBINDBANNER, params),
    upload: params => post(C.UPLOAD, params),
    updateBindBanner: params => post(C.UPDATEBINDBANNER, params),

    //课程的接口
    getCourseType: params => request(C.GETCOURSETYPE, params),
    getFirstCategory: params => request(C.GETFIRSTCATEGORY, params),
    getNextCategory: params => request(C.GETNEXTCATEGORY, params),
    getCourse: params => post(C.GETCOURSE, params),
    addCourse: params => post(C.ADDCOURSE, params),
    getCourseCount: params => post(C.GETCOURSECOUNT, params),
    updateCourse: params => post(C.UPDATECOURSE, params),
    deleteCourse: params => request(C.DELETECOURSE, params),
    getCourseDefaultPhoto: params => request(C.GETCOURSEDEFAULTPHOTO, params),
    getCourseByCourseId: params => request(C.GETCOURSEBYCOURSEID, params),
    validateCourse: params => request(C.VALIDATECOURSE, params),
    bindwWhiteCourseId: params => post(C.WHITECOURSEID, params),
    lookWhitePerson: params => request(C.LOOKWHITEPERSON, params),
    addCategory: params => post(C.ADDCATEGOTY, params),

    //试题库的接口
    questionTypeList: params => request(C.QUESTIONTYPELIST, params),
    questionPointList: params => request(C.QUESTIONPOINTLIST, params),
    questionPointList2: params => request(C.QUESTIONPOINTLIST2, params),
    questionPointList3: params => request(C.QUESTIONPOINTLIST3, params),

    questionDifficultyList: params => request(C.QUESTIONDIFFICULTYLIST, params),
    questionPageList: params => post(C.QUESTIONPAGELIST, params),
    deleteQuestion: params => request(C.DELETEQUESTION, params),
    // 新增单个试题
    addQuestion: params => post(C.ADDQUESTION, params),
    // 新增多个试题
    addQuestionList: params => post(C.ADDQUESTIONLIST, params),
    // 修改试题
    updateQuestion: params => post(C.UPDATEQUESTION, params),
    getQuestionInfo: params => request(C.GETQUESTIONINFO, params),
    isQuestionEditStatus: params => request(C.ISQUESTIONEDITSTATUS, params),


    //试卷库的接口
    paperClassifyList: params => request(C.PAPERCLASSIFYLIST, params),
    getPaperPage: params => post(C.GETPAPERBYPAGE, params),
    deletePaperById: params => request(C.DELETEPAPERBYID, params),
    addPaperInFo: params => post(C.ADDPAPERINFO, params),  //新建试卷
    updatePaperInFo: params => post(C.UPDATEPAPERINFO, params),  //编辑试卷
    getPaperDetailInfo: params => request(C.GETPAPERDETAILINFO, params),  //详情试卷
    addPaperClass: params => post(C.ADDPAPERCLASS, params),

    //考试详情
    importExcelPerson: params => post(C.IMPORTEXCELPERSON, params),// 导入考试人员
    getExamInfoByExamCondition: params => post(C.GETEXAMINFOBYEXAMCONDITION, params),
    getExamDetailInfo: params => request(C.GETEXAMDETAILINFO, params),
    deleteExam: params => request(C.DELETEEXAM, params),
    validateChangeExamInfo: params => request(C.VALIDATECHANGEEXAMINFO, params),
    getExamTotalCountInfo: params => request(C.GETEXAMTOTALCOUNTINFO, params),
    getExamPersonScoreCountInfo: params => post(C.GETEXAMPERSONSCORECOUNTINFO, params),
    getCreateBlankPaperInfo: params => request(C.GETCREATEBLANKPAPERINFO, params),
    addQuestionPoint: params => request(C.ADDQUESTIONPOINT, params),
    createExam: params => post(C.CREATEEXAM, params),
    getQuestionByPage: params => post(C.GETQUESTIONBYPAGE, params),
    getExamDefaultPhoto: params => request(C.GETEXAMDEFAULTPHOTO, params),
    getAllGroupInfo: params => request(C.GETALLGROUPINFO, params),
    getPersonInfoByGroupId: params => request(C.GETPERSONINFOBYGROUPID, params),
    getPersonByBlurName: params => post(C.GETPERSONBYBLURNAME, params),
    getAllDepartment: params => request(C.GETALLDEPARTMENT, params),
    getIsCheckExamPerson: params => post(C.GETISCHECKEXAMPERSON, params),
    groupIsExistByGroupName: params => request(C.GROUPISEXISTBYGROUPNAME, params),
    addGroup: params => post(C.ADDGROUP, params),
    downloadPaperTemplate: params => request(C.DOWNLOADPAPERTEMPLATE, params),
    downloadPersonTemplate: params => request(C.DOWNLOADPERSONTEMPLATE, params),
    getQustionsDetailFromBank: params => request(C.GETQUSTIONSDETAILFROMBANK, params),
    getPointList: params => request(C.GETPOINTLIST, params),

};




//loginnew: params => post(C.LOGINNEW, params),
