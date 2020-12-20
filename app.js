const express = require('express')

//require routes files
const staff_routes = require('./routes/Staff_route')
<<<<<<< HEAD
const HR_route = require('./routes/HR_route')
=======
const instructor_routes = require('./routes/Instructor_routes')
const hr_routes = require('./routes/HR_route')


>>>>>>> a11f25cf9b3627282783a8f5ac47d51b45bdabbc
const blockList = staff_routes.blockList
const jwt = require('jsonwebtoken')
const app = express()
const name = "ASHRAF"
require('dotenv').config()
app.use(express.json())

//app.use routes
app.use('',staff_routes)
<<<<<<< HEAD
app.use('',HR_route)


//app.use (token)
// app.use((req,res,next)=>{
//     //console.log(blockList.pop())
//     const token = req.headers.token
//     if(token){
//         if((blockList.filter((token)=>token === req.headers.token)).length === 0){
//             try{
//                 const correctToken = jwt.verify(token, process.env.TOKEN_SECRET)
//                     if(correctToken){
//                         req.user = correctToken
//                         //console.log(correctToken)   
//                         console.log(req.user) 
//                         next()
//                     }else{
//                         res.status(403).send('This token is incorrect')
//                      }
//                 }
//                 catch(Exception){
//                     res.status(403).send('This token is incorrect')
            
//                 }
//         }
//         else{
//             res.status(401).send('Access deined')    
//         }
//     }
//     else{
//         res.status(403).send('Access denied. You need a token')
//     }
// })

// app.use(function (req, res, next) {
//     console.log(blockList)
    
//     const token = req.headers.token
//     if(token){
//         if((blockList.filter((token)=>token === req.headers.token)).length === 0){
//             try{
//                 const correctToken = jwt.verify(token, process.env.TOKEN_SECRET)
//                     if(correctToken){
//                         req.user = correctToken
//                         //console.log(correctToken)   
//                         console.log(req.user) 
//                         next()
//                     }else{
//                         res.status(403).send('This token is incorrect')
//                      }
//                 }
//                 catch(Exception){
//                     res.status(403).send('This token is incorrect')
            
//                 }
//         }
//         else{
//             res.status(401).send('Access deined')    
//         }
//     }
//     else{
//         res.status(403).send('Access denied. You need a token')
//     }
//   })

=======
app.use('',instructor_routes)
app.use('',hr_routes)


>>>>>>> a11f25cf9b3627282783a8f5ac47d51b45bdabbc


module.exports.app = app 
module.exports.name = name


