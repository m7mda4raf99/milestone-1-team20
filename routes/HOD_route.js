const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Academic_Member = require('../models/Academic_Member')
const Department = require('../models/Department')
const course = require('../models/course')

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


/////////////////////////
router.route('/Academic_Member/assign_course_instructor')
.post(async( req,res)=>{

    const Hod= await Academic_Member.find({
        id:req.body.hod_id
    })
    if(Hod.length === 0){
       res.send("this Hod_id is not valid")
    }

    var instructor= await Academic_Member.find({
        id:req.body.course_instructor_id
    })
    if(instructor.length === 0){
        res.send("this instructor_id is not valid")
     }
    const courses = await course.find({
        id:req.body.course_id
    })
    if(courses.length === 0){
        res.send("this course_id is not valid")
     }
    //console.log(instructor[0])

    const courses_in_his_department = await course.find({
        department_name:instructor[0].department_name
    })
console.log(courses_in_his_department.filter(item => item.id===req.body.course_id))
    if(courses_in_his_department.filter(item => item.id===req.body.course_id).length !==0){
    
        if(Hod[0].department_name === instructor[0].department_name && courses[0].department_name === Hod[0].department_name){
            await Academic_Member.findOneAndRemove({
                id:req.body.course_instructor_id
            })

            //console.log(req.body.course_id)
            instructor[0].courses_taught.push(req.body.course_id)
            const Academic_Member_model=  new Academic_Member({
                id:req.body.course_instructor_id,
                name:instructor[0].name,
                email:instructor[0].email,
                password:instructor[0].password,
                salary:instructor[0].salary,
                department_name:Hod[0].department_name,
                faculty_name:instructor[0].faculty_name,
                room_location_id:instructor[0].room_location_id,
                HOD:instructor[0].Hod,
                Coordinator:instructor[0].Coordinator,
                role:instructor[0].role,
                courses_taught:instructor[0].courses_taught,
                assign_slots:instructor[0].assign_slots,
                schedule:instructor[0].schedule,
                Phone_Number:instructor[0].Phone_Number,
                Attendace:instructor[0].Attendace,
                
            })
            console.log(instructor[0].courses_taught)
            await Academic_Member_model.save().then(doc => {
                res.send(doc);
            })
            .catch(err => {
            console.error(err)
            })
        }
        else{
            res.status(404).send('HOD and instructor are not in the same department or course and HOD are not in the same department')
        }
    }  
    else{
        res.status(404).send('course_id doesnot exist in the same departmnt')
    }
    })


////delete
router.route('/Academic_Member/delete_course_instructor')
.delete(async( req,res)=>{

    const Hod= await Academic_Member.find({
        id:req.body.hod_id
    })
    if(Hod.length === 0){
       res.send("this Hod_id is not valid")
    }

    var instructor= await Academic_Member.find({
        id:req.body.course_instructor_id
    })
    if(instructor.length === 0){
        res.send("this instructor_id is not valid")
     }
    const courses = await course.find({
        id:req.body.course_id
    })
    if(courses.length === 0){
        res.send("this course_id is not valid")
     }
    //console.log(instructor[0])

    const courses_in_his_department = await course.find({
        department_name:instructor[0].department_name
    })
console.log(courses_in_his_department.filter(item => item.id===req.body.course_id))
    if(courses_in_his_department.filter(item => item.id===req.body.course_id).length !==0){
    
        if(Hod[0].department_name === instructor[0].department_name && courses[0].department_name === Hod[0].department_name){
            await Academic_Member.findOneAndRemove({
                id:req.body.course_instructor_id
            })

            //console.log(req.body.course_id)
           const index= instructor[0].courses_taught.indexOf((req.body.course_id))
           if(index>-1){
            instructor[0].courses_taught.splice(index,1)
           }
           console.log(instructor[0].courses_taught)
            const Academic_Member_model=  new Academic_Member({
                id:req.body.course_instructor_id,
                name:instructor[0].name,
                email:instructor[0].email,
                password:instructor[0].password,
                salary:instructor[0].salary,
                department_name:Hod[0].department_name,
                faculty_name:instructor[0].faculty_name,
                room_location_id:instructor[0].room_location_id,
                HOD:instructor[0].Hod,
                Coordinator:instructor[0].Coordinator,
                role:instructor[0].role,
                courses_taught:instructor[0].courses_taught,
                assign_slots:instructor[0].assign_slots,
                schedule:instructor[0].schedule,
                Phone_Number:instructor[0].Phone_Number,
                Attendace:instructor[0].Attendace,
                
            })
            console.log(instructor[0].courses_taught)
            await Academic_Member_model.save().then(doc => {
                res.send(doc);
            })
            .catch(err => {
            console.error(err)
            })
        }
        else{
            res.status(404).send('HOD and instructor are not in the same department or course and HOD are not in the same department')
        }
    }  
    else{
        res.status(404).send('course_id doesnot exist in the same departmnt')
    }
    })



