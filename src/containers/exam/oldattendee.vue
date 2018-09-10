<template>
	<div  class="upload-wrap">
	  <el-row :gutter="20">
		  <el-col :span="8">
		  	<el-select v-model="param.zqGroupName" placeholder="选择族群" @change="getPersonByBlurStr" popper-class='sel-zq'>
			    <el-option v-for="item in GroupList" :key="item.id"
			      :label="item.groupName" :value="item.groupName">
			    </el-option>
			</el-select>
		  </el-col>
		  <el-col :span="8">
		  	<el-input v-model="param.blurName" placeholder="请输入搜索人员"></el-input>
		  </el-col>
		  <el-col :span="8">
		  	<el-button type="primary" icon="search" @click="getPersonByBlurStr" style="float:left; margin-right: 5px;">搜索</el-button>
            <el-upload
                style="float: left"
                class="upload-demo"
                :action="importUrl"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :show-file-list="false"
                multiple
                :limit="1">
                 <el-button size="small" type="primary">{{ uploadState }}</el-button>
            </el-upload>

		    <el-button type="primary" style="float:right;background-color: #fff; color:#489EFB; border: 1px solid #489EFB" @click="downTamplate">下载模板</el-button>
          </el-col>
	  </el-row>
	  <el-row :gutter="20">
          <!-- 公司 -->
		  <el-col :span="8">
		  	<div class="view-box">
		  		<div class="view-box-head clearfix">
		  			<div class="view-box-title">公司</div>
		  		</div>
		  		<div class="view-box-body">
		  			<el-tree :data="filterDepart" show-checkbox ref="tree" @check-change="handleTree"></el-tree>
		  		</div>
		  	</div>
		  </el-col>
          <!-- 全选 -->
		  <el-col :span="8">
		  	<div class="view-box">
		  		<div class="view-box-head clearfix">
		  			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		  		</div>
		  		<div class="view-box-body">
		  			<el-checkbox-group v-model="param.personName" @change="handleCheckedPersonsChange">
					  <el-checkbox v-for="(person, index) in personList"
                                   :label="person.personName"
                                   :key="index">{{person.personName}}
                      </el-checkbox>
					</el-checkbox-group>
		  		</div>
		  	</div>
		  </el-col>
          <!-- 已选 -->
		  <el-col :span="8">
			<div class="view-box">
			  	<div class="view-box-head clearfix">
		  			<div class="fl">已选({{param.personName.length}})</div>
		  			<el-button type="text" class="fr" v-show="param.personName.length !==0" @click="showAdd= true">保存为族群</el-button>
		  		</div>
		  		<div class="view-box-body">
		  			<ul class="checked-box">
			  			<li v-for="(person, index) in param.personName" :key="index" class="clearfix">
			  				<span class="fl">{{ person }}</span>
			  				<span class="fr el-icon-close line-30" @click="delChecked(person)"></span>
			  			</li>
			  		</ul>
		  		</div>
			</div>
		  </el-col>
	  </el-row>
	  <div slot="footer" class="dialog-footer align-center mt20">
	    <el-button type="primary" @click="sureAddAttendee">确 定</el-button>
	  </div>

	  <el-dialog :visible.sync="showAdd" v-if="showAdd" width="30%" title="保存为族群">
  		<el-form :model="param" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  		  <el-form-item label="" prop="newGroupName">
  		    <el-input v-model="param.newGroupName" placeholder="请输入族群名称"></el-input>
  		  </el-form-item>
  		</el-form>
  	  	<span slot="footer" class="dialog-footer">
  		    <el-button type="primary" @click="addnNewGroup(true)">保 存</el-button>
  		    <el-button type="info" v-show="param.groupId !==''" @click="addnNewGroup(false)">另存为新族群</el-button>
  		</span>
	  </el-dialog>
	</div>
</template>

