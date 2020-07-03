/*
  用户信息相关接口
*/
const express = require('express')
const router = express.Router()
const utils = require('utility')
const path = require('path')
const db = require(path.join(__dirname, '../common/db.js'))

// 路由配置

// 获取用户信息
router.get('/userinfo', async (req, res) => {
    // 根据什么获取用户的详细信息？用户的id
    // 用户的id从哪里得到？token
    // req.user表示从token中获取的信息，该信息是登录成功后放入的
    // req.user属性名称是固定的吗？是的
    // { username: 'tom', id: 8, iat: 1593587638, exp: 1593591238 }
    // 根据用户的id查询用户的详细信息
    let sql = 'select id, username, nickname, email, user_pic from user where id = ?'
    let info = await db.operateData(sql, req.user.id)
    if (info && info.length > 0) {
        res.json({
            status: 0,
            message: '获取用户基本信息成功！',
            data: info[0]
        })
    } else {
        res.json({
            status: 1,
            message: '获取用户信息失败！'
        })
    }
})

// 更新用户信息
router.post('/userinfo', async (req, res) => {
    // 获取请求参数
    let param = req.body
    // 更新用户的信息
    let sql = 'update user set ? where id = ?'
    // 如果是增删改操作，那么返回对象；如果是查询，那么返回数组
    let ret = await db.operateData(sql, [{ nickname: param.nickname, email: param.email }, param.id])
    // 处理响应状态
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '修改用户信息成功！'
        })
    } else {
        res.json({
            status: 1,
            message: '修改用户信息失败！'
        })
    }
})

// 更新密码
router.post('/updatepwd', async (req, res) => {
    // 获取请求参数
    let param = req.body
    // 对密码进行加密处理
    param.oldPwd = utils.md5(param.oldPwd)
    param.newPwd = utils.md5(param.newPwd)
    // 获取用户的id
    let id = req.user.id
    // 调用数据库方法进行更新操作
    let sql = 'update user set password = ? where id = ? and password = ?'
    let ret = await db.operateData(sql, [param.newPwd, id, param.oldPwd])
    // 响应返回状态
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '更新密码成功！'
        })
    } else {
        res.json({
            status: 1,
            message: '更新密码失败！'
        })
    }
})

// 更新头像
router.post('/update/avatar', async (req, res) => {
    // 获取请求参数
    let param = req.body
    // 获取用户的id
    let id = req.user.id
    // 更新数据库
    let sql = 'update user set user_pic = ? where id = ?'
    let ret = await db.operateData(sql, [param.avatar, id])
    // 处理响应
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '更新头像成功！'
        })
    } else {
        res.json({
            status: 1,
            message: '更新头像失败！'
        })
    }
})

module.exports = router