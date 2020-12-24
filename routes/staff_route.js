const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Academic_Member = require('../models/Academic_Member')
const HR = require('../models/hr')
const Course = require('../models/course')
const Slot = require('../models/slot')
const Blocklist = require('../models/Blocklist')
const room_location = require('../models/room_Location')
const Attendance =require('../models/Attendance')

//var blockList = []
var signIn
var signOut
var name = "ashraf"
var dateOfToday = ""
var days =["sunday","monday","tuesday","wednesday","thursday","friday"]

const tokenVerification = async (req,res,next) => {
      const token = req.headers.token
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

// var flag = true
// var oldHour = new Date().getHours()    

// var intervalID = setInterval(function(){
//         var date = new Date()
    
//         console.log("oldHour: " + oldHour)
//         console.log("date: " + date.getHours())

//         if(oldHour !== date.getHours()){
//             oldHour = date.getHours()
//             flag = true
//         }
//         if(date.getHours() === 19 && flag){
//             console.log("hesham")
//             flag = false
//         }
// }, 1000);

var flag = true

var intervalID = setInterval(function(){
    var oldHour = new Date().getHours()    
        var date = new Date()
        if(oldHour !== date.getHours()){
            oldHour = date.getHours()
            flag = true
        }
        if(date.getHours() === 19 && flag){
            everyDay()
            flag = false
        }

}, 1000)

async function everyDay(){
    dateOfToday = new Date(Date.now())

    const academicrocords = await Academic_Member.find()
    for(var i=0;i<academicrocords.length;i++){
        //member forgets to signOUT
        if(academicrocords[i].Attendance.SignedIn===1){
            academicrocords[i].Attendance.signOut.push(academicrocords[i].Attendance.signIn)
            academicrocords[i].Attendance.SignedIn=0
        }

        //if today is the dayOff of the member 'i'
        
        if(academicrocords[i].Attendance.dayOff.toLowerCase() === days[dateOfToday.getDay()]){
           
            for(var j = 0;j<academicrocords[i].Attendance.signIn.length;j++){
                
                var hours = Math.floor( academicrocords[i].Attendance.signOut[j]-academicrocords[i].Attendance.signIn[j]/1000/60/60)
                var minutes=academicrocords[i].Attendance.signOut[j]-academicrocords[i].Attendance.signIn[j]/1000/60-(Math.floor( academicrocords[i].Attendance.signOut[j]-academicrocords[i].Attendance.signIn[j]/1000/60/60)*60)
                var total_hours_minutes=hours+minutes/60
               
                if (dateOfToday.toISOString().slice(0,10)===
                      academicrocords[i].Attendance.signIn[j].toISOString().slice(0,10)){
                    academicrocords[i].Attendance.acceptedMissingHours -= hours
                    academicrocords[i].Attendance.acceptedMissingMinutes -= minutes
                    academicrocords[i].Attendance.spentHoursPerMonth[j] += total_hours_minutes 
                }


            }
      }else{
          if(hours===0&&minutes===0){
            academicrocords[i].Attendance.missingDays[j]+=1
          }
          else if(total_hours_minutes<7.4){
              if(minutes < 24){
                academicrocords[i].Attendance.missingHours[j]= 8 - hours
                academicrocords[i].Attendance.missingMinutes[j] = 24 - minutes
              }else{
                academicrocords[i].Attendance.missingHours[j]= 8 - hours - 1
                academicrocords[i].Attendance.missingMinutes[j] = minutes - 24
              }

          }else if (7.4 <= total_hours_minutes && 8.4 >= total_hours_minutes){

          }else{

          }

        }

        
    }
}

//routes
///////////////////////////////////////////////LOGIN////////////////////////////////////////////
router.route('/staff/userLogin')
.post(async(req,res)=>{
    const AcademicUser = await Academic_Member.find({email: req.body.email})
    
    if(AcademicUser.length !== 0){
        const correctPassword = await bcrypt.compare(req.body.password,AcademicUser[0].password)

        if(correctPassword){
            const token= jwt.sign({id: AcademicUser[0].id, role: AcademicUser[0].role, HOD: AcademicUser[0].HOD, 
                Coordinator: AcademicUser[0].Coordinator},process.env.TOKEN_SECRET)  
                        res.header('token', token).send('You logged in successfully!')
        }else{
            res.send("Incorrect password!")
        }
    }

    else{
        const HRUser = await HR.find({email: req.body.email})
        if(HRUser.length !== 0){
            const correctPassword = await bcrypt.compare(req.body.password,HRUser[0].password)

            if(correctPassword){
                const token= jwt.sign({id: HRUser[0].id , role: HRUser[0].role},process.env.TOKEN_SECRET)
                            res.header('token', token).send('You logged in successfully!')
            }else{
                res.send("Incorrect password!")
            }
        }else{
            res.status(401).send('Incorrect email!')
        }
    }
   
})

///////////////////////////////////////////////LOGOUT////////////////////////////////////////////
router.route('/staff/logout')
.post(async(req,res)=>{
    //console.log(blockList)
    //if((blockList.filter((token)=>token === req.headers.token)).length !== 0){
        const blockList = await Blocklist.find({name: req.headers.token})
    if(blockList.length !==0 ){
        res.send('You are already logged out')
    }
    else{
      

        //blockList.push(req.headers.token)
        const newBlockcontent = new Blocklist({
            name: req.headers.token
        })
        await newBlockcontent.save()
        
        res.send('You logged out successfully')
    }
})

///////////////////////////////////////////////VIEW PROFILE////////////////////////////////////////////
router.route('/staff/viewProfile')
.get(tokenVerification,async(req,res)=>{
    const AcademicUser = await Academic_Member.find({id: req.data.id})
    if(AcademicUser.length !== 0){
        var ScheduleResult = ""
        if(AcademicUser[0].schedule){
            for(var i=0;i<AcademicUser[0].schedule.length;i++){
                ScheduleResult += "Course ID: "+(AcademicUser[0].schedule[0].course_id) + ", " +
                "Day: " +(AcademicUser[0].schedule[0].day) + ", " +
                "Slot: " +    (AcademicUser[0].schedule[0].which_slot + "th") + ", " +
                "Room Location: " +          (AcademicUser[0].schedule[0].room_location_id) + "\n"

            }
        }
        var AttendanceResult = "Attendance: \n"
        if(AcademicUser[0].Attendance){
            AttendanceResult += 
            "Dayoff: " + AcademicUser[0].Attendance.dayOff + "\n" +
            "Sign In: " + AcademicUser[0].Attendance.signIn + "\n" + 
            "Sign Out: " + AcademicUser[0].Attendance.dayOff + "\n" +   
             "Dayoff: " + AcademicUser[0].Attendance.dayOff + "\n" +
            "Spent Hours per Month: " + AcademicUser[0].Attendance.spentHoursPerMonth + "\n" +  
            "Missed Days: " + AcademicUser[0].Attendance.missingDays + "\n" +  
            "Missed Hours: " + AcademicUser[0].Attendance.missingHours + "\n" +
            "Missed minutes: " + AcademicUser[0].Attendance.missingMinutes + "\n" 

             }

        res.send("ID: " + AcademicUser[0].id + "\n"+
                 "Name: " + AcademicUser[0].name + "\n" +
                 "Password: " + AcademicUser[0].password + "\n"+
                 "Phone Number: " + AcademicUser[0].Phone_Number + "\n" +
                 "Salary: " + AcademicUser[0].salary + "\n"+
                 "Department: " + AcademicUser[0].department_name + "\n"+
                 "Faculty: " + AcademicUser[0].faculty_name + "\n"+
                 "Room Location: " + AcademicUser[0].room_location_id + "\n"+
                 "Head of Department: " + AcademicUser[0].HOD + "\n"+
                 "Coordinator: " + AcademicUser[0].Coordinator + "\n"+
                 "Role: " + AcademicUser[0].role + "\n"+
                 "Gender: " + AcademicUser[0].gender + "\n"+
                 "Courses Taught: " + AcademicUser[0].courses_taught + "\n"+
                 "Assign Slots: " + AcademicUser[0].assign_slots + "\n"+
                 "Schedule: " + ScheduleResult  + 
                 AttendanceResult
                 
                   )
 
    }else{
        const HRUser = await HR.find({id: req.data.id})
        res.send("ID: " + HRUser[0].id + "\n"+
        "Name: " + HRUser[0].name + "\n" +
        "Password: " + HRUser[0].password + "\n"+
        "Phone Number: " + AcademicUser[0].Phone_Number + "\n" +
        "Salary: " + HRUser[0].salary + "\n"+
        "Room Location: " + HRUser[0].room_location_id + "\n"+
        "Role: " + HRUser[0].role + "\n"+
        "Gender: " + HRUser[0].gender + "\n"
          )

        
    }


})

///////////////////////////////////////////////UPDATE PROFILE////////////////////////////////////////////
router.route('/staff/updateProfile')
.put(tokenVerification,async(req,res)=>{
    const AcademicUser = await Academic_Member.find({id: req.data.id})
    if(AcademicUser.length !== 0){
        Academic_Member.findOneAndRemove({
           id:AcademicUser[0].id
        })
        if(req.body.email){
            AcademicUser[0].email = req.body.email
            await AcademicUser[0].save().then(doc => {
                res.send(doc);
            })
            .then(response => {
                console.log(response)
                res.send(response)
                })
                .catch(err => {
                console.error(err)
                })
        }if(req.body.Phone_Number){
            AcademicUser[0].Phone_Number = req.body.Phone_Number
            await AcademicUser[0].save().then(doc => {
                res.send(doc);
            })
            .then(response => {
                //console.log(response)
                res.send(response)
                })
                .catch(err => {
                console.error(err)
                })
        }if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password,salt)

            AcademicUser[0].password = hashedPassword
            await AcademicUser[0].save().then(doc => {
                res.send(doc);
            })
            .then(response => {
                //console.log(response)
                res.send(response)
                })
                .catch(err => {
                console.error(err)
                })
        }
        

    }else{
        const HRUser = await HR.find({id: req.data.id})
            HR.findOneAndRemove({
               id:HRUser[0].id
            })
            if(req.body.email){
                HRUser[0].email = req.body.email
                await HRUser[0].save().then(doc => {
                    res.send(doc);
                })
                .then(response => {
                    console.log(response)
                    res.send(response)
                    })
                    .catch(err => {
                    console.error(err)
                    })
            }if(req.body.Phone_Number){
                HRUser[0].Phone_Number = req.body.Phone_Number
                await HRUser[0].save().then(doc => {
                    res.send(doc);
                })
                .then(response => {
                    //console.log(response)
                    res.send(response)
                    })
                    .catch(err => {
                    console.error(err)
                    })
            }if(req.body.password){
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password,salt)

                HRUser[0].password = hashedPassword
                await HRUser[0].save().then(doc => {
                    res.send(doc);
                })
                .then(response => {
                    //console.log(response)
                    res.send(response)
                    })
                    .catch(err => {
                    console.error(err)
                    })
            }
            

        
    }

})
  
