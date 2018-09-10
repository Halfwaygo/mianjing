<template>
    <el-tooltip :disabled="disabled" :popper-class="popperClass" placement="top" >
        <span slot="content" v-html="title" ></span>
        <i :class="classes" v-bind="$attrs" class="fa mr5 cursor" v-on="$listeners" ></i>
    </el-tooltip>
</template>

<script>
import utils from '../utils/misc'
export default {
    name: 'FontAwesomeIcon',
    inheritAttrs: false,
    props: {
        title: String,
        icon: String,
        type: String,
        inverse: {
            type: Boolean,
            default: false
        },
        tooltipVisible: {
            type: Boolean,
            default: true
        },

        popperClass: String
    },

    data() {
        return {
            classes: []
        }
    },

    computed: {
        disabled() {
            return this.tooltipVisible !== true || !this.title || !utils.trim(this.title)
        }
    },

    beforeMount() {
        const type = this.type
        const inverse = this.inverse
        const classes = this.classes
        classes.push(this.icon)
        inverse && classes.push('text-inverse')
        switch (type) {
        case 'edit':
            classes.push('fa-pencil')
            break
        case 'copy':
            classes.push('fa-copy')
            break
        case 'remove':
            classes.push('fa-trash')
            break
        case 'logs':
            classes.push('fa-list-alt')
            break
        case 'rest':
            classes.push('fa-stethoscope')
        }
    }
}
</script>
