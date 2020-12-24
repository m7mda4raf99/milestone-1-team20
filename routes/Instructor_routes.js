const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Academic_Member = require('../models/Academic_Member')
const Course = require('../models/course')
const Slot = require('../models/slot')
const room_Location = require('../models/room_Location')
const Blocklist = require('../models/Blocklist')
//var {name} = require('./Staff_route')

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
    const instructor = await Academic_Member.find({id: req.params.id})
    //const instructor = await Academic_Member.find({id: "43-10875"})
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
                            result += " --" + instructor[0].schedule[j].day + " " + instructor[0].schedule[j].which_slot + "th, "
                            + "Academic Member ID: " + instructor[0].schedule[j].academic_member_id

                        }
                    }
                }
                result += "\n"

            }
            res.send(result)
        }

    }else
      res.send("You should be assigned to any course!")

})

router.route('/Instructor/viewStaffProfiles')
.get(tokenVerification, async (req,res) => {
    if(req.data.role === "Instructor"){
    var loggedInUser = await Academic_Member.find({id: req.data.id})
    var staff = await Academic_Member.find()
    
        //search by course
    if(req.body.course_id){
        if(!loggedInUser[0].courses_taught.includes(req.body.course_id)){
            res.send("You are not assigned to this course!")
        }else{
            staff = staff.filter(item => item.courses_taught.includes(req.body.course_id) && 
                                item.id !== req.data.id)  
        }  
    }
        //search by department
    else{
        staff = staff.filter(item => item.department_name === loggedInUser[0].department_name && 
            item.id !== loggedInUser[0].id)
    }
   // console.log(staff)
    var id, name, email, department_name, faculty_name, room_location_id, HOD, Coordinator, role, gender, 
    courses_taught, assign_slots, Phone_Number, Result=""
   
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
         ScheduleResult=""

         //console.log(i + ", " + staff[i])


         if(staff[i].schedule){
            for(var j=0; j< staff[i].schedule.length;j++){
                ScheduleResult += staff[i].schedule[j].course_id + " " + staff[i].schedule[j].day + " " + 
                staff[i].schedule[j].which_slot + " " + staff[i].schedule[j].room_location_id + " " + 
                staff[i].schedule[j].academic_member_id + "\n"
            }
        }
         Result += "--------------------------------------- \n " +
         "ID: " + id + "\n" +
         "Name: " + name + "\n" +
         "Email: " + email + "\n" +
         "Phone Number: " + Phone_Number + "\n" +
         "Department: " + department_name + "\n" +
         "Faculty: " + faculty_name + "\n" +
         "Room Location: " + room_location_id + "\n" +
         "isHOD: " + HOD + "\n" +
         "isCoordinator: " + Coordinator + "\n" +
         "Role: " + role + "\n" +
         "Gender: " + gender + "\n" +
         "Courses Taught: " + courses_taught + "\n" +
         "Number of Slots Assigned : " + assign_slots + "\n" +
         "Schedule: \n" + ScheduleResult          
    }

    res.send(Result)
}else{
    res.send("Access denied. You must be an instructor!")
}
})

