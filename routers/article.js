const express = require('express')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: path.join(__dirname, '../uploads') })
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
    // condition = condition.substring(0, condition.lastIndexOf('and'))
    // console.log(condition);

    let sql = 'select a.id, a.title, a.pub_date, a.state, c.name as cate_name from article as a join category as c on a.cate_id = c.id where a.is_delete = 0 limit ?, ?'
    let totalSql = 'select count(*) as total from article where is_delete = 0'

    if (condition) {
        condition += ' a.is_delete = 0 '
        sql = 'select a.id, a.title, a.pub_date, a.state, c.name as cate_name from article as a join category as c on a.cate_id = c.id where ' + condition + ' limit ?, ?'

        totalSql = 'select count(*) as total from article as a where ' + condition
    }
    let ret = await db.operateData(sql, [param.pagesize * (param.pagenum - 1), param.pagesize])
    let cret = await db.operateData(totalSql)
    console.log(cret);

    if (ret && ret.length > 0) {
        res.json({
            status: 0,
            message: '查询文章列表数据成功！',
            data: ret,
            total: cret[0].total
        })
    } else {
        res.json({
            status: 0,
            message: '查询文章列表数据失败！',
        })
    }




})

// 删除文章
router.get('/delete/:id', async (req, res) => {
    let id = req.params.id
    let sql = 'update article set is_delete = 1 where id = ?'
    let ret = await db.operateData(sql, id)
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '删除文章成功！'
        })
    } else {
        res.json({
            status: 1,
            message: '删除文章失败！'
        })
    }
})

// 发布文章
router.get('/:id', async (req, res) => {
    let id = req.params.id
    let sql = 'select * from article where is_delete = 0 and id = ?'
    let ret = await db.operateData(sql, id)
    if (ret && ret.length > 0) {
        res.json({
            status: 0,
            message: '查询文章成功！',
            data: ret[0]
        })
    } else {
        res.json({
            status: 1,
            message: '查询文章失败！'
        })
    }
})


// 更新文章
router.post('/edit', upload.single('cover_img'), async (req, res) => {
    let param = req.body
    let filePath = '/uploads/' + req.file.filename
    let sql = 'update article set ? where id = ?'
    let ret = await db.operateData(sql, [{
        title: param.title,
        cate_id: param.cate_id,
        content: param.content,
        cover_img: filePath,
        state: param.state
    }, param.Id])
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '更新文章成功！'
        })
    } else {
        res.json({
            status: 1,
            message: '更新文章失败！'
        })
    }
})

// 根据id查询文章详情
router.post('/add', upload.single('cover_img'), async (req, res) => {
    let param = req.body
    let id = req.user.id
    let filePath = '/uploads/' + req.file.filename
    let sql = 'insert into article set ?'
    let ret = await db.operateData(sql, {
        title: param.title,
        cate_id: param.cate_id,
        content: param.content,
        cover_img: filePath,
        state: param.state,
        is_delete: 0,
        author_id: id,
        pub_date: new Date()
    })
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: '添加文章成功！'
        })
    } else {
        res.json({
            status: 1,
            message: '添加文章失败！'
        })
    }
})

module.exports = router