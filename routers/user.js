const express = require('express')
const router = express.Router()
const path = require('path')
const db = require(path.join(__dirname, '../common/db.js'))

router.get('/userinfo', async (req, res) => {

    let sql = 'select id, username, nickname, email, user_pic from user where id = ?'
    let info = await db.aperateData(sql, req.user.id)
    if (info && info.length > 0) {
        res.json({
            status: 0,
            message: '获取用户信息成功',
            data: info[0]
        })
    } else {
        res.json({
            status: 1,
            message: '获取用户信息失败',
        })
    }


})


router.post('/userinfo', (req, res) => {
    res.send('update userinfo')
})

router.post('/updatepwd', (req, res) => {
    res.send('updatepwd')
})

router.post('/update/avatar', (req, res) => {
    res.send('update/avatar')
})


module.exports = router