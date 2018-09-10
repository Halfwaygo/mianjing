export default {
    formatDate(date) {
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + m + '-' + d
    },
    // 时间戳转换
    formDateTime(time) {
        let t = new Date(time)
        let date = `${t.getFullYear()}${(t.getMonth() + 1) < 10 ? ('0' + (t.getMonth() + 1)) : t.getMonth()}${t.getDate() < 10 ? ('0' + t.getDate()) : t.getDate()}`
        return date
    },
    getWeekDate() {
        var nowDate, nowYear, nowMonth, nowDay, weekData, weekYear, weekMonth, weekDay, now
        now = new Date()
        nowDate = new Date(now.getTime() - 24 * 3600 * 1000)
        nowYear = nowDate.getFullYear()
        nowMonth = nowDate.getMonth() + 1
        nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth
        nowDay = nowDate.getDate()
        nowDay = nowDay < 10 ? '0' + nowDay : nowDay
        weekData = new Date(nowDate.getTime() - 6 * 24 * 3600 * 1000)
        weekYear = weekData.getFullYear()
        weekMonth = weekData.getMonth() + 1
        weekMonth = weekMonth < 10 ? '0' + weekMonth : weekMonth
        weekDay = weekData.getDate()
        weekDay = weekDay < 10 ? '0' + weekDay : weekDay
        let wt = [`${weekYear}/${weekMonth}/${weekDay}`, `${nowYear}/${nowMonth}/${nowDay}`]
        return wt
    },
    getYesterday() {
        var nDate, nYear, nMonth, nDay, yData, yYear, yMonth, yDay
        nDate = new Date()
        nYear = nDate.getFullYear()
        nMonth = nDate.getMonth() + 1
        nMonth = nMonth < 10 ? '0' + nMonth : nMonth
        nDay = nDate.getDate()
        nDay = nDay < 10 ? '0' + nDay : nDay
        yData = new Date(nDate.getTime() - 24 * 3600 * 1000)
        yYear = yData.getFullYear()
        yMonth = yData.getMonth() + 1
        yMonth = yMonth < 10 ? '0' + yMonth : yMonth
        yDay = yData.getDate()
        yDay = yDay < 10 ? '0' + yDay : yDay
        let t = [`${nYear}${nMonth}${nDay}`, `${yYear}${yMonth}${yDay}`]
        return t
    },
    getDayCount(start, end) {
        // 获取相差的天数   格式为YYYY/MMM/DD
        let startTime = new Date(start)
        let endTime = new Date(end)
        let days = endTime.getTime() - startTime.getTime()
        let count = parseInt(days / (1000 * 60 * 60 * 24))
        return count
    },
    getWeekName(time) {
        // 获取当前时间是周几
        let t = new Date(time)
        let td = t.getDay()
        let weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        return weekday[td]
    }
}
