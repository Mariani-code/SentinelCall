import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './MeetingForm.css';

import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

function MeetingForm() {
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [message, setMessage] = useState('');
    const [showBackButton, setShowBackButton] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdateMode = id !== undefined;

    const fetchRooms = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:1000/rooms', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
                console.log('Rooms: ', data);
            } else {
                console.log('Failed to fetch rooms');
            }
        } catch (err) {
            console.log('Error: ' + err.message);
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
                setParticipants(data);
            } else {
                console.log('Failed to fetch users');
            }
        } catch (err) {
            console.log('Error: ' + err.message);
        }
    }


    useEffect(() => {
        fetchRooms();
        fetchParticipants();
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
        const token = localStorage.getItem('token');
        event.preventDefault();
        console.log(event);
        const payload = JSON.stringify({ name, time, room, participants: selectedParticipants});
        const method = isUpdateMode ? 'PUT' : 'POST';
        const endpoint = `http://localhost:1000/meetings_api/create${isUpdateMode ? `/${id}` : ''}`;

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
                            step="3600"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                        <label>
                            Select a Room
                        <select 
                            name="RoomSelect"
                            onChange={e => setRoom(e.target.value)}
                        >
                            <option value="">----</option>
                            { rooms.length > 0 ? rooms.map(room => {
                                return (
                                    <option value={room.id}>
                                        {room.number} - {room.description} ({room.capacity})
                                    </option>
                                )
                            })
                            :
                            (
                                <option>No Rooms Available</option>
                            )}
                        </select>
                        </label>
                        <label>
                            Participants
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
                                        <option value={user.id}>
                                            {user.firstName} {user.lastName} ({user.email})
                                        </option>
                                    )
                                })
                                :
                                (
                                    <option>No Users Found</option>
                                )}
                        </select>
                        </label>
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
