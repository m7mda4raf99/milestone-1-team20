const express = require('express')

//require routes files
const routes = require('./routes/routes')


const jwt = require('jsonwebtoken')
const app = express()
require('dotenv').config()
app.use(express.json())

//app.use routes
app.use('',routes)


//app.use (token)

module.exports.app = app 