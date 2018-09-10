<template>
    <div class="image-presenter">
        <div class="image-presenter-item">
            <img v-if="empty" src="../layouts/images/loading-empty.png" />
            <img v-if="failed" src="../layouts/images/loading-failed.png" />
            <p v-if="text">{{ text }} </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ImagePresenter',
    props: {
        type: String,
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        failedText: {
            type: String,
            default: '加载失败'
        }
    },
    computed: {
        text() {
            if (this.failed) {
                return this.failedText
            } else if (this.empty) {
                return this.emptyText
            } else {
                return ''
            }
        },

        failed() {
            return this.type === 'failed'
        },

        empty() {
            return this.type === 'empty'
        }
    }
}
</script>

<style lang="scss">
.image-presenter {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .image-presenter-item {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    p {
        margin-top: 20px;
        text-align: center;
        color: #c0c4cc;
    }
}
</style>
