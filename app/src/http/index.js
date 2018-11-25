import axios from 'axios'
const BasicAuth = 'Basic token'

// console.log(process.env.NODE_ENV)
const AXIOSCONFIG = process.env.NODE_ENV === 'development' ? {
  timeout: 1000 * 10,
  withCredentials: true
} : {
  // proxy: 'scm.smartcomma.com',
  baseURL: 'http://nloves.tpddns.cn:7000/v1.0/api/',
  timeout: 1000 * 10,
  withCredentials: true
}

let http = axios.create(AXIOSCONFIG)

/* 请求拦截器 */
http.interceptors.request.use(config => {
  let newConfig = config
  if (config.url === '/user/login') {
    newConfig = Object.assign({}, config, {
      headers: {
        ...config.headers,
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'Authorization': BasicAuth
      }
    })
  } else {
    const token = window.localStorage.getItem('token')
    newConfig = Object.assign({}, config, {
      headers: {
        ...config.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  }
  // console.log('config', newConfig, window.localStorage)
  return newConfig
}, error => {
  console.log('[请求拦截器错误]', error)
  throw error
  // return Promise.reject(error)
})

/* 响应拦截器 */
http.interceptors.response.use(response => {
  console.log(`[${response.config.url}]返回数据:`, response.data)
  return response.data
}, error => {
  console.log('[响应拦截器错误]', error)
  throw error
  // return Promise.reject(error)
})

export default http