router.route('/Instructor/assignAcademicToSlot')
.post(tokenVerification, async (req,res) => {
    if(req.data.role === "Instructor"){

        var instructor = await Academic_Member.find({id: req.data.id})
    var room = await room_Location.find({id: req.body.room_location_id})
    var slot = await Slot.find({room_location_id: req.body.room_location_id})
    slot = room.filter(item => item.day === req.body.day && item.which_slot === req.body.which_slot &&
                               item.course_id !== req.body.course_id )
    var staff = await Academic_Member.find({id: req.body.staff_id})
    var f = false
    if(instructor[0] && instructor[0].courses_taught && room[0] && staff[0] && req.data){
        f = true
    }
    if(f){
    //course entered in the body is not assigned to this instructor
    if((instructor[0].courses_taught.filter(item => item === req.body.course_id)).length === 0){
        res.send("You are not assigned to this course!")
    //room entered in the body is neither room nor lecture hall   
    }else if(room[0].type_of_Room === "Office"){
        res.send("This room location is an Office-room type!")
    //room entered in the body is full in that slot        
    }
    //else if(slot.length !== 0){
     //   res.send("This room is full at this slot")
    //}
    //instructor is assigning another instructor, he can only assign TA or himself  
   
    else if(staff[0].role !== "TA" && req.data.id !== req.body.id){
        res.send("Instructor can't assign another instructor")
    }
    //assigning staff to this slot
     else{
        var unAssignedSlot = await Slot.find({room_location_id: req.body.room_location_id, 
            course_id: req.body.course_id, day: req.body.day, which_slot: req.body.which_slot})
        var course = await Course.find({id: req.body.course_id})

        //updating slot
        await Slot.findOneAndRemove({room_location_id: req.body.room_location_id, 
            course_id: req.body.course_id, day: req.body.day, which_slot: req.body.which_slot})
        unAssignedSlot[0].academic_member_id = req.body.staff_id
        //await unAssignedSlot[0].save()
        const newSlot = new Slot({
            course_id: unAssignedSlot[0].course_id, day: unAssignedSlot[0].day,
            room_location_id: unAssignedSlot[0].room_location_id, which_slot: unAssignedSlot[0].which_slot,
            academic_member_id: unAssignedSlot[0].academic_member_id
        })
        await newSlot.save()

        

        //updating staff member
        await Academic_Member.findOneAndRemove({id: req.body.staff_id})
        staff[0].schedule.push(unAssignedSlot[0])
        if(staff[0].courses_taught.includes(req.body.course_id)){
            staff[0].assign_slots[staff[0].courses_taught.indexOf(req.body.course_id)] += 1
        }else{
            staff[0].courses_taught.push(req.body.course_id)
            staff[0].assign_slots.push(1)
        }
        const newStaff = Academic_Member({
            id: staff[0].id, name: staff[0].name, email: staff[0].email, password: staff[0].password,
            salary: staff[0].salary, department_name: staff[0].department_name, 
            faculty_name: staff[0].faculty_name, room_location_id: staff[0].room_location_id,
            HOD: staff[0].HOD, Coordinator: staff[0].Coordinator, role: staff[0].role, 
            gender: staff[0].gender, courses_taught: staff[0].courses_taught, assign_slots: staff[0].assign_slots,
            schedule: staff[0].schedule, Phone_Number: staff[0].Phone_Number, Attendance: staff[0].Attendance
        })
        await newStaff.save()


        //updating course
        await Course.findOneAndRemove({id: req.body.course_id})
        course[0].numberOfUnassignedSlots -= 1 
        course[0].numberOfAssignedSlots += 1
        course[0].course_coverage = course[0].numberOfAssignedSlots/ (course[0].numberOfAssignedSlots + 
            course[0].numberOfUnassignedSlots)

        for(var i=0; i< course[0].slots.length;i++){
            if(course[0].slots[i].course_id === req.body.course_id && 
                course[0].slots[i].day === req.body.day && 
                course[0].slots[i].room_location_id === req.body.room_location_id &&
                course[0].slots[i].which_slot === req.body.which_slot)

                course[0].slots[i].academic_member_id = req.body.staff_id

        }

        const newCourse = new Course({
            id: course[0].id, name: course[0].name, department_name: course[0].department_name,
            course_coverage: course[0].course_coverage, academic_coordinator_id:course[0].academic_coordinator_id,
            slots: course[0].slots, numberOfAssignedSlots: course[0].numberOfAssignedSlots,
            numberOfUnassignedSlots: course[0].numberOfUnassignedSlots
        })
        await newCourse.save()

        

        res.send("Staff member is assigned to this course slot successfully!")
    }
}
else{
    res.send("Something is undefined. Please make sure of your data entry")

}
}
else{
    res.send("Access denied.  You must be a HR member! ")
}
})

router.route('/Instructor/updateAcademicSlot')
.put(async (req,res) => {
    
})

