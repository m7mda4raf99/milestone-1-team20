import { course } from './course';
import Department from './Department';
import { Faculty } from './Faculty';
import { office_location } from './office_location';
import { slot } from './slot';

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
    department: {
        type: Department,
       
    },
    faculty: {
        type: Faculty,
        
    },
    department: {
        type: Department,
        
    },
    office_location: {
        type: office_location,
       
    },
    HOD: {
        type: Boolean,
        
    },
    role: {
        type: String,
    
    },
    gender: {
        type: String,
       
    },
    courses_taught: {
        type: Array[course],
        
    },
    assign_slots: {
        type: Array[int],
       
    },
    schedule: {
        type: Array[slot],
        
    }

})
   
    export class Acedmic_members {
        constructor(id, name,email, password, salary,faculty,department,HOD,office_location,role,gender,courses_taught, assign_slots,schedule) {
    
          this.id = id;
          this.name = name;
          this.email=email;
          this.password= password;
          this.salary= salary;
          this.faculty=faculty;
          this.department=department;
          this.office_location=office_location;
          this.HOD=HOD;
          this.role=role;
          this.department=department;
          this.gender=gender;
          this.courses_taught=courses_taught;
          this. assign_slots= assign_slots;
          this.schedule=schedule;
      }
    
    }



module.exports = mongoose.model('Acedmic_members',taSchema)