// export const CODE_SUCCESS = 200;
// export const CODE_FAIL = 400;
// export const STATUS_UNLOGIN = 4000;

export const CODE_SUCCESS = 0;
export const CODE_STATUS_OK = 200;
export const CODE_STATUS_FAIL = 400;
export const CODE_SESSION_TIME_OUT = 600;

export const COOKIE_WELCOME_FLAG = "welcome_flag";
export const COOKIE_SESSION_ID = "sessionId";

//export const baseUrl = 'http://39.156.1.5:18000';

//window.config.context = 'http://39.156.1.5:18000';

//window.config.context = 'http://10.124.2.27:18080';   //测试版(11-17)
//window.config.context = 'http://10.124.2.27:18079';
//window.config.context = 'https://uemweb.migu.cn:18000'; //域名版

// window.config.context = 'https://garnet.migu.cn:16406';


const getApiJson = (url) => `${window.config.context}/${url}`;
const getApiHtml = (url) => `${window.config.context}/${url}.html`;


//05-02
export const LOGINNEW = getApiJson('exam/admin/loginCheck.do');  //登录
export const LOGINOUT = getApiJson('login/logout.do');   //退出


export const BANNER = getApiJson('classroom/column/getAllColumns.do');


export const RSA_MODULUS = [
    '008ec56d6281753fc8d2',
    'd1e6ce0f93c38036e1db',
    '7b53d1d3ce9a65f2bfc3',
    'b385640c61154c7935c4',
    'eeea900e982092fe4ae8',
    'd41451a56a18707ec195',
    'd5c5deb5bdef1b891f5f',
    '358c65c6e6f27971be03',
    'fff66e0314fda64302e7',
    'cf530b35a8e13fdf0b18',
    '6d593e21f9000da84c84',
    '058b9924287d3eab698e',
    'c281d9c98646cbea05'
].join('');
export const RSA_MODULUSNEW = [
    '00959aceccb1408211c0d541712b418929c09a1cefe7d6e93d88bb59a4ec3c6bef91da9fa0ecaf9ee1bf24469ee9dbdb8b5aa6fb9cb4bbe7ea9e982da712f87c60c67be4c46a8563e724dbb0950d398f7594b3314df8120aa0639cdc12d0ab2a9d7e263422c3fa887630335147c4b6b72f3066e1568d68bd01a97967ee7190e1b1'
].join('');
export const RSA_COMPONENT = '010001';
export const RSA_KEY_LENGTH = 1024;

//首页
export const GETHOMEPAGE = getApiJson('exam/home/getHomePageInfo.do');



//轮播banner的接口
//export const LISTBANNER = getApiJson('classroom/banner/listBannerCourse.do');
export const CONNECTUPLOAD = getApiJson('classroom/course/tryConnectCeph.do');
export const DELETEBANNER = getApiJson('classroom/banner/deleteBanner.do');
export const SEARCHBINDBANNER = getApiJson('classroom/banner/searchBindBannerByCondition.do');
export const COURSEBINDBANNER = getApiJson('classroom/banner/courseBindBanners.do');
export const UPLOAD = getApiJson('classroom/course/uploadFile.do');
export const UPDATEBINDBANNER = getApiJson('classroom/banner/updateBindBanner.do');  //更新banner
export const CHANGEBANNERORDER = getApiJson('classroom/banner/changeOrder.do');   //banner列表排序

//课程
export const GETCOURSETYPE = getApiJson('classroom/course/getCourseType.do');
export const GETFIRSTCATEGORY = getApiJson('classroom/category/getFirstCategory.do');
export const GETNEXTCATEGORY = getApiJson('classroom/category/getNextCategory.do');
export const GETCOURSE = getApiJson('classroom/course/getCourseByCondition.do');
export const ADDCOURSE = getApiJson('classroom/course/addCourse.do');
export const GETCOURSECOUNT = getApiJson('classroom/course/getCourseCountByCondtion.do');
export const UPDATECOURSE = getApiJson('classroom/course/updateCourseInfo.do');
export const DELETECOURSE = getApiJson('classroom/course/deleteCourseByCouresId.do');
export const GETCOURSEDEFAULTPHOTO = getApiJson('classroom/course/getCourseDefaultPhoto.do');
export const GETCOURSEBYCOURSEID = getApiJson('classroom/course/getCourseByCourseId.do');
export const VALIDATECOURSE = getApiJson('classroom/course/validateCourseByCouresIdAndAdmin.do');//课程删除校验
export const WHITECOURSEID= getApiJson('classroom/course/addToWhitelist.do');
export const LOOKWHITEPERSON= getApiJson('classroom/course/lookWhiteAndBlackListByCourseId.do');
// 添加所属分类
export const ADDCATEGOTY= getApiJson('classroom/category/addCategory.do');

//试题库
export const QUESTIONTYPELIST = getApiJson('exam/question/bank/getTypeList.do');
export const QUESTIONPOINTLIST = getApiJson('exam/question/bank/getPointList.do');
export const QUESTIONPOINTLIST2 = getApiJson('exam/question/bank/getPointList.do');
export const QUESTIONPOINTLIST3 = getApiJson('exam/question/bank/getPointList.do');

