<template>
    <el-dialog
        :visible="createDashBoardDialogVisible"
        :close-on-click-modal="false"
        title="添加到看板"
        width="640px"
        top="0"
        class="createDialogToBoard"
        @close="closeDialogVis">
        <div class="addLogBox">
            <el-input
                v-model="inputSearchText"
                placeholder="请输入内容"
                size="small"
                @input="debounceInput"
            >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div class="infoList">
                <ul>
                    <li v-for="(k, i) in result" :class="k.isAct? 'is-active': ''" :key="i" @click="switchSelected(k,i)">{{ k.name }}<i class="el-icon-check"></i></li>
                </ul>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button class="cancel" @click.stop="closeDialogVis">取 消</el-button>
            <el-button type="primary" class="confirm" @click="createDashBoard">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import Api from '../../utils/api.js'
import debounce from 'lodash.debounce'

export default {
    name: 'DialogAddDashBoard',
    components: {},
    props: {
        createDashBoardDialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            inputSearchText: '',
            defaultAct: '',
            result: [],
            allResult: []
        }
    },
    computed: {
        ...mapState({
            appId: ({root}) => root.appId
        })
    },
    beforeMount() {
        this.debounceInput = debounce(this.debounceInput.bind(this), 300)
    },
    mounted() {
        this.getBordIndex()
    },
    methods: {
        debounceInput() {
            this.searchBtn() // 调用子组件的searchFilter方法，传递值
        },
        getBordIndex() {
            Api.getAllBoard({
                appId: this.appId
            }).then(res => {
                let bordObj = {}
                res.datas.sort((a, b) => { return a.name.localeCompare(b.name) })
                res.datas.forEach(item => {
                    bordObj = item
                    bordObj.isAct = false
                    this.result.push(bordObj)
                    this.allResult.push(bordObj)
                })
            })
        },
        createDashBoard() {
            console.log('调用确定接口，成功后关闭窗口')
            this.$emit('addDashBoard', this.result[this.defaultAct].id)
            this.closeDialogVis()
        },
        closeDialogVis() {
            console.log('close前，数据清空处理')
            this.$emit('closeDialog')
        },
        searchBtn() {
            // console.log(`搜索内容为<----${this.inputSearchText}----->`)
            this.result = this.allResult.filter((item) => { return (item.name.indexOf(this.inputSearchText) !== -1) })
            // this.$emit('searchText', this.inputSearchText)
        },
        switchSelected($events, $index) {
            if ($index !== this.defaultAct) {
                if (this.defaultAct !== '') {
                    this.result[this.defaultAct]['isAct'] = false
                }
                this.defaultAct = $index
                this.result[$index]['isAct'] = !this.result[$index]['isAct']
            }
        }
    }
}
</script>

<style lang="scss">
.createDialogToBoard{
    .dialog-footer {
        .cancel {
          width: 100px;
        }
        .confirm {
           width: 100px;
           margin-left: 10px;
        }
    }
    .el-dialog{
        border-radius: 4px;
        box-shadow:0px 0px 21px rgba(25,147,208,0.17);
        .el-dialog__header{
            border-radius: 4px;
            background-color: #F7FAFF;
            border-bottom: 1px solid #D3E2FE;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            padding: 0 20px;
            height: 46px;
            line-height: 46px;
            button[type='button'].el-dialog__headerbtn{
                top: 0;
            }
            .el-dialog__title{
                font-size: 16px;
                color: #5A6D82;
            }
        }
        .el-dialog__body{
            padding: 30px 40px;
        }
        .addLogBox{
            .infoList{
                margin-top: 10px;
                max-height: 200px;
                overflow-y: scroll;
                ul{
                    padding: 0;
                    margin: 0;
                    list-style: none;
                    li{
                        color: #5A6D82;
                        font-size: 12px;
                        height: 40px;
                        line-height: 40px;
                        text-indent: 10px;
                        i.el-icon-check{
                            display: none;
                            margin-right: 10px;
                            color: #2db7f5;
                            font-size: 18px;
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                    li:hover{
                        background-color: #409EFF;
                        color: #FFFFFF;
                        i.el-icon-check{
                            display: none;
                            color: #2db7f5;
                            font-size: 18px;
                            height: 40px;
                            line-height: 40px
                        }
                    }
                    li.is-active{
                        background-color: #409EFF;
                        color: #FFFFFF;
                        i.el-icon-check{
                            float: right;
                            color: #FFFFFF;
                            display: inline-block;
                            font-size: 18px;
                            height: 36px;
                            line-height: 36px
                        }
                    }
                }
            }
        }
    }
}
</style>
