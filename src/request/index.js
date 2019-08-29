import axios from 'axios'



export default function request(config) {
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
  instance.interceptors.request.use(config => {

  })
}
