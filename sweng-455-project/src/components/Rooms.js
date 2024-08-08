import React, { useState, useEffect } from 'react';
import './Rooms.css';

import './Navbar.css';
import './Sidebar.css';

import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

function Rooms() {
  
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({ number: '', description: '', capacity: '' });

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:1000/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        setError('Failed to fetch rooms');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1000/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRoom)
      });
      if (response.ok) {
        fetchRooms();
        setNewRoom({ number: '', description: '', capacity: '' });
      } else {
        setError('Failed to add room');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="main-container">
            <Navbar />
            <Sidebar />
    <div className="rooms-container">
      <h2>Meeting Rooms</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="rooms-list">
        {rooms.length > 0 ? (
          rooms.map(room => (
            <div
              key={room.id}
              className={`room-card ${selectedRoom === room.id ? 'selected' : ''}`}
              onClick={() => setSelectedRoom(room.id)}>
              <h3 className="room-number">Room {room.number}</h3>
              <p className="room-description">{room.description}</p>
              <p className="room-capacity">Capacity: {room.capacity}</p>
              <p className="room-meetings">
                Meetings:
                {room.meetings.length > 0 ? (
                  <ul>
                    {room.meetings.map(meeting => (
                      <li key={meeting.id}>{meeting.name} at {new Date(meeting.time).toLocaleString()}</li>
                    ))}
                  </ul>
                ) : (
                  <span> No meetings scheduled.</span>
                )}
              </p>
            </div>
        </div>
      )}
      <div className="add-room">
        <h3>Add a New Room</h3>
        <form onSubmit={handleAddRoom}>
          <input
            type="text"
            placeholder="Room Number"
            value={newRoom.number}
            onChange={e => setNewRoom({ ...newRoom, number: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newRoom.description}
            onChange={e => setNewRoom({ ...newRoom, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newRoom.capacity}
            onChange={e => setNewRoom({ ...newRoom, capacity: e.target.value })}
            required
          />
          <button type="submit">Add Room</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Rooms;
