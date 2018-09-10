export default {
    mounted() {
        this.$nextTick(() => {
            const dom = document.getElementsByClassName('table-wrapper')[0]
            if (dom) {
                this.addTableMark(dom)
            }
        })
    },

    methods: {
        removeWaterMk() {
            let mk = document.getElementById('mkCtx')
            if (mk) {
                mk.parentNode.removeChild(mk)
            }
        },
        waterMk(txt = '') {
            let text = txt
            let mkid = document.getElementById('mkCtx')
            if (!text) {
                let deptname = localStorage.getItem('deptName') || ''
                let loginname = localStorage.getItem('loginName') || ''
                text = `${deptname} ${loginname}`
            }
            let ct = document.createElement('div')
            ct.className = 'mk-ctx'
            ct.id = 'mkCtx'
            ct.innerText = text.trim() || 'TSG成都研发中心 王鑫炎'
            ct.style.fontSize = '30px'
            ct.style.pointerEvents = 'none'
            ct.style.color = '#aaa'
            ct.style.opacity = 0.3
            ct.style.position = 'absolute'
            ct.style.left = '50%'
            ct.style.top = '50%'
            ct.style.transform = 'translate(-50%,-50%)'
            ct.style.zIndex = 99999
            if (!mkid) {
                document.body.appendChild(ct)
            }
        },

        addWaterMark(option) {
            let deptname = sessionStorage.getItem('deptname')
            let userName = sessionStorage.getItem('userName')
            console.log(userName)
            console.log(deptname)
            // let graphic = []

            option.graphic = [{
                type: 'text',
                left: 'center',
                top: '55%',
                z: 100,
                bounding: 'all',
                cursor: 'default',
                style: {
                    text: 'TSG技术管理单元超级用户', // this.getCookie("deptname"),
                    // text: deptname + userName, // + companyName,
                    textAlign: 'center',
                    opacity: 0.2,
                    fill: '#333',
                    font: '30px Microsoft YaHei'
                }
            }]
        },

        addTableMark(tableObj) {
            let deptname = sessionStorage.getItem('deptname')
            let userName = sessionStorage.getItem('userName')
            tableObj.style.position = 'relative'

            let textCont = document.createElement('div')
            // console.log(textCont,'创建div')

            // textCont.innerHTML = 'TSG技术管理单元超级用户';
            textCont.innerHTML = deptname + userName

            textCont.setAttribute('class', 'water-mark')

            // tableObj.appendChild(textCont)
        }
    }
}