export const QUESTIONDIFFICULTYLIST = getApiJson('exam/question/bank/getDifficultyLevelList.do');
export const QUESTIONPAGELIST = getApiJson('exam/question/bank/');
export const DELETEQUESTION = getApiJson('exam/question/bank/deleteQuestionById.do');
export const ADDQUESTION = getApiJson('exam/question/bank/addQuestionInfo.do');
export const ADDQUESTIONLIST = getApiJson('exam/question/bank/addQuestionList.do');
export const UPDATEQUESTION = getApiJson('exam/question/bank/updateQuestionInfo.do');
export const GETQUESTIONINFO = getApiJson('exam/question/bank/getQuestionInfo.do');
export const ISQUESTIONEDITSTATUS = getApiJson('exam/question/bank/validateQuestionEditStatus.do');


//试卷库
export const PAPERCLASSIFYLIST = getApiJson('exam/paper/bank/getPaperClassifyList.do');
export const GETPAPERBYPAGE = getApiJson('exam/paper/bank/getPaperByPage.do');
export const DELETEPAPERBYID = getApiJson('exam/paper/bank/deletePaperById.do');  //删除试卷
export const ADDPAPERINFO = getApiJson('exam/paper/bank/addPaperInfo.do');  //新建空白试卷
export const UPDATEPAPERINFO = getApiJson('exam/paper/bank/updatePaperInfo.do');  //编辑试卷
// 获取试卷库详情
export const GETPAPERDETAILINFO = getApiJson('exam/paper/bank/getPaperInfo.do');
// 添加试卷分类
export const ADDPAPERCLASS = getApiJson('exam/paper/addPaperType.do');


//考试详情
export const IMPORTEXCELPERSON = getApiJson('exam/temp/analysisImportantPersonExcelShowAddPerson.do'); // 导入考试人员名单
export const GETEXAMINFOBYEXAMCONDITION = getApiJson('exam/temp/getExamInfoByExamCondition.do'); //考试列表
export const GETEXAMDETAILINFO = getApiJson('exam/temp/getExamDetailInfo.do'); //根据考试id查询试卷详细信息
export const DELETEEXAM = getApiJson('exam/temp/deleteExam.do'); //删除考试
export const VALIDATECHANGEEXAMINFO = getApiJson('exam/temp/validateChangeExamInfo.do'); //校验本次考试是否能进行编辑
export const GETEXAMTOTALCOUNTINFO = getApiJson('exam/temp/getExamTotalCountInfo.do'); //统计信息
export const GETEXAMPERSONSCORECOUNTINFO = getApiJson('exam/temp/getExamPersonScoreCountInfo.do'); //考试人员信息
export const GETCREATEBLANKPAPERINFO = getApiJson('exam/temp/getCreateBlankPaperInfo.do'); //获取生成空白试卷需要信息
export const ADDQUESTIONPOINT = getApiJson('exam/question/bank/addQuestionPoint.do'); //添加试题知识点
export const CREATEEXAM = getApiJson('exam/temp/createExam.do'); //创建考试信息
export const GETQUESTIONBYPAGE = getApiJson('exam/question/bank/getQuestionByPage.do'); //从试题库选题
export const GETEXAMDEFAULTPHOTO = getApiJson('exam/photo/getExamDefaultPhoto.do'); //获取默认考试封面图片
export const GETALLGROUPINFO = getApiJson('exam/course/getAllGroupInfo.do'); //获取族群列表
export const GETPERSONINFOBYGROUPID = getApiJson('exam/course/getPersonInfoByGroupId.do'); //通过族群id获取指定族群人员信息
export const GETPERSONBYBLURNAME = getApiJson('exam/course/getPersonByBlurName.do'); //根据考试id，人名模糊查找获取某公司某部门下人员名单
export const GETALLDEPARTMENT = getApiJson('exam/course/getAllDepartment.do'); //获取公司、部门分布信息接口
export const GETISCHECKEXAMPERSON = getApiJson('exam/course/getIsCheckExamPerson.do'); //7.9根据考试id获取某公司某部门下人员名单接口
export const GROUPISEXISTBYGROUPNAME = getApiJson('exam/course/groupIsExistByGroupName.do'); //通过族群名称判断族群是否存在
export const ADDGROUP = getApiJson('exam/course/addGroup.do'); //新增/编辑族群
export const DOWNLOADPAPERTEMPLATE = getApiJson('exam/paper/bank/downloadPaperTemplate.do'); //下载考试试卷EXCEL模板接口
export const DOWNLOADPERSONTEMPLATE = getApiJson('exam/temp/downloadPersonTemplate.do'); // 下载导入人员模板
export const SAVEEXAMDEFAULTPHOTO = getApiJson('exam/photo/saveExamDefaultPhoto.do');// 上传考试封面图像
export const UPLOADPAPERBANK = getApiJson('exam/paper/bank/uploadPaperBank.do');// 上传考试EXcel
export const UPLOADPQUESTIONBANK = getApiJson('exam/question/bank/uploadQuestionBank.do');// 上传试题EXcel
export const GETQUSTIONSDETAILFROMBANK = getApiJson('exam/temp/getQustionsDetailFromBank.do');// 7.1从题库获取选择题目的详细信息接口
export const GETPOINTLIST = getApiJson('exam/question/bank/getPointList.do');// 知识点接口





/* 数据概览 */
export const GET_OVERVIEW_DATA = getApiJson('index/');
export const GET_OVERVIEW_COMPARE_DATA = getApiJson('comparedate/');


/* 导航栏菜单 */ //getControlMenu
//export const GET_CONTROL_MENU = getApiJson('getControlMenu.json');
export const GET_CONTROL_MENU = 'https://www.easy-mock.com/mock/5a4e4c1316d2051b06fd2cc8/zhouying/getControlMenu.json';
