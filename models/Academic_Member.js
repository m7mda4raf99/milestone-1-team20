const mongoose = require('mongoose')
const Department = require('./Department').schema
const Faculty = require('./Faculty').schema;
const office_location = require('./Office_Location').schema;
const course = require('./Course').schema;
const slot = require('./Slot').schema;

const academicMemberSchema = new mongoose.Schema({
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
        type: String
    },
    salary: {
        type: Number,
        required: true  
    },
    department: {
        type: Department
    },
    faculty: {
        type: Faculty
        
    },
    office_location: {
        type: office_location,
        required: true  
    },
    HOD: {
        type: Boolean
    },
    role: {
        type: String
    },
    gender: {
        type: String
    },
    courses_taught: {
        type: [course]
    },
    assign_slots: {
        type: [Number] 
    },
    schedule: {
        type: [slot]
    }
})
 
module.exports = mongoose.model('Academic Member', academicMemberSchema)