<template>
    <div class="login-wrapper">
        <div class="login-content">
            <div class="login-logo">Amber运营分析平台</div>
            <div class="login-conBox">
                <div class="login-title text-center">
                    登录
                </div>
                <div class="login-box">
                    <el-form ref="form" :model="form" :rules="rules" autocomplete="off">
                        <el-form-item prop="userName" class="account-input">
                            <el-input id="username" v-model.trim="form.userName" placeholder="用户名" auto-complete="on" autofocus="autofocus"></el-input>
                        </el-form-item>
                        <el-form-item class="account-input" prop="password">
                            <el-input id="password" v-model.trim="form.password" type="password" placeholder="密码" auto-complete="on"></el-input>
                            <i v-if="isPasswordVisible" class="pwd-hidden passIcon cursor" @click="togglePassword"></i>
                            <i v-else class="pwd-visible passIcon cursor" @click="togglePassword"></i>
                        </el-form-item>
                        <el-form-item prop="imgcode" style="position:relative;">
                            <el-input v-model="form.imgcode" placeholder="验证码"></el-input>
                            <img :src="imgCodeURL" alt="图片验证码" class="cursor" @click="refreshImageCode">
                        </el-form-item>
                        <el-button type="primary" class="submit" @click="submitForms('form')">登录</el-button>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="login-footer">
            Copyright © 2018 咪咕文化有限公司
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import utils from '../utils/misc'
import Api from '../utils/api'
import * as C from '../constants/api'
import WaterMark from '../mixins/watermark'

export default {
    name: 'Login',
    mixins: [WaterMark],
    data() {
        const checkRequired = message => (rule, value, callback) => {
            if (!utils.trim(value)) {
                return callback(new Error(`${message}不可为空`))
            } else {
                callback()
            }
        }

        return {
            form: {
                userName: '',
                password: '',
                imgcode: ''
            },
            rules: {
                userName: [{ validator: checkRequired('用户名'), trigger: 'change' }],
                password: [{ validator: checkRequired('密码'), trigger: 'change' }],
                imgcode: [{ validator: checkRequired('验证码'), trigger: 'change' }]
            },
            imgCodeURL: '',
            isPasswordVisible: false
        }
    },

    beforeMount() {
        this.removeWaterMk()
        this.refreshImageCode()
    },
    mounted() {
        window.history.pushState(null, null, location.href)
    },
    methods: {
        ...mapActions(['showPageLoading', 'hidePageLoading', 'migrateAppList']),

        togglePassword() {
            let v = document.getElementById('password')
            if (this.isPasswordVisible) {
                v.type = 'password'
            } else {
                v.type = 'text'
            }
            this.isPasswordVisible = !this.isPasswordVisible
        },

        refreshImageCode() {
            this.imgCodeURL = C.CODE_IMG + '?t=' + Math.random()
        },

        resetForms(formNames) {
            this.$refs[formNames].resetFields()
        },

        mockResponse(res) {
            res['apps'] = [{
                app_name: '咪咕动漫',
                appid: 8,
                key: '6c837308eb2349da90f8649ea2386794',
                webMark: 0
            }, {
                app_name: 'Web样例',
                appid: 20,
                key: '6c837308eb2349da90f8649ea2386784',
                webMark: 1
            }]
        },

        // 登录校验
        submitForms(formNames) {
            this.$refs[formNames].validate(valid => {
                if (valid) {
                    const params = { ...this.form }
                    params['password'] = utils.rsaEncrypt(params.password)
                    this.showPageLoading()
                    Api.login(params).then(res => {
                        // __DEV__ && !res.apps && this.mockResponse(res)
                        const {appid: appId, app_name: appInfoName} = res.apps[0]
                        this.$store.state.root.appInfoName = appInfoName
                        const { userName } = res
                        localStorage.setItem('appInfoName', appInfoName)
                        sessionStorage.setItem('appId', appId)
                        // FIXME: 临时保证有效，后期会删除
                        localStorage.setItem('appId', appId)
                        localStorage.setItem('userName', userName)
                        localStorage.setItem('deptName', res.deptName || '')
                        localStorage.setItem('loginName', res.loginName || '')
                        this.migrateAppList(res.apps.map(item => {
                            const {appid: appId, appkey: appKey, app_name: appName, webMark} = item
                            return {
                                appId,
                                appKey,
                                appName,
                                webMark
                            }
                        }))
                        this.$router.push('/dashboard/summary')
                        this.hidePageLoading()
                    }).catch(this.hidePageLoading())
                }
            })
        }
    }
}
</script>

<style lang='scss'>
    .login-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        .login-content {
            height: 100%;
            flex: 1;
            background: url("../layouts/images/login_bg.jpg") center center;
            background-size: cover;
            .login-logo {
                position: absolute;
                top: 40px;
                left: 40px;
                font-size: 20px;
                color: #ffffff;
                text-shadow: 5px 2px 6px #666666;
            }

            .login-conBox {
                width: 330px;
                height: 345px;
                background: #fff;
                padding: 22px;
                position: absolute;
                right: 190px;
                top: 150px;
                border-radius: 5px;

                .login-title {
                    height: 50px;
                    margin-top: 20px;

                    ul li {
                        float: left;
                        width: 284px;
                        font-size: 18px;
                        line-height: 18px;
                        color: #888;
                        text-align: center;
                        cursor: pointer;
                    }
                    .actives {
                        color: #46bafe !important;
                    }
                }
                .login-box {
                    .account-input {
                        position: relative;
                        margin-bottom: 20px;
                        .passIcon {
                            width: 21px;
                            height: 15px;
                            display: inline-block;
                            position: absolute;
                            background: url(../layouts/images/pwd-hidden.png) center center no-repeat;
                            background-size: cover;
                            right: 13px;
                            top: 9px;
                            z-index: 99;
                        }
                        .pwd-visible {
                            opacity: 0.4;
                        }
                        .pwd-hidden {
                            opacity: 1;
                        }
                    }
                    .el-input__inner {
                        padding-left: 0;
                        border: none;
                        border-radius: 0;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .el-input__icon:hover+.el-input__inner,
                    .el-input__inner:hover {
                        box-shadow: 0px 0px 6px #fff;
                        border-bottom: 1px solid #e0e0e0 !important;
                    }
                    .el-input__inner::-webkit-input-placeholder {
                        color: #a0a0a0;
                    }
                    .el-input__inner:-webkit-autofill {
                        box-shadow: 0 0 0px 1000px white inset;
                    }

                    .cursor {
                        width: 124px;
                        position: absolute;
                        right: 0;
                        top: -3px;
                        height: 36px;
                    }
                    .submit {
                        width: 285px;
                        height: 34px;
                        background: #46bafe;
                        color: #fff;
                        text-align: center;
                        line-height: 34px;
                        margin-top: 20px;
                        padding: 0px;
                    }
                    .submit:hover {
                        opacity: 0.8;
                    }
                }
            }
        }
        .login-footer {
            height: 60px;
            line-height: 60px;
            font-size: 14px;
            color: #333333;
            text-align: center;
            background-color: #ffffff;
        }
    }
</style>
