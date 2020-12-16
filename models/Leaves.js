const mongoose= require('mongoose')

const leavesSchema=new mongoose.Schema({
    leave_type:{
        type:String
    },
    idFROM:{
        type:String
    },
    idTO:{
        type:String
    },
    annual_balance:{
        type:Number
    },
    status:{
        type:String
    },
    accidental_balance:{
        type:Number
    },
    requested_day:{
        type:String
    },
    targeted_day:{
        type:String
    },
    replacementID:{
        type:String
    },
    document:{
        type:String
    }
}
)

module.exports = mongoose.model('Leaves', leavesSchema)