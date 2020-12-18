const mongoose = require('mongoose');
const Department = require('./Department').schema;

const courseSchema = new mongoose.Schema({
    id: {
        type: String,
        unique:true
    },
    name :{ 
        type: String
    },
    department_name: {
        type: String
    },
    course_covarage: {
        type: Number
    
    },
    acedemic_coordinator_id: {
        type: String
    }
})

module.exports = mongoose.model('course', courseSchema)
