<template>
    <div v-show="showIcon" class="scroll-icon" @click="scrollToTop"></div>
</template>

<script>
export default {
    name: 'ScrollTop',
    components: {
    },
    props: {
        scrollQuery: {
            type: String,
            default: 'body'
        }
    },
    data() {
        return {
            showIcon: false
        }
    },
    computed: {
    },
    mounted() {
        this.$nextTick(() => {
            console.log(this.scrollQuery)
            document.getElementsByClassName(this.scrollQuery).item(0).onscroll = ($events) => {
                let sTop = $events.srcElement.scrollTop
                if (sTop > 100) {
                    this.showIcon = true
                } else {
                    this.showIcon = false
                }
            }
        })
    },
    methods: {
        scrollToTop() {
            document.getElementsByClassName(this.scrollQuery).item(0).scrollTop = 0
        }
    }
}
</script>

<style lang='scss' scoped>
    .scroll-icon{
        background-image: url("../../layouts/images/icon/scroll_top.png");
        background-repeat: no-repeat;
        background-size: contain;
        height: 50px;
        width: 54px;
        position: fixed;
        bottom: 40px;
        right: 30px;
        transition: all ease-in-out 0.5s;
        cursor: pointer;
        z-index:100;
    }
</style>
