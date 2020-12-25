const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Attendance = require('./Attendance').schema;
const Notification = require('./Notifications').schema;


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
        type: String
    },
    salary: {
        type: Number,
        required: true  
    },
    putInVisa:{
        type:Number,
        default:0
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
    annual_balance:{
        type:Number,
        default: 0
    },
    accidental_balance:{
        type:Number,
        default: 0
    },
    Attendance : {
        type: Attendance
    },
    isNewMember: {
        type: Boolean,
        default: true
    },
    Notification:{
        type: Notification
    }
})

module.exports = mongoose.model('Academic Member', academicMemberSchema)

