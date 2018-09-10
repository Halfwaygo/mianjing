<template>
	<div class="login-page">
		<div class="login-container">
			<div class="login-box" style="margin-top:30px;">
				<!--第一块内容 -->
				<el-form :model="forms" :rules="ruless" ref="forms" class="demo-ruleForm" v-show="oa">
					<div class="account-input">
						<el-input v-model="forms.name" placeholder="用户名"></el-input>
					</div>
					<div class="account-input">
						<el-input id="password" type="password" v-model="forms.pass" placeholder="密码" auto-complete="off"></el-input>
						<i class='pwd-hidden passIcon' v-if="isPasswordVisible" @click="togglePassword"></i>
                        <i class='pwd-visible passIcon' v-else @click="togglePassword"></i>
					</div>
					<el-button type="primary" @click="submitForms('forms')" class="submit">提交</el-button><!-- @click.native="getImages1" -->
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as C from '../constants/api';
import utils from '../utils/misc';
import Api from "../utils/api";


import {delCookie,getCookie,setCookie} from '../utils/util'
export default {
	data() {
		//第一部分
		var validateAccounts = (rule, value, callback) => {
			if (!this.forms.name) {
				callback(new Error('请输入用户名'));
			} else if (!this.forms.pass) {
				callback(new Error('请输入密码'));
			} else if (!this.forms.imageData) {
				callback(new Error('请输入验证码'));
			} else {
				callback();
			}
		};

		var validatePasss = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (value.length < 2) {
					callback(new Error('密码长度大于2'));
				} else {
					callback();
				}
			}
		};
		return {
			event:'',
			oa:true,
			uem:false,
			forms: {
				name: '',
				pass: '',
				imageData: '',
				password:''
			},
			//第一部分
			ruless: {
				age: [
					{ validator: validateAccounts, trigger: 'blur' },
				],
				name: [
					{ required: true, message: '请输入名字', trigger: 'blur' },
					{ min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
				],
				pass: [
					{ validator: validatePasss, trigger: 'blur' }
				],
				imageData: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
					{ min: 4, max: 4, message: '长度为4个字符', trigger: 'blur' }
				],
			},
			//密码的可见icon
			isPasswordVisible: false,
			imageSrcs: '',
			paramss: {
				adminPassword:'',
				adminAccount:'',

			},
		};
	},
	mounted(){
	},

	beforeMount() {
	},

	computed: {
	},

	methods: {
		toggle(){
			let self=this;
			this.oa=!this.oa;
			this.uem=!this.uem;
			self.form = {name:'',pass:'',imageData:''};
			self.forms = {name:'',pass:'',imageData:''};
		},
		//第一部分
		togglePassword(){
			let v = document.getElementById("password").getElementsByTagName("input")[0];
			if (this.isPasswordVisible) {
				v.type = "password";
			} else {
				v.type = "text";
			}
			this.isPasswordVisible = !this.isPasswordVisible;
		},
		//第一部分
		submitForms(formNames) {
			//alert("hi")
			let isChrome = window.navigator.userAgent.indexOf('Chrome') !== -1
			if(!isChrome) {
        this.$msgbox({
						title: '提醒',
						message: `因为你不是chrome，建议换成chrome浏览器，是否继续？`,
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						beforeClose: (action, instance, done) => {
							if (action === 'confirm') {
									console.log(JSON.stringify(this.forms.pass))
									this.loginSubmit(formNames)
									done()
							} else {
									done()
									return false
							}
						}
			  })
			} else {
				this.loginSubmit(formNames)
			}
		},
		loginSubmit(formNames) {
      if(this.forms.name === '') {
				this.$message.warning('用户账号不能为空')
				return
			} else if(this.forms.pass === '') {
				this.$message.warning('用户密码不能为空')
				return
			} else if(this.forms.pass.indexOf(' ') > -1) {
				this.$message.warning('密码中不能有空格')
				return
			}
			var vm = this;
			this.$refs[formNames].validate((valid) => {
				if (valid) {
					this.paramss.adminPassword = this.forms.pass;
					this.paramss.adminAccount = this.forms.name;
					this.loginnew(this.paramss).then(res => {
						if (res.code == C.CODE_SUCCESS) {
							vm.resetForms(formNames);
							vm.$router.push('/');
							var kind = res.data.kind
							var adminName = res.data.adminName
							var adminAccount = res.data.adminAccount
							sessionStorage.setItem( 'kind', kind);
							sessionStorage.setItem( 'adminName', adminName);
							sessionStorage.setItem( 'adminAccount', adminAccount);

						} else{
							res.error && vm.$message({ message: res.error, type: "error", showClose: true });

							}
					});
				} else {
					return false;

				}
			});
		},
		resetForms(formNames) {
			this.$refs[formNames].resetFields();
		},

		...mapActions(["showPageLoading", "hidePageLoading", "loginnew"]),
	},
}
</script>



<style lang='less' scope>
	.el-form-item__content {
		line-height: 0!important;
		.el-form-item__error {
			color: #ff3300;
			margin-top: 10px;
		}
	}
	.actives{
		color:#46bafe!important;
	}

</style>

