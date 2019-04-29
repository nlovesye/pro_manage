'use strict';
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const db = require('./extend/db')
const setResponse = require('./extend/middleware/response')
const connectDb = require('./extend/middleware/mongoDB')
const koaJwt = require('koa-jwt')

const index = require('./routes/index')

// error handler
onerror(app, {
  text: 'error!!!'
})

app.secret = 'jwt_nloves'

// middlewares
app.use(cors({
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  allowHeaders: ['Content-type', 'Authorization', 'Accept', 'x-access-token', 'anonymous']
}))
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/static'))

// koa-jwt验证
app.use(koaJwt({ secret: app.secret }).unless({
  path: [/^\//, /^\/v1.0\/api\/user\/login/]
}))
app.use(setResponse())
// 连接mongoDB数据库
app.use(connectDb(db))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// 注入路由控制器
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', async (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
