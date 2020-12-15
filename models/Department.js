const mongoose = require('mongoose')

const { Rectangle } = require('./course')
const taSchema = new mongoose.Schema({
    name :{ 
        type: String,
      
    },
   
})
export class course {
    constructor(name) {
      this.name = name;
      
    }
  }


module.exports = mongoose.model('Department',taSchema)