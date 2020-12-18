const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Academic_Member = require('../models/Academic_Member')

const HR = require('../models/HR');
var blockList = []
var login
var logout


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

//routes
///////////////////////////////////////////////LOGIN////////////////////////////////////////////
router.route('/staff/userLogin')
.post(async(req,res)=>{
    const AcademicUser = await Academic_Member.find({email: req.body.email})
    
    if(AcademicUser.length !== 0){
        login = new Date()
        const token= jwt.sign({id: AcademicUser[0].id, role: AcademicUser[0].role, HOD: AcademicUser[0].HOD, 
            Coordinator: AcademicUser[0].Coordinator},process.env.TOKEN_SECRET)  
                     res.header('token', token).send('You logged in successfully!')
    }

    else{
        const HRUser = await HR.find({email: req.body.email})
        if(HRUser.length !== 0){
            const token= jwt.sign({id: HRUser[0].id , role: HRUser[0].role},process.env.TOKEN_SECRET)
                         res.header('token', token).send('You logged in successfully!')
        }else{
            res.status(401).send('Email or password is incorrect!')
        }
    }
   
})

///////////////////////////////////////////////LOGOUT////////////////////////////////////////////
router.route('/staff/logout')
.post(async(req,res)=>{
    //console.log(blockList)
    if((blockList.filter((token)=>token === req.headers.token)).length !== 0){
        res.send('You are already logged out')
    }
    else{
        logout = new Date()
        console.log("duration: "+(logout-login)/1000)
        console.log("day: "+ logout.getDay())
        console.log("month: "+ logout.getMonth())
        console.log("year: "+logout.getFullYear())

        blockList.push(req.headers.token)
        res.send('You logged out successfully')
    }
})

///////////////////////////////////////////////VIEW PROFILE////////////////////////////////////////////
router.route('/staff/viewProfile')
.get(tokenVerification,async(req,res)=>{
    const AcademicUser = await Academic_Member.find({id: req.data.id})
    if(AcademicUser.length !== 0){
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
                 "Schedule: " + AcademicUser[0].schedule + "\n" 
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
            AcademicUser[0].password = req.body.password
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
                HRUser[0].password = req.body.password
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
            AcademicUser[0].password = req.body.password
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

                HRUser[0].password = req.body.password
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

router.route('/lalo')
.post(async(req,res)=>{
   
if(req.body.id){
    
}

})




/////////////////////////////////////INSERTING IN DATABASE////////////////////////////
router.route('/staff/addAcademicMember')
.post(async (req,res)=>{    
    const newM = new Academic_Member({
        id: "43-10871",
        name: "Mohamed Ashraf",
        email: "mohzashraf1@gmail.com",
        password: "123",
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
router.route('/staff/addAttendance')
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
router.route('/staff/addCourse')
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
router.route('/staff/addSlot')
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

module.exports = router
