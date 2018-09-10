<template>
    <transition name="ec">
        <div v-if="show" class="ec">
            <div v-if="type === 'success'" class="successBox toastBox">
                <i class="icon-success"></i> {{ content }}
            </div>
            <div v-else class="failBox toastBox">
                <i class="icon-fail"></i> {{ content }}
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    data () {
        return {
            name: 'ec-alert',
            show: false,
            content: '',
            type: ''
        }
    },
    computed: {},
    mounted () {
        let _this = this
        setTimeout(function () {
            _this.show = false
        }, 2000)
    },
    methods: {
    }
}
</script>
<style lang="scss">
    .ec{
        position: absolute;
        top: 20%;
        left: 0;
        right: 0;
        z-index: 9999;
        text-align: center;
    }
    .toastBox{
        display: inline-block;
        padding: 14px 17px;
        box-shadow: 0 3px 3px rgba(0,0,0,0.16);
        color: #FFFFFF;
        border-radius: 4px;
        font-size: 16px;
    }
    .icon-success{
        display: inline-block;
        width: 20px;
        height: 14px;
        background: url("../layouts/images/icon/icon-check.png") no-repeat center;
        background-size: contain;
        position: relative;
        top: 1px;
        margin-right: 6px;
    }
    .icon-fail{
        display: inline-block;
        width: 20px;
        height: 14px;
        background: url("../layouts/images/icon/icon-fail.png") no-repeat center;
        background-size: contain;
        position: relative;
        top: 1px;
        margin-right: 6px;
    }
    .successBox{
        background-color: #3F8AFF;
    }
    .failBox{
        background: #f35974;
    }
</style>
