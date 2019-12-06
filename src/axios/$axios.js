import axios from 'axios';
import { message } from 'antd';
import Cookies from 'js-cookie';
import md5 from 'js-md5';
import qs from 'qs';

const $axios = axios.create({
	baseURL: process.env.NODE_ENV === 'development' ? 'http://mjb.cn/' : `${document.location.origin}/`,
	timeout: 6000,
	retry:4,
	retryDelay:1000
});

//请求拦截
$axios.interceptors.request.use(
	function(config) {
		config.headers = {
            'Content-Type':'application/x-www-form-urlencoded' //设置跨域头部
        };
		// 在发送请求之前做些什么
		// 通过reudx的store拿到拿到全局状态树的token ，添加到请求报文，后台会根据该报文返回status
		// 此处应根据具体业务写token
		// const token = store.getState().user.token || localStorage.getItem('token');
		let time = parseInt(new Date().getTime()/1000);
        let secret = 'hbFLnwg5BysAvQ4esITxlMFCn4YWBbJs';
        let appId = 'meiJieBao';
        let sign = md5(`appId=${appId}&time=${time}${secret}`);
        let access_token = Cookies.get('session');
        
        if(config.url.indexOf('?') > -1){
            config.url = `${config.url}&time=${time}&sign=${sign}&appId=${appId}`;
        }else{
            config.url = `${config.url}?time=${time}&sign=${sign}&appId=${appId}`;
        }
        if(access_token){
            config.url = `${config.url}&access-token=${access_token}`;
        }
		return config;
	},
	function(error) {
		// 对请求错误做些什么
		message.error(error);
		return Promise.reject(error);
	}
);

// 添加响应拦截器
$axios.interceptors.response.use(
	function(response) {
		// 对响应数据做点什么
		if (response.data.success === false) {
			message.error(response.data.message);
		}
		return response;
	},
	function(error) {
		if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
			var config = error.config;
			config.__retryCount = config.__retryCount || 0;

			if (config.__retryCount >= config.retry) {
				// Reject with the error
				//window.location.reload();
				return Promise.reject(error);
			}

			// Increase the retry count
			config.__retryCount += 1;

			// Create new promise to handle exponential backoff
			var backoff = new Promise(function(resolve) {
				setTimeout(function() {
					//console.log('resolve');
					resolve();
				}, config.retryDelay || 1);
			});

			return backoff.then(function() {
				return axios(config);
			});
		} else {
			return Promise.reject(error);
		}
	}
);

export default $axios;


/**
 * get 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        $axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        $axios.post(url, qs.stringify(data))
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}

/**
 * delete 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url, data = {}) {
    return new Promise((resolve, reject) => {
        $axios.delete(url, {data:qs.stringify(data)})
        .then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        })
    })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        $axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        $axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}
