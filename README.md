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
      Route: 
      Request type:
      Request body: /////////////////////////////////////// 
   
    9.Functionality: View Staff Member missing days.
      Route: 
      Request type:
      Request body: /////////////////////////////////////// 
      
    10.Functionality: View Staff Member are having missing hours or extra hours. 
      Route: 
      Request type:
      Request body: /////////////////////////////////////// 
     
   ### HR Functionalities
        1.Functionality:Add a location. 
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

        4.Functionality:Add a Faculty. 
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

        7.Functionality:Add a Department. 
          Route: /HR/addDepartment
          Request type: POST
          Request body: /////////////////////////////////////// 

         8.Functionality:Update a Department. 
           Route: /HR/updateDepartment/:name
           Request type: PUT
           Parameters: name is the name of the Department we are getting its info
           Example of how to call the route: /////////////////////////////    

         9.Functionality:Delete a Department. 
           Route: /HR/deleteDepartment/:name
           Request type: DELETE
           Parameters: name is the name of the Department we are getting its info
           Example of how to call the route: /////////////////////////////  

        10.Functionality:Add a Course. 
           Route:/HR/addCourse
           Request type: POST
           Request body: /////////////////////////////////////// 
           
        11.Functionality:Update a Course. 
           Route:/HR/updateCourse
           Request type: PUT
           Request body: /////////////////////////////////////// 
           
        12.Functionality:Delete a Course. 
           Route:/HR/deleteCourse   
           Request type:DELETE
           Request body: /////////////////////////////////////// 
           
        13.Functionality:HR add Staff Member. 
           Route:/HR/add_Academic_Member
           Request type: POST
           Request body: /////////////////////////////////////// 
           
        14.Functionality:Update existing staff members. 
           Route: /HR/update_academic_members/:id
           Request type: PUT
           Parameters: id is the id of the academic member we are getting its info
           Example of how to call the route: /////////////////////////////    
               
        15.Functionality: Delete existing staff members. 
           Route: /HR/delete_Academic_Member/:id
           Request type: DELETE
           Parameters: id is the id of the academic member we are getting its info
           Example of how to call the route: /////////////////////////////   
           
        16.Functionality:Manually add a missing sign in/sign out record of a staff member. 
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
           
           
           
           
           
           
           
           
      
      
      
      
      
      
      
     
    
      
      
