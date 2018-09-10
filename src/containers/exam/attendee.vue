<template>
	<div  class="attendee-style">
      <el-row :gutter="20">
          <!-- 搜索人员 -->
          <el-col :span="8">
		  	  <el-input style="width: 120px;margin-right:5px" v-model="searchName" @input="debounceInput"  placeholder="请输入搜索人员"></el-input>
              <el-button type="primary" icon="search" style="width:70px">搜索</el-button>
          </el-col>
          <!-- 选择族群 -->
		  <el-col :span="8">
		  	<el-select v-model="selectGroup" placeholder="选择族群" @change="searchGroup" popper-class='sel-zq'>
			    <el-option v-for="item in GroupList" :key="item.id"
			      :label="item.groupName" :value="item.id">
			    </el-option>
			</el-select>
		  </el-col>
		  <el-col :span="8">
		  	<!-- <el-button type="primary" icon="search" @click="getPersonByBlurStr" style="float:left; margin-right: 5px;">搜索</el-button> -->
            <el-upload
                style="float: left; margin-right: 5px"
                :headers="uploadHeaders"
                :action="importUrl"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :show-file-list="false"
                multiple
                :limit="1">
                 <el-button size="small" type="primary">{{ uploadState }}</el-button>
            </el-upload>
		    <!-- <el-button type="primary" @click="downTamplate">导入人员</el-button> -->
		    <el-button type="primary" class="down-template" @click="downTamplate">下载模板</el-button>
          </el-col>
	  </el-row>
       <el-row :gutter="20">
          <!-- 公司 -->
		  <el-col :span="8">
		  	<div class="view-box">
		  		<div class="view-box-head clearfix">
                    <el-checkbox v-model="isCheckAllCompny"  @change="CheckAllCompny" style="display: inline-block;"><span style="margin-right: 50px">全选</span>公司</el-checkbox>
		  			<!-- <div class="view-box-title"></div> -->
		  		</div>
		  		<div class="view-box-body">
		  			<el-tree
                      :data="filterCompany"
                      show-checkbox
                      default-expand-all
                      node-key="id"
                      ref="tree"
                      highlight-current
                      @check-change="handleTree">
                    </el-tree>
		  		</div>
		  	</div>
		  </el-col>
          <!-- 中间框 -->
          <el-col :span="8">
		  	<div class="view-box">
		  		<div class="view-box-head clearfix">
		  			<el-checkbox :indeterminate="isIndeterminate" v-model="checkedPerson" @change="CheckAllPerson">全选</el-checkbox>
		  		</div>
		  		<div class="view-box-body">
		  			<el-checkbox-group v-model="addPersonName">
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
		  			<div class="fl">已选({{ addPersonName.length }})</div>
		  			<el-button type="text" class="fr" v-show="addPersonName.length !==0" @click="showSaveDialog">{{selectGroup === '' ? '保存族群' : '编辑族群'}}</el-button>
		  		</div>
		  		<div class="view-box-body">
		  			<ul class="checked-box">
			  			<li v-for="(person, index) in addPersonName" :key="index" class="clearfix">
			  				<span class="fl">{{ person }}</span>
			  				<span class="fr el-icon-close line-30" @click="delCheckedPerson(person)"></span>
			  			</li>
			  		</ul>
		  		</div>
			</div>
		  </el-col>
       </el-row>

       <div slot="footer" class="dialog-footer align-center mt20">
	     <el-button type="primary" @click="sureAddAttendee" class="comfirm-add">确定</el-button>
	     <el-button type="primary" @click="cancelAddAttendee" class="cancel-add">取消</el-button>
         <!-- <el-button class="cancel-add">默认按钮</el-button> -->
       </div>

       <el-dialog
       :visible.sync="showAddGroup"
       :title="selectGroup === '' ? '保存族群' : '编辑族群'"
       v-if="showAddGroup"
       center
       class="save-dialog-zq"
       >
        <el-form  ref="ruleForm"  class="demo-ruleForm">
  		  <el-form-item label="" prop="newGroupName">
  		    <el-input :maxlength="20" v-model.trim="newGroupName" placeholder="请输入族群名称"></el-input>
  		  </el-form-item>
  		</el-form>
  	  	<div  class="dialog-footer">
            <el-button type="primary" v-show="selectGroup === ''" @click="addSaveGroup(1)" class="save-zq">保存</el-button>
  		    <el-button type="primary" v-show="selectGroup !== ''" @click="addSaveGroup(2)" class="save-zq">保存</el-button>
  		    <el-button type="primary" v-show="selectGroup !== ''" @click="addSaveGroup(3)" class="lin-save-zq" :disabled="newGroupName === equalGroupName">另存为新族群</el-button>
  		</div>
	  </el-dialog>
	</div>
