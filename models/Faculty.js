const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name :{ 
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('Faculty',facultySchema)