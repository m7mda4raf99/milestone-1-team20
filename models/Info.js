const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    id_hr: {
        type: Number,
        default: 1
    },
    id_academic: {
        type: Number,
        default: 1
    },
    id_request: {
        type: Number,
        default: 1
    },
    
})


module.exports = mongoose.model('Info',infoSchema)