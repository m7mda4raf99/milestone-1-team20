const mongoose = require('mongoose');


const requestsSchema = new mongoose.Schema({
    id: {
        type: String,
        index:true,
        unique:true,
        required:true
    },
    target_day:{ 
        type: Date,
    },
    date_of_request :{ 
        type: Date,
        default:Date.now
    },
    type_of_request :{ /// 1-change day_off 2-slot linking 3-replacment 4-compensation 5-annual leave 6-sick leave 7-accidental leave  8-maternity leave                                                       
        type: String
    },
    status_of_request: { // Accepted Rejected Pending
         type: String,
         required:true
    },
    sender_id: { 
        type: String
    },
    destination_id: {
        type: String
    },
    document:{
        type:String,
        default:""
    }
})

module.exports = mongoose.model('requests', requestsSchema)
