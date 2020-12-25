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
const { response } = require('express')

//var blockList = []
var signIn
var signOut
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

//////////////////////////////PERIODIC FUNCTION EVERYDAY AT 7:00 PM/////////////////////////////
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

    const staff = await Academic_Member.find()
    for(var i=0;i<staff.length;i++){
        
        //calculating hours, minutes and total_hours_minutes
        var whenSignIn = 0 
        var whenSignOut = 0
        var total_hours_minutes =0

        for(var j=0; j< staff[i].Attendance.signIn.length; j++){
            if(staff[i].Attendance.signIn[j] && staff[i].Attendance.signOut[j]){
                if (dateOfToday.toISOString().slice(0,10) ===
                staff[i].Attendance.signIn[j].toISOString().slice(0,10)){  
                    whenSignIn = staff[i].Attendance.signIn[j] 
                    whenSignOut = staff[i].Attendance.signOut[j]                         
                    total_hours_minutes += (whenSignOut-whenSignIn) / 1000 / 60 / 60
                }
            }
           
        }

        //if this day is a dayOff
        if(staff[i].Attendance.dayOff.toLowerCase() === days[dateOfToday.getDay()]){
            //if he requests for a leave and it is accepted
            if(false){

            }

            //no leave request 
            else{
                staff[i].Attendance.extraHours += Math.floor(total_hours_minutes)
                staff[i].Attendance.extraMinutes += (total_hours_minutes - Math.floor(total_hours_minutes))*60
                staff[i].Attendance.spentHoursPerMonth += total_hours_minutes
            }

        }
        //if this day is not a dayOff
        else{
            if(total_hours_minutes===0){
                staff[i].Attendance.missingDays++
            }
            else if(total_hours_minutes < 8.4){
                staff[i].Attendance.missingHours += Math.floor(8.4-total_hours_minutes)
                staff[i].Attendance.missingMinutes += (8.4-total_hours_minutes- staff[i].Attendance.missingHours)*60
                staff[i].Attendance.spentHoursPerMonth += total_hours_minutes
            }
            else{
                staff[i].Attendance.extraHours += Math.floor(total_hours_minutes - 8.4)
                staff[i].Attendance.extraMinutes += (total_hours_minutes- 8.4 - staff[i].Attendance.extraHours)*60
                staff[i].Attendance.spentHoursPerMonth += total_hours_minutes

            }

        }







    //if today is the dayOff of the member i
        
    //     if(academicrocords[i].Attendance.dayOff.toLowerCase() === days[dateOfToday.getDay()]){
           
    //         for(var j = 0;j<academicrocords[i].Attendance.signIn.length;j++){
                
    //             var hours = Math.floor( academicrocords[i].Attendance.signOut[j]-academicrocords[i].Attendance.signIn[j]/1000/60/60)
    //             var minutes=academicrocords[i].Attendance.signOut[j]-academicrocords[i].Attendance.signIn[j]/1000/60-(Math.floor( academicrocords[i].Attendance.signOut[j]-academicrocords[i].Attendance.signIn[j]/1000/60/60)*60)
    //             var total_hours_minutes=hours+minutes/60
               
    //             if (dateOfToday.toISOString().slice(0,10)===
    //                   academicrocords[i].Attendance.signIn[j].toISOString().slice(0,10)){
    //                 academicrocords[i].Attendance.acceptedMissingHours -= hours
    //                 academicrocords[i].Attendance.acceptedMissingMinutes -= minutes
    //                 academicrocords[i].Attendance.spentHoursPerMonth[j] += total_hours_minutes 
    //             }


    //         }
    //   }else{
    //       if(hours===0&&minutes===0){
    //         academicrocords[i].Attendance.missingDays[j]+=1
    //       }
    //       else if(total_hours_minutes<7.4){
    //           if(minutes < 24){
    //             academicrocords[i].Attendance.missingHours[j]= 8 - hours
    //             academicrocords[i].Attendance.missingMinutes[j] = 24 - minutes
    //           }else{
    //             academicrocords[i].Attendance.missingHours[j]= 8 - hours - 1
    //             academicrocords[i].Attendance.missingMinutes[j] = minutes - 24
    //           }

    //       }else if (7.4 <= total_hours_minutes && 8.4 >= total_hours_minutes){

    //       }else{

    //       }

    //     }



        
    }
}

/////////////////////PERIODIC FUNCTION EVERY 10TH DAY OF EACH MONTH AT 7:00 PM//////////////////
var flag2 = true
var intervalID2 = setInterval(function(){
    var oldHour = new Date().getHours()    
        var date = new Date()
        if(oldHour !== date.getHours()){
            oldHour = date.getHours()
            flag2 = true
        }
        if(date.getDate() === 10 && date.getHours() === 19 && flag2){
            everyTenthDayOfEachMonth()
            flag2 = false
        }

}, 1000)