///////////////////////////////////////////////RESET PASSWORD////////////////////////////////////////////
router.route('/staff/resetPassword')
.put(tokenVerification,async(req,res)=>{
    const AcademicUser = await Academic_Member.find({id: req.data.id})
    if(AcademicUser.length !== 0){
        Academic_Member.findOneAndRemove({
            id:AcademicUser[0].id
         })
         if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password,salt)
    
            AcademicUser[0].password = hashedPassword
            await AcademicUser[0].save().then(doc => {
                res.send("Password is updated successfully!");
            })
            .catch(err => {
                console.error("Error has occured. Please try again!")
            })  
        
        }
    
    }else{
        const HRUser = await HR.find({id: req.data.id})
        if(HRUser){
            HR.findOneAndRemove({
               id:HRUser[0].id
            })
            if(req.body.password){
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password,salt)
        
                HRUser[0].password = hashedPassword
                await HRUser[0].save().then(doc => {
                    res.send("Password is updated successfully!");
                })
                .catch(err => {
                    console.error("Error has occured. Please try again!")
                    })
            }
    }
}

})

///////////////////////////////////////////////SIGN IN////////////////////////////////////////////

router.route('/staff/signIn')
.post(async(req,res)=>{
    var user = await Academic_Member.find({id: req.body.id})

    await Academic_Member.findOneAndRemove({id: req.body.id})

    signIn = new Date(Date.now())

    console.log(user[0])

    if(user[0].Attendance.SignedIn === 0){
        user[0].Attendance.signIn.push(signIn)
        user[0].Attendance.SignedIn = 1 
    }else{
        res.send("Sorry, you are already signed in!")
    }

    const Academic_membermodel=  new Academic_Member({
        id:user[0].id,
        name : user[0].name, 
        email: user[0].email,
        password: user[0].password,
        salary:user[0].salary,
        department_name:user[0].department_name,
        faculty_name:user[0].faculty_name,
        room_location_id:user[0].room_location_id,
        HOD: user[0].HOD,
        Coordinator:user[0].Coordinator,
        role:user[0].role,
        gender:user[0].gender,
        courses_taught:user[0].courses_taught,
        assign_slots:user[0].assign_slots,
        schedule: user[0].schedule,
        Phone_Number:user[0].Phone_Number,
        Attendance:user[0].Attendance

    })

    await Academic_membermodel.save()
    res.send("You signed in successfully!")

})