</template>

<script>
    import {mapActions, mapState} from "vuex";
    import * as C from "../../constants/api";
    import Api from "../../utils/api"
    import debounce from 'lodash.debounce'

    export default {
        name: "attendee",
        props: {
            isquery: Boolean,
            getQueryPerson:{
              type: Array,
              default: (() => {
                  return []
              })
            },
            isShowAttendee: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                uploadHeaders: {
                   __DEBUG__DEV__: 1
                },
                isIndeterminate: false,
                isCheckAllCompny: false, // 所有部门的人员是否全选
                checkedPerson: false,
                showAddGroup: false, // 新增或替换族群窗口
                uploadState: '导入人员',
                newGroupName: '', // 新建的族群名称
                treeCompanyArr: [],
                departChecked: '',
                selectCompanyArr: [],
                personList: [], // 根据搜索或者公司查询出来的人员列表
                addPersonName: [], // 已选的人员名称
                addPersonArrObj: [], //已选的人员的完整信息对象
                singleGroupPerson: [], // 选中的族群的人员
                allDepartmentId: [], //含有id的部门
                // rules: {
                //     newGroupName: [
                //         {required: true, message: '请输入族群名称', trigger: 'blur'}
                //     ]
                // },
                selectGroup: '', // 选中的族群
                searchName: '', // 搜索的名字
                equalGroupName: ''
            }
        },
        computed: {
            importUrl () {
                return C.IMPORTEXCELPERSON
            },
            filterCompany() {
                let company = JSON.parse(JSON.stringify(this.departmentList).replace(/companyName|departmentName/g, "label").replace(/personDepartmentList/g, "children"));
                let num = 0
                company.forEach(item => {
                    item.id = num
                    num++
                    delete item.fullName
                    item.children.forEach(item2 => {
                        item2.id = num
                        delete item2.examCoursePersonList
                        // 给含有id的部门新放一个数组
                        this.allDepartmentId.push({
                            id: item2.id,
                            department: item2.label
                        })
                        num ++
                        return item2
                    })
                    return item
                });
                return company
            },
            ...mapState({
                GroupList: ({exam}) => exam.GroupList,
                departmentList: ({exam}) => exam.departmentList
            })
        },
        watch: {
            addPersonArrObj(newVal, oldVal) {
              console.log(JSON.stringify(newVal));
            },
            isShowAttendee(newVal, oldVal) {
              if(newVal) {
                  this.clearQueryParam()
              }
            },
            'getQueryPerson': {
                handler(){
                  this.setQueryPerson()
                },
                deep: true
            },
            // 监听选中了哪些公司
            selectCompanyArr(newVal, oldVal) {
                 this.getPersonByBlurName({
                    blurName: this.searchName,
                    department: newVal,
                    groupName: ''
                }).then(res => {
                  if(res.data === null) {
                      this.personList = []
                  } else {
                      this.personList = res.data
                  }

                })
            },
            personList(newVal, oldVal) {
                let newZjPerson = []
              if(newVal === null) {
                  this.checkedPerson = false
                  this.isIndeterminate = false
              }
              this.addPersonName.map(item1 => {
                   this.personList.map(item2 => {
                       if(item1 === item2.personName) {
                           newZjPerson.push(item2.personName)
                       }
                   })
                 })
                 if(newZjPerson.length > 0 && newZjPerson.length < this.personList.length) {
                     this.isIndeterminate = true
                 } else if(newZjPerson.length === this.personList.length && this.personList.length !== 0) {
                     this.checkedPerson = true
                     this.isIndeterminate = false
                 } else if(newZjPerson.length === 0 || this.personList.length === 0){
                     this.checkedPerson = false
                     this.isIndeterminate = false
                 }


            },
            addPersonName(newVal, oldVal) {
                // 新增的人员的详情信息

                let singleGroupArrName = this.singleGroupPerson.map(item => item.personName)
                let personObjArr = []
                let newZjPerson = [] //中间框选中的人员
                newVal.map(item1 => {
                   this.personList.map(item2 => {
                       if(item1 === item2.personName) {
                           newZjPerson.push(item2.personName)
                           if(singleGroupArrName.indexOf(item1) === -1) {
                               personObjArr.push(item2)
                           }
                       }
                   })
                 })

                 if(newZjPerson.length > 0 && newZjPerson.length < this.personList.length) {
                     this.isIndeterminate = true
                 } else if(newZjPerson.length === this.personList.length && this.personList.length !== 0) {
                     this.checkedPerson = true
                     this.isIndeterminate = false
                 } else if(newZjPerson.length === 0 || this.personList.length === 0){
                     this.checkedPerson = false
                     this.isIndeterminate = false
                 }

                this.addPersonArrObj = this.singleGroupPerson.concat(personObjArr)
                this.singleGroupPerson = this.addPersonArrObj
                // this.addPersonArrObj
            }
        },
        created() {
            if(this.isquery) {
              this.getAllGroupInfo()
              this.getAllDepartment()
            }
        },
        beforeMount() {
          this.debounceInput = debounce(this.debounceInput.bind(this), 500)
        },
        mounted() {
         this.setQueryPerson()
        },
        methods: {
            debounceInput() {
                console.log(12322)
                // 搜索人员调用的debounce值
                this.toSearchName()
            },
            toSearchName() {
               let newVal = this.searchName
               if(newVal === '') {
                  this.$refs.tree.setCheckedKeys([])
                  this.personList = []
                  return
                }
                this.getPersonByBlurName({
                    blurName: newVal,
                    department: this.selectCompanyArr.toLocaleString(),
                    groupName: ''
                }).then(res => {
                  this.personList = res.data
                     let ids = []
                      this.personList.forEach(item2 => {
                          this.allDepartmentId.forEach(item1 => {
                            if(item1.department === item2.department) {
                                if(ids.indexOf(item1.id) === -1) {
                                  ids.push(item1.id)
                                }

                            }
                        })
                      })
                    //   this.$refs.tree.setCheckedKeys([3]);
                    this.$refs.tree.setCheckedKeys(ids);
                })
            },
            // 清空查询条件
            clearQueryParam() {
              this.$refs.tree.setCheckedKeys([])
              this.searchName = ''
              this.selectGroup = ''
            },
            setQueryPerson() {
               if(this.getQueryPerson !== 0) {
                    let newPersonObj = this.getQueryPerson.map(item => {
                        return {
                            account: item.userAccount,
                            personName: item.userName,
                            phone: item.phone,
                            department: item.department
                        }
                    })
                    let names = newPersonObj.map(item => item.personName)
                    this.addPersonName = names
                    this.singleGroupPerson = this.addPersonArrObj = newPersonObj
                }
            },
            // 选择的人员全选
            CheckAllPerson() {
              if(this.checkedPerson) {
                this.addPersonName = this.personList.map(item => item.personName)
              } else {
                this.addPersonName = []
              }
            },
            // 全公司人员全选
            CheckAllCompny() {
                if(this.isCheckAllCompny) {
                  let ids = this.allDepartmentId.map(item => item.id)
                  this.$refs.tree.setCheckedKeys(ids);
                } else {
                  this.$refs.tree.setCheckedKeys([]);
                }

            },
            // 保存族群时显示保存窗口
            showSaveDialog() {
              this.showAddGroup = true
              this.newGroupName = ''
              this.GroupList.forEach((item) => {
                if(item.id === this.selectGroup) {
                   this.newGroupName = item.groupName
                   this.equalGroupName = item.groupName
                }
              })
            },
            sureAddAttendee() { //添加人员
            //   let personList = this.addPersonArrObj
              if(this.addPersonArrObj.length === 0) {
                  this.$message.warning('已选用户不能为空')
                  return
              }
              this.$emit('addPerson', this.addPersonArrObj, true)
            },
            cancelAddAttendee() {
              this.$emit('addPerson', this.addPersonArrObj, false)
            },
            goAddSaveGroup(flag) {
                let checkedPerson = this.addPersonArrObj
                let requestParam = {
                    groupName: this.newGroupName,
                    examPersonRequestList: checkedPerson.map(item => ({account: item.account}))
                }

                // if (flag) {
                requestParam.groupId = ''
                if(flag === 1 || flag === 3) {
                    this.GroupList.forEach(item => {
                        if(item.groupName === this.newGroupName) {
                            requestParam.groupId = item.id
                        }
                    })
                } else if(flag === 2) {
                    this.GroupList.forEach(item => {
                        if(item.groupName === this.equalGroupName) {
                            requestParam.groupId = item.id
                        }
                    })
                }
                // } else {
                //     requestParam.groupId = this.selectGroup
                // }
                this.addGroup(requestParam).then(res => {
                    if (res.code === 0) {
                        this.$message.success("保存成功")
                    }
                    this.getAllGroupInfo()
                    this.showAddGroup = false
                })
            },
            // 保存族群
            addSaveGroup(flag) {
                if(this.newGroupName === '') {
                    this.$message.warning('族群名不能为空')
                    return
                }

                // if(this.newGroupName === this.equalGroupName) {

                // }
                this.groupIsExistByGroupName({groupName: this.newGroupName}).then(res => {
                    if (res.data.isExist) {

                     if(flag === 2 && this.newGroupName !== this.equalGroupName) {
                        this.$message.warning('已存在该族群名称,请重新输入')
                        return
                     } else if(flag === 2 && this.newGroupName === this.equalGroupName) {
                         this.goAddSaveGroup(flag)
                         return
                     }
                     this.$confirm('族群名称已存在,是否覆盖原来族群?')
                        .then(_ => {
                          this.goAddSaveGroup(flag)
                        })
                        .catch(_ => {
                           return;
                        });
                        // self.$message.error("族群名称已存在！");
                    } else {
                         this.goAddSaveGroup(flag)
                    }

                })
            },
            // 删除已选中的人员
            delCheckedPerson(val) {
               let idx = this.addPersonName.indexOf(val)
               this.addPersonName.splice(idx, 1)
               let newsingleGroupPerson = []
               this.singleGroupPerson.forEach(item => {
                   if(item.personName !== val) {
                       newsingleGroupPerson.push(item)
                   }
               })
               this.singleGroupPerson = newsingleGroupPerson

            },
            // 选中的树
            handleTree(item, selfChecked, childChecked) {
           //点击子节点，先触发的是父节点的状态改变
                //如果有children元素表示是公司
                if (item.children) {
                    if (selfChecked) {
                        this.treeCompanyArr.push(item.label);
                    } else {
                        //如果是去勾选，从数组中删掉
                        let index = this.treeCompanyArr.indexOf(item.label);
                        if (index > -1) {
                            this.treeCompanyArr.splice(index, 1);
                        }
                    }
                }
                // this.param.personName = [];
                let tmpChecked = this.$refs.tree.getCheckedNodes().map( item => item.label).join(",");
                if (this.departChecked !== tmpChecked) {
                    this.departChecked = tmpChecked;
                    let company = this.treeCompanyArr.join(",");
                    let department = this.departChecked;
                    if (!company && !department) {
                        this.selectCompanyArr = ''
                    } else {
                        this.selectCompanyArr = tmpChecked
                    }
                }
            },
            // 全局搜索人员
            searchPerson() {
            this.$refs.tree.setCheckedKeys([3, 5]);
            //   this.getPersonByBlurName({
            //         blurName: this.searchName,
            //         department: '',
            //         groupName: ''
            //     }).then(res => {
            //       this.personList = res.data
            //     // 取消公司选中状态
            //       this.$refs.tree.setCheckedKeys([])
            //     })
            },
            searchGroup() {
                if(this.selectGroup) {
                   this.getPersonInfoByGroupId({groupId: this.selectGroup}).then(res => {
                        // 清空
                        let names = res.data.map(item => item.personName)
                        this.addPersonName = names
                        this.addPersonArrObj = res.data
                        // 选中的族群人员单独放入
                        this.singleGroupPerson = res.data
                    })
                }
            },
            downTamplate() {
                Api.downloadPersonTemplate({}).then(res => {
                    if(res.code === 0){
                        window.open(res.data.fileUrl)
                    }
                })
            },
            beforeUpload() {
              this.uploadState = '上传中...'
            },
            uploadSuccess (response, file, fileList) {
              this.uploadState = '导入人员'
              if(response.code === 0) {
                 let newPersonObj = response.data.map(item => {
                  return {
                        account: item.userAccount,
                        personName: item.personName,
                        phone: item.phone
                     }
                  })
                 let names = newPersonObj.map(item => item.personName)
                 this.addPersonName = names
                 this.singleGroupPerson = this.addPersonArrObj = newPersonObj
              }
              if(response.code === 6) {
                  this.$message.warning({
                     message: response.message
                  })
              }
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
.attendee-style {
  .save-dialog-zq {
    .dialog-footer {
        text-align: center;
        margin-top: 10px;
        // margin-bottom: 50px;
    }
    .el-dialog--small {
      width: 35% !important;
    }
  }
  .save-zq {
    margin-top: 8px;
    width: 120px;
    border-radius: 34px;
    margin-bottom: 10px;
  }
  .lin-save-zq {
      width: 120px;
      border-radius: 34px;
  }
  .demo-ruleForm {
      margin-top: 10px;
  }
  .save-dialog {
      width: 384px;
  }
  .comfirm-add {
    width: 160px;
    border-radius: 32px;
  }
  .cancel-add{
    width: 160px;
    border-radius: 32px;
    border: 1px solid #E6E7ED;
    background-color: #fff;
    color: #9B9B9B;
  }
  .cancel-add:hover {
    background-color: #fff;
    color: #20a0ff;
    border: 1px solid #20a0ff;
  }
  .down-template {
      float: right;
      background-color: #fff;
      color:#489EFB;
      border: 1px solid #489EFB;
  }
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
