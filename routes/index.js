'use strict';

const UTIL_PATH = '../utils'
const CONTRO_PATH = '../controllers'
const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const { getRealPath } = require(UTIL_PATH)
const {
  TestController
} = require(path.resolve(__dirname, '../controllers/TestController'))

// 获取控制器目录文件
const controFods = fs.readdirSync(path.resolve(__dirname, CONTRO_PATH))
const controllers = getRealPath(controFods, path.relative(UTIL_PATH, '../controllers'), [])

// console.log('controllers------------:', controllers, path.resolve(controllers[0]))
controllers.forEach(fPath => {
  console.log('path', path.dirname(path.relative(path.resolve(__dirname, '../controllers'), fPath)) + `\\${path.parse(fPath).name}`)
  let obj = require(path.resolve(fPath))
  for (let c in obj) {
    console.log('obj:', obj, obj[c].name)
  }
})

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
