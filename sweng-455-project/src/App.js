import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MyMeetings from './components/MyMeetings';
import Rooms from './components/Rooms';
import Complaints from './components/Complaints';
import MeetingForm from './components/MeetingForm'; // Import new component
import Profile from './components/Profile';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/meetings" element={<MyMeetings />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/create-meeting" element={<MeetingForm />} /> {/* Add route */}
                    <Route path="/" element={<Login />} />
                    <Route path="/profile" element={<Profile /> } />
                      <Route path="/complaints" element={<Complaints />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
