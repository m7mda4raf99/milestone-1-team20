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
    extraHours:{
        type: Number,
        default: 0
    },
    extraMinutes:{
        type: Number,
        default: 0
    }

}
)

module.exports = mongoose.model('Attendance', attendanceSchema)

