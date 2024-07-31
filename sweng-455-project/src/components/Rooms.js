import React, { useState, useEffect } from 'react';
import './Rooms.css';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    // Fetch the list of rooms
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

    fetchRooms();
  }, []);

  return (
    <div className="rooms-container">
      <h2>Meeting Rooms</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="rooms-list">
        {rooms.length > 0 ? (
          rooms.map(room => (
            <div
              key={room.id}
              className={`room-card ${selectedRoom === room.id ? 'selected' : ''}`}
              onClick={() => setSelectedRoom(room.id)}
            >
              <h3 className="room-number">Room {room.number}</h3>
              <p className="room-description">{room.description}</p>
              <p className="room-capacity">Capacity: {room.capacity}</p>
            </div>
          ))
        ) : (
          <p>No rooms available.</p>
        )}
      </div>
      {selectedRoom && (
        <div className="room-details">
          <h3>Room Details</h3>
          {/* Fetch and display room details if necessary */}
        </div>
      )}
    </div>
  );
}

export default Rooms;
