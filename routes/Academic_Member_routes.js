const express = require('express')

const router = express.Router()
const Academic_Member = require('../models/Academic_Member')
const Request = require('../models/requests')
const Course = require('../models/course')
const Blocklist = require('../models/Blocklist')
const jwt = require('jsonwebtoken')

require('dotenv').config()

var autoIncID=0

const tokenVerification = async (req,res,next) => {
    const token = req.headers.token
    if(token){
       // if((blockList.filter((token)=>token === req.headers.token)).length === 0){
           const blockList = await Blocklist.find({name: req.headers.token})
           if(blockList.length === 0){
            try{
                const correctToken = jwt.verify(token, process.env.TOKEN_SECRET)
                console.log(correctToken)
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


function day_getter(num){
    if(num === 0 ){
        return "Sunday"
    }
    else if(num === 1){
        return "Monday"
    }
    else if(num === 2){
        return "Tuesday"
    }
    else if(num === 3){
        return "Wednesday"
    }
    else if(num === 4){
        return "Thursday"
    }
    else if(num === 5){
        return "Friday"
    }
    else if(num === 6){
        return "Saturday"
    }
    

}

/////////////////////VIEW ACADEMIC MEMBER SCHEDULE/REPLACEMENT REQUESTS//////////////////////

router.route('/AcademicMember/viewAcademicMemberSchedule/:id')
.get(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{
    const academic_member =await Academic_Member.find({
        id:req.params.id
    })
    if(academic_member.length===0)
    res.send("the inputed academic member's id enterd is invalid")

      else{
        res.send("Schedule:" + academic_member[0].schedule)
      } 
}
 
})

///////////////////////////////VIEW ALL REPLACEMENT REQUESTS/////////////////////////////////

router.route('/AcademicMember/viewAllReplacementRequests')
.get(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{
    const all_replacement_requests= await Request.find({
        type_of_request:"replacement"
    })
    res.send(all_replacement_requests)
}
})

////////////////////////////////////SEND REPLACEMENT REQUEST///////////////////////////////////////

router.route('/AcademicMember/sendReplacementRequest')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{
    
    const requesting_member= await Academic_Member.find({
        id:req.data.id
    })
    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const replacement_member= await Academic_Member.find({
        id:req.body.replacement_member_id
    })
    if(replacement_member[0].department_name!==requesting_member[0].department_name){
        res.send("the repuesting member department name is not the same as the replacemnt member department name")
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
    if(members_in_his_department_and_teaching_the_same_course.filter(item => item.id.includes(req.body.replacement_member_id)).length  !==0){
            console.log(new Date(req.body.target_day).toString())
            console.log(Date(Date.now()).toString())
        if(new Date(req.body.target_day).getTime()> Date(Date.now()).getTime()){
                const request_model = new Request({
                    id:"R1",
                    target_day:new Date(req.body.target_day),
                    date_of_request:new Date(Date.now()),
                    type_of_request:"replacement",
                    status_of_request:"pending",
                    sender_id:  req.data.id,
                    destination_id :req.body.replacement_member_id//momkn yekon id 

                })

                await request_model.save().then(doc => {
                    res.send(doc);
                })
                .catch(err => {
                console.error(err)
                })

                const new_notification= new Notification({
                    request_id:"R1",
                    status_of_request:"pending",
                    sender_id: req.data.id,
                    destination_id:req.body.replacement_member_id,
                })

                await new_notification.save().then(doc => {
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
}

})

////////////////////////////////////VIEW ALL TA REQUEST///////////////////////////////////////

router.route('/AcademicMember/TA_AllRequests')
.get(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const all_requests_of_the_entered_TA_id= await Request.find({
        destination_id:req.body.TA_id
    })
    
    if(all_requests_of_the_entered_TA_id.filter(item => item.id.includes(req.body.request_id)) !==0){
    
    const all_info_about_the_request= await Request.find({
        id:req.body.request_id
    })
        await Request.findByIdAndRemove({
            id:req.body.request_id
        })
    
        const request_model = new Request({
            id:all_info_about_the_request[0].id,
            target_day:all_info_about_the_request[0].target_day,
            date_of_request:all_info_about_the_request[0].date_of_request,
            type_of_request:all_info_about_the_request[0].type_of_request,
            status_of_request:req.body.status_of_request,
            sender_id: req.body.TA_id ,
            destination_id : all_info_about_the_request[0].sender_id
            
        })
    
        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
    
    
        const new_notification= new Notification({
            request_id:all_info_about_the_request[0].id,
            status_of_request:req.body.status_of_request,
            sender_id: req.body.TA_id ,
            destination_id:all_info_about_the_request[0].sender_id,
        })
    
        await new_notification.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
    
    
    }
    else{
        res.send("the entered request id doesnot exist in the TA requests list")
    }
}
})

////////////////////////////////////SEND SLOT LINKING///////////////////////////////////////

router.route('/AcademicMember/sendSlotLinkingRequest')
.post(tokenVerification, async( req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const requesting_member= await Academic_Member.find({
        id:req.data.id
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
  
    console.log(requesting_member[0].schedule.filter(item => item[1]===(req.body.slot_day) && item[3]===(req.body.which_slot)))
    
    if(requesting_member[0].schedule.filter(item => item[1]===(req.body.slot_day) && item[3]===(req.body.which_slot)).length ===0){
        
        
        

        if(course[0].slots.filter(item => item[1]===(req.body.slot_day) && item[3]===(req.body.which_slot)).length !==0 ){

        const request_model = new Request({
            id:55555,
            type_of_request:"slot_linking",
            status_of_request:"pending",
            sender_id:  req.data.id,
            destination_id :course[0].academic_coordinator_id,
            target_day:new Date(req.body.target_day),
            date_of_request:new Date(Date.now()),

        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

        const new_notification= new Notification({
            request_id:55555,
            status_of_request:"pending",
            sender_id: req.data.id,
            destination_id:course[0].academic_coordinator_id,
        })

        await new_notification.save().then(doc => {
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
        res.send("the requesting member doesnot have an empty slot in his schdule at this slot time")
    }

}
})


//////////////////////////////////SEND CHANGE DAY OFF REQUEST////////////////////////////////////

router.route('/AcademicMember/send_change_day_off_request')
.post(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const requesting_member= await Academic_Member.find({
        id:req.data.id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })
    if(Hod.length===0){
        res.send("the department of the requesting member doesnot have an HOD yet ")
    }

    if(new Date(req.body.target_day).toString()> Date(Date.now()).toString()){
        if(req.body.document){
        const request_model = new Request({
            id:5,
            type_of_request:"change_day_off",
            status_of_request:"pending",
            sender_id:  req.data.id,
            destination_id :Hod[0].id,
            document:req.body.document,
            target_day:new Date(req.body.target_day),
        date_of_request:new Date(Date.now()),

        })


        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
    }else{

        const request_model = new Request({
            id:5,
            type_of_request:"change_day_off",
            status_of_request:"pending",
            sender_id:  req.data.id,
            destination_id :Hod[0].id,
            document:req.body.document,
            target_day:new Date(req.body.target_day),
            date_of_request:new Date(Date.now()),


    })
    await request_model.save().then(doc => {
        res.send(doc);
    })
    .catch(err => {
    console.error(err)
    })


    const new_notification= new Notification({
        request_id:5,
        status_of_request:"pending",
        sender_id: req.data.id,
        destination_id:Hod[0].id,
    })

    await new_notification.save().then(doc => {
        res.send(doc);
    })
    .catch(err => {
    console.error(err)
    })


    
}

}else{

    res.send("date of sending the request(date_of_request) has passed(is bigger than) the date of the target day(replacement day)")
}

}
})
    
////////////////////////////////SUBMIT ANNUAL LEAVE REQUEST/////////////////////////////////////

router.route('/AcademicMember/submit_annual_leave_request')
.post(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{
    
    const requesting_member= await Academic_Member.find({
        id:req.data.id
    })
    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })
    if(Hod.length===0){
        res.send("the department of the requesting member doesnot have an HOD yet ")
    }
  
   
if(new Date(req.body.target_day).getTime()> new Date(Date.now()).getTime()){
        const request_model = new Request({
            id:"222222",
            target_day:new Date(req.body.target_day),
            date_of_request:new Date(Date.now()),
            type_of_request:"annual_leave",
            status_of_request:"pending",
            sender_id:  req.data.id,
            destination_id :Hod[0].id
        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

        const new_notification= new Notification({
            request_id:"222222",
            status_of_request:"pending",
            sender_id: req.data.id,
            destination_id:Hod[0].id,
        })
    
        await new_notification.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
    
    

        
    }
    else{
        res.send("date of sending the request(date_of_request) has passed(is bigger than) the date of the target day")
    }



}
})

/////////////////////////////////SUBMIT SICK LEAVE REQUEST///////////////////////////////////////

 router.route('/AcademicMember/submit_sick_leave_request')
.post(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const requesting_member= await Academic_Member.find({
        id:req.data.id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })
    if(Hod.length===0){
        res.send("the department of the requesting member doesnot have an HOD yet ")
    }

if(((new Date(Date.now())) - (new Date(req.body.target_day))) /1000/60/60  <= 72){

    const request_model = new Request({
        id:"s87",
        type_of_request:"sick_leave",
        status_of_request:"pending",
        target_day:new Date(req.body.target_day),
        date_of_request:new Date(Date.now()),
        sender_id:  req.data.id,
        destination_id :Hod[0].id,
        
    })

    await request_model.save().then(doc => {
        res.send(doc);
    })
    .catch(err => {
    console.error(err)
    })

    const new_notification= new Notification({
        request_id:"s87",
        status_of_request:"pending",
        sender_id: req.data.id,
        destination_id:Hod[0].id,
    })

    await new_notification.save().then(doc => {
        res.send(doc);
    })
    .catch(err => {
    console.error(err)
    })


}
else{
    res.send("sick leave request is not submitted with in the maximum three days after the sick day")
}

}
})

///////////////////////////////SUBMIT ACCIDENTAL LEAVE REQUEST////////////////////////////////////

 router.route('/AcademicMember/submit_accidental_leave_request')
.post(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const requesting_member= await Academic_Member.find({
        id:req.data.id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })
    if(Hod.length===0){
        res.send("the department of the requesting member doesnot have an HOD yet ")
    }
  
    if(requesting_member[0].accidental_balance !==0){
        const request_model = new Request({
            id:"8888",
            type_of_request:"accidental_leave",
            status_of_request:"pending",
            target_day:new Date(req.body.target_day),
            date_of_request:new Date(Date.now()),
            sender_id:  req.data.id,
            destination_id :Hod[0].id,
        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

        const new_notification= new Notification({
            request_id:"8888",
            status_of_request:"pending",
            sender_id: req.data.id,
            destination_id:Hod[0].id,
        })
    
        await new_notification.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
    
    }
    else{
        res.send("your accidental balance is 0")
    }
}
})

////////////////////////////////SUBMIT COMPENSATION REQUEST///////////////////////////////////////

router.route('/AcademicMember/submit_compensation_request')
.post(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{
    const requesting_member= await Academic_Member.find({
        id:req.data.id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })
    if(Hod.length===0){
        res.send("the department of the requesting member doesnot have an HOD yet ")
    }
    // console.log(requesting_member[0].Attendance.dayOff)
    // console.log((new Date(req.body.target_day)))
    // console.log(day_getter(new Date(req.body.target_day).getDay()))

    if(requesting_member[0].Attendance.dayOff === day_getter(new Date(req.body.target_day).getDay())){
        if(req.body.reason_of_compensation){
            const request_model = new Request({
                id:"0000999",
                type_of_request:"compensation",
                status_of_request:"pending",
                target_day: new Date(req.body.target_day),
                date_of_request:new Date(Date.now()),
                sender_id:  req.data.id,
                destination_id :Hod[0].id,
                document:req.body.reason_of_compensation
    
            })
    
            await request_model.save().then(doc => {
                res.send(doc);
            })
            .catch(err => {
            console.error(err)
            })

            const new_notification= new Notification({
                request_id:"0000999",
                status_of_request:"pending",
                sender_id: req.data.id,
                destination_id:Hod[0].id,
                reason:req.body.reason_of_compensation
            })
        
            await new_notification.save().then(doc => {
                res.send(doc);
            })
            .catch(err => {
            console.error(err)
            })
        
            
    
        }
        else{
            res.send("you must enter a valid reason for your compensation")
        }

    }
    else{
        res.send("the compensation day of the request is not your day off !")
    }
        
}
})

////////////////////////////////////SUBMIT MATERNITY REQUEST///////////////////////////////////////

router.route('/AcademicMember/submit_maternity_request')
.post(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const requesting_member= await Academic_Member.find({
        id:req.data.id
    })

    if(requesting_member.length ===0){
        res.send("the requesting member id is invalid")
    }

    const Hod = await Academic_Member.find({
        HOD:true,
        department_name:requesting_member[0].department_name
    })
    if(Hod.length===0){
        res.send("the department of the requesting member doesnot have an HOD yet")
    }

    if(requesting_member[0].gender === "female"){
        const request_model = new Request({
            id:"m77",
            type_of_request:"maternity",
            status_of_request:"pending",
            target_day: new Date(req.body.target_day),
            date_of_request:new Date(Date.now()),
            sender_id:  req.data.id,
            destination_id :Hod[0].id,
            document:req.body.document
        
        })

        await request_model.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })

        const new_notification= new Notification({
            request_id:"m77",
            status_of_request:"pending",
            sender_id: req.data.id,
            destination_id:Hod[0].id,
            reason:req.body.document
        })
    
        await new_notification.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
    
        

    }
    else{
        res.send("this request can be submitted by female members only")
    }
        
}

})
            
