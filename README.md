# ACLProject
## 1.index.js
## 2.Port is the server listening:3000
## 3.Functionalities
### GUC Staff Members Functionalities
    1.Functionality: Login a Staff Member. 
      Route: /staff/userLogin
      Request type: POST
      Request body: { “email” : “zeyadshaheen@guc.edu.eg”, “Password”: 123666 }
     
    2.Functionality: Logout a Staff Member. 
      Route: /staff/logout
      Request type: POST
      Request body: ///////////////////////////////////////
    
    3.Functionality: View Staff Member Profile.
      Route: /staff/viewProfile
      Request type: GET
      Response: ///////////////////////////////////////////
      
    4.Functionality: Update a Staff Member Profile. 
      Route: /staff/updateProfile
      Request type: PUT
      Request body: ///////////////////////////////////////
      
    5.Functionality: Update a Staff Member Password. 
      Route: /staff/resetPassword
      Request type: PUT
      Request body: ///////////////////////////////////////
      
    6.Functionality: Sign IN a Staff Member. 
      Route: /staff/signIn
      Request type: POST
      Request body: ///////////////////////////////////////
      
    7.Functionality: Sign OUT a Staff Member. 
      Route: /staff/signOut
      Request type: POST
      Request body: /////////////////////////////////////// 
      
    8.Functionality: View all Staff Members attendance records. 
      Route: ////////////////////////
      Request type://////////////////////////////
      Request body: /////////////////////////////////////// 
   
    9.Functionality: View Staff Member missing days.
      Route://////////////////////////////// 
      Request type:////////////////////////
      Request body: /////////////////////////////////////// 
      
    10.Functionality: View Staff Member are having missing hours or extra hours. 
      Route: ////////////////////////////
      Request type:///////////////////////////////
      Request body: /////////////////////////////////////// 
     
   ### HR Functionalities
        1.Functionality: Add a location. 
          Route: /HR/addRoom
          Request type: POST
          Request body: /////////////////////////////////////// 

        2.Functionality: Update a location. 
          Route: /HR/updateRoom/:id
          Request type: PUT
          Parameters: id is the ID of the Room  we are getting its info
          Example of how to call the route: /////////////////////////////

        3.Functionality: Delete a location. 
          Route: /HR/deleteRoom/:id
          Request type: DELETE
          Parameters: id is the ID of the Room we are getting its info
          Example of how to call the route: /////////////////////////////

        4.Functionality: Add a Faculty. 
          Route: /HR/addFaculty
          Request type: POST
          Request body: /////////////////////////////////////// 

        5.Functionality: Update a Faculty. 
          Route: /HR/updateFaculty/:name
          Request type: PUT
          Parameters: name is the name of the Faculty we are getting its info
          Example of how to call the route: /////////////////////////////

        6.Functionality: Delete a Faculty. 
          Route: /HR/deleteFaculty
          Request type: DELETE
          Request body: ///////////////////////////////////////

        7.Functionality: Add a Department. 
          Route: /HR/addDepartment
          Request type: POST
          Request body: /////////////////////////////////////// 

         8.Functionality: Update a Department. 
           Route: /HR/updateDepartment/:name
           Request type: PUT
           Parameters: name is the name of the Department we are getting its info
           Example of how to call the route: /////////////////////////////    

         9.Functionality: Delete a Department. 
           Route: /HR/deleteDepartment/:name
           Request type: DELETE
           Parameters: name is the name of the Department we are getting its info
           Example of how to call the route: /////////////////////////////  

        10.Functionality: Add a Course. 
           Route: /HR/addCourse
           Request type: POST
           Request body: /////////////////////////////////////// 
           
        11.Functionality: Update a Course. 
           Route: /HR/updateCourse
           Request type: PUT
           Request body: /////////////////////////////////////// 
           
        12.Functionality: Delete a Course. 
           Route: /HR/deleteCourse   
           Request type:DELETE
           Request body: /////////////////////////////////////// 
           
        13.Functionality: HR add Staff Member. 
           Route: /HR/add_Academic_Member
           Request type: POST
           Request body: /////////////////////////////////////// 
           
        14.Functionality: Update existing staff members. 
           Route: /HR/update_academic_members/:id
           Request type: PUT
           Parameters: id is the id of the academic member we are getting its info
           Example of how to call the route: /////////////////////////////    
               
        15.Functionality: Delete existing staff members. 
           Route: /HR/delete_Academic_Member/:id
           Request type: DELETE
           Parameters: id is the id of the academic member we are getting its info
           Example of how to call the route: /////////////////////////////   
           
        16.Functionality: Manually add a missing sign in/sign out record of a staff member. 
           Route:///////////
           Request type: ///////////
           Request body: ///////////////////////////////////////   
           
        17.Functionality: View any Staff Member attendance record.
           Route:///////////////////
           Request type: GET
           Response: Array of Staff Member Attendence. Example of a single Staff Member Attendence: { ///////////////// }
           
        18.Functionality: View Staff Members with missing hours/days.
           Route:///////////////////
           Request type: GET
           Response: Array of Staff Member missing hours/days. Example of a single Staff Member missing hours/days: { ///////////////// }
           
        19.Functionality: Update the salary of a staff member. 
           Route: /////////////////////////////
           Request type: PUT
           Parameters:////////////////////////////////////////////////////////////////////
           Example of how to call the route: /////////////////////////////      
           
   ### Academic Members Functionalities
   #### A) HOD Functionalities
   
        1.Functionality: Assign a course instructor. 
          Route: /HOD/assign_course_instructor
          Request type: POST
          Request body: {"hod_id":"ac-7161","course_instructor_id":"ac-1716","course_id":"CSEN702"}
          
        2.Functionality: Delete a course instructor. 
          Route: /HOD/delete_course_instructor
          Request type: DELETE
          Request body: {"hod_id":"ac-71","course_instructor_id":"ac-16","course_id":"CSEN704"} 
   
        3.Functionality: Update a course instructor. 
          Route: /HOD/update_course_instructor/:id
          Request type: PUT
          Parameters: id is the id of the Course Instructor we are getting his/her info
          Example of how to call the route:update_course_instructor/:ac-72    
          
        4.Functionality: View all the staff in his/her department or per course along with their profiles.
          Route: /////////////////////////////////////////
          Request type: GET
          Response: Array of ///////////////. Example of a single //////////// assigned to: { ///////////////// }
          
        5.Functionality: View the day off of all the staff in his/her department.
          Route: /HOD/viewstaff
          Request type: GET
          Response: Array of ///////////////. Example of a single //////////// assigned to: { ///////////////// }
          
        6.Functionality: View the day off of a single staff in his/her department.
          Route:/HOD/viewstaff/:id
          Request type: GET
          Response: Array of ///////////////. Example of a single //////////// assigned to: { ///////////////// }
          Parameters: id is the id of the staff Instructor we are getting his/her info
          Example of how to call the route: /////////////////////////////    
          
        7.Functionality: Accept/reject a request.
          Route: /HOD/all_requests
          Request type: PUT
          Request body: /////////////////////////////////////// 
          
        8.Functionality: View the coverage of each course in his/her department.
          Route: /HOD/coursecoverage
          Request type: GET
          Response: Array of ///////////////. Example of a single //////////// assigned to: { ///////////////// }
          
        9.Functionality: View teaching assignments of course offered by his department.
          Route:/HOD/staffmembersteachingslots/:course
          Request type: GET
          Response: Array of ///////////////. Example of a single //////////// assigned to: { ///////////////// }
          Parameters: course is the /////////////// we are getting its info
          Example of how to call the route: /////////////////////////////    
   
   
   
   
   #### B) Course Instructor Functionalities
   
        1.Functionality: View the coverage of course(s) Staff Member assigned to.
          Route: /Instructor/viewCoverages
          Request type: GET
          Response: Array of Coverage Of Courses Staff Member assigned to. Example of a single Coverage Of Courses Staff Member assigned to: { ///////////////// }

        2.Functionality: View the slots’ assignment of course(s) Staff Member assigned to.
          Route: /Instructor/viewCoursesSlots
          Request type: GET
          Response: Array of ///////////////. Example of a single //////////// assigned to: { ///////////////// }
          
        3.Functionality: View all the staff in his/her department or per course along with their profiles.
          Route: /Instructor/viewStaffProfiles
          Request type: GET
          Response: Array of ///////////////. Example of a single //////////// assigned to: { ///////////////// }
          
        4.Functionality: Assign an academic member to an unassigned slots in course(s) he/she is assigned to.
          Route: /Instructor/assignAcademicToSlot
          Request type: POST
          Request body: ///////////////////////////////////////   
         
        5.Functionality: Update assignment of academic member in course(s) he/she is assigned to.
          Route: /Instructor/updateAcademicSlot
          Request type: PUT
          Request body: ///////////////////////////////////////    
          
        6.Functionality: Delete assignment of academic member in course(s) he/she is assigned to.
          Route: /Instructor/deleteAcademicSlot
          Request type: DELETE
          Request body: ///////////////////////////////////////
          
        7.Functionality: Remove an assigned academic member in course(s) he/she is assigned to.
          Route: /Instructor/removeAcademicSlot
          Request type: DELETE
          Request body: ///////////////////////////////////////
          
        8.Functionality: Assign an academic member in each of his/her course(s) to be a course coordinator. 
          Route: /Instructor/assignAcademicCoordinator
          Request type: POST
          Request body: /////////////////////////////////////// 
          
          
          



  #### C) Course Coordinator Functionalities
  

        1.Functionality: View “slot linking” request(s) from academic members linked to his/her course.
          Route: /Course_Coordinator/viewslotlinking
          Request type: GET
          Response: Array of ///////////////. Example of a single //////////// assigned to: { ///////////////// }
          
        2.Functionality: Accept/reject “slot linking” requests .
          Route: /Course_Coordinator/viewslotlinkingaccept_reject
          Request type: PUT
          Request body: ///////////////////////////////////////  
        
        3.Functionality: Add course slot(s) in his/her course. 
          Route: /Coordinator/addCourseSlot
          Request type: POST
          Request body: /////////////////////////////////////// 
          
        4.Functionality: Update course slot(s) in his/her course.
          Route: /Coordinator/updateCourseSlot
          Request type: PUT
          Request body: ///////////////////////////////////////    
          
        5.Functionality: Delete course slot(s) in his/her course. 
          Route: /Coordinator/deleteCourseSlot
          Request type: DELETE
          Request body: /////////////////////////////////////// 
          
  
  
  
  
  #### D) Academic member Functionalities
  
        1.Functionality: View Academic member schedule. Schedule should show teaching activities and replacements if present.
          Route: /Academic_Member/view_academic_member_schedule
          Request type: GET
          Example of how to call the route: /Academic_Member/view_academic_member_schedule
        xxx  Response: Array of schedule of this academic. Example of a single schedule:{"course_id":"CSEN701","day":"Monday,"room_location_id":"c7.306","which_slot":2,"academic_member_id":"509"}
   
  
        2.Functionality: Send “replacement” request(s).
          Route: /Academic_Member/send_replacement_request
          Request type: POST
          Request body: {"target_day":"2020-12-27","destination_id":"43-1684"}
          
        3.Functionality: View “replacement” request(s).
          Route: /Academic_Member/view_all_replacement_requests
          Request type: GET
          Response: Array of Requests. Example:{["id":"R2","target_day":"2020-12-27","date_of_request":2020-12-25T21:12:54.260Z,"type_of_request":"replacement","status_of_request":"pending","sender_id":"8001","destination_id":"1102","document":""]}
          
        4.Functionality: Send a “slot linking” request. 
          Route: /AcademicMember/sendSlotLinkingRequest
          Request type: POST:
          Request body: {"course_id":"CSEN704","target_day":"2020-12-30","slot_day":"Monday","which_slot":3}
          
        5.Functionality: Send a “change day off” request. 
          Route: /Academic_Member/send_change_day_off_request
          Request type: POST
          Request body: {"target_day":"2020-12-30","document":""}
          
        6.Functionality: Submit annual leave request. 
          Route: /Academic_Member/submit_annual_leave_request
          Request type: POST
          Request body: {"target_day":"2020-12-30"}
          
        7.Functionality: Submit sick leave request. 
          Route: /Academic_Member/submit_sick_leave_request
          Request type: POST
          Request body: {"target_day":"2020-12-30","document":"a google drive link with the proper documents uploded on it"}
          
        8.Functionality: Submit accidental leave request. 
          Route: /Academic_Member/submit_accidental_leave_request
          Request type: POST
          Request body: {"target_day":"2020-12-30","document":"a google drive link with the proper documents uploded on it"}
          
        9.Functionality: Submit compensation request. 
          Route: /Academic_Member/submit_compensation_request
          Request type: POST
          Request body: {"target_day":"2020-12-30","reason_of_compensation":"I had a severe flu and headache"}
          
       10.Functionality: Submit maternity request. 
          Route: /Academic_Member/submit_maternity_request
          Request type: POST
          Request body: {"target_day":"2020-12-30","document":"a google drive link with the proper documents uploded on it"}
          
       11.Functionality: Notified requests status.
          Route: /Academic_Member/view_status_of_all_requests
          Request type: GET
          Response: Array of status of all requests. Example{["id":"R5","target_day":"2020-12-27","date_of_request":2020-12-25T21:12:54.260Z,"type_of_request":"replacement","status_of_request":"pending","sender_id":"8001","destination_id":"1102","document":""],[["id":"R9","target_day":"2020-12-24","date_of_request":"2020-12-29","type_of_request":"replacement","status_of_request":"pending","sender_id":"8001","destination_id":"1102","document":""]]}
          
       12.Functionality: View Accepted Requests.
          Route: /Academic_Member/view_accepted_requests
          Request type: GET
          Response: Array of all accepted requests. Example: {["id":"R2","target_day":"2020-12-27","date_of_request":2020-12-25T21:12:54.260Z,"type_of_request":"replacement","status_of_request":"accepted","sender_id":"8001","destination_id":"1102","document":""]}

       13.Functionality: View Pending Requests.
          Route: /Academic_Member/view_pending_requests
          Request type: GET
          Response: Array of all pending requests. Example: {["id":"R2","target_day":"2020-12-27","date_of_request":2020-12-25T21:12:54.260Z,"type_of_request":"replacement","status_of_request":"pending","sender_id":"8001","destination_id":"1102","document":""]}
          
       14.Functionality: View Rejected Requests.
          Route: /Academic_Member/view_rejected_requests
          Request type: GET
          Response: Array of all rejected results. Example: {["id":"R2","target_day":"2020-12-27","date_of_request":2020-12-25T21:12:54.260Z,"type_of_request":"replacement","status_of_request":"rejected","sender_id":"8001","destination_id":"1102","document":""]}
          
       15.Functionality: Cancel a request whose day is yet to come.
          Route: /Academic_Member/cancel_day_is_yet_to_come_requests
          Request type: DELETE
          Request body: {"id":"R5"}
          
       16.Functionality: Cancel a still pending request.
          Route: /Academic_Member/cancel_pending_requests
          Request type: DELETE
          Request body: {"id":"R7"} 
          
          
          
          
          
           
           
           
           
      
      
      
      
      
      
      
     
    
      
      
