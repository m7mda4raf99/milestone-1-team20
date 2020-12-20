const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
//const Department = require('./Department').schema
//const Faculty = require('./Faculty').schema;
//const room_location = require('./room_Location').schema;
const Slot = require('./slot').schema;
const Attendance = require('./Attendance').schema;

// var pass = ""


// async function hashPassword () {

//     const password ='123456'
//     const saltRounds = 10;
  
//     const hashedPassword = await new Promise((resolve, reject) => {
//       bcrypt.hash(password, saltRounds, function(err, hash) {
//         if (err) reject(err)
//         resolve(hash)
//       });
//     })
  
//     console.log( hashedPassword)
//   }

  



// async function hashPass() {
//     return await bcrypt.hash('123456', 10)
//   }

//   console.log(hashPass()[0]+ "cfvgbhnj")

// const hashPass = async () => {
//     const hash = await bcrypt.hash('123456', 10)
//     pass = hash
    
// }

//setTimeout(() => {  console.log("bhnjmk"+pass) }, 5000);


const academicMemberSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true      
    },
    name :{ 
        type: String,
        required: true  
    },
    email: {
        type: String,
        required: true,
        unique: true  
        
    },
    password: {
        type: String,
        default: 123456
    },
    salary: {
        type: Number,
        required: true  
    },
    department_name: {
        type: String
    },
    faculty_name: {
        type: String
        
    },
    room_location_id: {
        type: String,
        required: true
    },
    HOD: {
        type: Boolean
    },
    Coordinator: {
        type: Boolean
    },
    role: {
        type: String
    },
    gender: {
        type: String
    },
    courses_taught: {
        type: []    //[course_ID]
    },
    assign_slots: {
        type: []    //[number]  
    },
    schedule: {
        type: []    //[slot]
    },
    Phone_Number: {
        type:String
    },
    Attendance : {
        type: Attendance
    }
})




module.exports = mongoose.model('Academic Member ashaf 5arya m7dsh yegy gmb kosomha', academicMemberSchema)