///////////////////////////////////VIEW STATUS OF ALL REQUESTS///////////////////////////////////////

router.route('/AcademicMember/view_status_of_all_requests')
.get(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    
    const all_requests =await Request.find({})
    
    var result=""
    for(i=0 ;i<all_requests.length;i++){
        result+=
    "request_id:" +all_requests[i].id  +"\n" +
    "target_day:"+all_requests[i].target_day +"\n"+
            "date_of_request:"+all_requests[i].date_of_request +"\n"+
            "type_of_request:" + all_requests[i].type_of_request +"\n"+
            "status_of_request:" + all_requests[i].status_of_request +"\n"+
            "sender_id:" + all_requests[i].sender_id +"\n"+ 
            "destination_id:" +all_requests[i].destination_id + "\n"+
            "document:" +all_requests[i].document + "\n" + "\n"
    }
    res.send(result.length === 0 ? "there dosenot exist any requests" : result)


}
})

////////////////////////////////////VIEW ACCEPTED REQUESTS///////////////////////////////////////

router.route('/AcademicMember/view_accepted_requests')
.get(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const all_requests =await Request.find({})
    var result=""
    for(i=0 ;i<all_requests.length;i++){
        if(all_requests[i].status_of_request === "accepted")
        result+=
        "request_id:" +all_requests[i].id  +"\n" +
        "target_day:"+all_requests[i].target_day +"\n"+
                "date_of_request:"+all_requests[i].date_of_request +"\n"+
                "type_of_request:" + all_requests[i].type_of_request +"\n"+
                "status_of_request:" + all_requests[i].status_of_request +"\n"+
                "sender_id:" + all_requests[i].sender_id +"\n"+ 
                "destination_id:" +all_requests[i].destination_id + "\n"+
                "document:" +all_requests[i].document + "\n" + "\n"
    }
    res.send(result.length === 0 ? "there dosenot exist any accepted requests" : result)
      
}      
})

