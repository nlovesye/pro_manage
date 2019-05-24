const crypto = require('crypto')

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

const findTreeObj = (arr = [], keyName, keyVal, rt = null) => {
    arr.forEach(item => {
        if (item.children && item.children.length && !rt) {
            rt = findTreeObj(item.children, keyVal, rt)
        }
        if (item[keyName] === keyVal) {
            rt = item
        }
    })
    return rt
}


module.exports = {
    sha1hash,
    md5hash,
    findTreeObj
}