async function everyTenthDayOfEachMonth(){
    var staff = await Academic_Member.find()

    for(var i=0; staff.length; i++){
        await Academic_Member.findOneAndRemove({id: staff[i].id})

        if(staff[i].Attendance.missingHours + (staff[i].Attendance.missingMinutes/ 60) > 
        staff[i].Attendance.extraHours + (staff[i].Attendance.extraMinutes/ 60)){
            staff[i].putInVisa = staff[i].salary - (staff[i].salary/60) * staff[i].Attendance.missingDays
             - (staff[i].salary/180) * staff[i].Attendance.missingHours - (staff[i].salary/(180*60)) * 
             staff[i].Attendance.missingMinutes  
        }else{
            staff[i].putInVisa = staff[i].salary  
        }

        staff[i].annual_balance += 2.5

        const Academic_membermodel=  new Academic_Member({
            id:staff[i].id,
            name : staff[i].name, 
            email: staff[i].email,
            password: staff[i].password,
            salary:staff[i].salary,
            department_name:staff[i].department_name,
            faculty_name:staff[i].faculty_name,
            room_location_id:staff[i].room_location_id,
            HOD: staff[i].HOD,
            Coordinator:staff[i].Coordinator,
            role:staff[i].role,
            gender:staff[i].gender,
            courses_taught:staff[i].courses_taught,
            assign_slots:staff[i].assign_slots,
            schedule: staff[i].schedule,
            Phone_Number:staff[i].Phone_Number,
            annual_balance: staff[i].annual_balance,
            accidental_balance: staff[i].accidental_balance,
            Attendance:staff[i].Attendance,
            isNewMember: staff[i].isNewMember,
            Notification: staff[i].Notification,
            putInVisa: staff[i].putInVisa
        })

        Academic_membermodel.save()
        .then(response => {})
        .catch(err => {console.log(err)})

    }
    
}


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
        const 
        Blockcontent = new Blocklist({
            name: req.headers.token
        })
        await newBlockcontent.save()
        .then(response => {res.send('You logged out successfully')}).catch(err => {console.log(err)})

    
    }
})

///////////////////////////////////////////VIEW PROFILE////////////////////////////////////////////
router.route('/staff/viewProfile')
.get(tokenVerification,async(req,res)=>{
    const AcademicUser = await Academic_Member.find({id: req.data.id})

    if(AcademicUser.length !== 0){
       res.send(AcademicUser[0])
 
    }else{
        const HRUser = await HR.find({id: req.data.id})
        if(HRUser.length !== 0){
            res.send(HRUser[0])
        }else{
            res.send("There is no academic member with this id")
        }      
    }


})

////////////////////////////////////////////UPDATE PROFILE////////////////////////////////////////
router.route('/staff/updateProfile')
.put(tokenVerification,async(req,res)=>{
    const AcademicUser = await Academic_Member.find({id: req.data.id})

    if(AcademicUser.length !== 0){
        Academic_Member.findOneAndRemove({id:AcademicUser[0].id})

        if(req.body.email){
            AcademicUser[0].email = req.body.email
            await AcademicUser[0].save()
            .then(response => {}).catch(err => {console.log(err)})

        }if(req.body.Phone_Number){
            AcademicUser[0].Phone_Number = req.body.Phone_Number
            await AcademicUser[0].save()
            .then(response => {}).catch(err => {console.log(err)})

        }if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password,salt)

            AcademicUser[0].password = hashedPassword
            await AcademicUser[0].save()
            .then(response => {}).catch(err => {console.log(err)})

        }
        
        res.send("Updated successfully!")

    }else{
        const HRUser = await HR.find({id: req.data.id})

            HR.findOneAndRemove({id:HRUser[0].id})

            if(req.body.email){
                HRUser[0].email = req.body.email
                await HRUser[0].save()
                .then(response => {}).catch(err => {console.log(err)})

            }if(req.body.Phone_Number){
                HRUser[0].Phone_Number = req.body.Phone_Number
                await HRUser[0].save()
                .then(response => {}).catch(err => {console.log(err)})

            }if(req.body.password){
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password,salt)

                HRUser[0].password = hashedPassword
                await HRUser[0].save()
                .then(response => {}).catch(err => {console.log(err)})

            }
            res.send("Updated successfully!")

    }

})
  
