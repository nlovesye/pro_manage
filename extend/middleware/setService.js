const fs = require('fs')
const path = require('path')

// 获取service目录文件
const dirs = fs.readdirSync(path.resolve(__dirname, '../../service'))

const getRealPath = (fods, basePath, target) => {
    return fods && fods.length ? fods.reduce((rt, cur) => {
        let realPath = path.resolve(__dirname, basePath, cur)
        // console.log(realPath)
        let f = fs.statSync(realPath)
        if (f.isDirectory()) { //如果是目录
            let deepPath = basePath + `/${cur}`
            let cFiles = getRealPath(fs.readdirSync(realPath), deepPath, target)
            return [...rt, ...cFiles]
        } else if (f.isFile() && cur.endsWith('Service.js')) { //如果是 Service.js 结尾的文件
            return [...rt, realPath]
        } else { //既不是目录也不是 Service.js 结尾的文件
            return [...rt]
        }
    }, target) : []
}

// 所有service文件
const allFile = getRealPath(dirs, '../../service', [])

module.exports = () => {
    return async (ctx, next) => {
        ctx.service = ctx.service || {}
        allFile.forEach(f => {
            let service = require(f),
                ns = null
            if ('namespace' in service) {
                ns = service.namespace
                service = service.service
            }
            for (const key in service) {
                if (service.hasOwnProperty(key)) {
                    const fn = service[key];
                    if (ns) {
                        ctx.service[ns] = ctx.service[ns] || {}
                        if (!ctx.service[ns][key]) {
                            ctx.service[ns][key] = function () {
                                return fn(ctx, next, ...[].slice.call(arguments, 0))
                            }
                        }
                    } else {
                        if (!ctx.service[key]) {
                            ctx.service[key] = function () {
                                return fn(ctx, next, ...[].slice.call(arguments, 0))
                            }
                        }
                    }
                }
            }
        })
        // console.log('ctx.service', ctx.service)
        await next()
    }
}