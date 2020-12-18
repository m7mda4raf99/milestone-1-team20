const express = require('express')


const router = express.Router()

const room_location = require('../models/room_Location')    
const Academic_Member = require('../models/Academic_Member')
const Faculty = require('../models/Faculty')
const Department = require('../models/Department')
const course = require('../models/course')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


require('dotenv').config()

// const tokenVerification = (req,res,next) => {
//     const token = req.headers.token
//     if(token){
//         if((blockList.filter((token)=>token === req.headers.token)).length === 0){
//             try{
//                 const correctToken = jwt.verify(token, process.env.TOKEN_SECRET)
//                     if(correctToken){
//                         req.data = correctToken
//                         next()
//                     }else{
//                         res.status(403).send('This token is incorrect')
//                      }
//                 }
//                 catch(Exception){
//                     res.status(403).send('This token is incorrect')
            
//                 }
//         }
//         else{
//             res.status(401).send('Access denied')    
//         }
//     }
//     else{
//         res.status(403).send('Access denied. You need a token')
//     }
// }


/////////////////////////room_location
router.route('/HR/Room')
.post(async( req,res)=>{

const room_locationmodel=  new room_location({
    id:req.body.id,
    type_of_Room:req.body.type_of_Room,
    capacity_left:req.body.capacity_left
}
)
await room_locationmodel.save().then(doc => {
    res.send(doc);
})
.catch(err => {
console.error(err)
})
})

////delete
router.route('/HR/Room/:id')
.delete(async( req,res)=>{
  await  room_location
.findOneAndRemove({
id: req.params.id
})
.then(response => {
console.log(response)
res.send(response)
})
.catch(err => {
console.error(err)
})
})


////update
router.route('/HR/Room/:id')
.put(async( req,res)=>{
  await  room_location

  .findOneAndRemove({
    id:req.params.id
})

const room_locationmodel=  new room_location({
    id:req.params.id,
    type_of_Room:req.body.type_of_Room,
    capacity_left:req.body.capacity_left
}
)
await room_locationmodel.save().then(doc => {
    res.send(doc);
})

.then(response => {
console.log(response)
res.send(response)
})
.catch(err => {
console.error(err)
})
})


///////////////////////////////////////faculty
//add
router.route('/HR/Faculty')

.post(async( req,res)=>{

    const facultymodel=  new Faculty({
        name:req.body.name
    })

    await facultymodel.save().then(doc => {
        res.send(doc);
    })
    .catch(err => {
    console.error(err)
    })
    })

    //delete
router.route('/HR/Faculity/:name')
 .delete(async( req,res)=>{
    await  Faculty
    .findOneAndRemove({
    name: req.params.name
    })
    .then(response => {
    console.log(response)
    res.send(response)
    })
    .catch(err => {
    console.error(err)
    })
    })

//update
router.route('/HR/Faculty/:name')
.put(async( req,res)=>{
      await  Faculty
    .findOneAndUpdate({
    name: req.params.name,
    name:req.body.name
    })
    await Faculty.findOneAndRemove({
        name: req.params.name
    })
    .then(response => {
    console.log(response)
    res.send(response)
    })
    .catch(err => {
    console.error(err)
    })
    })



   /////////////////////////////////////////////////department

    //add
router.route('/HR/Department')

.post(async( req,res)=>{

    const departmentmodel=  new Department({
        name:req.body.name,
        faculty_name:req.body.faculty_name
    })

   const exists= await  Faculty
    .exists({
    name: req.body.faculty_name,
    })
    if(exists){
        await departmentmodel.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
    }
    else{
        res.status(404).send('faculty doesnot exist')
    }

   
})

//update



