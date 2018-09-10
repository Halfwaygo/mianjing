<template>
    <div class="">
        <el-popover
            ref="popoverDimension"
            placement="right-start"
            title=""
            width="320"
            trigger="click"
            popper-class="popper-graph"
            content="">
            <div class="targetPopover">
                <div class="search-end">
                    <div class="targetChooseBox noTop" >
                        <ul>
                            <li :key="timeitem.id">
                                <input v-model="timeitem.ischeck" :disabled="targetTypeChooseList.length >=5 && timeitem.ischeck === false" type="checkbox" name="target" class="checkLi" @change="changeTargetType(timeitem)"/>
                                <div :class="{'checked': timeitem.ischeck}" class="targetInfoList" >
                                    <span class="iconBox"><i class="el-icon-check"></i></span>
                                    <span>{{ timeitem.name }}</span>
                                </div>
                            </li>
                            <li v-for="info in targetTypeList" :key="info.id">
                                <input v-model="info.ischeck" :disabled="targetTypeChooseList.length >=5 && info.ischeck === false" type="checkbox" name="target" class="checkLi" @change="changeTargetType(info)"/>
                                <div :class="{'checked': info.ischeck}" class="targetInfoList" >
                                    <span class="iconBox"><i class="el-icon-check"></i></span>
                                    <span>{{ info.name }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </el-popover>
        <div class="">
            <slot name="metric"></slot>
            <div v-popover:popoverDimension v-show="!disable" class="metric-select" ><div class="text-name"><i class="icon-add-gray selectIcon"></i>选择维度</div></div>
            <draggable v-model="targetTypeChooseList" :options="dragOptions" :move="onMove" element="div" class="list-group" @start="isDragging=true" @end="onEnd" >
                <transition-group :name="'flip-list'" type="transition" >
                    <div v-for="(item, index) in targetTypeChooseList" :key="item.id" class="metricList">
                        <div class="metric-select no-margin-top">
                            <div class="text-name">{{ item.name }}</div>
                        </div>
                        <span v-show="!disable" class="delBtn" @click="delMetricInfo(item, index)"><i class="icon-delete-gray delIcon"></i></span>
                    </div>
                </transition-group>
            </draggable>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
    name: 'TargetCreate',
    components: { draggable },
    props: {
        defaultInfo: {
            type: Array
        },
        allDimensionTypeList: {
            type: Array
        },
        disable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isShow: false,
            insertValue: '',
            targetTypeChooseList: [],
            targetTypeList: [],
            timeitem: {
                ischeck: false,
                name: '时间',
                id: 0
            }
        }
    },
    computed: {
        dragOptions () {
            return {
                animation: 0,
                group: 'dimensionDrag',
                disabled: false,
                ghostClass: 'ghost'
            }
        }
    },
    watch: {
        disable(vale, olde) {
            this.disable = vale
        }
    },
    mounted() {
        this.targetTypeChooseList = this.defaultInfo || []
        this.targetTypeList = this.allDimensionTypeList || []
        this.initData()
    },
    methods: {
        initData() {
            for (let j = 0; j < this.targetTypeList.length; j++) {
                this.targetTypeList[j].ischeck = false
                this.timeitem.ischeck = false
                for (let i = 0; i < this.targetTypeChooseList.length; i++) {
                    if (this.targetTypeList[j].id === this.targetTypeChooseList[i].id) {
                        this.targetTypeList[j].ischeck = true
                    }
                    if (this.targetTypeChooseList[i].id === this.timeitem.id) {
                        this.timeitem.ischeck = true
                    }
                }
            }
        },
        changeTargetType(item) {
            if (item.ischeck) {
                this.targetTypeChooseList.push(item)
            } else {
                let index = 0
                for (let i = 0; i < this.targetTypeChooseList.length; i++) {
                    if (this.targetTypeChooseList[i].id === item.id) {
                        index = i + 1
                        break
                    }
                }
                if (index > 0) {
                    this.targetTypeChooseList.splice(index - 1, 1)
                }
            }
            this.$emit('targetlistinfo', this.targetTypeChooseList)
        },
        getShow(v) {
            console.log(v)
            this.isShow = false
        },
        delMetricInfo(item, index) {
            this.targetTypeChooseList.splice(index, 1)
            this.initData()
            this.$emit('targetlistinfo', this.targetTypeChooseList)
        },
        onMove ({relatedContext, draggedContext}) {
            // 拖拽的
            const relatedElement = relatedContext.element
            const draggedElement = draggedContext.element
            return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        },
        onEnd() {
            this.$emit('targetlistinfo', this.targetTypeChooseList)
        }
    }
}
</script>

<style lang="scss">
    @import "../../layouts/css/createSingle/create";

</style>
