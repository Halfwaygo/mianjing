<template>
    <div class="tiny-img-uploader cursor">
        <el-upload
            :action="imageUploadAction"
            :show-file-list="false"
            :before-upload="onBeforeUpload">
            <i v-show="value" class="el-icon-circle-close" @click.stop="onClear"></i>
            <div :style="{backgroundImage: `url(${imgSrc}`}" class="avatar" >
            </div>
        </el-upload>
    </div>
</template>

<script>
import defaultImg from '../layouts/images/icon-default.png'
import MessageMixins from '../mixins/messages'
import * as C from '../constants/api'
import Api from '../utils/api'
export default {
    name: 'TinyImageUploader',
    mixins: [MessageMixins],
    props: {
        value: String,
        placeholderImg: {
            type: String,
            default: defaultImg
        },

    },

    data() {
        return {
            imgSrc: ''
        }
    },

    computed: {
        imageUploadAction() {
            return C.COMP_IMAGE_UPLOADED
        }
    },

    watch: {
        value(imgSrc) {
            this.imgSrc = imgSrc || this.placeholderImg
        }
    },

    beforeMount() {
        this.imgSrc = this.value || this.placeholderImg
    },

    methods: {
        onBeforeUpload(file) {
            if (!/image/.test(file.type)) {
                this.showWarning('只允许上传图片文件')
                return false
            }
            this.convertFileToBase64(file).then(blob => {
                this.imgSrc = blob
                Api.uploadCompImage({base64Data: blob}).then(res => {
                    this.$emit('input', res.body)
                })
            })
            return false
        },

        convertFileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = evt => {
                    const blob = evt.target.result
                    resolve(blob)
                }
                reader.readAsDataURL(file)
            })
        },

        onClear() {
            this.$emit('input', '')
        }
    }
}
</script>

<style lang='scss'>
$w: 36px;
$h: 36px;
.tiny-img-uploader {
    width: $w;
    height: $h;
    position: relative;
    .avatar {
        width: $w;
        height: $h;
        background-size: cover;
        background-repeat: no-repeat;
    }

    i {
        position: absolute;
        top: -5px;
        left:-10px;
        font-size: 16px;
        color: #F56C6C;
        display: none;
    }

    &:hover {
        i {
            display: block;
        }
    }
}
</style>
