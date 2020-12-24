const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
//const Department = require('./Department').schema
//const Faculty = require('./Faculty').schema;
//const room_location = require('./room_Location').schema;
const Slot = require('./slot').schema;
const Attendance = require('./Attendance').schema;


const academicMemberSchema = new mongoose.Schema({
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
        default: 123456
    },
    salary: {
        type: Number,
        required: true  
    },
    department_name: {
        type: String
    },
    faculty_name: {
        type: String
        
    },
    room_location_id: {
        type: String,
        required: true
    },
    HOD: {
        type: Boolean,
        default: false
    },
    Coordinator: {
        type: Boolean,
        default: false
    },
    role: {
        type: String
    },
    gender: {
        type: String
    },
    courses_taught: {
        type: []    //[course_ID]
    },
    assign_slots: {
        type: []    //[number]  
    },
    schedule: {
        type: []    //[slot]
    },
    Phone_Number: {
        type:String
    },
    Attendance : {
        type: Attendance
    }
})




module.exports = mongoose.model('Academic Member ziad', academicMemberSchema)
