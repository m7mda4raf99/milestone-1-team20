
const mongoose = require('mongoose')

const officeLocationSchema = new mongoose.Schema({
    id: {
        type: String
    },
    capacity_left :{ 
        type: Number
    },
   
})

module.exports = mongoose.model('office_location', officeLocationSchema)