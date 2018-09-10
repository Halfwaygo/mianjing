<template>
    <div class="circle-section">
        <el-button-group class="circle-btn topBtnGroup">
            <el-button :type="circleFlag === 'IOS' ? 'primary' : ''" class="default-circle-btn" size="mini" @click="circleChange('IOS')">iOS</el-button>
            <el-button :type="circleFlag === 'Android' ? 'primary' : ''" class="default-circle-btn" size="mini" @click="circleChange('Android')">Android</el-button>
            <el-button :type="circleFlag === 'WEB' ? 'primary' : ''" class="default-circle-btn" size="mini" @click="getWebURLSelectMode('init')">Web</el-button>
        </el-button-group>
        <div class="circle-container">
            <div class="popper-tips">{{ appName }}开启<span :class="{hide: isShowVersion}">移动</span>圈选<i v-popover:popperFAQ :class="{hide: isShowVersion}" class="el-icon-question"></i></div>
            <div :class="{hide: isShowVersion}" class="nav-menu">
                <div class="colgroup scanCode">
                    <div class="tips-title"><i class="step-1"></i>扫描二维码</div>
                    <img :src="qrPath" class="qrCode-img" />
                    <el-button size="mini" type="primary" class="refresh_qrcode" @click="getQrCode">刷新</el-button>
                </div>
                <div class="colgroup scanCode">
                    <div class="tips-title"><i class="step-2"></i><div class="tips-step2">微信扫码请点击右上角选择在{{ platform }}中打开</div></div>
                    <img class="qrCode-img" src="../../layouts/images/t-app-0.png" />
                </div>
                <div class="colgroup scanCode">
                    <div class="tips-title">浏览器扫码直接唤醒</div>
                    <img class="qrCode-img" src="../../layouts/images/t-app-1.png" />
                </div>
            </div>
            <div :class="{hide: !isShowVersion}" class="nav-menu web-circle-box">
                <div class="toolBar">
                    <div class="circleSwitch">
                        <el-switch
                            v-model="circleSwitch"
                            :disabled="isCircleMode"
                            active-text="圈选"
                            inactive-text="浏览"
                            active-value="on"
                            inactive-value="off"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change = "circleModeChange"
                        >
                        </el-switch>
                    </div>
                    <span>项目圈选模式</span>
                    <input id="targetUrl" v-model= "targetUrl" type="text"/>
                    <div :class= "{hide: isCircleMode}" class="circlePage" @click="definedPage()">定义页面</div>
                    <div class="platform">
                        <el-select v-model="deviceMode" placeholder="请选择" @change="changeWidth">
                            <el-option
                                v-for="item in deviceModes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div id="iframe_container" class="iframe_container">
                    <div id="sdk_error_tip" :class= "{hide: !isShowErrorTip}" class="sdk_error_tip" >
                        <div class="content">
                            <h3>目前无法使用圈选</h3>
                            <br/>
                            <p>可能的原因包括：</p>
                            <p>1.该页面没有成功加载 SDK，需联系工程师安装 SDK；</p>
                            <p>2.该网站禁止了 iframe 的加载，需联系工程师修改配置。</p>
                        </div>
                    </div>
                    <iframe id="uem-circle-window" :src="iframeSrc" name="mgcw" class="uem-circle-window" frameborder="0"></iframe>
                </div>
            </div>
        </div>
        <el-popover
            ref="popperFAQ"
            placement="right-end"
            title="FAQ"
            width="438"
            trigger="hover"
            popper-class="popper-circle-tips"
            content="">
            <span>Q: 如果扫码之后无法启动?<br>
                A: 请确保手机上安装了需要圈选的APP, 并把SDK更新到最新版<br>
                Q: 如果扫码后手机已登录，电脑没反应?<br>
                A: 网络情况不好的情况下，反应比较慢，请刷新页面</span>
        </el-popover>
        <el-dialog :visible.sync="dialogFormVisible" class="circle_dialog_box" width="30%" title="定义页面">
            <el-form :model="form">
                <el-form-item :label-width="formLabelWidth" label="页面名称">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="页面URL">
                    <el-input v-model="form.pageUrl" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDefPage()">取 消</el-button>
                <el-button type="primary" @click="saveDefPage()">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Api from '../../utils/api' //eslint-disable-line
