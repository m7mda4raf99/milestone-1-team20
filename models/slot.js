const mongoose = require('mongoose');

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
    },
    academic_member_id :{
        type: String
    }

})
 
module.exports = mongoose.model('Slot', slotSchema)