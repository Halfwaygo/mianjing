<template>
    <div class="graph-section">
        <div :class="narBarUnShow? 'none': ''" class="nar-container">
            <el-button-group class="topBtnGroup">
                <el-button v-for="(item, i) in lists" :key="i" :type="item.isPrimary" size="mini" @click="routerTo(item, i)">{{ item.title }}</el-button>
            </el-button-group>
            <i :class="isGridShow ? 'grid-el-icon': 'list-el-icon'" class="grid-btn" @click="showListStyle"></i>
            <div class="add-charts">
                <div class="search-btn">
                    <el-input v-model="searchModel" placeholder="搜索单图名称或创建人" size="small" class="input-with-select" @keypress.native.enter="debounceInput">
                        <el-button slot="append" type="primary" icon="icon-search" @click="debounceInput" ></el-button>
                    </el-input>
                </div>
                <router-link :to="createNewModel" class="create-new-graph">
                    <el-button type="primary" icon="el-icon-plus" size="mini">新建单图</el-button>
                </router-link>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import WaterMark from '../../mixins/watermark'
// import debounce from 'lodash.debounce'
import {mapState} from 'vuex'
export default {
    name: 'Graph',
    components: {},
    mixins: [WaterMark],
    data() {
        return {
            searchModel: '',
            primary: '',
            isGridShow: true // 控制显示列表的grid  list样式
        }
    },
    computed: {
        ...mapState({
            platform: ({root}) => root.platform
        }),
        narBarUnShow() {
            if (this.$route.path === '/graph/new') {
                return true
            }
            return false
        },
        lists(v) {
            // let listitem = [{title: '事件分析', to: '/graph/charts', isPrimary: 'primary'},
            //     {title: '漏斗分析', to: '/graph/funnels', isPrimary: ''},
            //     {title: '留存分析', to: '/graph/retention', isPrimary: ''},
            //     {title: '渠道分析', to: '/graph/channel', isPrimary: ''},
            //     {title: '分群分析', to: '/graph/cluster', isPrimary: ''}]
            let listitem = null
            if (this.platform === '0') {
                listitem = [{title: '事件分析', to: '/graph/charts', isPrimary: 'primary'},
                    {title: '漏斗分析', to: '/graph/funnels', isPrimary: ''},
                    {title: '留存分析', to: '/graph/retention', isPrimary: ''},
                    {title: '渠道分析', to: '/graph/channel', isPrimary: ''},
                    {title: '分群分析', to: '/graph/cluster', isPrimary: ''}]
            } else {
                listitem = [{title: '事件分析', to: '/graph/charts', isPrimary: 'primary'},
                    {title: '漏斗分析', to: '/graph/funnels', isPrimary: ''},
                    {title: '留存分析', to: '/graph/retention', isPrimary: ''},
                    {title: '分群分析', to: '/graph/cluster', isPrimary: ''}]
            }
            listitem.forEach(item => {
                if (item.to === this.$route.path) {
                    item.isPrimary = 'primary'
                } else {
                    item.isPrimary = ''
                }
            })
            return listitem
        },
        createNewModel() {
            let path = `/graph/new?type=${this.$route.name}`
            return path
        }
    },
    beforeMount() {
        this.waterMk()
        // this.debounceInput = debounce(this.debounceInput.bind(this), 300)
    },
    methods: {
        debounceInput() {
            if (this._lastValue === this.searchModel) return
            this.$children[3].searchFilter(this.searchModel) // 调用子组件的searchFilter方法，传递值
            this._lastValue = this.searchModel
        },
        routerTo(item, index) { // route 跳转
            this.$router.replace(item.to)
        },
        showListStyle() {
            this.isGridShow = !this.isGridShow
            let istype = this.isGridShow ? 'grid' : 'list'
            console.log(`呈现 ${istype} 列表`)
        },
        searchFilter() {
            this.$children[3].searchFilter(this.searchModel) // 调用子组件的searchFilter方法，传递值
        }
    }
}
</script>

<style lang="scss">
    $inputBorder: #3392FF;
    .graph-section{
        padding: 30px 25px;
    }
    .none.nar-container{
        display: none;
    }
    .nar-container{
        display: block;
        min-width: 800px;
        .el-button-group,.search-btn{
            display: inline-block;
        }
        .add-charts{
            display: inline-block;
            float: right;
            height: 30px;
            .el-button-group{
                vertical-align: top;
            }
        }
        .grid-btn{
            cursor: pointer;
            font-size: 22px;
            vertical-align: middle;
            display: inline-block;
            margin-left: 20px;
            width: 16px;
            height: 16px;
            &.list-el-icon{
                background-image: url("../../layouts/images/icon/icon-line-blue.png");
                background-repeat: no-repeat;
                background-size: contain;
            }
            &.grid-el-icon{
                background-image: url("../../layouts/images/icon/icon-menu-blue.png");
                background-repeat: no-repeat;
                background-size: contain;
            }
        }
    }
    .input-with-select{
        .el-input-group__prepend {
            background-color: #fff;
        }
    }
    .search-btn{
        width: 210px;
    }
    .create-new-graph{
        margin-left: 18px;
    }
    .input-with-select{
         .el-input__inner,.el-input-group__append{
             border: 1px solid $inputBorder;
         }
         .el-input-group__append{
             background-color: $inputBorder;
             color: #FFFFFF;
         }
         .el-input-group__prepend {
             background-color: #fff;
         }
        .el-button{
            padding: 12px 14px;
        }
     }
</style>
