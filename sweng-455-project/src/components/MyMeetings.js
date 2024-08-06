import React, { useState, useEffect } from 'react';
import './MyMeetings.css';

function MyMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');

  // Function to fetch meetings from the server
  const fetchMeetings = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:1000/meetings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMeetings(data);
      } else {
        setError('Failed to fetch meetings');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Function to add participants
  const addParticipants = async (meetingId, participantsToAdd) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:1000/meetings/${meetingId}`, {
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
      const response = await fetch(`http://localhost:1000/meetings/${meetingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ participantsToAdd: [], participantsToRemove })
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

      setMeetings(updatedMeetings);
    } catch (error) {
      console.error('Error removing participants', error);
      fetchMeetings(); // Revert to the server state on error
    }
  };

  
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
    <div className="meetings-container">
      <h2>My Meetings</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="meetings-list">
        {meetings.length > 0 ? (
          meetings.map(meeting => (
            <div key={meeting.id} className="meeting-card">
              <h3 className="meeting-name">{meeting.name}</h3>
              <p className="meeting-time">{new Date(meeting.time).toLocaleString()}</p>
              <p className="meeting-room">Room {meeting.room}</p>
              {meeting.participants && meeting.participants.length > 0 ? (
                <ul className="participants-list">
                  {meeting.participants.map((participant, index) => (
                    <li key={participant}>{participant}</li>
                  ))}
                </ul>
              ) : (
                <p>No participants</p>
              )}
            <button onClick={() => handleAddParticipants(meeting.id)} className="manage-participants-button add-participants-button">
              Add Participants
            </button>
            <button onClick={() => handleRemoveParticipants(meeting.id)} className="manage-participants-button remove-participants-button">
              Remove Participants
            </button>
            </div>
          ))
        ) : (
          <p>No meetings scheduled.</p>
        )}
      </div>
    </div>
  );
}

export default MyMeetings;
