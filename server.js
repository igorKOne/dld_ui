const express = require('express')
const app = express()
const https = require('https')
//const sapclient = require('./sapclient')
const port = process.env.PORT || 3000


//app.use(sapclient)
app.use(express.static('webapp'))

app.listen(port,() => {
    console.log('server running at ' + port)
})