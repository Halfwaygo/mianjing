<template>
     <!-- <div class="admin">

    </div>  -->
   <span class="user-set" style="width:205px;">
    <span class="adminAccount" > {{adminName}} </span>
   <router-link to="/login">
        <span class="exit" @click="logout">退出</span>
   </router-link>
         <!-- <span class="set-icon cursor" @click.prevent="showSetPop">&nbsp;</span>
            <div class="set-pop" v-show="isShow">
                <div class="header-bg"></div>
                <div class="theme">
                    <div class="theme-text">换肤</div>
                    <div class="color-item cursor" v-for="bgc in colorList" :style="{'backgroundColor':bgc}" :class="{ active: activeColor==bgc }" @click.prevent="changeTheme(bgc)">
                    </div>
            </div>

            <router-link to="/logout">
                <span class="exit">退出账户</span>
            </router-link>
                 </div>  -->
    </span>
</template>
<script>
    import _ from 'lodash';
    import Tab from  '../components/Tab';
    import * as CONST from  '../constants/const';
    import Api from "../utils/api"
    //新增加的
    import {delCookie,getCookie} from '../utils/util'

    export default{
        name: 'MoreSet',
        data() {
          return {
            colorList: [],
            activeColor: '#73b942',
            isShow: false,
            //adminName:'',
            adminName : sessionStorage.getItem('adminName') ,
          }
        },
        components: {
        },

        beforeMount(){
            this.colorList = CONST.SET_COLOR;
            //adminName = sessionStorage.getItem('adminName') ,
            //console.log(adminName)
        },

        methods: {
            showSetPop() {
                this.isShow = !this.isShow;
            },

            changeTheme(color) {
                this.activeColor = color;
            },
            logout(){

                let sessionId = getCookie('JESSION_ID');
                console.log(sessionId);
                Api.loginOut({sessionID:sessionId}) .then(res => {
                    console.log(res,'查看一下 sessionid的返回值');
                  //this.tableData = res.data.course.courseList
                }).catch(res => {
                 // console.log(JSON.stringify(res))
            })
            }
            //刷新页面
            /*reload(){
                history.go(0);
                //location.reload()
            }*/

        },
    }
</script>

<style lang="less">
.adminAccount{
    display:inline-block;
    background: url(../layouts/images/admin.png) left center no-repeat;
    background-size:22px 22px;
    padding-left:24px;
    margin-right:20px;
    font-size: 14px;
    color:#ffffff;
}

.exit{
    display:inline-block;
    // width:22px;
    // height:22px;
    background: url(../layouts/images/signOut.png) left center no-repeat;
    background-size:18px 17px;
    padding-left:24px;
    font-size: 14px;
    color:#ffffff;
}


</style>
