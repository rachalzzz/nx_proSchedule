import axios from 'axios'
import Qs from 'qs'

const Axios = axios.create({
    timeout: 30000
})
// 发送请求前处理request的数据 该选项只适用于以下请求方式：`put/post/patch`
Axios.defaults.transformRequest = [function (data) {
  return Qs.stringify(data, {
    arrayFormat: 'repeat'
  });
}];  
Axios.defaults.paramsSerializer = function (params) {
  return Qs.stringify(params, { arrayFormat: 'repeat' });
}; 
// 添加请求拦截器
Axios.interceptors.request.use(
    config => {
        return config
    },
    err => {
        return Promise.reject(err)
    })

// http response 拦截器 返回状态判断
Axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log(error)
    })
export default Axios
