export default {
    methods: {
        showWarning(message) {
            this.$message.warning({
                message,
                showClose: true
            })
        },

        showSuccess(message = '操作成功') {
            this.$message.success({
                message,
                showClose: true
            })
        },

        showConfirm(options = {}) {
            const defaultOptions = {
                title: '删除提示',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                message: ''
            }
            options = {
                ...defaultOptions,
                ...options
            }
            const {
                message,
                title,
                confirmButtonText,
                cancelButtonText
            } = options
            return new Promise((resolve, reject) => {
                this.$confirm(message, title, {
                    confirmButtonText,
                    cancelButtonText,
                    type: 'warning'
                })
                    .then(() => {
                        resolve()
                    })
                    .catch(() => {})
            })
        }
    }
}
