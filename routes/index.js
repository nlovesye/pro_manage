'use strict';

const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const {
  TestController
} = require(path.resolve(__dirname, '../controllers/TestController'))

// 获取控制器目录
const cDirs = fs.readdirSync(path.join(__dirname, '../controllers'))

// let rt = getRt(cDirs)

const getRt = (dirs) => {
  return dirs.reduce((rt, f) => {
    let info = fs.statSync(path.join(__dirname, `../controllers/${f}`))
    if (info.isDirectory()) {
      return [...rt, getRt(fs.readFileSync(path.join(__dirname, `../controllers/${f}`)))]
    } else if (info.isFile() && f.endWith()) {
      
    }
  }, [])
}

let info = fs.statSync(path.join(__dirname, `../controllers/${cDirs[1]}`))
console.log('rt------------:', cDirs, info.isDirectory())


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
