const mongoose= require('mongoose')

const attendanceSchema=new mongoose.Schema({
    dayOff:{
        type: String
    },
    signIn:{
        type: []    //[String]
    },
    signOut:{
        type: []    //[String]
    },
    SignedIn:{
        type: Number,
        default: 0
    },
    spentHoursPerMonth:{
        type: Number,
        default: 0
    },
    missingDays:{
        type: Number,
        default: 0
    },
    missingHours:{
        type: Number,
        default: 0
    },
    missingMinutes:{
        type: Number,
        default: 0
    },
    acceptedMissingHours:{
        type: Number,
        default: 0
    },
    acceptedMissingMinutes:{
        type: Number,
        default: 0
    }

}
)

module.exports = mongoose.model('Attendance', attendanceSchema)

