<!--二级菜单-->
<template>
    <div class="item-wrapper" :class="{'is-switched':isSwitched,'is-switcheds':isSwitcheds}" @mouseleave.stop.prevent = "rotateInverse($event)">
        <div @mouseover = "rotate($event)" class="face">
            <slot name="face">
            </slot>
        </div>
        <div class="back">
            <slot name="back">
            </slot>
        </div>
    </div>
</template>

<script>
    import utils from  '../utils/misc';

    export default{
        name: 'RotateCard',

        props: {
            /*data: Array,
            currentData: {
              type: Number,
              default: 0
            },*/
        },
        data(){
            return {
                isSwitched:false,
                isSwitcheds:false,
            }
        },

        created() {
        },
        
        watch: {
        },

        methods: {
            rotate(event) {
                var elm = event.target || event.srcElement,
                    parent = elm,
                    num = 0;
                if(elm.className.indexOf('tip-icon') === -1) return;
                //console.log(elm.className.indexOf('tip-icon'));
                this.isSwitched = true;
                this.isSwitcheds = false;
            },
            rotateInverse(event) {
                var elm = event.target || event.srcElement,
                    parent = elm,
                    num;
                if(elm.className.indexOf('item-wrapper') === -1) return;
                    this.isSwitched = false;
                    this.isSwitcheds = true;
            },
		}
    }

</script>


<style lang="less">

</style>