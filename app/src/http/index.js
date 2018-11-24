import axios from 'axios'
const BasicAuth = 'Basic YXBwOjEyMzQ1Ng=='

// console.log(process.env.NODE_ENV)
const AXIOSCONFIG = process.env.NODE_ENV === 'development' ? {
  timeout: 1000 * 10,
  withCredentials: true
} : {
  // proxy: 'scm.smartcomma.com',
  baseURL: 'http://scm.smartcomma.com/api/',
  timeout: 1000 * 10,
  withCredentials: true
}

let http = axios.create(AXIOSCONFIG)

/* 请求拦截器 */
http.interceptors.request.use(config => {
  let newConfig = config
  if (config.url === '/oauth/token') {
    newConfig = Object.assign({}, config, {
      headers: {
        ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': BasicAuth
      }
    })
  } else {
    const token = window.localStorage.getItem('access_token')
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
