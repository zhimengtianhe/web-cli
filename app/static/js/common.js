//http
window.Apirequest = (function () {
	class Request {
		constructor() {
            this.BASE_API = '/api/'; // nginx 接口统一前缀
		}
		async PostService(parm = {}, status = true) {  // post 请求
			let url = parm.url;
            let body = status ? Qs.stringify(parm.data) : parm.data;
           // console.log(body);
			return new Promise((resolve, reject) => {
				// 创建axios实例
				const service = axios.create({
					baseURL: this.BASE_API, 
                });
				service
					.post(url, body)
					.then((response) => {
                        reject(response);
                        resolve(response)
					})
					.catch((err) => {
						console.log('err', err);
					});
			});
        }
        
        async GetService(parm = {}, status = true) {  // get 请求
			let url = parm.url;
			let body = status ? Qs.stringify(parm.data) : parm.data
			let parameter = body?'/?'+body:''
			return new Promise((resolve, reject) => {
				// 创建axios实例
				const service = axios.create({
					baseURL: this.BASE_API, 
                });
				service
					.get(url + parameter)
					.then((response) => {
                        //reject(response.data);
                        resolve(response.data)
					})
					.catch((err) => {
						console.log('err', err);
					});
			});
		}
	}
	return Request;
})();

//所有页面 ajax 请求 api
window.API_BASE = (function () {
	var request = new Apirequest();
	var apis = {
		index: function (data) {
			return request.GetService({
				// url: '/front/index',
				url: 'toutiao/index?type=top&key=APPKEY',
				data
			});
        }
    };
    
	return apis;
})();

