const mongoose = require('mongoose');
//const room_location = require('./room_Location').schema;
const bcrypt = require('bcrypt')

const hrSchema = new mongoose.Schema({
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
        default: hashPass() 
    },
    salary: {
        type: Number,
        required: true
     
    },
    room_location_id: {
        type: String,
        required: true
    },
    role:{
        type:String
    },
    gender: {
        type: String
    },
    Phone_Number: { 
        type:String
    }
})

async function hashPass() {
    const password = '123456'
    const rounds = 10

    bcrypt.hash(password, rounds, (err, hash) => {
        if (err) {
          console.error("Hash error!")
          return
        }
        return hash
      })
}

module.exports = mongoose.model('hr',hrSchema)