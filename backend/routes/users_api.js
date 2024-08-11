const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { User } = require('../user');
    
router.get('/all', usersController.getAllUsers);

module.exports = router;