////////////////////////////////////////////RESET PASSWORD///////////////////////////////////////
router.route('/staff/resetPassword')
.put(tokenVerification,async(req,res)=>{
    const AcademicUser = await Academic_Member.find({id: req.data.id})

    if(AcademicUser.length !== 0){
        Academic_Member.findOneAndRemove({id:AcademicUser[0].id})

         if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password,salt)
    
            AcademicUser[0].password = hashedPassword
            AcademicUser[0].isNewMember = false
            await AcademicUser[0].save()
            .then(response => {res.send("Password is updated successfully!")})
            .catch(err => {console.error("Error has occured. Please try again!")})
        

        }
    
    }else{
        const HRUser = await HR.find({id: req.data.id})
        
        if(HRUser){
            HR.findOneAndRemove({id:HRUser[0].id})

            if(req.body.password){
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password,salt)
        
                HRUser[0].password = hashedPassword
                HRUser[0].isNewMember = false
                await HRUser[0].save()
                .then(response => {res.send("Password is updated successfully!")})
                .catch(err => {console.error("Error has occured. Please try again!")})

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

    user[0].Attendance.signIn.push(signIn)
    user[0].Attendance.signOut.push(undefined)

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
        annual_balance: user[0].annual_balance,
        accidental_balance: user[0].accidental_balance,
        Attendance:user[0].Attendance,
        isNewMember: user[0].isNewMember,
        Notification: user[0].Notification,
        putInVisa: user[0].putInVisa
    })

    await Academic_membermodel.save()
    .then(response => {res.send("You signed in successfully!")}).catch(err => {console.log(err)})

})

///////////////////////////////////////////////SIGN OUT////////////////////////////////////////////

router.route('/staff/signOut')
.post(async(req,res)=>{
    var user = await Academic_Member.find({id: req.body.id})

    await Academic_Member.findOneAndRemove({id: req.body.id})

    signOut = new Date(Date.now())

    if(user[0].Attendance.signOut[user[0].Attendance.signOut.length-1]){
        user[0].Attendance.signOut.push(signOut)
        user[0].Attendance.signIn.push(undefined)
    }else{
        user[0].Attendance.signOut[user[0].Attendance.signOut.length-1] = signOut
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
        annual_balance: user[0].annual_balance,
        accidental_balance: user[0].accidental_balance,
        Attendance:user[0].Attendance,
        isNewMember: user[0].isNewMember,
        Notification: user[0].Notification,
        putInVisa: user[0].putInVisa
    })

    await Academic_membermodel.save()
    .then(response => {res.send("You signed out successfully!")}).catch(err => {console.log(err)})


})


///////////////////////////////////////////////VIEW ATTENDANCE////////////////////////////////////////////
router.route('/staff/viewAttendance')
.get(tokenVerification, async (req,res) => {
    const staff = await Academic_Member.find({id: req.data.id})

    var arraySignIn
    var arraySignOut

    if(req.body.month){
        for(var i=0; i< staff[0].Attendance.signIn.length; i++){
            if(staff[0].Attendance.signIn[i]){
                if(staff[0].Attendance.signIn[i].getMonth() + 1 === req.body.month){
                    arraySignIn.push(staff[0].Attendance.signIn[i])
                    arraySignOut.push(staff[0].Attendance.signOut[i])
                }
            }else{
                if(staff[0].Attendance.signOut[i]){
                    if(staff[0].Attendance.signOut[i].getMonth() + 1 === req.body.month){
                        arraySignIn.push(staff[0].Attendance.signIn[i])
                        arraySignOut.push(staff[0].Attendance.signOut[i])
                    }
                }
            }
        }
    }
    else{
        arraySignIn = staff[0].Attendance.signIn
        arraySignOut = staff[0].Attendance.signOut
    }

    res.send({"signIn": arraySignIn, "signOut": arraySignOut})
})

///////////////////////////////////////////////VIEW MISSING DAYS////////////////////////////////////////////
router.route('/staff/viewMissingDays')
.get(tokenVerification, async (req,res) => {
    const staff = await Academic_Member.find({id: req.data.id})

    res.send({"missingDays": staff[0].Attendance.missingDays})
})

////////////////////////////////////////////VIEW MISSING/EXTRA HOURS////////////////////////////////////////////
router.route('/staff/viewMissingExtraHours')
.get(tokenVerification, async (req,res) => {
    const staff = await Academic_Member.find({id: req.data.id})

    res.send({"missingHours": staff[0].Attendance.missingHours + (staff[0].Attendance.missingMinutes/60), 
              "extraHours": staff[0].Attendance.extraHours + (staff[0].Attendance.extraMinutes/60)})
})


module.exports = router

