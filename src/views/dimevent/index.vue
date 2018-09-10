<template>
    <div class="dimevent-section">
        <div class="nar-container">
            <el-button-group class="topBtnGroup">
                <el-button v-for="(item, i) in lists" :key="i" :type="item.isPrimary" size="mini" @click="routerTo(item, i)">{{ item.title }}</el-button>
            </el-button-group>
            <div class="add-charts">
                <div class="search-btn">
                    <el-input v-model="searchModel" placeholder="搜索名称或创建人" size="small" class="input-with-select" @keypress.native.enter="debounceInput">
                        <el-button slot="append" type="primary" icon="icon-search" @click="debounceInput"></el-button>
                    </el-input>
                </div>
                <el-button v-show="!($route.name===`CircleEvent`)" type="primary" icon="el-icon-plus" size="mini" class="create-new-event" @click="createNewModel">{{ createType }}</el-button>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import WaterMark from '../../mixins/watermark'
// import debounce from 'lodash.debounce'
export default {
    name: 'DimEvent',
    mixins: [WaterMark],
    data() {
        return {
            searchModel: '',
            primary: ''
        }
    },
    computed: {
        createType() {
            return this.$route.name === 'TrackEvent' ? '新建事件' : '新建复合指标'
        },
        lists(v) {
            let listitem = [{title: '圈选事件', to: '/dimevent/circle', isPrimary: 'primary'},
                {title: '埋点事件', to: '/dimevent/track', isPrimary: ''},
                {title: '复合指标', to: '/dimevent/composite', isPrimary: ''}]
            listitem.forEach(item => {
                if (item.to === this.$route.path) {
                    item.isPrimary = 'primary'
                } else {
                    item.isPrimary = ''
                }
            })
            return listitem
        }
    },
    beforeMount() {
        this.waterMk()
        // this.debounceInput = debounce(this.debounceInput.bind(this), 300)
    },
    methods: {
        debounceInput() {
            this.$children[3].searchFilter(this.searchModel) // 调用子组件的searchFilter方法，传递值
        },
        routerTo(item, index) { // route 跳转
            this.searchModel = ''
            this.$router.replace(item.to)
        },
        searchFilter() {
            this.$children[3].searchFilter(this.searchModel) // 调用子组件的searchFilter方法，传递值
        },
        createNewModel() {
            // this.$route.name === 'TrackEvent' ? this.createEvent() : this.createComsite()
            // let mySelf = this
            // mySelf.eventHub.$emit('domainChange', data)
            this.$children[3].createEvent()
        }
    }
}
</script>

<style lang="scss">
$inputBorder: #3392FF;
.dimevent-section{
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
        .el-button-group{
            vertical-align: top;
        }
    }
    .grid-btn{
        cursor: pointer;
        font-size: 22px;
        vertical-align: middle;
    }
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
.search-btn{
    width: 210px;
}
.create-new-event{
    margin-left: 18px;
}
</style>
