import {PLATFORM} from '../constants/constants'
export default {
    methods: {
        getDefaultAppId() {
            const appList = this.$store.state.root.appList
            return sessionStorage.getItem('appId') || (appList[0] && `${appList[0].appId}`)
        },

        getDefaultApp(appId) {
            appId = appId || this.getDefaultAppId()
            return this.$store.state.root.appList.filter(item => `${item.appId}` === appId)[0]
        },

        markLoadingEmpty(obj) {
            this.$set(obj, 'loadingResultType', 'empty')
        },

        markLoadingFailed(obj) {
            this.$set(obj, 'loadingResultType', 'failed')
        }
    },

    computed: {
        isApp() {
            return this.$store.state.root.platform === PLATFORM.App
        }
    }
}
