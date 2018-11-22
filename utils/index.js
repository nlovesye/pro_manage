const path = require('path')
const fs = require('fs')

// 遍历文件夹 Controller.js 结尾的文件的路径
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

module.exports = {
    getRealPath
}