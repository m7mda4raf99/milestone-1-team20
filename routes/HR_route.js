const express = require('express')


const router = express.Router()

const room_location = require('../models/room_Location')    
const Academic_Member = require('../models/Academic_Member')
const Faculty = require('../models/Faculty')
const Department = require('../models/Department')
const course = require('../models/course')
const Blocklist = require('../models/Blocklist')
const Attendance = require('../models/Attendance')

//const { blockList, get } = require('./staff_route')
//const getX = require('./staff_route')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findOneAndRemove } = require('../models/room_Location')
var id = 1
var newmember=false;


require('dotenv').config()


const tokenVerification = async (req,res,next) => {
    const token = req.headers.token
    console.log("ashraf: " + token)
    if(token){
       // if((blockList.filter((token)=>token === req.headers.token)).length === 0){
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

/////////////////////////(ADD)room_location///////////////////////////////////

router.route('/HR/addRoom')
.post(tokenVerification,async(req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
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

router.route('/HR/updateRoom/:id')
.put(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
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
    }
    })

/////////////////////////(delete)room_location///////////////////////////////////
router.route('/HR/deleteRoom/:id')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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
}
})

////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////(add)Faculty///////////////////////////////////
router.route('/HR/addFaculty')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
        const facultymodel=  new Faculty({
            name:req.body.name
        })

        await facultymodel.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
    }
})

/////////////////////////(delete)Faculty///////////////////////////////////
router.route('/HR/deleteFaculty')
 .delete(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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
    }
})

/////////////////////////(update)Faculty///////////////////////////////////
router.route('/HR/updateFaculty/:name')
.put(tokenVerification, async(req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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

        }
})



/////////////////////////(add)department///////////////////////////////////
router.route('/HR/addDepartment')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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

    }
})

/////////////////////////(update)department///////////////////////////////////

router.route('/HR/updateDepartment/:name')
.put(async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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



            }
    })


/////////////////////////(delete)department///////////////////////////////////
router.route('/HR/deleteDepartment/:name')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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
    
    }
})

  
////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////(add)course///////////////////////////////////
router.route('/HR/addCourse')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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
}
  })

/////////////////////////(update)course///////////////////////////////////
router.route('/HR/updateCourse')
.put(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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
        }
})


/////////////////////////(delete)course///////////////////////////////////

router.route('/HR/deleteCourse')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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


        }
})


/////////////////////////(add)HR Member///////////////////////////////////

router.route('/HR/addHrMember')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
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
        }
})
.get(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
        res.send("hr-"+id);
    }
})

/////////////////////////////////ACADEMIC MEMBER/////////////////////////////
//add academic member
router.route('/HR/add_Academic_Member')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
        //hashing default password = 123456
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
            }
        

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
        }
    }
  })

  /// automatic id
.get(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
         res.send("ac-"+id);
    }
})

//delete academic member
router.route('/HR/delete_Academic_Member/:id')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const  academic=await Academic_Member.find({
        id:req.params.id})            

        const RoomLoc=await room_location.find({
            id:academic[0].room_location_id})

        RoomLoc[0].capacity_left++

    await Academic_Member.findOneAndRemove({
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
                    id:academic[0].room_location_id
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

router.route('/HR/update_academic_members/:id')
.put(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const record= await Academic_Member.find({id: req.params.id});
    
    await Academic_Member.findOneAndRemove({id: req.params.id})

    var id, name, email, password, salary, department_name, faculty_name, room_location_id, HOD, Coordinator,
    role, gender, courses_taught, assign_slots, schedule, Phone_Number, Attendance

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
                Attendance: Attendance
    })

    await Academicmodel.save()
    res.send(Academicmodel)
}
})


//delete hr member
router.route('/HR/delete_hr_Member/:id')
.delete(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
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

/// add hr member
router.route('/HR/add_Hr_Member')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const HR_model=  new hr({
        id:req.body.id,
        name : req.body.name, 
        email: req.body.email,
        password: req.body.password,
        salary:req.body.salary,
        room_location_id:req.body.room_location_id,
        role: "HR",
        gender:req.body.gender,
        Phone_Number:req.body.Phone_Number,
       
       
    
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
    }
})
.get(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
         res.send("hr-"+id);
    }
})


////update HR
router.route('/HR/update_hr_member/:id')
.put(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const record= await HR.find({id: req.params.id});
        
        await HR.findOneAndRemove({id: req.params.id})
    
        var id, name, email, password, salary,room_location_id,
        role, gender, Phone_Number
    
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
        })
    
        await hr_model.save()
        res.send(hr_model)
    }
    })

router.route('/HR/Attendance/:id')
.get(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const academicmember= await HR.find({id:req.params.id})
    var i=0;
    res.send(academicmember[0].Attendance)

   //  await res.send(HR.Attendance)
}
    })


router.route('/HR/Attendance_missinghoursdays')
.get(tokenVerification, async( req,res)=>{
    if(req.data.role !== "HR"){
        res.send("Access denied! You must be a HR member!")
    }else{
    const users = await HR.find()
var i=0;
var result = ""
while(i<users.length){
    if(users[i].Attendance){
    result += ("Staff ID: "+users[i].id+", Missed Hours: "+users[i].Attendance.missingHours+", Missed Days: "+users[i].Attendance.missingDays) + "\n"

    }
i++
}
res.send(result)
    }
    })   




module.exports = router