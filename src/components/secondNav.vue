 <template>
    <div class="second-nav">
        <el-menu :default-active="activeIndex" theme="dark"  mode="horizontal" class="el-menu-horizontal" v-bind:router="true" @select="selectMenu" unique-opened  @open="ajustNavSide" stye="background:#292c31!important;" >
            <el-menu-item index="1" >
                <i class="nav-icon general"></i>
                首页
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
     import {eventBus,num} from '../eventBus'
    import {mapActions, mapState} from 'vuex';

    export default{
        name: 'SecondNav',
        data() {
                //isOpened:true
            return {
                activeIndex: "1",
                userName: 'admin',
                flag1: '首页',
                flag2: '',
                flag3: '',
                url: '',
                event:'',
                'unique-opened':true,
            }
        },

        components: {
        },

        beforeMount() {
            this.changeMenu()
        },

        watch:{
            '$route'(to, from){
                this.changeMenu()
            }
        },

        mounted() {
            this.ajustNavSide();
            this.changeMenu();
        },

        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
        },

        computed: {
            ...mapState({
            }),
        },

        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            changeshow(){
                eventBus.$emit('change','true')
            },
            changeshowExam(){
                eventBus.$emit('change','true')
            },
            changeshowDataOverview(){
                this.$router.push('/dataOverview');
            },
            changeMenu(){
                let path = this.$route.path
                this.flag1 = this.flag2 = this.flag3 = '';

                if(path == '/dataOverview') {
                    this.flag1 = '首页';
                } else if (path == '/exam/createMethod') {
                    this.flag1 = '考试';
                    this.flag2 = '考试详情';
                    this.flag3 = '创建考试';
                    this.url = '/exam/list'
                } else if(path == '/exam/newExam') {
                    this.flag1 = '考试';
                    this.flag2 = '考试详情';
                    if(this.$route.query.id) {
                      this.flag3 = '编辑试卷';
                    } else {
                      this.flag3 = '创建考试';
                    }
                    if(this.$route.query.isImport) {
                      this.flag3 = '创建考试';
                    }
                    this.url = '/exam/list'
                } else if(path == '/operationAnalysis/banner') {
                    this.flag1 = '课程';
                    this.flag2 = 'banner管理';
                } else if(path == '/operationAnalysis/CourseLibrary') {
                    this.flag1 = '课程';
                    this.flag2 = '课程库';
                } else if(path == '/operationAnalysis/addCourse') {
                    this.flag1 = '课程';
                    this.flag2 = '课程库';
                    this.flag3 = '添加课程';
                    if(this.$route.query.courseId) {
                        this.flag3 = '编辑课程';
                    }
                    this.url = '/operationAnalysis/CourseLibrary'
                } else if(path == '/operationAnalysis/editCourse') {
                    this.flag1 = '课程';
                    this.flag2 = '课程库';
                    this.flag3 = '编辑课程';
                    this.url = '/operationAnalysis/CourseLibrary'
                } else if(path == '/operationAnalysis/courseStatistics') {
                    this.flag1 = '课程';
                    this.flag2 = '课程库';
                    this.flag3 = '统计课程';
                    this.url = '/operationAnalysis/CourseLibrary'
                } else if(path == '/exam/statistic') {
                    this.flag1 = '考试';
                    this.flag2 = '考试详情';
                    this.flag3 = '统计';
                    this.url= '/exam/list'
                } else if(path == '/exam/list') {
                    this.flag1 = '考试';
                    this.flag2 = '考试详情';
                } else if(path == '/operationAnalysis/newPaper'){
                    this.flag1 = '考试';
                    this.flag2 = '试卷库';
                    if(this.$route.query.id) {
                        this.flag3 = '编辑试卷';
                    } else {
                        this.flag3 = '新建空白试卷';
                    }
                    this.url = '/operationAnalysis/paperLibrary'
                } else if(path == '/operationAnalysis/paperLibrary') {
                    this.flag1 = '考试';
                    this.flag2 = '试卷库';
                } else if(path == '/exam/newPaper') {
                    this.flag1 = '考试';
                    this.flag2 = '试卷库';
                    this.flag3 = '新建试卷';
                    this.url = '/exam/list'
                } else if(path == '/operationAnalysis/newExamLibrary') {
                    this.flag1 = '考试';
                    this.flag2 = '试题库';
                    if(this.$route.query.questionId) {
                      this.flag3 = '编辑试题库';
                    } else {
                      this.flag3 = '新建试题库';
                    }
                    this.url = '/operationAnalysis/examLibrary'
                } else if(path == '/operationAnalysis/examLibrary') {
                    this.flag1 = '考试';
                    this.flag2 = '试题库';
                } else if(path == '/operationAnalysis/importQuestionSave') {
                    this.flag1 = '考试';
                    this.flag2 = '试题库';
                    this.flag3 = '导入试题详情';
                    this.url = '/operationAnalysis/examLibrary'
                } else if(path == '/operationAnalysis/importQuestion') {
                    this.flag1 = '考试';
                    this.flag2 = '试题库';
                    this.flag3 = '导入试题';
                    this.url = '/operationAnalysis/examLibrary'
                } else if(path == '/exam/importExam') {
                    this.flag1 = '考试';
                    this.flag2 = '考试详情';
                    this.flag3 = '创建考试';
                    this.url = '/exam/list';
                } else if(path == '/exam/basicInfo') {
                    this.flag1 = '考试';
                    this.flag2 = '考试详情';
                    this.flag3 = '创建考试';
                    this.url = '/exam/list';
                } else if(path == '/operationAnalysis/importExam') {
                    this.flag1 = '考试';
                    this.flag2 = '试卷库';
                    this.flag3 = '导入试卷';
                    this.url = '/operationAnalysis/paperLibrary'
                }

                let flag = window.localStorage.getItem('flag')
                if(flag){
                    this.flag3 = flag
                }
            },
            turnTo(){
                this.$router.push(this.url)
            },

            selectMenu(key, keyPath) {
                console.log(key, keyPath);
                //   /operationAnalysis/channelAnalysis ["2", "/operationAnalysis/channelAnalysis"]
            },

            handleOpen() {
            },

            handleClose() {
            },

            ajustNavSide() {

                let secNav = document.querySelector('.second-nav');
                if(!secNav) return;

                let elMenuItem = secNav.querySelectorAll('.el-submenu .el-menu-item');

                [...elMenuItem].map(function(v){
                    //console.log(v);
                    v.style.paddingLeft = '50px';
                });
            },

			logout(){
				window.location.href=`${window.location.pathname}#/login`
            },

            isIncludePath(currentPath, path) {
                return currentPath.indexOf(path) > -1 ? true : false;
            },
            ...mapActions([]),//"getAppGeneralNav"
		},
    }

</script>

<style lang="less">
    .second-nav{

        .nav-icon {
          margin-left: 8px;
        }
        .el-menu-item{
            padding-left:10px!important;
        }
        .el-submenu{
            .el-icon-arrow-down{
                color:#cccccc;
                font-size:10px;
            }
        }
        .el-menu--dark{
            background:#292c31!important;

            .el-menu-item{
                color:#ffffff;
            }
            .el-submenu__title{
                color:#ffffff;
            }
        }
        .main-section{
            position:fixed;
            left:0px;
            top:60px;
            width:100%;
            height:46px;
            line-height: 46px;
            background:#ffffff;
            color:#333333;
            font-size:14px;
        }
        .breadcrumb {
            padding-left: 30px;
            .s-block {
                position: relative;
                display: inline-block;
                width: 4px;
                height: 16px;
                top: 2px;
                background-color: #489EFB;
            }
        }
    }

</style>