import WaterMark from '../../mixins/watermark'
import {mapActions, mapState} from 'vuex'
import * as C from '../../constants/api'
import * as CONST from '../../constants/constants'
export default {
    name: 'CircleComponent',
    components: {},
    mixins: [WaterMark],
    data() {
        return {
            basePath: `${C.BASE_PATH}select/QrCodeImg.api`,
            qrPath: '',
            circleFlag: 'IOS',
            getInterval: '',
            platform: 'safari',

            isCircleMode: true,
            circleSwitch: 'off',
            isShowVersion: false,
            deviceModes: CONST.DEVICEMODE,
            deviceMode: '1',
            targetUrl: '', // url输入框中url值
            iframeSrc: '',
            sdkIsDeploy: false, // SDK是否正常部署标识
            isShowErrorTip: false,
            userId: '', // 用户圈选接口透传后台

            dialogFormVisible: false,
            form: {
                name: '',
                pageUrl: ''
            },
            formLabelWidth: '80px'
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId,
            appName: ({root}) => {
                return `${localStorage.getItem('appInfoName') || ''} `
            },
            webUrl: ({root}) => root.webUrl
        })
    },
    beforeMount() {
        this.waterMk()
    },
    mounted() {
        this.getQrCode()
        this.getInterval = setInterval(() => {
            this.getQrCode()
        }, 6e4)
    },
    destroyed() {
        clearInterval(this.getInterval)
    },
    methods: {
        getQrCode() {
            this.qrPath = `${this.basePath}?appId=${this.appId}&type=${this.circleFlag === 'IOS' ? 2 : 1}&time=${new Date().getTime()}`
        },
        definedPage() {
            this.form.name = ''
            this.dialogFormVisible = true
            this.form.pageUrl = this.targetUrl
        },
        cancelDefPage() {
            this.dialogFormVisible = false
            this.form.name = ''
            this.form.pageUrl = ''
        },
        saveDefPage() {
            var $myIframe = document.getElementById('uem-circle-window')
            var frameName = $myIframe.name || ''
            const data = {
                XPATH: '',
                SE: '0',
                IMAGE: '',
                NAME: this.form.name,
                PATH: this.form.pageUrl
            }
            const param = {
                origin: 'amberWebCircle',
                fname: frameName,
                mode: 'definedPage',
                data: []
            }
            param.data.push(data)
            // console.log(param)
            $myIframe.contentWindow.postMessage(param, '*') // 发送消息保存页面定义事件
            this.cancelDefPage()
        },
        circleChange(index) {
            this.isShowVersion = false
            this.circleFlag = index
            switch (index) {
            case 'IOS':
                this.platform = 'safari'
                break
            default:
                this.platform = '浏览器'
            }
            this.getQrCode()
            clearInterval(this.getInterval)
            this.getInterval = setInterval(() => {
                this.getQrCode()
            }, 6e4)
        },
        getWebURLSelectMode(loadMode) {
            this.circleFlag = 'WEB'
            var vm = this
            var id = parseInt(this.appId)
            var param = {
                appid: id,
                type: 3
            }
            this.getWebUrl(param).then(res => {
                // console.log(res)
                /* 成功 */
                var status = res.isCircle
                var url = res.url
                if (status === 'true') {
                    vm.isShowVersion = true
                    vm.userId = res.userId
                    this.gotoTargetUrl() // 对于输入框添加事件监听
                    vm.targetUrl = url
                    vm.iframeSrc = vm.formatUrl(url)
                    if (loadMode) {
                        vm.reloadIframeCheck()
                    } else {
                        vm.loadIframeCheck()
                    }
                } else {
                    vm.$message({ message: '此项目没有配置Web圈选功能，请联系管理员添加配置！', type: 'error', showClose: true })
                    // 提示项目没有配置圈选功能，请联系管理员添加配置
                }
            })
        },

        /**
         * 暂时不使用
         */
        loadIframeCheck() {
            let vm = this
            var $myIframe = document.getElementById('uem-circle-window')
            $myIframe.onload = function() {
                this.isShowErrorTip = false
                this.sdkIsDeploy = false
                // console.log('loadIframe')
                var frameName = $myIframe.name || ''
                var data = {
                    origin: 'amberWebCircle',
                    fname: frameName,
                    mode: 'loadPlugin'
                }
                $myIframe.contentWindow.postMessage(data, '*') // 发送消息验证SDK部署是否正常
                // window.frames[0].postMessage(data, '*');

                window.addEventListener('message', function(e) {
                    if (e.data && e.data.origin === 'amberWebSdk' && frameName === e.data.name) {
                        // console.log('圈选通信正常，', e.data)
                        vm.sdkIsDeploy = true
                        vm.isCircleMode = false
                    } else {
                        console.error('圈选通信失败，', e.data)
                    }
                }, false)
                // 发出postMessage后2秒验证SDK状态
                setTimeout(function () {
                    if (!vm.sdkIsDeploy) {
                        vm.isShowErrorTip = true
                        vm.isCircleMode = true
                    }
                }, 2000)
            }
        },

        reloadIframeCheck() {
            let vm = this
            this.isShowErrorTip = false
            this.sdkIsDeploy = false
            var $myIframe = document.getElementById('uem-circle-window')
            $myIframe.onload = function() {
                // console.log('reloadIframe')
                var frameName = $myIframe.name || ''
                var data = {
                    origin: 'amberWebCircle',
                    fname: frameName,
                    userId: vm.userId,
                    mode: 'loadPlugin'
                }
                $myIframe.contentWindow.postMessage(data, '*') // 发送消息验证SDK部署是否正常
                // window.frames[0].postMessage(data, '*');

                window.addEventListener('message', function(e) {
                    if (e.data && e.data.origin === 'amberWebSdk' && frameName === e.data.name) {
                        // console.log('圈选通信正常，', e.data)
                        vm.sdkIsDeploy = true
                        vm.isCircleMode = false
                    } else {
                        console.error('圈选通信失败，', e.data)
                    }
                }, false)
                // 发出postMessage后三秒验证SDK状态
                setTimeout(function () {
                    if (!vm.sdkIsDeploy) {
                        vm.isShowErrorTip = true
                        vm.isCircleMode = true
                    }
                }, 2000)
            }
        },

        /**
         * 没有加协议的url，验证并加上
         **/
        formatUrl(url) {
            var $val = url
            if ($val.indexOf('http://') === -1 && $val.indexOf('https://') === -1) {
                $val = 'http://' + $val
                this.targetUrl = $val // input中显示格式化后的url
            }
            return $val
        },
        /**
         * 设置input输入正确网址，iframe加载不同页面
         **/
        gotoTargetUrl() {
            let vm = this
            var $url = document.getElementById('targetUrl')
            // 移除 <div> 元素的事件句柄
            $url.removeEventListener('keydown', function () {})
            $url.addEventListener('keydown', function (e) {
                if (e.which === '13' || e.which === 13) {
                    var $val = vm.targetUrl
                    vm.iframeSrc = vm.formatUrl($val)
                    vm.isCircleMode = true
                    vm.circleSwitch = 'off'
                    // 每次iframe重新设置src后调用一次
                    vm.reloadIframeCheck()
                }
            })
        },

        /**
         * 切换模式
         * */
        circleModeChange(data) {
            // console.log('模式', data)
            var $myIframe = document.getElementById('uem-circle-window')
            var frameName = $myIframe.name || ''
            var param = {
                origin: 'amberWebCircle',
                fname: frameName
            }
            if (data === 'on') {
                // start
                param.mode = 'startCircle'
            } else {
                // stop
                param.mode = 'stopCircle'
            }
            $myIframe.contentWindow.postMessage(param, '*') // 发送消息切换模式
        },

        /**
         * 切换设备类型，设置iframe宽度
         */
        changeWidth(data) {
            var $iframeContainer = document.getElementById('iframe_container')
            var width = ''
            switch (data) {
            case '3':
                width = '375px'
                break
            case '2':
                width = '768px'
                break
            default:
                width = '100%'
            }
            $iframeContainer.style.width = width
        },

        ...mapActions(['getWebUrl'])
    }
}
</script>
<style lang="scss">
$circle-container-bg-color: #FFF;
$circle-tips-font-clor: #5A6D82;
$bg-black: #000;
$color-white: #FFF;

