const mongoose = require('mongoose');
const  room_location  = require('./Room_Location').schema;
const  course  = require('./Course').schema;


const slotSchema = new mongoose.Schema({
    course :{ 
        type: course,
    },
    day :{ 
        type: String,
    },
    room_location:{ 
        type: room_location, 
    },
   which_slot :{ 
        type: Number,
    }
})
 
module.exports = mongoose.model('slot', slotSchema)