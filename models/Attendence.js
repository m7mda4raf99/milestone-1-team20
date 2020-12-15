const { Timestamp } = require('mongodb')
const mongoose= require('mongoose')

const attendanceSchema=new mongoose.Schema({
    dayOff:{
        type:String
    },
    signIn:{
        type:Array[Timestamp]
    },
    signOut:{
        type:Array[Timestamp]
    },
    spentHoursPerMonth:{
        type:Number
    },
    missingDays:{
        type:Number
    },
    missingHours:{
        type:Number
    },
    missingMinutes:{
        type:Number
    }
}
)
export class Attendance {
    constructor(dayOff, signIn,signOut,spentHoursPerMonth,missingDays,missingHours,missingMinutes){
        this.dayOff = dayOff
        this.signIn = signIn
        this.signOut = signOut
        this.spentHoursPerMonth = spentHoursPerMonth
        this.missingDays = missingDays
        this.missingHours = missingHours 
        this.missingMinutes = missingMinutes
    }
}


module.exports = mongoose.model('Attendance', attendanceSchema)

