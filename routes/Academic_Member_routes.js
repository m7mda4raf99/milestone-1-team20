const express = require('express')

const router = express.Router()
const Academic_Member = require('../models/Academic_Member')
const Request = require('../models/requests')
const Course = require('../models/course')
const Slot = require('../models/slot')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


/////view_academic_member_schedule and replacement requests info if present
router.route('/Academic_Member/view_academic_member_schedule/:id')
.get(async( req,res)=>{

    const academic_member =await Academic_Member.find({
        id:req.params.id
    })
    if(academic_member.length===0)
    res.send("the inputed academic member enterd is invalid")

    const sender =await Request.find({
        sender_id:req.params.id
    })
    const receiver= await Request.find({
        destination_id:req.params.id
    })
    if(sender.length !==0 && receiver.length === 0){
        if(sender[0].type_of_request ==="replacement" && sender[0].status_of_request ==="Accepted" && sender.length!==0 && academic_member.length !==0){
            res.send("Schedule:" + academic_member[0].schedule + "\n" +
             "request_id:"+sender[0].id +
             "date_of_request:"+sender[0].date_of_request +
             "type_of_request:" + sender[0].type_of_request +
             "status_of_request:" + sender[0].status_of_request +
             "sender_id:" + req.params.id + 
             "destination_id:" + sender[0].destination_id)
        }
        else if(sender[0].type_of_request !=="replacement" && sender[0].status_of_request ==="Accepted" && sender.length!==0 && academic_member.length !==0){
            res.send("Schedule:" + academic_member[0].schedule + "\n" +
            "request_type is not replacement") 
        } 
        else if(sender[0].type_of_request ==="replacement" && sender[0].status_of_request !=="Accepted" && sender.length!==0 && academic_member.length !==0){
            res.send("Schedule:" + academic_member[0].schedule + "\n" +
            "request_type is replacement but it is either pending or rejected") 
        } 
    }
    else if(sender.length ===0 && receiver.length !== 0){
        if(receiver[0].type_of_request ==="replacement" && receiver[0].status_of_request ==="Accepted" && sender.length!==0 && academic_member.length !==0){
            res.send("Schedule:" + academic_member[0].schedule + "\n" +
             "request_id:"+receiver[0].id +
             "date_of_request:"+receiver[0].date_of_request +
             "type_of_request:" + receiver[0].type_of_request +
             "status_of_request:" + receiver[0].status_of_request +
             "sender_id:" + receiver[0].sender_id + 
             "destination_id:" +req.params.id )
        }
        else if(receiver[0].type_of_request !=="replacement" && receiver[0].status_of_request ==="Accepted" && sender.length!==0 && academic_member.length !==0){
            res.send("Schedule:" + academic_member[0].schedule + "\n" +
            "request_type is not replacement") 
        } 
        else if(receiver[0].type_of_request ==="replacement" && receiver[0].status_of_request !=="Accepted" && sender.length!==0 && academic_member.length !==0){
            res.send("Schedule:" + academic_member[0].schedule + "\n" +
            "request_type is replacement but it is either pending or rejected") 
        } 
    }
    else if(sender.length ===0 && receiver.length ===0){
        res.send("Schedule:" + academic_member[0].schedule + "\n" + "this academic member didnot either receiver or send any requests")
    }
})

    //view_all_replacement_requests
    router.route('/Academic_Member/view_all_replacement_requests')
    .get(async( req,res)=>{
       const all_replacement_requests= await Request.find({
           type_of_request:"replacement"
        })
        res.send(all_replacement_requests)
    })

    //send replacement_request
    router.route('/Academic_Member/send_replacement_request')
    .post(async( req,res)=>{

        const requesting_member= await Academic_Member.find({
            id:req.body.requesting_member_id
        })
        if(requesting_member.length ===0){
            res.send("the requesting member id is invalid")
        }
        const members_in_the_same_department_as_the_requesting_member = await Academic_Member.find({
            department_name:requesting_member[0].department_name
            })
            if(members_in_the_same_department_as_the_requesting_member.length ===0){
                res.send("there dosenot exist a member in the same department as the requesting member")
            }
        const members_in_his_department_and_teaching_the_same_course=  members_in_the_same_department_as_the_requesting_member.filter(item => item.courses_taught.includes(req.body.course_id))
        if(members_in_his_department_and_teaching_the_same_course.length ===0){
            res.send("all members in the department as the requesting member do not teach the same course as he")
        }
        if(members_in_his_department_and_teaching_the_same_course.filter(item => item.id.includes(req.body.replacement_member_id)) !==0){
                if(req.body.target_day.getTime() > Date.now.getTime()){
                    const request_model = new Request({
                        id:"177",
                        target_day:req.body.target_day,
                        date_of_request:Date.now,
                        type_of_request:"replacement",
                        status_of_request:"pending",
                        sender_id:  req.body.requesting_member_id,
                        destination_id :req.body.replacement_member_id

                    })

                    await request_model.save().then(doc => {
                        res.send(doc);
                    })
                    .catch(err => {
                    console.error(err)
                    })

                    
                }
                else{
                    res.send("date of sending the request(date_of_request) has passed(is bigger than) the date of the target day(replacement day)")
                }
            }
            else{
                res.send("the replacement member id dosenot teach the same course as the requesting member id course")
            }
    
    })

    router.route('/Academic_Member/send_slot-linking_request')
    .post(async( req,res)=>{

        const requesting_member= await Academic_Member.find({
            id:req.body.requesting_member_id
        })

        if(requesting_member.length ===0){
            res.send("the requesting member id is invalid")
        }

        const course = await Course.find({
            id:req.body.course_id
        })
        if(course.length ===0){
            res.send("the course id is invalid")
        }
        const slot = await Slot.find({
            academic_member_id:req.body.requesting_member_id
        })
        if(slot.length ===0){
            res.send("the requesting member is doesnot have any slots in his/her schedule")
        }

        if(requesting_member[0].schedule.filter(item => item.day.includes(req.body.slot_day) , item2 => item2.which_slot.includes(req.body.which_day)).length !==0){
            
            const course =await Course.find({
                id:req.body.course_id
            })

            if(course[0].slots.filter(item => item.day.includes(req.body.slot_day) , item2 => item2.which_slot.includes(req.body.which_day)).length !==0 ){

            const request_model = new Request({
                id:"177",
                type_of_request:"slot_linking",
                status_of_request:"pending",
                sender_id:  req.body.requesting_member_id,
                destination_id :course[0].academic_coordinator_id

            })

            await request_model.save().then(doc => {
                res.send(doc);
            })
            .catch(err => {
            console.error(err)
            })


        }

        else{
            res.send("the course doesnot have empty slots at the inputted day and which slot ")
        }
    }
        else{
            res.send("the requesting member doesnot have an empty slot in his schdule ")
        }

                })


        