router.route('/Instructor/deleteAcademicSlot')
.delete(async (req,res) => {
    var AssignedSlot = await Slot.find({room_location_id: req.body.room_location_id, 
        course_id: req.body.course_id, day: req.body.day, which_slot: req.body.which_slot, 
        academic_member_id: req.body.staff_id})

    if(AssignedSlot.length === 0){
        res.send("The academic member is already unassigned to this slot")
    }else{
        //updating slot
        await Slot.findOneAndRemove({room_location_id: req.body.room_location_id, 
            course_id: req.body.course_id, day: req.body.day, which_slot: req.body.which_slot, 
            academic_member_id: req.body.staff_id})
        AssignedSlot[0].academic_member_id = undefined

        const newAssignedSlot = new Slot({
            course_id: AssignedSlot[0].course_id, day: AssignedSlot[0].day, 
            room_location_id: AssignedSlot[0].room_location_id, which_slot: AssignedSlot[0].which_slot,
            academic_member_id: AssignedSlot[0].academic_member_id
        })

        await newAssignedSlot.save()

        //updating course
        var course = await Course.find({id: req.body.course_id})
        await Course.findOneAndRemove({id: req.body.course_id})
        course[0].numberOfUnassignedSlots += 1 
        course[0].numberOfAssignedSlots -= 1
        course[0].course_coverage = course[0].numberOfAssignedSlots/ (course[0].numberOfAssignedSlots + 
            course[0].numberOfUnassignedSlots)

        const newCourse = new Course({
            id: course[0].id, name: course[0].name, department_name: course[0].department_name,
            course_coverage: course[0].course_coverage, academic_coordinator_id: course[0].academic_coordinator_id,
            slots: course[0].slots, numberOfAssignedSlots: course[0].numberOfAssignedSlots,
            numberOfUnassignedSlots: course[0].numberOfUnassignedSlots
        })

        await newCourse.save()
        
        //updating staff
        var staff = await Academic_Member.find({id: req.body.staff_id})
        await Academic_Member.findOneAndRemove({id: req.body.staff_id})
                //remove from schedule
        const index = staff[0].schedule.indexOf(slot => slot.course_id === req.body.course_id && slot.day === req.body.day &&
            slot.room_location_id === req.body.room_location_id && slot.which_slot === req.body.which_slot && 
            slot.academic_member_id === req.body.staff_id)
        if(index > -1){
            staff[0].schedule.splice(index, 1)
        }    

                //update course taught and assign slot
        const i = staff[0].courses_taught.indexOf(req.body.course_id)
        staff[0].assign_slots[i] -= 1
        if(staff[0].assign_slots[i] === 0){
            if(i > -1){
                staff[0].courses_taught.splice(i, 1)
                staff[0].assign_slots.splice(i,1)
            }   
        }

        const newStaff = Academic_Member({
            id: staff[0].id, name: staff[0].name, email: staff[0].email, password: staff[0].password,
            salary: staff[0].salary, department_name: staff[0].department_name, 
            faculty_name: staff[0].faculty_name, room_location_id: staff[0].room_location_id,
            HOD: staff[0].HOD, Coordinator: staff[0].Coordinator, role: staff[0].role, 
            gender: staff[0].gender, courses_taught: staff[0].courses_taught, assign_slots: staff[0].assign_slots,
            schedule: staff[0].schedule, Phone_Number: staff[0].Phone_Number, Attendance: staff[0].Attendance
        })
        await newStaff.save()


        res.send("Deleted successfully!")
 
    }      
})

