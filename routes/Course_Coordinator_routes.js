const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Academic_Member = require('../models/Academic_Member')
const room_Location = require('../models/room_Location')
const slots = require('../models/slot')
const Course = require('../models/course')
const Blocklist = require('../models/Blocklist')

require('dotenv').config()

const tokenVerification = async (req,res,next) => {
    const token = req.headers.token
    // console.log("ashraf: " + token)
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
router.route('/Coordinator/addCourseSlot')
.post(tokenVerification, async (req,res)=>{
    const coordinator = await Academic_Member.find({id: req.data.id})
    const room = await room_Location.find({id: req.body.room_location_id})
    const slot = await slots.find({day: req.body.day, room_location_id: req.body.room_location_id,
        which_slot: req.body.which_slot})


    if(coordinator[0].courses_taught){
        if(!coordinator[0].courses_taught.includes(req.body.course_id)){
            res.send("You don't teach this course!")
        }else if(room[0].type_of_Room.toLowerCase() === "office"){
            res.send("Sorry, this is an office room!")
        }else if(slot.length !== 0){
            res.send("Sorry, this room is not available in this slot or location")
        }else{
            var course = await Course.find({id: req.body.course_id})
            await Course.findOneAndRemove({id: req.body.course_id})

            const newSlot = new slots({
                course_id: req.body.course_id,
                day: req.body.day, 
                room_location_id: req.body.room_location_id,
                which_slot: req.body.which_slot
            })
            var array = course[0].slots
            array.push(newSlot)

            // console.log(course[0])
            await newSlot.save()

            const newCourse = new Course({
                id: course[0].id,
                name: course[0].name,
                department_name: course[0].department_name,
                course_coverage: (course[0].numberOfAssignedSlots)
                /(course[0].numberOfAssignedSlots+course[0].numberOfUnassignedSlots+1),
                academic_member_id: course[0].academic_member_id,
                slots: array,
                numberOfAssignedSlots: course[0].numberOfAssignedSlots,
                numberOfUnassignedSlots: course[0].numberOfUnassignedSlots+1
            })


            await newCourse.save()

            res.send("Course slot is added successfully!")

        }
    }

})

router.route('/Coordinator/deleteCourseSlot')
.delete(tokenVerification, async (req,res)=>{
    //remove from slot

    const slot = await slots.find({course_id: req.body.course_id, day: req.body.day, 
        room_location_id: req.body.room_location_id, which_slot: req.body.which_slot})

    if(slot.length===0){
        res.send("There is no such slot!")
    }else{

    //remove the slot from table slots
    await slots.findOneAndRemove({course_id: req.body.course_id, day: req.body.day, 
        room_location_id: req.body.room_location_id, which_slot: req.body.which_slot})

    
    //remove the slot from course slots
    var courses = await Course.find({id: req.body.course_id})
        if(courses[0].slots){
            for(var j=0; j<courses[0].slots.length; j++){
                var slotIteration = courses[0].slots[j] 
                if(slotIteration.day === req.body.day && 
                    slotIteration.room_location_id === req.body.room_location_id && 
                    slotIteration.which_slot === req.body.which_slot){
                    //delete 
                    await Course.findOneAndRemove({id: req.body.course_id})

                    if(j>-1)
                        courses[0].slots.splice(j,1)

                    if(slotIteration.academic_member_id){
                        courses[0].numberOfAssignedSlots -= 1
                    }else{
                        courses[0].numberOfUnassignedSlots -= 1
                    }
                    //update coverage
                    courses[0].course_coverage = courses[0].numberOfAssignedSlots/ 
                    (courses[0].numberOfAssignedSlots + courses[0].numberOfUnassignedSlots)

                    const newCourse = new Course({
                        id: courses[0].id , name: courses[0].name, department_name: courses[0].department_name,
                        course_coverage: courses[0].course_coverage, academic_coordinator_id: courses[0].academic_coordinator_id,
                        slots: courses[0].slots, numberOfAssignedSlots: courses[0].numberOfAssignedSlots,
                        numberOfUnassignedSlots: courses[0].numberOfUnassignedSlots
                    })

                    await newCourse.save()
                }
            }
        }
    
    //remove the slot from academic member schedule
    var staff = await Academic_Member.find()
    for(var i=0; i<staff.length; i++){
        if(staff[i].schedule){
            for(var j=0 ; j<staff[i].schedule.length; j++){
                console.log(staff[i].schedule[j].course_id + staff[i].schedule[j].day +
                    staff[i].schedule[j].room_location_id + staff[i].schedule[j].which_slot )
                    console.log(req.body.course_id + req.body.day +
                        req.body.room_location_id + req.body.which_slot )

                if(staff[i].schedule[j].course_id === req.body.course_id &&
                    staff[i].schedule[j].day === req.body.day &&
                    staff[i].schedule[j].room_location_id === req.body.room_location_id &&
                    parseInt(staff[i].schedule[j].which_slot) === req.body.which_slot){

                        await Academic_Member.findOneAndRemove({id: staff[i].id})

                        staff[i].schedule.splice(j,1)
                            
                        const newStaff = Academic_Member({
                            id: staff[i].id, name: staff[i].name, email: staff[i].email, password: staff[i].password,
                            salary: staff[i].salary, department_name: staff[i].department_name, 
                            faculty_name: staff[i].faculty_name, room_location_id: staff[i].room_location_id,
                            HOD: staff[i].HOD, Coordinator: staff[i].Coordinator, role: staff[i].role, 
                            gender: staff[i].gender, courses_taught: staff[i].courses_taught, assign_slots: staff[i].assign_slots,
                            schedule: staff[i].schedule, Phone_Number: staff[i].Phone_Number, Attendance: staff[i].Attendance
                        })
                        await newStaff.save()


                }
            }
        }
    }
        res.send("Course slot is deleted successfully!")

    }

})

router.route('/Coordinator/updateCourseSlot')
.put(tokenVerification, async (req,res)=>{
    const coordinator = await Academic_Member.find({id: req.data.id})
    const room = await room_Location.find({id: req.body.newroom_location_id})
    const slot = await slots.find({day: req.body.newday, room_location_id: req.body.newroom_location_id,
        which_slot: req.body.newwhich_slot})
    const oldSlot = await slots.find({course_id: req.body.course_id, day: req.body.oldday, room_location_id: req.body.oldroom_location_id,
        which_slot: req.body.oldwhich_slot})   


    if(coordinator[0].courses_taught){
        if(!coordinator[0].courses_taught.includes(req.body.course_id)){
            res.send("You don't teach this course!")
            
        }else if(room.length === 0){
            res.send("Sorry, there is no such room to update!")
        } 
        else if(room[0].type_of_Room.toLowerCase() === "office"){
            res.send("Sorry, this is an office room!")
        }else if(slot.length !== 0){
            res.send("Sorry, this room is not available in this slot or location")
        }else if(oldSlot.length === 0){
            res.send("Sorry, there is no such slot to update")

        }else{

            //remove from slot
            await slots.findOneAndRemove({course_id: req.body.course_id, day: req.body.oldday, room_location_id: req.body.oldroom_location_id,
                which_slot: req.body.oldwhich_slot})  
            //add to slot
            const newSlot = new slots({
                course_id: oldSlot[0].course_id,
                day: req.body.newday,
                room_location_id: req.body.newroom_location_id,
                which_slot: req.body.newwhich_slot,
                academic_member_id: oldSlot[0].academic_member_id
            })

            await newSlot.save()

            
            //update the slot from course slots
            var courses = await Course.find({id: req.body.course_id})
            await Course.findOneAndRemove({id: req.body.course_id})
                if(courses[0].slots){
                    for(var j=0; j<courses[0].slots.length; j++){
                        var slotIteration = courses[0].slots[j] 
                        if(slotIteration.day === req.body.oldday && 
                            slotIteration.room_location_id === req.body.oldroom_location_id && 
                            slotIteration.which_slot === req.body.oldwhich_slot){
                            //update 
                            
                            //courses[0].slots.split(j,1)

                            courses[0].slots[j].day = req.body.newday
                            courses[0].slots[j].room_location_id = req.body.newroom_location_id
                            courses[0].slots[j].which_slot = req.body.newwhich_slot

                            const course = new Course({
                                id: courses[0].id, name:courses[0].name, department_name: courses[0].department_name,
                                course_coverage: courses[0].course_coverage, 
                                academic_coordinator_id: courses[0].academic_coordinator_id, slots: courses[0].slots,
                                numberOfAssignedSlots: courses[0].numberOfAssignedSlots,
                                numberOfUnassignedSlots: courses[0].numberOfUnassignedSlots
                            })

                            await course.save()
                        }
                    }
                }
            


            //update the slot from academic member schedule
            var staff = await Academic_Member.find()
            for(var i=0; i<staff.length; i++){
                if(staff[i].schedule){
                    for(var j=0 ; j<staff[i].schedule.length; j++){
                        // console.log("i: " + i + ", j: " + j)
                       // if(JSON.stringify(oldSlot) === JSON.stringify(staff[i].schedule[j])){
                           if(oldSlot[0].day === staff[i].schedule[j].day && 
                            oldSlot[0].room_location_id === staff[i].schedule[j].room_location_id &&
                            oldSlot[0].which_slot === staff[i].schedule[j].which_slot){
                            // console.log(true)
                            await Academic_Member.findOneAndRemove({id: staff[i].id})

                            staff[i].schedule[j].day = req.body.newday
                            staff[i].schedule[j].room_location_id = req.body.newroom_location_id
                            staff[i].schedule[j].which_slot = req.body.newwhich_slot

                            const newStaff = Academic_Member({
                                id: staff[i].id, name: staff[i].name, email: staff[i].email, password: staff[i].password,
                                salary: staff[i].salary, department_name: staff[i].department_name, 
                                faculty_name: staff[i].faculty_name, room_location_id: staff[i].room_location_id,
                                HOD: staff[i].HOD, Coordinator: staff[i].Coordinator, role: staff[i].role, 
                                gender: staff[i].gender, courses_taught: staff[i].courses_taught, assign_slots: staff[i].assign_slots,
                                schedule: staff[i].schedule, Phone_Number: staff[i].Phone_Number, Attendance: staff[i].Attendance
                            })
                            await newStaff.save()


                        }
                    }
                }
            }
                res.send("Course slot is updated successfully!")

            }
        }
        
        else{
            res.send("Something is undefined. Please make sure of your data entry")
        }
})



module.exports = router