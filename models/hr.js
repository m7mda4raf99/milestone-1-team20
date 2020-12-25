const mongoose = require('mongoose');

const hrSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true  
    },
    name :{ 
        type: String,
        required: true
    },
    email: {
        type: String,    
        required: true,
        unique: true  
    },
    password: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    room_location_id: {
        type: String,
        required: true
    },
    role:{
        type:String
    },
    gender: {
        type: String
    },
    Phone_Number: { 
        type:String
    },
    isNewMember: {
        type: Boolean,
        default: true
    }
})


module.exports = mongoose.model('HR',hrSchema)