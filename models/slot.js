const mongoose = require('mongoose');
//const  room_location  = require('./Room_Location').schema;
//const  course  = require('./Course').schema;


const slotSchema = new mongoose.Schema({
    course_id :{ 
        type: String,
    },
    day :{ 
        type: String,
    },
    room_location_id:{ 
        type: String, 
    },
   which_slot :{ 
        type: Number
    }
})
 
module.exports = mongoose.model('slot', slotSchema)