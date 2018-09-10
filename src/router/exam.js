import Exam from '../containers/exam/exam' //考试模板
import ExamList from '../containers/exam/examList' // 考试列表
import Statistic from '../containers/exam/statistic' //考试统计
import CreateMethod from '../containers/exam/createMethod' //选择新建方式
import NewExam from '../containers/exam/newExam' //新建空白试卷
import ImportExam from '../containers/exam/importExam' //选择新建方式
import BasicInfo from '../containers/exam/basicInfo' //填写考试基本信息

import newPaper from '../containers/exam/newPaper' //新建空白试卷  paper里面的
import newExamLibrary from '../containers/exam/newExamLibrary' //新建空白试卷  paper里面的
import editPaper from '../containers/exam/editPaper' //新建空白试卷  paper里面的


export default {
	path:'/exam',
	name:"exam",
	component:Exam,
	redirect:"/exam/list",
	children:[
		{
			path:"list",
			component:ExamList,
			meta:{requireAuth: true }
		},{
			path:"statistic",
			component:Statistic,
			meta:{requireAuth: true }
		},{
			path:"createMethod",
			component:CreateMethod,
			meta:{requireAuth: true }
		},{
			path:"newExam",
			component:NewExam,
			meta:{requireAuth: true }
		},{
			path:"importExam",
			component:ImportExam,
			meta:{requireAuth: true }
		},{
			path:"basicInfo",
			name:'basicInfo',
			component:BasicInfo,
			meta:{requireAuth: true }
		}
		,{
			path:"newPaper",
			name:'newPaper',
			component:newPaper,
			meta:{requireAuth: true }
		}
		,{
			path:"newExamLibrary",
			name:'newExamLibrary',
			component:newExamLibrary,
			meta:{requireAuth: true }
		},{
			path:"editPaper",
			name:'editPaper',
			component:editPaper,
			meta:{requireAuth: true }
		}
	]
}
