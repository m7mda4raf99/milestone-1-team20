const mongoose = require('mongoose')

const taSchema = new mongoose.Schema({

    id: {
        type: String,
        

    },
    name :{ 
        type: String,
        required: true,
        minlength: 4
    },
    department: {
        type: Department,
       
    },
    course_covarage: {
        type: Number,
    
    },

    acedemic_coordinator_id: {
        type: String,
       
    }
    
})
export class course {
    constructor(id, name,department,course_covarage,acedemic_coordinator_id) {

      this.id = id;
      this.name = name;
      this.department=department;
      this.course_covarage=course_covarage;
      this.acedemic_coordinator_id=acedemic_coordinator_id;
    }
  }


module.exports = mongoose.model('course',taSchema)
