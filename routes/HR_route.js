const express = require('express')


const router = express.Router()

const room_location = require('../models/room_Location')    
const Academic_Member = require('../models/Academic_Member')
const Faculty = require('../models/Faculty')
const Department = require('../models/Department')
const course = require('../models/course')
const Blocklist = require('../models/Blocklist')
const Info = require('../models/Info')
const HR = require('../models/hr')


const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { response } = require('express')

const Joi = require('@hapi/joi')
const Attendance = require('../models/Attendance')

var id = 0

const tokenVerification = async (req,res,next) => {
    const token = req.headers.token
    if(token){
           const blockList = await Blocklist.find({name: req.headers.token})
           if(blockList.length === 0){
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

/////////////////////////////////ADD ROOM LOCATION///////////////////////////////////

router.route('/HR/addRoom')
.post(tokenVerification,async(req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const room_locationmodel=  new room_location({
        id:req.body.id,
        type_of_Room:req.body.type_of_Room,
        capacity_left:req.body.capacity_left
    }
    )
        await room_locationmodel.save()
        .then(doc => {res.send(doc);})
        .catch(err => {console.error(err)})
    }
})

///////////////////////////////UPDATE ROOM LOCATION///////////////////////////////////

router.route('/HR/updateRoom/:id')
.put(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
    
    const oldRoom = await room_location.find({id: req.params.id})

    var id = ""
    var capacity = 0
    var type = ""

    if(req.body.id){
        id = req.body.id
    }else{
        id = oldRoom[0].id
    }  
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
    .then(doc => {res.send(doc)})
    .catch(err => {console.error(err)})
    }
    })

///////////////////////////////DELETE ROOM LOCATION///////////////////////////////////

router.route('/HR/deleteRoom/:id')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        await  room_location
        .findOneAndRemove({id: req.params.id})
        .then(response => {
            console.log(response)
            res.send("Deleted successfully!") })
        .catch(err => { console.error(err)})
    }
})


///////////////////////////////ADD FACULTY///////////////////////////////////

router.route('/HR/addFaculty')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        const facultymodel=  new Faculty({name:req.body.name})

        await facultymodel.save().then(doc => {res.send(doc)})
        .catch(err => {console.error(err)})
    }
})

///////////////////////////////DELETE FACULTY///////////////////////////////////

router.route('/HR/deleteFaculty')
 .delete(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        await  Faculty.findOneAndRemove({name: req.body.name})
        .then(response => {})
        .catch(err => {console.error(err)})

        const dep = await Department.find({faculty_name: req.body.name})

        await Department.findOneAndRemove({faculty_name: req.body.name})

        for(var i=0; i< dep.length;i++){
            const newDep = new Department({
                name: dep[i].name,
                faculty_name: null
            })

            await newDep.save()
            .then(response=>{})
            .catch(err=>{console.log(err)})
        }

       
        var oldUsers = await Academic_Member.find({faculty_name : req.body.name})

        for(var i=0;i<oldUsers.length;i++){
            await Academic_Member.findOneAndRemove({faculty_name : req.body.name})
            .then(response => {})
            .catch(err => {console.error("Can't find users with same department")})
            
            const newUser=  new Academic_Member({
                id:oldUsers[i].id,
                name : oldUsers[i].name, 
                email: oldUsers[i].email,
                password: oldUsers[i].password,
                salary:oldUsers[i].salary,
                department_name:oldUsers[i].department_name,
                faculty_name: null,
                room_location_id:oldUsers[i].room_location_id,
                HOD: oldUsers[i].HOD,
                Coordinator:oldUsers[i].Coordinator,
                role:oldUsers[i].role,
                gender:oldUsers[i].gender,
                courses_taught:oldUsers[i].courses_taught,
                assign_slots:oldUsers[i].assign_slots,
                schedule: oldUsers[i].schedule,
                Phone_Number:oldUsers[i].Phone_Number,
                annual_balance: oldUsers[i].annual_balance,
                accidental_balance: oldUsers[i].accidental_balance,
                Attendance:oldUsers[i].Attendance,
                isNewMember: oldUsers[i].isNewMember,
                Notification: oldUsers[i].Notification,
                putInVisa: oldUsers[i].putInVisa
            })
            console.log(newUser)
            await newUser.save().then(doc => {})
            .then(response => {})
            .catch(err => {console.error("Can't save updated user to database")})
            
        }
        res.send("faculty deleted successfully!")
    }
})

///////////////////////////////UPDATE FACULTY///////////////////////////////////

