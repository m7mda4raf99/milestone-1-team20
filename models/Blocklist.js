<<<<<<< HEAD
const mongoose= require('mongoose')

const blocklist=new mongoose.Schema({
    name: {
        type: String
    }
}
)

module.exports = mongoose.model('Blocklist', blocklist)
=======

const mongoose = require('mongoose')

const blocklist = new mongoose.Schema({
    name: {
        type: String
    }
})
   
module.exports = mongoose.model('Blocklist', blocklist)
>>>>>>> a11f25cf9b3627282783a8f5ac47d51b45bdabbc
