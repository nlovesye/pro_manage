// 获取权限路由
const GET_ = async (ctx, next) => {
    let {
        username
    } = ctx.query
    let user = await ctx.mdb.findOne('user', {
        username
    })
    if (!user) {
        ctx.errResp({
            msg: '用户不存在'
        })
        return
    }
    let routers = await ctx.mdb.find('routers', {
        $or: [{
            roles: user.role
        }]
    })
    routers = routers.map(r => ({
        path: r.path,
        key: r.key,
        name: r.name,
        children: r.children,
        depth: r.depth
    }))
    ctx.arrResp(routers)
}

// 新建菜单
const POST_addMenu = async (ctx, next) => {
    let {
        key,
        path,
        name,
        depth,
        sort,
        pKey
    } = ctx.request.body
    depth = (depth || -1) + 1
    if (depth === -1) {
        let target = await ctx.mdb.find('routers', {
            $or: [{
                key
            }, {
                path
            }, {
                name
            }]
        })
        if (target) {
            ctx.errResp({
                msg: '存在重复项'
            })
            return
        }
        await ctx.mdb.insert('routers', {
            key,
            path,
            name,
            depth,
            sort,
            roles: ['admin'],
            children: []
        })
        ctx.jsonResp({
            msg: '新建成功'
        })
    } else {
        console.log('pKey', pKey)
        let parent = await ctx.mdb.find('routers', { key: pKey })
        if (!parent) {
            ctx.errResp({
                msg: '父级菜单不存在'
            })
            return
        }
        if (parent.children && parent.children.some(item => (item.key === key || item.name === name || item.path === path))) {
            ctx.errResp({
                msg: '存在重复项'
            })
            return
        }
        let newChildren = parent.children ? [...parent.children] : []
        newChildren.push({
            key,
            path,
            name,
            depth,
            sort,
            roles: ['admin'],
            children: []
        })
        let newObj = {
            ...parent,
            children: newChildren
        }
        await ctx.mdb.update('routers', { key: pKey }, newObj)
        ctx.jsonResp({
            msg: '新增成功'
        })
    }
}

module.exports = {
    GET_,
    POST_addMenu
}