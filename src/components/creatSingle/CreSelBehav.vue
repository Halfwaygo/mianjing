<template>
    <div class="cre-sel-behavior">
        <loading-indicator :showing="pageLoading"></loading-indicator>
        <div id="behavior" class="show-title">{{ name }}</div>
        <div class="show-content">
            <img v-show="selmaintype !== 'retation'" src="../../layouts/images/icon/start-up.png">
            <img v-show="selmaintype == 'retation'" src="../../layouts/images/icon/retation.png">
            <div class="select-mc" @click="showDialog">
            </div>
            <el-select v-model="selvalue" placeholder="请选择" readonly="true" class="select-value">
            </el-select>

            <div v-show="isShowDialog" class="dialog" >
                <div v-show="isShowDialog" class="mc" @click="showDialog"></div>
                <div class="left-dialog">
                    <div class="search-h">
                        <el-input
                            v-model="serchInput"
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                        >
                        </el-input>
                    </div>

                    <div class="dia-menu">
                        <el-select v-model="platSelValue" placeholder="请选择" class="plat-option">
                            <el-option
                                v-for="item in platOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="typeSelValue" placeholder="请选择" class="type-option">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="xz-person">
                        <div v-for="(item,index) in xzOptions" :class="{'is-checked': filterChected(item)}" :key="index" class="xz-h" @click="changeXz(item)" >
                            <img v-show="filterChected(item)" src="../../layouts/images/icon/icon-check.png" >
                            {{ filterName(item.isComplex,item.name,item.isPage,item.innerType) }}
                        </div>

                    </div>

                </div>

                <div class="right-dialog">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Api from '../../utils/api.js'
import LoadingIndicator from '../../components/LoadingIndicator' // loading加载