////update
router.route('/Academic_Member/update_course_instructor/:id')
.put(async( req,res)=>{

    const Hod= await Academic_Member.find({
        id:req.body.hod_id
    })
    if(Hod.length === 0){
       res.send("this Hod_id is not valid")
    }

    var new_instructor= await Academic_Member.find({
        id:req.body.course_instructor_id
    })
    if(new_instructor.length === 0){
        res.send("this instructor_id is not valid")
     }

     const old_instructor= await Academic_Member.find({
        id:req.params.id
    })

    if(old_instructor.length === 0){
        res.send("the old_instructor_id is not valid")
     }
    const courses = await course.find({
        id:req.body.course_id
    })
    if(courses.length === 0){
        res.send("this course_id is not valid")
     }

     
    //console.log(instructor[0])

    const courses_in_his_department = await course.find({
        department_name:new_instructor[0].department_name
    })
console.log(courses_in_his_department.filter(item => item.id===req.body.course_id))
    if(courses_in_his_department.filter(item => item.id===req.body.course_id).length !==0){
    
        if(Hod[0].department_name === new_instructor[0].department_name && old_instructor[0].department_name === new_instructor[0].department_name && courses[0].department_name === Hod[0].department_name){
            await Academic_Member.findOneAndRemove({
                id:req.params.id
            })

            //console.log(req.body.course_id)
           const index= old_instructor[0].courses_taught.indexOf((req.body.course_id))
           if(index>-1){
            old_instructor[0].courses_taught.splice(index,1)
           }
           //console.log(instructor[0].courses_taught)
            const Academic_Member_model=  new Academic_Member({
                id:req.params.id,
                name:old_instructor[0].name,
                email:old_instructor[0].email,
                password:old_instructor[0].password,
                salary:old_instructor[0].salary,
                department_name:Hod[0].department_name,
                faculty_name:old_instructor[0].faculty_name,
                room_location_id:old_instructor[0].room_location_id,
                HOD:old_instructor[0].Hod,
                Coordinator:old_instructor[0].Coordinator,
                role:old_instructor[0].role,
                courses_taught:old_instructor[0].courses_taught,
                assign_slots:old_instructor[0].assign_slots,
                schedule:old_instructor[0].schedule,
                Phone_Number:old_instructor[0].Phone_Number,
                Attendace:old_instructor[0].Attendace,
                
            })
           // console.log(instructor[0].courses_taught)
            await Academic_Member_model.save().then(doc => {
                res.send(doc);
            })
            .catch(err => {
            console.error(err)
            })

            await Academic_Member.findOneAndRemove({
                id:req.body.course_instructor_id
            })

            //console.log(req.body.course_id)

            new_instructor[0].courses_taught.push(req.body.course_id)
            const Academic_Member_model_1=  new Academic_Member({
                id:req.body.course_instructor_id,
                name:new_instructor[0].name,
                email:new_instructor[0].email,
                password:new_instructor[0].password,
                salary:new_instructor[0].salary,
                department_name:Hod[0].department_name,
                faculty_name:new_instructor[0].faculty_name,
                room_location_id:new_instructor[0].room_location_id,
                HOD:new_instructor[0].Hod,
                Coordinator:new_instructor[0].Coordinator,
                role:new_instructor[0].role,
                courses_taught:new_instructor[0].courses_taught,
                assign_slots:new_instructor[0].assign_slots,
                schedule:new_instructor[0].schedule,
                Phone_Number:new_instructor[0].Phone_Number,
                Attendace:new_instructor[0].Attendace,
                
            })
            //console.log(new_instructor[0].courses_taught)
            await Academic_Member_model_1.save().then(doc => {
                res.send(doc);
            })
            .catch(err => {
            console.error(err)
            })

        }
        else{
            res.status(404).send('HOD and instructor are not in the same department or course and HOD are not in the same department')
        }
    }  
    else{
        res.status(404).send('course_id doesnot exist in the same departmnt')
    }
    })


module.exports = router 