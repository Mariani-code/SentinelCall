import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './MeetingForm.css';

import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

function MeetingForm() {
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [room, setRoom] = useState('');
    const [participants, setParticipants] = useState([]);
    const [message, setMessage] = useState('');
    const [showBackButton, setShowBackButton] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdateMode = id !== undefined;

    useEffect(() => {
        if (isUpdateMode) {
            fetch(`http://localhost:1000/meetings/${id}`)
                .then(res => res.json())
                .then(data => {
                    setName(data.name);
                    setTime(data.time);
                    setRoom(data.room);
                    setParticipants(data.participants.join(','));
                })
                .catch(err => setMessage('Error: ' + err.message));
        }
    }, [id, isUpdateMode]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const payload = JSON.stringify({ name, time, room, participants: participants.split(',') });
        const method = isUpdateMode ? 'PUT' : 'POST';
        const endpoint = `http://localhost:1000/meetings${isUpdateMode ? `/${id}` : ''}`;

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: payload
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(isUpdateMode ? 'Meeting updated successfully' : 'Meeting created successfully');
                setShowBackButton(true);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="dashboard-content">
                <Sidebar />
                <div className="meeting-form-container">
                    <h2>{isUpdateMode ? 'Edit Meeting' : 'Create a Meeting'}</h2>
                    <form onSubmit={handleFormSubmit}>
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
                            onChange={(e) => setParticipants(e.target.value)}
                        />
                        <button type="submit">{isUpdateMode ? 'Update Meeting' : 'Create Meeting'}</button>
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
            </div>
        </div>
    );
}

export default MeetingForm;