router.route('/Instructor/removeAcademicSlot')
.delete(async (req,res) => {
    var AssignedSlot = await Slot.find({room_location_id: req.body.room_location_id, 
        course_id: req.body.course_id, day: req.body.day, which_slot: req.body.which_slot, 
        academic_member_id: req.body.staff_id})

    if(AssignedSlot.length === 0){
        res.send("The academic member is already unassigned to this slot")
    }else{
        //updating slot
        await Slot.findOneAndRemove({room_location_id: req.body.room_location_id, 
            course_id: req.body.course_id, day: req.body.day, which_slot: req.body.which_slot, 
            academic_member_id: req.body.staff_id})
        AssignedSlot[0].academic_member_id = undefined

        const newAssignedSlot = new Slot({
            course_id: AssignedSlot[0].course_id, day: AssignedSlot[0].day, 
            room_location_id: AssignedSlot[0].room_location_id, which_slot: AssignedSlot[0].which_slot,
            academic_member_id: AssignedSlot[0].academic_member_id
        })

        await newAssignedSlot.save()

        //updating course
        var course = await Course.find({id: req.body.course_id})
        await Course.findOneAndRemove({id: req.body.course_id})
        course[0].numberOfUnassignedSlots += 1 
        course[0].numberOfAssignedSlots -= 1
        course[0].course_coverage = course[0].numberOfAssignedSlots/ (course[0].numberOfAssignedSlots + 
            course[0].numberOfUnassignedSlots)

        const newCourse = new Course({
            id: course[0].id, name: course[0].name, department_name: course[0].department_name,
            course_coverage: course[0].course_coverage, academic_coordinator_id: course[0].academic_coordinator_id,
            slots: course[0].slots, numberOfAssignedSlots: course[0].numberOfAssignedSlots,
            numberOfUnassignedSlots: course[0].numberOfUnassignedSlots
        })

        await newCourse.save()
        
        //updating staff
        var staff = await Academic_Member.find({id: req.body.staff_id})
        await Academic_Member.findOneAndRemove({id: req.body.staff_id})
                //remove from schedule
        const index = staff[0].schedule.indexOf(slot => slot.course_id === req.body.course_id && slot.day === req.body.day &&
            slot.room_location_id === req.body.room_location_id && slot.which_slot === req.body.which_slot && 
            slot.academic_member_id === req.body.staff_id)
        if(index > -1){
            staff[0].schedule.splice(index, 1)
        }    

                //update course taught and assign slot
        const i = staff[0].courses_taught.indexOf(req.body.course_id)
        staff[0].assign_slots[i] -= 1
        if(staff[0].assign_slots[i] === 0){
            if(i > -1){
                staff[0].courses_taught.splice(i, 1)
                staff[0].assign_slots.splice(i,1)
            }   
        }

        const newStaff = Academic_Member({
            id: staff[0].id, name: staff[0].name, email: staff[0].email, password: staff[0].password,
            salary: staff[0].salary, department_name: staff[0].department_name, 
            faculty_name: staff[0].faculty_name, room_location_id: staff[0].room_location_id,
            HOD: staff[0].HOD, Coordinator: staff[0].Coordinator, role: staff[0].role, 
            gender: staff[0].gender, courses_taught: staff[0].courses_taught, assign_slots: staff[0].assign_slots,
            schedule: staff[0].schedule, Phone_Number: staff[0].Phone_Number, Attendance: staff[0].Attendance
        })
        await newStaff.save()


        res.send("Deleted successfully!")
 
    }      
})

router.route('/Instructor/updateAcademicSlot')
.put(async (req,res) => {
    
})


router.route('/Instructor/assignAcademicCoordinator')
.post(tokenVerification, async (req,res) => {
    var TA = await Academic_Member.find({id: req.body.staff_id})
    const instructor = await Academic_Member.find({id: req.data.id})

    //wrong TA ID
    if(TA.length === 0){
        res.send("There is no TA found with such ID")
    //staff is not a TA    
    }else if(TA[0].role !== "TA"){
        res.send("This ID doesn't belong to a TA")
    //
    }else if(!instructor[0].courses_taught.includes(req.body.course_id)){
        res.send("This course is not assigned to you")
    }else if(!TA[0].courses_taught.includes(req.body.course_id)){
        res.send("This course is not assigned to this TA")
    }else{
        await Academic_Member.findOneAndRemove({id: req.body.staff_id})
        TA[0].Coordinator = true 

        const newTA = Academic_Member({
            id: TA[0].id, name: TA[0].name, email: TA[0].email, password: TA[0].password,
            salary: TA[0].salary, department_name: TA[0].department_name, 
            faculty_name: TA[0].faculty_name, room_location_id: TA[0].room_location_id,
            HOD: TA[0].HOD, Coordinator: TA[0].Coordinator, role: TA[0].role, 
            gender: TA[0].gender, courses_taught: TA[0].courses_taught, assign_slots: TA[0].assign_slots,
            schedule: TA[0].schedule, Phone_Number: TA[0].Phone_Number, Attendance: TA[0].Attendance
        })
        await newTA.save()

        res.send("This TA became a course coordinator successfully!")

    }

})




module.exports = router