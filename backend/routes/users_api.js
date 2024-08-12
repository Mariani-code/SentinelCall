const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { User } = require('../user');
    
router.get('/all', usersController.getAllUsers);
router.get('/allWithRole', usersController.getAllUsersAndRole);
router.put('/updatePrivileges', usersController.updateUserPrivileges);
router.delete('/suspendUser', usersController.suspendUser);

module.exports = router;