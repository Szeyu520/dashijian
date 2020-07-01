const express = require('express')
const cors = require('cors')
const path = require('path')
const jwt = require('express-jwt')
const loginRouter = require(path.join(__dirname, 'routers/login.js'))
const userRouter = require(path.join(__dirname, 'routers/user.js'))

const app = express()



app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json

app.use(cors())

app.use(jwt({ secret: 'bigevent' }).unless({ path: /^\/api/ }))

app.use('/api', loginRouter)
app.use('/my', userRouter)

app.listen(8888, () => {
    console.log('running...');

})
