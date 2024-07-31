import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MyMeetings from './components/MyMeetings';
import MeetingsByRoom from './components/Rooms';
import Rooms from './components/Rooms'; 

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meetings" element={<MyMeetings />} />
          <Route path="/rooms" element={<Rooms />} /> {/* Add route */}
          <Route path="/rooms/:roomId/meetings" element={<MeetingsByRoom />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
