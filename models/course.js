const mongoose = require('mongoose');
const Department = require('./Department').schema;

const courseSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    name :{ 
        type: String
    },
    department: {
        type: Department
    },
    course_covarage: {
        type: Number
    
    },
    acedemic_coordinator_id: {
        type: String
    }
})

module.exports = mongoose.model('course', courseSchema)
