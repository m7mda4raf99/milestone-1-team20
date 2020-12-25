const express = require('express')

//require routes files
const staff_routes = require('./routes/Staff_route')
const instructor_routes = require('./routes/Instructor_routes')
const hr_routes = require('./routes/HR_route')
const Coordinator = require('./routes/Course_Coordinator_routes')
const Academic_Member_routes = require('./routes/Academic_Member_routes')
const HOD_routes = require('./routes/HOD_route')

const jwt = require('jsonwebtoken')
const app = express()
require('dotenv').config()
app.use(express.json())


//app.use routes
app.use('',staff_routes)
app.use('',instructor_routes)
app.use('',hr_routes)
app.use('',Coordinator)
app.use('',Academic_Member_routes)
app.use('',HOD_routes)


// var signIn = [] 
// var signOut = []

// function In(number){
//     signIn.push(number)
//     signOut.push(undefined)
// }


// function Out(number){
//     if(signOut[signOut.length-1]){
//         signOut.push(number)
//         signIn.push(undefined)
//     }else{
//         signOut[signOut.length-1] = number
//     }
// }


module.exports.app = app 



