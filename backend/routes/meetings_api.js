const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingsController');

/*
Get all meetings by...
- time slot (1 hour intervals, 9AM - 5PM EST)
- day
- week
- room
- participant (single)
- all 
*/

router.get('/atTime', meetingController.getMeetingAtTime);
router.get('/onDay', meetingController.getMeetingsOnDay);
router.get('/byWeek', meetingController.getMeetingsByWeek);
router.get('/byRoom', meetingController.getMeetingsByRoom);
router.get('/byParticipant', meetingController.getMeetingsByParticipant);
router.get('/byOwner', meetingController.getMeetingsByOwner);
router.get('/all', meetingController.getAllMeetings);
router.post('/create', meetingController.createMeeting);

router.put('/updateParticipants', meetingController.updateParticipants);

module.exports = router;