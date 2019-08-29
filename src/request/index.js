import axios from 'axios'
import {getLocalStorage} from "../utils/storage";
import router from '../router'
import store from "../state";
import qs from 'qs'

/* 是否有请求正在刷新token */
window.isRefreshing = false

/* 是否正在跳转 */
window.isJumping = false

/* 被挂起的请求数组 */
let refreshSubscribers = []

/* push所有请求到数组中 */
function subscribeTokenRefresh (cb) {
  refreshSubscribers.push(cb)
}

/* 刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据） */
function onRefreshed (token) {
  console.log('开始请求')
  refreshSubscribers.map(cb => cb(token))
}




// 刷新token的方法
async function doRefreshToken (refreshToken) {
  const res = await store.dispatch('refreshToken', refreshToken)
  /* 将刷新token的标志置为false */
  window.isRefreshing = false
  if (res.data.statusCode !== 10200) { // 刷新失败
    console.log('token刷新失败,响应码：' + res.data.statusCode)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    /* 跳转登录页 */
    router.replace({
      path: '/login',
      query: {orgId: store.state.orgId} // redirect: router.currentRoute.fullPath
    })
  }else {
    console.log('token刷新成功,响应码：' + res.data.statusCode)
    settLocalStorage('refreshToken', res.data.data.refresh_token)
    settLocalStorage('accessToken', res.data.data.access_token, res.data.data.expires_in)
    /* 执行数组里的函数,重新发起被挂起的请求 */
    onRefreshed(res.data.data.access_token)
    /* 执行onRefreshed函数后清空数组中保存的请求 */
    refreshSubscribers = []
  }
}

function formatReq (url, resolve, reject, data = {}, method, isUseOriginData) {
  let format = method.toLocaleLowerCase() === 'get' ? 'params' : 'data'
  let formatData = (!isUseOriginData && format === 'data') ? qs.stringify(data) : data
  instance({
    url: url,
    method: method,
    [format]: formatData,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    resolve(res)
  }).catch(err => {
    reject(err)
  })
}

//创建发送请求的instance 所有前缀都为设置的baseURL
const instance = axios.create({
  baseURL: '/',
  timeout: 5000
})

//拦截所有请求, 进行一番必要操作在把请求发送出去
/*
* 先在请求中header中加入字段accessToken, 通过这个判断请求是否携带token
*
* */
instance.interceptors.request.use(
  config => {
    let accessToken = getLocalStorage('accessToken')
    //如果accessToken不为空,则拼接再请求头的Authorization
    if (accessToken) {
      config.headers.Authorization = `bearer ${accessToken}`
    }else { // token不存在则判断是否存在可用的获取refreshToken  (token就是accessToken)
      var refreshToken = getLocalStorage('refreshToken') // 获取refreshToken
      if (refreshToken) {
        //先判断是否正在刷新获取token请求
        if (!window.isRefreshing) {
          /* 将刷新token的标志置为true */
          window.isRefreshing = true
          /* 刷新token */
          doRefreshToken(refreshToken)
        }
        /* 把请求(token)=>{....}都push到一个数组中 */
        let retry = new Promise((resolve, reject) => {
          /* (token) => {...}这个函数就是回调函数 */
          subscribeTokenRefresh((token) => {
            config.headers.Authorization = 'bearer ' + token
            /* 将请求挂起 */
            resolve(config)
          })
        })
        return retry
      }else {// 如果连refreshToken都为null 则调回登录页进行登录操作
        /* 跳转登录页 */
        router.replace({
          path: '/login',
        })
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

const requests = {
  get: (url, data) => {
    return new Promise((resolve, reject) => {
      formatReq(url, resolve, reject, data, 'GET', false)
    })
  },
  post: (url, data, isUseOriginData = false) => {
    return new Promise((resolve, reject) => {
      formatReq(url, resolve, reject, data, 'POST', isUseOriginData)
    })
  }
}

export default requests
