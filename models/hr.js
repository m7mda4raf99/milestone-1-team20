const mongoose = require('mongoose')

const taSchema = new mongoose.Schema({
    id: {
        type: String,
        

    },
    name :{ 
        type: String,
       
    },
    email: {
        type: String,
       
    },
    password: {
        type: String,
       
        
    },
    salary: {
        type: Number,
     
    },
})

export class Faculty {
    constructor(id,name,email,password,salary) {
      this.id=id;
      this.name =name;
      this.email = email;
      this.password=password;
      this.salary=salary;

      
     
  }

}
module.exports = mongoose.model('hr',taSchema)