////////////////////////////////////VIEW PENDING REQUESTS///////////////////////////////////////

router.route('/AcademicMember/view_pending_requests')
.get(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const all_requests =await Request.find({})
    var result=""
    for(i=0 ;i<all_requests.length;i++){
        if(all_requests[i].status_of_request === "pending")
        result+= "request_id:" +all_requests[i].id  +"\n" +
        "target_day:"+all_requests[i].target_day +"\n"+
                "date_of_request:"+all_requests[i].date_of_request +"\n"+
                "type_of_request:" + all_requests[i].type_of_request +"\n"+
                "status_of_request:" + all_requests[i].status_of_request +"\n"+
                "sender_id:" + all_requests[i].sender_id +"\n"+ 
                "destination_id:" +all_requests[i].destination_id + "\n"+
                "document:" +all_requests[i].document + "\n" + "\n"
    }
    res.send(result.length === 0 ? "there dosenot exist any pending requests" : result)
       
}
})

////////////////////////////////////VIEW REJECTED REQUESTS///////////////////////////////////////

router.route('/AcademicMember/view_rejected_requests')
.get(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{
    const all_requests =await Request.find({})
    var result=""
    for(i=0 ;i<all_requests.length;i++){
        if(all_requests[i].status_of_request === "rejected")
        result+= "request_id:" +all_requests[i].id  +"\n" +
        "target_day:"+all_requests[i].target_day +"\n"+
                "date_of_request:"+all_requests[i].date_of_request +"\n"+
                "type_of_request:" + all_requests[i].type_of_request +"\n"+
                "status_of_request:" + all_requests[i].status_of_request +"\n"+
                "sender_id:" + all_requests[i].sender_id +"\n"+ 
                "destination_id:" +all_requests[i].destination_id + "\n"+
                "document:" +all_requests[i].document + "\n" + "\n"
    }
    res.send(result.length === 0 ? "there dosenot exist any rejected requests" : result)
        
}
})