router.route('/Academic_Member/send_change_day_off_request')
.post(async( req,res)=>{

    const requesting_member= await Academic_Member.find({
        id:req.body.requesting_member_id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })

    // await Academic_Member.findOneAndRemove({
    //     id:req.body.requesting_member_id
    // })

    // requesting_member_id[0].Attendace[0].dayOff =req.body.day_off
    //     const academic_model = new Academic_Member({
    //             id:req.body.requesting_member_id,
    //             name:requesting_member_id[0].name,
    //             email:requesting_member_id[0].email,
    //             password:requesting_member_id[0].password,
    //             salary:requesting_member_id[0].salary,
    //             department_name:Hod[0].department_name,
    //             faculty_name:requesting_member_id[0].faculty_name,
    //             room_location_id:requesting_member_id[0].room_location_id,
    //             HOD:requesting_member_id[0].Hod,
    //             Coordinator:requesting_member_id[0].Coordinator,
    //             role:requesting_member_id[0].role,
    //             courses_taught:requesting_member_id[0].courses_taught,
    //             assign_slots:requesting_member_id[0].assign_slots,
    //             schedule:requesting_member_id[0].schedule,
    //             Phone_Number:requesting_member_id[0].Phone_Number,
    //             Attendace:requesting_membe[0].Attendace,
                
    //         })
    //         await academic_model.save().then(doc => {
    //             res.send(doc);
    //         })
    //         .catch(err => {
    //         console.error(err)
    //         })

        const request_model = new Request({
            id:"177",
            type_of_request:"change_day_off",
            status_of_request:"pending",
            sender_id:  req.body.requesting_member_id,
            destination_id :Hod.id,
            

        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

            })


router.route('/Academic_Member/submit_annual_leave_request')
.post(async( req,res)=>{

    const requesting_member= await Academic_Member.find({
        id:req.body.requesting_member_id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })

        const request_model = new Request({
            id:"177",
            type_of_request:"annual_leave",
            status_of_request:"pending",
            sender_id:  req.body.requesting_member_id,
            destination_id :Hod.id,
            

        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

            })

 router.route('/Academic_Member/submit_sick_leave_request')
.post(async( req,res)=>{

    const requesting_member= await Academic_Member.find({
        id:req.body.requesting_member_id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })

        const request_model = new Request({
            id:"177",
            type_of_request:"sick_leave",
            status_of_request:"pending",
            sender_id:  req.body.requesting_member_id,
            destination_id :Hod.id,
            

        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

            })

 router.route('/Academic_Member/submit_accidental_leave_request')
.post(async( req,res)=>{

    const requesting_member= await Academic_Member.find({
        id:req.body.requesting_member_id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })

        const request_model = new Request({
            id:"177",
            type_of_request:"accidental_leave",
            status_of_request:"pending",
            sender_id:  req.body.requesting_member_id,
            destination_id :Hod.id,
            

        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

            })


router.route('/Academic_Member/submit_compensation_request')
.post(async( req,res)=>{

    const requesting_member= await Academic_Member.find({
        id:req.body.requesting_member_id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })

        const request_model = new Request({
            id:"177",
            type_of_request:"compensation",
            status_of_request:"pending",
            sender_id:  req.body.requesting_member_id,
            destination_id :Hod.id,
            document:req.body.reason_of_compensation

        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

            })


router.route('/Academic_Member/submit_maternity_request')
.post(async( req,res)=>{

    const requesting_member= await Academic_Member.find({
        id:req.body.requesting_member_id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })

        const request_model = new Request({
            id:"177",
            type_of_request:"maternity",
            status_of_request:"pending",
            sender_id:  req.body.requesting_member_id,
            destination_id :Hod.id,
        
        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

            })

router.route('/Academic_Member/view_status_of_all_requests')
.get(async( req,res)=>{

    const all_requests =await Request.find({})
    const result=""
    for(i=0 ;i<all_requests.length;i++){
        result+= all_requests[i].status_of_request + "\n"
    }
    res.send(result)
          
})

router.route('/Academic_Member/view_accepted_requests')
.get(async( req,res)=>{

    const all_requests =await Request.find({})
    const result=""
    for(i=0 ;i<all_requests.length;i++){
        if(all_requests[i].status_of_request === "accepted")
        result+= all_requests[i].id + "\n"
    }
    res.send(result)
          
})
router.route('/Academic_Member/view_pending_requests')
.get(async( req,res)=>{

    const all_requests =await Request.find({})
    const result=""
    for(i=0 ;i<all_requests.length;i++){
        if(all_requests[i].status_of_request === "pending")
        result+= all_requests[i].id + "\n"
    }
    res.send(result)
           
})
router.route('/Academic_Member/view_rejected_requests')
.get(async( req,res)=>{

    const all_requests =await Request.find({})
    const result=""
    for(i=0 ;i<all_requests.length;i++){
        if(all_requests[i].status_of_request === "rejected")
        result+= all_requests[i].id + "\n"
    }
    res.send(result)
        
})

router.route('/Academic_Member/cancel_day_is_yet_to_come_requests')
.delete(async( req,res)=>{

    const all_pending_requests =await Request.find({
        status_of_request:"pending"
    })
            if(all_pending_requests.filter((item => item.id.includes(req.body.request_id))).length !==0){
                if(all_pending_requests.filter((item => item.id.includes(req.body.request_id))).target_day > Date.now){
                    await Request.findByIdAndRemove({
                        id:req.body.request_id
                    })
                }
                else{
                    {
                        res.send("the entered pending request target day is in the past")
                    }
                }
               
            }
            else{
                res.send("the entered pending request id is invalid")
            }      
        
})

router.route('/Academic_Member/cancel_pending_requests')
.delete(async( req,res)=>{

    const all_pending_requests =await Request.find({
        status_of_request:"pending"
    })
            if(all_pending_requests.filter((item => item.id.includes(req.body.request_id))).length !==0){
                await Request.findByIdAndRemove({
                    id:req.body.request_id
                })

            }
            else{
                res.send("the entered pending request id is invalid")
            }      
        
})




module.exports = router