function operateData(sql,param) {
    return new Promise((resolve, reject) => {
        const mysql = require('mysql')

        const cn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            database: 'bigeventapi',
            user: 'root',
            password: 'admin123'
        })

        cn.connect()
        // 
        cn.query(sql,param, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }

        })
        cn.end()
    })

}
module.exports = {
    operateData
}