///////////////////////////////////////////////SIGN OUT////////////////////////////////////////////

router.route('/staff/signOut')
.post(async(req,res)=>{
    var user = await Academic_Member.find({id: req.body.id})

    await Academic_Member.findOneAndRemove({id: req.body.id})

    signOut = new Date(Date.now())


    if(user[0].Attendance.SignedIn === 1){
        user[0].Attendance.signOut.push(signOut)
        user[0].Attendance.SignedIn = 0
    }else{
        res.send("Sorry, you are already signed out!")
    }

    const Academic_membermodel=  new Academic_Member({
        id:user[0].id,
        name : user[0].name, 
        email: user[0].email,
        password: user[0].password,
        salary:user[0].salary,
        department_name:user[0].department_name,
        faculty_name:user[0].faculty_name,
        room_location_id:user[0].room_location_id,
        HOD: user[0].HOD,
        Coordinator:user[0].Coordinator,
        role:user[0].role,
        gender:user[0].gender,
        courses_taught:user[0].courses_taught,
        assign_slots:user[0].assign_slots,
        schedule: user[0].schedule,
        Phone_Number:user[0].Phone_Number,
        Attendance:user[0].Attendance

    })

    await Academic_membermodel.save()
    res.send("You signed out successfully!")

})





////////////////////////////////////////////INSERTING IN DATABASE//////////////////////////////////////////////
router.route('/staff/addAcademicMember')
.post(async (req,res)=>{    
    const slot = new Slot({
        
            course_id:"CSEN701",
            day: "Tuesday",
            which_slot: 1,
            room_location_id: "C7.301"
           
        
    })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("ashraf123",salt)
    const newM = new Academic_Member({
        id: "43-108711",
        name: "Mohamed Ashraf",
        email: "m11@gmail.com",
        password: hashedPassword,
        salary: 5000000,
        department_name: "MET",
        faculty_name: "Engineering",   
        room_location_id:"C5.201",
        role:"TA",
        courses_taught: ["CSEN701"],
        assign_slots: [1],
        schedule: [slot]
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
router.route('/staff/addAttendance')
.post(async (req,res)=>{    
    const newM = new Academic_Member({
        id: "43-10871",
        name: "Mohamed Ashraf",
        email: "m1@gmail.com",
        salary: 5000000,
        department_name: "MET",
        faculty_name: "Engineering",   
        room_location_id:"C5.201",
        role:"TA"
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
router.route('/staff/addCourse')
.post(async (req,res)=>{    
    const newM = new Course({
        id: "CSEN701",
        name: "Embedded",
        department_name: "MET"
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
router.route('/staff/addDepartment')
.post(async (req,res)=>{    
    const newM = new Academic_Member({
        id: "43-10872",
        name: "Mohamed Ashraf",
        email: "mohzashraf1@gmail.com",
        salary: 5000000,
        department_name: "MET",
        room_location_id:"C5.201"
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
router.route('/staff/addFaculty')
.post(async (req,res)=>{    
    const newM = new Academic_Member({
        id: "43-10872",
        name: "Mohamed Ashraf",
        email: "mohzashraf1@gmail.com",
        salary: 5000000,
        department_name: "MET",
        room_location_id:"C5.201"
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
router.route('/staff/addHR')
.post(async (req,res)=>{    
    const newM = new HR({
        id: "43-10871",
        name: "Mohamed Ashraf",
        email: "mohzashraf@gmail.com",
        salary: 5000000,
        password: "123",
        room_location_id:"C5.201",
        role : "HR"
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
router.route('/staff/addLeaves')
.post(async (req,res)=>{    
    const newM = new Academic_Member({
        id: "43-10872",
        name: "Mohamed Ashraf",
        email: "mohzashraf1@gmail.com",
        salary: 5000000,
        department_name: "MET",
        room_location_id:"C5.201"
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
router.route('/staff/addRoom')
.post(async (req,res)=>{    
    const newM = new room_location({
        id: "C5.201",
        type_of_Room: "Office"
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
router.route('/staff/addSlot')
.post(async (req,res)=>{    
    const newM = new Slot({
        course_id: "CSEN701",
        day: "Tuesday",
        room_location_id: "C7.301",
        which_slot: 1,
        academic_member_id: "43-10871"
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


module.exports = router

