export default {
    methods: {
        //统计是否禁用，如果考试开始时间大于当前时间，则禁用
        isCountDisable(startTime, serviceTime) {
            let userAgent = window.navigator.userAgent;
            // let nowTime = new Date(endTime).getTime() + 1000*60*60
            // console.log(new Date(startTime.replace(/\-/g, "/")).getTime())
            // console.log(new Date(startTime.replace(/\-/g, "/")).getTime())
            return new Date(startTime.replace(/\-/g, "/")).getTime() > new Date(serviceTime.replace(/\-/g, "/")).getTime()

        },
        //删除按钮是否禁用，考试开始了，删除按钮需禁用
        isDeleteDisable(startTime, serviceTime) {
            let jzTime = new Date(serviceTime.replace(/\-/g, "/")).getTime() + 1000*60*60
            return new Date(startTime.replace(/\-/g, "/")).getTime() <  jzTime
        },
    }
}
