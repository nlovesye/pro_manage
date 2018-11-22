'use strict';

const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const {
  TestController
} = require(path.resolve(__dirname, '../controllers/TestController'))

// 获取控制器目录
const cDirs = fs.readdirSync(path.join(__dirname, '../controllers'))


const getRt = (dirs, arr) => {
  return dirs.reduce((rt, f) => {
    let info = fs.statSync(path.join(__dirname, `../controllers/${f}`))
//    rt = [...arr]
    if (info.isDirectory()) {
      console.log(f, getRt(fs.readdirSync(path.join(__dirname, '../controllers/' + f))))
      return [...rt, getRt(fs.readdirSync(path.join(__dirname, '../controllers/' + f))) ? [...getRt(fs.readdirSyncs(path.join(__dirname, `../controllers/${f}`)), arr)] : [...[]]]
    } else if (info.isFile() && f.endsWith('Controller.js')) {
      return [...rt, f]
    } else {
      return [...rt]
    }
  }, arr)
}

let rt = getRt(cDirs, [])

let info = fs.statSync(path.join(__dirname, `../controllers/${cDirs[1]}`))
console.log('rt------------:', cDirs, info.isDirectory(), rt)


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