export default {
    name: 'CreSelBehav',
    components: {
        LoadingIndicator
    },
    props: {
        name: {
            type: String,
            default: '目标用户'
        },
        selmaintype: {
            type: String,
            default: ''
        },
        behavior: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            pageLoading: false,
            isShowDialog: false,
            serchInput: '', // 搜索值
            ptName: '全部平台', // 平台名字
            typeName: '全部类型', // 类型名字
            checkedNum: {
                id: '',
                innerType: ''
            }, // 被选中的信息
            activeIndex: '1',
            selvalue: '',
            platSelValue: '100', // 平台
            typeSelValue: '100', // 类型
            platOptions: [{ // 平台的类型
                value: '100',
                label: '全部平台'
            }, {
                value: '1',
                label: 'Android'
            }, {
                value: '2',
                label: 'Ios'
            }, {
                value: '3',
                label: 'web'
            }, {
                value: '4',
                label: '自定义'
            }],
            typeOptions: [{
                value: '100',
                label: '全部类型'
            }, {
                value: '{"isPage": 0,"innerType": 1}',
                label: '元素浏览'
            }, {
                value: '{"isPage": 0,"innerType": 2}',
                label: '元素点击'
            }, {
                'value': '{"isPage": 1,"innerType": 1}',
                'label': '页面浏览'
            }],
            xzOptions: [],
            initOptions: []
        }
    },
    computed: {
        ...mapState({
            // 获取app ID
            appId: ({root}) => root.appId
        })
    },
    watch: {
        behavior(newVal, oldVal) {
            // let id = newVal.split('#')[0]
            let valId = newVal.split('#')[0]
            let valInnerType = newVal.split('#')[1]
            this.checkedNum = {
                id: valId,
                innerType: valInnerType
            }
            // 判断是否有indeoList值，没有值请求一次数据在给input赋值
            if (this.initOptions.length !== 0) {
                this.initOptions.forEach(item => {
                    if (item.id === valId && item.innerType) {
                        this.setSelectName(item.isComplex, item.isPage, item.innerType, item.name)
                    }
                })
            } else {
                Api.graphGetRetainIndexList({
                    appId: this.appId,
                    id: ''
                }).then(res => {
                    this.xzOptions = JSON.parse(JSON.stringify(res.data3.concat(res.data1).concat(res.data2)))
                    this.initOptions = JSON.parse(JSON.stringify(res.data3.concat(res.data1).concat(res.data2)))
                    this.initOptions.forEach(item => {
                        if (item.id === valId && item.innerType) {
                            this.setSelectName(item.isComplex, item.isPage, item.innerType, item.name)
                        }
                    })
                })
                this.pageLoading = false // 关闭loading
            }
            // this.checkedNum = newVal
        },
        platSelValue(newVal, oldVal) {
            this.conditionData()
        },
        typeSelValue(newVal, oldVal) {
            this.conditionData()
        },
        serchInput(newVal, oldVal) {
            this.conditionData()
        }
    },
    beforeMount () {
        if (this.$route.query.mode !== 'edit' && this.$route.query.mode !== 'detail') {
            this.getBehavData()
        }
    },
    methods: {
        showDialog() {
            this.isShowDialog = !this.isShowDialog
        },
        setSelectName(isComplex, isPage, innerType, name) {
            if (isPage === 0) {
                if (innerType === 1) {
                    isComplex === 4 ? this.selvalue = name : this.selvalue = `元素浏览 | ${name}`
                } else if (innerType === 2) {
                    this.selvalue = `元素点击 | ${name}`
                }
            } else if (isPage === 1) {
                this.selvalue = `页面浏览 | ${name}`
            }
        },
        filterName(isComplex, name, isPage, innerType) {
            if (isComplex === 4) { // 任意行为
                return name
            }
            if (isPage === 0) {
                if (innerType === 1) {
                    return `元素浏览 | ${name}`
                } else if (innerType === 2) {
                    return `元素点击 | ${name}`
                }
            } else if (isPage === 1) {
                return `页面浏览 | ${name}`
            }
        },
        // 筛选后的数据
        conditionData() {
            this.xzOptions = []
            const platSelValue = this.platSelValue
            const typeSelValue = JSON.parse(this.typeSelValue)
            this.initOptions.forEach((item, index) => {
                if (item.name.indexOf(this.serchInput) !== -1) {
                    if (parseInt(platSelValue) === parseInt(item.type) || this.platSelValue === '100') {
                        if ((parseInt(typeSelValue.isPage) === parseInt(item.isPage) && parseInt(typeSelValue.innerType) === parseInt(item.innerType)) || this.typeSelValue === '100') {
                            this.xzOptions.push(item)
                        }
                    }
                }
            })
            // console.log(JSON.stringify(this.xzOptions))
        },
        getBehavData() {
            Api.graphGetRetainIndexList({
                appId: this.appId,
                id: ''
            }).then(res => {
                this.pageLoading = false // 关闭loading
                this.xzOptions = JSON.parse(JSON.stringify(res.data3.concat(res.data1).concat(res.data2)))
                this.initOptions = JSON.parse(JSON.stringify(res.data3.concat(res.data1).concat(res.data2)))
                this.changeXz(this.initOptions[0])
            })
        },
        selectBoxPro(item) {
        },
        propFilterCancel() {
            document.getElementById('behavior').click()
        },
        propFilterConfirm() {
            document.getElementById('behavior').click()
        },
        handleSelect(key, keyPath) {
            // console.log(keyPath)
            const ptArr = ['全部平台', 'ios', 'Android', '全部类型', '页面浏览', '元素浏览', '元素点击']
            const getPath = keyPath[1]
            switch (getPath) {
            case '1-1':
                this.ptName = ptArr[0]
                break
            case '1-2':
                this.ptName = ptArr[1]
                break
            case '1-3':
                this.ptName = ptArr[2]
                break
            case '2-1':
                this.typeName = ptArr[3]
                break
            case '2-2':
                this.typeName = ptArr[4]
                break
            case '2-3':
                this.typeName = ptArr[5]
                break
            case '2-4':
                this.typeName = ptArr[6]
                break
            }
        },
        changeXz(item) {
            this.checkedNum = {
                id: item.id,
                innerType: item.innerType
            }
            let newthis = this
            window.setTimeout(() => {
                newthis.isShowDialog = false
            }, 200)
            this.$emit('getBehavValue', this.checkedNum)
        },
        filterChected(item) {
            if (this.checkedNum.id === item.id && this.checkedNum.innerType === item.innerType) {
                // this.selvalue = item.name
                this.setSelectName(item.isComplex, item.isPage, item.innerType, item.name)
                return true
            }
        }
    }
}
</script>

