import axios from './../http' 
let base =window.BASEDOMAIN+ '/JsonService.asmx'

//let base =window.BASEDOMAIN+ '/JsonService.asmx'
//http://10.3.201.220:90/CustomerService.asmx
/*获取工序*/
export const GetJobnoList    = params => { return axios.post(`${base}/GetJobnoList`, params).then(res => res.data) }
/*获取设备*/
export const GetEqm      = params => { return axios.post(`${base}/GetEqm`, params).then(res => res.data) }
/*获取id*/
export const Logon       = params => { return axios.post(`${base}/Logon`, params).then(res => res.data) }
export const Logout      = params => { return axios.post(`${base}/Logout`, params).then(res => res.data) }
 

/*查询*/
export const GetProtingLst   = params => { return axios.post(`${base}/GetProductingOrdLst`, params).then(res => res.data) }
/*作业中心*/
export const GetWorkCenter   = params => { return axios.post(`${base}/GetWorkCenter`, params).then(res => res.data) }
/*在产批号*/ 
export const GetProductingOrdLst   = params => { return axios.post(`${base}/GetProductingOrdLst`, params).then(res => res.data) }
/*待产批号*/
export const GetUnProductingOrdLst = params => { return axios.post(`${base}/GetUnProductingOrdLst`, params).then(res => res.data) }
/*生产进度*/
export const GetProducting         = params => { return axios.post(`${base}/GetProducting`, params).then(res => res.data) }
 
/*甘特圖*/
export const GetWorkCenterGant         = params => { return axios.post(`${base}/GetWorkCenterGant`, params).then(res => res.data) }
 