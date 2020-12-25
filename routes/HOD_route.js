const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Academic_Member = require('../models/Academic_Member')
const Department = require('../models/Department')
const course = require('../models/course')
const Blocklist = require('../models/Blocklist')

require('dotenv').config()


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


////////////////////////////////////ASSIGN COURSE INSTRUCTOR///////////////////////////////////////

router.route('/HOD/assignCourseInstructor')
.post(tokenVerification, async( req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
    }
    else{
        const Hod= await Academic_Member.find({
            id:req.data.id
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
                    accidental_balance: instructor[0].accidental_balance,
                    annual_balance: instructor[0].annual_balance,
                    isNewMember: instructor[0].isNewMember,
                    Notification: instructor[0].Notification,
                    putInVisa: instructor[0].putInVisa

                    
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
    }
    
    })

////////////////////////////////////DELETE COURSE INSTRUCTOR///////////////////////////////////////

router.route('/HOD/deleteCourseInstructor')
.delete(tokenVerification, async( req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
    }
    else{
        const Hod= await Academic_Member.find({
            id:req.data.id
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
                    accidental_balance: instructor[0].accidental_balance,
                    annual_balance: instructor[0].annual_balance,
                    isNewMember: instructor[0].isNewMember,
                    Notification: instructor[0].Notification,
                    putInVisa: instructor[0].putInVisa

                    
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

    }
   
    })

////////////////////////////////////UPDATE COURSE INSTRUCTOR///////////////////////////////////////


router.route('/HOD/updateCourseInstructor/:id')
.put(tokenVerification, async( req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
}
else{
    const Hod= await Academic_Member.find({
        id:req.data.id
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
                accidental_balance: old_instructor[0].accidental_balance,
                annual_balance: old_instructor[0].annual_balance,
                isNewMember: old_instructor[0].isNewMember,
                Notification: old_instructor[0].Notification,
                putInVisa: old_instructor[0].putInVisa

                
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
                accidental_balance: new_instructor[0].accidental_balance,
                annual_balance: new_instructor[0].annual_balance,
                isNewMember: new_instructor[0].isNewMember,
                Notification: new_instructor[0].Notification,
                putInVisa: new_instructor[0].putInVisa

                
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

}

    })

////////////////////////////////////////VIEW STAFF PROFILES////////////////////////////////////////////

router.route('/HOD/viewStaffProfiles')
.get(tokenVerification, async (req,res) => {
    if(!req.data.HOD){
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
        res.send("Access denied. You must be a Head of Department!")
    }
})


////////////////////////////////////////VIEW ALL STAFF DAYOFF////////////////////////////////////////////

router.route('/HOD/viewAllStaffDayOff')
.get(tokenVerification, async( req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
}
else{
    var per=req.data.id
    if(per){
        const reqdep=await Academic_Member.find({id:per})
        const depname=reqdep[0].department_name
const staff=await Academic_Member.find({department_name:depname});


var result=""
for(var i=0;i<staff.length;i++){
   if(staff[i].HOD===false) 
result+="Name: "+staff[i].name+"  days off: "+staff[i].Attendance.dayOff+"\n";
}
res.send(result);

    }
    else{
        res.send("Access Denied")
    }
}
})

////////////////////////////////////////VIEW A STAFF DAYOFF////////////////////////////////////////////

router.route('/HOD/viewstaff/:id')
.get(tokenVerification, async( req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
}
else{
    var per=req.data.id
    if(per){
    const staff=await Academic_Member.find({id:req.params.id})
    if(staff.length!==0){
    const reqdep=await Academic_Member.find({id:per})
        const depname=reqdep[0].department_name
    if(staff[0].department_name===depname){
    res.send("Name: "+staff[0].name+"  days off: "+staff[0].Attendance.dayOff);
    }
    else{
     res.send("this id is not in your department")
    }
    }
    else{
       res.send("this id doesn't exist") 
    }
}
    else{
        res.send("Access Denied")
    }
}
})

////////////////////////////////////////VIEW ALL REQUESTS////////////////////////////////////////////

router.route('/HOD/viewRequestsLeaves')
.get(tokenVerification,  async( req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
}
else{
    const per=req.data.id
     if(per){
         const reqdep=await Academic_Member.find({id:per})
         const depname=reqdep[0].department_name
         const reqdep1=await Leaves.find();
         var dep=""
         var dep1=""
         var count=0
         //console.log(reqdep1)
         for(var  i=0;i<reqdep1.length;i++){
         dep=await Academic_Member.find({id:reqdep1[i].idFROM})
         dep1=await Academic_Member.find({id:reqdep1[i].idTO})
        
         if(dep[0].department_name === depname && dep1[0].department_name === depname){
            res.send(reqdep1[i])
            count++
        
}

     }
     if(count===0)
     res.send("No result found")
     }
     else{
        res.send("Access Denied")
    }
}
    
})


////////////////////////////////////////ACCPET/REJECT All Requests////////////////////////////////////////////