<style lang="scss">
.cre-funels-proper  {
  .filterHead {
      display: none;
  }
  .filterTypeBox {
    border: 0 !important;
    box-shadow: 0 0 0px red !important;
  }

  .contro {
      @mixin pubmixin() {
          display: inline-block;
          cursor: pointer;
          text-align: center;
          width: 100px;
          height: 32px;
          line-height: 32px;
          font-size: 14px;

      }
      .cancel {
          @include pubmixin;
          background-color: #fff;
          color: #5A6D82;
          border: 1px solid #E6E7ED;
      }
      .confirm {
          @include pubmixin;
          background-color: #3392FF;
          color: #fff;
      }
      float: right;
      width: 210px;
  }

       background: #F9FAFC;
}

.cre-sel-behavior {
  .show-title {
    height: 36px;
    line-height: 36px;
    padding-left: 15px;
    border-bottom: 1px solid #C2D3E0;
  }
  .show-content {
    position: relative;
    padding: 20px 0;
    .select-mc {
      position: absolute;
      display: inline-block;
      cursor: pointer;
      margin-left: 3px;
      height: 40px;
      width: 355px;
      z-index: 1;
    }
    .select-value {
        .el-input__inner {
            height: 32px;
            line-height: 32px;
        }
    }
    .el-select {
      margin-left: 3px;
    }
    .click-dk {
      text-align: center;
      color: #6D7684;
      background: white;
      border-radius: 2px;
      margin-left: 49px;
      width: 355px;
      min-height: 32px;
      line-height: 32px;
      border: 1px solid #C2D3E0;
      margin-top: 8px;
    }
    .jh-btn {
      z-index: 2;
      width: 20px;
      top: 63px;
      right: 0;
      opacity: 0;
      position: absolute;
    }
    .prop-img {
      z-index: 1;
      width: 20px;
      top: 69px;
      right: 12px;
      position: absolute;
    }
    img {
      width: 15px;
      margin-left: 22px;
      margin-right: 2px;
    }
    .el-input {
        width: 100%;
    }
    .el-select {
      width: 355px;
    }
      .dialog {
        .mc {
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
        }
        .left-dialog {
            .search-h {
                .el-input__icon {
                line-height: 32px;
                }
                .el-input__prefix {
                left: 308px !important;
                }
                .el-input {
                    width: 337px;
                    margin-left: 20px;
                }
                .el-submenu {
                    width: 114px;
                }
                input {
                    height: 32px;
                }
                margin-top: 15px;
                height: 32px;
            }
            .dia-menu {
                .el-input__inner {
                color: #3392FF;
                height: 32px;
                font-size: 12px;
                }
                .plat-option {
                display: inline-block;
                width: 223px;
                }
                .type-option {
                display: inline-block;
                width: 100px;
                margin-left: 8px;
                }
            padding-left: 17px;
            margin-top: 10px;
            height: 42px;
            }
            .xz-person {
            .xz-h{
                img {
                position: absolute;
                width: 12px;
                height: 8px;
                top: 10px;
                left: 1px;
                }
                position: relative;
                padding-left: 38px;
                height: 30px;
                line-height: 30px;
            }
            .xz-h:hover{
                background-color: #f5f7fa;
            }
            .is-checked{
                background-color: #3392FF !important;
                color: #fff;
            }
            .is-checked:after{
                position: absolute;
                right: 10px;
                font-family: element-icons;
                content: "\E611";
                font-size: 12px;
                font-weight: 700;
                -webkit-font-smoothing: antialiased;
                color: #409eff;
            }
            position: relative;
            height: 240px;
            overflow: auto;
            }
            width: 358px;
            z-index: 500;
        }
        .right-dialog {
            position: relative;
            padding-left: 20px;
            flex: 1;
        }
        position: absolute;
        display: flex;
        z-index: 3;
        background-color: #fff;
        border: 1px solid #E6E7ED;
        margin-left: 46px;
        margin-top: 5px;
        width: 382px;
        height: 360px;
    }
  }
   position: relative;
   border: 1px solid #E5E5E5;
   box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
   background-color: #F9FAFC;
   width: 460px;
}
</style>
