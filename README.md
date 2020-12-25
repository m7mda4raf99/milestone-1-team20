# milestone-1-team-20
## 1.index.js
## 2.Port is the server listening:3000
## 3.Functionalities
### GUC Staff Members Functionalities
    1.Functionality: Login a Staff Member. 
      Route: /staff/userLogin
      Request type: POST
      Request body: { “email” : “zeyadsalah@gmail.com”, “password”: "123456" }
     
    2.Functionality: Logout a Staff Member. 
      Route: /staff/logout
      Request type: POST
      Request body: Nothing in the body, just pass the token in the header
    
    3.Functionality: View Staff Member Profile.
      Route: /staff/viewProfile
      Request type: GET
      Response: {
                    "isNewMember": true,
                    "_id": "5fe6251e86e36a517c27686c",
                    "id": "hr-1",
                    "name": "Zeyad Salah",
                    "email": "zeyadsalah@gmail.com",
                    "salary": 5,
                    "room_location_id": "C5.201",
                    "role": "HR",
                    "gender": "male",
                    "Phone_Number": "8",
                    "password": "$2b$10$wThsQveTRVdlRuZgSyy6TOoeS0U2i9./B/0J3rb/ipfhV/JkD691.",
                    "__v": 0
                }
      
    4.Functionality: Update a Staff Member Profile. 
      Route: /staff/updateProfile
      Request type: PUT
      Request body: { "Phone_Number": "012010101010" }
      
    5.Functionality: Update a Staff Member Password. 
      Route: /staff/resetPassword
      Request type: PUT
      Request body: { "password": "zeyad" }
      
    6.Functionality: Sign IN a Staff Member. 
      Route: /staff/signIn
      Request type: POST
      Request body: { "id": "ac-1" }
      
    7.Functionality: Sign OUT a Staff Member. 
      Route: /staff/signOut
      Request type: POST
      Request body: { "id": "ac-1" } 
      
    8.Functionality: View all Staff Members attendance records. 
      Route: /staff/viewAttendance
      Request type: GET
      Request body: if empty: will return all attendance records
                    if { "month" : 11 } will return all attendance records of November
      Response:
      {
      "signIn": [2020-11-13T09:00:00.000Z],
      "signOut": [2020-11-13T11:00:00.000Z]
      }
   
    9.Functionality: View Staff Member missing days.
      Route: /staff/viewMissingDays 
      Request type: GET
      Response: 
      { 
        "missingDays" : 3
      }      
      
    10.Functionality: View Staff Member are having missing hours or extra hours. 
      Route: /staff/viewMissingExtraHours
      Request type: GET
      Response: 
      { 
        "missingHours" : 4,
        "extraHours" 2
      }
     
   ### HR Functionalities
        1.Functionality: Add a location. 
          Route: /HR/addRoom
          Request type: POST
          Request body: {
                            "id": "C7.205",
                            "type_of_Room": "tutorial",
                            "capacity_left": 25
                        } 

        2.Functionality: Update a location. 
          Route: /HR/updateRoom/:id
          Request type: PUT
          Parameters: id is the ID of the Room  we are updating its info
          Example of how to call the route: /HR/updateRoom/C7.205
          Request body: {
                            "type_of_Room": "lab",
                            "capacity_left": 20
                        }

        3.Functionality: Delete a location. 
          Route: /HR/deleteRoom/:id
          Request type: DELETE
          Parameters: id is the ID of the Room we are deleting
          Example of how to call the route: HR/deleteRoom/C7.205

        4.Functionality: Add a Faculty. 
          Route: /HR/addFaculty
          Request type: POST
          Request body: { "name": "Engineering" } 

        5.Functionality: Update a Faculty. 
          Route: /HR/updateFaculty/:name
          Request type: PUT
          Parameters: name is the name of the Faculty we are updating its info
          Example of how to call the route: /HR/updateFaculty/Engineering
          Request body: { "name": "BI" } 

        6.Functionality: Delete a Faculty. 
          Route: /HR/deleteFaculty
          Request type: DELETE
          Request body: { "name": "BI" }

        7.Functionality: Add a Department. 
          Route: /HR/addDepartment
          Request type: POST
          Request body:  { "name": "MET", "faculty_name":"Engineering" }

         8.Functionality: Update a Department. 
           Route: /HR/updateDepartment/:name
           Request type: PUT
           Parameters: name is the name of the Department we are updating its info
           Example of how to call the route: /HR/updateDepartment/MET   
           Request body: { "name": "IET" }

         9.Functionality: Delete a Department. 
           Route: /HR/deleteDepartment/:name
           Request type: DELETE
           Parameters: name is the name of the Department we are deleting
           Example of how to call the route: /HR/deleteDepartment/IET  

        10.Functionality: Add a Course. 
           Route: /HR/addCourse
           Request type: POST
           Request body: { "id":"CSEN704", "name":"ACL", "department_name":"MET" } 
           
        11.Functionality: Update a Course. 
           Route: /HR/updateCourse
           Request type: PUT
           Request body:  { "id":"CSEN704", "name":"Advanced Computer Lab" }
           
        12.Functionality: Delete a Course. 
           Route: /HR/deleteCourse   
           Request type:DELETE
           Request body: { "id":"CSEN704" } 
           
        13.Functionality: HR add Staff Member. 
           Route: /HR/addAcademicMember
           Request type: POST
           Request body: {
                            "id": "ac-1",
                            "name": "Zeyad Amr",
                            "email": "ziadamr@gmail.com",
                            "salary": 490,
                            "department_name": "MET",
                            "faculty_name": "Engineering",
                            "room_location_id": "C5.201",
                            "role": "TA",
                            "gender": "male"
                        } 

        14.Functionality: Update existing staff members. 
           Route: /HR/updateAcademicMember/:id
           Request type: PUT
           Parameters: id is the id of the academic member we are updating its info
           Example of how to call the route: /HR/updateAcademicMember/ac-1
           Request body: { "name": "Ashraf", "password" : "ashraf12" }
               
        15.Functionality: Delete existing staff members. 
           Route: /HR/delete_Academic_Member/:id
           Request type: DELETE
           Parameters: id is the id of the academic member we are deleting
           Example of how to call the route: /HR/delete_Academic_Member/ac-1   
           
        16.Functionality: Manually add a missing sign in/sign out record of a staff member. 
           Route:///////////
           Request type: ///////////
           Request body: ///////////////////////////////////////   
           
        17.Functionality: View any Staff Member attendance record.
           Route: /HR/viewAttendance/:id
           Request type: GET
           Parameters: id is the id of the academic member we are getting his attendance
           Example of how to call the route: /HR/viewAttendance/ac-1   
           Response: Single Staff Member Attendence: 
            {
                "signIn": [],
                "signOut": [],
                "spentHoursPerMonth": 0,
                "missingDays": 0,
                "missingHours": 0,
                "missingMinutes": 0,
                "extraHours": 0,
                "extraMinutes": 0,
                "_id": "5fe63c446de4e62578ceb4ef",
                "dayOff": "Saturday"
            }
           
        18.Functionality: View Staff Members with missing hours/days.
           Route: /HR/viewAttendanceMissingHoursDays
           Request type: GET
           Response: Array of Staff Member missing hours/days. Example of a single Staff Member missing hours/days: 
            {
                "id": "ac-3",
                "missingDays": 1,
                "missingHours": 2
            }
           
        19.Functionality: Update the salary of a staff member. 
           Route: /HR/updateAcademicmemberSalary
           Request type: PUT
           Request body: 
           {
                "id": "ac-5",
                "salary": 5000
            }         
           
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
          Route: /Instructor/viewStaffProfiles
          Request type: GET
          Request body: if empty: will return all staff profiles with same department
                        if { "course_id" : "CSEN704: } will return all staff profiles teaching CSEN704 
          Response: Array of all staff profiles with the same course or department. Example of a single staff profile assigned to: 
          {
            "putInVisa": 0,
            "HOD": false,
            "Coordinator": false,
            "courses_taught": [],
            "assign_slots": [],
            "schedule": [],
            "annual_balance": 2.5,
            "accidental_balance": 6,
            "isNewMember": true,
            "_id": "5fe63c446de4e62578ceb4ee",
            "id": "ac-1",
            "name": "Zeyad Amr",
            "email": "ziadamr@gmail.com",
            "salary": 490,
            "department_name": "MET",
            "faculty_name": "Engineering",
            "room_location_id": "C5.201",
            "role": "TA",
            "gender": "male",
            "Attendance": {
                "signIn": [],
                "signOut": [],
                "spentHoursPerMonth": 0,
                "missingDays": 0,
                "missingHours": 0,
                "missingMinutes": 0,
                "extraHours": 0,
                "extraMinutes": 0,
                "_id": "5fe63c446de4e62578ceb4ef",
                "dayOff": "Saturday"
        }
      
    5.Functionality: View the day off of all the staff in his/her department.
      Route: /HOD/viewstaff
      Request type: GET
      Response: Array of day off of all staff: { "name":"ashraf","dayOff":"Sunday",
                                                 "name":"Zeyad", "dayOff":"Monday" }
      
    6.Functionality: View the day off of a single staff in his/her department.
      Route:/HOD/viewstaff/:id
      Request type: GET
      Response: Array of day off of single staff: {"name":"ashraf","dayOff":"Sunday" }
      Parameters: id is the id of the staff Instructor we are getting his/her info
      Example of how to call the route:/HOD/viewstaff/:ac-716    
      
    7.Functionality: Accept/reject a request.
      Route: /HOD/all_requests
      Request type: PUT
      Request body: {"request_id":"R6","status_of_request":"accepted","document":""}
      
    8.Functionality: View the coverage of each course in his/her department.
      Route: /HOD/coursecoverage
      Request type: GET
      Response: Array of course coverage of each course. Example of a single course assigned to: { "name":"Theory","course_coverage":70}
      
    9.Functionality: View teaching assignments of course offered by his department.
      Route:/HOD/staffmembersteachingslots/:course
      Request type: GET
      Response: Array of all teaching assignment of one course: [{ "course name":"Embedded",
                                           "day":"Monday",    
                                          "room_location_id":"c5.301",  
                                          "which slot":2  ,
                                        "academic member id":"ac-7" }]
      Parameters: course is the course of teaching assignments offered by his departmentwe are getting its info
      Example of how to call the route:/HOD/staffmembersteachingslots/:CSEN701  
   
   
   
   #### B) Course Instructor Functionalities
   
        1.Functionality: View the coverage of course(s) Staff Member assigned to.
          Route: /Instructor/viewCoverages
          Request type: GET
          Response: Array of Coverage Of Courses Staff Member assigned to. Example of a single Coverage Of Courses Staff Member assigned to:
            {
                "id": "CSEN704",
                "name": "Advanced Computer Lab",
                "course_coverage": 70
            }

        2.Functionality: View the slots’ assignment of course(s) Staff Member assigned to.
          Route: /Instructor/viewCoursesSlots
          Request type: GET
          Response: Array of all slots of the courses he assigned to. Example of a single slot assigned to: 
          {
            "course_id" : "CSEN704",
            "course_name" : "ACL",
            "day" : "Sunday",
            "which_slot" : 5,
            "academic_member_id": "ac-1"
          }
          
        3.Functionality: View all the staff in his/her department or per course along with their profiles.
          Route: /Instructor/viewStaffProfiles
          Request type: GET
          Request body: if empty: will return all staff profiles with same department
                        if { "course_id" : "CSEN704" } will return all staff profiles teaching CSEN704 
          Response: Array of all staff profiles with the same course or department. Example of a single staff profile assigned to: 
          {
            "putInVisa": 0,
            "HOD": false,
            "Coordinator": false,
            "courses_taught": [],
            "assign_slots": [],
            "schedule": [],
            "annual_balance": 2.5,
            "accidental_balance": 6,
            "isNewMember": true,
            "_id": "5fe63c446de4e62578ceb4ee",
            "id": "ac-1",
            "name": "Zeyad Amr",
            "email": "ziadamr@gmail.com",
            "salary": 490,
            "department_name": "MET",
            "faculty_name": "Engineering",
            "room_location_id": "C5.201",
            "role": "TA",
            "gender": "male",
            "Attendance": {
                "signIn": [],
                "signOut": [],
                "spentHoursPerMonth": 0,
                "missingDays": 0,
                "missingHours": 0,
                "missingMinutes": 0,
                "extraHours": 0,
                "extraMinutes": 0,
                "_id": "5fe63c446de4e62578ceb4ef",
                "dayOff": "Saturday"
        }
          
        4.Functionality: Assign an academic member to an unassigned slots in course(s) he/she is assigned to.
          Route: /Instructor/assignAcademicToSlot
          Request type: POST
          Request body: 
          {   
             "staff_id": "ac-1",
            "course_id" : "CSEN704",
            "day" : "Sunday",
            "which_slot" : 5,
            "room_location_id": "C5.201"
          }
          
        5.Functionality: Update assignment of academic member in course(s) he/she is assigned to.
          Route: /Instructor/updateAcademicSlot
          Request type: PUT
          Request body: 
          {   
             "oldStaff_id": "ac-1",
             "newStaff_id": "ac-2",
            "course_id" : "CSEN704",
            "day" : "Sunday",
            "which_slot" : 5,
            "room_location_id": "C5.201"
          }
          
        6.Functionality: Delete assignment of academic member in course(s) he/she is assigned to.
          Route: /Instructor/deleteAcademicSlot
          Request type: DELETE
          Request body: 
          {  
            "course_id" : "CSEN704",
            "day" : "Sunday",
            "which_slot" : 5,
            "room_location_id": "C5.201",
            "academic_member_id": "ac-1"
          }
          
        7.Functionality: Remove an assigned academic member in course(s) he/she is assigned to.
          Route: /Instructor/removeAcademicSlot
          Request type: DELETE
          Request body: 
          {  
            "course_id" : "CSEN704",
            "day" : "Sunday",
            "which_slot" : 5,
            "room_location_id": "C5.201",
            "academic_member_id": "ac-1"
          }
          
        8.Functionality: Assign an academic member in each of his/her course(s) to be a course coordinator. 
          Route: /Instructor/assignAcademicCoordinator
          Request type: POST
          Request body: 
          {
          "staff_id" : "ac-1"
          }
          

  #### C) Course Coordinator Functionalities
  

       1.Functionality: View “slot linking” request(s) from academic members linked to his/her course.
          Route: /Course_Coordinator/viewslotlinking
          Request type: GET
          Response: Array of json containing the requests of slot linking type of his or her department. Example of a single 
            { "id":3 ,
            "target_day":"2020-12-25",
            "date_of_request" :   2020-12-25T21:12:54.260Z ,
            "type_of_request" : "slot_linking" ,                                                   
            "status_of_request": "pending",
            "sender_id": "ac-5",
            "destination_id": "ac-17",
            "document":""}

          
        2.Functionality: Accept/reject “slot linking” requests .
          Route: /Course_Coordinator/viewslotlinkingaccept_reject
          Request type: PUT
          Request body: {"id":"ac-3",
                        "status_of_request":"accepted",
                        "slot": {"courseid":"CSEN701",
                                   "day":"Sunday",
                                   "room_location_id":"c5.301",
                                   "which_slot":2,
                                    "academic_member_id":"ac-7",
                                }
  
            		 } 
        
        3.Functionality: Add course slot(s) in his/her course. 
          Route: /Coordinator/addCourseSlot
          Request type: POST
          Request body: 
          {  
            "course_id" : "CSEN704",
            "day" : "Sunday",
            "which_slot" : 5,
            "room_location_id": "C5.201"
          }
          
        4.Functionality: Update course slot(s) in his/her course.
          Route: /Coordinator/updateCourseSlot
          Request type: PUT
          Request body: 
          {  
            "course_id" : "CSEN704",
            "oldday" : "Sunday",
            "oldwhich_slot" : 5,
            "oldroom_location_id": "C5.201",
            "newday" : "Monday",
            "newwhich_slot" : 4,
            "newroom_location_id": "C3.101"
          }
          
        5.Functionality: Delete course slot(s) in his/her course. 
          Route: /Coordinator/deleteCourseSlot
          Request type: DELETE
          Request body: 
          {  
            "course_id" : "CSEN704",
            "day" : "Sunday",
            "which_slot" : 5,
            "room_location_id": "C5.201"
          }
          
  
  
  
  
  #### D) Academic member Functionalities
  
        1.Functionality: View Academic member schedule. Schedule should show teaching activities and replacements if present.
          Route: /Academic_Member/view_academic_member_schedule
          Request type: GET
          Example of how to call the route: /Academic_Member/view_academic_member_schedule
          Response: Array of schedule of this academic member. Example of a single schedule:{ "course_id":"CSEN701","day":"Monday,"room_location_id":"c7.306","which_slot":2,"academic_member_id":"509"}
   
  
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
          
          
     
      
