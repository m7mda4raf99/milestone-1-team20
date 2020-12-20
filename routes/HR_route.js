const express = require('express')


const router = express.Router()

const room_location = require('../models/room_Location')    
const Academic_Member = require('../models/Academic_Member')
const Faculty = require('../models/Faculty')
const Department = require('../models/Department')
const course = require('../models/course')
const { blockList, get } = require('./staff_route')
const getX = require('./staff_route')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findOneAndRemove } = require('../models/room_Location')


require('dotenv').config()


const tokenVerification = (req,res,next) => {
   
    const token = req.headers.token
    if(token){
        if((blockList.filter((token)=>token === req.headers.token)).length === 0){
            try{
                const correctToken = jwt.verify(token, process.env.TOKEN_SECRET)
                    if(correctToken){
                        req.data = correctToken
                        next()
                    }else{
                        res.status(403).send('This token is incorrect')
                     }
                }
                catch(Exception){
                    res.status(403).send('This token is incorrect')
            
                }
        }
        else{
            res.status(401).send('Access denied')    
        }
    }
    else{
        res.status(403).send('Access denied. You need a token')
    }
}


/////////////////////////(ADD)room_location///////////////////////////////////

router.route('/HR/addRoom')
.post(tokenVerification,async(req,res)=>{
if(req.data.role !== "HR"){
    res.send("HR member is needed to add a room")
}else{
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
}
})

/////////////////////////(Update)room_location///////////////////////////////////

router.route('/HR/Room/:id')
.put(async( req,res)=>{
    const oldRoom = await room_location.find({id: req.params.id})

    var capacity = 0
    var type = ""

    if(req.body.capacity_left){
        capacity = req.body.capacity_left
    }else{
        capacity = oldRoom[0].capacity_left
    }
    if(req.body.type_of_Room){
        type = req.body.type_of_Room
    }else{
        type = oldRoom[0].type_of_Room
    }

    await room_location.findOneAndRemove({id: req.params.id})

    const newRoom = new room_location({
        id: req.params.id,
        capacity_left: capacity,
        type_of_Room: type
    })

    await newRoom.save()

    })

/////////////////////////(delete)room_location///////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////(add)Faculty///////////////////////////////////
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