<script>
    import {mapActions, mapState} from "vuex";
    import * as C from "../../constants/api";

    export default {
        name: "attendee",
        props: {
            isquery: Boolean,
            getPerson:{
              type: Array,
              default: []
            }
        },
        data() {
            return {
                uploadState: '点击上传',
                param: {
                    groupId: "",
                    zqGroupName: '',
                    newGroupName: "",
                    personName: [],
                    blurName: "",
                    departChecked: "",
                    companyChecked: []
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                rules: {
                    newGroupName: [
                        {required: true, message: '请输入族群名称', trigger: 'blur'}
                    ]
                },
                allPersonList: [],
                isIndeterminate: false,
                checkAll: false,
                showAdd: false
            }
        },
        computed: {
            importUrl () {
                return C.IMPORTEXCELPERSON
            },
            filterDepart() {
                let str = JSON.stringify(this.departmentList).replace(/companyName|departmentName/g, "label").replace(/personDepartmentList/g, "children");
                return JSON.parse(str)
            },
            allChecked() {
                return this.personList.map(item => item.account)
            },
            ...mapState({
                GroupList: ({exam}) => exam.GroupList,
                personList: ({exam}) => exam.personList,
                personListByDepart: ({exam}) => exam.personListByDepart, //仅按部门搜索时使用
                departmentList: ({exam}) => exam.departmentList
            })
        },
        watch: {
        },
        created() {
            if(this.isquery) {
              this.getAllGroupInfo()
              this.getAllDepartment()
            }
        },
        mounted() {
          console.log(JSON.stringify(this.getPerson))
          this.param.personName = this.getPerson
        },
        methods: {
            downTamplate() {
                console.log(123)
            //   this.downloadPaperTemplate({}).then(res => {
            //     if(res.code === 0){
            //         window.open(res.data.fileUrl)
            //     }
            //   })
            },
            beforeUpload() {
              this.uploadState = '上传中...'
            },
            uploadSuccess (response, file, fileList) {
              this.uploadState = '点击上传'
              if(response.code === 0) {
                  alert('success')
              }
            },
            getInfoByGroupId() { // 通过群组id查
                this.param.personName = [];
                this.getPersonInfoByGroupId({groupId: this.param.groupId});
            },
            // 联合查询
            getPersonByBlurStr() {
                // this.param.personName = [];
                this.getPersonByBlurName({
                    blurName: this.param.blurName,
                    department: this.param.departChecked,
                    groupName: this.param.zqGroupName
                })
            },
            delChecked(val) {
                let idx = this.param.personName.indexOf(val)
                this.param.personName.splice(idx, 1)
                this.isIndeterminate = true
            },
            handleTree (item, selfChecked, childChecked) { // 树节点选择
                //点击子节点，先触发的是父节点的状态改变
                //如果有children元素表示是公司
                if (item.children) {
                    if (selfChecked) {
                        this.param.companyChecked.push(item.label);
                    } else {
                        //如果是去勾选，从数组中删掉
                        let index = this.param.companyChecked.indexOf(item.label);
                        if (index > -1) {
                            this.param.companyChecked.splice(index, 1);
                        }
                    }
                }

                // this.param.personName = [];
                let tmpChecked = this.$refs.tree.getCheckedNodes().map( item => item.label).join(",");
                if (this.param.departChecked !== tmpChecked) {
                    this.param.departChecked = tmpChecked;

                    let company = this.param.companyChecked.join(",");
                    let department = this.param.departChecked;
                    if (!company && !department) {
                        //如果都没有勾选，需要清空人员
                        this.$store.commit(C.EMPTY_PERSON_LIST);
                    } else {
                        this.getPersonByBlurStr()
                        // this.getIsCheckExamPerson({
                        //     company: this.param.companyChecked.join(","),
                        //     department:this.param.departChecked
                        // }).then(res => {
                        //     this.allPersonList = []
                        //     res.data.forEach(item => {
                        //         item.personDepartmentList.forEach(item2 => {
                        //             item2.examCoursePersonList.forEach(item3 => {
                        //                 this.allPersonList.push(item3)
                        //             })
                        //         })
                        //     })
                        // })
                    }
                }
            },
            handleCheckAllChange(event) { //处理全选问题
                this.param.personName = event.target.checked ? this.allChecked : [];
                this.isIndeterminate = false;
            },
            handleCheckedPersonsChange(value) { // 处理选中的人员
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.allChecked.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allChecked.length;
            },
            validate(fn) {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        fn && fn()
                    } else {
                        return false;
                    }
                })
            },
            addnNewGroup(flag) {
                debugger
                let personList = this.getSelectAcount()
                let self = this
                let requestParam = {
                    groupName: self.param.newGroupName,
                    examPersonRequestList: personList.map(item => ({account: item.account}))
                };
                 debugger
                if (flag) {
                    requestParam.groupId = self.param.groupId
                } else {
                    debugger
                    requestParam.groupId = ''
                }
                this.validate(() => {
                    self.groupIsExistByGroupName({groupName: self.param.newGroupName}).then(res => {
                        if (res.data.isExist) {
                            self.$message.error("族群名称已存在！");
                            return;
                        }
                        self.addGroup(requestParam).then(res => {
                            if (res.code === 0) {
                                self.$message.success("保存成功")
                            }
                            self.getAllGroupInfo();
                            self.showAdd = false
                        })
                    })
                })
            },
            // sureAddAttendee () { //添加人员
            // 	this.$emit('add',this.param.personName)
            // },
            getSelectAcount() {
              let arr = []
                this.param.personName.forEach(item => {
                    this.allPersonList.forEach(per => {
                        if(item === per.personName) {
                          arr.push({
                              account: per.account,
                              phone: per.phone
                          })
                        }
                    })
                })
                return arr
            },
            sureAddAttendee() { //添加人员
              console.log(JSON.stringify(this.param.personName))
                // let personList = this.getSelectAcount()
                // this.$emit('addPerson', personList)
            },

            ...mapActions(
                ["getAllGroupInfo", "getPersonInfoByGroupId", "getPersonByBlurName",
                    "getAllDepartment", "getIsCheckExamPerson", "groupIsExistByGroupName", "addGroup"]
            )
        }
    }
</script>

<style lang="less">
.sel-zq {
    .el-select-dropdown__list {
        height: 280px !important;
    }
  }
.upload-wrap {

}
  .view-box {
    width:100%;
    height:240px;
    border:1px solid rgba(0,0,0,.15);
    margin-top:10px;
    overflow:hidden;
    .view-box-head {
    	height:35px;
    	line-height:35px;
    	padding:0 10px;
    	border-bottom:1px solid rgba(0,0,0,.15);
    	.view-box-title {
    	  font-size:14px;
    	  line-height:35px;
    	  text-align:center;
    	}
    }
    .view-box-body{
      max-height:200px;
      overflow:auto;
      .checked-box{
	      padding:0 10px;
	      li {
	        line-height:30px;
	      }
	    }
    }
  }

</style>
