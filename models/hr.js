const mongoose = require('mongoose');
const office_location = require('./Office_Location').schema;

const hrSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name :{ 
        type: String,
        required: true
    },
    email: {
        type: String,    
        required: true

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
    }
})

module.exports = mongoose.model('hr',hrSchema)