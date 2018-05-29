const express = require('express')
const app = express()
const authenticationRouteV1 = require('./routes/v1/authentication')
const config = require('./config')

const server = app.listen(21000, () => {
    console.log(`Listen on port ${server.address().port}`)
})



app.use(config.api_base_v1, authenticationRouteV1)