router.route('/HR/Department/:name')
.put(async( req,res)=>{

   const olddep= await Department.find({
        name:req.params.name

    }).then(response => {}).catch(err => {console.error("Can't find this department")})
    await Department.findOneAndRemove({
        name: req.params.name

    }).then(response => {}).catch(err => {console.error("Can't find this department and remove it")})

    const departmentmodel=  new Department({
        name:req.body.name,
        faculty_name:olddep[0].faculty_name
    
    })
    await departmentmodel.save().then(doc => {
        res.send(doc);
    }).then(response => {}).catch(err => {console.error("Can't save new department to database")})
    

    var oldUsers = await Academic_Member.find({department : olddep[0].name})
    //console.log("oldUsers" + oldUsers.length)


    for(var i=0;i<oldUsers.length;i++){
        await Academic_Member.findOneAndRemove({id: oldUsers[i].id})
        .then(response => {}).catch(err => {console.error("Can't find users with same department")})
        //console.log("ashrafff "+oldUsers[i])
        const newUser = new Academic_Member({
            id: oldUsers[i].id,
            name: oldUsers[i].name,
            email: oldUsers[i].email,
            password: oldUsers[i].password,
            salary: oldUsers[i].salary,
            department : req.body.name,
            faculty: oldUsers[i].faculty,
            HOD: oldUsers[i].HOD,
            role: oldUsers[i].role,
            gender: oldUsers[i].gender,
            courses_taught: oldUsers[i].courses_taught,
            assign_slots: oldUsers[i].assign_slots,
            schedule: oldUsers[i].schedule,



        })
        await newUser.save().then(doc => {
            res.send("jnkm");
        }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
        
    }
    })

router.route('/staff/add')
.post(async (req,res)=>{    
        const newM = new Academic_Member({
            id: "43-10872",
            name: "Mohamed Ashraf",
            email: "mohzashraf1@gmail.com",
            password: "ACLProject",
            salary: 5000000,
            department: "MET",
            office_location:{id : "C5.201"}
        })
        await newM.save().then(doc => {
            res.send(doc);
        })
        .then(response => {
            //console.log(response)
            res.send(response)
            })
            .catch(err => {
            console.error(err)
            })
    
    })


//delete
router.route('/HR/Department/:name')
.delete(async( req,res)=>{

    const exists= await  Department
    .exists({
    name: req.params.name,
    })

    if(exists){

        await Department.findOneAndRemove({
            name: req.params.name
        })
        .then(response => {
            console.log(response)
            res.send(response)
            })
            .catch(err => {
            console.error(err)
            })
       
    }
    else{
        res.status(404).send('department doesnot exist')
    }
   
  
  })

  //////////////////////////////////////////////////////course

router.route('/HR/course')
.post(async( req,res)=>{

  const coursemodel=  new course({
      id:req.body.id,
      name:req.body.name,
      department_name:req.body.department_name,
      course_covarage:req.body.course_covarage,
      academic_coordinator_id:req.body.academic_coordinator_id,
      
  })

 const exists= await  Department
  .exists({
  name: req.body.department_name,
  })
  if(exists){
      await coursemodel.save().then(doc => {
          res.send(doc);
      })
      .then(response => {
        console.log(response)
        res.send(response)
        })
        .catch(err => {
        console.error(err)
        })
  }
  else{
      res.status(404).send('department doesnot exist')
  }
 
  })

  //update
router.route('/HR/course/:id')
.put(async( req,res)=>{

    await course.findOneAndRemove({
        id: req.params.id
    })
    const coursemodel=  new course({
        id:req.params.id,
        name:req.body.name,
        department_name:req.body.department_name,
        course_covarage:req.body.course_covarage,
        academic_coordinator_id:req.body.academic_coordinator_id,
    })

    await coursemodel.save().then(doc => {
        res.send(doc);
    })
    
.then(response => {
console.log(response)
res.send(response)
})
.catch(err => {
console.error(err)
})
})

router.route('/HR/addAcademicMembers')
.post(async( req,res)=>{
  const Academic_membermodel=  new Academic_Member({
      id:req.body.id,
      name:req.body.name,
      email:req.body.email,
      salary:req.body.salary,
      room_location:req.body.room_location,

  })
   if(room_location.capacity_left==0){
       res.send("the office location you are trying to assign  is full")
   }
   else{

       id++;
      await Academic_membermodel.save().then(doc => {
          res.send(doc);
      })
      .catch(err => {
      console.error(err)
      })
     newmember=true;
    }

  })
.get(async( req,res)=>{
     
    res.send("ac-"+id);
})



router.route('/HR/addHrMembers')
.post(async( req,res)=>{
      
  const hrmodel=  new hr({
      id:req.body.id,
      name:req.body.name,
      email:req.body.email,
      salary:req.body.salary,
      room_location:req.body.roomlocation,
  })

  if(room_location.capacity_left==0){
    res.send("the office location you are trying to assign  is full")
}
else{

    id++;
      await hrmodel.save().then(doc => {
          res.send(doc);
         
      })
      .catch(err => {
      console.error(err)
      })
     newmember=true;
    }
  })
.get(async( req,res)=>{
     
    res.send("hr-"+id);
})

module.exports = router