.circle_dialog_box{
    .el-dialog__header{
        background-color: #f1f1f1;
        border-bottom: 1px solid #ddd;
    }
}
.circle-section{
    padding: 30px 25px;
}
.circle-btn{
    .default-circle-btn{
        width: 79px;
        text-align: center;
    }
}
.circle-container{
    padding: 40px 30px;
    margin-top: 25px;
    background-color: $circle-container-bg-color;
    .hide{
        display: none;
    }
    .popper-tips{
        color: $circle-tips-font-clor;
        font-size: 16px;
        i.el-icon-question{
            color: #3392FF;
            margin-left: 12px;
        }
    }
    .nav-menu{
        margin-top: 40px;
        .colgroup{
            display: inline-block;
            width: 200px;
            font-size: 14px;
        }
        .colgroup.scanCode{
            color: $circle-tips-font-clor;
            vertical-align: top;
            .tips-title{
                height: 40px;
                vertical-align: top;
                .tips-step2{
                    width: 140px;
                    display: inline-block;
                }
            }
            i.step-1,i.step-2{
                margin-right: 8px;
            }
            i.step-1::before,i.step-2::before{
                vertical-align: top;
                font-family: Microsoft YaHei;
                background-color: #F5A61D;
                color: #FFF;
                font-size: 14px;
                text-align: center;
                border-radius: 4px;
                padding: 3px 8px;
            }
            i.step-1::before{
                content: '1';
            }
            i.step-2::before{
                content: '2';
            }
            .qrCode-img{
                margin-top: 20px;
                width: 174px;
            }
            .refresh_qrcode{
                margin-top: 10px;
            }
        }
    }
}
.popper-circle-tips{
    background-color: $bg-black;
    opacity: .7;
    color: $color-white;
    font-size: 14px;
    .el-popover__title{
        color: $color-white;
        font-size: 14px;
    }
    .popper__arrow::after{
        border-right-color: $bg-black !important;
        opacity: .7;
    }
}

