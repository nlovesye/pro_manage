import querystring from 'querystring'
const BasicAuth = 'Basic YXBwOjEyMzQ1Ng=='

export default {
  // 登录操作
  login ({ commit }, payload) {
    let {
      doReq,
      Axios,
      username,
      password
    } = payload
    console.log(doReq, Axios, username, password)
    doReq = Axios.create(Object.assign({}, {
      baseURL: 'http://192.168.2.90:8088',
      timeout: 5000,
      headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: BasicAuth
      },
      withCredentials: true
      // proxy: 'http://192.168.2.90:8088'
    }))
    let reqData = {
      grant_type: 'password',
      username: 'admin',
      password: '6337f16b7e45c6a6637feec0d2cf0282',
      remember: true
    }
    reqData = querystring.stringify(reqData)
    doReq.post('/oauth/token', reqData).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    // commit('login')
  }
}
