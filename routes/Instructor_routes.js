const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Academic_Member = require('../models/Academic_Member')
const Course = require('../models/course')
const slot = require('../models/slot')
const room_Location = require('../models/room_Location')
//var {name} = require('./Staff_route')
//routes
    
router.route('/Instructor/viewCoverages')
.get(async (req,res)=>{
    const instructor = await Academic_Member.find({id: req.params.id})
    //const instructor = await Academic_Member.find({id: "43-10871"})


    if(instructor[0].courses_taught){
        if(instructor[0].courses_taught.length===0)
            res.send("You don't have any courses assigned in!")
        else{
            var course, result = "Coverages: \n" 
            for(var i=0; i<instructor[0].courses_taught.length; i++){
                //console.log("ashraf: "+ instructor[0].courses_taught[i])
                course = await Course.find({id : instructor[0].courses_taught[i]})
                //console.log("ashraf1: "+ course)

                result += course[0].id + ", " + course[0].name + ": " + course[0].course_coverage + "\n"
            }
            res.send(result)
        }
    }else
         res.send("You don't have any courses assigned in!")

})

router.route('/Instructor/viewCoursesSlots')
.get(async (req,res)=>{
    //console.log("esmy: "+name)
    //const instructor = await Academic_Member.find({id: req.params.id})
    const instructor = await Academic_Member.find({id: "43-10875"})
    if(instructor[0].courses_taught){
        if(instructor[0].courses_taught.length===0){
            res.send("You should be assigned to any course!")
        }else{
            var course, result = ""
            for(var i=0; i<instructor[0].courses_taught.length; i++){
                course = await Course.find({id: instructor[0].courses_taught[i]})
                result += course[0].id + " " + course[0].name + ": \n ---- Slots: " 
                if(instructor[0].schedule){
                    for(var j=0; j<instructor[0].schedule.length; j++){
                        if(instructor[0].schedule[j].course_id === course[0].id){
                            result += " --" + instructor[0].schedule[j].day + " " + instructor[0].schedule[j].which_slot + "th"
                        }
                    }
                    result += "\n"
                }
            }
            res.send(result)
        }

    }else
      res.send("You should be assigned to any course!")

})

router.route('/Instructor/viewStaffProfiles')
.get(async (req,res) => {
    var loggedInUser = await Academic_Member.find({id: req.data.id})
    var staff = await Academic_Member.find()
    var viewProfileResult = ""
    
    //search by department
    if(req.body.course_id){
        staff = staff.filter(item => item.courses_taught.contains(req.body.course_id))
    }else{
        staff = staff.filter(item => item.department_name === "MET")
    }

    var id, name, email, department_name, faculty_name, room_location_id, HOD, Coordinator, role, gender, 
    courses_taught, assign_slots, Phone_Number, ScheduleResult
    ScheduleResult += "ID: " 
    for(var i=0; i<staff.length;i++){
         id = staff[i].id
         name = staff[i].name
         email = staff[i].email
         department_name = staff[i].department_name
         faculty_name = staff[i].department_name
         room_location_id = staff[i].room_location_id
         HOD = staff[i].HOD
         Coordinator = staff[i].Coordinator
         role = staff[i].role
         gender = staff[i].gender
         courses_taught = staff[i].courses_taught
         assign_slots = staff[i].assign_slots
         Phone_Number = staff[i].Phone_Number

         ScheduleResult += "--------------------------------------- \n " +
         "ID: " + id + "\n" +
         "ID: " + name + "\n" +
         "ID: " + email + "\n" +
         "ID: " + Phone_Number + "\n" +
         "ID: " + department_name + "\n" +
         "ID: " + faculty_name + "\n" +
         "ID: " + room_location_id + "\n" +
         "ID: " + HOD + "\n" +
         "ID: " + Coordinator + "\n" +
         "ID: " + role + "\n" +
         "ID: " + gender + "\n" +
         "ID: " + courses_taught + "\n" +
         "ID: " + assign_slots + "\n" 
         
    }

    res.send(ScheduleResult)

})

router.route('/Instructor/assignAcademicToSlot')
.post(async (req,res) => {
    const instructor = await Academic_Member.find({id: req.data.id})
    const room = await room_Location.find({id: req.body.room_location_id})
    const slot = await slot.find({room_location_id: req.body.room_location_id})
    slot = room.filter(item => item.day === req.body.day && item.which_slot === req.body.which_slot &&
                               item.course_id !== req.body.course_id )
    var staff = await Academic_Member.find({id: req.body.staff_id})

                             

    //course entered in the body is not assigned to this instructor
    if((instructor[0].courses_taught.filter(item => item === req.body.course_id)).length === 0){
        res.send("You are not assigned to this course!")
    //room entered in the body is neither room nor lecture hall   
    }else if(room[0].type_of_Room === "Office"){
        res.send("This room location is an Office-room type!")
    //room entered in the body is full in that slot        
    }else if(slot.length !== 0){
        res.send("This room is full at this slot")
    //instructor is assigning another instructor, he can only assign TA or himself  
    }else if(staff[0].role !== "TA" && req.data.id !== req.body.id){
        res.send("Instructor can't assign another instructor")
    }
    //assigning staff to this slot
     else{
        const unAssignedSlot = await slot.find({room_location_id: req.body.room_location_id, 
            course_id: req.body.course_id, day: req.body.day, which_slot: req.body.which_slot})
        var course = await Course.find({id: req.body.course_id})
        //updating staff member
        await Academic_Member.findOneAndDelete({id: req.body.staff_id})
        staff[0].schedule.push(unAssignedSlot[0])
        if(staff[0].courses_taught.includes(req.body.course_id)){
            staff[0].assign_slots[staff[0].courses_taught.indexOf(req.body.course_id)] += 1
        }else{
            staff[0].courses_taught.push(req.body.course_id)
            staff[0].assign_slots.push(1)
        }

        //updating course
        await Course.findOneAndDelete({id: req.body.course_id})
        course[0].numberOfUnassignedSlots -= 1 
        course[0].numberOfAssignedSlots += 1
        course[0].course_coverage = course[0].numberOfAssignedSlots/ (course[0].numberOfAssignedSlots + 
            course[0].numberOfUnassignedSlots)

        await staff.save()
        await course.save

        res.send("Staff member is assigned to this course slot successfully")
    }

})

router.route('/Instructor/updateAcademicSlot')
.put(async (req,res) => {
    
})

router.route('/Instructor/deleteAcademicSlot')
.delete(async (req,res) => {
    
})

///remove

router.route('/Instructor/assignAcademicCoordinator')
.post(async (req,res) => {
    
})




module.exports = router