.web-circle-box{
    position: relative;
    border: 1px solid #ddd;
    .toolBar{
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #d0d0d0;
        text-align: center;
        background: #f9f8f8;
        position: absolute;
        z-index: 1;
        top:0;
        left:0;

        input{
            height: 26px;
            line-height:26px;
            padding:0 5px;
            outline: none;
            width: 300px;
            margin-left: 20px;
        }
    }

    .circleSwitch{
        position: absolute;
        left: 50px;
        top: 0;
        input{
            width: 100px;
        }
    }
    .circlePage{
        position: absolute;
        right: 150px;
        top: 10px;
        background-color: #409eff;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        cursor: pointer;
    }
    .platform{
        position: absolute;
        right: 50px;
        top: 0;
        width: 80px;
        input{
            width:100%;
            margin-left:0;
        }

        select{
            width: 60px;
            height: 24px;
            outline: none;
        }
    }
    .iframe_container{
        padding-top:50px;
        position: relative;
        z-index: 0;
        margin: 0 auto;

        iframe{
            width: 100%;
            height: 600px;
        }
    }
    .sdk_error_tip{
        width: 100%;
        height: 600px;
        background: rgba(0, 0, 0, 0.9);
        position: absolute;
        text-align: center;
        color: #fff;

        .content{
            width: 325px;
            margin: 20px auto 0;
            text-align: left;
            font-size: 12px;
        }

    }
}
</style>
