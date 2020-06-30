const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
    res.send('login')
})

router.post('/reguser', (req, res) => {
    res.send('reguser')
})


module.exports = router