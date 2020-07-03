const express = require('express')
const path = require('path')
const db = require(path.join(__dirname, '../common/db.js'))
const router = express.Router()

// 查询文章列表数据
router.get('/list', async (req, res) => {
    //   // 获取请求参数
    let param = req.query
    param.pagenum = parseInt(param.pagenum)
    param.pagesize = parseInt(param.pagesize)
    let condition = ''
    for (let key in param) {
        if (key === 'cate_id' && param[key]) {
            condition += key + '=' + param[key] + ' and '
        } else if (key === 'state' && param[key]) {
            condition += key + '="' + param[key] + '" and '
        }
    }
    condition = condition.substring(0, condition.lastIndexOf('and'))
    console.log(condition);

    let sql = 'select * from article limit ?, ?'
    if (condition) {
        sql = 'select * from article where ' + condition + ' limit ?, ?'
    }
    let ret = await db.operateData(sql, [param.pagesize * (param.pagenum - 1), param.pagesize])
    if (ret && ret.length > 0) {
        res.json({
            status: 0,
            message: '查询文章列表数据成功！',
            data: ret
        })
    } else {
        res.json({
            status: 0,
            message: '查询文章列表数据失败！',
        })
    }




})

// 发布文章
router.post('/add', (req, res) => {
    res.send('add')
})

// 删除文章
router.get('/delete/:id', (req, res) => {
    res.send('delete')
})

// 根据id查询文章详情
router.get('/:id', (req, res) => {
    res.send('id')
})

// 更新文章
router.post('/edit', (req, res) => {
    res.send('edit')
})

module.exports = router