import React, { useState, useEffect } from 'react';
import './MyMeetings.css';

import { Sidebar } from './Sidebar.js';
import { Navbar } from './Navbar.js';

function MyMeetings() {
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState('');
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [selectedMeetingID, setSelectedMeetingID] = useState('');
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    // Function to fetch meetings from the server
    const fetchMeetings = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:1000/meetings_api/byOwner', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setMeetings(data);
            } else {
                setError('Failed to fetch meetings');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    };

    const fetchParticipants = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:1000/users_api/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Users: ', data);
                var updatedParticipants = removeLoggedInUserFromParticipantList(data);
                console.log('Selected meeting: ',  selectedMeetingID);
                console.log('First pass', updatedParticipants);
                if (selectedMeetingID.length > 0) {
                    updatedParticipants = removeAttendeesFromParticipantList(updatedParticipants);
                }
                setParticipants(updatedParticipants);
            } else {
                console.log('Failed to fetch users');
            }
        } catch (err) {
            console.log('Error: ' + err.message);
        }
    }

    useEffect(() => {
        fetchMeetings();
    }, []);

    const removeLoggedInUserFromParticipantList = (participantList) => {
        var userId;
        if (meetings.length > 0) {
            userId = meetings[0].owner
            return participantList.filter(participant => {
                return participant.id != userId;
            })
        } else {
            return participantList;
        }
    }

    const removeAttendeesFromParticipantList = (data) => {
        console.log("Looking for: " , selectedMeetingID);
        console.log(data);
        var targetMeeting = meetings.filter(meeting => meeting.id == selectedMeetingID);
        // Get participants from current selected meeting
        console.log('Target meeting participants: ', targetMeeting[0].participants)
        if (targetMeeting[0].participants.length > 0) {
            // For each person currently already attachd to the meeting...
            for (var i = 0; i < targetMeeting[0].participants.length; i++) {
                // ...Filter them each one from the data:
                data = data.filter(user => targetMeeting[0].participants[i].id != user.id)
                console.log("Data currently looks like... ", data);
            }
        }
        return data;
    }

    // Function to add participants
    const addParticipants = async (meetingId, participantsToAdd) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:1000/meetings_api/updateParticipants`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ participantsToAdd, participantsToRemove: [] })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }


            const updatedMeetings = meetings.map(meeting => {
                if (meeting.id === meetingId) {
                    const updatedParticipants = meeting.participants
                        .concat(participantsToAdd.filter(p => !meeting.participants.includes(p)));
                    return { ...meeting, participants: updatedParticipants };
                }
                return meeting;
            });

            setMeetings(updatedMeetings);
        } catch (error) {
            console.error('Error adding participants', error);
            fetchMeetings(); // Revert to the server state on error
        }
    };

    // Function to remove participants
    const removeParticipants = async (meetingId, participantsToRemove) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:1000/meetings_api/updateParticipants`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ participantsToAdd: [], participantsToRemove, meetingId })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            const updatedMeetings = meetings.map(meeting => {
                if (meeting.id === meetingId) {
                    const updatedParticipants = meeting.participants
                        .filter(p => !participantsToRemove.includes(p));
                    return { ...meeting, participants: updatedParticipants };
                }
                return meeting;
            });
            fetchMeetings();
            setMeetings(updatedMeetings);
        } catch (error) {
            console.error('Error removing participants', error);
            fetchMeetings(); // Revert to the server state on error
        }
    };

    const handleShowUserSelect = () => {
        // Fetch all users to start.
        setShowUserSearch(true);
    }

    const handleAddParticipants = (meetingId) => {
        const participantsToAddInput = prompt("Enter participants to add, separated by commas");

        if (participantsToAddInput == null) {
            console.log("Participant addition was canceled by the user.");
            return;
        }

        const participantsToAdd = participantsToAddInput.split(",").map(participant => participant.trim());
        if (participantsToAdd.length > 0) {
            addParticipants(meetingId, participantsToAdd);
        }
    };

    const onClickHandler = (e, meetingId) => {
        // console.log('Clicked', e.target);
        e.preventDefault();
        console.log('Selecting',meetingId);
        if (meetingId != selectedMeetingID) {
            setShowUserSearch(false);
        }
        setSelectedParticipants([]);
        setSelectedMeetingID(meetingId);
        fetchParticipants();
    }

    const removeSelectedParticipant = (e, userID, meetingID) => {
        console.log(`Command received to remove ${userID} from ${meetingID}`);
        removeParticipants(meetingID, [userID]);
    }

    const handleRemoveParticipants = (meetingId) => {
        const participantsToRemoveInput = prompt("Enter participants to remove, separated by commas");

        if (participantsToRemoveInput == null) {
            console.log("Participant removal was canceled by the user.");
            return;
        }

        const participantsToRemove = participantsToRemoveInput.split(",").map(participant => participant.trim());
        if (participantsToRemove.length > 0) {
            removeParticipants(meetingId, participantsToRemove);
        }
    };

    return (
        <div className='nav-container'>
            <Navbar />
            <div className='nav-content'>
                <Sidebar />
                <div className="meetings-container">
                    <h2>My Meetings</h2>
                    {error && <p className="error-message">{error}</p>}
                    <div className="meetings-list">
                        {meetings.length > 0 ? (
                            meetings.map(meeting => (
                                <div key={meeting.id} className={`meeting-card${selectedMeetingID == meeting.id ? " highlight" : ""}`} onClick={(e) => onClickHandler(e, meeting.id)}>
                                    <h3 className="meeting-name">{meeting.name}</h3>
                                    <p className="meeting-time">{new Date(meeting.time).toLocaleString()}</p>
                                    <p className="meeting-room">Room - {meeting.room}</p>
                                    {meeting.participants && meeting.participants.length > 0 ? (
                                        <ul className="participants-list">
                                            {meeting.participants.map((participant, index) => (
                                                <div>
                                                <li key={participant.id}>{`${participant.firstName} ${participant.lastName} `}
                                                <button onClick={(e) => removeSelectedParticipant(e, participant.id, selectedMeetingID)}>  🗑️ </button>
                                                </li>
                                                </div>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No participants</p>
                                    )}
                                    {selectedMeetingID == meeting.id ? (
                                        <>
                                        <button onClick={() => handleShowUserSelect()} className="manage-participants-button add-participants-button">
                                            Search Participants
                                        </button>
                                        {/* <button onClick={() => handleRemoveParticipants(meeting.id)} className="manage-participants-button remove-participants-button">
                                            Remove Participants
                                        </button> */}
                                        </>
                                    )
                                    :
                                    (
                                        <></>
                                    )
                                    }
                                    {showUserSearch && selectedMeetingID == meeting.id ? (
                                    <p>
                                    <select 
                                        name="participantselect" 
                                        multiple
                                        onChange={e => {
                                            const options = [...e.target.selectedOptions];
                                            const values = options.map(option => option.value);
                                            setSelectedParticipants(values);
                                        }}
                                    >
                                    { participants.length > 0 ? participants.map(user => {
                                            return (
                                                <option key={user.id} value={user.id} >
                                                    {user.firstName} {user.lastName} ({user.email})
                                                </option>
                                            )
                                        })
                                        :
                                        (
                                            <option>No Users Found</option>
                                        )}
                                    </select>
                                    </p>
                                    )
                                    :
                                    (
                                        <></>
                                    )
                                    }
                                    {selectedParticipants.length > 0 ? (
                                        <button onClick={() => handleShowUserSelect()} className="manage-participants-button add-participants-button">
                                            Add Participants
                                        </button>
                                    )
                                    :
                                    (
                                        <></>
                                    )
                                    }
                                </div>
                            ))
                        ) : (
                            <p>No meetings available.</p>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyMeetings;
