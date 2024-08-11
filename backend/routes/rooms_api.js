const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');



router.post('/create', roomsController.createRoom);
router.get('/all', roomsController.getAllRooms);
router.get('/forTime', roomsController.getRoomsForTime);

module.exports = router;