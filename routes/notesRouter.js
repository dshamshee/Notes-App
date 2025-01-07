const express = require('express');
const router = express.Router(); 
const notesModel = require('../models/notes')
const userModel = require('../models/user');


router.post('/create', function(resq, res){
    res.send("create notes route")
})