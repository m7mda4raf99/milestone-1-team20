const express = require('express')
const course_model = require('../models/Faculty')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


//routes
router.route('/')
.get(async (req,res) => {
    return "Hello Ashraf"
})
router.route('/course')
.post(async (req,res) => {
    const course = new course_model({
        // departmentName: req.body.departmentName,
        // facultyName: req.body.facultyName,
        // id : req.body.id,
        // email: req.body.email,
        // password: req.body.password,
        // salary: req.body.salary,
        // faculty: req.body.faculty,
        //  department : req.body.department,
        //  number_of_slots: req.body.number_of_slots
        //course_coverage: req.body.course_coverage

        name: req.body.name,
        department: req.body.department
    })

    await course.save();
    res.send(course)
})

module.exports = router