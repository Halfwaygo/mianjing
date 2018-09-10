export default{
	methods: {
		addWaterMark(option) {
	
			//var deptname = this.getCookie("deptname")||'';   //部门
			//var realname = this.getCookie("realname")||'';   //名字

			var deptname = this.getCookie("companyName")||'';   //部门
			var realname = this.getCookie("userName")||'';   //名字
			var waterMark = this.getCookie("waterMark");
			var graphic = [];
			
			// if(waterMark != 0){
			    var graphic = [{
			    	silent: true,
			    	//z:-10,
			    	cursor:'pointer',
			        type: 'group',
			        id: 'textGroup1',
			        left: 'center',
			        top: 'middle',
			        bounding: 'raw',
			        rotation: Math.PI / 4,
			        children: [
			            {
			                type: 'rect',
			                silent:true,
			                //z:-10,
			                left: 'center',
			                top: 'center',
			                shape: {
			                    width: 330,
			                    height: 100
			                },
			                style: {
			                    fill: 'transparent',
			                    stroke: '#999',
			                    lineWidth: 0,
			                    shadowBlur: 0,
			                    shadowOffsetX: 0,
			                    shadowOffsetY: 0,
			                    shadowColor: 'rgba(0,0,0,0.3)'
			                }
			            },
			            {
			                type: 'text',
			                silent:true,
			                //z:-10,
			                top: 'bottom',
			                left: 'center',
			                style: {
			                	fill: '#b3b5b6',
			                    text:deptname,
			                    font: 'bold 30px Microsoft YaHei'
			                }
			            },
			            {
			                type: 'text',
			                //z: -10,
			                silent:true,
			                cursor:'pointer',
			                top: 'top',
			                left: 'center',
			                style: {
			                	fill: '#b3b5b6',
			                    text:[' ',realname].join('\n'),
			                    font: 'bold 34px Microsoft YaHei'
			                }
			            }
			        ]
			    }];
			// }else{
				
			// }
			
		    // option.graphic = [{
	     //        type: 'text',
	     //        left: 'center',
	     //        top: '55%',
	     //        z: 100,
	     //        silent:true,
	     //        bounding: 'all',
	     //        cursor: 'default',
	     //        style: {
	     //            text: 'TSG技术管理单元超级用户',//this.getCookie("deptname"),
	     //            textAlign: 'center',
	     //            opacity: 0.2,
	     //            fill: '#333',
	     //            font: '30px Microsoft YaHei'
	     //        }
	     //    }];
		},

		addTableMark(tableObj) {
			var deptname = this.getCookie("deptname")||'';   //部门
			var realname = this.getCookie("realname")||'';   //名字
			var waterMark = this.getCookie("waterMark");

			tableObj.style.position = 'relative';

			var textCont = document.createElement("div");

			textCont.innerHTML = 'TSG技术管理单元超级用户';
			
			textCont.setAttribute('class','water-mark');

			tableObj.appendChild(textCont); 
			
		},

		//设置cookie
		setCookie(key, value, t) {
			var oDate = new Date();
			oDate.setDate(oDate.getDate() + t);
			document.cookie = key + '=' + value + '; expires=' + oDate.toGMTString()
		},


		//获取cookie
		getCookie(key) {
			var arr1 = document.cookie.split(';');
			for( var i=0;i<arr1.length; i++ ) {
				var arr2 = arr1[i].split('=');
				if( arr2[0] == key ){
					return decodeURI(arr2[1]);
				};
			};
		},

		//移除cookie
		removeCookie(key) {
			setCookie(key, ' ', -1);
		},
	}
}