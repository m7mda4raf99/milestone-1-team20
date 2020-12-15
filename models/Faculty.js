const mongoose = require('mongoose')

const taSchema = new mongoose.Schema({
    name :{ 
        type: String,
       
    },
    department :{ 
        type: Array(),
        
        
    },
})

 class Faculty {
    constructor(name,department) {

      this.name =name;
      this.department = department;
      
     
  }

}
module.exports = mongoose.model('Faculty',taSchema)