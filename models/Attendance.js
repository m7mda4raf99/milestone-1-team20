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
    spentHoursPerMonth:{
        type: Number
    },
    missingDays:{
        type: Number
    },
    missingHours:{
        type: Number
    },
    missingMinutes:{
        type: Number
    }
}
)

module.exports = mongoose.model('Attendance', attendanceSchema)