router.route('/HOD/acceptRejectAllRequests')
.post(tokenVerification, async(req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
}
else{
     
    const all_requests_of_the_entered_hod_id= await Request.find({
        destination_id:req.data.id
    })
    
    if(all_requests_of_the_entered_hod_id.filter(item => item.id.includes(req.body.request_id)) !==0){
    
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
            sender_id:  req.data.id,
            destination_id :all_info_about_the_request[0].sender_id,
            document:req.body.document
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
            sender_id: req.data.id,
            destination_id:all_info_about_the_request[0].sender_id,
            document:req.body.document
        })
    
    
        await new_notification.save().then(doc => {
            res.send(doc);
        })
        .catch(err => {
        console.error(err)
        })
        if(req.body.status_of_request==="rejected"&&all_info_about_the_request[0].type_of_request==="annual_leave"||all_info_about_the_request[0].type_of_request==="accidental_leave" ){
    
            const old_TA= await Academic_Member.find({
                id:all_info_about_the_request[0].sender_id
            })
    
           await Academic_Member.findOneAndRemove({
            id:all_info_about_the_request[0].sender_id
           })
           if(all_info_about_the_request[0].type_of_request==="annual_leave"){
    
           const Academic_Member_model_2 =new Academic_Member({
    
    
            
                id:req.params.id,
                name:old_TA[0].name,
                email:old_TA[0].email,
                password:old_TA[0].password,
                salary:old_TA[0].salary,
                department_name:Hod[0].department_name,
                faculty_name:old_TA[0].faculty_name,
                room_location_id:old_TA[0].room_location_id,
                HOD:old_TA[0].Hod,
                Coordinator:old_TA[0].Coordinator,
                role:old_TA[0].role,
                courses_taught:old_TA[0].courses_taught,
                assign_slots:old_TA[0].assign_slots,
                schedule:old_TA[0].schedule,
                Phone_Number:old_TA[0].Phone_Number,
                Attendace:old_TA[0].Attendace,
                annual_balance:(old_TA[0].annual_balance)-1,
                accidental_balance:old_TA.accidental_balance,
                isNewMember: old_TA[0].isNewMember,
                Notification: old_TA[0].Notification,
                putInVisa: old_TA[0].putInVisa

                
            })}
            if(all_info_about_the_request[0].type_of_request==="accidental_leave"){
    
                const Academic_Member_model_2 =new Academic_Member({
         
         
                 
                     id:req.params.id,
                     name:old_TA[0].name,
                     email:old_TA[0].email,
                     password:old_TA[0].password,
                     salary:old_TA[0].salary,
                     department_name:Hod[0].department_name,
                     faculty_name:old_TA[0].faculty_name,
                     room_location_id:old_TA[0].room_location_id,
                     HOD:old_TA[0].Hod,
                     Coordinator:old_TA[0].Coordinator,
                     role:old_TA[0].role,
                     courses_taught:old_TA[0].courses_taught,
                     assign_slots:old_TA[0].assign_slots,
                     schedule:old_TA[0].schedule,
                     Phone_Number:old_TA[0].Phone_Number,
                     Attendace:old_TA[0].Attendace,
                     annual_balance:(old_TA[0].annual_balance)-1,
                     accidental_balance:(old_TA[0].accidental_balance)-1,     
                     isNewMember: old_TA[0].isNewMember,
                     Notification: old_TA[0].Notification,
                     putInVisa: old_TA[0].putInVisa
                        
                 })}
    
    
           // console.log(instructor[0].courses_taught)
            await Academic_Member_model_2.save().then(doc => {
                res.send(doc);
            })
            .catch(err => {
            console.error(err)
            })
    
        
    
        }
    }
    else{
        res.send("the entered request id doesnot exist in the HOD requests list")
    }
}
})

////////////////////////////////////////VIEW COVERAGE OF EACH COURSE////////////////////////////////////////////

router.route('/HOD/coursecoverage')
.get(tokenVerification, async( req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
}
else{
    const per=req.data.id
    if(per){
        const Hod7=await Academic_Member.find({id:per})
        const depname=Hod7[0].department_name
        const courses=await course.find({department_name:depname}) 
        var result1=""
        for(var i=0;i<courses.length;i++)
        result1+="course name: " +courses[i].name+"  course coverage: "+ courses[i].course_coverage+ "\n"//print course coverage and course name
        res.send(result1)
    }
    else{
        res.send("Access Denied")
    }
}
})

////////////////////////////////////////VIEW TEACHING ASSIGNMENTS////////////////////////////////////////////

router.route('/HOD/staffmembersteachingslots/:course')
.get(tokenVerification, async( req,res)=>{
    if(!req.data.HOD){
        res.send("Access denied! You must be a Head of Department!")
}
else{
    const per=req.data.id
    if(per){
        const Hod7=await Academic_Member.find({id:per})
        const depname=Hod7[0].department_name
        const slotcourse=await slot.find({course_id:req.params.course})
        var academicmemberdep=""
        var coursedep=""
    var result2=[];
        for(var i=0;i<slotcourse.length;i++){
         academicmemberdep=await Academic_Member.find({id:slotcourse[i].academic_member_id})
         coursedep=await course.find({id:slotcourse[i].course_id})
         if(academicmemberdep[0].department_name===depname && coursedep[0].department_name===depname){
           result2.push(slotcourse[i])
            // result2+="   course name: "+slotcourse[i].course_id+"  day: "+slotcourse[i].day+"   room location: "+slotcourse[i].room_location_id+"  which slot: "+slotcourse[i].which_slot+"  academic member id: "+slotcourse[i].academic_member_id+"\n"
    }
    }
    if(result2.length === 0)
      res.send("No result found")
      else
      res.send(result2)
       
       
    }

    else{
        res.send("Access Denied")
    }
}
})

module.exports = router 