/////////////////////////(delete)Faculty///////////////////////////////////
router.route('/HR/Faculty')
 .delete(async( req,res)=>{
    await  Faculty
    .findOneAndRemove({
    name: req.body.name
    })
    .then(response => {
    console.log(response)
    res.send(response)
    })
    .catch(err => {
    console.error(err)
    })
    var oldUsers = await Academic_Member.find({faculty_name : req.body.name})

    for(var i=0;i<oldUsers.length;i++){
        await Academic_Member.findOneAndRemove({faculty_name : req.body.name})
        .then(response => {}).catch(err => {console.error("Can't find users with same department")})
        
        const newUser = new Academic_Member({
        
            id: oldUsers[i].id,
            name: oldUsers[i].name,
            email: oldUsers[i].email,
            password: oldUsers[i].password,
            salary: oldUsers[i].salary,
            department_name : oldUsers[i].department_name,
            faculty_name: null,
            room_location_id:oldUsers[i].room_location_id
            //HOD: oldUsers[i].HOD,
           // role: oldUsers[i].role,
           // gender: oldUsers[i].gender,
           // courses_taught: oldUsers[i].courses_taught,
           // assign_slots: oldUsers[i].assign_slots,
            //schedule: oldUsers[i].schedule,
            


        })
        console.log(newUser)
        await newUser.save().then(doc => {
            res.send("jnkm");
        }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
        
    }
    
    })

/////////////////////////(update)Faculty///////////////////////////////////
router.route('/HR/Faculty/:name')
.put(async( req,res)=>{
  //  const oldRoom = await Faculty.find({name: req.params.name})
    await Faculty.findOneAndRemove({name: req.params.name})

    const newfaculty = new Faculty({
        name: req.body.name
    })
    await newfaculty.save()


 var olddepart = await Department.find({faculty_name : req.params.name})

    for(var i=0;i<olddepart.length;i++){
        await Department.findOneAndRemove({faculty_name : req.params.name})
        .then(response => {}).catch(err => {console.error("Can't find users with same department")})
        
        const newDepart = new Department({
        
            name : olddepart[i].name,
            faculty_name:req.body.name

        })
        console.log(newDepart)
        await newDepart.save().then(doc => {
            res.send("jnkm");
        }).then(response => {}).catch(err => {console.error("Can't save updated department to database")})
    }



    var oldUsers = await Academic_Member.find({faculty_name : req.params.name})

    for(var i=0;i<oldUsers.length;i++){
        await Academic_Member.findOneAndRemove({faculty_name : req.params.name})
        .then(response => {}).catch(err => {console.error("Can't find users with same department")})
        
        const newUser = new Academic_Member({
        
            id: oldUsers[i].id,
            name: oldUsers[i].name,
            email: oldUsers[i].email,
            password: oldUsers[i].password,
            salary: oldUsers[i].salary,
            department_name : oldUsers[i].department_name,
            faculty_name: req.body.name,
            room_location_id:oldUsers[i].room_location_id
            //HOD: oldUsers[i].HOD,
           // role: oldUsers[i].role,
           // gender: oldUsers[i].gender,
           // courses_taught: oldUsers[i].courses_taught,
           // assign_slots: oldUsers[i].assign_slots,
            //schedule: oldUsers[i].schedule,
            


        })
        console.log(newUser)
        await newUser.save().then(doc => {
            res.send("jnkm");
        }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
        
    }


    })

////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////(add)department///////////////////////////////////
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

/////////////////////////(update)department///////////////////////////////////

router.route('/HR/Department/:name')
.put(async( req,res)=>{

   const olddep= await Department.find({name:req.params.name})
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
    

    var oldUsers = await Academic_Member.find({department_name : req.params.name})
    //console.log("oldUsers" + oldUsers.length)


    for(var i=0;i<oldUsers.length;i++){
        await Academic_Member.findOneAndRemove({department_name : req.params.name})
        .then(response => {}).catch(err => {console.error("Can't find users with same department")})
        //console.log("ashrafff "+oldUsers[i])
        const newUser = new Academic_Member({
            id: oldUsers[i].id,
            name: oldUsers[i].name,
            email: oldUsers[i].email,
            password: oldUsers[i].password,
            salary: oldUsers[i].salary,
            department_name : req.body.name,
            faculty_name: oldUsers[i].faculty_name,
            room_location_id:oldUsers[i].room_location_id
           // HOD: oldUsers[i].HOD,
           // role: oldUsers[i].role,
           // gender: oldUsers[i].gender,
           // courses_taught: oldUsers[i].courses_taught,
           // assign_slots: oldUsers[i].assign_slots,
           // schedule: oldUsers[i].schedule,



        })
        await newUser.save().then(doc => {
            res.send("jnkm");
        }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
        
    }


    var oldcourse = await course.find({department_name : req.params.name})
    console.log(oldcourse)
    for(var i=0;i<oldcourse.length;i++){
        await course.findOneAndRemove({department_name : req.params.name})
        .then(response => {}).catch(err => {console.error("Can't find users with same department")})
        
        const newcourse = new course({
        
            id: oldcourse[i].id,
            name: oldcourse[i].name,
            department_name : req.body.name,
           // course_covarage: oldcourse[i].course_covarage,
            acedemic_coordinator_id:oldcourse[i].acedemic_coordinator_id
     

        })
        console.log(newcourse)
        await newcourse.save().then(doc => {
            res.send("jnkm");
        }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
        
    }




    })


/////////////////////////(delete)department///////////////////////////////////
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
    var oldUsers = await Academic_Member.find({department_name : req.params.name})

    for(var i=0;i<oldUsers.length;i++){
        await Academic_Member.findOneAndRemove({department_name : req.params.name})
        .then(response => {}).catch(err => {console.error("Can't find users with same department")})
        
        const newUser = new Academic_Member({
        
            id: oldUsers[i].id,
            name: oldUsers[i].name,
            email: oldUsers[i].email,
            password: oldUsers[i].password,
            salary: oldUsers[i].salary,
            department_name : null,
            faculty_name: oldUsers[i].faculty_name,
            room_location_id:oldUsers[i].room_location_id
            //HOD: oldUsers[i].HOD,
           // role: oldUsers[i].role,
           // gender: oldUsers[i].gender,
           // courses_taught: oldUsers[i].courses_taught,
           // assign_slots: oldUsers[i].assign_slots,
            //schedule: oldUsers[i].schedule,
            


        })
        console.log(newUser)
        await newUser.save().then(doc => {
            res.send("jnkm");
        }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
        
    }


    console.log("oldcourse")
    var oldcourse = await course.find({department_name : req.params.name})
    console.log(oldcourse)
    for(var i=0;i<oldcourse.length;i++){
        await course.findOneAndRemove({department_name : req.params.name})
        .then(response => {}).catch(err => {console.error("Can't find users with same department")})
        
        const newcourse = new course({
        
            id: oldcourse[i].id,
            name: oldcourse[i].name,
            department_name : null,
            course_covarage: oldcourse[i].course_covarage,
            acedemic_coordinator_id:oldcourse[i].acedemic_coordinator_id
     

        })
        console.log(newcourse)
        await newcourse.save().then(doc => {
            res.send("jnkm");
        }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
        
    }
  
  
  })

  
////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////(add)course///////////////////////////////////
router.route('/HR/course')
.post(async( req,res)=>{

  const coursemodel=  new course({
      id:req.body.id,
      name:req.body.name,
      department_name:req.body.department_name,
      course_covarage:req.body.course_covarage,
      acedemic_coordinator_id:req.body.acedemic_coordinator_id,
      
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

/////////////////////////(update)course///////////////////////////////////
router.route('/HR/course')
.put(async( req,res)=>{
    const oldcourse = await course.find({id: req.body.id})

    var course_covarage = 0
    var name = ""
    var acedemic_coordinator_id=""

    if(req.body.course_covarage){
        course_covarage = req.body.course_covarage
    }else{
        course_covarage = oldcourse[0].course_covarage
    }
    if(req.body.name){
        name = req.body.name
    }else{
        name = oldcourse[0].name
    }
    if(req.body. acedemic_coordinator_id){
        acedemic_coordinator_id = req.body. acedemic_coordinator_id
    }else{
        acedemic_coordinator_id = oldcourse[0]. acedemic_coordinator_id
    }

    await course.findOneAndRemove({id: req.body.id})

    const newcourse = new course({
        id: req.body.id,
        course_covarage: course_covarage,
        acedemic_coordinator_id: acedemic_coordinator_id,
        name:name,
        department_name:oldcourse[0].department_name
    })

    await newcourse.save()

    })


/////////////////////////(delete)course///////////////////////////////////

router.route('/HR/course')
.delete(async( req,res)=>{
    const oldcourse = await course.find({id: req.body.id})


    await course.findOneAndRemove({
        id: req.body.id
    })

    const coursemodel=  new course({
        id:req.body.id,
        name:oldcourse[0].name,
        department_name:null,
        course_covarage:oldcourse[0].course_covarage,
        acedemic_coordinator_id:oldcourse[0].acedemic_coordinator_id
        
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