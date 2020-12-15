const mongoose = require('mongoose')

const taSchema = new mongoose.Schema({
    course :{ 
        type: String,
    
    },
    day :{ 
        type: String,
      
        
    },
    room_location:{ 
        type: String,
       
        
    },
   which_slot :{ 
        type: Number,
      
       
        
    },
})

export class slot {
    constructor(course,day,room_location,which_slot) {

      this.course =course;
      this.day = day;
      this.room_location=room_location;
      this.which_slot= which_slot;
     
  }

}
module.exports = mongoose.model('slot',taSchema)