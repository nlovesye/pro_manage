const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

// 遍历文件夹 Controller.js 结尾的文件的绝对路径
const getRealPath = (fods, basePath, target) => {
    return fods.reduce((rt, cur) => {
        let realPath = path.resolve(__dirname, basePath, cur)
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
    }, target)
}

const sha1hash = function (content) {
    var hash = crypto.createHash('sha1')
    hash.update(content)
    return hash.digest('hex')
}

const md5hash = function (str) {
    var md5sum = crypto.createHash('md5')
    md5sum.update(str)
    str = md5sum.digest('hex')
    return str
}


module.exports = {
    getRealPath,
    sha1hash,
    md5hash
}