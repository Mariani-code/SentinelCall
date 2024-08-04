import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MeetingForm.css';

function MeetingForm() {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState('');
  const [showBackButton, setShowBackButton] = useState(false); // State to control button visibility
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:1000/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, time, room, participants })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Meeting created successfully');
        setShowBackButton(true); // Show the back button on success
        // Optionally, reset form fields if needed
        setName('');
        setTime('');
        setRoom('');
        setParticipants([]);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <div className="meeting-form-container">
      <h2>Create a Meeting</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Meeting Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Participants (Separated by Comma)"
          value={participants}
          onChange={(e) => setParticipants(e.target.value.split(','))}
        />
        <button type="submit">Create Meeting</button>
        {message && (
          <>
            <p className={message.startsWith('Error') ? 'error-message' : 'success-message'}>
              {message}
            </p>
            {showBackButton && (
              <button onClick={handleBackToDashboard} className="back-to-dashboard-button">
                Back to Dashboard
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default MeetingForm;
