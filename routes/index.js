'use strict';
const CONTRO_PATH = './controller'
const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const { API_VESION } = require('../config')
// 验证中间件
const auth = require('../extend/middleware/auth')
const apiAuth = require('../extend/middleware/auth/api')

const getRealPath = (fods, basePath, target) => {
  return fods && fods.length ? fods.reduce((rt, cur) => {
      let realPath = path.resolve(__dirname, basePath, cur)
      // console.log(realPath)
      let f = fs.statSync(realPath)
      if (f.isDirectory()) { //如果是目录
          let deepPath = basePath + `/${cur}`
          let cFiles = getRealPath(fs.readdirSync(realPath), deepPath, target)
          return [...rt, ...cFiles]
      } else if (f.isFile() && cur.endsWith('Controller.js')) { //如果是 Controller.js 结尾的文件
          return [...rt, realPath]
      } else { //既不是目录也不是 Controller.js 结尾的文件
          return [...rt]
      }
  }, target) : []
}

// jwt验证
router.all(`/`, auth())
router.all(`/${API_VESION}/api*`, apiAuth())

// 获取控制器目录文件
let controFods = fs.readdirSync(path.resolve(__dirname, CONTRO_PATH))
const controllers = getRealPath(controFods, CONTRO_PATH, [])
// 所有api接口
let allApis = []

// api接口控制器设置
controllers.forEach(rPath => {
  // console.log('path-----', path.dirname(path.relative(path.resolve(__dirname, CONTRO_PATH), rPath)).replace('\\', '/'), path.basename(rPath).replace('Controller.js', ''))
  let routerPath = path.dirname(path.relative(path.resolve(__dirname, CONTRO_PATH), rPath)).replace('\\', '/')
  let controName = path.basename(rPath).replace('Controller.js', '').toLocaleLowerCase()
  routerPath = routerPath.startsWith('.') ? routerPath.replace('.', '') : `/${routerPath}`
  routerPath = controName === 'index' ? routerPath : `${routerPath}/${controName}`
  // console.log('r', routerPath, controName)
  let obj = require(path.resolve(rPath))
  for (let c in obj) {
    let method = c.split('_')[0].toLocaleLowerCase() || 'get'
    let cName = c.split('_')[1]
    let apiPath = routerPath.startsWith('/api') ? `/${API_VESION}${routerPath}/${cName}` : `${routerPath}/${cName}`
    // console.log('apiPath', apiPath)
    allApis.push({
      apiPath,
      controllerPath: `controllers/${routerPath}`
    })
    try {
      router[method](apiPath, obj[c])
    } catch (err) {
      console.log('-------路由控制器方法错误-------')
    }
  }
})

// log
let len = allApis.length
allApis.forEach((item, index, arr) => {
  if (index === 0) {
    console.log('-------api log start-------')
  }
  console.log(`api: ${item.apiPath}`)
  if (index === len - 1) {
    console.log('-------api log end-------')
  }
})

module.exports = router
