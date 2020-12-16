const {app} = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()
//console.log(process.env.DB_URL)
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true,useUnifiedTopology: true })
app.listen(process.env.port)


