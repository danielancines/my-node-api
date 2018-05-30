const express = require('express')
const app = express()
const authenticationRouteV1 = require('./routes/v1/authentication')
const tvShowsRouteV1 = require('./routes/v1/tvShows')
const config = require('./config')
const path = require('path')

const server = app.listen(21000, () => {
    console.log(`Listen on port ${server.address().port}`)
})

app.use(path.join(config.api_base_v1, config.authenticationEndpoint), authenticationRouteV1)
app.use(path.join(config.api_base_v1, config.tvShowEndpoint), tvShowsRouteV1)