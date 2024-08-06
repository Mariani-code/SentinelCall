import React, { useState, useEffect } from 'react';
import './MyMeetings.css';

import { Sidebar } from './Sidebar.js';
import { Navbar } from './Navbar.js';

function MyMeetings() {
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
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

        fetchMeetings();
    }, []);

    return (
        <div className='main-container'>
            <Navbar />
            <Sidebar />
            <div className="meetings-container">
                <h2>My Meetings</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="meetings-list">
                    {meetings.length > 0 ? (
                        meetings.map(meeting => (
                            <div key={meeting.id} className="meeting-card">
                                <h3 className="meeting-name">{meeting.name}</h3>
                                <p className="meeting-time">
                                    {new Date(meeting.time).toLocaleString()}
                                </p>
                                <p className="meeting-room">Room {meeting.room}</p>
                            </div>
                        ))
                    ) : (
                        <p>No meetings scheduled.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyMeetings;
