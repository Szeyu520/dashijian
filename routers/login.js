const express = require('express')
const path = require('path')
const db = require(path.join(__dirname, '../common/db.js'))
const router = express.Router()
const utils = require('utility')
const jwt = require('jsonwebtoken')


router.post('/login', async (req, res) => {
    let param = req.body
    param.password = utils.md5(param.password)
    let sql = 'select id from user where username = ? and password = ?'
    let ret = await db.operateData(sql, [param.username, param.password])
    if (ret && ret.length > 0) {
        let token = jwt.sign({
            username: param.username,
            id: ret[0].id
        }, 'bigevent', {
            expiresIn:'2 days'
        })
        res.json({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + token
        })
    } else {
        res.json({
            status: 1,
            message: '登录失败'
        })
    }

})

router.post('/reguser', async (req, res) => {
    let param = req.body
    param.password = utils.md5(param.password)
    let sql = 'insert into user set ?'
    let ret = await db.operateData(sql, param)
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '注册成功'
        })
    } else {
        res.json({
            status: 1,
            message: '注册失败'
        })
    }
})

router.get('/test', async (req, res) => {
    let sql = 'select * from user'
    let ret = await db.operateData(sql, null)
    res.json({
        status: 0,
        data: ret
    })
})


module.exports = router