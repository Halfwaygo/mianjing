import * as C from "../constants/actions";
import {} from "../constants/const";


const state = {

    menu: [],
    allApps: [],
    data:{},
    getFirstCategoryData:{},
    getNextCategoryData:[],
    courseadminList:[],
    list:[],
    courseCount:[],
    general:{
      "courseName":'',
      "participantCount":'',
      "accomplishCount":'',
    },
    getCourseType1:{

    },
    categoryCode:"",
    addCourseTypes:[],

    courseDisplayModes:"",   //横屏 竖屏
    courseCoverPicTitle:'',  //封面名称

    courseCoverPicUrl:'',  //页面存放路径  ？？
    courseFileTitle:'',   //课程文件名称？？？
    courseFileUrl:'',   //课程存放路径 没有？？

    courseTestStatus:'',  //课程是否必考状态
    fileSize:'',  //文件大小
    label:'',
    courseDuration:'',
    courseDisplayModes:'',
    courseCoverPicTitles:'',
    courseTestStatuss:'',
    fileSizes:'',
    labels:'',
    courseDurations:'',
    getFirSel:[],


};

const mutations = {

    [C.GET_APPS](state, {payload}) {
        state.allApps = payload.App;
        //console.log(payload.App);
    },

    [C.GETCOURSETYPE](state, {payload}) {
        state.getCourseType1 = payload.data;
        state.getCourseType1['0'] = "不限"
        //state.getCourseType1.unshift("不限")
        state.addCourseTypes = payload.data;
        //console.log(state.addCourseTypes,'-----------------')

    },
    [C.GETFIRSTCATEGORY](state, {payload}) {
        //console.log(payload.data[0],'我是添加课程 里面的一级分类目录 ');
        state.getFirstCategoryData = payload.data;

        //取出参数
        state.categoryCode = payload.data[0].categoryCode
       // console.log(payload.data[0].categoryCode,'hello 我想查看一下 categoryCode')

    },
    [C.GETNEXTCATEGORY](state, {payload}) {
        // console.log(payload,'我是添加课程 里面的次级分类目录 ');
        state.getNextCategoryData = payload.data;

    },
    [C.GETCOURSE](state, {payload}) {
        //console.log(payload.data.categoryList,'我是课程de分类 ')
        state.list = payload.data.course.courseList
        state.courseadminList = payload.data.adminList
        state.courseadminList.unshift({"adminName":"全部","adminAccount":""})

        state.getFirSel = payload.data.categoryList
        state.getFirSel.unshift({
            categoryCode:'',
            categoryId:'',
            categoryName:"不限"
        })
        /*state.getFirSel.unshift({"categoryCode":"","categoryId":"","categoryName":"全部"})*/
       // console.log(state.getFirSel,'我要取到创建人的数据')

    },
    [C.ADDCOURSE](state, {payload}) {
        //console.log(payload,'我是添加课程课程  ');
       // state.list = payload.data.pageInfo

    },
    [C.GETCOURSECOUNT](state, {payload}) {
       // console.log(payload.data.pageInfo[0].courseUserList,'我是 课程统计  ');
        state.courseCount = payload.data.pageInfo[0].courseUserList;
        state.general.courseName = payload.data.pageInfo[0].courseName
        state.general.participantCount = payload.data.pageInfo[0].participantCount
        state.general.accomplishCount = payload.data.pageInfo[0].accomplishCount


    },
    [C.UPDATECOURSE](state, {payload}) {
        console.log(payload,'我是 更新课程  ');
       // state.list = payload.data.pageInfo
    },
    [C.DELETECOURSE](state, {payload}) {
        //console.log(payload,'我是 删除课程  ');
       // state.list = payload.data.pageInfo
    },

    //获取默认的封面
    [C.GETCOURSEDEFAULTPHOTO](state, {payload}) {
        //console.log(payload,'我是   ');
    },
    [C.GETCOURSEBYCOURSEID](state, {payload}) {
        //console.log(payload,'我是 根据课程id获取课程详细信息');
        state.courseDisplayModes = payload.data.courseDisplayMode   //求出来横屏竖屏的值了
        state.courseCoverPicTitle = payload.data.courseCoverPicTitle   //课程封面名称
        state.courseTestStatus = payload.data.courseTestStatus    //课程是否必考状态
        state.fileSize = payload.data.fileSize
        state.label  = payload.data.label
        state.courseDuration  = payload.data.courseDuration

        state.courseDisplayModes = payload.data.courseDisplayMode   //求出来横屏竖屏的值了
        state.courseCoverPicTitles = payload.data.courseCoverPicTitle   //课程封面名称
        state.courseTestStatuss = payload.data.courseTestStatus    //课程是否必考状态
        state.fileSizes = payload.data.fileSize
        state.labels  = payload.data.label
        state.courseDurations  = payload.data.courseDuration
        //console.log(state.courseDisplayModes,'我是 根据课程id获取课程详细信息 de 横屏竖屏')
    },
    [C.VALIDATECOURSE](state, {payload}) {
        //console.log(payload,'我是   ');
    },



};

export default{
    state,
    mutations
}