router.route('/HR/updateFaculty/:name')
.put(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
    //  const oldRoom = await Faculty.find({name: req.params.name})
        await Faculty.findOneAndRemove({name: req.params.name})

        const newfaculty = new Faculty({
            name: req.body.name
        })
        await newfaculty.save()
        .then(response => {})
        .catch(err => {console.log(err)})


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
            
            }).then(response => {}).catch(err => {console.error("Can't save updated department to database")})
        }



        var oldUsers = await Academic_Member.find({faculty_name : req.params.name})

        for(var i=0;i<oldUsers.length;i++){
            await Academic_Member.findOneAndRemove({faculty_name : req.params.name})
            .then(response => {}).catch(err => {console.error("Can't find users with same department")})
            
            const newUser=  new Academic_Member({
                id:oldUsers[i].id,
                name : oldUsers[i].name, 
                email: oldUsers[i].email,
                password: oldUsers[i].password,
                salary:oldUsers[i].salary,
                department_name:oldUsers[i].department_name,
                faculty_name:req.body.name,
                room_location_id:oldUsers[i].room_location_id,
                HOD: oldUsers[i].HOD,
                Coordinator:oldUsers[i].Coordinator,
                role:oldUsers[i].role,
                gender:oldUsers[i].gender,
                courses_taught:oldUsers[i].courses_taught,
                assign_slots:oldUsers[i].assign_slots,
                schedule: oldUsers[i].schedule,
                Phone_Number:oldUsers[i].Phone_Number,
                annual_balance: oldUsers[i].annual_balance,
                accidental_balance: oldUsers[i].accidental_balance,
                Attendance:oldUsers[i].Attendance,
                isNewMember: oldUsers[i].isNewMember,
                Notification: oldUsers[i].Notification,
                putInVisa: oldUsers[i].putInVisa

            })
            console.log(newUser)
            await newUser.save().then(doc => {
                res.send("Updated successfully!");
            }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
            
        }

        }
})

///////////////////////////////ADD DEPARTMENT///////////////////////////////////

router.route('/HR/addDepartment')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        const departmentmodel=  new Department({
            name:req.body.name,
            faculty_name:req.body.faculty_name
        })

    const exists= await Faculty.exists({name: req.body.faculty_name})
        if(exists){
            await departmentmodel.save().then(doc => {res.send(doc)})
            .catch(err => {console.error(err)})
        }
        else{
            res.status(404).send('faculty doesnot exist')
        }

    }
})

///////////////////////////////UPDATE DEPARTMENT///////////////////////////////////

router.route('/HR/updateDepartment/:name')
.put(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        const olddep= await Department.find({name:req.params.name})
            await Department.findOneAndRemove({
                name: req.params.name})
            .then(response => {})
            .catch(err => {console.error("Can't find this department and remove it")})

            const departmentmodel=  new Department({
                name:req.body.name,
                faculty_name:olddep[0].faculty_name
            })
            await departmentmodel.save()
            .then(doc => {res.send(doc)})
            .then(response => {})
            .catch(err => {console.error("Can't save new department to database")})
            
            var oldUsers = await Academic_Member.find({department_name : req.params.name})

            for(var i=0;i<oldUsers.length;i++){
                await Academic_Member.findOneAndRemove({department_name : req.params.name})
                .then(response => {})
                .catch(err => {console.error("Can't find users with same department")})
                
                const newUser=  new Academic_Member({
                    id:oldUsers[i].id,
                    name : oldUsers[i].name, 
                    email: oldUsers[i].email,
                    password: oldUsers[i].password,
                    salary:oldUsers[i].salary,
                    department_name:req.body.name,
                    faculty_name:oldUsers[i].faculty_name,
                    room_location_id:oldUsers[i].room_location_id,
                    HOD: oldUsers[i].HOD,
                    Coordinator:oldUsers[i].Coordinator,
                    role:oldUsers[i].role,
                    gender:oldUsers[i].gender,
                    courses_taught:oldUsers[i].courses_taught,
                    assign_slots:oldUsers[i].assign_slots,
                    schedule: oldUsers[i].schedule,
                    Phone_Number:oldUsers[i].Phone_Number,
                    annual_balance: oldUsers[i].annual_balance,
                    accidental_balance: oldUsers[i].accidental_balance,
                    Attendance:oldUsers[i].Attendance,
                    isNewMember: oldUsers[i].isNewMember,
                    Notification: oldUsers[i].Notification,
                    putInVisa: oldUsers[i].putInVisa

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
                    course_coverage: oldcourse[i].course_coverage,
                    academic_coordinator_id:oldcourse[i].academic_coordinator_id,
                    slots: oldcourse[i].academic_coordinator_id,
                    numberOfAssignedSlots: oldcourse[i].numberOfAssignedSlots,
                    numberOfUnassignedSlots: oldcourse[i].numberOfUnassignedSlots
            

                })
                console.log(newcourse)
                await newcourse.save().then(doc => {
                    res.send("jnkm");
                }).then(response => {}).catch(err => {console.error("Can't save updated user to database")})
                
            }



            }
})

