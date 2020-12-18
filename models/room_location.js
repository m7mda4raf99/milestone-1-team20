
const mongoose = require('mongoose')

const roomLocationSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    type_of_Room: {
        type:String
    },
    capacity_left :{ 
        type: Number
    }  
})
   
module.exports = mongoose.model('room_location', roomLocationSchema)