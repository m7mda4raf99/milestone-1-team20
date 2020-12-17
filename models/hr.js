const mongoose = require('mongoose');
const office_location = require('./Office_Location').schema;

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
        type: String,  
    },
    salary: {
        type: Number,
        required: true
     
    },
    office_location: {
        type: office_location,
        required: true
    },
    role:{
        type:String
    },
    gender: {
        type: String
    },
    
    Phone_Number: {
        type:Number
    }
})

module.exports = mongoose.model('hr',hrSchema)