///////////////////////////////DELETE DEPARTMENT///////////////////////////////////

router.route('/HR/deleteDepartment/:name')
.delete(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        const exists= await Department.exists({name: req.params.name})

        if(exists){
            await Department.findOneAndRemove({name: req.params.name})
            .then(response => {console.log(response)
                res.send(response)})
            .catch(err => {console.error(err)})
        
        }
        else{
            res.status(404).send('department doesnot exist')
        }
        var oldUsers = await Academic_Member.find({department_name : req.params.name})

        for(var i=0;i<oldUsers.length;i++){
            await Academic_Member.findOneAndRemove({department_name : req.params.name})
            .then(response => {}).catch(err => {console.error("Can't find users with same department")})
            
            
                const newUser=  new Academic_Member({
                    id:oldUsers[i].id,
                    name : oldUsers[i].name, 
                    email: oldUsers[i].email,
                    password: oldUsers[i].password,
                    salary:oldUsers[i].salary,
                    department_name:null,
                    faculty_name:oldUsers[i].faculty_name,
                    room_location_id:oldUsers[i].room_location_id,
                    HOD: oldUsers[i].HOD,
                    Coordinator:oldUsers[i].Coordinator,
                    role:oldUsers[i].role,
                    gender:oldUsers[i].gender,
                    courses_taught:oldUsers[i].courses_taught,
                    assign_slots:oldUsers[i].assign_slots,
                    schedule: oldUsers[i].schedule,
                    Phone_Number:oldUsers[i].Phone_Number,
                    annual_balance: oldUsers[i].annual_balance,
                    accidental_balance: oldUsers[i].accidental_balance,
                    Attendance:oldUsers[i].Attendance,
                    isNewMember: oldUsers[i].isNewMember,
                    Notification: oldUsers[i].Notification,
                    putInVisa: oldUsers[i].putInVisa

                })
            console.log(newUser)
            await newUser.save().then(doc => {})
            .then(response => {})
            .catch(err => {console.error("Can't save updated user to database")})
            
        }

        var oldcourse = await course.find({department_name : req.params.name})
        console.log(oldcourse)
        for(var i=0;i<oldcourse.length;i++){
            await course.findOneAndRemove({department_name : req.params.name})
            .then(response => {}).catch(err => {console.error("Can't find users with same department")})
            
            const newcourse = new course({
                id: oldcourse[i].id,
                name: oldcourse[i].name,
                department_name : null,
                course_coverage: oldcourse[i].course_coverage,
                academic_coordinator_id:oldcourse[i].academic_coordinator_id,
                slots: oldcourse[i].academic_coordinator_id,
                numberOfAssignedSlots: oldcourse[i].numberOfAssignedSlots,
                numberOfUnassignedSlots: oldcourse[i].numberOfUnassignedSlots
            })
            await newcourse.save()
            .then(doc => {res.send("department deleted successfully!")})
            .then(response => {})
            .catch(err => {console.error("Can't save updated user to database")})   
        }
    
    }
})


///////////////////////////////ADD COURSE///////////////////////////////////

router.route('/HR/addCourse')
.post(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
  const coursemodel=  new course({
      id:req.body.id,
      name:req.body.name,
      department_name:req.body.department_name,
      course_coverage:req.body.course_coverage,
      academic_coordinator_id:req.body.academic_coordinator_id,
      slots: req.body.academic_coordinator_id,

  })    

 const exists= await  Department.exists({name: req.body.department_name})
  if(exists){
      await coursemodel.save().then(doc => {res.send(doc)})
      .then(response => {console.log(response) 
        res.send(response)})
        .catch(err => {console.error(err)})
  }
  else{
      res.status(404).send('department doesnot exist')
  }
}
  })

///////////////////////////////UPDATE COURSE///////////////////////////////////

router.route('/HR/updateCourse')
.put(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        const oldcourse = await course.find({id: req.body.id})

        var course_coverage = 0
        var name = ""
        var academic_coordinator_id=""

        if(req.body.course_coverage){
            course_coverage = req.body.course_coverage
        }else{
            course_coverage = oldcourse[0].course_coverage
        }
        if(req.body.name){
            name = req.body.name
        }else{
            name = oldcourse[0].name
        }
        if(req.body. academic_coordinator_id){
            academic_coordinator_id = req.body. academic_coordinator_id
        }else{
            academic_coordinator_id = oldcourse[0]. academic_coordinator_id
        }

        await course.findOneAndRemove({id: req.body.id})

        const newcourse = new course({
            id: req.body.id,
            course_coverage: course_coverage,
            academic_coordinator_id: academic_coordinator_id,
            name:name,
            department_name:oldcourse[0].department_name,
            slots: oldcourse[0].academic_coordinator_id,
                numberOfAssignedSlots: oldcourse[0].numberOfAssignedSlots,
                numberOfUnassignedSlots: oldcourse[0].numberOfUnassignedSlots
        })

        await newcourse.save()
        .then(response => {res.send("course updated successfully!")})
        .catch(err => {console.log(err)})
        }
})


