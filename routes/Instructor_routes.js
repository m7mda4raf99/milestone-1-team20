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


//////////////////////////////////////////VIEW COVERAGE////////////////////////////////////////////

router.route('/Instructor/viewCoverages')
.get(tokenVerification, async (req,res)=>{
    if(req.data.role.toLowerCase() === "instructor"){
        const instructor = await Academic_Member.find({id: req.data.id})

        if(instructor[0].courses_taught){
            if(instructor[0].courses_taught.length===0)
                res.send("You don't have any courses assigned in!")
            else{
                var course, result = []
                for(var i=0; i<instructor[0].courses_taught.length; i++){
                    course = await Course.find({id : instructor[0].courses_taught[i]})

                    result.push({"id": course[0].id, "name": course[0].name, "course_coverage": course[0].course_coverage})
                }
                
                res.send(result)
            }
    }else
         res.send("You don't have any courses assigned in!")
    }else{
        res.send("Access denied. You must be an instructor!")
    }

})

/////////////////////////////////////////VIEW COURSE SLOTS////////////////////////////////////////////

router.route('/Instructor/viewCoursesSlots')
.get(tokenVerification, async (req,res)=>{
    if(req.data.role.toLowerCase() === "instructor"){
        const instructor = await Academic_Member.find({id: req.params.id})

        if(instructor[0].courses_taught){
            if(instructor[0].courses_taught.length===0){
                res.send("You should be assigned to any course!")
            }else{
                var course, result = []
                for(var i=0; i<instructor[0].courses_taught.length; i++){
                    course = await Course.find({id: instructor[0].courses_taught[i]})
                    if(instructor[0].schedule){
                        for(var j=0; j<instructor[0].schedule.length; j++){
                            if(instructor[0].schedule[j].course_id === course[0].id){
                                result.push({"course_id":course[0].id, "course_name":course[0].name, 
                                "day": instructor[0].schedule[j].day, "which_slot": instructor[0].schedule[j].which_slot,
                                "academic_member_id": instructor[0].schedule[j].academic_member_id})

                            }
                        }
                    }

                }
                res.send(result)
            }

        }else
        res.send("You should be assigned to any course!")
        }
    else{
        res.send("Access denied. You must be an instructor!")
    }

})

////////////////////////////////////////VIEW STAFF PROFILES////////////////////////////////////////////

router.route('/Instructor/viewStaffProfiles')
.get(tokenVerification, async (req,res) => {
    if(req.data.role.toLowerCase() === "instructor"){
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
            var result= []
    
            for(var i=0; i<staff.length;i++){
                result.push(staff[i])       
            }

            res.send(result)
    }else{
        res.send("Access denied. You must be an instructor!")
    }
})

////////////////////////////////////ASSIGN ACADEMIC MEMBER TO A SLOT ////////////////////////////////////////////

router.route('/Instructor/assignAcademicToSlot')
.post(tokenVerification, async (req,res) => {
    if(req.data.role.toLowerCase() === "instructor"){

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
        
        else if(staff[0].role !== "TA" && req.data.id !== req.body.staff_id){
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

            const newSlot = new Slot({
                course_id: unAssignedSlot[0].course_id, day: unAssignedSlot[0].day,
                room_location_id: unAssignedSlot[0].room_location_id, which_slot: unAssignedSlot[0].which_slot,
                academic_member_id: unAssignedSlot[0].academic_member_id
            })
            await newSlot.save()
            .then(response => {}).catch(err => {console.log(err)})

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
            .then(response => {}).catch(err => {console.log(err)})

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
            .then(response => {}).catch(err => {console.log(err)})
            

            res.send("Staff member is assigned to this course slot successfully!")
        }
    }
    else{
        res.send("Something is undefined. Please make sure of your data entry")

    }
    }
else{
    res.send("Access denied.  You must be an instructor! ")
}
})

/////////////////////////////////UPDATE AN ACADEMIC MEMBER IN A SLOT////////////////////////////////////////////

