const express = require('express')
const cors = require('cors')
const path = require('path')
const jwt = require('express-jwt')
const loginRouter = require(path.join(__dirname, 'routers/login.js'))
const userRouter = require(path.join(__dirname, 'routers/user.js'))
const cateRouter = require(path.join(__dirname, 'routers/cate.js'))
const articleRouter = require(path.join(__dirname, 'routers/article.js'))
const app = express()

// 处理客户端请求post参数
// for parsing application/json
app.use(express.json())
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// 设置跨域
app.use(cors())


app.use(jwt({ secret: 'bigevent' }).unless({ path: /^\/api/ }))

// 设置路径
app.use('/api', loginRouter)
app.use('/my', userRouter)
app.use('/my/article', cateRouter)
app.use('/my/article', articleRouter)




// 添加一个中间件，统一处理异常信息
app.use((err, req, res, next) => {
    if (err.status === 401) {
        // token验证失败
        // status参数401表示http协议的响应状态码
        res.status(401).json({
            status: 401,
            message: err.message
        })
    } else {
        res.json({
            status: 500,
            message: '服务器错误' + err.message
        })
    }
})

app.listen(8888, () => {
    console.log('running...')
})
