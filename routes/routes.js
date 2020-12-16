const express = require('express')
//const slot_model = require('../models/Slot')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


//routes
router.route('/slot')
.post(async (req,res) => {
    const slot = new slot_model({
     
    })

    await slot.save();
    res.send(slot)
})

module.exports = router