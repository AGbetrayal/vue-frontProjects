/*
axios请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */
import axios from 'axios'
const BASE_URL = '/api' //默认请求头(代理请求头)
var instance = axios.create({
  baseURL: BASE_URL,
  timeout: 3000 // 超时时间
})

// 响应拦截器



export default function axio (url, data={}, type='GET') {

  return new Promise(function (resolve, reject) {
    // 执行异步ajax请求
    let promise
    if (type === 'GET') {
      // 准备url query参数数据
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送get请求
      promise = instance.get(url)
    } else {
      // 发送post请求
      promise = instance.post(url, data)
    }
    promise.then(function (response) {
      // 成功了调用resolve()
      resolve(response.data)
    }).catch(function (error) {
      //失败了调用reject()
      reject(error)
    })
  })
}

/*
const response = await axio()
const result = response.data

const resule = await axio()
 */
