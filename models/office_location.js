
const mongoose = require('mongoose')

const taSchema = new mongoose.Schema({
    id: {
        type: String,
       

    },
    capacity_left :{ 
        type: Number,
       
       
    },
   
})
   
    export class office_location {
        constructor(id, capacity_left) {
    
          this.id = id;
          this.capacity_left = capacity_left;
          
      }
    
    }



module.exports = mongoose.model('office_location',taSchema)