router.route('/Instructor/updateAcademicSlot')
.put(tokenVerification, async (req,res) => {
    if(req.data.role.toLowerCase() === "instructor"){
        var instructor = await Academic_Member.find({id: req.data.id})
        var slot = await Slot.find({course_id: req.body.course_id, academic_member_id: req.body.oldStaff_id, 
            room_location_id: req.body.room_location_id, day: req.body.day, which_slot: req.body.which_slot })

        var staff = await Academic_Member.find({id: req.body.newStaff_id})

        if(instructor[0] && instructor[0].courses_taught && staff[0] && req.data){

            //updating slot of a course he is not assigned to
            if((instructor[0].courses_taught.filter(item => item === req.body.course_id)).length === 0){
                res.send("You are not assigned to this course!")
            }

            //there is no such slot to update 
            else if(slot.length === 0){
                res.send("There is no such slot to update!")
            }

            else if(staff[0].role !== "TA" && req.data.id !== req.body.newStaff_id){
                res.send("Instructor can't assign another instructor")
            }

            else{
                var oldStaff = await Academic_Member.find({id: req.body.oldStaff_id})
                var newStaff = await Academic_Member.find({id: req.body.newStaff_id})

                //updating staff to this slot
                await Slot.findOneAndRemove({course_id: req.body.course_id, academic_member_id: req.body.staff_id, 
                    room_location_id: req.body.room_location_id, day: req.body.day, which_slot: req.body.which_slot }) 

                slot[0].academic_member_id = req.body.newStaff_id
                
                const newSlot = new Slot({
                    course_id: slot[0].course_id, day: slot[0].day,
                    room_location_id: slot[0].room_location_id, which_slot: slot[0].which_slot,
                    academic_member_id: slot[0].academic_member_id
                })
                await newSlot.save()
                .then(response => {}).catch(err => {console.log(err)})

                //updating old member
                await Academic_Member.findOneAndRemove({id: req.body.oldStaff_id})
                
                        //remove from schedule
                const index = oldStaff[0].schedule.indexOf(slot => slot.course_id === req.body.course_id && 
                    slot.day === req.body.day && slot.room_location_id === req.body.room_location_id && 
                    slot.which_slot === req.body.which_slot && slot.academic_member_id === req.body.oldStaff_id)
               
                if(index > -1){
                    oldStaff[0].schedule.splice(index, 1)
                }    

                        //update course taught and assign slot
                const i = oldStaff[0].courses_taught.indexOf(req.body.course_id)
                oldStaff[0].assign_slots[i] -= 1
                if(oldStaff[0].assign_slots[i] === 0){
                    if(i > -1){
                        oldStaff[0].courses_taught.splice(i, 1)
                        oldStaff[0].assign_slots.splice(i,1)
                    }   
                }

                const newOldStaff = Academic_Member({
                    id: oldStaff[0].id, name: oldStaff[0].name, email: oldStaff[0].email, password: oldStaff[0].password,
                    salary: oldStaff[0].salary, department_name: oldStaff[0].department_name, 
                    faculty_name: oldStaff[0].faculty_name, room_location_id: oldStaff[0].room_location_id,
                    HOD: oldStaff[0].HOD, Coordinator: oldStaff[0].Coordinator, role: oldStaff[0].role, 
                    gender: oldStaff[0].gender, courses_taught: oldStaff[0].courses_taught, assign_slots: oldStaff[0].assign_slots,
                    schedule: oldStaff[0].schedule, Phone_Number: oldStaff[0].Phone_Number, Attendance: oldStaff[0].Attendance
                })
                await newOldStaff.save()
                .then(response => {}).catch(err => {console.log(err)})

                //updating new member
                await Academic_Member.findOneAndRemove({id: req.body.newStaff_id})

                newStaff[0].schedule.push(newSlot)

                if(newStaff[0].courses_taught.includes(req.body.course_id)){
                    newStaff[0].assign_slots[newStaff[0].courses_taught.indexOf(req.body.course_id)] += 1
                }else{
                    newStaff[0].courses_taught.push(req.body.course_id)
                    newStaff[0].assign_slots.push(1)
                }
                const newStaffMember = Academic_Member({
                    id: newStaff[0].id, name: newStaff[0].name, email: newStaff[0].email, password: newStaff[0].password,
                    salary: newStaff[0].salary, department_name: newStaff[0].department_name, 
                    faculty_name: newStaff[0].faculty_name, room_location_id: newStaff[0].room_location_id,
                    HOD: newStaff[0].HOD, Coordinator: newStaff[0].Coordinator, role: newStaff[0].role, 
                    gender: newStaff[0].gender, courses_taught: newStaff[0].courses_taught, assign_slots: newStaff[0].assign_slots,
                    schedule: newStaff[0].schedule, Phone_Number: newStaff[0].Phone_Number, Attendance: newStaff[0].Attendance
                })
                await newStaffMember.save()
                .then(response => {}).catch(err => {console.log(err)})

                res.send("This slot is updated to a new staff member!")

            }


        }else{
            res.send("Something is undefined. Please make sure of your data entry")
        }
    
    }
    else{
        res.send("Access denied. You must be an instructor! ")
    }
})

/////////////////////////////////////DELETE ACADEMIC MEMBER FROM A SLOT////////////////////////////////////////////

router.route('/Instructor/deleteAcademicSlot')
.delete(tokenVerification, async (req,res) => {
    if(req.data.role.toLowerCase() === "instructor"){
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
            .then(response => {}).catch(err => {console.log(err)})
    
    
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
            .then(response => {}).catch(err => {console.log(err)})
    
            
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
            .then(response => {}).catch(err => {console.log(err)})
    
    
    
            res.send("Deleted successfully!")
     
        }      
    }
    else{
        res.send("Access denied. You must be an instructor!")
    }
})

////////////////////////////////////REMOVE ACADEMIC MEMBER FROM A SLOT////////////////////////////////////////////

router.route('/Instructor/removeAcademicSlot')
.delete(tokenVerification, async (req,res) => {
    if(req.data.role.toLowerCase() === "instructor"){
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
            .then(response => {}).catch(err => {console.log(err)})
    
    
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
            .then(response => {}).catch(err => {console.log(err)})
    
    
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
            .then(response => {}).catch(err => {console.log(err)})
    
    
    
            res.send("Removed successfully!")
     
        }     
    }
    else{
        res.send("Access denied. You must be an instructor!")
    }
})

///////////////////////////////////ASSIGN ACADEMIC MEMBER AS A COORDINATOR////////////////////////////////////////////

router.route('/Instructor/assignAcademicCoordinator')
.post(tokenVerification, async (req,res) => {
    if(req.data.role.toLowerCase() === "instructor"){
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
            .then(response => {}).catch(err => {console.log(err)})


            res.send("This TA became a course coordinator successfully!")

        }

    }
    else{
        res.send("Access denied. You must be an instructor!")
    }
})




module.exports = router