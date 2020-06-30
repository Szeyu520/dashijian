const express = require('express')
const cors = require('cors')
const path = require('path')
const loginRouter = require(path.join(__dirname,'routers/login.js'))

const app = express()



app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json

app.use(cors())

app.use('/api',loginRouter)

app.listen(8888, () => {
    console.log('running...');
    
})