///////////////////////////////DELETE COURSE///////////////////////////////////

router.route('/HR/deleteCourse')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        const oldcourse = await course.find({id: req.body.id})

        await course.findOneAndRemove({id: req.body.id})

        const coursemodel=  new course({
            id:req.body.id,
            name:oldcourse[0].name,
            department_name:null,
            course_coverage:oldcourse[0].course_coverage,
            academic_coordinator_id:oldcourse[0].academic_coordinator_id,
            slots: oldcourse[0].academic_coordinator_id,
                numberOfAssignedSlots: oldcourse[0].numberOfAssignedSlots,
                numberOfUnassignedSlots: oldcourse[0].numberOfUnassignedSlots
            
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


        }
})


///////////////////////////////ADD ACADEMIC MEMBER///////////////////////////////////

router.route('/HR/addAcademicMember')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        var result7=""
    const schema=Joi.object({
    
    email:Joi.string().email().required() ,
    id:Joi.string().required(),
    name :Joi.string().min(3).max(30).required(),
    password: Joi.string(),
    salary:Joi.number().required(),
    department_name:Joi.string(),
    faculty_name:Joi.string(),
    room_location_id:Joi.string().required(),
    HOD: Joi.boolean(),
    Coordinator:Joi.boolean(),
    role:Joi.string().required(),
    gender:Joi.string(),
    courses_taught:Joi.string(),
    assign_slots:Joi.string(),
    schedule:Joi.string(),
    Phone_Number:Joi.string(),
    annual_balance:Joi.number(),
    accidental_balance:Joi.number(),
    isNewMember:Joi.boolean()
    })
    try{
    const validation = await schema.validateAsync(req.body)
    }
    catch(err){
        return res.send(
           // message:validation.error.details[0].message
           err.details[0].message
        )
    }
    // if(validation.error){
       
    // }


    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("123456",salt)

   

  const Academic_membermodel=  new Academic_Member({
    id:req.body.id,
    name : req.body.name, 
    email: req.body.email,
    password: hashedPassword,
    salary:req.body.salary,
    department_name:req.body.department_name,
    faculty_name:req.body.faculty_name,
    room_location_id:req.body.room_location_id,
    HOD: req.body.Hod,
    Coordinator:req.body.Coordinator,
    role:req.body.role,
    gender:req.body.gender,
    courses_taught:req.body.courses_taught,
    assign_slots:req.body.assign_slots,
    schedule: req.body.schedule,
    Phone_Number:req.body.Phone_Number,
     Attendance:{
        dayOff:"Saturday",
         signIn:undefined,
         signOut:undefined,
         spentHoursPerMonth:undefined,
        missingDays:undefined,
         missingHours:undefined,
         missingMinutes:undefined
     },
     annual_balance:req.body.annual_balance,
     accidental_balance:req.body.accidental_balance,
     isNewMember:req.body.isNewMember,
     Notification:req.body.Notification
   

  })

  const RoomLoc=await room_location.find({
      id:req.body.room_location_id})
 if(!req.body.id){
     res.send("the id is required");
 }
 else{
const  check_id=await Academic_Member.find({
id:req.body.id})
const  check_email=await Academic_Member.find({
    email:req.body.email})
    
    if(!req.body.department_name)
    res.send("you must enter the department")
    if(!req.body.faculty_name)
    res.send("you must enter the faculty")
    if(!req.body.role || (req.body.role!=="TA" && req.body.role!=="Instructor"))
    res.send("the role must be either TA or Inst or either the role is not entered")

    if(RoomLoc.length === 0){
        res.send("the room location you are trying to assign doesnot exist")
    }
   else if(RoomLoc[0].capacity_left === 0){
       res.send("the office location you are trying to assign  is full")
   }
   else if(RoomLoc[0].type_of_Room !== "office"){
       console.log(RoomLoc[0].type_of_Room)
    res.send("this room is not of type office ")
   }
   else if(check_id.length !== 0){
    res.send("this id is used before")
   }
   else if(check_email.length !== 0){
    res.send("this email is used before")
   }
   else{
    RoomLoc[0].capacity_left--,
    id++

   

   await Academic_membermodel.save().then(doc => {
       result7+=doc+"\n";
      
   })
   .catch(err => {
     RoomLoc[0].capacity_left++;
     id--;
   console.error(err)
  
   })

   await room_location.findOneAndRemove({
    id:req.body.room_location_id
})
const newRoom = new room_location({
    id: req.body.room_location_id,
    capacity_left: RoomLoc[0].capacity_left,
    type_of_Room: RoomLoc[0].type_of_Room
})


  await newRoom.save().then(doc => {
    result7+=doc+"\n";
   
})
.catch(err => {
console.error(err)

})
const inforecord=await Info.find()
if(inforecord.length===0){
    const newinfo=new Info({})
    await newinfo.save().then(doc => {
        result7+=doc;
       
    })
    .catch(err => {
    console.error(err)
})
}
else{
    const inforecord77=await Info.find()
    inforecord77[0].id_academic++
    const newinfo=new Info({
        id_hr:inforecord77[0].id_hr,
        id_academic:inforecord77[0].id_academic,
        id_request:inforecord77[0].id_request
    })
    await Info.findOneAndRemove({id_hr:inforecord77[0].id_hr})

    await newinfo.save().then(doc => {
        result7+=doc;
       
    })
    .catch(err => {
    console.error(err)
})


}
id++


res.send(result7)

  }
}
    }
  })

  /// automatic id
