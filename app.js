const express = require('express')

//require routes files
const staff_routes = require('./routes/Staff_route')
const instructor_routes = require('./routes/Instructor_routes')
const hr_routes = require('./routes/HR_route')


const blockList = staff_routes.blockList
const jwt = require('jsonwebtoken')
const app = express()
const name = "ASHRAF"
require('dotenv').config()
app.use(express.json())

//app.use routes
app.use('',staff_routes)
app.use('',instructor_routes)
app.use('',hr_routes)




module.exports.app = app 
module.exports.name = name


