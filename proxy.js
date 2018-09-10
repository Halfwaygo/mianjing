module.exports = {


	// '/api/amber/login.api': {
	// 	target: 'http://127.0.0.1:2018',
	// 	secure: false,
    // },

    // '/api/amber/board/overview/getActiveUserNum.api' : {
    //     target: 'http://127.0.0.1:2018',
    // },

	'/api/*': {
		// target: 'https://uemweb.migu.cn:18000', // amber正式环境
		target: 'http://39.156.1.74:8088', // amber开发联调环境、测试环境
		secure: false,
		pathRewrite: { '^/api': '' }
    },

    // '/loc/*': {
    //     target: 'http://192.168.146.63:8080',
    //     secure: false,
    //     pathRewrite: { '^/loc': '' }
    // }

};