.get(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        var result7 
        const info=await Info.find()
        if(info.length===0){
            const newinfo=new Info({})
            await newinfo.save().then(doc => {
                result7+=doc;
               
            })
            .catch(err => {
            console.error(err)
        })

        res.send("ac-"+ newinfo.id_academic);

        }else{
            res.send("ac-"+ info[info.length-1].id_academic);
        }


    }
})

///////////////////////////////DELETE ACADEMIC MEMBER///////////////////////////////////

router.route('/HR/deleteAcademicMember/:id')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        var result7=""
        const schema=Joi.object({id:Joi.string().required()})
        
        try{
        const validation = await schema.validateAsync(req.params)
        }
        catch(err){
            return res.send(
               // message:validation.error.details[0].message
               err.details[0].message
            )
        }

    const  academic=await Academic_Member.find({
        id:req.params.id})  
        if(academic.length===0){
            return res.send("this id doesn't exist")
        }          

        const RoomLoc=await room_location.find({
            id:academic[0].room_location_id})
    
        RoomLoc[0].capacity_left++

    await Academic_Member.findOneAndRemove({
        id: req.params.id
    })

        .then(response => {console.log(response)
            result7+=response+"\n"})
        .catch(err => { RoomLoc[0].capacity_left--
            console.error(err) })

           await room_location.findOneAndRemove({
                    id:academic[0].room_location_id
                })
                

                const newRoom = new room_location({
                    id: academic[0].room_location_id,
                    capacity_left: RoomLoc[0].capacity_left,
                    type_of_Room: RoomLoc[0].type_of_Room
                })
                
                await newRoom.save().then(doc => {
                   // res.send(doc);
                   result7+=doc
                   
                })
                .catch(err => {
                console.error(err)
                })
                res.send(result7);

    }
}
  )

///////////////////////////////UPDATE ACADEMIC MEMBER///////////////////////////////////