////////////////////////////////CANCEL DAY IS YET TO COME REQUESTS////////////////////////////////

router.route('/AcademicMember/cancel_day_is_yet_to_come_requests')
.delete(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const all_requests =await Request.find({})  

   const all_requests_who_is_day_to_come = all_requests.filter(item => new Date(item.target_day) > new Date(Date.now()))


            if(all_requests_who_is_day_to_come.length !==0){
                if(all_requests_who_is_day_to_come.filter(item => item.id===req.body.request_id) !==0){
                    await Request.findByIdAndRemove({
                        id:req.body.request_id
                    })  
                }
                else{
                    {
                        res.send("the entered request id target day has passed")
                    }
                }
               
            }
            else{
                res.send("all requests have a target day less than the current date")
            } 
}     
        
})

////////////////////////////////////CANCEL PENDING REQUESTS///////////////////////////////////////

router.route('/AcademicMember/cancel_pending_requests')
.delete(tokenVerification, async(req,res)=>{
    if(req.data.role.toLowerCase() === "hr"){
        res.send("Access denied! You must be an Academic Member!")
}
else{

    const all_pending_requests =await Request.find({
        status_of_request:"pending"
    }) 

            if(all_pending_requests.filter((item => item.id.includes(req.body.request_id))).length !==0){
                await Request.findByIdAndRemove({
                    id:req.body.request_id
                })
                res.send("the entered pending request was cancelled successfully")

            }
            else{
                res.send("the entered pending request id is invalid")
            }      
        
}
})

module.exports = router