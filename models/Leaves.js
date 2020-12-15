
import { Timestamp } from 'mongodb'

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
        type:Timestamp
    },
    targeted_day:{
        type:Timestamp
    },
    replacementID:{
        type:String
    },
    document:{
        type:String
    },
}
)
export class Leaves {
    constructor(leave_type,idFROM,idTO,annual_balance,status,accidental_balance,requested_day,targeted_day,replacementID,document){
        this.leave_type = leave_type
        this.idFROM = idFROM
        this.idTO = idTO
        this.annual_balance = annual_balance
        this.status = status
        this.accidental_balance = accidental_balance
        this.requested_day = requested_day
        this.targeted_day = targeted_day
        this.replacementID = replacementID
        this.document = document
    }
}


module.exports = mongoose.model('Leaves', leavesSchema)