router.route('/HR/updateAcademicMember/:id')
.put(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        var result7=""
    
    const record= await Academic_Member.find({id: req.params.id});
    if(record===0){
        return res.send("this id doesn't exist")
    }    
    
    await Academic_Member.findOneAndRemove({id: req.params.id})

    var id, name, email, password, salary, department_name, faculty_name, room_location_id, HOD, Coordinator,
    role, gender, courses_taught, assign_slots, schedule, Phone_Number, Attendance, Notification, putInVisa

    

    if(req.body.id){
        id = req.body.id
    }else{
        id = record[0].id
    }
    
    if(req.body.name){
        name = req.body.name
    }else{
        name = record[0].name
    }

    if(req.body.email){
        email = req.body.email
    }else{
        email = record[0].email
    }

    if(req.body.salary){
        salary = req.body.salary
    }else{
        salary = record[0].salary
    }

    if(req.body.department_name){
        department_name = req.body.department_name
    }else{
        department_name = record[0].department_name
    }

    if(req.body.faculty_name){
        faculty_name = req.body.faculty_name
    }else{
        faculty_name = record[0].faculty_name
    }

    if(req.body.room_location_id){
        room_location_id = req.body.room_location_id
        const RoomLoc=await room_location.find({
            id:room_location_id
        })
       
         RoomLoc[0].capacity_left--;
        const newRoom = new room_location({
            id: room_location_id,
            capacity_left: RoomLoc[0].capacity_left,
            type_of_Room: RoomLoc[0].type_of_Room
        })
        await room_Location.findOneAndRemove({
            id:room_location_id
        })
        
        
        await newRoom.save().then(doc => {
           // res.send(doc);
           
        })
        .catch(err => {
        console.error(err)
        })

        const RoomLoc1=await room_location.find({
            id:record[0].room_location_id
        })
        
         RoomLoc1[0].capacity_left++;
        const newRoom1 = new room_location({
            id: record[0].room_location_id,
            capacity_left: RoomLoc1[0].capacity_left,
            type_of_Room: RoomLoc1[0].type_of_Room
        })
        await room_Location.findOneAndRemove({
            id:record[0].room_location_id
        })
        
        
        await newRoom1.save().then(doc => {
           // res.send(doc);
            result7+=doc+"\n"
        })
        .catch(err => {
        console.error(err)
        })


    }else{
        room_location_id = record[0].room_location_id
    }

    if(req.body.HOD){
        HOD = req.body.HOD
    }else{
        HOD = record[0].HOD
    }

    if(req.body.Coordinator){
        Coordinator = req.body.Coordinator
    }else{
        Coordinator = record[0].Coordinator
    }

    if(req.body.role){
        role = req.body.role
    }else{
        role = record[0].role
    }

    if(req.body.gender){
        gender = req.body.gender
    }else{
        gender = record[0].gender
    }

    if(req.body.courses_taught){
        courses_taught = req.body.courses_taught
    }else{
        courses_taught = record[0].courses_taught
    }

    if(req.body.assign_slots){
        assign_slots = req.body.assign_slots
    }else{
        assign_slots = record[0].assign_slots
    }

    if(req.body.schedule){
        schedule = req.body.schedule
    }else{
        schedule = record[0].schedule
    }

    if(req.body.Phone_Number){
        Phone_Number = req.body.Phone_Number
    }else{
        Phone_Number = record[0].Phone_Number
    }

    if(req.body.Attendance){
        Attendance = req.body.Attendance
    }else{
        Attendance = record[0].Attendance
    }
    if(req.body.annual_balance){
        annual_balance = req.body.annual_balance
    }else{
        annual_balance= record[0].annual_balance
    }
    if(req.body.accidental_balance){
        accidental_balance = req.body.accidental_balance
    }else{
        accidental_balance = record[0].accidental_balance
    }
    if(req.body.isNewMember){
        isNewMember = req.body.isNewMember
    }else{
        isNewMember = record[0].isNewMember
    }
    if(req.body.Notification){
        Notification = req.body.Notification
    }else{
        Notification = record[0].Notification
    }
    if(req.body.putInVisa){
        putInVisa = req.body.putInVisa
    }else{
        putInVisa = record[0].putInVisa
    }

    if(req.body.password){
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        password = hashedPassword
    }else{
        password = record[0].password
    }

    const Academicmodel=  new Academic_Member({
                id:id,
                name : name, 
                email: email,
                password: password,
                salary: salary,
                department_name: department_name,
                faculty_name: faculty_name,
                room_location_id: room_location_id,
                HOD: HOD,
                Coordinator: Coordinator,
                role: role,
                gender: gender,
                courses_taught: courses_taught,
                assign_slots: assign_slots,
                schedule: schedule,
                Phone_Number: Phone_Number,
                Attendance: Attendance,
                annual_balance:annual_balance,
                accidental_balance:accidental_balance,
                isNewMember:isNewMember,
                Notification:Notification,
                putInVisa: putInVisa

    })

    await Academicmodel.save().then(doc => {
       // res.send(doc);
       result7+=doc+"\n"
    })
    .catch(err => {
    console.error(err)
    })
  //  res.send(Academicmodel)
  res.send(result7);
    }
})

///////////////////////////////////ADD HR MEMBER/////////////////////////////////////////

