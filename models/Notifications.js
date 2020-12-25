const mongoose= require('mongoose')

const NotificationsSchema=new mongoose.Schema({
    request_id:{
        type: String
    },
    status_of_request:{
        type:   String 
    },
    sender_id: { 
        type: String
    },
    destination_id: {
        type: String
    },
    reason:{
        type:String,
        default:""
    }
}
)

module.exports = mongoose.model('Notification', NotificationsSchema)