<template>
    <div class="i-checked-box">
        <div :class="isCheckedBox ? 'ssjrff' : 'addsff'" class="is-checked-b addsff" @click="setIndex(dex)">
            <div class="is-checked-img">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'i-checked-box',
    props: {
        isChecked: {
            type: Boolean
        },
        dex: {
            type: Number
        }
    },
    data() {
        return {
            isCheckedBox: false
        }
    },
    watch: {
        isChecked(newChecked, oldChecked) {
            this.isCheckedBox = newChecked
        }
    },
    mounted() {
        this.isCheckedBox = this.isChecked
    },
    methods: {
        setIndex(dex) {
            this.isCheckedBox = !this.isCheckedBox
            this.$emit('checkIndex', {'dex': dex, 'isChecked': this.isCheckedBox})
        }
    }
}
</script>

<style lang="scss">
.i-checked-box {
     .addsff {
        background-color: #ADD3FF;
     }
     .ssjrff {
        background-color: #3392FF;
     }
    .is-checked-b {
        position: absolute;
        width: 25px;
        height: 25px;
        right: -14px;
        top: -12px;
        border-radius: 50%;
        z-index: 1;
        cursor: pointer;
        .is-checked-img {
            position: absolute;
            left: 6px;
            top: 8px;
            margin: 0 auto;
            width: 14px;
            height: 10px;
            background-image: url('../../layouts/images/icon/gou-white.png') ; background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
         }
     }
}
</style>