router.route('/HR/addHRMember')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        const att = new Attendance({
            dayOff: "Saturday"
        })

        const salt = await bcrypt.genSalt(10)
         const hashedPassword = await bcrypt.hash("123456",salt)

        const HR_model=  new hr({
            id:req.body.id,
            name : req.body.name, 
            email: req.body.email,
            password: hashedPassword,
            salary:req.body.salary,
            room_location_id:req.body.room_location_id,
            role:req.body.role,
            gender:req.body.gender,
            Phone_Number:req.body.Phone_Number,
            isNewMember:req.body.isNewMember,
            Attendance: att
           
        
          })
        
          const RoomLoc=await room_location.find({
              id:req.body.room_location_id})
        
        const  check_id=await hr.find({
        id:req.body.id})
        const  check_email=await hr.find({
            email:req.body.email})
        
        
            if(RoomLoc.length === 0){
                res.send("the room location you are trying to assign doesnot exist")
            }
           else if(RoomLoc[0].capacity_left === 0){
               res.send("the office location you are trying to assign  is full")
           }
           else if(RoomLoc[0].type_of_Room !== "office"){
               console.log(RoomLoc[0].type_of_Room)
            res.send("this room is not of type office ")
           }
           else if(check_id.length !== 0){
            res.send("this id is used before")
           }
           else if(check_email.length !== 0){
            res.send("this email is used before")
           }
           else{
            RoomLoc[0].capacity_left--,
            id++
        
           
        
           await HR_model.save().then(doc => {
               res.send(doc);
              
           })
           .catch(err => {
             RoomLoc[0].capacity_left++;
             id--;
           console.error(err)
          
           })
        
           await room_location.findOneAndRemove({
            id:req.body.room_location_id
        })
        const newRoom = new room_location({
            id: req.body.room_location_id,
            capacity_left: RoomLoc[0].capacity_left,
            type_of_Room: RoomLoc[0].type_of_Room
        })
        
        await newRoom.save().then(doc => {
            res.send(doc);
           
        })
        .catch(err => {
        console.error(err)
        })
          }
          
          const inforecord=await Info.find()
    if(inforecord.length===0){
        const newinfo=new Info({})
        await newinfo.save().then(doc => {
            result7+=doc;
           
        })
        .catch(err => {
        console.error(err)
    })
    }
    else{
        const inforecord77=await Info.find()
        inforecord77[0].id_hr++
        const newinfo=new Info({
            id_hr:inforecord77[0].id_hr,
            id_academic:inforecord77[0].id_academic,
            id_request:inforecord77[0].id_request
        })
        Info.findOneAndRemove({id_hr:inforecord77[0].id_academic})
    
        await newinfo.save().then(doc => {
            result7+=doc;
           
        })
        .catch(err => {
        console.error(err)
    })
    
    
    }
    
    }
})
.get(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
        var result7 
        const info=await Info.find()
        if(info.length===0){
            const newinfo=new Info({})
            await newinfo.save().then(doc => {
                result7+=doc;
               
            })
            .catch(err => {
            console.error(err)
        })

        res.send("hr-"+ newinfo.id_academic);

        }else{
            res.send("hr-"+ info[info.length-1].id_hr);
        }

    }
})


////////////////////////////////////DELETE HR MEMBER/////////////////////////////////////////

router.route('/HR/deleteHRMember/:id')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const  HR=await HR.find({
        id:req.params.id})            

        const RoomLoc=await room_location.find({
            id:HR[0].room_location_id})

        RoomLoc[0].capacity_left++

    await HR.findOneAndRemove({
        id: req.params.id
    })
        .then(response => {
            
            console.log(response)
            res.send(response)
            })
            .catch(err => {
                RoomLoc[0].capacity_left--
            console.error(err)
            })

                await room_location.findOneAndRemove({
                    id:HR[0].room_location_id
                })
                const newRoom = new room_location({
                    id: RoomLoc[0].room_location_id,
                    capacity_left: RoomLoc[0].capacity_left,
                    type_of_Room: RoomLoc[0].type_of_Room
                })
                
                await newRoom.save().then(doc => {
                    res.send(doc);
                   
                })
                .catch(err => {
                console.error(err)
                })

    }   
}
  )


//////////////////////////////////////UPDATE HR MEMBER/////////////////////////////////////////

router.route('/HR/update_hr_member/:id')
.put(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        const record= await HR.find({id: req.params.id});
        
        await HR.findOneAndRemove({id: req.params.id})
    
        var id, name, email, password, salary,room_location_id,
        role, gender, Phone_Number,isNewMember
    
        if(req.body.id){
            id = req.body.id
        }else{
            id = record[0].id
        }
        
        if(req.body.name){
            name = req.body.name
        }else{
            name = record[0].name
        }
    
        if(req.body.email){
            email = req.body.email
        }else{
            email = record[0].email
        }
    
        if(req.body.salary){
            salary = req.body.salary
        }else{
            salary = record[0].salary
        }
    
        if(req.body.room_location_id){
            room_location_id = req.body.room_location_id
            const RoomLoc=await room_location.find({
                id:room_location_id
            })
           
             RoomLoc[0].capacity_left--;
            const newRoom = new room_location({
                id: room_location_id,
                capacity_left: RoomLoc[0].capacity_left,
                type_of_Room: RoomLoc[0].type_of_Room
            })
            await room_Location.findOneAndRemove({
                id:room_location_id
            })
            
            
            await newRoom.save().then(doc => {
                res.send(doc);
               
            })
            .catch(err => {
            console.error(err)
            })
    
            const RoomLoc1=await room_location.find({
                id:record[0].room_location_id
            })
            
             RoomLoc1[0].capacity_left++;
            const newRoom1 = new room_location({
                id: record[0].room_location_id,
                capacity_left: RoomLoc1[0].capacity_left,
                type_of_Room: RoomLoc1[0].type_of_Room
            })
            await room_Location.findOneAndRemove({
                id:record[0].room_location_id
            })
            
            
            await newRoom1.save().then(doc => {
                res.send(doc);
               
            })
            .catch(err => {
            console.error(err)
            })
    
    
        }else{
            room_location_id = record[0].room_location_id
        }
    
        if(req.body.role){
            role = req.body.role
        }else{
            role = record[0].role
        }
    
        if(req.body.gender){
            gender = req.body.gender
        }else{
            gender = record[0].gender
        }
    
        if(req.body.Phone_Number){
            Phone_Number = req.body.Phone_Number
        }else{
            Phone_Number = record[0].Phone_Number
        }
        
        if(req.body.isNewMember){
            isNewMember = req.body.isNewMember
        }else{
            isNewMember = record[0].isNewMember
        }
      
    
        const hr_rmodel=  new HR({
                    id:id,
                    name : name,
                    email: email,
                    password: password,
                    salary: salary,
                    room_location_id: room_location_id,
                    role: role,
                    gender: gender,
                    Phone_Number: Phone_Number,
                    isNewMember:isNewMember
        })
    
        await hr_model.save()
        .then(response => {res.send(hr_model)})
        .catch(err => {console.log(err)})
        
    }
    else{
        res.send("Access denied! You must be a HR member!")
    }

})

