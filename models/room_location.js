
const mongoose = require('mongoose')

const roomLocationSchema = new mongoose.Schema({
    id: {
        type: String
    }    
})
   
module.exports = mongoose.model('room_location', roomLocationSchema)