///////////////////////////////MANUALLY ADD A MISSING SIGNIN/SIGNOUT/////////////////////////////////////////


////////////////////////////////////VIEW ATTENDANCE/////////////////////////////////////////

router.route('/HR/viewAttendance/:id')
.get(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const academicmember= await Academic_Member.find({id:req.params.id})
    //if(academicmember.length !== 0){
    res.send(academicmember[0].Attendance)
}
    })

//////////////////////////////////VIEW MISSING HOURS/DAYS/////////////////////////////////////////

router.route('/HR/viewAttendanceMissingHoursDays')
.get(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() !== "hr"){
        res.send("Access denied! You must be a HR member!")
    }else{
    var i=0;
    var result = []
    var object 

    const users = await HR.find()
    for(var i=0; i<users.length;i++){
        if(users[i].Attendance.missingDays >= 0 || 
            (users[i].Attendance.missingHours+(users[i].Attendance.missingMinutes/60)) >= 0){
                object = {"id": users[i].id, "missingDays" : users[i].Attendance.missingDays,
            "missingHours": (users[i].Attendance.missingHours+(users[i].Attendance.missingMinutes/60))}
            }
            result.push(object)
    }
    const users1 = await Academic_Member.find()

    for(var i=0; i<users1.length;i++){
        if(users1[i].Attendance.missingDays !== 0 || 
            (users1[i].Attendance.missingHours+(users1[i].Attendance.missingMinutes/60)) !== 0){
                object = {"id": users1[i].id, "missingDays" : users1[i].Attendance.missingDays,
            "missingHours": (users1[i].Attendance.missingHours+(users1[i].Attendance.missingMinutes/60))}
            
            result.push(object)
            }
        }
         res.send(result)
        }
        })   

//////////////////////////////////////UPDATE SALARY/////////////////////////////////////////

router.route('/HR/updateAcademicmemberSalary')
    .put(tokenVerification, async( req,res)=>{
        if(req.data.role.toLowerCase() !== "hr"){
            res.send("Access denied! You must be a HR member!")
        }
        else{
            var academic =await Academic_Member.find({id:req.body.id})
        if(academic.length===0){
            return res.send("this id doesn't exist")
        }
        academic[0].salary=req.body.salary
        const academic77=new Academic_Member({
            id:academic[0].id,
                name : academic[0].name, 
                email: academic[0].email,
                password: academic[0].password,
                salary: academic[0].salary,
                department_name:academic[0].department_name,
                faculty_name: academic[0].faculty_name,
                room_location_id: academic[0].room_location_id,
                HOD: academic[0].HOD,
                Coordinator: academic[0].Coordinator,
                role: academic[0].role,
                gender: academic[0].gender,
                courses_taught: academic[0].courses_taught,
                assign_slots: academic[0].assign_slots,
                schedule: academic[0].schedule,
                Phone_Number: academic[0].Phone_Number,
                Attendance: academic[0].Attendance,
                annual_balance:academic[0].annual_balance,
                accidental_balance:academic[0].accidental_balance,
                isNewMember:academic[0].isNewMember,
                Notification:academic[0].Notification,
                putInVisa:academic[0].putInVisa

          
        })
        await Academic_Member.findOneAndRemove({id:req.body.id})
        //  console.log(academic[0].salary)
        await academic77.save().then(doc => {
             res.send(doc);
         })
         .catch(err => {
         console.error(err)
         })
     
        }

   })



module.exports = router